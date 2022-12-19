<template>
  <div class="filter pb-2">
    <a-form layout="inline">
      <a-form-item>
        <a-input
          @change="$emit('searchBooking',searchData)"
          allowClear
          :placeholder="$t('pages.booking.filter.code')"
          v-model="searchData.code"
        ></a-input>
      </a-form-item>
       <a-form-item>
        <a-input
          @change="$emit('searchBooking',searchData)"
          allowClear
          :placeholder="$t('pages.booking.filter.email')"
          v-model="searchData.email"
        ></a-input>
      </a-form-item>
       <a-form-item>
        <a-input
          @change="$emit('searchBooking',searchData)"
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
          @change="$emit('searchBooking',searchData)"
          :placeholder="$t('pages.booking.filter.source')"
          allowClear
          v-model="searchData.source"
        >
          <a-select-option value="">Tüm Apiler</a-select-option>
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
      this.$emit("searchBooking", this.searchData);
    },
    onCreatedmax(value, dateString) {
      let date = dateString;
      this.searchData.created_max = date;
      this.$emit("searchBooking", this.searchData);
    }
  }
};
</script>

<style scoped>
</style>
