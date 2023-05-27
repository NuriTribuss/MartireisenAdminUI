<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>{{ $t('common.edit')}}</h5>
      <div class="d-flex">
        <nuxt-link to="/booking/tour">
          <a-button type="primary">
            <i class="la la-arrow-left"></i>
            {{ $t('btn.back')}}
          </a-button>
        </nuxt-link>
      </div>
    </div>
    <a-row :gutter="30">
      <ValidationProvider name="title" rules="required" v-slot="slotProps">
          <a-form-item
            :help="slotProps.errors[0]"
            label="başlık"
            :label-col="{ span: 2 }"
            :validateStatus="resolveState(slotProps)"
            :wrapper-col="{ span: 15 }"
          >
            <input class="ant-input" v-model="form.title" />
          </a-form-item>
        </ValidationProvider>
    </a-row>
    <a-row :gutter="30">
      <a-col :span="24">
        <a-tabs class="iconic-tab" defaultActiveKey="1" @change="tabChange">
          <a-tab-pane key="1">
            <span slot="tab">
              <i class="la la-info"></i>
              {{$t('pages.tour.tab_1')}}
            </span>
            <a-row :gutter="30">
              <ValidationObserver ref="observer" v-slot="{ passes }">
                
                <a-form class="form-vertical" layout="vertical">
                
                  <a-col :span="18">
                    <a-select v-model="language" @change="loadData" class="mr-2 mb-2" v-if="$route.params.id > 0">
                <a-select-option
                  :value="item.code"
                  v-bind:key="index"
                  v-for="(item,index) in languages.data"
                >
                  <i class="flag-icon" :class="'flag-icon-'+item.code"></i>
                  {{item.title}}
                </a-select-option>
              </a-select>
                    <a-card>
                      <ValidationProvider name="name" rules="required" v-slot="slotProps">
                        <a-form-item
                          :help="slotProps.errors[0]"
                          :label="$t('input.product_title')"
                          :label-col="{ span: 4 }"
                          :validateStatus="resolveState(slotProps)"
                          :wrapper-col="{ span: 20 }"
                        >
                          <input class="ant-input" v-model="form.name" />
                        </a-form-item>
                      </ValidationProvider>
                       <a-form-item
                        label="URL"
                        :label-col="{ span: 4 }"
                        :wrapper-col="{ span: 20 }"
                      >
                        <input class="ant-input" placeholder="Boş bırakıldığında isme göre otomatik oluşur" v-model="form.url"/>
                      </a-form-item>
                      <a-form-item
                        :label="$t('input.content')"
                        :label-col="{ span: 4 }"
                        :wrapper-col="{ span: 20 }"
                      >
                        <editor
                          id="editor"
                          :api-key="e.api_key"
                          :init="e.settings"
                          v-model="form.content"
                        ></editor>
                      </a-form-item>

                      <a-divider class="mb-4" orientation="left">{{$t('pages.tour.extra_info')}}</a-divider>
                      <a-form-item
                        :label="$t('pages.tour.map')"
                        :label-col="{ span: 4 }"
                        :wrapper-col="{ span: 20 }"
                      >
                        <textarea :rows="2" class="ant-input" v-model="form.map"></textarea>
                      </a-form-item>
                      <a-form-item
                        :label="$t('pages.tour.agreegment')"
                        :label-col="{ span: 4 }"
                        :wrapper-col="{ span: 20 }"
                      >
                        <textarea :rows="2" class="ant-input" v-model="form.agreegment"></textarea>
                      </a-form-item>
                    </a-card>
                  </a-col>
                  <a-col :span="6">
                    <a-card class="mb-3" v-if="!isTranslate">
                      <a-form-item :label-col="{ span:24 }" :wrapper-col="{ span: 24 }">
                        <a-divider orientation="left">{{$t('pages.tour.country')}}</a-divider>
                        <a-select
                          class="col-12 p-0"
                          v-model="form.country_id"
                          style="width: 100%; "
                          :filterOption="false"
                        >
                          <a-select-option v-for="(d) in countries" :key="d.id">{{d.name_tr}}</a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item :label-col="{ span:24 }" :wrapper-col="{ span: 24 }">
                        <a-divider orientation="left">{{$t('pages.tour.departure')}}</a-divider>
                        <input class="ant-input" v-model="form.departure_place" />
                      </a-form-item>

                      <a-form-item :label-col="{ span:24 }" :wrapper-col="{ span: 24 }">
                        <a-divider orientation="left">{{$t('pages.tour.destination')}}</a-divider>
                        <input class="ant-input" v-model="form.destination" />
                      </a-form-item>
                       <a-form-item :label-col="{ span:24 }" :wrapper-col="{ span: 24 }">
                        <a-divider orientation="left">{{$t('pages.tour.contact_phone')}}</a-divider>
                        <input class="ant-input" v-model="form.contact_phone" />
                      </a-form-item>
                      <a-form-item :label-col="{ span:24 }" :wrapper-col="{ span: 24 }">
                        <a-divider orientation="left">{{$t('pages.tour.age')}}</a-divider>
                        <a-select
                          class="col-12 p-0"
                          mode="multiple"
                          v-model="form.age_group"
                          style="width: 100%; "
                          :filterOption="false"
                        >
                          <a-select-option v-for="(d) in ages" :key="d.code">{{d.title}}</a-select-option>
                        </a-select>
                      </a-form-item>

                      <a-form-item :label-col="{ span:24 }" :wrapper-col="{ span: 24 }">
                        <a-divider orientation="left">{{$t('pages.tour.type')}}</a-divider>
                        <a-select
                          class="col-12 p-0"
                          mode="multiple"
                          v-model="form.type"
                          style="width: 100%; "
                          :filterOption="false"
                        >
                          <a-select-option v-for="(d) in types" :key="d.code">{{d.translate.name}}</a-select-option>
                        </a-select>
                      </a-form-item>

                      <a-row :gutter="15">
                        <a-col :span="12">
                          <a-form-item :label-col="{ span:24 }" :wrapper-col="{ span: 24 }">
                            <a-divider orientation="left">{{$t('pages.pages.cols.sort_number')}}</a-divider>
                            <input class="ant-input" type="number" v-model="form.sort_number" />
                          </a-form-item>
                        </a-col>
                        <a-col :span="12">
                          <a-form-item :label-col="{ span:24 }" :wrapper-col="{ span: 24 }">
                            <a-divider orientation="left">{{$t('pages.contents.save.status')}}</a-divider>
                            <a-switch defaultChecked v-model="form.active" />
                          </a-form-item>
                        </a-col>
                      </a-row>
                    </a-card>
                    <a-card>
                      <a-form-item
                        class="single-upload"
                        :label-col="{ span:24 }"
                        :wrapper-col="{ span: 24 }"
                      >
                        <a-divider orientation="left">{{$t('pages.tour.image_file')}}</a-divider>
                        <img class="w-100 mb-2" :src="base_url+image" v-if="image" />
                        <a-upload v-if="!isTranslate"
                          :fileList="fileList"
                          :remove="handleRemove"
                          :beforeUpload="beforeUpload"
                        >
                          <a-button>
                            <a-icon type="upload" />
                            {{$t('btn.select_file')}}
                          </a-button>
                        </a-upload>
                      </a-form-item>
                    </a-card>

                    <a-form-item>
                      <a-button @click="passes(onSubmit)" class="save-btn w-100" type="primary">
                        <i class="la la-save mr-2"></i>
                        {{ $t('btn.save')}}
                      </a-button>
                    </a-form-item>
                  </a-col>
                </a-form>
              </ValidationObserver>
            </a-row>
          </a-tab-pane>

          <a-tab-pane key="2" v-if="isEditPage && !isTranslate">
            <span slot="tab">
              <i class="la la-align-right"></i>
              {{$t('pages.tour.tab_2')}}
            </span>
            <period-manager
              :product_data="data"
              :tour_id="$route.params.id"
              :languages="languages"
              @drawvisible="drawerVar"
            ></period-manager>
          </a-tab-pane>
          <a-tab-pane key="3" v-if="isEditPage && !isTranslate">
            <span slot="tab">
              <i class="la la-align-right"></i>
              {{$t('pages.tour.tab_3')}}
            </span>
            <property-manager
              :product_data="data"
              :tour_id="$route.params.id"
              :languages="languages"
              @drawvisible="drawerVar"
            ></property-manager>
          </a-tab-pane>
          <a-tab-pane key="4" v-if="isEditPage && !isTranslate">
            <span slot="tab">
              <i class="la la-align-right"></i>
              {{$t('pages.tour.tab_4')}}
            </span>
            <plan-manager
              :product_data="data"
              :tour_id="$route.params.id"
              :languages="languages"
              @drawvisible="drawerVar"
            ></plan-manager>
          </a-tab-pane>
          <a-tab-pane key="5" v-if="isEditPage && !isTranslate">
            <span slot="tab">
              <i class="la la-image"></i>
              {{$t('pages.tour.tab_5')}}
            </span>
            <image-manager :tour_id="$route.params.id" :product_data="data" ref="imagecomp"></image-manager>
          </a-tab-pane>
           <a-tab-pane key="6" v-if="isEditPage && !isTranslate">
            <span slot="tab">
              <i class="la la-image"></i>
              {{$t('pages.tour.tab_6')}}
            </span>
            <video-manager :tour_id="$route.params.id" :product_data="data" ></video-manager>
          </a-tab-pane>
          <a-tab-pane key="7" v-if="isEditPage && !isTranslate">
            <span slot="tab">
              <i class="la la-image"></i>
              {{$t('pages.tour.tab_7')}}
            </span>
            <kroki-manager :tour_id="$route.params.id" :product_data="data" ></kroki-manager>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.ant-divider-horizontal.ant-divider-with-text,
