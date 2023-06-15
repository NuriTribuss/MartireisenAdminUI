<template>
    <div class="filter pb-2">
      <a-form layout="inline">
        <a-form-item>
          <a-input
            @change="$emit('searchTour',searchData)"
            allowClear
            :placeholder="$t('pages.tour.cols.name')"
            v-model="searchData.name"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            @change="$emit('searchTour',searchData)"
            allowClear
            :placeholder="$t('pages.tour.cols.departure')"
            v-model="searchData.departure_place"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            @change="$emit('searchTour',searchData)"
            allowClear
            :placeholder="$t('pages.tour.cols.destination')"
            v-model="searchData.destination"
          ></a-input>
        </a-form-item>
      </a-form>
    </div>
</template>
  
<script>
  export default {
    data() {
      return {
        paymentOptions: [],
        searchData: {
            name: null,
            departure_place: null,
            destination: null,
            // created_min: null,
            // created_max: null
        }
      };
    },
    methods: {
    //   onCreatedmin(value, dateString) {
    //     let date = dateString;
    //     this.searchData.created_min = date;
    //     this.$emit("searchTour", this.searchData);
    //   },
    //   onCreatedmax(value, dateString) {
    //     let date = dateString;
    //     this.searchData.created_max = date;
    //     this.$emit("searchTour", this.searchData);
    //   }
    }
  };
  </script>
  
  