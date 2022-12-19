<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5 class="float-left">{{ $t('pages.log.title')}}</h5>
    </div>

    <vi-table
      :actions="actions"
      :columns="columns"
      :dataSource="table.data"
      :loading="table.loading"
      :pageTitle="$t('pages.log.title')"
      :pagination="table.pagination"
      @change="handleTableChange"
      @onAction="handleClickAction"
      rowKey="id"
      showLogFilter
    >
      <span slot="active" slot-scope="record">
        <a-badge
          :count="record.value == 1 ? $t('pages.active') : $t('pages.passive')"
          :numberStyle="{backgroundColor: record.value == 1 ? '#46be8a' : '#fb434a'}"
        />
      </span>
      <span slot="language" slot-scope="record">
        <i class="flag-icon" v-bind:class="'flag-icon-'+record.value"></i>
      </span>
      <span slot="created_at" slot-scope="record">
        <span>{{$moment(record.value).format('DD.MM.YYYY - HH:mm:ss')}}</span>
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
        loading: false,
        actions: [
          {
            name: "refresh",
            icon: "sync",
            label: "btn.refresh"
          }
        ],

        columns: [
          {
            title: this.$t("pages.log.cols.module"),
            dataIndex: "module"
          },
          {
            title: this.$t("pages.log.cols.text"),
            dataIndex: "text",
          },
          {
            title: this.$t("pages.log.cols.admin"),
            dataIndex: "admin_fullname",
          },
          {
            title: this.$t("general.created_at"),
            dataIndex: "created_at",
            scopedSlots: {customRender: "created_at"},
          },
        ]
      };
    },
    mounted() {
      this.$store.dispatch("sys/log/get", {page: 1});
    },
    computed: {
      table() {
        return this.$store.state.sys.log.table;
      }
    },

    methods: {
      handleTableChange(pagination, filters, sorter, filtered, data) {
        if (filtered) {
          this.$store.dispatch("sys/log/getFilteredData", {searchData: data, page: pagination});
        } else {
          this.$store.dispatch("sys/log/get", {
            page: pagination
          });
        }
      },
      handleClickAction(name) {
        switch (name) {
          case "refresh":
            this.$store.dispatch("sys/log/refresh");
            break;

          default:
            break;
        }
      }
    }
  };
</script>
