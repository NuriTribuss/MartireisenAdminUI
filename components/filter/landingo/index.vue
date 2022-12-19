<template>
  <div class="filter pb-2">
    <a-form layout="inline">
      <a-form-item>
        <a-input
          @change="$emit('searchLandingOtel',searchData)"
          allowClear
          :placeholder="$t('pages.landing_otel.filter.name')"
          v-model="searchData.name"
        ></a-input>
      </a-form-item>
       <a-form-item>
        <a-input
          @change="$emit('searchLandingOtel',searchData)"
          allowClear
          :placeholder="$t('pages.landing_otel.filter.url')"
          v-model="searchData.url"
        ></a-input>
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
        code: null,
        url : null,
        name : null,
      }
    };
  },
  methods: {
   
  }
};
</script>

<style scoped>
</style>
