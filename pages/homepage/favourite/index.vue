<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>Sevilen Oteller</h5>
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
         <a-button @click="fetchPromo(record.id)" class="mr-1" size="small" type="primary">
                <i class="la la-edit text-white"></i>
         </a-button>
        <a-popconfirm :title="$t('messages.sure_delete')" @confirm="deleteRecord(record.id)">
              <a-button class="mr-2" size="small" type="danger">
                <a-icon type="delete"/>
              </a-button>
        </a-popconfirm>
      </span>
       <span slot="booking_online" slot-scope="record">
        <font :color="record.value == 1 ? 'green' : 'red'">{{record.value == 1 ? $t('pages.engine_operator.active') : $t('pages.engine_operator.passive')}}</font>
      </span>
      <span slot="active" slot-scope="record">
        <font :color="record.value == 1 ? 'green' : 'red'">{{record.value == 1 ? $t('pages.engine_operator.active') : $t('pages.engine_operator.passive')}}</font>
      </span>
    </vi-table>
    <a-drawer
      :closable="false"
      title="Yeni Ekle - Düzenle"
      :visible="visible"
      @close="onClose"
      placement="right"
      width="500"
    >
      <ValidationObserver ref="observer" v-slot="{ passes }">
        <a-form>
          <a-form-item label="Giata Kod" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
            <a-input v-model="form.gid_id"></a-input>
          </a-form-item>
         
          <a-form-item label="Otel Adı" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
            <a-input  v-model="form.name" />
          </a-form-item>
          <a-form-item label="Fiyat" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
            <a-input  v-model="form.price" />
          </a-form-item>
          
          <a-form-item label="Sıra no" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
            <a-input  v-model="form.sort_number" />
          </a-form-item>

         
            <a-form-item
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 17 }"
              label="Durum"
            >
              <a-radio-group buttonStyle="solid" v-model="form.is_active">
                <a-radio-button :value="1">{{$t('common.active')}}</a-radio-button>
                <a-radio-button :value="0">{{$t('common.passive')}}</a-radio-button>
              </a-radio-group>
            </a-form-item>

        </a-form>
        <div v-if="!form.id">
          <hr>
          <h4>Otel Arama</h4>
          <a-select class="w-100"
            show-search
            :value="value"
            placeholder="Traffics Bölge Arama"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            @search="handleSearch"
            @select="handleSelect"
            @change="handleChange"
          >
            <a-select-option v-for="d in searchData" :key="d.code" :value="d">
              {{ d.name }} - <b>{{ d.code}} </b>
            </a-select-option>
          </a-select>
        </div>
        <div class="drawer-bottom">
          <a-button @click="onClose" class="mr-2">{{$t('btn.cancel')}}</a-button>
          <a-button :loading="loading" @click="passes(onSubmit)" class="w-50" type="primary">
            <i class="la la-save mr-2"></i>
            {{$t('btn.save')}}
          </a-button>
        </div>
      </ValidationObserver>
    </a-drawer>
    
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
        value : '',
        searchData : [],
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
            title: "Giata Kod",
            dataIndex: "gid_id"
          },
          {
            title: "Ad",
            dataIndex: "name"
          },
          {
            title: "Ülke",
            dataIndex: "country_title",
          },
        
          {
            title: "Şehir",
            dataIndex: "city_title",
          },
          {
            title: "Sıra no",
            dataIndex: "sort_number",
          },
          {
            title: this.$t("btn.action"),
            scopedSlots: {customRender: "id"},
            width : 120,
          }
        ],
        visible: false,
        passModal: false,
        loading: false,
        form: {
          gid_id: null,
          name : '',
          country_code : '',
          country_title : '',
          city_title : '',
          city_code : '',
          sort_number :999,
          price : 200,
          is_active: 1
        }
      };
    },
    mounted() {
      this.$store.dispatch("block/favourite/get", {page: 1});
    },
    computed: {
      table() {
        return this.$store.state.block.favourite.table;
      },
    },

    methods: {
      handleSearch(value) {
        this.fetch(value, data => (this.searchData = data));
      },
      handleChange(value) {
        this.value = value;
        this.fetch(value, data => (this.searchData = data));
      },
      handleSelect(value,a,b){
        this.form.name = value.name;
        this.form.gid_id = value.code;
        this.form.city_code = value.location.code;
        this.form.city_title = value.location.name;
      },
      fetch(value,callback){

        let formData = new FormData();
        formData.append('q',value);
        this.$axios.post(`https://www.martireisen.at/service/engine/search/get`,formData).then((res) => {
          let val = res.data.data.response;
          let arr = val.giataHotelList;
          callback(arr);
          });

      },

      handleTableChange(pagination, filters, sorter, filtered, data) {
        if (filtered) {
          this.$store.dispatch("block/favourite/getFilteredData", {searchData: data, page: pagination});

        } else {
          this.$store.dispatch("block/favourite/get", {page: pagination});
        }
      },
      handleClickAction(name) {
        switch (name) {
          case "refresh":
            this.$store.dispatch("block/favourite/refresh");
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
      newForm(){
      
        this.form = {
          gid_id: null,
          name : '',
          country_code : '',
          country_title : '',
          city_title : '',
          city_code : '',
          sort_number :999,
          price : 999,
          is_active: 1
        }
        this.visible = true;
      },
      
      fetchPromo(id) {
        this.$axios.get(`/block/favourite/${id}`).then(res => {
          this.visible = true;
          this.form = res.data.data
        })
      },
      resolveState({errors, pending, valid}) {
        if (errors[0]) {
          return "error";
        }
        return "";
      },
      onClose() {
        this.visible = false;
        this.passModal = false;
        this.form = {}
      },
      onSubmit() {
        this.loading = true;

        if (this.form.id) {

          this.$axios.put("/block/favourite/" + this.form.id, this.form)
            .then(response => {
              this.$store.dispatch("block/favourite/refresh");
              this.onClose();
              this.onResponse(response);
            })
            .catch(error => {
              this.onFailure(error.response);
            });
        } else {
          this.$axios.post("/block/favourite/", this.form)
            .then(response => {
              this.$store.dispatch("block/favourite/refresh");
              this.onClose();
              this.onResponse(response);
            })
            .catch(error => {
              this.onFailure(error.response);
            });
        }
      },
      onResponse(response) {

        var result = response.data.data;
        if (!response.data.status) {
          return this.onFailure(response);
        }

        this.$notification["success"]({
          message: this.$t("messages.success"),
          description: this.$t("messages.action_ok"),
          placement: "bottomRight "
        });
        if (result.action == "insert") {
          this.visible = false;
        }
        this.loading = false;

      },
      onFailure(response) {
        this.$notification["error"]({
          message: this.$t("messages.warning"),
          description: response.data.message,
          placement: "bottomRight "
        });
        this.loading = false;
      },
      deleteRecord(id) {
        this.$store.dispatch("block/favourite/delete", {
          id: [id]
        });
      },
    }
  };
</script>
