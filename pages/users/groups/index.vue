<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5 class="float-left">{{ $t('pages.groups.title')}}</h5>
      <div class="d-flex">
        <nuxt-link to="/users">
          <a-button type="primary">
            <i class="la la-arrow-left"></i>
            {{ $t('btn.back') }}
          </a-button>
        </nuxt-link>
      </div>
    </div>
    <vi-table
      :actions="actions"
      :columns="columns"
      :dataSource="table.data"
      :loading="table.loading"
      :pageTitle="$t('pages.groups.sub_title')"
      :pagination="table.pagination"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: handleTableSelectChange}"
      :selectedRowKeys="selectedRowKeys"
      @change="handleTableChange"
      @onAction="handleClickAction"
      rowKey="id"
    >
      <span slot="is_active" slot-scope="record">
        <a-badge
          :count="record.value == 1 ? $t('pages.active') : $t('pages.passive')"
          :numberStyle="{backgroundColor: record.value == 1 ? '#46be8a' : '#fb434a'}"
        />
      </span>

      <span slot="id" slot-scope="record">
        <nuxt-link :to="`/users/groups/${record.value}/permissions`" v-if="record.value > 0">
          <a-button  class="mr-1" size="small" type="primary">
                <i class="la la-lock text-white"></i>
         </a-button>
        </nuxt-link>

         <a-button @click="fetchGroup(record.value)" class="mr-1" size="small" type="primary" v-if="record.value > 0">
                <i class="la la-edit text-white" ></i>
         </a-button>
         <a-popconfirm :title="$t('messages.sure_delete')" @confirm="deleteRecord(record.value)" v-if="record.value > 0">
            <a-button class="mr-2" size="small" type="danger">
              <a-icon type="delete"/>
            </a-button>
         </a-popconfirm>
      </span>
    </vi-table>
    <a-drawer
      :closable="false"
      :title="$t('pages.groups.detail')"
      :visible="visible"
      @close="onClose"
      placement="right"
      width="400"
    >
      <ValidationObserver ref="observer" v-slot="{ passes }">
        <a-form>
          <a-divider>{{ $t('pages.information') }}</a-divider>
          <ValidationProvider name="name" rules="required" v-slot="slotProps">
            <a-form-item :help="slotProps.errors[0]" :label="$t('pages.groups.cols.name')"
                         :label-col="{ span: 7 }"
                         :validateStatus="resolveState(slotProps)"
                         :wrapper-col="{ span: 17 }">
              <a-input class="ant-input" v-model="form.name"/>
            </a-form-item>
          </ValidationProvider>
          <a-form-item :label="$t('pages.groups.cols.is_active')" :label-col="{ span: 7 }"
                       :wrapper-col="{ span: 17 }">
            <a-radio-group buttonStyle="solid" v-model="form.is_active">
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
  import ViTable from "~/components/vi-table";

  export default {
    components: {
      "vi-table": ViTable,
    },
    data() {
      return {
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
            title: this.$t("pages.groups.cols.name"),
            dataIndex: "name",
            width: "60%"
          },
          {
            title: this.$t("pages.groups.cols.is_active"),
            dataIndex: "is_active",
            scopedSlots: {customRender: "is_active"},
            width: 100
          },
          {
            title: this.$t("btn.action"),
            dataIndex: "id",
            scopedSlots: {customRender: "id"}
          }
        ],
        visible: false,
        loading: false,
        form: {}
      };
    },
    mounted() {
      this.$store.dispatch("user/groups/get", {page: 1});
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
        return this.$store.state.user.groups.table;
      },
    },

    methods: {
      handleTableSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
      },
      handleTableChange(pagination, filters, sorter, filtered, data) {
        if (filtered) {
          this.$store.dispatch("user/groups/getFilteredData", {searchData: data, page: pagination});

        } else {
          this.$store.dispatch("user/groups/get", {page: pagination});
        }
      },
      handleClickAction(name) {
        switch (name) {
          case "refresh":
            this.$store.dispatch("user/groups/refresh");
            break;

          case "new":
            this.visible = true;
            break;

          case "delete":
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
        this.form = {}
      },
      fetchGroup(id) {
        this.$axios.get(`/sys/user/group/${id}`).then(res => {
          this.visible = true;
          this.form = res.data.data;
          this.form.id = res.data.data.id;
          this.form.name = res.data.data.name;
          this.form.is_active = res.data.data.is_active
        })
      },
      fetchGroupPermission(id){
        this.$axios.get(`/sys/user/group/${id}/permissions`).then(res=> {
          console.log("per",res.data.data)
        })
      },
      onSubmit() {
        this.loading = true;

        if (this.form.id) {

          this.$axios.put("/sys/user/group/" + this.form.id, this.form)
            .then(response => {
              this.$store.dispatch("user/groups/refresh");
              this.onClose();
              this.onResponse(response);
            })
            .catch(error => {
              this.onFailure(error.response);
            });
        } else {
          this.$axios.post("/sys/user/group/", this.form)
            .then(response => {
              this.$store.dispatch("user/groups/refresh");
              this.onClose();
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
      },
      deleteRecord(id) {
        this.$store.dispatch("user/groups/delete", {
          id: [id]
        });
      }
    }
  };
</script>
