<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5 class="float-left">Seo Link</h5>
      <div class="clearfix"></div>
    </div>
    <vi-table
      :actions="actions"
      :columns="columns"
      :dataSource="table.data"
      :loading="table.loading"
      :pagination="table.pagination"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: handleTableSelectChange}"
      :selectedRowKeys="selectedRowKeys"
      @change="handleTableChange"
      @onAction="handleClickAction"
      rowKey="id"
    >
      <span slot="col" slot-scope="record">
          {{record.value}} . Satır
      </span>
 
      <span slot="active" slot-scope="record">
        <a-badge
          :count="record.value == 1 ? $t('pages.active') : $t('pages.passive')"
          :numberStyle="{backgroundColor: record.value == 1 ? '#46be8a' : '#fb434a'}"
        />
      </span>

      <span slot="action" slot-scope="record">
         <a-button @click="fetch(record)" class="mr-1" size="small" type="primary">
            <i class="fe fe-edit text-white"></i>
          </a-button>
        <a-popconfirm :title="$t('messages.sure_delete')" @confirm="deleteRecord(record.id)">
          <a-button class="mr-2" size="small" type="danger">
            <a-icon type="delete"/>
          </a-button>
        </a-popconfirm>
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
            <a-form-item :help="slotProps.errors[0]" :label="$t('pages.landing_link.cols.name')"
                         :label-col="{ span: 7 }"
                         :validateStatus="resolveState(slotProps)"
                         :wrapper-col="{ span: 17 }">
              <input class="ant-input" v-model="form.name"/>
            </a-form-item>
          </ValidationProvider>
          <ValidationProvider name="text" rules="required" v-slot="slotProps">
            <a-form-item :help="slotProps.errors[0]" :label="$t('pages.landing_link.cols.url')"
                         :label-col="{ span: 7 }"
                         :validateStatus="resolveState(slotProps)"
                         :wrapper-col="{ span: 17 }">
              <input class="ant-input" v-model="form.url"/>
            </a-form-item>
          </ValidationProvider>

          <a-form-item :label="$t('pages.landing_link.cols.sort_number')" :label-col="{ span: 7 }"
                       :wrapper-col="{ span: 17 }"
                       v-if="!isTranslate">
            <a-input-number :min="1" v-model="form.sort_number"/>
          </a-form-item>

          <a-form-item :label="$t('pages.landing_link.cols.active')" :label-col="{ span: 7 }"
                       :wrapper-col="{ span: 17 }"
                       v-if="!isTranslate">
            <a-radio-group buttonStyle="solid" v-model="form.active">
              <a-radio-button :value="1">{{$t('common.active')}}</a-radio-button>
              <a-radio-button :value="0">{{$t('common.passive')}}</a-radio-button>
            </a-radio-group>
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
        language: '',
        default_language: '',
        form: {
          name: null,
          url: null,
          sort_number: 0,
          active: 1,
        },
        title: '',
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
            title: this.$t("pages.landing_link.cols.name"),
            dataIndex: "translate.name"
          },
        
        {
            title: 'Row',
            dataIndex: "row",
            scopedSlots: {customRender: "col"},
          },
          {
            title: this.$t("pages.landing_link.cols.url"),
            dataIndex: "translate.url"
          },
        
          {
            title: this.$t("pages.landing_link.cols.active"),
            dataIndex: "active",
            scopedSlots: {customRender: "active"},
            width: 100
          },

          {
            title: this.$t("pages.landing_link.cols.sort_number"),
            dataIndex: "sort_number",
            width: 100
          },
          {
            title: this.$t("btn.action"),
            key: "action",
            scopedSlots: {customRender: "action"},
            width: 150
          }
        ]
      };
    },
    mounted() {
      this.$store.dispatch("homepage/seo/link/get", {page: 1});
      this.$store.dispatch("localization/languages/get", {page: 1});
    },
    computed: {
      rowSelection() {
        const {selectedRowKeys} = this;
        return {
          onChange: (selectedRowKeys, selectedRows) => {
          },
          getCheckboxProps: record => ({
            props: {
              disabled: false,
              name: record.name
            }
          })
        };
      },

      languages() {
        return this.$store.state.localization.languages.table
      },

      isTranslate() {
        return this.form.id && this.language != this.default_language
      },
      table() {
        return this.$store.state.homepage.seo.link.table;
      }
    },

    methods: {
      handleTableSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
      },
      handleTableChange(pagination, filters, sorter) {
        this.$store.dispatch("homepage/seo/link/get", {
          page: pagination
        });
      },
      handleClickAction(name) {
        switch (name) {
          case "refresh":
            this.$store.dispatch("homepage/seo/link/refresh");
            break;

          case "new":
            this.insert({id: 0})
            break;

          case "delete":
            this.$store.dispatch('homepage/seo/link/delete', {
              id: this.selectedRowKeys.flat(),
            })
            break;

          default:
            break;
        }
      },
      onClose() {
        this.visible = false;
      },
      fetch(record) {

        this.language = '';

        this.visible = true;
        this.visibleLanguages = true;
        this.title = record.translate.name;

        return this.$axios
          .get(`/content/homepage/seo-link/${record.id}`)
          .then(response => {
            this.data = response.data.data;
            this.form.sort_number = this.data.sort_number;
            this.form.active = this.data.active
            this.form.id = this.data.id;
            this.setLanguageData()
            this.default_language = this.language
          });
      },
      insert(record) {

        this.visible = true;
        this.visibleLanguages = false;

        this.resetData();
        this.title = (record.id > 0 ? record.translate.name + ' > ' : '') + this.$t('btn.add');

      },
      setLanguageData() {

        var translate = this.resolveTranslate(this.data)
        this.language = translate.language;
        this.form.name = translate.name;
        this.form.url = translate.url;
        this.form.language = translate.language;
      },

      loadData() {
        this.setLanguageData();
      },

      resetData() {
        this.form = {
          active: 1,
          is_static: 1,
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
          this.$axios.put("/content/homepage/seo-link/" + this.form.id + extra, this.form)
            .then(response => {
              this.$store.dispatch("homepage/seo/link/refresh");
              this.onResponse(response);
            })
            .catch(error => {
              this.onFailure(error.response);
            });
        } else {
          this.$axios.post("/content/homepage/seo-link/", this.form)
            .then(response => {
              this.$store.dispatch("homepage/seo/link/refresh");
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
        this.onClose()
        this.loading = false;

      },

      onFailure(response) {
        this.$notification["error"]({
          message: this.$t("messages.warning"),
          description: response.data.message,
          placement: "bottomRight "
        });
        this.loading = false;
      },
      deleteRecord(id) {
        this.$store.dispatch('homepage/seo/link/delete', {
          id: [id],
        })
      },

    }
  };
</script>
