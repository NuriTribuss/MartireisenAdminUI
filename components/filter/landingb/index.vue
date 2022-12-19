<template>
  <div class="filter pb-2">
    <a-form layout="inline">
      <a-form-item>
        <a-input
          @change="$emit('searchLandingBase',searchData)"
          allowClear
          :placeholder="$t('pages.landing_base.filter.name')"
          v-model="searchData.name"
        ></a-input>
      </a-form-item>
       <a-form-item>
        <a-input
          @change="$emit('searchLandingBase',searchData)"
          allowClear
          :placeholder="$t('pages.landing_base.filter.url')"
          v-model="searchData.url"
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
