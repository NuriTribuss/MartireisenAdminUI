<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>Turun Katılımcıları</h5>
      <div>
        <nuxt-link
          class="float-right ant-btn ant-btn-primary d-print-none"
          tabindex="0"
          tag="button"
          to="/booking/tour/report"
        >
          <span>
            <i class="fe fe-arrow-left"></i>
            <span class>{{ $t('common.back')}}</span>
          </span>
        </nuxt-link>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-md-3 col-lg-3">
        <div class="card" v-if="parent">
          <img class="w-100" :src="base_url+'/'+parent.tour.image"/>
          <div class="card-body mt-2">
              <h5 class="mb-3">{{parent.tour.title}}</h5>
              <p class="my-1">Tur Başlangıç : {{ $moment.unix(parent.period.start_date).format("DD/MM/YYYY")}}</p>
              <p class="my-1">Gezi Bölgesi : {{parent.tour.destination}} </p>
              <p class="my-1">Kontenjan : {{parent.period.max_count}} </p>
              <p class="my-1 text-underline"><u><b>Katılımcı : {{parent.period.max_count - parent.period.available_count}}</b></u></p>
              <p class="my-1">Boş Yer : {{parent.period.available_count}} </p>
              <a class=" d-print-none btn btn-success rounded-0 mt-3 mb-2 btn-block" target="_blank" :href="base_url+'/'+parent.tour.seo_url">Tur Sayfasını Aç</a>
              <button class="btn btn-primary btn-block rounded-0 d-print-none" onclick="window.print()">Yazdır</button>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-9 col-lg-9">
        <div class="card p-4" v-if="data.length == 0" >
          <a-empty>
            <span slot="description" class="font-size-16 mt-3">Henüz hiç bir katılımcı bulunmuyor..</span>
          </a-empty>
        </div>
        <div class="card mb-2" v-for="(book,index) in data" v-bind:key="index">
          <div class="card-body py-4">
            <h5>{{book.name}} {{book.surname}}</h5>
            <div class="row">
              <div class="col-12 col-md-5 col-lg-3">
                <div v-for="(person,subindex) in book.travellers" v-bind:key="subindex">
                  <span class="font-weight-bold">Katılımcı {{subindex+1}}</span>
                  : {{person.name}} {{person.surname}}
                </div>
              </div>
              <div class="col-12 col-md-6 col-lg-4">
                <div>
                  <i class="fe fe-mail mr-2"></i>
                  {{book.email}}
                </div>
                <div>
                  <i class="fe fe-phone mr-2"></i>
                  {{book.phone}}
                </div>
              </div>
              <div class="col-12 col-md-4 col-lg-4 d-print-none">
                 <div v-if="book.payment">
                  Ödeme Yöntemi :
                  {{book.payment.title}}
                </div>
                <div>
                  Ödeme Durumu :
                  <span v-if="book.status.id == 1">
                    <i class="fe fe-check-circle text-success"></i>
                  </span>
                   <span v-if="book.status.id == 0">
                    <i class="fe fe-alert-circle text-danger"></i>
                  </span>
                </div>
              </div>
              <div class="col-1 text-right d-print-none">
                <nuxt-link target="_blank" :to="'/booking/orders/'+book.id" class="btn btn-sm btn-primary">
                  <i class="fe fe-search"></i>
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      base_url : process.env.url,
      data: [],
      loading: false,
      form: {},
      parent : null
    };
  },
  mounted() {
    this.fetch();
  },

  methods: {
    fetch(params = {}) {
      this.loading = true;
      this.$axios
        .get("booking/tour/period/" + this.$route.params.id + "/list")
        .then(response => {
          this.data = response.data.data;
          this.parent = response.data.parent;
          console.log(this.parent)
        });
    },

    print() {
      
    }
  }
};
</script>
