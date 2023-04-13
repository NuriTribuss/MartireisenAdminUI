<template>
  <a-skeleton :loading="loading" :title="false">
     <div>
    <ul class="list-unstyled">
     
      <li :class="$style.item" v-for="(act,index) in activity" v-bind:key="index">
        <div
          :class="$style.dots"
          :style="{ backgroundImage: 'url(assets/img/3-rounds.png)' }"
        ></div>
        <div :class="$style.itemPicContainer">
          <div :class="$style.itemPic" class="bg-primary" />
          <i :class="$style.itemIcon" class="text-white la la-shopping-cart" />
        </div>
        <div class="w-100">
          <div>
            <p class="text-dark">{{ act.customer_firstname }} {{ act.customer_lastname[0] }}. </p>
            
          </div>
          <div class="justify-content-between w-100">
          <small class="text-muted"><i class="la la-calendar mr-1" ></i> {{ $moment(act.created_at, "YYYYMMDD").fromNow()  }}</small>
          <small class="text-muted float-right"><i class="fa fa-coins mr-1" ></i> ({{ act.order_total+act.order_currency}})</small>
          </div>
        </div>
      </li>
     
    </ul>
  </div>
  </a-skeleton>
</template>

<style lang="scss" module>
@import "./style.module.scss";
</style>

<script>

export default {
  props: ["title", "subtitle", "module", "range"],
  data() {
    return {
      activity: [],
      loading: true,
     
    };
  },
 
  methods: {
    fetch() {
      this.loading = true;
      this.$axios
        .get("/statistics/order/activity")
        .then(r => {
          this.loading = false;
          this.activity = r.data.data;
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