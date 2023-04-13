<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5 class>Tur Tab</h5>
     
    </div>

    <div class="air__utils__scrollTable">
      <vi-table
        rowKey="id"
        :actions="actions"
        :columns="columns"
        :loading="table.loading"
        :dataSource="table.data"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: handleTableSelectChange}"
        :selectedRowKeys="selectedRowKeys"
        @onAction="handleClickAction"
        @change="handleTableChange"
        @expand="handleExpand"
      >
        <span slot="active" slot-scope="record">
          <a-badge
            :count="record.value == 1 ? $t('pages.active') : $t('pages.passive')"
            :numberStyle="{backgroundColor: record.active == 1 ? '#46be8a' : '#fb434a'}"
          />
        </span>
        <span slot="action" slot-scope="record">
          
          <a-button type="primary" size="small" class="mr-1" v-on:click="fetch(record)">
            <i class="la la-edit text-white"></i>
          </a-button>

          <a-popconfirm :title="$t('messages.sure_delete')" @confirm="deleteRecord(record.id)">
            <a-button type="danger" size="small" class="mr-2">
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
        width="600"
      >
        <ValidationObserver ref="observer" v-slot="{ passes }">
          <a-select
            v-if="visibleLanguages"
            v-model="language"
            @change="loadData"
            class="mr-2 w-100"
          >
            <a-select-option
              :value="item.code"
              v-bind:key="index"
              v-for="(item,index) in languages.data"
            >
              <i class="flag-icon" :class="'flag-icon-'+item.code"></i>
              {{item.title}}
            </a-select-option>
          </a-select>
          <a-form>
            <a-divider>{{ $t('pages.information') }}</a-divider>
            <ValidationProvider name="name" rules="required" v-slot="slotProps">
              <a-form-item
                :label-col="{ span: 7 }"
                :wrapper-col="{ span: 17 }"
                :label="$t('pages.menu_categories.cols.name')"
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
              :label="$t('pages.menu_categories.cols.type')"
            >
              <select class="mr-2 w-100 ant-input" v-model="form.type" v-on:change="loadSubData">
                <option
                  :value="item.key"
                  v-bind:key="index"
                  v-for="(item,index) in options"
                >{{ item.name }}
                </option>
              </select>
            </a-form-item>
            <a-form-item
              v-if="!isTranslate && form.type > 0"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 17 }"
              :label="$t('pages.menu_categories.cols.type_table_id')"
            >
             <select class="mr-2 w-100 ant-input" v-model="form.type_table_id">
                <option
                   :value="item.value"
                  v-bind:key="index"
                  v-for="(item,index) in subData"
                >{{ item.label }}
                </option>
              </select>

            </a-form-item>
             <a-form-item   v-if="!isTranslate && form.type == 0"
                :label-col="{ span: 7 }"
                :wrapper-col="{ span: 17 }"
                :label="$t('pages.menu_categories.cols.url')"
              >
                <input class="ant-input" v-model="form.url" />
              </a-form-item>
           

            <a-form-item
              v-if="!isTranslate"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 17 }"
              :label="$t('pages.menu_categories.cols.sort_number')"
            >
              <a-input-number :min="1" v-model="form.sort_number" />
            </a-form-item>
            <a-form-item
              v-if="!isTranslate"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 17 }"
              :label="$t('pages.menu_categories.cols.status')"
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
              <i class="la la-save mr-2"></i>
              {{$t('btn.save')}}
            </a-button>
          </div>
        </ValidationObserver>
      </a-drawer>
    </div>
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
      title: this.$t("btn.add"),
      language: "",
      default_language: "",
      subData: [],
      form: {icon_class: '', icon_color: ''},
      options : [
        {
          'key' : '1',
          'name' : 'Tur Tipi Bazlı',
          'api' : 'booking/tour/type',
          'label_column' : 'translate.name',
          'column' : 'code'
        },
        {
          'key' : '2',
          'name' : 'Ülke Bazlı',
          'api' : 'region/country?limit=500',
          'label_column' : 'name_tr',
          'column' : 'id'
        }
      ],
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
          title: this.$t("input.name"),
          dataIndex: "translate.name",
          key: "name"
        },
        {
          title: this.$i18n.t("pages.active"),
          key: "active",
          width: 180,
          scopedSlots: { customRender: "active" }
        },
        {
          title: this.$i18n.t("btn.action"),
          key: "action",
          width: 180,
          scopedSlots: { customRender: "action" }
        }
      ],
      selectedRowKeys: [],
      search: ''
    };
  },
  computed: {
    table() {
      return this.$store.state.tour.tab.table;
    },
    languages() {
      return this.$store.state.localization.languages.table;
    },

    menu (){
      return this.$store.state.design.menu.categories.menuData
    },

    isTranslate() {
      return this.language != this.default_language;
    },

    
  },

  mounted() {
    this.$store.dispatch("tour/tab/get", {page: 1});
    this.$store.dispatch("localization/languages/get", { page: 1 });
    this.resetData();
  },


  methods: {

    handleTableSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleTableChange(pagination, filters, sorter) {
      this.$store.dispatch("tour/tab/get", {
        parent_id : this.$route.params.id
      });
    },

    handleClickAction(name) {
      switch (name) {
        case "refresh":
          this.$store.dispatch("tour/tab/refresh", {
            parent: this.$route.params.id
          });
          break;

        case "delete":
          this.$store.dispatch("tour/tab/delete", {
            id: this.selectedRowKeys.flat()
          });
          break;

        case "new":
          this.insert({ id: 0 });
          break;
        default:
          break;
      }
    },


    handleSearchFont(val){
      this.search = val;
    },

    handleExpand(expand, record) {
      this.$store.dispatch("tour/tab/fetchChild", {
        parent_id: this.$route.params.id,
        id: record.id
      });
    },

    deleteRecord(id) {
      this.$store.dispatch("tour/tab/delete", {
        parent: this.$route.params.id,
        id: [id]
      });
    },

    // kategori crud

    onClose() {
      this.visible = false;
    },

    insert(record) {
      this.visible = true;
      this.visibleLanguages = false;

      this.resetData();
      this.form["parent"] = record.id;
      this.title =
        (record.id > 0 ? record.translate.name + " > " : "") +
        this.$t("btn.add");
    },

    fetch(record) {
      this.language = "";

      this.visible = true;
      this.visibleLanguages = true;
      this.title = record.translate.name;

      delete this.form["parent"];
      return this.$axios
        .get(
          "/tour/tab/"+
            record.id
        )
        .then(response => {
          this.data = response.data.data;
          this.form.sort_number = this.data.sort_number;
          this.form.active = this.data.active;
          this.form.type = this.data. type;
          this.form.type_table_id = this.data.type_table_id;
          this.form.id = this.data.id;
          this.setLanguageData();
          this.default_language = this.language;

          this.loadSubData();
        });
    },

    setLanguageData() {
      var translate = this.resolveTranslate(this.data);
      this.language = translate.language;
      this.form.name = translate.name;
      this.form.url = translate.url;
      this.form.language = translate.language;
    },

    loadData() {
      this.setLanguageData();
    },

    loadSubData() {
      
      if (this.form.type) {
        var record = null;
        for (var i = 0; i < this.options.length; i++) {
          if (this.options[i].key == this.form.type) {
            record = this.options[i];
          }
        }
        if (record && record.key > 0) {
          this.$axios.get(record.api).then(response => {
            var data = response.data.data;
            this.subData = this.matchData(record, data);
          });
        }
      }
    },

    matchData(record, data) {
      var subData = [];
      for (var i = 0; i < data.length; i++) {
        subData.push({
          value: data[i][record.column],
          label: this.resolveData(record.label_column, data[i])
        });
      }
      return subData;
    },

    resolveData(path, obj) {
      return path.split(".").reduce(function(prev, curr) {
        return prev ? prev[curr] : null;
      }, obj || self);
    },

    resetData() {
      this.form = {
        active: 1,
        sort_number: 99,
        type : 0,
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
          .put(
            "/tour/tab/" +
              this.form.id +
              extra,
            this.form
          )
          .then(response => {
            this.onResponse(response);
          })
          .catch(error => {
            this.onFailure(error.response);
          });
      } else {
        this.$axios
          .post(
            "/tour/tab/",
            this.form
          )
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
      this.$store.dispatch("tour/tab/refresh", {
        parent: this.$route.params.id
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
