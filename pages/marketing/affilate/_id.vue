<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>Reklam Linki Ekle / Düzenle</h5>
      <div class="d-flex">
        <nuxt-link to="/marketing/affilate">
          <a-button type="primary">
            <i class="la la-arrow-left"></i>
            {{ $t('btn.back')}}
          </a-button>
        </nuxt-link>
      </div>
    </div>

    <a-row :gutter="30">
      <a-col :span="24">
        <a-row :gutter="30">
          <ValidationObserver ref="observer" v-slot="{ passes }">
            <a-form class="form-vertical" layout="vertical">
              <a-col :span="18">
                <a-card>
                  <a-form-item
                    :label-col="{ span:4 }"
                    :wrapper-col="{ span: 20 }"
                    label="Reklam Tipi"
                  >
                    <a-select class="col-12 p-0" v-model="form.travel_api" style="width: 100%; ">
                      <a-select-option v-for="(d) in api" :key="d">{{d}}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item v-if="form.travel_api != 'Tour'"
                    :label-col="{ span:4 }"
                    :wrapper-col="{ span: 20 }"
                    label="Tatil Tipi"
                  >
                    <a-select class="col-12 p-0" v-model="form.travel_type" style="width: 100%; ">
                      <a-select-option v-for="(d) in types" :key="d.code">{{d.name}}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item v-if="form.travel_api != 'Tour'"
                    :label-col="{ span:4 }"
                    :wrapper-col="{ span: 20 }"
                    label="Bölge / Otel Seçimi"
                  >
                    <a-select class="col-12 p-0" v-model="form.destination_type" style="width: 100%; " v-on:change="results = []; form.destination_value = ''">
                      <a-select-option v-for="(d) in destination_types" :key="d.code">{{d.name}}</a-select-option>
                    </a-select>
                  </a-form-item>





                  <div class="row" v-if="form.travel_api == 'Tour'">
                    <div class="col-8">
                      <a-form-item
                        :label-col="{ span:6 }"
                        :wrapper-col="{ span: 18 }"
                        label="Tour Title"
                      >
                        <a-select class="col-12 p-0" v-model="form.destination_value" v-on:change="loadTourDates" style="width: 100%; ">
                          <a-select-option v-for="(d) in tours.tours" :key="d.id">{{d.title}}</a-select-option>
                        </a-select>
                      </a-form-item>
                    </div>
                    <div class="col-4">
                      <a-form-item
                        :label-col="{ span:6 }"
                        :wrapper-col="{ span: 18 }"
                        label="date"
                      >
                        <a-select class="col-12 p-0" v-model="form.date_start" style="width: 100%; ">
                          <a-select-option v-for="(d) in periods" :key="$moment(d.start_date_pretty,'DD.MM.YYYY').format('YYYY-MM-DD')">{{$moment(d.start_date_pretty,"DD.MM.YYYY").format('YYYY-MM-DD')}}</a-select-option>
                        </a-select>
                      </a-form-item>
                    </div>
                  </div>






                  <div class="row" v-if="form.travel_api != 'Tour'">
                    <div class="col-4">
                      <a-form-item
                        :label-col="{ span:12 }"
                        :wrapper-col="{ span: 12 }"
                        label="Başlangıç Tarihi"
                      >
                        <a-date-picker format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" class="w-100" v-model="form.date_start" />
                      </a-form-item>
                    </div>
                    <div class="col-4">
                      <a-form-item
                        :label-col="{ span:12 }"
                        :wrapper-col="{ span: 12 }"
                        label="Süre"
                      >
                      <a-input-number class="w-100" v-model="form.duration" :min="1" :max="365" />
                      </a-form-item>
                    </div>
                    <div class="col-4">
                      <a-form-item
                        :label-col="{ span:12 }"
                        :wrapper-col="{ span: 12 }"
                        label="Bitiş Tarihi"
                      >
                        <a-date-picker format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" class="w-100" v-model="form.date_end" />
                      </a-form-item>
                    </div>
                  </div>
                  <div class="row" v-if="form.travel_api != 'Tour'">
                    <div class="col-6">
                      <a-form-item
                        :label-col="{ span:8 }"
                        :wrapper-col="{ span: 16 }"
                        label="Yetişkin"
                      >
                        <a-input-number class="w-100" v-model="form.adult" :min="1" :max="10" />
                      </a-form-item>
                    </div>
                    <div class="col-6">
                      <a-form-item
                        :label-col="{ span:8 }"
                        :wrapper-col="{ span: 16 }"
                        label="Çocuk"
                      >
                        <a-input-number class="w-100" v-model="form.children" :min="1" :max="10" />
                      </a-form-item>
                    </div>
                  </div>

                  <a-form-item v-if="form.travel_api == 'TravelIT'"
                    :label-col="{ span:4 }"
                    :wrapper-col="{ span: 20 }"
                    label="Operatörler"
                  >
                    <a-checkbox-group v-model="form.operators">
                      <a-row>
                        <a-col :span="8" v-for="el in operators" :key="el.code">
                          <a-checkbox :value="el.code">{{el.name}}</a-checkbox>
                        </a-col>
                      </a-row>
                    </a-checkbox-group>
                  </a-form-item>
                  <a-form-item v-if="form.travel_api == 'TravelIT'"
                    :label-col="{ span:4 }"
                    :wrapper-col="{ span: 20 }"
                    label="Kalkış Havalimanı"
                  >
                    <a-select 
                      class="col-12 p-0"
                      v-model="form.departure_code"
                      style="width: 100%; "
                    >
                      <a-select-option v-for="(d) in airports" :key="d.code">{{d.name}}</a-select-option>
                    </a-select>
                  </a-form-item>

                  <a-form-item label="URL" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <input
                      class="ant-input"
                      placeholder=""
                      v-model="form.seo_url"
                    />
                  </a-form-item>
                  <a-form-item>
                  <a-button @click="passes(onSubmit)" class="save-btn w-100" type="primary">
                    <i class="la la-save mr-2"></i>
                    {{ $t('btn.save')}}
                  </a-button>
                </a-form-item>
                </a-card>
              </a-col>
              <a-col :span="6">
                  <a-card v-show="form.destination_type == 'state' || form.destination_type == 'hotel'">
                         <input
                      class="ant-input"
                      placeholder="Arama Yapıp Enter tuşlayın"
                      v-on:change="search"
                      v-model="search_value"
                    />
                     <a-radio-group name="radioGroup" v-model="form.destination_value" v-if="form.destination_type == 'state'">
                      <a-row>
                        <a-col :span="24" v-for="el in results" :key="el.code">
                          <a-radio class="mt-2" :value="el.code">{{el.value}} </a-radio>
                        </a-col>
                      </a-row>
                    </a-radio-group>
                     <a-radio-group name="radioGroup" v-model="form.destination_value" v-if="form.destination_type == 'hotel'">
                      <a-row>
                        <a-col :span="24" v-for="el in results" :key="el.code">
                          <a-radio class="mt-2" :value="el.code">{{el.name}} - {{ el.location.name}}</a-radio>
                        </a-col>
                      </a-row>
                    </a-radio-group>
                  </a-card>


                
              </a-col>
            </a-form>
          </ValidationObserver>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>


