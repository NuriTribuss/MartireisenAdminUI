<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>{{ $t('settings.seo.title')}}</h5>
      <nuxt-link to="/sys/settings">
        <a-button type="primary">
          <i class="fe fe-arrow-left"></i>
          {{$t('common.back')}}
        </a-button>
      </nuxt-link>
    </div>

    <a-card class="no-padding">
      <vi-table
        rowKey="id"
        :pageTitle="$t('settings.seo.title')"
        :actions="actions"
        :columns="columns"
        :loading="table.loading"
        :pagination="table.pagination"
        :dataSource="table.data"
        @onAction="handleClickAction"
        @change="handleTableChange"
      >
        <span slot="language" slot-scope="record">
          <i v-bind:class="'flag-icon-'+record.value" class="flag-icon"></i>
        </span>
        <span slot="status" slot-scope="record">
          <span
            class="badge text-white w-100"
            :style="{ 'background-color' : record.bg_color}"
          >{{record.name}}</span>
        </span>

        <span slot="id" slot-scope="record">
          <nuxt-link to="seo/detail">
            <a-button type="primary" size="small" class="mr-2">
              <i class="fe fe-edit"></i>
            </a-button>
          </nuxt-link>
        </span>
      </vi-table>
    </a-card>
  </div>
</template>


<script>
import "moment/locale/tr";

import ViTable from "@/components/vi-table";

export default {
  components: {
    "vi-table": ViTable
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
          title: this.$t("settings.seo.cols.url"),
          dataIndex: "order_number"
        },
        {
          title: this.$t("settings.seo.cols.created"),
          dataIndex: "payment_method"
        },
        {
          title: this.$t("settings.seo.cols.title"),
          dataIndex: "status",
          scopedSlots: { customRender: "status" }
        },
        {
          title: this.$t("settings.seo.cols.description"),
          dataIndex: "language",
          scopedSlots: { customRender: "language" }
        },
        {
          title: this.$t("settings.seo.cols.status"),
          dataIndex: "status",
          scopedSlots: { customRender: "status" }
        },
        {
          title: this.$t("settings.seo.cols.action"),
          dataIndex: "id",
          scopedSlots: { customRender: "id" }
        }
      ]
    };
  },
  mounted() {
    this.$store.dispatch("ecommerce/order/get", { page: 1 });
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
      return this.$store.state.ecommerce.order.table;
    }
  },

  methods: {
    handleTableSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleTableChange(pagination, filters, sorter) {
      this.$store.dispatch("ecommerce/order/get", { page: pagination });
    },
    handleClickAction(name) {
      switch (name) {
        case "refresh":
          this.$store.dispatch("ecommerce/order/refresh");
          break;

        case "delete":
          break;

        default:
          break;
      }
    }
  }
};
</script>
