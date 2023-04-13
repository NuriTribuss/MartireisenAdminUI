<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>{{ $t('common.edit')}}</h5>
      <nuxt-link to="/">
        <a-button type="primary">
          <i class="la la-arrow-left"></i> Geri
        </a-button>
      </nuxt-link>
    </div>

    <a-row :gutter="30">
      <a-col :span="24">
        <a-tabs defaultActiveKey="1" class="iconic-tab">
          <a-tab-pane key="1">
            <span slot="tab">
              <i class="flag-icon flag-icon-tr"></i>
              Türkçe
            </span>
            <a-row :gutter="30">
              <a-col :span="24">
                <a-card>
                  <a-divider orientation="left">{{ $t('settings.seo.title')}}</a-divider>
                  <a-form layout="vertical">
                    <a-form-item
                      :label="$t('settings.seo.cols.url')"
                      :label-col="{ span: 4 }"
                      :wrapper-col="{ span: 20 }"
                    >
                      <a-input-search placeholder @search="onSearch" enterButton="KONTROL ET" />
                    </a-form-item>
                    <a-form-item
                      :label="$t('settings.seo.detail.title')"
                      :label-col="{ span: 4 }"
                      :wrapper-col="{ span: 20 }"
                    >
                      <a-input></a-input>
                    </a-form-item>
                    <a-form-item
                      :label="$t('settings.seo.detail.description')"
                      :label-col="{ span: 4 }"
                      :wrapper-col="{ span: 20 }"
                    >
                      <a-textarea></a-textarea>
                    </a-form-item>
                    <a-form-item
                      :label="$t('settings.seo.detail.keywords')"
                      :label-col="{ span: 4 }"
                      :wrapper-col="{ span: 20 }"
                    >
                      <a-select mode="tags" style="width: 100%">
                        <a-select-option value="1">tag 1</a-select-option>
                        <a-select-option value="2">tag 2</a-select-option>
                        <a-select-option value="3">tag 3</a-select-option>
                      </a-select>
                    </a-form-item>

                    <a-form-item>
                      <a-button type="primary" class="save-btn">
                        <i class="la la-save mr-2"></i>
                        {{ $t('btn.save')}}
                      </a-button>
                    </a-form-item>
                  </a-form>
                </a-card>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="2">
            <span slot="tab">
              <i class="flag-icon flag-icon-en"></i>
              English
            </span>
            <a-row :gutter="30">
              <a-col :span="24">
                <a-card>
                  <a-divider orientation="left">{{ $t('settings.seo.title')}}</a-divider>
                  <a-form layout="vertical">
                    <a-form-item
                      :label="$t('settings.seo.cols.url')"
                      :label-col="{ span: 4 }"
                      :wrapper-col="{ span: 20 }"
                    >
                      <a-input-search placeholder @search="onSearch" enterButton="KONTROL ET" />
                    </a-form-item>
                    <a-form-item
                      :label="$t('settings.seo.detail.title')"
                      :label-col="{ span: 4 }"
                      :wrapper-col="{ span: 20 }"
                    >
                      <a-input></a-input>
                    </a-form-item>
                    <a-form-item
                      :label="$t('settings.seo.detail.description')"
                      :label-col="{ span: 4 }"
                      :wrapper-col="{ span: 20 }"
                    >
                      <a-textarea></a-textarea>
                    </a-form-item>
                    <a-form-item
                      :label="$t('settings.seo.detail.keywords')"
                      :label-col="{ span: 4 }"
                      :wrapper-col="{ span: 20 }"
                    >
                      <a-select mode="tags" style="width: 100%">
                        <a-select-option value="1">tag 1</a-select-option>
                        <a-select-option value="2">tag 2</a-select-option>
                        <a-select-option value="3">tag 3</a-select-option>
                      </a-select>
                    </a-form-item>

                    <a-form-item>
                      <a-button type="primary" class="save-btn">
                        <i class="la la-save mr-2"></i>
                        {{ $t('btn.save')}}
                      </a-button>
                    </a-form-item>
                  </a-form>
                </a-card>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="3">
            <span slot="tab">
              <i class="flag-icon flag-icon-de"></i>
              Deutsch
            </span>
            <a-row :gutter="30">
              <a-col :span="24">
                <a-card>
                  <a-divider orientation="left">{{ $t('settings.seo.title')}}</a-divider>
                  <a-form layout="vertical">
                    <a-form-item
                      :label="$t('settings.seo.cols.url')"
                      :label-col="{ span: 4 }"
                      :wrapper-col="{ span: 20 }"
                    >
                      <a-input-search placeholder @search="onSearch" enterButton="KONTROL ET" />
                    </a-form-item>
                    <a-form-item
                      :label="$t('settings.seo.detail.title')"
                      :label-col="{ span: 4 }"
                      :wrapper-col="{ span: 20 }"
                    >
                      <a-input></a-input>
                    </a-form-item>
                    <a-form-item
                      :label="$t('settings.seo.detail.description')"
                      :label-col="{ span: 4 }"
                      :wrapper-col="{ span: 20 }"
                    >
                      <a-textarea></a-textarea>
                    </a-form-item>
                    <a-form-item
                      :label="$t('settings.seo.detail.keywords')"
                      :label-col="{ span: 4 }"
                      :wrapper-col="{ span: 20 }"
                    >
                      <a-select mode="tags" style="width: 100%">
                        <a-select-option value="1">tag 1</a-select-option>
                        <a-select-option value="2">tag 2</a-select-option>
                        <a-select-option value="3">tag 3</a-select-option>
                      </a-select>
                    </a-form-item>

                    <a-form-item>
                      <a-button type="primary" class="save-btn">
                        <i class="la la-save mr-2"></i>
                        {{ $t('btn.save')}}
                      </a-button>
                    </a-form-item>
                  </a-form>
                </a-card>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>


<script>


const fieldData = [
  {
    key: "1",
    code: "Garanti Bankası",
    value: "lorem ipsum"
  }
];

export default {
  data() {
    return {
      fieldData,
      value: undefined,
      sortNoValue: 3,
      isVariant: false,
      option1: "",
      option0: "",
      rows: [],
      optionCounter: 2,
      drawnerVisible: false,
      valueDrawerSort: 0
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
    },
    handleChangeUpload(info) {
      const status = info.file.status;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        this.$message.success(`${info.file.name} dosya başarıyla yüklendi.`);
      } else if (status === "error") {
        this.$message.error(
          `${info.file.name} dosya yüklenirken bir hata oluştu.`
        );
      }
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
    stockOnChange(value) {
      console.log("changed", value);
    },
    addRow: function() {
      this.rows.push({});
    },
    showDrawer() {
      this.drawnerVisible = true;
    },
    onClose() {
      this.drawnerVisible = false;
    },
    onChangeDrawerSort(value) {
      console.log("changed", value);
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