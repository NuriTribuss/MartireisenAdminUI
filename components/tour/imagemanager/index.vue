<template>
  <a-skeleton :loading="loading" :title="false">
    <a-card>
      <a-form class="form-vertical" layout="vertical">
        <a-form-item :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
          <a-upload-dragger
            name="file"
            :multiple="true"
            :customRequest="upload"
            listType="picture-card"
            :showPreviewIcon="true"
            :openFileDialogOnClick="true"
            :showUploadList="false"
          >
            <div class="ant-upload-btn">
              <a-button>
                <a-icon type="upload" />
                {{$t('input.picture_add')}}
              </a-button>
            </div>
            <p class="ant-upload-hint">{{$t('input.picture_summary')}}</p>
          </a-upload-dragger>
        </a-form-item>
      </a-form>
      <div class="row">
        <div class="col-lg-12 row">
          <a-card
            hoverable
            style="width: 300px"
            class=" mb-3 col-2"
            v-for="(image,index) in data"
            v-bind:key="index"
          >
            <img width="300"  alt="example" :src="base_url+'/'+image.image" slot="cover" />
            <template class="ant-card-actions" slot="actions">
             
              <a-popconfirm :title="$t('messages.sure_delete')" @confirm="deleteRecord(image.id)">
              <a-button type="link">
                <a-icon type="delete" />
              </a-button>
            </a-popconfirm>

            </template>
          </a-card>
        </div>
      </div>
      <a-modal
        title="Resim Düzenleme Ekranı"
        v-model="imageModal"
        @ok="submitImageData"
        @cancel="imageModal=false"
        :okText="$t('btn.save')"
        :cancelText="$t('btn.cancel')"
      >
        <a-form>
          <a-form-item
            :label="$t('pages.product.images.sort_number')"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 17 }"
          >
            <a-input-number :min="1" v-model="imageForm.sort_number" />
          </a-form-item>
          <a-form-item
            :label="$t('pages.product.images.main')"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 17 }"
          >
            <a-radio-group buttonStyle="solid" v-model="imageForm.main">
              <a-radio-button :value="1">{{$t('common.yes')}}</a-radio-button>
              <a-radio-button :value="0">{{$t('common.no')}}</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :label="$t('pages.product.images.active')"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 17 }"
          >
            <a-radio-group buttonStyle="solid" v-model="imageForm.active">
              <a-radio-button :value="1">{{$t('common.active')}}</a-radio-button>
              <a-radio-button :value="0">{{$t('common.passive')}}</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </a-skeleton>
</template>

<script>
export default {
  props: ["tour_id" , "product_data"],
  name: "ImageManager",

  data() {
    return {
      base_url : process.env.url,
      data: [],
      loading: true,
      imageForm: {},
      imageModal: false
    };
  },
  methods: {
    fetch() {
      this.loading = true;
      this.$axios
        .get("/booking/tour/tour/" + this.tour_id + "/image") 
        .then(r => {
          this.loading = false;
          this.data = r.data.data;
        });
    },
    refresh() {
      this.fetch();
    },
    upload(file) {
      var formData = new FormData();
      formData.append("file", file.file);

      return this.$axios
        .post(
          "/booking/tour/tour/" + this.tour_id + "/image",
          formData
        )
        .then(response => {
          if (response.data.status) {
            this.$message.success(`File uploaded successfully.`);
            this.fetch();
          } else {
            this.$message.error(response.data.message);
          }
        });
    },

    deleteRecord(id) {
      this.$axios
        .delete(
          "/booking/tour/tour/" + this.tour_id + "/image/" + id
        )
        .then(response => {
          if (response.data.status) {
            this.$message.success(this.$t("messages.delete_ok"));
            this.fetch();
          } else {
            this.$message.error(response.data.message);
          }
        })
        .catch(error => {});
    },

    imageEdit(value) {
      this.imageForm = {
        id: value.id,
        sort_number: value.sort_number,
        active: value.active,
        main: value.main
      };
      this.imageModal = true;
      console.log("test");
    },
    submitImageData() {
      this.$axios
        .put(
          `/booking/tour/tour/${this.$route.params.id}/image/${this.imageForm.id}`,
          this.imageForm
        )
        .then(res => {
          this.onResponse(res);
          this.imageForm = {};
          this.imageModal = false;
          this.refresh();
        })
        .catch(error => {
          this.onFailure(error.response);
        });
    },
    onResponse(response) {
      let result = response.data.data;
      if (!response.data.status) {
        return this.onFailure(response);
      }

      this.$notification["success"]({
        message: this.$t("messages.success"),
        description: this.$t("messages.action_ok"),
        placement: "bottomRight "
      });
     
    },
    onFailure(response) {
      this.$notification["error"]({
        message: this.$t("messages.warning"),
        description: response.data.message,
        placement: "bottomRight "
      });
    }
  },

  mounted() {
    this.fetch();
  }
};
</script>
