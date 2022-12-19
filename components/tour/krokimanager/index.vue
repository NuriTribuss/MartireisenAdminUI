<template>
  <a-skeleton :loading="loading" :title="false">
    <a-card>
      <a-form-item class="single-upload" :label-col="{ span:24 }" :wrapper-col="{ span: 24 }">
        <a-divider orientation="left">Kroki Görseli</a-divider>
        <img class="col-8 w-100 mb-2" :src="base_url+product_data.tour_plan_image+'?'+new Date().getTime()" v-if="product_data.tour_plan_image != ''" />
        <a-upload
          :fileList="fileList"
          :remove="handleRemove"
          :beforeUpload="beforeUpload"
        >
          <a-button>
            <a-icon type="upload" />
            {{$t('btn.select_file')}}
          </a-button>
        </a-upload>
        <a-button class="mt-4" type="primary" @click="upload(tour_id)">{{ $t('btn.save')}}</a-button>
      </a-form-item>
    </a-card>
  </a-skeleton>
</template>

<script>
export default {
  props: ["tour_id", "product_data"],
  name: "KrokiManager",

  data() {
    return {
      base_url: process.env.url,
      data: [],
      loading: true,
      imageForm: {},
      imageModal: false,
      fileList : []
    };
  },
  methods: {
    fetch() {
      this.loading = true;
      this.$axios
        .get("/booking/tour/tour/" + this.tour_id + "/")
        .then((r) => {
          this.loading = false;
          this.product_data = r.data.data;
        });
    },
    refresh() {
      this.fetch();
    },
    upload(id) {
      const { fileList } = this;
      const formData = new FormData();

      if (fileList.length != 1) {
        return true;
      }

      formData.append("file", fileList[0]);

      return this.$axios
        .post("/booking/tour/tour/" + this.tour_id + "/setPlanImage", formData)
        .then((response) => {
          if (response.data.status) {
            this.$message.success(`File uploaded successfully.`);
            this.fetch();
          } else {
            this.$message.error(response.data.message);
          }
        });
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [file];
      return false;
    }
  },

  mounted() {
    this.fetch();
  },
};
</script>
