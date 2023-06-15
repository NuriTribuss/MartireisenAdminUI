<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5 class="float-left">Newsletter</h5>
      <div class="clearfix"></div>
    </div>
    <div class="w-100 text-right">
      <Excel url="crm/subscriber/excel" :filters="filters" filename="subscribers" class="mb-2" type="primary">
            <i class="la la-file-excel"></i>
            {{ $t('export')}}
      </Excel>
    </div>
    <vi-table
      :actions="actions"
      :columns="columns"
      :dataSource="table.data"
      :loading="table.loading"
      :pageTitle="$t('pages.members.sub_title')"
      :pagination="table.pagination"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: handleTableSelectChange}"
      :selectedRowKeys="selectedRowKeys"
      @change="handleTableChange"
      @onAction="handleClickAction"
      rowKey="id"
      showSubscriberFilter
      @filteredData="handleFilter"
    >
      <span slot="language" slot-scope="record">
        <i class="flag-icon" v-bind:class="'flag-icon-'+record.value"></i>
      </span>
        <span slot="name" slot-scope="record">
        {{record.name}} {{record.surname}}
      </span>
      <span slot="status" slot-scope="record">
        <span
          :style="{ 'background-color' : record.bg_color}"
          class="badge text-white w-100"
        >{{record.name}}</span>
      </span>

      <span slot="created_at" slot-scope="record">
        <span>{{$moment(record.value).format('DD.MM.YYYY - HH:mm:ss')}}</span>
      </span>

      <span slot="id" slot-scope="record">
      
        <a-popconfirm :title="$t('messages.sure_delete')" @confirm="deleteRecord(record.value)">
          <a-button type="danger" size="small" class="mr-2">
            <a-icon type="delete" />
          </a-button>
        </a-popconfirm>
      </span>
    </vi-table>
  </div>
</template>

<script>
import ViTable from "@/components/vi-table";
import Excel from "~/components/widgets/excel";

export default {
  components: {
    "vi-table": ViTable,
    Excel
  },
  data() {
    return {
      selectedRowKeys: [],
      filters: null,
      actions: [
        {
          name: "refresh",
          icon: "sync",
          label: "btn.refresh"
        },
        {
          name: "orderfilter",
          icon: "filter",
          label: "btn.filter"
        },
          {
          name: "delete",
          icon: "delete",
          label: "btn.delete"
        }
      ],
      columns: [
        {
          title: this.$t("pages.members.cols.email"),
          dataIndex: "email",

        },
        {
          title: this.$t("pages.members.cols.name"),
          scopedSlots: { customRender: "name" }

        },
       
        {
          title: this.$t("pages.members.cols.language"),
          dataIndex: "language",
          scopedSlots: { customRender: "language" }
        },
        {
          title: this.$t("pages.members.cols.created_at"),
          dataIndex: "created_at",
          scopedSlots: { customRender: "created_at" }
        },

        {
          title: "#",
          dataIndex: "id",
          scopedSlots: { customRender: "id" }
        }
      ]
    };
  },
  mounted() {
    this.$store.dispatch("member/subscriber/get", { page: 1 });
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
      return this.$store.state.member.subscriber.table;
    }
  },

  methods: {
    handleTableSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleTableChange(pagination, filters, sorter, filtered, data) {
      if (filtered) {
        this.filters = data;
        this.$store.dispatch("member/subscriber/getFilteredData", {
          searchData: data,
          page: pagination
        });
      } else {
        this.$store.dispatch("member/subscriber/get", { page: pagination });
        this.filters = null;
      }
    },
    handleClickAction(name) {
      switch (name) {
        case "refresh":
          this.$store.dispatch("member/subscriber/refresh");
          break;

        case "delete":
          this.$store.dispatch("member/subscriber/delete", {
            id: this.selectedRowKeys.flat()
          });
          break;

        default:
          break;
      }
    },
    deleteRecord(id) {
      this.$store.dispatch("member/subscriber/delete", {
        id: [id]
      });
    },
    handleFilter(data){
      this.filters = data;
    }
  }
};
</script>
