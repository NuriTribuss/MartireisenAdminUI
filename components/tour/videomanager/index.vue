<template>
  <a-skeleton :loading="loading" :title="false">
    <a-card>
      <a-button type="primary" @click="visible = true">{{ $t('btn.add')}}</a-button>
      <div class="row mt-4">
          <a-card
            hoverable
            class="mb-3 col-5 mr-2"
            v-for="(video,index) in data"
            v-bind:key="index"
          >
            <div v-html="video.embed"></div>

            <a-popconfirm :title="$t('messages.sure_delete')" @confirm="deleteRecord(video.id)">
              <a-button type="link">
                <a-icon type="delete" />
              </a-button>
            </a-popconfirm>
          </a-card>
      </div>
      <a-drawer
        title="Yeni Video Ekle"
        placement="right"
        :closable="true"
        @close="onClose"
        :visible="visible"
        width="600"
      >
        <ValidationObserver ref="observer" v-slot="{ passes }">
          <a-form>
            <a-divider>{{ $t('pages.information') }}</a-divider>
            <ValidationProvider name="name" rules="required" v-slot="slotProps">
              <a-form-item
                :label-col="{ span: 9 }"
                :wrapper-col="{ span: 15 }"
                label="EMBED KOD"
                :validateStatus="resolveState(slotProps)"
                :help="slotProps.errors[0]"
              >
                <textarea class="ant-input" v-model="form.embed"></textarea>
              </a-form-item>
            </ValidationProvider>
          </a-form>
          <div class="drawer-bottom">
            <a-button class="mr-2" @click="onClose">{{$t('btn.cancel')}}</a-button>
            <a-button :loading="loading" class="w-50" @click="passes(onSubmit)" type="primary">
              <i class="la la-save mr-2"></i>
              {{$t('btn.save')}}
            </a-button>
          </div>
        </ValidationObserver>
      </a-drawer>
    </a-card>
  </a-skeleton>
</template>

<script>
export default {
  props: ["tour_id", "product_data"],
  name: "VideoManager",

  data() {
    return {
      visible: false,
      base_url: process.env.url,
      data: [],
      loading: true,
      form: { embed: "" },
      imageModal: false
    };
  },
  methods: {
    fetch() {
      this.loading = true;
      this.$axios
        .get("/booking/tour/tour/" + this.tour_id + "/video")
        .then(r => {
          this.loading = false;
          this.data = r.data.data;
        });
    },
    refresh() {
      this.fetch();
    },

    deleteRecord(id) {
      this.$axios
        .delete("/booking/tour/tour/" + this.tour_id + "/video/" + id)
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

    onSubmit() {
      this.$axios
        .post(`/booking/tour/tour/${this.$route.params.id}/video/`, this.form)
        .then(res => {
          this.onResponse(res);
          this.form = { embed: "" };
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
    },
    onClose() {
      this.visible = false;
    },
    resolveState({ errors, pending, valid }) {
      if (errors[0]) {
        return "error";
      }
      return "";
    }
  },

  mounted() {
    this.fetch();
  }
};
</script>
