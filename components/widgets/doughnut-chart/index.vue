<template>
  <div>
    <div>
      <div class="d-flex flex-wrap align-items-center">
        <div class="mr-3 mt-3 mb-3 position-relative">
          <doughnut-chart
            :chartdata="data"
            :options="options"
            :height="140"
            :width="140"
            ref="doughnut"
          />
          <div class="text-gray-5 font-size-28 text-center" :class="$style.tooltip" ref="tooltip">
            <div class="font-size-14 font-weight-bold text-dark" ref="tooltipLabel"></div>
            <div class="font-size-14 text-dark" ref="tooltipValue"></div>
          </div>
        </div>
        <div v-html="customLegend"></div>
      </div>
    </div>
  </div>
</template>
<script>
import DoughnutChart from "./DoughnutChart.vue";
const data = {
  labels: ["EFT", "Kredi Kartı", "Kapıda Ödeme"],
  datasets: [
    {
      data: [20, 70, 10],
      backgroundColor: ["#46be8a", "#fb434a", "#1b55e3"],
      borderColor: "#fff",
      borderWidth: 2,
      hoverBorderWidth: 0,
      borderAlign: "inner"
    }
  ]
};

export default {
  name: "AirChart10",
  components: {
    DoughnutChart,
    data
  },
  data: function() {
    const options = {
      animation: false,
      responsive: true,
      cutoutPercentage: 70,
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
        custom: tooltipData => {
          const tooltipEl = this.$refs.tooltip;
          tooltipEl.style.opacity = 1;
          if (tooltipData.opacity === 0) {
            tooltipEl.style.opacity = 0;
          }
        },
        callbacks: {
          label: (tooltipItem, itemData) => {
            const dataset = itemData.datasets[0];
            const value = dataset.data[tooltipItem.index];
            this.$refs.tooltipValue.innerHTML = value;
            this.$refs.tooltipLabel.innerHTML =
              itemData.labels[tooltipItem.index];
          }
        }
      },
      legendCallback: chart => {
        const { labels } = chart.data;
        let legendMarkup = [];
        const dataset = chart.data.datasets[0];
        legendMarkup.push('<div class="flex-shrink-0">');
        let legends = labels.map((label, index) => {
          const color = dataset.backgroundColor[index];
          return `<div class="d-flex align-items-center flex-nowrap mt-2 mb-2"><div class="air__utils__tablet mr-3" style="background-color: ${color}"></div>${label}</div>`;
        });
        legends = legends.join("");
        legendMarkup.push(legends);
        legendMarkup.push("</div>");
        legendMarkup = legendMarkup.join("");
        return legendMarkup;
      }
    };
    return {
      data,
      options,
      customLegend: ""
    };
  },
  mounted() {
    const legend = this.$refs.doughnut.generateLegend();
    this.customLegend = legend;
  }
};
</script>
<style lang="scss" module>
@import "./style.module.scss";
</style>
