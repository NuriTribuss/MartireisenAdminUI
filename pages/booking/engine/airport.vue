<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>{{ $t('pages.engine_airport.title')}}</h5>
    
    </div>
    <vi-table
      :actions="actions"
      :columns="columns"
      :dataSource="table.data"
      :loading="table.loading"
      :pageTitle="$t('pages.engine_airport.sub_title')"
      :pagination="table.pagination"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: handleTableSelectChange}"
      :selectedRowKeys="selectedRowKeys"
      @change="handleTableChange"
      @onAction="handleClickAction"
      rowKey="id"
    >
      <span slot="active" slot-scope="record">
        <font :color="record.value == 1 ? 'green' : 'red'">{{record.value == 1 ? $t('pages.engine_operator.active') : $t('pages.engine_operator.passive')}}</font>
      </span>

      <span slot="id" slot-scope="record">
       
         <a-button @click="fetchUser(record.id)" class="mr-1" size="small" type="primary">
                <i class="la la-edit text-white"></i>
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
      :title="$t('pages.engine_airport.detail')"
      :visible="visible"
      @close="onClose"
      placement="right"
      width="500"
    >
      <ValidationObserver ref="observer" v-slot="{ passes }">
        <a-form>
          <a-form-item :label="$t('pages.engine_airport.cols.code')" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
            <a-input v-model="form.code"></a-input>
          </a-form-item>
         
          <a-form-item :label="$t('pages.engine_airport.cols.name')" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
            <a-input  v-model="form.name" />
          </a-form-item>
         
            <a-form-item
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 17 }"
              :label="$t('pages.engine_airport.cols.status')"
            >
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
            title: this.$t("pages.engine_airport.cols.code"),
            dataIndex: "code",
            width: 150
          },
          {
            title: this.$t("pages.engine_airport.cols.name"),
            dataIndex: "name"
          },
          {
            title: this.$t("pages.engine_airport.cols.country"),
            dataIndex: "country"
          },
          {
            title: this.$t("pages.engine_airport.cols.status"),
            dataIndex: "is_active",
            scopedSlots: {customRender: "active"},

          },
          {
            title: this.$t("pages.engine_airport.cols.created_at"),
            dataIndex: "created_at"
          },
          {
            title: this.$t("btn.action"),
            scopedSlots: {customRender: "id"},
            width : 150
          }
        ],
        visible: false,
        passModal: false,
        loading: false,
        form: {}
      };
    },
    mounted() {
      this.$store.dispatch("booking/engine/airport/get", {page: 1});
      
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
        return this.$store.state.booking.engine.airport.table;
      },
    },

    methods: {
      handleTableSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
      },
      handleTableChange(pagination, filters, sorter, filtered, data) {
        if (filtered) {
          this.$store.dispatch("booking/engine/airport/getFilteredData", {searchData: data, page: pagination});

        } else {
          this.$store.dispatch("booking/engine/airport/get", {page: pagination});
        }
      },
      handleClickAction(name) {
        switch (name) {
          case "refresh":
            this.$store.dispatch("booking/engine/airport/refresh");
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
        this.$axios.get(`/booking/engine/airport/${id}`).then(res => {
          this.visible = true;
          this.form = res.data.data
        })
      },
      onSubmit() {
        this.loading = true;

        if (this.form.id) {

          this.$axios.put("/booking/engine/airport/" + this.form.id, this.form)
            .then(response => {
              this.$store.dispatch("booking/engine/airport/refresh");
              this.onClose();
              this.onResponse(response);
            })
            .catch(error => {
              this.onFailure(error.response);
            });
        } else {
          this.$axios.post("/booking/engine/airport/", this.form)
            .then(response => {
              this.$store.dispatch("booking/engine/airport/refresh");
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
        this.$store.dispatch("booking/engine/airport/delete", {
          id: [id]
        });
      },
     
    }
  };
</script>
