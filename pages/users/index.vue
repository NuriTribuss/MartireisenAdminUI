<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>{{ $t('pages.users.title')}}</h5>
      <nuxt-link to="/users/groups">
        <a-button type="primary">
          <i class="fe fe-list"></i> {{ $t('pages.groups.title') }}
        </a-button>
      </nuxt-link>
    </div>
    <vi-table
      :actions="actions"
      :columns="columns"
      :dataSource="table.data"
      :loading="table.loading"
      :pageTitle="$t('pages.users.sub_title')"
      :pagination="table.pagination"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: handleTableSelectChange}"
      :selectedRowKeys="selectedRowKeys"
      @change="handleTableChange"
      @onAction="handleClickAction"
      rowKey="id"
    >


      <span slot="id" slot-scope="record">
        <a-button @click="passChange(record.id,record.username)" class="mr-1" size="small" type="primary">
                <i class="fe fe-lock text-white"></i>
         </a-button>
         <a-button @click="fetchUser(record.id)" class="mr-1" size="small" type="primary">
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
      :closable="false"
      :title="$t('pages.users.detail')"
      :visible="visible"
      @close="onClose"
      placement="right"
      width="400"
    >
      <ValidationObserver ref="observer" v-slot="{ passes }">
        <a-form>
          <a-divider>{{ $t('pages.information') }}</a-divider>
          <a-form-item :label="$t('pages.users.cols.group')" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
            <a-select class="mr-2 w-100" v-model="form.group_id">
              <a-select-option :key="index" :value="group.id" v-for="(group,index) in groups">
                {{group.name}}
              </a-select-option>
            </a-select>
          </a-form-item>

          <ValidationProvider name="username" rules="required" v-slot="slotProps">
            <a-form-item :help="slotProps.errors[0]" :label="$t('pages.users.cols.username')"
                         :label-col="{ span: 7 }"
                         :validateStatus="resolveState(slotProps)"
                         :wrapper-col="{ span: 17 }">
              <a-input class="ant-input" v-model="form.username"/>
            </a-form-item>
          </ValidationProvider>
          <ValidationProvider name="password" rules="required" v-if="!form.id" v-slot="slotProps">
            <a-form-item :help="slotProps.errors[0]" :label="$t('pages.users.cols.password')"
                         :label-col="{ span: 7 }"
                         :validateStatus="resolveState(slotProps)"
                         :wrapper-col="{ span: 17 }">
              <a-input class="ant-input" type="password" v-model="form.password"/>
            </a-form-item>
          </ValidationProvider>
          <ValidationProvider name="firstname" rules="required" v-slot="slotProps">
            <a-form-item :help="slotProps.errors[0]" :label="$t('pages.users.cols.name')"
                         :label-col="{ span: 7 }"
                         :validateStatus="resolveState(slotProps)"
                         :wrapper-col="{ span: 17 }">
              <a-input class="ant-input" v-model="form.firstname"/>
            </a-form-item>
          </ValidationProvider>
          <ValidationProvider name="lastname" rules="required" v-slot="slotProps">
            <a-form-item :help="slotProps.errors[0]" :label="$t('pages.users.cols.surname')"
                         :label-col="{ span: 7 }"
                         :validateStatus="resolveState(slotProps)"
                         :wrapper-col="{ span: 17 }">
              <a-input class="ant-input" v-model="form.lastname"/>
            </a-form-item>
          </ValidationProvider>

          <a-form-item :label="$t('pages.users.cols.mobile_phone')"
                       :label-col="{ span: 7 }"
                       :wrapper-col="{ span: 17 }">
            <a-input class="ant-input" v-model="form.mobile_phone"/>
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
    <a-modal :footer="false" :title="`${form.username} ${$t('pages.users.password_change')}`" v-model="passModal">
      <ValidationObserver ref="observer" v-slot="{ passes }">
        <a-form>
          <ValidationProvider name="password" rules="required" v-slot="slotProps">
            <a-form-item :help="slotProps.errors[0]" :label="$t('pages.users.cols.password')"
                         :label-col="{ span: 7 }"
                         :validateStatus="resolveState(slotProps)"
                         :wrapper-col="{ span: 17 }">
              <a-input class="ant-input" type="password" v-model="form.password"/>
            </a-form-item>
          </ValidationProvider>
        </a-form>
        <div class="drawer-bottom" style="position: unset">
          <a-button @click="onClose" class="mr-2">{{$t('btn.cancel')}}</a-button>
          <a-button :loading="loading" @click="passes(changePass)" class="w-50" type="primary">
            <i class="fe fe-save mr-2"></i>
            {{$t('btn.save')}}
          </a-button>
        </div>
      </ValidationObserver>
    </a-modal>
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
            title: this.$t("pages.users.cols.username"),
            dataIndex: "username"
          },
          {
            title: this.$t("pages.users.cols.name"),
            dataIndex: "firstname"
          },
          {
            title: this.$t("pages.users.cols.surname"),
            dataIndex: "lastname"
          },
          {
            title: this.$t("pages.users.cols.group"),
            dataIndex: "group"
          },
          {
            title: this.$t("pages.users.cols.mobile_phone"),
            dataIndex: "mobile_phone"
          },

          {
            title: this.$t("pages.users.cols.created_at"),
            dataIndex: "created_at"
          },
          {
            title: this.$t("btn.action"),
            scopedSlots: {customRender: "id"}
          }
        ],
        visible: false,
        passModal: false,
        loading: false,
        groups: [],
        form: {}
      };
    },
    mounted() {
      this.$store.dispatch("user/get", {page: 1});
      this.$axios.get(`/sys/user/group`).then(res => {
        this.groups = res.data.data
      })
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
        return this.$store.state.user.table;
      },
    },

    methods: {
      handleTableSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
      },
      handleTableChange(pagination, filters, sorter, filtered, data) {
        if (filtered) {
          this.$store.dispatch("user/getFilteredData", {searchData: data, page: pagination});

        } else {
          this.$store.dispatch("user/get", {page: pagination});
        }
      },
      handleClickAction(name) {
        switch (name) {
          case "refresh":
            this.$store.dispatch("user/refresh");
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
        this.passModal = false;
        this.form = {}
      },
      fetchUser(id) {
        this.$axios.get(`/sys/user/user/${id}`).then(res => {
          this.visible = true;
          this.form = res.data.data
        })
      },
      onSubmit() {
        this.loading = true;

        if (this.form.id) {

          this.$axios.put("/sys/user/user/" + this.form.id, this.form)
            .then(response => {
              this.$store.dispatch("user/refresh");
              this.onClose();
              this.onResponse(response);
            })
            .catch(error => {
              this.onFailure(error.response);
            });
        } else {
          this.$axios.post("/sys/user/user/", this.form)
            .then(response => {
              this.$store.dispatch("user/refresh");
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
        this.$store.dispatch("user/delete", {
          id: [id]
        });
      },
      passChange(id, username) {
        this.passModal = true;
        this.form = {
          username: username,
          id: id,
          password: null
        }
      },
      changePass() {
        this.$axios.put(`/sys/user/user/${this.form.id}/changepassword`, {password: this.form.password}).then(res => {
          this.passModal = false;
          this.onResponse(res);
        })
          .catch(error => {
            this.onFailure(error.response);
          });
      }
    }
  };
</script>
