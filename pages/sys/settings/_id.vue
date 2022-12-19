<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>{{ $t('pages.settings.title')}}</h5>
      <div class="w-25 d-flex">
      <select @change="fetchData" v-model="currentDomain" class="form-control form-control-sm mr-2">
        <option v-for="(domain,index) in domains" v-bind:key="index" >{{domain.name}}</option>
      </select>
      <nuxt-link to="/sys/settings">
        <a-button type="primary">
          <i class="fe fe-arrow-left"></i>
          {{$t('btn.back')}}
        </a-button>
      </nuxt-link>
      </div>
    </div>

    <a-card class="no-padding">
      <a-menu v-model="currentMenu" mode="horizontal">
        <a-menu-item
          v-bind:key="group.id"
          v-for="(group) in settings.data"
          v-show="group.custom_url == 0"
        >
          <nuxt-link :to="group.route">
            <i :class="group.icon"></i>
            {{group.name}}
          </nuxt-link>
        </a-menu-item>
      </a-menu>
      <a-form class="pd-20">
        <div v-bind:key="index" v-for="(setting,index) in settingData" class="d-flex ">
          <a-form-item
            :label="setting.title"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            class="text-left ant-col-22"
          >
            <a-input v-model="settingData[index]['value']" v-if="setting.type == 1" />
            <a-textarea v-model="settingData[index]['value']" v-if="setting.type == 2" :rows="3" />
            <a-select v-model="settingData[index]['value']" v-if="setting.type == 3">
              <a-select-option
                :value="option.code"
                v-bind:key="subindex"
                v-for="(option,subindex) in setting.options"
              >{{option.name}}</a-select-option>
            </a-select>
            <a-switch v-model="settingData[index]['value']" v-if="setting.type == 4" />
          </a-form-item>

          <div class="btn-toolbar mt-1 ant-col-2">
            <a-button
              class="btn btn-sm ml-2"
              :title="$t('pages.settings.history')"
              style="height:30px"
              :loading="historyLoading"
              v-on:click="loadHistory(setting.key)"
            >
              <i class="fe fe-list"></i>
            </a-button>
            <button
              class="btn btn-sm ml-2"
              :title="$t('pages.settings.translate')"
              style="height:30px"
              v-if="setting.language == 1"
              v-on:click="loadSetting(setting)"
            >
              <i class="fe fe-globe"></i>
            </button>
          </div>
        </div>
        <a-form-item class="text-right">
          <a-button type="primary" class="save-btn" @click="save">
            <i class="fe fe-save mr-2"></i>
            {{ $t('btn.save')}}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-drawer
      :title="$t('pages.settings.history')"
      placement="right"
      :closable="false"
      @close="historyClose"
      :visible="historyVisible"
      :width="375"
    >
      <a-empty v-if=" history.length == 0" />

      <ul class="list-unstyled">
        <li class="mb-3" v-bind:key="index" v-for="(item,index) in history">
          <div class="air__l2__head d-flex justify-content-between">
            <p class="air__l2__title">
              <b>{{ item.admin_fullname }}</b>-
              <small>{{item.ip}}</small>
            </p>
            <time class="air__l2__time justify">{{ item.created_at }}</time>
          </div>
          <p class="air__l2__content">
            {{ $t('pages.settings.history_old') }} : {{item.old_value}}
            <br />
            {{ $t('pages.settings.history_new') }} : {{item.new_value}}
          </p>
          <hr />
        </li>
      </ul>
    </a-drawer>

    <a-drawer
      :closable="true"
      :title="settingFormVisible.title"
      :visible="settingFormVisible.show"
      @close="settingFormVisible.show = false"
      placement="right"
      width="425"
    >
      <ValidationObserver ref="observer" v-slot="{ passes }">
        <a-form>

          <a-select class="mr-2 w-100" v-model="settingFormVisible.index">
            <a-select-option :value="index" :key="index" v-for="(setting,index) in settingForm.translate"><i :class="'flag-icon-'+setting.language" class="flag-icon"></i> {{findLang(setting.language)}}</a-select-option>
          </a-select>

          <a-divider>{{ $t('settings.'+settingForm.key) }}</a-divider>
          <a-input v-model="settingForm.translate[settingFormVisible.index].value" v-if="settingForm.type == 1" />
          <a-textarea v-model="settingForm.translate[settingFormVisible.index].value" v-if="settingForm.type == 2" :rows="3" />
          <a-select v-model="settingForm.translate[settingFormVisible.index].value" v-if="settingForm.type == 3">
            <a-select-option
              :value="option.code"
              v-bind:key="subindex"
              v-for="(option,subindex) in setting.options"
            >{{option.name}}</a-select-option>
          </a-select>
          <a-switch v-model="settingForm.translate[settingFormVisible.index].value" v-if="settingForm.type == 4" />

        </a-form>
        <div class="drawer-bottom">
          <a-button @click="settingFormVisible.show = false" class="mr-2">{{$t('btn.cancel')}}</a-button>
          <a-button :loading="settingFormVisible.loading" @click="passes(updateSetting)" class="w-50" type="primary">
            <i class="fe fe-save mr-2"></i>
            {{$t('btn.save')}}
          </a-button>
        </div>
      </ValidationObserver>
    </a-drawer>

  </div>
