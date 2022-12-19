<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>
        {{ $t('common.edit')}} > {{form.title}}
       
      </h5>
      <div class="d-flex">
        <a-select v-model="language" @change="loadData" class="mr-2" v-if="$route.params.id">
          <a-select-option
            :value="item.code"
            v-bind:key="index"
            v-for="(item,index) in languages.data"
          >
            <i class="flag-icon" :class="'flag-icon-'+item.code"></i>
            {{item.name}}
          </a-select-option>
        </a-select>
        <nuxt-link to="/landing/otel">
          <a-button type="primary">
            <i class="fe fe-arrow-left"></i>
            {{ $t('btn.back') }}
          </a-button>
        </nuxt-link>
      </div>
    </div>

    <a-row :gutter="15">
      <ValidationObserver ref="observer" v-slot="{ passes }">
        <a-form class="form-vertical" layout="vertical">
          <a-col :span="18">
            <a-card class="no-padding tab-padding">
              <a-tabs defaultActiveKey="1" @change="activateEditor" class="iconic-tab">
                <a-tab-pane key="1">
                  <span slot="tab">
                    <i class="fe fe-edit"></i>
                    {{$t('pages.contents.save.content')}}
                  </span>

                  <ValidationProvider name="name" rules="required" v-slot="slotProps">
                    <a-divider orientation="left">{{$t('pages.contents.save.title')}} (H1)</a-divider>
                    <a-form-item
                      :label-col="{ span: 24 }"
                      :wrapper-col="{ span: 24 }"
                      hasFeedback
                      :validateStatus="resolveState(slotProps)"
                      :help="slotProps.errors[0]
                    "
                    >
                      <a-input v-model="form.title"></a-input>
                    </a-form-item>
                  </ValidationProvider>
                  <a-form-item :label-col="{ span:24 }" :wrapper-col="{ span: 24 }">
                    <a-divider orientation="left">{{$t('pages.landing_otel.cols.subtitle')}} (H2)</a-divider>
                      <a-input v-model="form.subtitle"></a-input>
                  </a-form-item>
                    <a-form-item :label-col="{ span:24 }" :wrapper-col="{ span: 24 }">
                    <a-divider orientation="left">{{$t('pages.landing_otel.cols.second_title')}} (H2)</a-divider>
                      <a-input v-model="form.second_title"></a-input>
                  </a-form-item>
                    <a-form-item :label-col="{ span:24 }" :wrapper-col="{ span: 24 }">
                    <a-divider orientation="left">{{$t('pages.landing_otel.cols.second_subtitle')}} (H2)</a-divider>
                      <a-input v-model="form.second_subtitle"></a-input>
                  </a-form-item>
                  <a-form-item :label-col="{ span:24 }" :wrapper-col="{ span: 24 }">
                    <a-divider orientation="left">{{$t('pages.contents.save.content')}}</a-divider>
                    <editor id="editor" :api-key="e.api_key" :init="e.settings" v-model="form.content"></editor>
                  </a-form-item>
                </a-tab-pane>
                <a-tab-pane key="2" forceRender>
                  <span slot="tab">
                    <i class="fe fe-settings"></i>
                    {{$t('pages.contents.save.seoSettings')}}
                  </span>
                  <a-form-item :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
                    <a-divider orientation="left">{{$t('pages.contents.translate.url')}}</a-divider>
                    <a-input :disabled="true" v-model="form.url"></a-input>
                  </a-form-item>
                  <a-form-item :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
                    <a-divider orientation="left">{{$t('pages.contents.save.seoTitle')}}</a-divider>
                    <a-input v-model="form.meta.title"></a-input>
                  </a-form-item>
                  <a-form-item :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
                    <a-divider orientation="left">{{$t('pages.contents.save.seoDesc')}}</a-divider>
                    <a-textarea :rows="3" v-model="form.meta.description"></a-textarea>
                  </a-form-item>
                  <a-form-item :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
                    <a-divider orientation="left">{{$t('pages.contents.save.seoTag')}}</a-divider>
                    <a-textarea :rows="3" v-model="form.meta.keywords"></a-textarea>
                  </a-form-item>
                </a-tab-pane>
              </a-tabs>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card>
              <a-form-item :label-col="{ span:24 }" :wrapper-col="{ span: 24 }" v-if="!isTranslate">
                <a-divider orientation="left">{{$t('pages.contents.save.sort_no')}}</a-divider>
                <a-input-number id="inputNumber" v-model="form.sort_number" size="large" />
              </a-form-item>
              <a-form-item :label-col="{ span:24 }" :wrapper-col="{ span: 24 }" v-if="!isTranslate">
                <a-divider orientation="left">{{$t('pages.contents.save.status')}}</a-divider>
                <a-switch defaultChecked v-model="form.active" />
              </a-form-item>
              <a-form-item>
                <a-button type="primary" class="save-btn w-100" @click="passes(onSubmit)">
                  <i class="fe fe-save mr-2"></i>
                  {{ $t('btn.save')}}
                </a-button>
              </a-form-item>
            </a-card>
          </a-col>
        </a-form>
      </ValidationObserver>
    </a-row>
  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";

