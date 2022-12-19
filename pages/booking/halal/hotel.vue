<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>{{ $t('pages.halal_hotel.title')}}</h5>
    </div>
    <vi-table
      :actions="actions"
      :columns="columns"
      :dataSource="table.data"
      :loading="table.loading"
      :pageTitle="$t('pages.users.sub_title')"
      :pagination="table.pagination"
      @change="handleTableChange"
      @onAction="handleClickAction"
      rowKey="id"
    >
    
      
      <span slot="star" slot-scope="record">
        <a-rate :default-value="record.star" disabled />
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
        base_url : process.env.url,
        actions: [
        
          {
            name: "refresh",
            icon: "sync",
            label: "btn.refresh"
          }
        ],
        columns: [
        
          {
            title: this.$t("pages.halal_hotel.cols.name"),
            dataIndex: "name"
          },
          {
            title: this.$t("pages.halal_hotel.cols.type"),
            dataIndex: "type"
          },
          {
            title: this.$t("pages.halal_hotel.cols.country"),
            dataIndex: "country"
          },
          {
            title: this.$t("pages.halal_hotel.cols.location"),
            dataIndex: "locality"
          },
          {
            title: "Star",
            scopedSlots: {customRender: "star"},
            width:200

          },
         
        ],
        visible: false,
        loading: false,
     
      };
    },
    mounted() {
      this.$store.dispatch("booking/halal/get", {page: 1});
    },
    computed: {
      table() {
        return this.$store.state.booking.halal.table;
      },
    },

    methods: {
      handleTableChange(pagination, filters, sorter, filtered, data) {
        if (filtered) {
          this.$store.dispatch("booking/halal/getFilteredData", {searchData: data, page: pagination});

        } else {
          this.$store.dispatch("booking/halal/get", {page: pagination});
        }
      },
      handleClickAction(name) {
        switch (name) {
          case "refresh":
            this.$store.dispatch("booking/halal/refresh");
            break;

          case "delete":
            break;

          default:
            break;
        }
      },
   
      deleteRecord(id) {
        this.$store.dispatch("booking/halal/delete", {
          id: [id]
        });
      },
    }
  };
</script>
