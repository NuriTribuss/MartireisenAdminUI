<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5 class="float-left">{{ $t('pages.payments.title')}}</h5>
      <div class="clearfix"></div>
    </div>
    <vi-table
      :actions="actions"
      :columns="columns"
      :dataSource="table.data"
      :loading="table.loading"
      :pageTitle="$t('pages.payments.sub_title')"
      :pagination="table.pagination"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: handleTableSelectChange}"
      :selectedRowKeys="selectedRowKeys"
      @change="handleTableChange"
      @onAction="handleClickAction"
      rowKey="id"
    >
      <span slot="is_online" slot-scope="record">
        <a-badge
          :count="record.value == 1 ? $t('pages.active') : $t('pages.passive')"
          :numberStyle="{backgroundColor: record.value == 1 ? '#46be8a' : '#fb434a'}"
        />
      </span>

      
      <span slot="is_active" slot-scope="record">
        <a-badge
          :count="record.value == 1 ? $t('pages.active') : $t('pages.passive')"
          :numberStyle="{backgroundColor: record.value == 1 ? '#46be8a' : '#fb434a'}"
        />
      </span>

      <span slot="action" slot-scope="record">
        <a-button @click="getData(record.id)" class="mr-1" size="small" type="primary">
          <i class="fe fe-edit text-white"></i>
        </a-button>
      </span>
    </vi-table>
    <a-drawer
      :closable="false"
      :title="form.name"
      :visible="visible"
      @close="onClose"
      placement="right"
      width="600"
    >
      <ValidationObserver ref="observer" v-slot="{ passes }">
        <a-select @change="loadData" class="mr-2 w-100" v-if="visibleLanguages" v-model="language">
          <a-select-option :value="item.code" v-bind:key="index" v-for="(item,index) in languages.data">
            <i :class="'flag-icon-'+item.code" class="flag-icon"></i>
            {{item.name}}
          </a-select-option>
        </a-select>
        <a-form>
          <a-divider>{{ $t('pages.information') }}</a-divider>
          <ValidationProvider name="name" rules="required" v-slot="slotProps">
            <a-form-item
              :help="slotProps.errors[0]"
              :label="$t('pages.payments.cols.title')"
              :label-col="{ span: 7 }"
              :validateStatus="resolveState(slotProps)"
              :wrapper-col="{ span: 17 }"
            >
              <a-input class="ant-input" v-model="form.title" />
            </a-form-item>
          </ValidationProvider>

          <ValidationProvider name="description" rules="required" v-slot="slotProps">
            <a-form-item
              :help="slotProps.errors[0]"
              :label="$t('pages.payments.cols.description')"
              :label-col="{ span: 7 }"
              :validateStatus="resolveState(slotProps)"
              :wrapper-col="{ span: 17 }"
            >
              <a-textarea
                :autosize="{ minRows: 3, maxRows: 6 }"
                class="ant-input"
                v-model="form.description"
              />
            </a-form-item>
          </ValidationProvider>
          <a-form-item 
        
          <a-form-item v-if="!isTranslate"
            :label="$t('pages.payments.cols.sort_number')"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 17 }"
          >
            <a-input-number :min="1" v-model="form.sort_number" />
          </a-form-item>
        
          <a-form-item v-if="!isTranslate"
            :label="$t('pages.payments.cols.is_active')"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 17 }"
          >
            <a-radio-group buttonStyle="solid" v-model="form.is_active">
              <a-radio-button :value="1">{{$t('common.active')}}</a-radio-button>
              <a-radio-button :value="0">{{$t('common.passive')}}</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <div v-if="!isTranslate">
            <a-divider>Credentials</a-divider>
            <a-form-item 
              :key="key"
              :label="key"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 17 }"
              v-for="(credential, key)  in form.credential"
            >
              <a-input v-model="form.credential[key]"></a-input>
            </a-form-item>
          </div>
        </a-form>
        <div class="drawer-bottom">
          <a-button @click="onClose" class="mr-2">{{$t('btn.cancel')}}</a-button>
          <a-button :loading="loading" @click="passes(onSubmit)" class="w-50" type="primary">
            <i class="fe fe-save mr-2"></i>
            {{$t('btn.save')}}
          </a-button>
        </div>
      </ValidationObserver>
    </a-drawer>
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
          title: this.$t("pages.payments.cols.title"),
          dataIndex: "translate.title"
        },
       

        {
          title: this.$t("pages.payments.cols.is_online"),
          dataIndex: "is_online",
          scopedSlots: { customRender: "is_online" },
          width: 100
        },
        {
          title: this.$t("pages.payments.cols.is_active"),
          dataIndex: "is_active",
          scopedSlots: { customRender: "is_active" },
          width: 100
        },

        {
          title: this.$t("btn.action"),
          key: "action",
          scopedSlots: { customRender: "action" },
          width: 150
        }
      ],
      visible: false,
      visibleLanguages: true,
      language: '',
      default_language: '',
      isTranslate : false,
      loading: false,
      form: {
          title: null,
          description: null,
          sort_number: 0,
          is_active: 1,
          credential : []

      },
    };
  },
  mounted() {
    this.$store.dispatch("payments/get", { page: 1 });
    this.$store.dispatch("localization/languages/get", {page: 1});

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
      return this.$store.state.payments.table;
    },
    languages() {
      return this.$store.state.localization.languages.table
    },
  },

  methods: {
    handleTableSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleTableChange(pagination, filters, sorter) {
      this.$store.dispatch("payments/get", {
        page: pagination
      });
    },
    handleClickAction(name) {
      switch (name) {
        case "refresh":
          this.$store.dispatch("payments/refresh");
          break;

        case "new":
          break;

        default:
          break;
      }
    },
    deleteRecord(id) {
      this.$store.dispatch("payments/delete", {
        id: [id]
      });
    },

    resolveState({ errors, pending, valid }) {
      if (errors[0]) {
        return "error";
      }
      return "";
    },

    getData(id) {

      this.language = '';
      this.visible = true;

      this.$axios
        .get(`/payment/${id}`)
        .then(response => {

            this.data = response.data.data;

            this.form.sort_number      = this.data.sort_number;
            this.form.is_active        = this.data.is_active;
            this.form.credential       = this.data.credential;
            this.form.id               = this.data.id;

            this.setLanguageData()
            this.default_language = this.language;

            
      });
    },

    setLanguageData() {

      var translate = this.resolveTranslate(this.data)

      
      if(translate.default != 1){
        this.isTranslate = true;
      }else{
        this.isTranslate = false;
      }

      this.language         = translate.language;
      this.form.title       = translate.title;
      this.form.description = translate.description;
      this.form.language    = translate.language;

    },

    loadData() {
      this.setLanguageData();
    },

    resolveTranslate(data) {
      for (let index = 0; index < data.translate.length; ++index) {
        let value = data.translate[index];
        if (value.default == 1 && this.language == '') {
          return value;
        }

        if (this.language == value.language) {
          return value;
        }
      }
      return null;
    },

    onClose() {
      this.visible = false;
      this.form = {};
    },
    onSubmit() {
      this.loading = true;
     
      let extra = this.language != this.default_language ? '/translate' : '';

      this.$axios
        .put(`/payment/${this.form.id}`+extra, this.form)
        .then(res => {
          this.onResponse(res);
          this.$store.dispatch("payments/get", { page: 1 });
        })
        .catch(error => {
          this.onFailure(error.response);
        });
    },
    onResponse(response) {
      let result = response.data.data;
      if (!response.data.status) {
        return this.onFailure(response);
      }

      this.$notification["success"]({
        message: this.$t("messages.success"),
        description: this.$t("messages.action_ok"),
        placement: "bottomRight "
      });
      this.visible = false;
      this.loading = false;
    },

    onFailure(response) {
      this.$notification["error"]({
        message: this.$t("messages.warning"),
        description: response.data.message,
        placement: "bottomRight "
      });
      this.loading = false;
    }
  }
};
</script>
