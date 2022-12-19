<template>
  <div>
    <a-row>
      <div class="pl-5 pr-5 pt-5 pb-5  container">
        <div class="logo" style="height:120px">
          <img src="~assets/img/logo-black.png"/>
        </div>
        <div class="header-title">
          <h2>{{ $t('auth.login') }}</h2>
          <div>
            <span>{{ $t('auth.login_description') }}</span>
          </div>
        </div>
        <a-form :form="form" @submit="handleSubmit">
          <a-form-item  >
            <a-input size="large"  :placeholder="$t('auth.email')"
              v-decorator="['email', { rules: [{ required: true, message: $t('messages.email_err') }] }]"
            >
              <a-icon slot="suffix" type="user" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input-password  size="large" :placeholder="$t('auth.password')"
              v-decorator="['password', { rules: [{ required: true, message: $t('messages.password_err') }] }]"
             />
          </a-form-item>
          <a-form-item  class="float-right mt-2">
            <a-button class="text-center btn btn-success btn-lg btn-rounded float-right pl-5 pr-5 h-auto  btn btn-success" shape="round" html-type="submit"> {{ $t('auth.login')}}</a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-row>
  </div>
</template>

<style>
.container {
    max-width: 38rem;
    width: 100%;
}
.logo {
  max-width: 315px;
  margin-top: 17%;
  margin-left: auto;
  margin-right: auto;
}
.header-title {
  margin-top: 60px;
  margin-bottom: 60px;
}
.header-title h2 {
  font-weight: 600;
  font-size: 35px;
}
</style>

<script>
export default {
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
            this.$auth.loginWith('local',{
                data : {
                    username : values.email,
                    password : values.password
                }
            }).then((r) => {
              console.log(r)
            }).catch((r) => {
               this.$notification['error']({
                  message:  this.$t('messages.warning'),
                  description:  this.$t('auth.login_error'),
                  placement : 'bottomRight '
                });
            })
        }
      });
    },
    
  },
};
</script>