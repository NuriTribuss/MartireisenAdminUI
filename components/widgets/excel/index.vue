<template>
  <a-button @click="download" :type="type" :loading="loading">
    <slot></slot>
  </a-button>
</template>

<script>
export default {
  props: ["url","type"],
  data(){
    return {
        loading:false
    }
  },
  methods: {
    download() {
      this.loading = true;
      var res = this.$axios.get(this.url).then((res) => {
        const data = res.data;
        //console.log("data:application/vnd.ms-excel;charset=utf-8,"+ encodeURIComponent(data));
        const link = document.createElement("a");
        link.href =
          "data:application/vnd.ms-excel;charset=utf-8," +
          encodeURIComponent(data);
        link.setAttribute(
          "download",
          "exxport-" + Math.random(1000000, 999999999) + ".xls"
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        this.loading = false;
      });
    },
  },
};
</script>

<style>
</style>