<template>
  <div class="filter pb-2">
    <a-form layout="inline">
     
       <a-form-item>
        <a-input
          @change="$emit('searchLink',searchData)"
          allowClear
          placeholder="Seo Title"
          v-model="searchData.title"
        ></a-input>
      </a-form-item>
       <a-form-item>
        <a-input
          @change="$emit('searchLink',searchData)"
          allowClear
          placeholder="Url"
          v-model="searchData.value"
        ></a-input>
      </a-form-item>
       <a-form-item>
        <a-select
          @change="$emit('searchLink',searchData)"
          placeholder="Link Tipi"
          allowClear
          v-model="searchData.type"
        >
          <a-select-option value="">Tümü</a-select-option>
          <a-select-option value="301">301</a-select-option>
        </a-select>
      </a-form-item>
       <a-form-item>
        <a-select
          @change="$emit('searchLink',searchData)"
          placeholder="Ekstra FiLTRELER"
          allowClear
          v-model="searchData.extra"
        >
          <a-select-option value="">Seçim Yok</a-select-option>
          <a-select-option value="empty_seo">Seo Bilgileri Boş Olanları Getir</a-select-option>
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
        type: '',
        title : null,
        description : null,
        extra : '',
        
      }
    };
  },
  methods: {
    
  }
};
</script>

<style scoped>
</style>
