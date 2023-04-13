<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>{{ $t('pages.promocode.title')}}</h5>
    </div>
    <vi-table
      :actions="actions"
      :columns="columns"
      :dataSource="table.data"
      :loading="table.loading"
      :pageTitle="$t('pages.users.sub_title')"
      :pagination="table.pagination"
      @change="handleTableChange"
      @onAction="handleClickAction"
      rowKey="id"
    >
      <span slot="id" slot-scope="record">
         <a-button @click="fetchPromo(record.id)" class="mr-1" size="small" type="primary">
                <i class="la la-edit text-white"></i>
         </a-button>
        <a-popconfirm :title="$t('messages.sure_delete')" @confirm="deleteRecord(record.id)">
              <a-button class="mr-2" size="small" type="danger">
                <a-icon type="delete"/>
              </a-button>
        </a-popconfirm>
      </span>
      <span slot="type" slot-scope="record">
        <span>{{record.value == 1 ? $t('pages.promocode.percent') : $t('pages.promocode.stable')}}</span>
      </span>
      <span slot="start_date" slot-scope="record">
        <span>{{$moment(record.value).format('DD.MM.YYYY')}}</span>
      </span>
      <span slot="end_date" slot-scope="record">
        <span>{{$moment(record.value).format('DD.MM.YYYY')}}</span>
      </span>
      <span slot="active" slot-scope="record">
        <font :color="record.value == 1 ? 'green' : 'red'">{{record.value == 1 ? $t('pages.promocode.active') : $t('pages.promocode.passive')}}</font>
      </span>
    </vi-table>
    <a-drawer
      :closable="false"
      :title="$t('pages.promocode.detail')"
      :visible="visible"
      @close="onClose"
      placement="right"
      width="400"
    >
      <ValidationObserver ref="observer" v-slot="{ passes }">
        <a-form>
          <a-form-item :label="$t('pages.promocode.cols.code')" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
            <a-input v-model="form.code"></a-input>
          </a-form-item>
          <a-form-item :label="$t('pages.promocode.cols.type')" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
            <a-select v-model="form.discount_type">
              <a-select-option :value="1">{{$t('pages.promocode.percent')}}</a-select-option>
              <a-select-option :value="2">{{$t('pages.promocode.stable')}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="$t('pages.promocode.cols.value')" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
            <a-input-number :min="0" v-model="form.value" />
          </a-form-item>
          <a-form-item :label="$t('pages.promocode.cols.min_amount')" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
            <a-input-number :min="0" v-model="form.min_amount" />
          </a-form-item>
           <a-form-item @change="onCreatedmin" :label="$t('pages.promocode.cols.start_date')" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
            <a-date-picker suffixIcon=" " allowClear placeholder="" v-model="start_date"/>
          </a-form-item>
          <a-form-item @change="onCreatedmax" :label="$t('pages.promocode.cols.end_date')" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
            <a-date-picker suffixIcon=" " allowClear placeholder="" v-model="end_date"/>
          </a-form-item>

            <a-form-item
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 17 }"
              :label="$t('pages.categories.cols.status')"
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
            <i class="la la-save mr-2"></i>
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
          }
        ],
        columns: [
          {
            title: this.$t("pages.promocode.cols.code"),
            dataIndex: "code"
          },
          {
            title: this.$t("pages.promocode.cols.type"),
            dataIndex: "discount_type",
            scopedSlots: { customRender: "type" }
          },
          {
            title: this.$t("pages.promocode.cols.value"),
            dataIndex: "value"
          },
          {
            title: this.$t("pages.promocode.cols.min_amount"),
            dataIndex: "min_amount"
          },
          {
            title: this.$t("pages.promocode.cols.start_date"),
            dataIndex: "start_date",
            scopedSlots: { customRender: "start_date" }
          },
          {
            title: this.$t("pages.promocode.cols.end_date"),
            dataIndex: "end_date",
            scopedSlots: { customRender: "end_date" }
          },
          {
            title: this.$t("pages.promocode.cols.active"),
            dataIndex: "is_active",
            scopedSlots: { customRender: "active" }
          },
          {
            title: this.$t("btn.action"),
            scopedSlots: {customRender: "id"}
          }
        ],
        visible: false,
        passModal: false,
        loading: false,
        start_date: this.$moment(),
        end_date: this.$moment().add(7, 'days'),
        form: {
          code: null,
          discount_type: 1,
          value: 0.0000,
          min_amount: 0.0000,
          start_date: this.$moment().format('DD.MM.YYYY 00:00:00'),
          end_date: this.$moment().add(7, 'days').format('DD.MM.YYYY 00:00:00'),
          is_active: 1
        }
      };
    },
    mounted() {
      this.$store.dispatch("marketing/coupon/get", {page: 1});
    },
    computed: {
      table() {
        return this.$store.state.marketing.coupon.table;
      },
    },

    methods: {
      handleTableChange(pagination, filters, sorter, filtered, data) {
        if (filtered) {
          this.$store.dispatch("marketing/coupon/getFilteredData", {searchData: data, page: pagination});

        } else {
          this.$store.dispatch("marketing/coupon/get", {page: pagination});
        }
      },
      handleClickAction(name) {
        switch (name) {
          case "refresh":
            this.$store.dispatch("marketing/coupon/refresh");
            break;

          case "new":
            this.newForm();
            break;

          case "delete":
            break;

          default:
            break;
        }
      },
      newForm(){
        this.start_date = this.$moment();
        this.end_date = this.$moment().add(7, 'days');

        this.form = {
          code: Math.random().toString(36).substr(2, 7).toUpperCase(),
          discount_type: 1,
          value: 0.0000,
          min_amount: 0.0000,
          start_date: this.start_date.format('DD.MM.YYYY 00:00:00'),
          end_date: this.end_date.format('DD.MM.YYYY 00:00:00'),
          is_active: 1
        }
        this.visible = true;
      },
      onCreatedmin(value, dateString) {
        let date = dateString;
        this.form.start_date = date;
      },
      onCreatedmax(value, dateString) {
        let date = dateString;
        this.form.end_date = date;
      },
      fetchPromo(id) {
        this.$axios.get(`/marketing/coupon/${id}`).then(res => {
          this.visible = true;
          this.form = res.data.data
          this.start_date = this.$moment(this.form.start_date, 'YYYY-MM-DD 00:00:00');
          this.end_date = this.$moment(this.form.end_date, 'YYYY-MM-DD 00:00:00');
        })
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
      onSubmit() {
        this.loading = true;

        if (this.form.id) {

          this.$axios.put("/marketing/coupon/" + this.form.id, this.form)
            .then(response => {
              this.$store.dispatch("marketing/coupon/refresh");
              this.onClose();
              this.onResponse(response);
            })
            .catch(error => {
              this.onFailure(error.response);
            });
        } else {
          this.$axios.post("/marketing/coupon/", this.form)
            .then(response => {
              this.$store.dispatch("marketing/coupon/refresh");
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
        this.$store.dispatch("marketing/coupon/delete", {
          id: [id]
        });
      },
    }
  };
</script>
