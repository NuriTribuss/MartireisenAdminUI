<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>{{ $t('pages.contents.title')}}</h5>
      <nuxt-link to="/content/contents/categories">
        <a-button type="primary">
          <i class="la la-list"></i> {{ $t('btn.category_edit') }}
        </a-button>
      </nuxt-link>
    </div>

    <vi-table
      rowKey="id"
      :pageTitle="$t('pages.contents.sub_title')"
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
      <span slot="active" slot-scope="record">
        <a-badge
          :count="record.value == 1 ? $t('pages.active') : $t('pages.passive')"
          :numberStyle="{backgroundColor: record.value == 1 ? '#46be8a' : '#fb434a'}"
        />
      </span>

      <span slot="created_at" slot-scope="record">
        <span>{{$moment(record.value).format('DD.MM.YYYY - HH:mm:ss')}}</span>
      </span>

      <span slot="action" slot-scope="record">
        <div class="text-right">
          <nuxt-link :to="'contents/save/'+record.id">
            <a-button type="primary" size="small" class="mr-1">
              <i class="la la-edit text-white"></i>
            </a-button>
          </nuxt-link>
          <a-popconfirm :title="$t('messages.sure_delete')" @confirm="deleteRecord(record.id)">
            <a-button type="danger" size="small" class="mr-2">
              <a-icon type="delete" />
            </a-button>
          </a-popconfirm>
        </div>
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
          title: this.$t("pages.contents.cols.code"),
          dataIndex: "code",
          width: 100
        },
        {
          title: this.$t("pages.contents.cols.name"),
          dataIndex: "translate.name"
        },
        {
          title: this.$t("pages.contents.cols.url"),
          dataIndex: "translate.url"
        },
        {
          title: this.$t("pages.contents.cols.status"),
          dataIndex: "active",
          scopedSlots: { customRender: "active" },
          width: 100
        },
        {
          title: this.$t("pages.contents.cols.sort_number"),
          dataIndex: "sort_number",
          width: 100
        },
        {
          title: this.$t("pages.contents.cols.created_at"),
          dataIndex: "created_at",
          scopedSlots: { customRender: "created_at" },
          width: 200
        },
        {
          title: this.$t("btn.action"),
          key: "action",
          scopedSlots: { customRender: "action" },
          width: 150,
          class: "text-right"
        }
      ]
    };
  },
  mounted() {
    this.$store.dispatch("content/post/get", { page: 1 });
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
      return this.$store.state.content.post.table;
    }
  },

  methods: {
    handleTableSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleTableChange(pagination, filters, sorter) {
      this.$store.dispatch("content/post/get", {
        page: pagination
      });
    },
    handleClickAction(name) {
      switch (name) {
        case "refresh":
          this.$store.dispatch("content/post/refresh");
          break;

        case "new":
          this.$router.push({
              path: '/content/contents/save'
          })
          break;

        case "delete":
          this.$store.dispatch("content/post/delete", {
            id: this.selectedRowKeys.flat()
          });
          break;

        default:
          break;
      }
    },
    deleteRecord(id) {
      this.$store.dispatch("content/post/delete", {
        id: [id]
      });
    }
  }
};
</script>
