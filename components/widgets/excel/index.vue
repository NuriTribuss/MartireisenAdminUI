<template>
  <a-button @click="download" :type="type" :loading="loading">
    <slot></slot>
  </a-button>
</template>

<script>
export default {
  props: ["url","type","filters","filename"],
  data(){
    return {
        loading:false
    }
  },
  methods: {
    download() {
      this.loading = true;
      var res = this.$axios.get(this.url, { params : this.filters,responseType: 'blob'}).then((res) => {
        const data = res.data;
        var fileURL = window.URL.createObjectURL(new Blob([data]));
        var fileLink = document.createElement('a');
        fileLink.href = fileURL;
        fileLink.setAttribute('download', "exxport-" + this.filename + "-" + this.$moment().format('YYYY-MM-DD-h.mm.ss') + ".xlsx");
        document.body.appendChild(fileLink);
        fileLink.click();
        this.loading = false;
      });
    },
  },
};
</script>

<style>
</style>