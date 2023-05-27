<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>{{ $t("pages.booking.cols.pnr") }} : #{{ data.code }}</h5>
      <div>
        <nuxt-link
          class="float-right ant-btn ant-btn-primary"
          tabindex="0"
          tag="button"
          to="/booking/orders"
        >
          <span>
            <i class="la la-arrow-left"></i>
            <span class>{{ $t("common.back") }}</span>
          </span>
        </nuxt-link>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-lg-9">
        <div class="card mb-3">
          <div class="card-body py-3">
            <h5>
              {{ data.hotel_name }}
              <span v-if="data.offer">
                / <b>{{ data.offer.commonOffer.travelType }}</b></span
              >
            </h5>
            <hr />
            <div class="row">
              <div class="col-2">
                <img
                  class="w-100"
                  src="https://thumbnails.travel-it.com/g2thmb.php?gid="
                />
              </div>
              <div class="col-4">
                <div>
                  <b>{{ $t("pages.booking.cols.location") }} :</b>
                  {{ data.travel_city }}
                </div>
                <div>
                  <b>{{ $t("pages.booking.cols.operator") }} :</b>
                  {{ data.operator }}
                </div>
                <div v-if="data.offer">
                  <b>Pansiyon :</b>
                  {{ data.offer.commonOffer.hotelOffer.boardType.name }}/{{
                    data.offer.commonOffer.hotelOffer.boardType.code
                  }}
                </div>
                <div v-if="data.offer">
                  <b>Oda :</b>
                  {{ data.offer.commonOffer.hotelOffer.roomType.name }} /
                  {{ data.offer.commonOffer.hotelOffer.roomType.code }}
                </div>
              </div>
              <div class="col-4">
                <div>
                  <b>{{ $t("pages.booking.cols.start") }} :</b>
                  {{ data.start }}
                </div>
                <div>
                  <b>{{ $t("pages.booking.cols.end") }} :</b>
                  {{ data.end }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card mb-3">
          <div class="card-body py-3">
            <div class="mb-4 font-weight-bold">
              {{ $t("pages.booking.flight") }}
            </div>
            <div
              class="row"
              v-if="data.offer && data.offer.commonOffer.flightOffer"
            >
              <div class="col-6">
                <div
                  v-for="(flight, index) in data.offer.commonOffer.flightOffer
                    .flight.outbound.legList"
                  v-bind:key="index"
                >
                  <div>
                    <i class="la la-arrow-up-right mr-2"></i>
                    {{ flight.departureAirportName }}
                    {{ flight.departureDate }} {{ flight.departureTime }}
                  </div>
                  <div>
                    <i class="la la-map-pin mr-2"></i>
                    {{ flight.arrivalAirportName }}
                  </div>
                  <div>
                    <i class="la la-file mr-2"></i>
                    Uçuş Num.{{ flight.flightNumber }}
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div
                  v-for="(flight, index) in data.offer.commonOffer.flightOffer
                    .flight.inbound.legList"
                  v-bind:key="index"
                >
                  <div>
                    <i class="la la-arrow-up-left mr-2"></i>
                    {{ flight.departureAirportName }}
                    {{ flight.departureDate }} {{ flight.departureTime }}
                  </div>
                  <div>
                    <i class="la la-map-pin mr-2"></i>
                    {{ flight.arrivalAirportName }}
                  </div>
                  <div>
                    <i class="la la-file mr-2"></i>
                    Uçuş Num.{{ flight.flightNumber }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-body py-3">
            <div class="mb-3 font-weight-bold">
              {{ $t("pages.booking.contact") }}
            </div>

            <div class="row">
              <div class="col-6">
                <div>
                  <b>{{ $t("pages.booking.cols.name") }} :</b>
                  {{ data.name }}
                </div>
                <div>
                  <b>{{ $t("pages.booking.cols.surname") }} :</b>
                  {{ data.surname }}
                </div>
                <div>
                  <b>{{ $t("pages.booking.cols.birthday") }} :</b>
                  {{ data.birthday }}
                </div>
              </div>
              <div class="col-6">
                <div>
                  <i class="la la-mail mr-2"></i>
                  {{ data.email }}
                </div>
                <div>
                  <i class="la la-phone mr-2"></i>
                  {{ data.phone }}
                </div>
                <div>
                  <i class="la la-map-pin mr-2"></i>
                  {{ data.address }} / {{ data.city }} / {{ data.country }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-lg-6">
            <div class="card">
              <div class="card-body">
                <div
                  class="mb-3 font-weight-bold d-flex justify-content-between"
                >
                  {{ $t("pages.booking.cols.adult") }}
                  <button
                    class="btn btn-sm btn-success"
                    v-on:click="addTraveller('adult')"
                  >
                    Ekle
                  </button>
                </div>
                <div
                  class="d-flex flex-nowrap align-items-center mb-3"
                  v-for="(person, index) in data.travellers"
                  v-bind:key="index"
                  v-if="person.is_children == 0"
                >
                  <div class="air__utils__avatar--size46 mr-3 flex-shrink-0">
                    <a-avatar
                      class="mt-1"
                      style="color: #f56a00; backgroundcolor: #fde3cf"
                      :size="42"
                      >{{ person.name[0] }}</a-avatar
                    >
                  </div>
                  <div class="flex-grow-1 index_info_1s5ZY">
                    <div
                      class="text-uppercase font-size-16 text-truncate d-flex justify-content-between"
                    >
                      {{ person.name }} {{ person.surname }}
                      <a-popconfirm
                        :title="$t('messages.sure_delete')"
                        @confirm="deleteTraveller(person.id)"
                      >
                        <a-button type="danger">
                          <a-icon type="delete" />
                        </a-button>
                      </a-popconfirm>
                    </div>
                    <div
                      class="text-dark font-size-12 text-gray-6 text-truncate"
                    >
                      <i class="la la-calendar mr-2"></i>
                      {{ person.birthday }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-6">
            <div class="card">
              <div class="card-body">
                <div
                  class="mb-3 font-weight-bold d-flex justify-content-between"
                >
                  {{ $t("pages.booking.cols.children") }}
                  <button
                    class="btn btn-sm btn-success"
                    v-on:click="addTraveller('children')"
                  >
                    Ekle
                  </button>
                </div>
                <div
                  class="d-flex flex-nowrap align-items-center mb-3"
                  v-for="(person, index) in data.travellers"
                  v-bind:key="index"
                  v-if="person.is_children == 1"
                >
                  <div class="air__utils__avatar--size46 mr-3 flex-shrink-0">
                    <a-avatar
                      class="mt-1"
                      style="color: #f56a00; backgroundcolor: #fde3cf"
                      :size="42"
                      >{{ person.name[0] }}</a-avatar
                    >
                  </div>
                  <div class="flex-grow-1 index_info_1s5ZY">
                    <div class="text-uppercase font-size-16 text-truncate">
                      {{ person.name }} {{ person.surname }}
                      <a-popconfirm
                        :title="$t('messages.sure_delete')"
                        @confirm="deleteTraveller(person.id)"
                      >
                        <a-button type="danger">
                          <a-icon type="delete" />
                        </a-button>
                      </a-popconfirm>
                    </div>
                    <div
                      class="text-dark font-size-12 text-gray-6 text-truncate"
                    >
                      <i class="la la-calendar mr-2"></i>
                      {{ person.birthday }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-body py-3">
            <div class="mb-3 font-weight-bold">
              {{ $t("pages.booking.comment") }}
            </div>
            <div class="row">
              <div class="col-12">
                <a-form-item :wrapper-col="{ span: 24 }">
                  <textarea
                    :rows="3"
                    :placeholder="$t('pages.booking.comment_placeholder')"
                    v-model="note"
                    class="ant-input"
                  ></textarea>
                </a-form-item>
              </div>
              <div class="col-12 text-right">
                <button @click="addNote" class="btn btn-primary">submit</button>
              </div>
            </div>
            <div class="row">
              <a-drawer
                :closable="true"
                @close="
                  () => {
                    note_edit_visible = false;
                  }
                "
                :title="$t('pages.engine_airport.detail')"
                :visible="note_edit_visible"
                placement="right"
                width="500"
              >
                <div class="row">
                  <div class="col-12" v-if="editable_note">
                    <a-form-item :wrapper-col="{ span: 24 }">
                      <textarea
                        :rows="3"
                        :placeholder="$t('pages.booking.comment.placeholder')"
                        v-model="editable_note.comment"
                        class="ant-input"
                      ></textarea>
                    </a-form-item>
                  </div>
                  <div class="col-12 text-right">
                    <button @click="updateNote" class="btn btn-primary">
                      submit
                    </button>
                  </div>
                </div>
              </a-drawer>
              <div
                class="col-12 mt-2"
                v-for="(item, index) in data.notes"
                v-bind:key="index"
              >
                <hr />
                <div class="d-flex flex-nowrap align-items-center mb-3">
                  <div class="air__utils__avatar--size46 mr-3 flex-shrink-0">
                    <a-avatar
                      class="mt-1"
                      style="color: #f56a00; backgroundcolor: #fde3cf"
                      :size="42"
                      >{{ item.user_id }}</a-avatar
                    >
                  </div>
                  <div class="flex-grow-1 justify-content-between d-flex index_info_1s5ZY">
                    <div>
                      <div
                        class="text-uppercase font-size-16 text-truncate w-100"
                      >
                        {{ (item.user)?item.user.firstname + " " + item.user.lastname:$t('custommer') }}
                      </div>

                      <p>
                        {{ item.comment }}
                      </p>
                      
                    
                  
                  <div class="text-dark font-size-12 text-gray-6 text-truncate">
                    <i class="la la-calendar mr-2"></i>
                    {{ item.created_at }}
                  </div>
                    </div>
                    <div v-if="$auth.user.id===item.user_id">
                      <a-popconfirm :title="$t('messages.sure_delete')" @confirm="destroyNote(item.id)">
                        <a-button type="danger">
                          <a-icon type="delete" />
                        </a-button>
                      </a-popconfirm>
                      <a-button @click="editNote(item)" type="edit">
                        <a-icon type="edit" />
                      </a-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-3">
        <div class="card">
          <div class="card-body">
            <div class="mb-3 font-weight-bold">
              {{ $t("pages.booking.payment_info") }}
            </div>
            <div class="font-size-28 text-warning">
              {{ format(data.amount) }} {{ data.currency }}
            </div>
            <div class="mt-3" v-if="data.payment">
              <span>{{ $t("pages.booking.payment_method") }} :</span>
              {{ data.payment.title }}
            </div>
            <div v-if="data.status">
              <span>{{ $t("pages.booking.payment_status") }} :</span>
              {{ data.status.title }}
            </div>
            <div>
              <span>Transaction :</span>
              {{ data.transaction_id }}
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <div class="mb-3 font-weight-bold">
              {{ $t("pages.booking.api_info") }}
            </div>
            <table class="table table-bordered table-striped">
              <tbody>
                <tr>
                  <td>Api</td>
                  <td>{{ data.source }}</td>
                </tr>
                <tr>
                  <td>Booking Type</td>
                  <td>Soft</td>
                </tr>
                <tr>
                  <td>Booking No</td>
                  <td>{{ data.api_code }}</td>
                </tr>
                <tr>
                  <td>{{ $t("pages.booking.cols.operator") }}</td>
                  <td>{{ data.operator }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card py-3">
          <div class="card-body">
            <a-select v-model="form.status" class="w-100 rounded-0 mb-3">
              <a-select-option :value="0">Ödeme Bekleniyor</a-select-option>
              <a-select-option :value="1">Onaylı</a-select-option>
              <a-select-option :value="2">İptal Edildi</a-select-option>
            </a-select>
            <a class="btn btn-success btn-block" @click="change_status">{{
              $t("pages.booking.change_status")
            }}</a>
            <hr />
            <a class="btn btn-secondary btn-block" @click="change_mode"
              >Gerçek rezervasyona dönüştür</a
            >
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="card">
          <div class="card-header">{{ $t("pages.booking.history") }}</div>
          <div class="card-body">
            <a-list item-layout="horizontal" :data-source="logs">
              <a-list-item slot="renderItem" slot-scope="item, index">
                <a-list-item-meta>
                  <div slot="description">
                    <b>Ip : </b>{{ item.ip }}
                    <span class="float-right">{{ item.created_at }}</span>
                  </div>
                  <a slot="title">{{ item.message }}</a>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </div>
        </div>
      </div>
    </div>
    <a-drawer
      :closable="false"
      title="Yolcu Ekle"
      :visible="visible"
      @close="onClose"
      placement="right"
      width="500"
    >
      <ValidationObserver ref="observer" v-slot="{ passes }">
        <a-form>
          <a-form-item
            label="Yolcu Adı"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 17 }"
          >
            <a-input v-model="traveller.name"></a-input>
          </a-form-item>

          <a-form-item
            label="Yolcu Soyadı"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 17 }"
          >
            <a-input v-model="traveller.surname" />
          </a-form-item>

          <a-form-item
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 17 }"
            label="Cinsiyet"
          >
            <a-select v-model="traveller.gender">
              <a-select-option :value="1">Kadın</a-select-option>
              <a-select-option :value="2">Erkek</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
        <div class="drawer-bottom">
          <a-button @click="onClose" class="mr-2">{{
            $t("btn.cancel")
          }}</a-button>
          <a-button
            :loading="loading"
            @click="passes(saveTraveller)"
            class="w-50"
            type="primary"
          >
            <i class="la la-save mr-2"></i>
            {{ $t("btn.save") }}
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
      data: {},
      logs: [],
      visible: false,
      loading: false,
      form: {
        status: 0,
      },
      traveller: {
        booking_code: "",
        name: "",
        gender: 1,
        surname: "",
        is_children: 0,
      },
      note: "",
      note_edit_visible: false,
      editable_note: null,
    };
  },
  mounted() {
    this.fetch();
    this.log();
  },
  methods: {
    format(data) {
      return parseFloat(data).toFixed(2);
    },
    fetch(params = {}) {
      this.loading = true;
      this.$axios
        .get("booking/booking/" + this.$route.params.id)
        .then((response) => {
          this.data = response.data.data;
          this.form.status = this.data.status.id;
          this.loading = false;
        });
    },
    editable() {
      return this.data.source == "Tour" && this.data.payment_method == 1;
    },

    addTraveller(param) {
      this.traveller.booking_code = this.data.code;
      if (param == "children") {
        this.traveller.is_children = 1;
      }
      this.visible = true;
    },

    saveTraveller() {
      this.$axios
        .put("/booking/booking/add-traveller", this.traveller)
        .then((response) => {
          this.onResponse(response);
          this.visible = false;
          this.fetch();
        })
        .catch((error) => {
          this.onFailure(error.response);
        });
    },

    deleteTraveller(id) {
      this.$axios
        .put("/booking/booking/delete-traveller", {
          id: id,
          booking_code: this.data.code,
        })
        .then((response) => {
          this.onResponse(response);
          this.fetch();
        })
        .catch((error) => {
          this.onFailure(error.response);
        });
    },

    onClose() {
      this.visible = false;
    },

    log(params = {}) {
      this.$axios
        .get("booking/booking/" + this.$route.params.id + "/log")
        .then((response) => {
          this.logs = response.data.data;
        });
    },
    change_status() {
      this.$axios
        .put("/booking/booking/" + this.$route.params.id, this.form)
        .then((response) => {
          this.onResponse(response);
        })
        .catch((error) => {
          this.onFailure(error.response);
        });
    },

    change_mode() {
      if (confirm("Bu işlemi yapmak istediğinizden emin misiniz ? ")) {
        this.$axios
          .post("/booking/booking/approve/" + this.$route.params.id)
          .then((response) => {
            console.log(response);
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
    },
    onFailure(response) {
      this.$notification["error"]({
        message: this.$t("messages.warning"),
        description: response.data.message,
        placement: "bottomRight ",
      });
    },
    addNote() {
      this.$axios
        .post("/booking/booking/addnote/" + this.$route.params.id, {
          comment: this.note,
        })
        .then((response) => {
          this.note=""
          this.fetch();
          this.log();
        })
        .catch((error) => {
          //this.onFailure(error.response);
        });
    },
    editNote(note) {
      this.editable_note = note;
      this.note_edit_visible = true;

      console.log(this.editable_note);
    },
    updateNote() {
      if (!this.editable_note) return;
      this.$axios
        .post("/booking/booking/updatenote/" + this.editable_note.id, {
          comment: this.editable_note.comment,
        })
        .then((response) => {
          this.editable_note = null;
          this.note_edit_visible = false;
          this.fetch();
          this.log();
        })
        .catch((error) => {
          //this.onFailure(error.response);
        });
    },
    destroyNote(id) {
      this.$axios
        .delete("/booking/booking/destroynote/" + id)
        .then((response) => {
          this.fetch();
          this.log();
        })
        .catch((error) => {
          //this.onFailure(error.response);
        });
    },
  },
};
</script>