export default {
  data() {
    return {
      env: process.env.url,
      data: {},
      language: "",
      default_language: "",
      form: {
        meta: {},
        url: "",
        active: true,
        sort_number: 99,
        content: "",
        title : '',
        subtitle : '',
        second_title : '',
        second_subtitle : ''
      },
    };
  },
  components: {
    editor: Editor
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
    }
  },

  mounted() {
    this.$store.dispatch("localization/languages/get", { page: 1 });

    if (this.$route.params.id) {
      this.fetch().then(r => {
        this.default_language = this.language;
      });
    }
  },

  methods: {

    // keep alive editor fix
    activateEditor(){
        tinymce.EditorManager.execCommand('mceRemoveEditor', false, 'editor')
        tinymce.EditorManager.execCommand('mceAddEditor', false, 'editor')
    },

    fetch() {
      return this.$axios
        .get("/landing/otel/" + this.$route.params.id)
        .then(response => {
          this.data = response.data.data;

          this.form.sort_number = this.data.sort_number;
          this.form.active = Boolean(this.data.active);

          this.setLanguageData();
        });
    },
    setLanguageData() {
      var translate = this.resolveTranslate(this.data);

      this.language             = translate.language;
      this.form.title           = translate.title;
      this.form.subtitle        = translate.subtitle;
      this.form.second_title    = translate.second_title;
      this.form.second_subtitle = translate.second_subtitle;
      this.form.content = translate.content;
      this.form.url = translate.url;
      this.form.meta = translate.meta;
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
      if (this.$route.params.id) {
        let extra = this.language != this.default_language ? "/translate" : "";

        this.$axios
          .put("/landing/otel/" + this.$route.params.id + extra, this.form)
          .then(response => {
            this.onResponse(response);
            this.fetch();
          })
          .catch(error => {
            this.onFailure(error.response);
          });
      } else {
        this.$axios
          .post("/landing/otel", this.form)
          .then(response => {
            this.onResponse(response);
          })
          .catch(error => {
            this.onFailure(error.response);
          });
      }
    },

    onResponse(response) {
      var result = response.data.data;
      if (!response.data.status) {
        return this.onFailure(response);
      }

      this.$notification["success"]({
        message: this.$t("messages.success"),
        description: this.$t("messages.action_ok"),
        placement: "bottomRight "
      });
      if (result.action == "insert") {
        this.$router.push({
          path: "/content/pages/save/" + result.id
        });
      }
    },

    onFailure(response) {
      this.$notification["error"]({
        message: this.$t("messages.warning"),
        description: response.data.message,
        placement: "bottomRight "
      });
    }
  }
};
</script>
