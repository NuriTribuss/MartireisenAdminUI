<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5 class="float-left">{{ $t('pages.pages.title')}}</h5>
      <select @change="fetchData" v-model="currentDomain" class="w-25 form-control d-none form-control-sm mr-2">
        <option v-for="(domain,index) in domains" v-bind:key="index" >{{domain.name}}</option>
      </select>
    </div>

    <vi-table
      rowKey="id"
      :pageTitle="$t('pages.pages.sub_title')"
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
        <nuxt-link :to="'/content/pages/save/'+record.id">
        <a-button type="primary" size="small" class="mr-1">
          <i class="fe fe-edit text-white"></i>
        </a-button>
        </nuxt-link>
        <a-popconfirm :title="$t('messages.sure_delete')" @confirm="deleteRecord(record.id)">
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

export default {
  components: {
    "vi-table": ViTable
  },
  data() {
    return {
      domains : [],
      currentDomain : 'martireisen.at',
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
          title: this.$t("pages.pages.cols.code"),
          dataIndex: "code",
          width: 100
        },
        {
          title: this.$t("pages.pages.cols.name"),
          dataIndex: "translate.name"
        },
        {
          title: this.$t("pages.pages.cols.url"),
          dataIndex: "translate.url"
        },
        {
          title: this.$t("pages.pages.cols.status"),
          dataIndex: "active",
          scopedSlots: { customRender: "active" },
          width: 100
        },
        {
          title: this.$t("pages.pages.cols.sort_number"),
          dataIndex: "sort_number",
          width: 100
        },
        {
          title: this.$t("pages.pages.cols.created_at"),
          dataIndex: "created_at",
          scopedSlots: { customRender: "created_at" },
          width: 200
        },
        {
          title: this.$t("btn.action"),
          key: "action",
          scopedSlots: { customRender: "action" },
          width: 150
        }
      ]
    };
  },
  mounted() {
    this.$store.dispatch("content/page/get", { page: 1 });
    this.getDomains();

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
      return this.$store.state.content.page.table;
    }
  },

  methods: {
    handleTableSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleTableChange(pagination, filters, sorter) {
      this.$store.dispatch("content/page/get", {
        page: pagination
      });
    },
    handleClickAction(name) {
      switch (name) {
        case "refresh":
          this.$store.dispatch("content/page/refresh");
          break;

        case "new":

          this.$router.push({
              path: '/content/pages/save'
          })
          break;

        case "delete":
          this.$store.dispatch('content/page/delete', {
            id: this.selectedRowKeys.flat(),
          })
          break;

        default:
          break;
      }
    },
    fetchData(){
        //this.$store.dispatch("content/page/get", { page: 1 , domain : currentDomain });
    },
    getDomains(){
      this.$axios.get("sys/domain?limit=9999").then(res => {
        this.domains = res.data.data;
      });
    },
    deleteRecord(id) {
      this.$store.dispatch('content/page/delete', {
        id: [id],
      })
    },

  }
};
</script>
