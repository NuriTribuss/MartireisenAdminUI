<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5 class="float-left">{{ $t('pages.landing_otel.title')}}</h5>
      <div class="clearfix"></div>
    </div>

    <vi-table
      rowKey="id"
      :pageTitle="$t('pages.landing_otel.sub_title')"
      :actions="actions"
      :columns="columns"
      :loading="table.loading"
      :pagination="table.pagination"
      :dataSource="table.data"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: handleTableSelectChange}"
      :selectedRowKeys="selectedRowKeys"
      @onAction="handleClickAction"
      @change="handleTableChange"
      showLandingOtelFilter
      @filteredData="handleFilter"
    >
     <span slot="language" slot-scope="record">
        <i class="flag-icon" v-bind:class="'flag-icon-'+record.value"></i>
      </span>
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
        <a-button type="primary" size="small" class="mr-1" target="_blank" :href="baseUrl+'/'+record.translate.url">
          <i class="la la-link text-white"></i>
        </a-button>
        <nuxt-link :to="'/landing/otel/save/'+record.id">
        <a-button type="primary" size="small" class="mr-1">
          <i class="la la-edit text-white"></i>
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
      baseUrl: process.env.url,
      actions: [
      
        {
          name: "refresh",
          icon: "sync",
          label: "btn.refresh"
        },
     
      ],

      columns: [
        {
          title: this.$t("pages.landing_otel.cols.code")+'(Giata)',
          dataIndex: "code",
          width: 100
        },
        {
          title: this.$t("pages.landing_otel.cols.name") +'(H1)',
          dataIndex: "translate.title"
        },
        {
          title: 'H2',
          dataIndex: "translate.subtitle"
        },
        {
          title: this.$t("pages.landing_otel.cols.url"),
          dataIndex: "translate.url"
        },
        {
          title: this.$t("pages.landing_otel.cols.language"),
          dataIndex: "translate.language",
          scopedSlots: { customRender: "language" }

        },
        {
          title: this.$t("pages.landing_otel.cols.created_at"),
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
    this.$store.dispatch("landing/otel/get", { page: 1 });
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
      return this.$store.state.landing.otel.table;
    }
  },

  methods: {
    handleTableSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },

    handleTableChange(pagination, filters, sorter,filtered,filteredData) {
      if(filtered) {
        this.$store.dispatch("landing/otel/getFilteredData", {
          searchData:filteredData,
          page: pagination
        });
      }else{
        this.$store.dispatch("landing/otel/get", {
          page: pagination
        });
      }
    },    
    
    handleClickAction(name) {
      switch (name) {
        case "refresh":
          this.$store.dispatch("landing/otel/refresh");
          break;

        case "delete":
          this.$store.dispatch('landing/otel/delete', {
            id: this.selectedRowKeys.flat(),
          })
          break;

        default:
          break;
      }
    },
    deleteRecord(id) {
      this.$store.dispatch('landing/otel/delete', {
        id: [id],
      })
    },
    handleFilter(data){
      console.log(data);
    }

  }
};
</script>
