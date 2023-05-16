<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>{{ $t('pages.tour_period.title')}}</h5>
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
         <nuxt-link :to="'/booking/tour/report/'+record.id"  >
           <a-button class="mr-1" size="small" type="primary">
                <i class="la la-list text-white"></i>
         </a-button>
        </nuxt-link>
      </span>
       <span slot="usage" slot-scope="record">
         <span class="badge badge-info rounded-0 w-100 font-size-14">{{record.reserveInfo?.successReservesCount}}</span>
      </span>
        <span slot="available_count" slot-scope="record">
         <span class="badge badge-success rounded-0 w-100 font-size-14">{{record.max_count - record.reserveInfo?.successReservesCount}}</span>
      </span>
       <span slot="start" slot-scope="record">
         {{ $moment.unix(record.start_date).format("DD/MM/YYYY")}} {{record.start_hour}}
      </span>
        <span slot="end" slot-scope="record">
         {{ $moment.unix(record.end_date).format("DD/MM/YYYY")}}
      </span>
    </vi-table>
    <a-drawer
      :closable="false"
      :title="$t('pages.tour_period.detail')"
      :visible="visible"
      @close="onClose"
      placement="right"
      width="500"
    >
      <ValidationObserver ref="observer" v-slot="{ passes }">
        <a-form>
          <a-form-item :label="$t('pages.tour_period.cols.code')" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
            <a-input v-model="form.code"></a-input>
          </a-form-item>
         
          <a-form-item :label="$t('pages.tour_period.cols.value')" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
            <a-input  v-model="form.name" />
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
            name: "refresh",
            icon: "sync",
            label: "btn.refresh"
          }
        ],
        columns: [
          {
            title: this.$t("pages.tour_period.cols.name"),
            dataIndex: "title"
          },
          {
            title: this.$t("pages.tour_period.cols.start"),
            scopedSlots: {customRender: "start"},
          },
          {
            title: this.$t("pages.tour_period.cols.end"),
            scopedSlots: {customRender: "end"},
          },
          {
            title: this.$t("pages.tour_period.cols.max_count"),
            dataIndex: "max_count"
          },
          {
            title: this.$t("pages.tour_period.cols.usage"),
            scopedSlots: {customRender: "usage"},
            width : 150,

          },
          {
            title: this.$t("pages.tour_period.cols.available"),
            scopedSlots: {customRender: "available_count"},
            width : 150,


          },
        
          {
            title: this.$t("btn.action"),
            scopedSlots: {customRender: "id"},
            width : 70,
          }
        ],
        visible: false,
        passModal: false,
        loading: false,
        form: {
          code: null,
          name : '',
          is_active: 1
        }
      };
    },
    mounted() {
      this.$store.dispatch("booking/tour/period/get", {page: 1});
    },
    computed: {
      table() {
        return this.$store.state.booking.tour.period.table;
      },
    },

    methods: {
      handleTableChange(pagination, filters, sorter, filtered, data) {
        if (filtered) {
          this.$store.dispatch("booking/tour/period/getFilteredData", {searchData: data, page: pagination});

        } else {
          this.$store.dispatch("booking/tour/period/get", {page: pagination});
        }
      },
      handleClickAction(name) {
        switch (name) {
          case "refresh":
            this.$store.dispatch("booking/tour/period/refresh");
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
      
        this.form = {
          code: '',
          name : '',
          is_active: 1
        }
        this.visible = true;
      },
      
      fetchPromo(id) {
        this.$axios.get(`/booking/tour/period/${id}`).then(res => {
          this.visible = true;
          this.form = res.data.data
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

          this.$axios.put("/booking/tour/period/" + this.form.id, this.form)
            .then(response => {
              this.$store.dispatch("booking/tour/period/refresh");
              this.onClose();
              this.onResponse(response);
            })
            .catch(error => {
              this.onFailure(error.response);
            });
        } else {
          this.$axios.post("/booking/tour/period/", this.form)
            .then(response => {
              this.$store.dispatch("booking/tour/period/refresh");
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
        this.$store.dispatch("booking/tour/period/delete", {
          id: [id]
        });
      },
    }
  };
</script>
