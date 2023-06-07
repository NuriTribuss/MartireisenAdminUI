<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5 class="float-left">{{ $t('pages.members.title')}}</h5>
      <div class="clearfix"></div>
    </div>
    <div class="w-100 text-right">
      <Excel url="crm/customer/excel" :filters="filters" class="mb-2" type="primary">
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
      showMemberFilter
      @filteredData="handleFilter"
    >
      <span slot="language" slot-scope="record">
        <i class="flag-icon" v-bind:class="'flag-icon-'+record.value"></i>
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

      <span slot="application" slot-scope="record">
        <img width="16px" :src="'/assets/img/icons/' + record.value + '.png'" />
      </span>

      <span slot="id" slot-scope="record">
        <nuxt-link :to="'/member/members/'+record.value">
          <a-button class="mr-2" size="small" type="primary">
            <i class="la la-search"></i>
          </a-button>
        </nuxt-link>
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
          title: this.$t("pages.members.cols.name"),
          dataIndex: "name"
        },
        {
          title: this.$t("pages.members.cols.surname"),
          dataIndex: "surname"
        },
        {
          title: this.$t("pages.members.cols.email"),
          dataIndex: "username"
        },
        {
          title: this.$t("pages.members.cols.mobile_phone"),
          dataIndex: "phone"
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
    this.$store.dispatch("member/member/get", { page: 1 });
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
      return this.$store.state.member.member.table;
    }
  },

  methods: {
    handleTableSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleTableChange(pagination, filters, sorter, filtered, data) {
      if (filtered) {
        this.filters = data;
        this.$store.dispatch("member/member/getFilteredData", {
          searchData: data,
          page: pagination
        });
      } else {
        this.$store.dispatch("member/member/get", { page: pagination });
        this.filters = null;
      }
    },
    handleClickAction(name) {
      switch (name) {
        case "refresh":
          this.$store.dispatch("member/member/refresh");
          this.filters = null;
          break;

        case "delete":
          this.$store.dispatch("member/member/delete", {
            id: this.selectedRowKeys.flat()
          });
          break;

        default:
          break;
      }
    },
    deleteRecord(id) {
      this.$store.dispatch("member/member/delete", {
        id: [id]
      });
    },
    handleFilter(data){
      this.filters = data;
    }
  }
};
</script>
