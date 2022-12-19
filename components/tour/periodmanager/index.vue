<template>
  <a-skeleton :loading="loading" :title="false">
    <a-card>
      <a-form class="form-vertical" layout="vertical">
        <a-divider class="mb-3" orientation="left">{{$t('pages.tour_period.title')}}</a-divider>
        <div class="clearfix">
          <a-button-group class="float-right">
            <a-button v-on:click="insert({id :0})">
              <i class="fe fe-plus"></i>
            </a-button>
            <a-button v-on:click="refresh">
              <i class="fe fe-refresh-ccw"></i>
            </a-button>
          </a-button-group>
        </div>
        <a-table :dataSource="data" class="mt-2">
          <a-table-column
            :title="$t('pages.tour_period.cols.start')"
            data-index="start_date"
            key="start_date"
          >
            <template slot-scope="start_date">
              <span>{{$moment(start_date*1000).format('DD.MM.YYYY')}}</span>
            </template>
          </a-table-column>
          <a-table-column
            :title="$t('pages.tour_period.cols.start_hour')"
            data-index="start_hour"
            key="start_hour"
          ></a-table-column>
          <a-table-column
            :title="$t('pages.tour_period.cols.end')"
            data-index="end_date"
            key="end_date"
          >
            <template slot-scope="end_date">
              <span>{{$moment(end_date*1000).format('DD.MM.YYYY')}}</span>
            </template>
          </a-table-column>
          <a-table-column
            :title="$t('pages.tour_period.cols.max_count')"
            data-index="max_count"
            key="max_count"
          ></a-table-column>
          <a-table-column :title="$t('btn.action')" key="action" width="160px">
            <template slot-scope="text, record">
              <a-button class="mr-1" size="small" type="primary" v-on:click="fetchField(record)">
                <i class="fe fe-edit text-white"></i>
              </a-button>

              <a-popconfirm :title="$t('messages.sure_delete')" @confirm="deleteRecord(record.id)">
                <a-button class="mr-2" size="small" type="danger">
                  <a-icon type="delete" />
                </a-button>
              </a-popconfirm>
            </template>
          </a-table-column>
        </a-table>
      </a-form>

      <a-drawer
        :title="title"
        placement="right"
        :closable="true"
        @close="onClose"
        :visible="visible"
        width="700"
      >
        <ValidationObserver ref="observer" v-slot="{ passes }">
          <a-form>
            <a-divider>{{ $t('pages.information') }}</a-divider>
            <ValidationProvider name="name" rules="required" v-slot="slotProps">
              <a-form-item
                :label-col="{ span: 9 }"
                :wrapper-col="{ span: 15 }"
                :label="$t('pages.tour_period.cols.start')"
                :validateStatus="resolveState(slotProps)"
                :help="slotProps.errors[0]"
              >
                <a-date-picker format="DD-MM-YYYY" valueFormat="DD-MM-YYYY" v-model="form.start_date" />
              </a-form-item>
            </ValidationProvider>

            <a-form-item
              v-if="!isTranslate"
              :label-col="{ span: 9 }"
              :wrapper-col="{ span: 15 }"
              :label="$t('pages.tour_period.cols.start_hour')"
            >
              <a-input v-model="form.start_hour" placeholder="Örn : 07:00" />
            </a-form-item>
            <a-form-item
              :label-col="{ span: 9 }"
              :wrapper-col="{ span: 15 }"
              :label="$t('pages.tour_period.cols.end')"
            >
              <a-date-picker format="DD-MM-YYYY" valueFormat="DD-MM-YYYY" v-model="form.end_date" />
            </a-form-item>
            <a-form-item
              :label-col="{ span: 9 }"
              :wrapper-col="{ span: 15 }"
              :label="$t('pages.tour_period.cols.max_count')"
            >
              <a-input-number :min="1" v-model="form.max_count" />
            </a-form-item>
            <a-form-item :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }" label="Transfer">
              <a-input v-model="form.transfer" />
            </a-form-item>
          </a-form>
          <div v-if="form.id > 0">
            <a-divider class="mt-4">{{$t('pages.tour_station.title')}}</a-divider>
            <div class="clearfix">
              <a-button-group class="float-right">
                <a-button v-on:click="insertStation({id :0 , period_id : form.id})">
                  <i class="fe fe-plus"></i>
                </a-button>
                <a-button v-on:click="refreshStation(form.id)">
                  <i class="fe fe-refresh-ccw"></i>
                </a-button>
              </a-button-group>
            </div>
            <a-table :dataSource="stations" class="mt-2">
              <a-table-column
                :title="$t('pages.tour_station.cols.station')"
                data-index="station"
                key="station"
              ></a-table-column>
              <a-table-column
                :title="$t('pages.tour_station.cols.hour')"
                data-index="hour"
                key="hour"
              ></a-table-column>
              <a-table-column
                :title="$t('pages.tour_station.cols.price')"
                data-index="price"
                key="price"
              ></a-table-column>
              <a-table-column
                :title="$t('pages.tour_station.cols.price_child')"
                data-index="child_price"
                key="child_price"
              ></a-table-column>
              <a-table-column
                :title="$t('pages.tour_station.cols.sort')"
                data-index="sort_number"
                key="sort_number"
              ></a-table-column>
              <a-table-column :title="$t('btn.action')" key="action" width="110px">
                <template slot-scope="text, a">
                  <a-button
                    class="mr-1"
                    size="small"
                    type="primary"
                    v-on:click="fetchFieldStation(a)"
                  >
                    <i class="fe fe-edit text-white"></i>
                  </a-button>

                  <a-popconfirm :title="$t('messages.sure_delete')" @confirm="deleteStation(a.id)">
                    <a-button class="mr-2" size="small" type="danger">
                      <a-icon type="delete" />
                    </a-button>
                  </a-popconfirm>
                </template>
              </a-table-column>
            </a-table>
            <a-drawer
              :title="title"
              placement="right"
              :closable="true"
              @close="onCloseStation"
              :visible="visibleStation"
              width="500"
            >
              <a-form>
                <a-divider>Durak Bilgileri</a-divider>
                <a-form-item
                  :label-col="{ span: 9 }"
                  :wrapper-col="{ span: 15 }"
                  :label="$t('pages.tour_station.cols.station')"
                >
                  <a-input v-model="stationForm.station" />
                </a-form-item>

                <a-form-item
                  v-if="!isTranslate"
                  :label-col="{ span: 9 }"
                  :wrapper-col="{ span: 15 }"
                  :label="$t('pages.tour_station.cols.hour')"
                >
                  <a-input v-model="stationForm.hour" placeholder="Örn : 07:00"/>
                </a-form-item>
                <a-form-item
                  :label-col="{ span: 9 }"
                  :wrapper-col="{ span: 15 }"
                  :label="$t('pages.tour_station.cols.price')"
                >
                  <a-input-number :min="1" v-model="stationForm.price" />
                </a-form-item>
                <a-form-item
                  :label-col="{ span: 9 }"
                  :wrapper-col="{ span: 15 }"
                  :label="$t('pages.tour_station.cols.price_child')"
                >
                  <a-input-number :min="1" v-model="stationForm.child_price" />
                </a-form-item>
                <a-form-item
                  :label-col="{ span: 9 }"
                  :wrapper-col="{ span: 15 }"
                  :label="$t('pages.tour_station.cols.sort')"
                >
                  <a-input-number :min="1" v-model="stationForm.sort_number" />
                </a-form-item>
              </a-form>
              <div class="drawer-bottom">
                <a-button class="mr-2" @click="onCloseStation">{{$t('btn.cancel')}}</a-button>
                <a-button :loading="loading" class="w-50" @click="onSubmitStation" type="primary">
                  <i class="fe fe-save mr-2"></i>
                  {{$t('btn.save')}}
                </a-button>
              </div>
            </a-drawer>
          </div>

          <div class="drawer-bottom">
            <a-button class="mr-2" @click="onClose">{{$t('btn.cancel')}}</a-button>
            <a-button :loading="loading" class="w-50" @click="passes(onSubmit)" type="primary">
              <i class="fe fe-save mr-2"></i>
              {{$t('btn.save')}}
            </a-button>
          </div>
        </ValidationObserver>
      </a-drawer>
    </a-card>
  </a-skeleton>
