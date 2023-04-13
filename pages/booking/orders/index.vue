<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5 class="float-left">{{ $t('pages.booking.title')}}</h5>
      <div class="clearfix"></div>
    </div>
    <vi-table
      :actions="actions"
      :columns="columns"
      :dataSource="table.data"
      :loading="table.loading"
      :pageTitle="$t('pages.booking.sub_title')"
      :pagination="table.pagination"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: handleTableSelectChange}"
      :selectedRowKeys="selectedRowKeys"
      @change="handleTableChange"
      @onAction="handleClickAction"
      rowKey="id"
      showBookingFilter
    >
      <span slot="language" slot-scope="record">
        <i class="flag-icon" v-bind:class="'flag-icon-'+record.value"></i>
      </span>

      <span slot="status" slot-scope="record">
        <span
          :style="{ 'background-color' : record.bg_color}"
          class="badge text-white w-100 pt-1 pb-1"
        >{{record.title}}</span>
      </span>
         <span slot="payment" slot-scope="record">
        <span
          
          class="badge badge-dark text-white w-100 pt-1 pb-1"
        >{{record.title}}</span>
      </span>
       <span slot="name" slot-scope="record">
        {{record.name}} {{ record.surname}}
      </span>

     <span slot="created_at" slot-scope="record">
        <span>{{$moment(record.value).format('DD.MM.YYYY - HH:mm:ss')}}</span>
     </span>

     <span slot="application" slot-scope="record">
        <img width="16px" :src="'/assets/img/icons/' + record.value + '.png'" />
      </span>

      <span slot="id" slot-scope="record">
        <nuxt-link :to="'/booking/orders/'+record.value">
          <a-button class="mr-2" size="small" type="primary">
            <i class="la la-search"></i>
          </a-button>
        </nuxt-link>
      </span>
    </vi-table>
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
        selectedRowKeys: [],
        actions: [
          {
            name: "refresh",
            icon: "sync",
            label: "btn.refresh"
          },
          {
            name: "orderfilter",
            icon: "filter",
            label: "btn.filter",
          }
        ],
        columns: [
          {
            title: this.$t("pages.booking.cols.pnr"),
            dataIndex: "code"
          },
          {
            title: this.$t("pages.booking.cols.name"),
            scopedSlots: {customRender: "name"}
          },
          {
            title: this.$t("pages.booking.cols.email"),
            dataIndex: "email"
          },
          {
            title: this.$t("pages.booking.cols.phone"),
            dataIndex: "phone"
          },
          {
            title: this.$t("pages.booking.cols.operator"),
            dataIndex: "operator"
          },
          {
            title: this.$t("pages.booking.cols.amount"),
            dataIndex: "amount"
          },
          {
            title: this.$t("pages.booking.cols.status"),
            dataIndex: "status",
            scopedSlots: {customRender: "status"}
          },
        {
            title: this.$t("pages.booking.payment_method"),
            dataIndex: "payment",
            scopedSlots: {customRender: "payment"}
          },
          {
            title: this.$t("pages.booking.cols.created_at"),
            dataIndex: "created_at",
            scopedSlots: {customRender: "created_at"}
          },
          {
            title: 'API',
            dataIndex: "source",
          },
          {
            title:  '#',
            dataIndex: "id",
            scopedSlots: {customRender: "id"}
          }
        ],
      };
    },
    mounted() {
      this.$store.dispatch("booking/order/get", {page: 1});
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
        return this.$store.state.booking.order.table;
      }
    },

    methods: {
      handleTableSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
      },
      handleTableChange(pagination, filters, sorter,filtered,data) {
        if (filtered){
          this.$store.dispatch("booking/order/getFilteredData", {searchData:data, page: pagination});
        }else {
          this.$store.dispatch("booking/order/get", {page: pagination});
        }
      },
      handleClickAction(name) {
        switch (name) {
          case "refresh":
            this.$store.dispatch("booking/order/refresh");
            break;

          case "delete":
            break;

          default:
            break;
        }
      },
    }
  };
</script>
