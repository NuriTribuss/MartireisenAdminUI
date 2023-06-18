<template>
    <div class="filter pb-2">
      <a-form layout="inline">
        <a-form-item>
          <a-input
            @change="$emit('searchSubscriber',searchData)"
            allowClear
            :placeholder="$t('pages.members.filter.email')"
            v-model="searchData.email"
          ></a-input>
        </a-form-item>
        <a-form-item>
            <a-select
                @change="$emit('searchSubscriber',searchData)"
                placeholder="Dil"
                allowClear
                v-model="searchData.language"
                >
                <a-select-option value="">Tüm Diller</a-select-option>
                <a-select-option value="de">Almanca</a-select-option>
                <a-select-option value="tr">Türkçe</a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item>
          <a-date-picker
            @change="onCreatedmin"
            suffixIcon=" "
            allowClear
            :placeholder="$t('pages.members.filter.min_date')"
          />
        </a-form-item>
        <a-form-item>
          <a-date-picker
            @change="onCreatedmax"
            suffixIcon=" "
            allowClear
            :placeholder="$t('pages.members.filter.max_date')"
          />
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
          email : null,
          language : null,
          created_min: null,
          created_max: null
        }
      };
    },
    methods: {
      onCreatedmin(value, dateString) {
        let date = dateString;
        this.searchData.created_min = date;
        this.$emit("searchSubscriber", this.searchData);
      },
      onCreatedmax(value, dateString) {
        let date = dateString;
        this.searchData.created_max = date;
        this.$emit("searchSubscriber", this.searchData);
      }
    }
  };
  </script>
  
  <style scoped>
  </style>
  