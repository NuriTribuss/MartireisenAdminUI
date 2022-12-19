<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>{{ $t('pages.categories.title')}}</h5>
      <nuxt-link to="/content/contents">
        <a-button type="primary">
          <i class="fe fe-arrow-left"></i>
          {{$t('common.back')}}
        </a-button>
      </nuxt-link>
    </div>

    <div class="air__utils__scrollTable">
      <vi-table
        :actions="actions"
        :columns="columns"
        :dataSource="table.data"
        :loading="table.loading"
        :pageTitle="$t('pages.categories.sub_title')"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: handleTableSelectChange}"
        :selectedRowKeys="selectedRowKeys"
        @change="handleTableChange"
        @expand="handleExpand"
        @onAction="handleClickAction"
        rowKey="id"
      >
        <span slot="active" slot-scope="record">
          <a-badge
            :count="record.value == 1 ? $t('pages.active') : $t('pages.passive')"
            :numberStyle="{backgroundColor: record.active == 1 ? '#46be8a' : '#fb434a'}"
          />
        </span>
        <span slot="action" slot-scope="record">
          <div class="text-right">
            <a-button @click="insert(record)" class="mr-1" size="small" type="primary">
              <a-icon type="plus"/>
            </a-button>
            <a-button class="mr-1" size="small" type="primary" v-on:click="fetch(record)">
              <i class="fe fe-edit text-white"></i>
            </a-button>

            <a-popconfirm :title="$t('messages.sure_delete')" @confirm="deleteRecord(record.id)">
              <a-button class="mr-2" size="small" type="danger">
                <a-icon type="delete"/>
              </a-button>
            </a-popconfirm>
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
          <a-select @change="loadData" class="mr-2 w-100" v-if="visibleLanguages" v-model="language">
            <a-select-option :value="item.code" v-bind:key="index" v-for="(item,index) in languages.data">
              <i :class="'flag-icon-'+item.code" class="flag-icon"></i>
              {{item.name}}
            </a-select-option>
          </a-select>
          <a-form>
            <a-divider>{{ $t('pages.information') }}</a-divider>
            <ValidationProvider name="name" rules="required" v-slot="slotProps">
              <a-form-item :help="slotProps.errors[0]" :label="$t('pages.categories.cols.name')"
                           :label-col="{ span: 7 }"
                           :validateStatus="resolveState(slotProps)"
                           :wrapper-col="{ span: 17 }">
                <input class="ant-input" v-model="form.name"/>
              </a-form-item>
            </ValidationProvider>
            <ValidationProvider name="description" rules="required" v-slot="slotProps">
              <a-form-item :help="slotProps.errors[0]" :label="$t('pages.categories.cols.description')"
                           :label-col="{ span: 7 }" :validateStatus="resolveState(slotProps)"
                           :wrapper-col="{ span: 17 }">
                <textarea :rows="2" class="ant-input" placeholder="" v-model="form.description"/>
              </a-form-item>
            </ValidationProvider>
            <a-form-item :label="$t('pages.categories.cols.sort_number')" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }"
                         v-if="!isTranslate">
              <a-input-number :min="1" v-model="form.sort_number"/>
            </a-form-item>
            <a-form-item :label="$t('pages.categories.cols.status')" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }"
                         v-if="!isTranslate">
              <a-radio-group buttonStyle="solid" v-model="form.active">
                <a-radio-button :value="1">{{$t('common.active')}}</a-radio-button>
                <a-radio-button :value="0">{{$t('common.passive')}}</a-radio-button>
              </a-radio-group>
            </a-form-item>
            <a-divider class="mt-5">{{$t('pages.contents.save.seoSettings')}}</a-divider>
            <a-form-item :label="$t('pages.categories.cols.url')" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
              <input class="ant-input" v-model="form.url"/>
            </a-form-item>
            <a-form-item :label="$t('pages.contents.save.seoTitle')" :label-col="{ span: 7 }"
                         :wrapper-col="{ span: 17 }">
              <input class="ant-input" v-model="form.meta.title"/>
            </a-form-item>
            <a-form-item :label="$t('pages.contents.save.seoDesc')" :label-col="{ span: 7 }"
                         :wrapper-col="{ span: 17 }">
              <textarea class="ant-input" v-model="form.meta.description"></textarea>
            </a-form-item>
            <a-form-item :label="$t('pages.contents.save.seoTag')" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
              <textarea class="ant-input" v-model="form.meta.keywords"></textarea>
            </a-form-item>
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
        title: this.$t('btn.add'),
        language: '',
        default_language: '',
        form: {},
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
            scopedSlots: {customRender: "active"},
            key: "active",
            width: 100
          },
          {
            title: this.$i18n.t("btn.action"),
            key: "action",
            width: 200,
            scopedSlots: {customRender: "action"},
            class: "text-right"
          }
        ],
        selectedRowKeys: []
      };
    },
    computed: {
      table() {
        return this.$store.state.content.post.categories.table;
      },
      languages() {
        return this.$store.state.localization.languages.table
      },

      isTranslate() {
        return this.form.id && this.language != this.default_language
      }
    },

    mounted() {
      this.$store.dispatch("content/post/categories/get", {page: 1});
      this.$store.dispatch("localization/languages/get", {page: 1});
      this.resetData();
    },

    methods: {
      handleTableSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
      },
      handleTableChange(pagination, filters, sorter) {
        this.$store.dispatch("content/post/categories/get", {
          page: pagination
        });
      },

      handleClickAction(name) {
        switch (name) {
          case "refresh":
            this.$store.dispatch("content/post/categories/refresh");
            break;

          case "delete":
            this.$store.dispatch("content/post/categories/delete", {
              id: this.selectedRowKeys.flat()
            });
            break;

          case "new":
            this.insert({id: 0});
            break;
          default:
            break;
        }
      },

      handleExpand(expand, record) {
        this.$store.dispatch("content/post/categories/fetchChild", {
          id: record.id
        });
      },

      deleteRecord(id) {
        this.$store.dispatch("content/post/categories/delete", {
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
        this.form['parent'] = record.id;
        this.title = (record.id > 0 ? record.translate.name + ' > ' : '') + this.$t('btn.add');

      },

      fetch(record) {

        this.language = '';

        this.visible = true;
        this.visibleLanguages = true;
        this.title = record.translate.name;

        delete this.form['parent'];
        return this.$axios
          .get("/content/post/category/" + record.id)
          .then(response => {

            this.data = response.data.data;
            this.form.sort_number = this.data.sort_number;
            this.form.active = (this.data.active);
            this.form.id = this.data.id;
            this.setLanguageData();
            this.default_language = this.language

          });
      },

      setLanguageData() {

        var translate = this.resolveTranslate(this.data);
        this.language = translate.language;
        this.form.name = translate.name;
        this.form.description = translate.description;
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

      resolveState({errors, pending, valid}) {
        if (errors[0]) {
          return "error";
        }
        return "";
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

      onSubmit() {
        this.loading = true;

        if (this.form.id) {

          let extra = this.language != this.default_language ? '/translate' : '';

          this.$axios
            .put("/content/post/category/" + this.form.id + extra, this.form)
            .then(response => {
              this.onResponse(response);
              this.$store.dispatch("content/post/categories/refresh");

            })
            .catch(error => {
              this.onFailure(error.response);
            });
        } else {
          this.$axios
            .post("/content/post/category", this.form)
            .then(response => {
              this.$store.dispatch("content/post/categories/refresh");
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
        this.onClose();
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
