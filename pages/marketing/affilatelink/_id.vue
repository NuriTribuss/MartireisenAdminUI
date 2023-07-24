<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>Reklam Linki Ekle / Düzenle</h5>
      <div class="d-flex">
        <nuxt-link to="/marketing/affilatelink">
          <a-button type="primary">
            <i class="la la-arrow-left"></i>
            {{ $t('btn.back')}}
          </a-button>
        </nuxt-link>
      </div>
    </div>

    <a-row :gutter="30">
      <a-col :span="24">
        <a-row :gutter="30">
          <ValidationObserver ref="observer" v-slot="{ passes }">
            <a-form class="form-vertical" layout="vertical">
              <a-col :span="18">
                <a-card>
                  <a-form-item
                    :label-col="{ span:4 }"
                    :wrapper-col="{ span: 20 }"
                    label="Seo Url"
                  >
                    <a-input v-model="form.seo_url" placeholder="Seo Url" />
                  </a-form-item>
                  <a-form-item 
                    :label-col="{ span:4 }"
                    :wrapper-col="{ span: 20 }"
                    label="Url"
                  >
                    <a-input v-model="form.enteredroute" placeholder="Url" />
                  </a-form-item>
                  <a-form-item 
                    :label-col="{ span:4 }"
                    :wrapper-col="{ span: 20 }"
                    label=" "
                  >
                  <a-alert
                    message="URL"
                    :description=form.route
                    type="info"
                  />
                  </a-form-item>
                  
                  <a-form-item>
                    <a-button @click="passes(onSubmit)" class="save-btn w-100" type="primary">
                      <i class="la la-save mr-2"></i>
                      {{ $t('btn.save')}}
                    </a-button>
                  </a-form-item>
                  
                </a-card>
              </a-col>
            </a-form>
          </ValidationObserver>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>


<script>
import ViTable from "@/components/vi-table";

export default {
  data() {
    return {
      loading: false,
      form: {
        seo_url: "",
        enteredroute: "",
        route: "",
      }
    };
  },
  watch: {
    'form.enteredroute'(){
      this.calcRoute();
    },
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    onSubmit() {
      this.$axios
        .post("/marketing/affilatelink", this.form)
        .then((response) => {
          this.onResponse(response);
        })
        .catch((error) => {
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
        placement: "bottomRight ",
      });

     
        this.$router.push({
            path: "/marketing/affilatelink/"
        });
    },
    onFailure(response) {
      this.$notification["error"]({
        message: this.$t("messages.warning"),
        description: response.data.message,
        placement: "bottomRight ",
      });
    },  
    calcRoute()
    {
      if(this.form.enteredroute.includes("https://www.martireisen.at") || 
        this.form.enteredroute.includes("http://www.martireisen.at") || 
        this.form.enteredroute.includes("https://martireisen.at") || 
        this.form.enteredroute.includes("http://martireisen.at")){
          this.form.route = this.form.enteredroute.replace(/^.*\/\/[^\/]+/, '');
      }
      else if (!this.form.enteredroute.startsWith("/")){
        this.form.route = "/" + this.form.enteredroute;
      }
      else{
        this.form.route = this.form.enteredroute;
      }

      let newVal = this.$moment(this.form.date_start).add(this.form.duration, "days").format('YYYY-MM-DD');
      if(newVal != this.form.date_end){
        this.form.date_end=newVal;
      }
    },
  },
};
</script>
