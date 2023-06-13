<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>{{ $t('pages.affilate.title')}}</h5>
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
        <!-- <a-button @click="fetchPromo(record.id)" class="mr-1" size="small" type="primary">
                <i class="la la-edit text-white"></i>
         </a-button> -->
        <a-popconfirm :title="$t('messages.sure_delete')" @confirm="deleteRecord(record.id)">
              <a-button class="mr-2" size="small" type="danger">
                <a-icon type="delete"/>
              </a-button>
        </a-popconfirm>
      </span>
     
      <span slot="start_date" slot-scope="record">
        <span>{{$moment(record.date_start).format('DD.MM.YYYY')}} - {{$moment(record.date_end).format('DD.MM.YYYY')}} </span>
      </span>
     
      <span slot="type" slot-scope="record">
         {{ record.value == 2 ? 'Paket Tatil'  : 'Sadece Otel '}}
      </span>
      <span slot="destination" slot-scope="record">
         {{ record.destination_name == '' ? record.destination_value : record.destination_name}}
      </span>
       <span slot="url" slot-scope="record">
         <a v-bind:href="'https://martireisen.at/'+ record.value" target="_blank">{{ record.value }} <i class="la la-link"></i></a>
      </span>
    </vi-table>
  
   
  </div>
</template>

<script>
  import ViTable from "~/components/vi-table";

  export default {
    components: {
      "vi-table": ViTable
    },
    data() {
      return {
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
            title: "Tatil API",
            dataIndex: "travel_api",
          },
          {
            title: "Tatil Tipi",
            dataIndex: "travel_type",
            scopedSlots  :{ customRender : "type"}
          },
          {
            title: "Url",
            dataIndex: "seo_url",
            scopedSlots : { customRender : 'url'}
          },
          {
            title: "Link Arama Tipi",
            dataIndex: "destination_type",
            
          },
          {
            title: "Bölge / Otel",
            scopedSlots: { customRender: "destination" }

          },
          {
            title: "Kişi Sayısı",
            dataIndex: "adult"
          },
          {
            title: "Tarih Aralıgı",
            scopedSlots: { customRender: "start_date" }
          },
          {
            title: "Havalimanı",
            dataIndex: "departure_code",
          },
          {
            title: "Oluşturulma ",
            dataIndex: "created_at",
          },
          {
            title: this.$t("btn.action"),
            scopedSlots: {customRender: "id"}
          }
        ],
        visible: false,
        loading: false,

      };
    },
    mounted() {
      this.$store.dispatch("marketing/affilate/get", {page: 1});
    },
    computed: {
      table() {
        return this.$store.state.marketing.affilate.table;
      },
    },

    methods: {
      handleTableChange(pagination, filters, sorter, filtered, data) {
        if (filtered) {
          this.$store.dispatch("marketing/affilate/getFilteredData", {searchData: data, page: pagination});

        } else {
          this.$store.dispatch("marketing/affilate/get", {page: pagination});
        }
      },
      handleClickAction(name) {
        switch (name) {
          case "refresh":
            this.$store.dispatch("marketing/affilate/refresh");
            break;

          case "new":
            this.$router.push({
            path: "/marketing/affilate/0"
          });
            break;

          case "delete":
            break;

          default:
            break;
        }
      },
     
      onCreatedmin(value, dateString) {
        let date = dateString;
        this.form.start_date = date;
      },
      onCreatedmax(value, dateString) {
        let date = dateString;
        this.form.end_date = date;
      },
     
      resolveState({errors, pending, valid}) {
        if (errors[0]) {
          return "error";
        }
        return "";
      },
     
      deleteRecord(id) {
        this.$store.dispatch("marketing/affilate/delete", {
          id: [id]
        });
      },
    }
  };
</script>
