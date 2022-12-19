<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>{{ $t('pages.categories.title')}}</h5>
      <nuxt-link to="/content/support">
        <a-button type="primary">
          <i class="fe fe-arrow-left"></i>
          {{$t('common.back')}}
        </a-button>
      </nuxt-link>
    </div>

    <div class="air__utils__scrollTable">
      <vi-table
        rowKey="id"
        :pageTitle="$t('pages.categories.sub_title')"
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
          <div class="text-right">
            <a-button type="primary" size="small" @click="insert(record)" class="mr-1">
              <a-icon type="plus" />
            </a-button>
            <a-button type="primary" size="small" class="mr-1" v-on:click="fetch(record)">
              <i class="fe fe-edit text-white"></i>
            </a-button>

            <a-popconfirm :title="$t('messages.sure_delete')" @confirm="deleteRecord(record.id)">
              <a-button type="danger" size="small" class="mr-2">
                <a-icon type="delete" />
              </a-button>
            </a-popconfirm>
          </div>
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
          <a-select v-if="visibleLanguages" v-model="language" @change="loadData" class="mr-2 w-100" >
          <a-select-option :value="item.code" v-bind:key="index"  v-for="(item,index) in languages.data" >
            <i class="flag-icon" :class="'flag-icon-'+item.code"></i>
            {{item.name}}
          </a-select-option>
        </a-select>
        <a-form>
          <a-divider>{{ $t('pages.information') }}</a-divider>
          <ValidationProvider name="name" rules="required" v-slot="slotProps">
            <a-form-item :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }" :label="$t('pages.categories.cols.name')"
             :validateStatus="resolveState(slotProps)"
             :help="slotProps.errors[0]">
              <input class="ant-input" v-model="form.name"/>
            </a-form-item>
          </ValidationProvider>
          <a-form-item :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }" :label="$t('pages.categories.cols.description')">
            <textarea placeholder="" class="ant-input" v-model="form.description" :rows="2" />
          </a-form-item>

          <a-form-item v-if="!isTranslate" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }" :label="$t('pages.categories.cols.sort_number')">
            <a-input-number :min="1"  v-model="form.sort_number" />
          </a-form-item>
          <a-form-item v-if="!isTranslate" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }" :label="$t('pages.categories.cols.status')">
            <a-radio-group buttonStyle="solid" v-model="form.active">
              <a-radio-button :value="1">{{$t('common.active')}}</a-radio-button>
              <a-radio-button :value="0">{{$t('common.passive')}}</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-divider class="mt-5">{{$t('pages.contents.save.seoSettings')}}</a-divider>
          <a-form-item :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }" :label="$t('pages.categories.cols.url')">
            <input  class="ant-input" v-model="form.url"/>
          </a-form-item>
          <a-form-item :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }" :label="$t('pages.contents.save.seoTitle')">
            <input  class="ant-input" v-model="form.meta.title"/>
          </a-form-item>
          <a-form-item :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }" :label="$t('pages.contents.save.seoDesc')">
            <textarea class="ant-input"  v-model="form.meta.description" ></textarea>
          </a-form-item>
           <a-form-item :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }" :label="$t('pages.contents.save.seoTag')">
            <textarea class="ant-input"  v-model="form.meta.keywords" ></textarea>
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
      visibleLanguages : true,
      loading : false,
      title  : this.$t('btn.add'),
      language : '',
      default_language : '',
      form : {},
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
          title: "ID",
          dataIndex: "id",
          key: "id",
          width: 50
        },
        {
          title: this.$t("input.name"),
          dataIndex: "translate.name",
          key: "name"
        },
        {
          title: this.$t("customers.fields.sort_number"),
          dataIndex: "sort_number",
          key: "sort_number",
          width: 100
        },
        {
          title: this.$i18n.t("pages.active"),
          width: 100,
          scopedSlots: { customRender: "active" },
          key: "active",
          width: 100
        },
        {
          title: this.$i18n.t("btn.action"),
          key: "action",
          width: 200,
          scopedSlots: { customRender: "action" },
          class: "text-right"
        }
      ],
      selectedRowKeys: []
    };
  },
  computed: {
    table() {
      return this.$store.state.content.support.categories.table;
    },
    languages(){
      return this.$store.state.localization.languages.table
    },
    isTranslate(){
      return this.form.id && this.language != this.default_language
    }
  },

  mounted() {
    this.$store.dispatch("content/support/categories/get", { page: 1 });
    this.$store.dispatch("localization/languages/get", { page: 1 });
    this.resetData();
  },

  methods: {
    handleTableSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleTableChange(pagination, filters, sorter) {
      this.$store.dispatch("content/support/categories/get", {
        page: pagination
      });
    },

    handleClickAction(name) {
      switch (name) {
        case "refresh":
          this.$store.dispatch("content/support/categories/refresh");
          break;

        case "delete":
          this.$store.dispatch("content/support/categories/delete", {
            id: this.selectedRowKeys.flat()
          });
          break;

        case "new":
          this.insert({ id:0})
          break;
        default:
          break;
      }
    },

    handleExpand(expand, record) {
      this.$store.dispatch("content/support/categories/fetchChild", {
        id: record.id
      });
    },

    deleteRecord(id) {
      this.$store.dispatch("content/support/categories/delete", {
        id: [id]
      });
    },

    // kategori crud

    onClose() {
      this.visible = false;
    },

    insert(record){

      this.visible = true;
      this.visibleLanguages = false;

      this.resetData();
      this.form['parent'] = record.id;
      this.title   = (record.id > 0 ? record.translate.name+' > ' : '') + this.$t('btn.add');

    },

    fetch(record){

       this.language = '';

       this.visible = true;
       this.visibleLanguages = true;
       this.title   = record.translate.name;

       delete this.form['parent'];
       return this.$axios
        .get("/content/support/category/" + record.id)
        .then(response => {

          this.data = response.data.data;
          this.form.sort_number = this.data.sort_number;
          this.form.active      = (this.data.active);
          this.form.id          = this.data.id;
          this.setLanguageData()
          this.default_language = this.language

        });
    },

    setLanguageData(){

          var translate         = this.resolveTranslate(this.data)
          this.language         = translate.language;
          this.form.name        = translate.name;
          this.form.description = translate.description;
          this.form.url         = translate.url;
          this.form.meta        = translate.meta;
          this.form.language    = translate.language;
    },

    loadData(){
        this.setLanguageData();
    },

    resetData(){
        this.form = {
          meta: {},
          active : 1,
          sort_number : 99
        };
    },

    resolveState({ errors, pending, valid }) {
      if (errors[0]) {
        return "error";
      }
      return "";
    },

    resolveTranslate(data){
      for (let index = 0; index < data.translate.length; ++index) {
          let value = data.translate[index];
          if(value.default == 1 && this.language == ''){
            return value;
          }

          if(this.language == value.language){
            return value;
          }
      }
      return null;
    },

    onSubmit() {
      this.loading = true;

      if (this.form.id) {

        let extra = this.language != this.default_language ? '/translate' : '';

        this.$axios
          .put("/content/support/category/" + this.form.id + extra, this.form)
          .then(response => {
            this.onResponse(response);
          })
          .catch(error => {
            this.onFailure(error.response);
          });
      } else {
        this.$axios
          .post("/content/support/category", this.form)
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
