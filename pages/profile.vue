<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>
        {{ $t('profile.account')}}
      </h5>
    </div>

    <a-card class="no-padding">
      <a-tabs class="iconic-tab" defaultActiveKey="1">
        <a-tab-pane key="1">
          <span slot="tab">
            <i class="fe fe-edit"></i>
            {{$t('customers.general_info')}}
          </span>
          <a-form class="form-vertical" layout="vertical">
            <a-row :gutter="30">
              <a-col :span="12">
                <a-form-item :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
                  <a-divider orientation="left">
                    <i class="fe fe-user mr-2"></i>
                    {{$t('input.name')}}
                  </a-divider>
                  <a-input v-model="account_form.firstname"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label-col="{ span:24 }" :wrapper-col="{ span: 24 }">
                  <a-divider orientation="left">
                    <i class="fe fe-user mr-2"></i>
                    {{$t('input.surname')}}
                  </a-divider>
                  <a-input v-model="account_form.lastname"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label-col="{ span:24 }" :wrapper-col="{ span: 24 }">
                  <a-divider orientation="left">
                    <i class="fe fe-smartphone mr-2"></i>
                    {{$t('input.phone')}}
                  </a-divider>
                  <a-input v-model="account_form.mobile_phone"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label-col="{ span:24 }" :wrapper-col="{ span: 24 }">
                  <a-divider orientation="left">
                    <i class="fe fe-mail mr-2"></i>
                    {{$t('input.website')}}
                  </a-divider>
                  <a-input v-model="account_form.website"></a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item>
              <a-button @click="onSubmit" class="save-btn mr-2" type="primary">
                <i class="fe fe-save mr-2"></i>
                {{ $t('btn.save')}}
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="2">
          <span slot="tab">
            <i class="fe fe-lock"></i>
            {{$t('pages_title.security')}}
          </span>
          <a-form class="form-vertical" layout="vertical">
            <a-row :gutter="30">
              <a-col :span="24">
                <a-form-item :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
                  <a-divider orientation="left">
                    <i class="fe fe-lock mr-2"></i>
                    {{$t('input.password')}}
                  </a-divider>
                  <a-input-password :placeholder="$t('input.password')" v-model="password_form.password_old"/>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label-col="{ span:24 }" :wrapper-col="{ span: 24 }">
                  <a-divider orientation="left">
                    <i class="fe fe-lock mr-2"></i>
                    {{$t('input.password_new')}}
                  </a-divider>
                  <a-input-password :placeholder="$t('input.password_new')" v-model="password_form.password_new"/>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label-col="{ span:24 }" :wrapper-col="{ span: 24 }">
                  <a-divider orientation="left">
                    <i class="fe fe-lock mr-2"></i>
                    {{$t('input.password_again')}}
                  </a-divider>
                  <a-input-password :placeholder="$t('input.password_again')" v-model="password_form.password_again"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item>
              <a-button @click="onSubmitPassword" class="save-btn mr-2" type="primary">
                <i class="fe fe-save mr-2"></i>
                {{ $t('btn.save')}}
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="3">
          <span slot="tab">
            <i class="fe fe-list"></i>
            {{$t('pages_title.last_activities')}}
          </span>
          <a-table :columns="columns" :dataSource="logs" :pagination="false"/>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        account_form: {},
        password_form: {
          password_old: '',
          password_new: '',
          password_again: ''
        },
        logs: [],
        columns: [
          {
            title: 'Tarih',
            dataIndex: 'created_at',
            key: 'created_at',
            width: '20%'
          },
          {
            title: 'Ip',
            dataIndex: 'ip',
            key: 'ip',
            width: '20%'
          },
          {
            title: 'Agent',
            dataIndex: 'agent',
            key: 'agent',
          },
        ]
      };
    },

    mounted() {
      this.fetch();
      this.$axios.get(`account/logs`).then(res => {
        this.logs = res.data.data
      })
    },
    methods: {

      fetch() {
        return this.$axios
          .get("/account/")
          .then(response => {
            let data = response.data.data;
            this.account_form = {
              firstname: data.firstname,
              lastname: data.lastname,
              website: data.website,
              mobile_phone: data.mobile_phone
            }
          });
      },

      resolveState({errors, pending, valid}) {
        if (errors[0]) {
          return "error";
        }
        return "";
      },

      onSubmit() {

        this.$axios
          .put("/account/", this.account_form)
          .then(response => {
            this.onResponse(response);
          })
          .catch(error => {
            this.onFailure(error.response);
          });
      },

      onSubmitPassword() {

        this.$axios
          .put("/account/password", this.password_form)
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

        this.$notification["success"]({
          message: this.$t("messages.success"),
          description: this.$t("messages.action_ok"),
          placement: "bottomRight "
        });

      },

      onFailure(response) {

        if (typeof response.data.errors != 'undefined') {
          for (var i = 0; i < response.data.errors.length; i++) {
            var error = response.data.errors[i];
            this.$notification["error"]({
              message: this.$t("messages.warning"),
              description: this.$t("messages.required") + '(' + this.$t("input." + error.key) + ')',
              placement: "bottomRight "
            });
          }
        } else {
          this.$notification["error"]({
            message: this.$t("messages.warning"),
            description: response.data.message,
            placement: "bottomRight "
          });
        }
      }
    }
  };
</script>
