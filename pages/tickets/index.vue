<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5 class="float-left">Destek Talepleri</h5>
      <div class="clearfix"></div>
    </div>
    <div class="row">
    <div class="col-lg-3"  v-for="(status,index) in statics" v-bind:key="index">
        <div class="card">
            <div class="card-body">
                <div class="d-flex flex-wrap align-items-center">
                    <div class="mr-auto">
                        <p class="text-uppercase text-dark font-weight-bold mb-1">
                            {{status.name}}
                        </p>
                        <p class="text-gray-5 mb-0" v-if="status.id != 2">
                            Lütfen gerekli kontrollerinizi yapınız
                        </p>
                        <p class="text-gray-5 mb-0" v-if="status.id == 2">
                            Mutlu Müşteriler :)
                        </p>
                    </div>
                    <p :class="['text-' + status.class]"  class=" font-weight-bold font-size-24 mb-0">
                        {{status.count}}
                    </p>
                </div>
            </div>
        </div>
    </div>
   
</div>
    <vi-table
      rowKey="id"
      pageTitle="Destek Talepleri"
      :actions="actions"
      :columns="columns"
      :loading="table.loading"
      :pagination="table.pagination"
      :dataSource="table.data"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: handleTableSelectChange}"
      :selectedRowKeys="selectedRowKeys"
      @onAction="handleClickAction"
      @change="handleTableChange"
      showMemberFilter
    >
      <span slot="language" slot-scope="record">
        <i v-bind:class="'flag-icon-'+record.value" class="flag-icon"></i>
      </span>
      <span slot="status" slot-scope="record">
          <span class="badge mr-2 w-100" :class="['badge-' + record.class]" >{{record.name}}</span>
      </span>
      <span slot="level" slot-scope="record">
          <span class="badge mr-2 w-100" :class="['badge-' + record.class]" >{{record.name}}</span>
      </span>
      <span slot="created_at" slot-scope="record">
        <span>{{$moment(record.value).format('DD.MM.YYYY - HH:mm:ss')}}</span>
      </span>

      <span slot="id" slot-scope="record">
        <nuxt-link :to="'/tickets/'+record.value">
          <a-button type="primary" size="small" class="mr-2">
            <i class="fe fe-search"></i>
          </a-button>
        </nuxt-link>
      </span>
    </vi-table>
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
      statics : [],
      actions: [
        {
          name: "refresh",
          icon: "sync",
          label: "btn.refresh"
        },
        {
          name: "companyfilter",
          icon: "filter",
          label: "btn.filter",
        },
       /* {
          name: "delete",
          icon: "delete",
          label: "btn.delete"
        }*/
      ],

      columns: [
        {
          title: "Kod",
          dataIndex: "code",
          width : 120,
        },
        {
          title: "Domain",
          dataIndex: "domain",
          width : 140,

        },
        {
          title: "Konu",
          dataIndex: "subject"
        },
        {
          title: "Firma",
          dataIndex: "company_name",

        },
         {
          title: "Ürün",
          dataIndex: "product_name",

        },
        {
          title: 'Öncelik',
          dataIndex: "level",
          scopedSlots: { customRender: "level" },
          width:50

        },
        {
          title: 'Durum',
          dataIndex: "status",
          scopedSlots: { customRender: "status" },
          width:50

        },
        {
          title: "Tarih",
          dataIndex: "created_at",
          scopedSlots: { customRender: "created_at" },
          width: 200
        },
        {
          title: this.$t("btn.action"),
          dataIndex: "id",
          scopedSlots: { customRender: "id" },
          width:50
        }
      ]
    };
  },
  mounted() {
    this.$store.dispatch("ticket/get", { page: 1 });
    this.getStatics();

  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        onChange: (selectedRowKeys, selectedRows) => {},
        getCheckboxProps: record => ({
          props: {
            disabled: false,
            name: record.name
          }
        })
      };
    },
    table() {
      return this.$store.state.ticket.table;
    }
  },

  methods: {
    handleTableSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleTableChange(pagination, filters, sorter,filtered,data) {
      if (filtered){
        this.$store.dispatch("ticket/getFilteredData", {searchData:data,page: pagination});

      } else {
        this.$store.dispatch("ticket/get", { page: pagination });
      }
    },
    handleClickAction(name) {
      switch (name) {
        case "refresh":
          this.$store.dispatch("ticket/refresh");
          break;

        case "new":
          break;

        case "delete":
          break;

        default:
          break;
      }
    },

    getStatics(){
        this.$axios.get(`/ticket/ticket/statics`).then(res => {
          this.statics = res.data.data;
        })
    }
    /*filters(data){
      alert(JSON.stringify(data))
      this.$axios.get(`member/member?page=1&limit=9999${data.email ? `&email=${data.email}` : ''}${data.name ? `&name=${data.name}` : ''}${data.surname ? `&surname=${data.surname}` : ''}${data.phone ? `&mobile_phone=${data.phone}` : ''}${data.created_atn ? `&&created_at%5Bmin%5D=${data.created_atn}` : ''}`).then(res => {
        this.$store.commit('member/updateTableData', res.data.data)
      })
    }*/
  }
};
</script>
