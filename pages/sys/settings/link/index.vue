<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5 class="float-left">{{ $t("pages.link.title") }}</h5>
    </div>

    <vi-table
      :actions="actions"
      :columns="columns"
      :dataSource="table.data"
      :loading="table.loading"
      :pageTitle="$t('pages.link.title')"
      :pagination="table.pagination"
      :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: handleTableSelectChange,
      }"
      :selectedRowKeys="selectedRowKeys"
      @change="handleTableChange"
      @onAction="handleClickAction"
      rowKey="id"
      showLinkFilter
      @filteredData="handleFilter"
    >
      <span slot="active" slot-scope="record">
        <a-badge
          :count="record.value == 1 ? $t('pages.active') : $t('pages.passive')"
          :numberStyle="{
            backgroundColor: record.value == 1 ? '#46be8a' : '#fb434a',
          }"
        />
      </span>
      <span slot="language" slot-scope="record">
        <i class="flag-icon" v-bind:class="'flag-icon-' + record.value"></i>
      </span>
       <span slot="description" slot-scope="record">
        {{ record.value.substr(0,100)}}
      </span>
      <span slot="created_at" slot-scope="record">
        <span>{{ $moment(record.value).format("DD.MM.YYYY - HH:mm:ss") }}</span>
      </span>
      <span slot="action" slot-scope="record">
        <div class="text-right">
          <a-button
            @click="fetch(record)"
            class="mr-1"
            size="small"
            type="primary"
          >
            <i class="la la-edit text-white"></i>
          </a-button>
        </div>
      </span>
    </vi-table>
    <a-drawer
      :closable="true"
      :title="title"
      :visible="visible"
      @close="onClose"
      placement="right"
      width="425"
    >
      <ValidationObserver ref="observer" v-slot="{ passes }">
        <a-form>
          <a-divider class="mt-5">{{
            $t("pages.contents.save.seoSettings")
          }}</a-divider>
          <a-form-item
            :label="$t('pages.contents.save.seoURL')"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 17 }"
          >
            <input class="ant-input" v-model="form.value" readonly />
          </a-form-item>
          <ValidationProvider name="name" rules="required" v-slot="slotProps">
            <a-form-item
              :help="slotProps.errors[0]"
              :label="$t('pages.contents.save.seoTitle')"
              :label-col="{ span: 7 }"
              :validateStatus="resolveState(slotProps)"
              :wrapper-col="{ span: 17 }"
            >
              <input class="ant-input" v-model="form.title" />
            </a-form-item>
          </ValidationProvider>
          <a-form-item
            :label="$t('pages.contents.save.seoDesc')"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 17 }"
          >
            <textarea class="ant-input" v-model="form.description"></textarea>
          </a-form-item>
          <a-form-item
            :label="$t('pages.contents.save.seoTag')"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 17 }"
          >
            <textarea class="ant-input" v-model="form.keywords"></textarea>
          </a-form-item>
          <a-form-item
            :label="'Open Graph'"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 17 }"
          >
            <a-switch
              :checkedChildren="$t('common.active')"
              :unCheckedChildren="$t('common.passive')"
              defaultChecked
              :disabled="true"
              style="margin-bottom: 5px"
            />
          </a-form-item>
        </a-form>
        <div class="drawer-bottom">
          <a-button @click="onClose" class="mr-2">{{
            $t("btn.cancel")
          }}</a-button>
          <a-button
            :loading="loading"
            @click="passes(onSubmit)"
            class="w-50"
            type="primary"
          >
            <i class="la la-save mr-2"></i>
            {{ $t("btn.save") }}
          </a-button>
        </div>
      </ValidationObserver>
    </a-drawer>
    <a-drawer
      :closable="true"
      title="Add 301 Redirect"
      :visible="visible301"
      @close="onClose"
      placement="right"
      width="500"
    >
      <ValidationObserver ref="observer2" v-slot="{ passes }">
        <a-form>
          <a-form-item
            :label="$t('pages.contents.save.seoURL') + ' (Eski)'"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 17 }"
          >
            <input class="ant-input" v-model="redirect_form.value" />
          </a-form-item>
          <ValidationProvider name="name" rules="required" v-slot="slotProps">
            <a-form-item
              :help="slotProps.errors[0]"
              :label="$t('pages.contents.save.seoURL') + ' (Yeni)'"
              :label-col="{ span: 7 }"
              :validateStatus="resolveState(slotProps)"
              :wrapper-col="{ span: 17 }"
            >
              <input class="ant-input" v-model="redirect_form.redirect_value" />
            </a-form-item>
          </ValidationProvider>
        </a-form>
        <div class="drawer-bottom">
          <a-button @click="onClose" class="mr-2">{{
            $t("btn.cancel")
          }}</a-button>
          <a-button
            :loading="loading"
            @click="passes(onSubmit301)"
            class="w-50"
            type="primary"
          >
            <i class="la la-save mr-2"></i>
            {{ $t("btn.save") }}
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
    "vi-table": ViTable,
  },
  data() {
    return {
      selectedRowKeys: [],
      loading: false,
      visible: false,
      visible301: false,
      redirect_form: {},
      title: "",
      form: {},
      actions: [
        {
          name: "plus",
          icon: "plus",
          label: "btn.add301"
        },
        {
          name: "refresh",
          icon: "sync",
          label: "btn.refresh",
        },
        {
          name: "linkfilter",
          icon: "filter",
          label: "btn.filter",
        },
      ],

      columns: [
        {
          title: this.$t("pages.link.cols.title"),
          dataIndex: "title",
        },
        {
          title: this.$t("pages.link.cols.title"),
          dataIndex: "description",
          scopedSlots: { customRender: "description" },

        },
        {
          title: this.$t("pages.link.cols.link"),
          dataIndex: "value",
        },
        {
          title: this.$t("pages.link.cols.type"),
          dataIndex: "type",
          width: 200,
        },
        {
          title: this.$t("pages.link.cols.language"),
          dataIndex: "language",
          scopedSlots: { customRender: "language" },
          width: 100,
        },

        {
          title: this.$t("general.created_at"),
          dataIndex: "created_at",
          scopedSlots: { customRender: "created_at" },
          width: 200,
        },
        {
          title: this.$t("btn.action"),
          key: "action",
          scopedSlots: { customRender: "action" },
          width: 150,
          class: "text-right",
        },
      ],
    };
  },
  mounted() {
    this.$store.dispatch("sys/link/get", { page: 1 });
    this.resetData();
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        onChange: (selectedRowKeys, selectedRows) => {},
        getCheckboxProps: (record) => ({
          props: {
            disabled: false,
            name: record.name,
          },
        }),
      };
    },

    table() {
      return this.$store.state.sys.link.table;
    },
  },

  methods: {
    handleTableSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleTableChange(pagination, filters, sorter, filtered, data) {
      if (filtered) {
        this.$store.dispatch("sys/link/getFilteredData", {
          searchData: data,
          page: pagination,
        });
      } else {
        this.$store.dispatch("sys/link/get", {
          page: pagination,
        });
      }
    },
    handleClickAction(name) {
      switch (name) {
        case "refresh":
          this.$store.dispatch("sys/link/refresh");
          break;
        case "plus":
          this.resetRedirectData();
          this.visible301 = true;
          break;
        default:
          break;
      }
    },
    deleteRecord(id) {
      this.$store.dispatch("sys/link/delete", {
        id: [id],
      });
    },
    onClose() {
      this.visible = false;
            this.visible301 = false;

    },

    fetch(record) {
      return this.$axios.get("/sys/link/" + record.id).then((response) => {
        this.data = response.data.data;
        this.form.id = this.data.id;
        this.form.title = this.data.title;
        this.form.description = this.data.description;
        this.form.keywords = this.data.keywords;
        this.form.value = this.data.value;
        this.visible = true;
      });
    },

    resetData() {
      this.form = {
        id: 0,
        title: "",
        description: "",
        keywords: "",
        value: "",
      };
    },

    resetRedirectData() {
      this.redirect_form = {
        value: "",
        redirect_value: "",
      };
    },

    resolveState({ errors, pending, valid }) {
      if (errors[0]) {
        return "error";
      }
      return "";
    },

    onSubmit() {
      this.loading = true;

      if (this.form.id) {
        this.$axios
          .put("/sys/link/" + this.form.id, this.form)
          .then((response) => {
            this.onResponse(response);
          })
          .catch((error) => {
            this.onFailure(error.response);
          });
      }
    },
    onSubmit301() {
      this.loading = true;

      this.$axios
        .put("/sys/link/add-redirect", this.redirect_form)
        .then((response) => {
          this.onResponse(response);
          this.visible301 = false;
        })
        .catch((error) => {
          this.onFailure(error.response);
          this.visible301 = false;
        });
    },

    onResponse(response) {
      var result = response.data.data;
      if (!response.data.status) {
        return this.onFailure(response);
      }

      this.$notification["success"]({
        message: this.$t("messages.success"),
        description: this.$t("messages.action_ok"),
        placement: "bottomRight ",
      });

      this.visible = false;
      this.loading = false;
      this.$store.dispatch("sys/link/refresh");
    },

    onFailure(response) {
      this.$notification["error"]({
        message: this.$t("messages.warning"),
        description: response.data.message,
        placement: "bottomRight ",
      });
      this.loading = false;
    },
    handleFilter(data){
      console.log(data);
    }
  },
};
</script>
