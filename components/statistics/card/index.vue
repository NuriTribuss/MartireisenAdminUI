<template>
  <a-skeleton :loading="loading" :title="false">
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-8">
            <div class="text-dark font-size-15 font-weight-bold mb-1">{{ title }}</div>
            <div
              class="font-weight-bold font-size-28 text-dark mb-2"
            >
            <span v-if="module == 'booking'"> {{ summary.total_amount }} {{unit[module]}}</span>
            <span v-if="module == 'member'"> {{ summary.total_record }} {{unit[module]}}</span>
            </div>
          </div>
          <div class="col-4 text-right">
            <i class="font-size-36 mt-5 mb-5 fe" :class="icon[module]"></i>
          </div>
        </div>
        <hr />
        <span>
          <i class="fe fe-calendar mr-2"></i> {{summary.date}} 
        </span>
        <nuxt-link tag="a" class="text-primary float-right" to="/booking/orders/">
          {{ $t('common.view-all')}}
          <i class="fe fe-arrow-right ml-1"></i>
        </nuxt-link>
      </div>
    </div>
  </a-skeleton>
</template>

<script>
export default {
  props: ["title", "subtitle", "module", "range"],
  data() {
    return {
      summary: {},
      loading: true,
      icon: {
        member: "fe-users",
        order: "fe-shopping-cart",
        message: "fe-check-square"
      },
      unit: {
        member: "",
        booking: "€",
        message: ""
      }
    };
  },
  methods: {
    fetch() {
      this.loading = true;
      this.$axios
        .get("/statistics/" + this.module + "/summary/" + this.range)
        .then(r => {
          this.loading = false;
          this.summary = r.data.data;
        });
    }
  },

  watch: {
    range() {
      this.fetch();
    }
  },

  mounted() {
    this.fetch();
  }
};
</script>