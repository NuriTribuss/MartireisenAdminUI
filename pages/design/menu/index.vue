<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>{{ $t('pages.menu.title')}}</h5>
    </div>

    <vi-table
      :actions="actions"
      :columns="columns"
      :dataSource="table.data"
      :loading="table.loading"
      :pageTitle="$t('pages.menu.sub_title')"
      :pagination="table.pagination"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: handleTableSelectChange}"
      :selectedRowKeys="selectedRowKeys"
      @change="handleTableChange"
      @onAction="handleClickAction"
      rowKey="id"
    >
      <span slot="active" slot-scope="record">
        <a-badge
          :count="record.value == 1 ? $t('pages.active') : $t('pages.passive')"
          :numberStyle="{backgroundColor: record.value == 1 ? '#46be8a' : '#fb434a'}"
        />
      </span>

      <span slot="created_at" slot-scope="record">
        <span>{{$moment(record.value).format('DD.MM.YYYY - HH:mm:ss')}}</span>
      </span>

      <span slot="action" slot-scope="record">
        <nuxt-link :to="'/design/menu/'+record.id+'/categories'">
          <a-button class="mr-1" size="small" type="primary">
            <i class="fe fe-list"></i>
          </a-button>
        </nuxt-link>
        <a-button type="primary" size="small" class="mr-1" v-on:click="fetch(record)">
          <i class="fe fe-edit text-white"></i>
        </a-button>

        <a-popconfirm :title="$t('messages.sure_delete')" @confirm="deleteRecord(record.id)">
          <a-button class="mr-2" size="small" type="danger">
            <a-icon type="delete" />
          </a-button>
        </a-popconfirm>
      </span>
    </vi-table>
    <a-drawer
      :title="title"
      placement="right"
      :closable="true"
      @close="onClose"
      :visible="visible"
      width="425"
    >
      <ValidationObserver ref="observer" v-slot="{ passes }">
        <a-select v-if="visibleLanguages" v-model="language" @change="loadData" class="mr-2 w-100">
          <a-select-option
            :value="item.code"
            v-bind:key="index"
            v-for="(item,index) in languages.data"
          >
            <i class="flag-icon" :class="'flag-icon-'+item.code"></i>
            {{item.name}}
          </a-select-option>
        </a-select>
        <a-form>
          <a-divider>{{ $t('pages.information') }}</a-divider>
          <ValidationProvider name="name" rules="required" v-slot="slotProps">
            <a-form-item
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 17 }"
              :label="$t('pages.menu.cols.name')"
              :validateStatus="resolveState(slotProps)"
              :help="slotProps.errors[0]"
            >
              <input class="ant-input" v-model="form.name" />
            </a-form-item>
          </ValidationProvider>

          <a-form-item
            v-if="!isTranslate"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 17 }"
            :label="$t('pages.menu.cols.sort_number')"
          >
            <a-input-number :min="1" v-model="form.sort_number" />
          </a-form-item>
          <a-form-item
            v-if="!isTranslate"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 17 }"
            :label="$t('pages.menu.cols.status')"
          >
            <a-radio-group buttonStyle="solid" v-model="form.active">
              <a-radio-button :value="1">{{$t('common.active')}}</a-radio-button>
              <a-radio-button :value="0">{{$t('common.passive')}}</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-form>
        <div class="drawer-bottom">
          <a-button class="mr-2" @click="onClose">{{$t('btn.cancel')}}</a-button>
          <a-button :loading="loading" class="w-50" @click="passes(onSubmit)" type="primary">
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
      visible: false,
      visibleLanguages: true,
      loading: false,
      language: "",
      default_language: "",
      form: {},
      title : '',
      selectedRowKeys: [],
      actions: [
        {
          name: "new",
          icon: "plus",
          label: "btn.add"
        },
        {
          name: "refresh",
          icon: "sync",
          label: "btn.refresh"
        },
        {
          name: "delete",
          icon: "delete",
          label: "btn.delete"
        }
      ],
      columns: [
        {
          title: this.$t("pages.menu.cols.code"),
          dataIndex: "code",
          width: 100
        },
        {
          title: this.$t("pages.menu.cols.name"),
          dataIndex: "translate.name"
        },
        {
          title: this.$t("pages.menu.cols.status"),
          dataIndex: "active",
          scopedSlots: { customRender: "active" },
          width: 100
        },
        {
          title: this.$t("pages.menu.cols.sort_number"),
          dataIndex: "sort_number",
          width: 100
        },
        {
          title: this.$t("pages.menu.cols.created_at"),
          dataIndex: "created_at",
          scopedSlots: { customRender: "created_at" },
          width: 200
        },
        {
          title: this.$t("btn.action"),
          key: "action",
          scopedSlots: { customRender: "action" },
          width: 200
        }
      ],
      language: "",
      default_language: "",
      data: {},
      form: {
        name: null,
        active: true
      }
    };
  },
  mounted() {
    this.$store.dispatch("design/menu/get", { page: 1 });
    this.$store.dispatch("localization/languages/get", { page: 1 });
    this.resetData();
  },
  computed: {
    languages() {
      return this.$store.state.localization.languages.table;
    },
    isTranslate() {
      return this.form.id && this.language != this.default_language;
    },
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

    table() {
      return this.$store.state.design.menu.table;
    }
  },

  methods: {
    handleTableSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleTableChange(pagination, filters, sorter) {
      this.$store.dispatch("design/menu/get", {
        page: pagination
      });
    },
    handleClickAction(name) {
      switch (name) {
        case "refresh":
          this.$store.dispatch("design/menu/refresh");
          break;

        case "new":
          this.insert({ id:0})
          break;

        case "delete":
          this.$store.dispatch("design/menu/delete", {
            id: this.selectedRowKeys.flat()
          });
          break;

        default:
          break;
      }
    },

    deleteRecord(id) {
      this.$store.dispatch("design/menu/delete", {
        id: [id]
      });
    },
    onClose() {
      this.visible = false;
    },

    insert(record) {
      this.visible = true;
      this.visibleLanguages = false;

      this.resetData();
      this.title =
        (record.id > 0 ? record.translate.name + " > " : "") +
        this.$t("btn.add");
    },

    fetch(record) {
      this.language = "";

      this.visible = true;
      this.visibleLanguages = true;
      this.title = record.translate.name;

      return this.$axios
        .get("/design/menu/menu/" + record.id)
        .then(response => {
          this.data = response.data.data;
          this.form.sort_number = this.data.sort_number;
          this.form.active = this.data.active;
          this.form.id = this.data.id;
          this.setLanguageData();
          this.default_language = this.language;
        });
    },

    setLanguageData() {
      var translate = this.resolveTranslate(this.data);
      this.language = translate.language;
      this.form.name = translate.name;
      this.form.url = translate.url;
      this.form.meta = translate.meta;
      this.form.language = translate.language;
    },

    loadData() {
      this.setLanguageData();
    },

    resetData() {
      this.form = {
        meta: {},
        active: 1,
        sort_number: 99
      };
    },

    resolveState({ errors, pending, valid }) {
      if (errors[0]) {
        return "error";
      }
      return "";
    },

    resolveTranslate(data) {
      for (let index = 0; index < data.translate.length; ++index) {
        let value = data.translate[index];
        if (value.default == 1 && this.language == "") {
          return value;
        }

        if (this.language == value.language) {
          return value;
        }
      }
      return null;
    },

    onSubmit() {
      this.loading = true;

      if (this.form.id) {
        let extra = this.language != this.default_language ? "/translate" : "";

        this.$axios
          .put("/design/menu/menu/" + this.form.id + extra, this.form)
          .then(response => {
            this.onResponse(response);
          })
          .catch(error => {
            this.onFailure(error.response);
          });
      } else {
        this.$axios
          .post("/design/menu/menu", this.form)
          .then(response => {
            this.onResponse(response);
          })
          .catch(error => {
            this.onFailure(error.response);
          });
      }
    },

    onResponse(response) {
      var result = response.data.data;
      if (!response.data.status) {
        return this.onFailure(response);
      }

      this.$notification["success"]({
        message: this.$t("messages.success"),
        description: this.$t("messages.action_ok"),
        placement: "bottomRight "
      });
      if (result.action == "insert") {
        this.visible = false;
      }
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
