<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5 class="float-left">{{ $t('menu.notification')}}</h5>
      <nuxt-link to="/sys/settings">
        <a-button type="primary">
          <i class="fe fe-arrow-left"></i> Geri
        </a-button>
      </nuxt-link>
    </div>
    <div class="row">
      <div class="col-12 d-flex flex-wrap mb-5">
        <div class="card w-100 mr-4 rounded-0" v-bind:key="index" v-for="(group,index) in data">
          <div class="card-header pt-3 pb-3">
            <div class="text-dark font-weight-bold">{{group.name}}</div>
          </div>
          <div class="card-body">
            <ul class="list-group list-group-flush">
              <li
                class="list-group-item d-flex justify-content-between align-items-center"
                v-bind:key="subindex"
                v-for="(template,subindex) in group.templates"
              >
                <div>
                  <span><i class="fe fe-chevron-right" style="position:relative;top:2px"></i> {{ template.name}}</span>
                </div>
                <div>
                  <nuxt-link
                    tag="button"
                    :to="'/sys/notification/template/'+template.id+'/mail'"
                    class="ant-btn ant-btn-primary ant-btn-md min-w-30px mr-2"
                  >
                    <i class="fe fe-mail text-sm text-white"></i>
                  </nuxt-link>
                  <nuxt-link
                    tag="button"
                    :to="'/sys/notification/template/'+template.id+'/sms'"
                    class="ant-btn ant-btn-primary ant-btn-md min-w-30px mr-2"
                  >
                    <i class="fe fe-message-square text-sm text-white"></i>
                  </nuxt-link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: []
    };
  },
  mounted() {
    this.fetch();
  },

  methods: {
    fetch(params = {}) {
      this.loading = true;
      this.$axios.get("/notification/template").then(response => {
        this.data = response.data.data;
      });
    }
  }
};
</script>