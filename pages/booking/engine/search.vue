<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>Arama Motoru Ayarları</h5>
    </div>
    <div class="bg-white p-3">
      <div class="mb-2 d-flex">
        <select class="form-control w-25 mr-2" v-model="filter.type" v-on:change="load()">
          <option value="">Tüm Bölgeler</option>
          <option value="country">Ülke</option>
          <option value="region">Bölge - Şehir</option>
          <option value="location">İlçe - Kasaba</option>
        </select>
        <select class="form-control w-25 mr-2" v-model="filter.country_code" v-on:change="load()">
          <option value="">Tüm Ülkeler</option>
          <option v-for="country in countries" v-bind:key="country.id" :value="country.iso2">{{ country.name }}</option>
         
        </select>
         <select class="form-control w-25 d-none" v-model="filter.state_code" v-on:change="load()">
          <option value="">Tüm Bölgeler</option>
          <option v-for="state in states" v-bind:key="state.id" :value="state.code">{{ state.name }}</option>
         
        </select>
      </div>
      <table class="table table-bordered bg-white">
        <thead>
          <tr>
            <th style="width: 100px">Kod</th>
            <th style="width: 120px">Traffics Code</th>
            <th style="width: 120px">Bölge Tipi</th>
            <th style="width: 200px">Bölge Adı</th>
            <th>Arama Kelimeleri</th>
            <th>Düzenle</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in data" v-bind:key="element.id">
            <td>{{ element._source.code }}</td>
            <td><span>{{ element._source.traffics_code}} </span><span  class="badge badge-danger" v-if="!element._source.traffics_code">Boş</span></td>
            <td>{{ element._source.type }}</td>
            <td>{{ element._source.name }}</td>
            <td>{{ element._source.keywords }} </td>
            <td><button class="btn btn-success btn-sm" v-on:click="fetchEl(element)"><i class="fe fe-edit"></i></button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <a-drawer
      :closable="false"
      title="Düzenle"
      :visible="visible"
      @close="onClose"
      placement="right"
      width="500"
    >
      <ValidationObserver ref="observer" v-slot="{ passes }">
        <a-form>

         
          <a-form-item label="Bölge Adı" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
            <a-input  v-model="form.name" />
          </a-form-item>
           <a-form-item label="Traffics Code" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
            <a-input  v-model="form.traffics_code" />
          </a-form-item>
          <a-form-item label="Type" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
            <select class="ant-input" v-model="form.type "> 
            <option value="">Bilinmiyor</option>
            <option value="country">Ülke</option>
            <option value="region">Bölge - Şehir</option>
            <option value="location">İlçe Kasaba</option>
            </select>
          </a-form-item>
          
          <a-form-item label="Arama Kelimeleri" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
            <a-textarea  style="height:200px" v-model="form.keywords" />
          </a-form-item>
          <div class="alert alert-info">virgül işaretiyle birden fazla kelime girebilirsiniz.<br>Örn : antalya,belek,side</div>
            
            <a-select
    show-search
    :value="value"
    placeholder="Traffics Bölge Arama"
    :default-active-first-option="false"
    :show-arrow="false"
    :filter-option="false"
    :not-found-content="null"
    @search="handleSearch"
    @change="handleChange"
  >
    <a-select-option v-for="d in searchData" :key="d.code">
      {{ d.name }} - <b>{{ d.code}} </b>
       <span v-if="d.region">İlçe -  Kasaba</span>
       <span v-if="d.superRegion">Bölge - Şehir</span>
    </a-select-option>
  </a-select>
        </a-form>
        <div class="drawer-bottom">
          <a-button @click="onClose" class="mr-2">{{$t('btn.cancel')}}</a-button>
          <a-button :loading="loading" @click="passes(onSubmit)" class="w-50" type="primary">
            <i class="fe fe-save mr-2"></i>
            {{$t('btn.save')}}
          </a-button>
        </div>
      </ValidationObserver>
    </a-drawer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      passModal: false,
      loading: false,
      data: [],
      searchData : [],
      value: undefined,
      filter : {
        type : '',
        state_code : '',
        country_code : '',
      },
      form : {
        id : 0
      },
      countries : [],
      states : []
    };
  },
  mounted() {
    this.load();
    this.loadCountries();
    this.loadStates();
  },

  methods: {
    handleSearch(value) {
      this.fetch(value, data => (this.searchData = data));
    },
    handleChange(value) {
      this.value = value;
      this.fetch(value, data => (this.searchData = data));
    },
    fetch(value,callback){

       let formData = new FormData();
       formData.append('q',value);
       formData.append('loc',1);
       this.$axios.post(`https://www.martireisen.at/service/engine/search/get`,formData).then((res) => {
         let val = res.data.data.response;
         let arr = val.regionList.concat(val.locationList).concat(val.countryList);
         callback(arr);
        });

    },
    load() {
      this.$axios.get(`/booking/engine/search/`, { params : this.filter}).then((res) => {
        this.data = res.data.data;
      });
    },
     loadCountries() {
      this.$axios.get(`/region/country/`, { params :   { limit : 300}}).then((res) => {
        this.countries = res.data.data;
      });
    },
     loadStates() {
      this.$axios.get(`/booking/engine/search/`, { params : this.filter}).then((res) => {
        this.states = res.data.data;
      });
    },
    onClose() {
      this.visible = false;
      this.passModal = false;
      this.form = {};
    },
    fetchEl(el) {
        this.visible  = true;
        if(Array.isArray(el._source.keywords)){
          el._source.keywords = el._source.keywords.join(',');
        }
        this.form     = el._source;
        this.form._id = el._id;
        console.log(this.form);
    },
    onSubmit() {
      this.loading = true;

      if (this.form._id) {
        this.$axios
          .put("/booking/engine/search/" + this.form.id , this.form)
          .then((response) => {
           
            this.onClose();
            this.onResponse(response);
          })
          .catch((error) => {
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
        placement: "bottomRight ",
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
        placement: "bottomRight ",
      });
      this.loading = false;
    },
    deleteRecord(id) {
      this.$store.dispatch("booking/engine/airport/delete", {
        id: [id],
      });
    },
  },
};
</script>