.ant-divider-horizontal.ant-divider-with-text-left,
.ant-divider-horizontal.ant-divider-with-text-right {
  margin: 5px 0;
}
</style>
<script>
import ImageManager from "~/components/tour/imagemanager/";
import VideoManager from "~/components/tour/videomanager/";

import PlanManager from "~/components/tour/planmanager/";
import PropertyManager from "~/components/tour/propertymanager/";
import PeriodManager from "~/components/tour/periodmanager/";
import KrokiManager from "~/components/tour/krokimanager/";

import Editor from "@tinymce/tinymce-vue";
import ViTable from "@/components/vi-table";

export default {
  components: {
    "plan-manager": PlanManager,
    "video-manager" : VideoManager,
    "image-manager": ImageManager,
    "property-manager": PropertyManager,
    "period-manager": PeriodManager,
    "kroki-manager" : KrokiManager,
    editor: Editor
  },
  data() {
    return {
      base_url: process.env.url,
      data: {},
      fileList: [],
      language: "",
      default_language: "",
      visibleLanguages: false,
      visible: false,
      visiblevar: false,
      loading: false,
      form: {
        title: "",
        meta: {},
        active: 1,
        sort_number: 99,
        contact_phone :'',
        age_group: [],
        type: [],
        country_id: 0
      },
      newForm: {
        tour_id: this.$route.params.id,
        sort_number: 99,
        active: 1
      },
      actions: [
        {
          name: "new",
          icon: "plus",
          label: "btn.add"
        },
        {
          name: "refresh",
          icon: "sync",
          label: "btn.refresh"
        }
      ],

      imageForm: {},
      types: [],
      countries: [],
      ages: []
    };
  },
  mounted() {
    this.$store.dispatch("localization/languages/get", { page: 1 });

    if (this.$route.params.id && this.$route.params.id > 0) {
      this.fetch().then(r => {
        this.default_language = this.language;
      });
    }

    this.$axios.get("/booking/tour/type").then(response => {
      this.types = response.data.data;
    });
    this.$axios.get("/booking/tour/age").then(response => {
      this.ages = response.data.data;
    });
    this.$axios.get("/region/country?limit=500").then(response => {
      this.countries = response.data.data;
    });
  },
  computed: {
    e() {
      return this.$store.state.tinymce;
    },
    languages() {
      return this.$store.state.localization.languages.table;
    },

    isTranslate() {
      return this.language != this.default_language;
    },
    isEditPage() {
      return this.$route.params.id > 0;
    }
  },
  methods: {
    fetch() {
      return this.$axios
        .get("/booking/tour/tour/" + this.$route.params.id)
        .then(response => {
          this.data = response.data.data;
          this.form.title = this.data.title;
          this.form.sort_number = this.data.sort_number;
          this.form.active = this.data.active;
          this.form.destination = this.data.destination;
          this.form.departure_place = this.data.departure_place;
          this.form.map = this.data.map;
          this.form.contact_phone = this.data.contact_phone;

          this.form.age_group = this.data.age_group;
          this.form.type = this.data.type;
          this.image = this.data.image;
          this.form.country_id = this.data.country_id;
          this.setLanguageData();

        });
    },
    
    setLanguageData() {
      var translate = this.resolveTranslate(this.data);

      this.language = translate.language;
      this.form.name = translate.name;
      this.form.content = translate.content;
      this.form.agreegment = translate.agreegment;
      this.form.url = translate.url;
      this.form.language = translate.language;
    },

    loadData() {
      this.setLanguageData();
    },

    resolveState({ errors, pending, valid }) {
      if (errors[0]) {
        return "error";
      }
      return "";
    },

    resolveTranslate(data) {
      for (let index = 0; index < data.translate.length; ++index) {
        let value = data.translate[index];
        if (value.default == 1 && this.language == "") {
          return value;
        }

        if (this.language == value.language) {
          return value;
        }
      }
      return null;
    },

    onSubmit() {
      if (this.$route.params.id && this.$route.params.id > 0) {
        let extra = this.language != this.default_language ? "/translate" : "";

        this.$axios
          .put("/booking/tour/tour/" + this.$route.params.id + extra, this.form)
          .then(response => {
            this.onResponse(response);
            this.fetch();
          })
          .catch(error => {
            this.onFailure(error.response);
          });
      } else {
        this.$axios
          .post("/booking/tour/tour", this.form)
          .then(response => {
            this.onResponse(response);
          })
          .catch(error => {
            this.onFailure(error.response);
          });
      }
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

      if (this.fileList.length == 1) {
        let id = this.$route.params.id > 0 ? this.$route.params.id : result.id;

        this.upload(id).then(response => {
          if (result.action == "insert") {
            this.$router.push({
              path: "/booking/tour/" + result.id
            });
          }
          this.loading = false;
        });
      } else {
        if (result.action == "insert") {
          this.$router.push({
            path: "/booking/tour/" + result.id
          });
        }
      }
    },

    onFailure(response) {
      this.$notification["error"]({
        message: this.$t("messages.warning"),
        description: response.data.message,
        placement: "bottomRight "
      });
    },
    onCategoryChange(value) {
      this.form.categories = value;
    },
    handleCancel() {
      this.previewVisible = false;
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
    },
    handleChange({ fileList }) {
      this.fileList = fileList;
    },

    onClose() {
      (this.visible = false),
        (this.visiblevar = false),
        (this.newForm = {
          tour_id: this.$route.params.id,
          sort_number: 23,
          active: 1
        }),
        (this.form = {
          meta: {},
          active: 1,
          sort_number: 24,
          categories: []
        });
    },

    drawerVar() {
      this.visiblevar = true;
    },
    tabChange(index) {
      if (index == 1) {
        tinymce.EditorManager.execCommand("mceRemoveEditor", false, "editor");
        tinymce.EditorManager.execCommand("mceAddEditor", false, "editor");
      }
    },
    upload(id) {
      const { fileList } = this;
      const formData = new FormData();

      if (fileList.length != 1) {
        return true;
      }

      formData.append("file", fileList[0]);

      return this.$axios
        .post("/booking/tour/tour/" + id + "/setMainImage", formData)
        .then(response => {
          if (response.data.status) {
            this.$message.success(`File uploaded successfully.`);
            this.fileList = [];

            if (this.$route.params.id > 0) {
              this.fetch();
            }
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
  }
};
</script>
