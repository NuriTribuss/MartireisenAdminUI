<template>
  <div class="filter pd-10">
    <a-form layout="inline">
      <a-form-item>
        <a-date-picker @change="onCreatedmin" suffixIcon=" " allowClear :placeholder="$t('pages.log.filter.date_min')" />
      </a-form-item>
      <a-form-item>
        <a-date-picker @change="onCreatedmax" suffixIcon=" " allowClear :placeholder="$t('pages.log.filter.date_max')" />
      </a-form-item>
      <a-form-item>
        <a-select v-model="searchData.action_id" @change="updateLogFilter" allowClear :placeholder="$t('pages.log.filter.action_type')">
          <a-select-option :value="null"> {{$t('pages.log.filter.action_type')}}</a-select-option>
          <a-select-option v-for="(action,index) in actions" :key="index" :value="action.value"> {{action.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-select v-model="searchData.module_id" @change="updateLogFilter" allowClear :placeholder="$t('pages.log.filter.module')" >
          <a-select-option :value="null"> {{$t('pages.log.filter.module')}}</a-select-option>
          <a-select-option v-for="(module,index) in modules" :key="index" :value="module.value"> {{module.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-select v-model="searchData.admin_id" @change="updateLogFilter" allowClear :placeholder="$t('pages.log.filter.admin')" >
          <a-select-option :value="null"> {{$t('pages.log.filter.admin')}}</a-select-option>
          <a-select-option v-for="(admin,index) in admins" :key="index" :value="admin.id"> {{admin.username}}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        actions: [],
        modules: [],
        admins: [],
        brands: [],
        categories: [],
        models: [],
        searchData: {
          created_min: null,
          created_max: null,
          action_id: null,
          module_id: null,
          admin_id: null,
        },
      }
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      fetchData(){
        this.$axios
          .get("/sys/log/actions")
          .then(response => {
            this.actions = response.data.data;
          });
        this.$axios
          .get("/sys/log/modules")
          .then(response => {
            this.modules = response.data.data;
          });
        this.$axios
          .get("/sys/user/user")
          .then(response => {
            this.admins = response.data.data;
          });
      },
      updateLogFilter(value, dateString) {
        this.$emit('searchLogFilter', this.searchData)
      },
      onCreatedmin(value, dateString) {
        let date = dateString;
        this.searchData.created_min = date;
        this.$emit('searchLogFilter', this.searchData)
      },
      onCreatedmax(value, dateString) {
        let date = dateString;
        this.searchData.created_max = date;
        this.$emit('searchLogFilter', this.searchData)
      },
    }
  }
</script>
