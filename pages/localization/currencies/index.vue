<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5 class="float-left">{{ $t('pages.currency.title')}}</h5>
      <div class="clearfix"></div>
    </div>

    <a-drawer
      :closable="true"
      :title="visibleCurrencyModal.title"
      :visible="visibleCurrencyModal.show"
      @close="visibleCurrencyModal.show = false"
      placement="right"
      width="425"
    >
      <ValidationObserver ref="observer" v-slot="{ passes }">
        <a-form>
          <a-divider>{{ $t('pages.information') }}</a-divider>

          <a-form-item :label="$t('pages.currency.cols.name')" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
            <a-input v-model="currencyForm.name" />
          </a-form-item>

          <a-form-item :label="$t('pages.currency.cols.commission')" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
            <a-input-number v-model="currencyForm.commission"/>
          </a-form-item>

          <a-form-item :label="$t('pages.currency.cols.status')" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
            <a-radio-group buttonStyle="solid" v-model="currencyForm.status">
              <a-radio-button :value="1">{{$t('common.active')}}</a-radio-button>
              <a-radio-button :value="0">{{$t('common.passive')}}</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-form>
        <div class="drawer-bottom">
          <a-button @click="visibleCurrencyModal.show = false" class="mr-2">{{$t('btn.cancel')}}</a-button>
          <a-button :loading="visibleCurrencyModal.loading" @click="passes(updateCurrency)" class="w-50" type="primary">
            <i class="la la-save mr-2"></i>
            {{$t('btn.save')}}
          </a-button>
        </div>
      </ValidationObserver>
    </a-drawer>

    <vi-table
      rowKey="id"
      :pageTitle="$t('pages.currency.sub_title')"
      :actions="actions"
      :columns="columns"
      :loading="table.loading"
      :pagination="table.pagination"
      :dataSource="table.data"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: handleTableSelectChange}"
      :selectedRowKeys="selectedRowKeys"
      @onAction="handleClickAction"
      @change="handleTableChange"
    >
      <span slot="status" slot-scope="record">
        <a-badge
          :count="record.value == 1 ? $t('pages.active') : $t('pages.passive')"
          :numberStyle="{backgroundColor: record.value == 1 ? '#46be8a' : '#fb434a'}"
        />
      </span>
      <span slot="updated_at" slot-scope="record">
        <span>{{$moment(record.value).format('DD.MM.YYYY - HH:mm:ss')}}</span>
      </span>
       <span slot="is_default" slot-scope="record">
        <a-badge
          :count="record.value == 1 ? $t('pages.active') : $t('pages.passive')"
          :numberStyle="{backgroundColor: record.value == 1 ? '#46be8a' : '#fb434a'}"
        />
      </span>
      <span slot="action" slot-scope="record">
        <a-button @click="editCurrency(record)" class="mr-1" size="small" type="primary">
          <i class="la la-edit text-white"></i>
        </a-button>
      </span>
    </vi-table>
  </div>
</template>

<script>
import ViTable from "@/components/vi-table";

export default {
  components: {
    "vi-table": ViTable
  },
  data() {
    return {
      currencyForm :{},
      visibleCurrencyModal: {show: false, title: this.$t('pages.currency.title'), loading: false},
      selectedRowKeys: [],
      actions: [
        {
          name: "refresh",
          icon: "sync",
          label: "btn.refresh"
        }
      ],

      columns: [
        {
          title: this.$t("pages.currency.cols.code"),
          dataIndex: "code",
          width: 100
        },
        {
          title: this.$t("pages.currency.cols.name"),
          dataIndex: "title"
        },
        {
          title: this.$t("pages.currency.cols.rate"),
          dataIndex: "rate"
        },
       
        {
          title: this.$t("pages.currency.cols.updated_at"),
          dataIndex: "updated_at",
          scopedSlots: { customRender: "updated_at" },
          width: 200
        },
        {
          title: this.$t("pages.currency.cols.is_default"),
          dataIndex: "is_default",
          scopedSlots: { customRender: "is_default" },
          width: 100
        },
        {
          title: this.$t("pages.currency.cols.status"),
          dataIndex: "is_active",
          scopedSlots: { customRender: "status" },
          width: 100
        },
        {
          title: this.$t("btn.action"),
          key: "action",
          // width: 100,
          scopedSlots: { customRender: "action" },
          width: 150
        }
      ]
    };
  },
  mounted() {
    this.$store.dispatch("localization/currencies/get", { page: 1 });
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        onChange: (selectedRowKeys, selectedRows) => {},
        getCheckboxProps: record => ({
          props: {
            disabled: false,
            name: record.name
          }
        })
      };
    },
    drawerTitle() {
      return this.editForm.type === "create"
        ? this.$t("btn.create")
        : this.$t("btn.edit");
    },
    table() {
      return this.$store.state.localization.currencies.table;
    }
  },

  methods: {
    handleTableSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleTableChange(pagination, filters, sorter) {
      this.$store.dispatch("localization/currencies/get", {
        page: pagination
      });
    },
    handleClickAction(name) {
      switch (name) {
        case "refresh":
          this.$store.dispatch("localization/currencies/refresh");
          break;

        case "new":
          break;

        case "delete":
          this.$store.dispatch('localization/currencies/delete', {
            id: this.selectedRowKeys.flat(),
          })
          break;

        default:
          break;
      }
    },
    deleteRecord(id) {
      this.$store.dispatch('localization/currencies/delete', {
        id: [id],
      })
    },
    updateCurrency(){
      this.visibleCurrencyModal.loading = true;
      this.$axios
        .put("/sys/currency/" + this.currencyForm.id, this.currencyForm)
        .then(response => {
          this.onResponse(response);
        })
        .catch(error => {
          this.onFailure(error.response);
        });
    },
    editCurrency(currency){
      return;
      this.currencyForm = _.cloneDeep(currency);
      this.visibleCurrencyModal.show = true;
    },
    onResponse(response) {
      var result = response.data.data;
      if (!response.data.status) {
        return this.onFailure(response);
      }

      this.$store.dispatch("localization/currencies/get", { page: 1 });
      this.$notification["success"]({
        message: this.$t("messages.success"),
        description: this.$t("messages.action_ok"),
        placement: "bottomRight "
      });

      this.visibleCurrencyModal.show = false;
      this.visibleCurrencyModal.loading = false;
    },
    onFailure(response) {
      this.$notification["error"]({
        message: this.$t("messages.warning"),
        description: response.data.message,
        placement: "bottomRight "
      });
      this.visibleCurrencyModal.loading = false;
    },
  }
};
</script>
