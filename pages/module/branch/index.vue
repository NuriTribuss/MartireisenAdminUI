<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5 class="float-left">{{ $t('pages.branch.title')}}</h5>
      <div class="clearfix"></div>
    </div>
    <vi-table
      :actions="actions"
      :columns="columns"
      :dataSource="table.data"
      :loading="table.loading"
      :pageTitle="$t('pages.branch.sub_title')"
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
      <span slot="action" slot-scope="record">
        <div class="text-right">
          <a-button @click="fetch(record.id,record.name)" class="mr-1" size="small" type="primary">
            <i class="la la-edit text-white"></i>
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
      :closable="false"
      :title=" form.id ? title+' '+ $t('pages.branch.branch-edit'): $t('pages.branch.add-branch-item')"
      :visible="visible"
      @close="onClose"
      placement="right"
      width="600"
    >
      <ValidationObserver ref="observer" v-slot="{ passes }">
        <a-form>

          <ValidationProvider name="name" rules="required" v-slot="slotProps">
            <a-form-item :help="slotProps.errors[0]" :label="$t('pages.branch.cols.name')"
                         :label-col="{ span: 24 }"
                         :validateStatus="resolveState(slotProps)"
                         :wrapper-col="{ span: 24 }">
              <a-input class="ant-input" v-model="form.name"/>
            </a-form-item>
          </ValidationProvider>
          <ValidationProvider name="address" rules="required" v-slot="slotProps">
            <a-form-item :help="slotProps.errors[0]" :label="$t('pages.branch.cols.address')"
                         :label-col="{ span: 24 }"
                         :validateStatus="resolveState(slotProps)"
                         :wrapper-col="{ span: 24 }">
              <a-textarea :autosize="{ minRows: 5, maxRows: 25 }" v-model="form.address"/>
            </a-form-item>
          </ValidationProvider>
          
          <a-row type="flex">
            <a-col :span="12">
              <a-form-item :label="$t('pages.branch.cols.phone')"
                           :label-col="{ span: 24 }"
                           :wrapper-col="{ span: 24 }">
                <a-input class="ant-input" style="width: 95%" v-model="form.phone"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('pages.branch.cols.fax')"
                           :label-col="{ span: 24 }"
                           :wrapper-col="{ span: 24 }">
                <a-input class="ant-input" style="width: 95%" v-model="form.fax"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item :label="$t('pages.branch.cols.email')"
                       :label-col="{ span: 24 }"
                       :wrapper-col="{ span: 24 }">
            <a-input class="ant-input" v-model="form.email"/>
          </a-form-item>
          <a-row type="flex">
            <a-col :span="12">
              <a-form-item :label="$t('pages.branch.cols.coordinate_x')"
                           :label-col="{ span: 24 }"
                           :wrapper-col="{ span: 24 }">
                <a-input class="ant-input" style="width: 95%" v-model="form.coordinate_x"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('pages.branch.cols.coordinate_y')"
                           :label-col="{ span: 24 }"
                           :wrapper-col="{ span: 24 }">
                <a-input class="ant-input" style="width: 95%" v-model="form.coordinate_y"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col :span="12">
              <a-form-item :label="$t('pages.branch.cols.week_hours')"
                           :label-col="{ span: 24 }"
                           :wrapper-col="{ span: 24 }">
                <a-input class="ant-input" style="width: 95%" v-model="form.week_hours"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('pages.branch.cols.weekend_hours')"
                           :label-col="{ span: 24 }"
                           :wrapper-col="{ span: 24 }">
                <a-input class="ant-input" style="width: 95%" v-model="form.weekend_hours"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item :label="$t('pages.branch.cols.status')" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
            <a-radio-group buttonStyle="solid" v-model="form.active">
              <a-radio-button :value="1">{{$t('common.active')}}</a-radio-button>
              <a-radio-button :value="0">{{$t('common.passive')}}</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-form>
        <div class="drawer-bottom">
          <a-button @click="onClose" class="mr-2">{{$t('btn.cancel')}}</a-button>
          <a-button :loading="loading" @click="passes(onSubmit)" class="w-50" type="primary">
            <i class="la la-save mr-2"></i>
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
        loading: false,
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
        ],
        columns: [
          {
            title: this.$t("pages.branch.cols.name"),
            dataIndex: "name"
          },
          {
            title: this.$t("pages.branch.cols.address"),
            dataIndex: "address",
          },
          
          {
            title: this.$t("pages.branch.cols.status"),
            dataIndex: "active",
            scopedSlots: {customRender: "active"},
            width: 100
          },
          {
            title: this.$t("btn.action"),
            key: "action",
            scopedSlots: {customRender: "action"},
            width: 150,
            class: "text-right"
          }
        ],
       
        title: '',
        form: {}
      };
    },
    mounted() {
      this.$store.dispatch("module/branch/get", {page: 1});
    
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
      table() {
        return this.$store.state.module.branch.table;
      },
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      },
    },

    methods: {
      handleTableSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
      },
      handleTableChange(pagination, filters, sorter) {
        this.$store.dispatch("module/branch/get", {
          page: pagination
        });
      },
      handleClickAction(name) {
        switch (name) {
          case "refresh":
            this.$store.dispatch("module/branch/refresh");
            break;


          case "new":
            this.visible = true;
            break;


          default:
            break;
        }
      },
      resolveState({errors, pending, valid}) {
        if (errors[0]) {
          return "error";
        }
        return "";
      },
      onClose() {
        this.visible = false;
        this.title = ''
        this.form = {}
      },
      onSubmit() {
        this.loading = true;

        if (this.form.id) {

          this.$axios.put("/crm/branch/" + this.form.id, this.form)
            .then(response => {
              this.$store.dispatch("module/branch/refresh");
              this.onClose();
              this.onResponse(response);
            })
            .catch(error => {
              this.onFailure(error.response);
            });
        } else {
          this.$axios.post("/crm/branch", this.form)
            .then(response => {
              this.$store.dispatch("module/branch/refresh");
              this.onClose();
              this.onResponse(response);
            })
            .catch(error => {
              this.onFailure(error.response);
            });
        }
      },
      fetch(id, name) {
        this.title = name
        this.$axios.get(`/crm/branch/${id}`).then(res => {
          this.visible = true
          this.form = res.data.data
        })
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
      },
      deleteRecord(id) {
        this.$store.dispatch("module/branch/delete", {
          id: [id]
        });
      },
      
    }
  };
</script>
