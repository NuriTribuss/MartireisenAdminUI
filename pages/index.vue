<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-md-9">
        <div class="row">
          <div class="col-12">
            <h4 class="float-left mb-3 mb-md-0">{{$t('pages.home.overview')}}</h4>
            <a-radio-group v-model="tabPosition" style="margin:8px" class="float-right m-0">
              <a-radio-button value="today">{{ $t('common.today') }}</a-radio-button>
              <a-radio-button value="week">{{ $t('common.week') }}</a-radio-button>
              <a-radio-button value="month">{{ $t('common.month') }}</a-radio-button>
              <a-radio-button value="year">{{ $t('common.year') }}</a-radio-button>
            </a-radio-group>
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-12 col-md-4">
            <card
              :title="$t('pages.home.total-sales')"
              :subtitle="$t('pages.home.total-order')"
              module="booking"
              :range="tabPosition"
            ></card>
          </div>
          <div class="col-12 col-md-4">
            <card :title="$t('pages.home.total-member')" module="member" :range="tabPosition"></card>
          </div>
          <div class="col-12 col-md-4">
            <card
              :title="$t('pages.home.total-sales')"
              :subtitle="$t('pages.home.total-order')"
              module="message"
              :range="tabPosition"
            ></card>
          </div>
        </div>

        <order-chart :range="7"></order-chart>
      </div>
      <div class="col-12 col-md-3">
        <div class="card">
          <div class="card-header">#</div>
          <a-result status="500" title="Dikkat" sub-title="Bu alan henüz geliştirme aşamasındadır">
            <template #extra>Dashboard Sağ Bölge</template>
          </a-result>
           
        </div>
        <button class="btn btn-secondary btn-block rounded-0" @click="clearCache" type="danger">Clear Cache</button>
      </div>
     
    </div>
  </div>
</template>

<script>
import card from "~/components/statistics/card/";
import orderchart from "~/components/statistics/orderchart/";
import orderActivityList from "~/components/statistics/activity/";
import processList from "~/components/list/process-list/";
import doughnutChart from "~/components/widgets/doughnut-chart/";

export default {
  components: {
    card,
    "order-chart": orderchart,
    "order-activity-list": orderActivityList,
    processList,
    doughnutChart
  },
  data() {
    return {
      tabPosition: "today"
    };
  },

  methods : {
    clearCache(){
      this.$axios.get(`/sys/cache/clear-settings`).then(res => {
         this.$message.success('Cache Cleared');
      })
    }
  }
};
</script>

<style>
svg {
  overflow: visible !important;
}
</style>