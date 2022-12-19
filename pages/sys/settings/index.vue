<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>{{ $t('pages.settings.title')}}</h5>
    </div>
    <div class="row">
      <div class="col-12 d-flex flex-wrap mb-5">
        <div
          class="card width-250 text-center mr-4 rounded-0 ng-star-inserted"
          v-bind:key="index"
          v-for="(module,index) in data"
        >
          <div class="card-header pt-3 pb-3">
            <div class="text-uppercase text-dark font-weight-bold">{{module.name}}</div>
          </div>
          <nuxt-link tag="div" :to="module.route" class="card-body pt-5 pb-5" tabindex="0">
            <div class="text-center">
              <i class="font-size-36 mt-5 mb-5" v-bind:class="module.icon"></i>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: []
    };
  },
  mounted() {
    this.fetch();
  },

  methods: {
    fetch(params = {}) {
      this.loading = true;
      this.$axios.get("/sys/settings/category").then(response => {
        this.data = response.data.data;
      });
    }
  }
};
</script>