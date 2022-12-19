<template>
  <div class="vi-table card">
    <div class="d-flex align-items-center card-header">
      <div class="flex-grow-1">
         
      </div>

      <div>
        <a-button-group>
          <a-select
            v-model="limit"
            @change="limitChange"
          >
            <a-select-option v-for="(limit, index) in filterLimits" :key="index" :value="limit">{{ limit }}</a-select-option>
          </a-select>
          <a-tooltip :key="btn.name" :title="$t(btn.label)" placement="top" v-for="btn in actions">
            <a-button
              :disabled="disableActions"
              :type="btn.type"
              @click="handleClickAction(btn.name)"
            >
              <a-icon :type="btn.icon"/>
            </a-button>
          </a-tooltip>
          <a-dropdown :trigger="['click']">
            <a-button class="ant-dropdown-link">
              <a-icon type="ellipsis"/>
            </a-button>
            <!-- <a class="ant-dropdown-link" href="#"> Columns <a-icon type="down" /> </a> -->
            <a-menu class="p-2" slot="overlay">
              <a-checkbox-group v-model="shownColumns">
                <a-menu-item :key="item.value" v-for="item in checkboxOptions">
                  <a-checkbox :value="item.value">{{ item.label }}</a-checkbox>
                </a-menu-item>
              </a-checkbox-group>
            </a-menu>
          </a-dropdown>
        </a-button-group>
      </div>
    </div>
    <div class="card-body">
     
      <booking-filter @searchBooking="filterBooking" v-if="showBookingFilter"></booking-filter>
      <member-filter @searchMember="filterMember" v-if="showMemberFilter"></member-filter>
      <link-filter @searchLink="filterLink" v-if="showLinkFilter"></link-filter>

      <landing-otel-filter @searchLandingOtel="filterLandingOtel" v-if="showLandingOtelFilter"></landing-otel-filter>
      <landing-zone-filter @searchLandingZone="filterLandingZone" v-if="showLandingZoneFilter"></landing-zone-filter>
      <landing-base-filter @searchLandingBase="filterLandingBase" v-if="showLandingBaseFilter"></landing-base-filter>

      <a-table
        ref="vi-tbl"
        :columns="cleanColumnsData"
        @change="onPageChange"
        @expand="onExpand"
        @expandedRowsChange="expandedRowsChange"
        v-bind="$props"
      >
        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
          <slot :name="slot" v-bind="(typeof scope == 'object' ? scope : {value : scope})"/>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
  import {Table} from "ant-design-vue";
  import bookingFilter from "@/components/filter/booking";
  import memberFilter from "@/components/filter/member";
  import landingOtelFilter from "@/components/filter/landingo";
  import landingZoneFilter from "@/components/filter/landingz";
  import landingBaseFilter from "@/components/filter/landingb";
  import linkFilter from "@/components/filter/link";

  export default {
    name: "ViTable",
    mixins: [Table],
    props: {
      pageTitle: "",
      actions: {
        type: Array
      },
      showBookingFilter: {
        type: Boolean,
        default: false
      },
      showMemberFilter: {
        type: Boolean,
        default: false
      },
      showLandingOtelFilter: {
        type: Boolean,
        default: false
      },
      showLandingZoneFilter: {
        type: Boolean,
        default: false
      },
      showLandingBaseFilter: {
        type: Boolean,
        default: false
      },
      showLinkFilter: {
        type: Boolean,
        default: false
      },
      disableActions: {
        type: Boolean,
        default: false
      }
    },
    components: { 
      bookingFilter,
      memberFilter,
      landingOtelFilter,
      landingZoneFilter,
      landingBaseFilter,
      linkFilter
    },
    data() {
      return {
        shownColumns: this.$props.columns.map(col => col.dataIndex),
        filtered: false,
        filteredData: [],
        filterLimits: [10,20,50,100],
        limit: 10
      };
    },
    computed: {
      checkboxOptions() {
        return this.$props.columns.map(col => {
          return {
            label: col.title,
            value: col.dataIndex
          };
        });
      },
      cleanColumnsData() {
        return this.$props.columns.filter(col => {
          return this.shownColumns.indexOf(col.dataIndex) >= 0;
        });
      }
    },
    methods: {
      handleClickAction(name) {
        // TODO: clickAction silinecek
        this.$emit("clickAction", name);
        this.$emit("onAction", name);

        if (name == "landingOtelFilter") {
          this.showLandingOtelFilter = !this.showLandingOtelFilter;
        }

        if (name == "landingZoneFilter") {
          this.showLandingZoneFilter = !this.showLandingZoneFilter;
        }

        if (name == "landingBaseFilter") {
          this.showLandingBaseFilter = !this.showLandingBaseFilter;
        }

        if (name == "bookingFilter") {
          this.showBookingFilter = !this.showBookingFilter;
        }
        if (name == "memberFilter") {
          this.showMemberFilter = !this.showMemberFilter;
        }

        if (name == "memberFilter") {
          this.showLinkFilter = !this.showLinkFilter;
        }
      
      },
      limitChange(value){
        let pg = {current: 1, pageSize: value, total: 0};
        if(!_.isEmpty(this.$refs['vi-tbl'].pagination)){
          pg = _.cloneDeep(this.$refs['vi-tbl'].pagination);
        }
        pg.pageSize = value;
        this.onPageChange(pg, [], []);
      },
      onPageChange(pagination, filters, sorter) {
        pagination.pageSize = this.limit;
        if (this.filtered) {
          this.$emit("change", pagination, filters, sorter, this.filtered, this.filteredData);
        } else {
          this.$emit("change", pagination, filters, sorter);
        }
      },
      expandedRowsChange(expandedRows) {
        this.$emit("expandedRowsChange", expandedRows);
      },
      onExpand(expanded, record) {
        this.$emit("expand", expanded, record);
      },
      filterLink(data){
        this.$store.dispatch("sys/link/getFilteredData", {
          searchData: data,
          page: 1
        });
        this.filtered = true;
        this.filteredData = data
      },
   
      filterLog(data) {
        this.$store.dispatch("ecommerce/catalog/products/getFilteredData", {
          searchData: data,
          page: 1
        });
        this.filtered = true;
        this.filteredData = data
      },
      filterMember(data) {
        console.log(data)
        this.$store.dispatch("member/member/getFilteredData", {
          searchData: data,
          page: 1
        });
        this.filtered = true;
        this.filteredData = data
      },
     
      filterBooking(data) {
        this.$store.dispatch("booking/order/getFilteredData", {
          searchData: data,
          page: 1
        });
        this.filtered = true;
        this.filteredData = data
      },
      filterLandingOtel(data) {
        this.$store.dispatch("landing/otel/getFilteredData", {
          searchData: data,
          page: 1
        });
        this.filtered = true;
        this.filteredData = data
      },
      filterLandingZone(data) {
        this.$store.dispatch("landing/zone/getFilteredData", {
          searchData: data,
          page: 1
        });
        this.filtered = true;
        this.filteredData = data
      },
      filterLandingBase(data) {
        this.$store.dispatch("landing/base/getFilteredData", {
          searchData: data,
          page: 1
        });
        this.filtered = true;
        this.filteredData = data
      }
     
    }
  };
</script>

<style>
  .ant-table-thead > tr > th {
    font-weight: bold !important;
  }

  body .ant-form-inline .ant-form-item {
    margin-right: 5px !important;
  }
</style>