</template>


<script>
export default {
  data() {
    return {
      currentMenu: this.$route.params.id,
      settingData: [],
      history: [],
      historyVisible: false,
      historyLoading : false,
      settingFormVisible: {title: this.$t('pages.settings.translate'), show:false, loading: false, index: 0},
      settingForm: {},
      languages: [],
      domains : [],
      currentDomain : 'martireisen.at'
    };
  },
  mounted() {
    this.fetchData();
    this.$store.dispatch("sys/settings/getSetting", {});
    this.getDomains();
    this.getLanguages();
  },
  computed: {
    settings() {
      return this.$store.state.sys.settings.setting;
    }
    
  },
  methods: {
    fetchData(){
      this.$axios
        .get("sys/settings/settings/get-by-category/" + this.$route.params.id+'?domain='+this.currentDomain)
        .then(res => {
          this.settingData = res.data.data;
        });
    },
    save() {
      this.$axios
        .put("sys/settings/settings/batch-update", this.settingData)
        .then(res => {
          this.$message.success(this.$t("messages.action_ok"));
        });
    },
    findLang(code){
      let x = _.find(this.languages, {code: code});
      return x ? x.name : code;
    },
    getLanguages(){
      this.$axios.get("sys/language?limit=9999").then(res => {
        this.languages = res.data.data;
      });
    },
    getDomains(){
      this.$axios.get("sys/domain?limit=9999").then(res => {
        this.domains = res.data.data;
      });
    },
    updateSetting(){
      this.settingFormVisible.loading = true;
      let setting = this.settingForm.translate[this.settingFormVisible.index];
      this.$axios
        .put("​sys/settings/settings/" + this.settingForm.id + "/translate", {language: setting.language, value: setting.value})
        .then(response => {
          this.onResponse(response);
        })
        .catch(error => {
          this.onFailure(error.response);
        });
    },
    onResponse(response) {
      var result = response.data.data;
      if (!response.data.status) {
        return this.onFailure(response);
      }

      this.fetchData();
      this.$notification["success"]({
        message: this.$t("messages.success"),
        description: this.$t("messages.action_ok"),
        placement: "bottomRight "
      });

      this.settingFormVisible.show = false;
      this.settingFormVisible.loading = false;
    },
    onFailure(response) {
      this.$notification["error"]({
        message: this.$t("messages.warning"),
        description: response.data.message,
        placement: "bottomRight "
      });
      this.settingFormVisible.loading = false;
    },
    loadSetting(setting){
      this.settingFormVisible.loading = true;
      this.settingFormVisible.index = 0;

      this.$axios.get("sys/settings/settings/" + setting.id).then(res => {
        this.settingForm = res.data.data;
        this.settingFormVisible.loading = false;
        this.settingFormVisible.show = true;
      });
    },
    loadHistory(key) {
      this.historyLoading = true;
      this.$axios.get("sys/settings/settings/history/" + key).then(res => {
        this.history = res.data.data;
        this.historyVisible = true;
        this.historyLoading = false;
      });
    },

    historyClose() {
      this.historyVisible = false;
    }
  }
};
</script>
