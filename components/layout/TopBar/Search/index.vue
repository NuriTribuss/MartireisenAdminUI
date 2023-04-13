<template>
  <a-dropdown :trigger="['click']" placement="bottomLeft">
    <div :class="$style.searchContainer">
      <i class="la la-search" :class="$style.searchIcon"></i>
      <input :class="$style.searchInput" v-model="search" type="text" placeholder="Arama Yap ..." />
    </div>
    <div slot="overlay" class="card air__utils__shadow width-330">
      <div class="card-body p-1 height-350">
        <vue-custom-scrollbar :style="{ height: '100%' }">
          <div class="pt-4 px-4 pb-2">
            <SearchList :data="data" />
          </div>
        </vue-custom-scrollbar>
      </div>
    </div>
  </a-dropdown>
</template>

<script>
import vueCustomScrollbar from 'vue-custom-scrollbar'
import SearchList from '@/components/topbar/search-list'

export default {
  name: "SearchBox",
  components: {
    vueCustomScrollbar,
    SearchList
  },
  data() {
    return {
      search: null,
      searchTimeOut: null,
      data: [],
    }
  },
  watch: {
    "search": function(val) {
      clearTimeout(this.searchTimeOut);
      this.searchTimeOut = setTimeout(t => {
          this.fetchData();
      }, 500);
    }
  },
  created(){

  },
  methods: {
    fetchData(){
      if(this.search.length > 1){
        this.$axios
          .get("/search?q=" + this.search)
          .then(r => {
            this.data = r.data.data;
          });
      }
      else
      {
        this.data = [];
      }
    }
  }
}
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
