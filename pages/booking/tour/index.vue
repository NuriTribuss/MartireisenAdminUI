<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>{{ $t('pages.tour.title')}}</h5>
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
    
      <span slot="id" slot-scope="record">
         <nuxt-link :to="'/booking/tour/'+record.id">
            <a-button type="primary" size="small" class="mr-1">
              <i class="la la-edit text-white"></i>
            </a-button>
          </nuxt-link>
          <a-popconfirm :title="$t('messages.sure_delete')" @confirm="deleteRecord(record.id)">
            <a-button type="danger" size="small" class="mr-2">
              <a-icon type="delete" />
            </a-button>
          </a-popconfirm>
      </span>
      <span slot="image" slot-scope="record">
        <img width="48" :src="base_url+'/'+record.image"/>
      </span>
       <span slot="start" slot-scope="record">
         {{ $moment.unix(record.start_date).format("DD/MM/YYYY")}} {{record.start_hour}}
      </span>
        <span slot="end" slot-scope="record">
         {{ $moment.unix(record.end_date).format("DD/MM/YYYY")}}
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
            name: "new",
            icon: "plus",
            label: "btn.add"
          },
          {
            name: "refresh",
            icon: "sync",
            label: "btn.refresh"
          }
        ],
        columns: [
          {
            title: "Image",
            scopedSlots: {customRender: "image"},

          },
          {
            title: this.$t("pages.tour.cols.name"),
            dataIndex: "translate.name"
          },
          {
            title: this.$t("pages.tour.cols.departure"),
            dataIndex: "departure_place"
          },
          {
            title: this.$t("pages.tour.cols.destination"),
            dataIndex: "destination"
          },
          {
            title: this.$t("pages.tour.cols.max_count"),
            dataIndex: "max_count"
          },
        
          {
            title: this.$t("btn.action"),
            scopedSlots: {customRender: "id"},
            width : 120,
          }
        ],
        visible: false,
        loading: false,
     
      };
    },
    mounted() {
      this.$store.dispatch("booking/tour/get", {page: 1});
    },
    computed: {
      table() {
        return this.$store.state.booking.tour.table;
      },
    },

    methods: {
      handleTableChange(pagination, filters, sorter, filtered, data) {
        if (filtered) {
          this.$store.dispatch("booking/tour/getFilteredData", {searchData: data, page: pagination});

        } else {
          this.$store.dispatch("booking/tour/get", {page: pagination});
        }
      },
      handleClickAction(name) {
        switch (name) {
          case "refresh":
            this.$store.dispatch("booking/tour/refresh");
            break;
          case "new":
          this.$router.push({
            path: "/booking/tour/0"
          });
          break;
          
          case "new":
            this.newForm();
            break;

          case "delete":
            break;

          default:
            break;
        }
      },
   
      deleteRecord(id) {
        this.$store.dispatch("booking/tour/delete", {
          id: [id]
        });
      },
    }
  };
</script>