<script>
import ViTable from "@/components/vi-table";

export default {
  data() {
    return {
      base_url: process.env.url,
      data: {},
      language: "",
      visible: false,
      visiblevar: false,
      loading: false,
      search_value : "",
      types: [
        {
          code: 2,
          name: "Paket Tatil",
        },
        {
          code: 3,
          name: "Sadece Tatil",
        },
      ],
       destination_types: [
        {
          code: 'state',
          name: "Bölge Sayfası",
        },
        {
          code: 'hotel',
          name: "Otel Detay Sayfası",
        },
      ],
      
      api: ["TravelIT", "HalalBooking", "Tour"],
      form: {
        travel_api: "TravelIT",
        travel_type: 2,
        adult: 2,
        seo_url: "",
        date_start: this.$moment().add(7, "days").format('YYYY-MM-DD')  ,
        date_end: this.$moment().add(14, "days").format('YYYY-MM-DD'),
        departure_code: "",
        destination_type: "",
        destination_value: "",
        destination_name: "", 
        operators : [],
        duration: 0,
      },
      tourSearchData : {
        source: null,
        destination: null,
        date: null,
        sourceList: null,
        destinationList: null,
        dateList: null,
        showAll: false
      },
      countries: [],
      airports: [],
      operators: [],
      results : [],
      tours: [],
      periods: [],
    };
  },
  watch: {
    'form.duration'(){
      this.calcDates();
    },
    'form.date_start'(){
      this.calcDuration();
    },
    'form.date_end'(){
      this.calcDuration();
    }
  },
  mounted() {
    this.$store.dispatch("localization/languages/get", { page: 1 });

    this.$axios.get("/booking/engine/airport?limit=200").then((response) => {
      this.airports = response.data.data;
    });
    this.$axios.get("/booking/engine/operator?limit=200").then((response) => {
      this.operators = response.data.data;
    });
    this.$axios.get("/region/country?limit=500").then((response) => {
      this.countries = response.data.data;
    });
    // this.$axios.get("/booking/tour/tour/").then((response) => {
    //   this.tours = response.data.data;
    // });
    this.tourSearchData.showAll = true;
    this.$axios.post('/booking/tour/tour/search?active=1&ssr=1',this.tourSearchData)
      .then((response) => {
          this.tours = response.data.data;
    })
  },
  computed: {
    e() {
      return this.$store.state.tinymce;
    },
    languages() {
      return this.$store.state.localization.languages.table;
    },

    isTranslate() {
      return this.language != this.default_language;
    },
    isEditPage() {
      return this.$route.params.id > 0;
    },
  },
  methods: {
    search(){
        let data = new FormData;
        data.append("q",this.search_value);

        let prefix = this.form.destination_type == 'state' ? 'states' : 'hotels';
        this.$axios.post('/marketing/affilate/search-hotel/'+this.search_value,{api : this.form.travel_api})
        .then((response) => {
            this.results = response.data.data.giataHotelList;
          })
    },
    resolveState({ errors, pending, valid }) {
      if (errors[0]) {
        return "error";
      }
      return "";
    },
    calcDates()
    {
      let newVal = this.$moment(this.form.date_start).add(this.form.duration, "days").format('YYYY-MM-DD');
      if(newVal != this.form.date_end){
        this.form.date_end=newVal;
      }
    },
    calcDuration(){
      let newVal = this.form.duration = this.$moment(this.form.date_end).diff(this.form.date_start,"days")
      if(newVal != this.form.duration && newVal > 0){
        this.form.duration=newVal;
      }
    },
    onSubmit() {
      if(this.form.travel_api=="Tour"){
        this.form.date_end = "";
        this.form.departure_code = "";
        this.form.destination_name = "";
        this.form.destination_type = "Tour";
        this.form.duration = 0;
      }
        this.$axios
          .post("/marketing/affilate", this.form)
          .then((response) => {
            this.onResponse(response);
          })
          .catch((error) => {
            this.onFailure(error.response);
          });
    },

    onResponse(response) {
      let result = response.data.data;
      if (!response.data.status) {
        return this.onFailure(response);
      }

      this.$notification["success"]({
        message: this.$t("messages.success"),
        description: this.$t("messages.action_ok"),
        placement: "bottomRight ",
      });

     
        this.$router.push({
            path: "/marketing/affilate/"
        });
    },

    onFailure(response) {
      this.$notification["error"]({
        message: this.$t("messages.warning"),
        description: response.data.message,
        placement: "bottomRight ",
      });
    },
    loadTourDates(){
      let vue = this;
      vue.form.date_start = null;
      vue.periods = [];
      var tour = vue.tours.tours.filter(obj => obj.id == vue.form.destination_value);
      if(tour != null){
        vue.periods = tour[0].periods;
      }
    }

    
  },
};
</script>
