<template>
  <div class="filter pb-2">
    <a-form layout="inline">
      <a-form-item>
        <a-input
          @change="emitSearchData"
          allowClear
          :placeholder="$t('pages.booking.filter.code')"
          v-model="searchData.code"
        ></a-input>
      </a-form-item>
       <a-form-item>
        <a-input
          @change="emitSearchData"
          allowClear
          :placeholder="$t('pages.booking.filter.email')"
          v-model="searchData.email"
        ></a-input>
      </a-form-item>
       <a-form-item>
        <a-input
          @change="emitSearchData"
          allowClear
          :placeholder="$t('pages.booking.filter.name')"
          v-model="searchData.name"
        ></a-input>
      </a-form-item>
     
      <a-form-item>
        <a-date-picker
          @change="onCreatedmin"
          suffixIcon=" "
          allowClear
          :placeholder="$t('pages.booking.filter.min_date')"
        />
      </a-form-item>
      <a-form-item>
        <a-date-picker
          @change="onCreatedmax"
          suffixIcon=" "
          allowClear
          :placeholder="$t('pages.booking.filter.max_date')"
        />
      </a-form-item>
       <a-form-item>
        <a-select
          @change="emitSearchData"
          :placeholder="$t('pages.booking.filter.source')"
          allowClear
          v-model="searchData.source"
        >
          <a-select-option :value=null>Tüm Apiler</a-select-option>
          <a-select-option value="TravelIT">Paket Tatil / Tatil </a-select-option>
          <a-select-option value="Tour">Tur</a-select-option>
          <a-select-option value="HalalBooking">Halla Booking</a-select-option>
        </a-select>
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
        code: null,
        source: '',
        email : null,
        name : null,
        created_min: null,
        created_max: null
      }
    };
  },
  methods: {
    onCreatedmin(value, dateString) {
      let date = dateString;
      this.searchData.created_min = date;
      if(this.searchData.name != null && this.searchData.name.trim() == ''){
        this.searchData.name = null;
      }
      this.$emit("searchBooking", this.searchData);
    },
    onCreatedmax(value, dateString) {
      let date = dateString;
      this.searchData.created_max = date;
      if(this.searchData.created_max != null && this.searchData.created_max.trim() == ''){
        this.searchData.created_max = null;
      }
      this.$emit("searchBooking", this.searchData);
    },
    emitSearchData(){
      if(this.searchData.code != null && this.searchData.code.trim() == ''){
        this.searchData.code = null;
      }
      if(this.searchData.source != null && this.searchData.source.trim() == ''){
        this.searchData.source = null;
      }
      if(this.searchData.email != null && this.searchData.email.trim() == ''){
        this.searchData.email = null;
      }
      if(this.searchData.name != null && this.searchData.name.trim() == ''){
        this.searchData.name = null;
      }
      if(this.searchData.created_min != null && this.searchData.created_min.trim() == ''){
        this.searchData.created_min = null;
      }
      
      this.$emit('searchBooking',this.searchData)
    },
  }
};
</script>

<style scoped>
</style>
