<template>
  <a-skeleton :loading="loading" :title="false">
    <div class="card">
                <div class="card-header">Rezervasyon İstatistiği</div>
      <div class="card-body">
          <vue-chartist class="height-300" type="Line" :data="data" :options="options"></vue-chartist>
      </div>
    </div>
  </a-skeleton>
</template>

<script>

import VueChartist from "v-chartist";
import ChartistTooltip from "chartist-plugin-tooltips-updated";

export default {
  props: ["title", "subtitle", "module", "range"],
  components :{
      VueChartist,
  },
  data() {
    return {
       options: {
        fullWidth: !0,
        chartPadding: {
          right: 15,
          left: -15
        },
        low: 0,
        showArea: true,
        plugins: [
          ChartistTooltip({
            anchorToPoint: false,
            appendToBody: true,
            seriesName: false
          })
        ]
      },
      data: {
        labels : [],
        series : [
          []
        ]
      },
      loading: true
    };
  },
  methods: {
    fetch() {
      this.loading = true;
      this.$axios
        .get("/statistics/booking/get/" + this.range)
        .then(r => {

          this.loading = false;
          let records = r.data.data;

          records.forEach(emp => {
              this.data.labels.push(emp.date);
              this.data.series[0].push(emp.total_sales);
          });
          console.log(this.data)
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