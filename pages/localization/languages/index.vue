<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>{{ $t('pages.languages.title')}}</h5>
    </div>

    <vi-table
      rowKey="id"
      :pageTitle="$t('pages.languages.sub_title')"
      :actions="actions"
      :columns="columns"
      :loading="table.loading"
      :pagination="table.pagination"
      :dataSource="table.data"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: handleTableSelectChange}"
      :selectedRowKeys="selectedRowKeys"
      @onAction="handleClickAction"
      @change="handleTableChange"
    >
      <span slot="status" slot-scope="record">
        <a-badge
          :count="record.value == 1 ? $t('pages.active') : $t('pages.passive')"
          :numberStyle="{backgroundColor: record.value == 1 ? '#46be8a' : '#fb434a'}"
        />
      </span>
      <span slot="is_default" slot-scope="record">
        <a-badge
          :count="record.value == 1 ? $t('pages.active') : $t('pages.passive')"
          :numberStyle="{backgroundColor: record.value == 1 ? '#46be8a' : '#fb434a'}"
        />
      </span>
      <span slot="flag" slot-scope="record">
        <i v-bind:class="'flag-icon-'+record.value" class="flag-icon"></i>
      </span>
       <span slot="action" slot-scope="record">
        <nuxt-link :to="'/localization/languages/'+record.id+'/translate'">
          <a-button type="primary" size="small" class="mr-2">
            <i class="fe fe-list"></i>
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
        }
      ],

      columns: [
        {
          title: this.$t("pages.languages.cols.name"),
          dataIndex: "title"
        },
        {
          title: this.$t("pages.languages.cols.flag"),
          dataIndex: "code",
          scopedSlots: { customRender: "flag" },
          width: 80
        },
        {
          title: this.$t("pages.languages.cols.is_default"),
          dataIndex: "is_default",
          scopedSlots: { customRender: "is_default" },
          width: 100
        },
        {
          title: this.$t("pages.languages.cols.status"),
          dataIndex: "is_active",
          scopedSlots: { customRender: "status" },
          width: 100
        },
        {
          title: this.$t("btn.action"),
          key: "action",
          // width: 100,
          scopedSlots: { customRender: "action" },
          width: 150
        }
     
      ]
    };
  },
  mounted() {
    this.$store.dispatch("localization/languages/get", { page: 1 });
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
    drawerTitle() {
      return this.editForm.type === "create"
        ? this.$t("btn.create")
        : this.$t("btn.edit");
    },
    table() {
      return this.$store.state.localization.languages.table;
    }
  },

  methods: {
    handleTableSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleTableChange(pagination, filters, sorter) {
      this.$store.dispatch("localization/languages/get", {
        page: pagination
      });
    },
    handleClickAction(name) {
      switch (name) {
        case "refresh":
          this.$store.dispatch("localization/languages/refresh");
          break;

        case "new":
          break;

        case "delete":
          this.$store.dispatch("localization/languages/delete", {
            id: this.selectedRowKeys.flat()
          });
          break;

        default:
          break;
      }
    },
    deleteRecord(id) {
      this.$store.dispatch("localization/languages/delete", {
        id: [id]
      });
    }
  }
};
</script>
