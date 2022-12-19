<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>{{ $t('common.edit')}}</h5>
      <nuxt-link to="/">
        <a-button type="primary">
          <i class="fe fe-arrow-left"></i> Geri
        </a-button>
      </nuxt-link>
    </div>

    <a-row :gutter="15">
      <a-col :span="24">
        <a-card class="no-padding tab-padding">
          <a-tabs defaultActiveKey="1" class="iconic-tab">
            <a-tab-pane key="1">
              <span slot="tab">
                <i class="fe fe-edit"></i>
                {{$t('pages.contents.save.content')}}
              </span>
              <a-form class="form-vertical pd-20" layout="vertical">
                <a-row :gutter="30">
                  <a-col :span="12">
                    <a-form-item :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
                      <a-divider orientation="left">{{$t('pages.contents.translate.lang')}}</a-divider>
                      <a-select v-model="lang">
                        <div slot="dropdownRender" slot-scope="menu">
                          <v-nodes :vnodes="menu" />
                        </div>
                        <a-select-option value="tr">
                          <i class="flag-icon flag-icon-tr"></i> Türkçe
                        </a-select-option>
                        <a-select-option value="en">
                          <i class="flag-icon flag-icon-en"></i> İngilizce
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="30">
                  <a-col :span="12">
                    <a-form-item :label-col="{ span:24 }" :wrapper-col="{ span: 24 }">
                      <a-divider orientation="left">{{$t('pages.contents.translate.content_title')}}</a-divider>
                      <a-input></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item :label-col="{ span:24 }" :wrapper-col="{ span: 24 }">
                      <a-divider orientation="left">{{$t('pages.contents.translate.url')}}</a-divider>
                      <a-input></a-input>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-form-item :label-col="{ span:24 }" :wrapper-col="{ span: 24 }">
                  <a-divider orientation="left">{{$t('pages.contents.save.content')}}</a-divider>
                  <a-textarea :rows="10"></a-textarea>
                </a-form-item>
                <a-form-item class="text-right">
                  <a-button type="primary" class="save-btn">
                    <i class="fe fe-save"></i>
                    {{$t('btn.save')}}
                  </a-button>
                </a-form-item>
              </a-form>
            </a-tab-pane>
            <a-tab-pane key="2" forceRender>
              <span slot="tab">
                <i class="fe fe-settings"></i>
                {{$t('pages.contents.save.seoSettings')}}
              </span>
              <a-form class="form-vertical pd-20" layout="vertical">
                <a-form-item :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
                  <a-divider orientation="left">{{$t('pages.contents.translate.lang')}}</a-divider>
                  <a-select v-model="seoLang">
                    <div slot="dropdownRender" slot-scope="menu">
                      <v-nodes :vnodes="menu" />
                    </div>
                    <a-select-option value="tr">
                      <i class="flag-icon flag-icon-tr"></i> Türkçe
                    </a-select-option>
                    <a-select-option value="en">
                      <i class="flag-icon flag-icon-en"></i> İngilizce
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
                  <a-divider orientation="left">{{$t('pages.contents.save.seoTitle')}}</a-divider>
                  <a-input></a-input>
                </a-form-item>
                <a-form-item :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
                  <a-divider orientation="left">{{$t('pages.contents.save.seoDesc')}}</a-divider>
                  <a-textarea></a-textarea>
                </a-form-item>
                <a-form-item :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
                  <a-divider orientation="left">{{$t('pages.contents.save.seoTag')}}</a-divider>
                  <a-select
                    mode="tags"
                    style="width: 100%"
                    @change="tagHandleChange"
                    placeholder="Etiketler"
                    size="large"
                  >
                    <a-select-option value="1">tag 1</a-select-option>
                    <a-select-option value="2">tag 2</a-select-option>
                    <a-select-option value="3">tag 3</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item class="text-right">
                  <a-button type="primary" class="save-btn">
                    <i class="fe fe-save"></i>
                    {{$t('btn.save')}}
                  </a-button>
                </a-form-item>
              </a-form>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>


<script>
export default {
  data() {
    return {
      value: undefined,
      sortNoValue: 3,
      lang: "tr",
      seoLang: "tr"
    };
  },
  methods: {
    categoriesOnChange(value) {
      console.log(value);
      this.value = value;
    },
    categoriesOnSearch() {
      console.log(...arguments);
    },
    categoriesOnSelect() {
      console.log(...arguments);
    },
    sortNoOnChange(value) {
      console.log("changed", value);
    },
    statusOnChange(checked) {
      console.log(`a-switch to ${checked}`);
    },
    tagHandleChange(value) {
      console.log(`selected ${value}`);
    }
  },
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  }
};
</script>