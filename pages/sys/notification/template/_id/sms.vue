<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>{{ $t('menu.notification')}} > {{parent.name}}</h5>
       <nuxt-link to="/sys/notification">
        <a-button type="primary">
          <i class="fe fe-arrow-left"></i> {{ $t('btn.back')}}
        </a-button>
      </nuxt-link>
    </div>

    <a-row :gutter="15">
      <a-col :span="18">
        <a-card class="no-padding">
          <a-menu v-model="currentMenu" mode="horizontal" class="grid-2 text-center">
            <a-menu-item key="mail">
              <nuxt-link to="/sys/notification/template/2/mail">
                <i class="fe fe-mail"></i>
                Mail
              </nuxt-link>
            </a-menu-item>
            <a-menu-item key="sms">
              <nuxt-link to="/sys/notification/template/2/sms">
                <i class="fe fe-message-square"></i>
                Sms
              </nuxt-link>
            </a-menu-item>
          </a-menu>

          <a-form class="pd-20">
            <a-form-item
              :label="$t('common.language')"
              :label-col="{ span: 3 }"
              :wrapper-col="{ span: 21 }"
              class="text-left"
            >
              <a-select v-model="language" v-on:change="load" class="w-50">
                <a-select-option :value="item.language" v-bind:key="index" v-for="(item,index) in data">
                  <i class="flag-icon" :class="'flag-icon-'+item.language"></i> {{item.language_name}}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
              label="Mesaj"
              :label-col="{ span: 3 }"
              :wrapper-col="{ span: 21 }"
              class="text-left"
            >
              <a-textarea v-model="sms.message" :rows="3"></a-textarea>
            </a-form-item>

            <a-form-item class="text-right">
              <a-button type="primary" class="save-btn" @click="save">
                <i class="fe fe-save mr-2"></i>
                {{ $t('btn.save')}}
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <p v-html="$t('pages.notification.parameters')"></p>
          <ul class="list-group list-group-flush">
            <li class="pt-2 pb-2 list-group-item" v-bind:key="item" v-for="(param,item) in parent.parameters">{{param}}</li>
          </ul>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentMenu : ['sms'],
      language : '',
      data : [],
      sms : {},
      parent : {}

    };
  },
  mounted() {
    this.fetch();
  },

  
  methods: {
    fetch(params = {}) {
      this.loading = true;
      this.$axios.get("/notification/template/"+this.$route.params.id+'/sms').then(response => {
        this.data = response.data.data;
        this.parent = response.data.parent;
        this.sms = this.data[0];
        this.language = this.sms.language;
      });
    },

    load() {

        var _this = this;
        this.data.forEach(function(item){
            if(item.language == _this.language){
              _this.sms = item;
            }
        })
        _this = null;
    },

    save(){

      if(this.sms.message.trim().length == 0){
        this.$notification["error"]({
            message: this.$t("messages.warning"),
            description: this.$t("messages.fields"),
            placement: "bottomRight "
        });
        return false;
      }

      this.$axios.put("/notification/template/"+this.$route.params.id+'/sms',this.sms).then(response => {
          this.$notification['success']({
              message:      this.$t('messages.success'),
              description:  this.$t('messages.action_ok'),
              placement : 'bottomRight '
          });
      })
    }
  }
};
</script>