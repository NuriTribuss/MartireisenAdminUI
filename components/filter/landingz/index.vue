<template>
  <div class="filter pb-2">
    <a-form layout="inline">
      <a-form-item>
        <a-input
          @change="$emit('searchLandingZone',searchData)"
          allowClear
          :placeholder="$t('pages.landing_zone.filter.name')"
          v-model="searchData.name"
        ></a-input>
      </a-form-item>
       <a-form-item>
        <a-input
          @change="$emit('searchLandingZone',searchData)"
          allowClear
          :placeholder="$t('pages.landing_zone.filter.url')"
          v-model="searchData.url"
        ></a-input>
      </a-form-item>
     
      <a-form-item>
        <a-select
          @change="$emit('searchLandingZone',searchData)"
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
       <a-form-item>
        <a-select
          @change="$emit('searchLandingZone',searchData)"
          placeholder="Dil"
          allowClear
          v-model="searchData.language"
        >
          <a-select-option value="de">Almanca</a-select-option>
          <a-select-option value="tr">Türkçe</a-select-option>
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
        source: '',
        url : null,
        name : null,
        language : 'de'
      }
    };
  },
  methods: {
    
  }
};
</script>

<style scoped>
</style>