</template>

<script>
export default {
  props: ["tour_id", "languages"],
  name: "PeriodManager",

  data() {
    return {
      dateFormat: 'DD-MM-YYYY',
      fieldData: {},
      stationData: {},
      data: [],
      loading: true,
      visible: false,
      visibleStation: false,
      language: "",
      default_language: "",
      form: {
        start_date: "",
        end_date: "",
        max_count: "",
        start_hour: "",
        transfer: "",
        tour_id: this.tour_id
      },
      stationForm: {
        child_price: "",
        hour: "",
        price: "",
        station: "",
        sort_number: "",
        period_id: 0
      },
      stations: [],
      title: ""
    };
  },
  computed: {
    isTranslate() {
      return this.language != this.default_language;
    }
  },
  methods: {
    fetch() {
      this.loading = true;
      this.$axios
        .get("/booking/tour/tour/" + this.tour_id + "/period")
        .then(r => {
          this.loading = false;
          this.data = r.data.data;
        });
    },

    fetchStations(period_id) {
      this.$axios
        .get("/booking/tour/station?period_id=" + period_id)
        .then(response => {
          this.stations = response.data.data;
        });
    },

    fetchField(record) {
      this.language = "";
      this.resetData();

      this.visible = true;

      let result = this.$axios
        .get("/booking/tour/period/" + record.id)
        .then(response => {
          this.fieldData = response.data.data;
          this.form.id = this.fieldData.id;
          this.form.start_date = (this.fieldData.start_date_beautify);
          this.form.start_hour = this.fieldData.start_hour;
          this.form.end_date =  (this.fieldData.end_date_beautify);
          this.form.max_count = this.fieldData.max_count;
          this.form.transfer = this.fieldData.transfer;
          this.form.tour_id = this.fieldData.tour_id;
          this.default_language = this.language;
        });
      this.fetchStations(record.id);

      return result;
    },

    fetchFieldStation(record) {
      this.resetStationData();
      this.visibleStation = true;

      let result = this.$axios
        .get("/booking/tour/station/" + record.id)
        .then(response => {
          this.stationData = response.data.data;
          this.stationForm.id = this.stationData.id;
          this.stationForm.hour = this.stationData.hour;
          this.stationForm.station = this.stationData.station;
          this.stationForm.child_price = this.stationData.child_price;
          this.stationForm.price = this.stationData.price;
          this.stationForm.sort_number = this.stationData.sort_number;
          this.stationForm.period_id = this.stationData.period_id;
        });

      return result;
    },

    refresh() {
      this.fetch();
    },

    refreshStation(period_id) {
      this.fetchStations(period_id)
    },

    onClose() {
      this.visible = false;
    },
    onCloseStation() {
      this.visibleStation = false;
    },

    resolveState({ errors, pending, valid }) {
      if (errors[0]) {
        return "error";
      }
      return "";
    },

    resetData() {
      this.form = {
        start_date: "",
        end_date: "",
        max_count: "",
        start_hour: "",
        transfer: "",
        tour_id: this.tour_id
      };
    },

    resetStationData() {
      this.stationForm = {
        child_price: "",
        hour: "",
        price: "",
        station: "",
        sort_number: "",
        period_id: 0
      };
    },

    insert(record) {
      this.visible = true;

      this.resetData();
      this.title = this.$t("btn.add");
    },

    insertStation(record) {
      this.visibleStation = true;

      this.resetStationData();
      this.stationForm.period_id = record.period_id;
      this.title = this.$t("btn.add");
    },

    deleteRecord(id) {
      this.$axios
        .delete("/booking/tour/period/" + id)
        .then(response => {
          if (response.data.status) {
            this.$message.success(this.$t("messages.delete_ok"));
            this.fetch();
          } else {
            this.$message.error(response.data.message);
          }
        })
        .catch(error => {});
    },
    deleteStation(id) {
      this.$axios
        .delete("/booking/tour/station/" + id)
        .then(response => {
          if (response.data.status) {
            this.$message.success(this.$t("messages.delete_ok"));
              this.fetchStations(this.form.id);
          } else {
            this.$message.error(response.data.message);
          }
        })
        .catch(error => {});
    },

    onSubmit() {
      this.loading = true;

      if (this.form.id) {
        let extra = this.language != this.default_language ? "/translate" : "";

        this.$axios
          .put("/booking/tour/period/" + this.form.id + extra, this.form)
          .then(response => {
            this.onResponse(response);
          })
          .catch(error => {
            this.onFailure(error.response);
          });
      } else {
        this.$axios
          .post("/booking/tour/period", this.form)
          .then(response => {
            this.onResponse(response);
          })
          .catch(error => {
            this.onFailure(error.response);
          });
      }
    },
    onSubmitStation() {
      if (this.stationForm.id) {
        this.$axios
          .put("/booking/tour/station/" + this.stationForm.id, this.stationForm)
          .then(response => {
              this.onResponseStation(response);
          })
          .catch(error => {
            this.onFailure(error.response);
          });
      } else {
        this.$axios
          .post("/booking/tour/station", this.stationForm)
          .then(response => {
             this.onResponseStation(response);
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
      this.onClose();
      this.loading = false;
      this.fetch();
    },

    onResponseStation(response) {
      var result = response.data.data;
      if (!response.data.status) {
        return this.onFailureStation(response);
      }

      this.$notification["success"]({
        message: this.$t("messages.success"),
        description: this.$t("messages.action_ok"),
        placement: "bottomRight "
      });
      if (result.action == "insert") {
        this.visibleStation = false;
      }
      this.onCloseStation();
      this.fetchStations(form.id);
    },

    onFailure(response) {
      this.$notification["error"]({
        message: this.$t("messages.warning"),
        description: response.data.message,
        placement: "bottomRight "
      });
      this.loading = false;
    }
  },

  mounted() {
    this.fetch();
  }
};
</script>
