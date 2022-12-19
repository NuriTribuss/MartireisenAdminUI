<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5>{{ $t('pages.languages.language_parameters')}}</h5>
      <nuxt-link to="/localization/languages">
        <a-button type="primary">
          <i class="fe fe-arrow-left"></i> {{$t('btn.back')}}
        </a-button>
      </nuxt-link>
    </div>

    <a-card class="no-padding">
      <div class="ant-card-head">
        <div class="ant-card-head-wrapper">
          <div class="ant-card-head-title">{{language.name}} Parametreleri</div>
          <div>
            <a-dropdown :trigger="['click']">
              <a class="ant-dropdown-link" href="#">
                <i class="flag-icon" :class="'flag-icon-'+language.code"></i>
                {{language.name}}
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item v-bind:key="index" v-for="(language,index) in table.data">
                  <nuxt-link :to="'/localization/languages/'+language.id+'/translate'">
                    <i class="flag-icon" :class="'flag-icon-'+language.code"></i>
                    {{language.name}}
                  </nuxt-link>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </div>
      </div>
      <a-form class="pd-20">
        <div class="d-flex justify-content-between">
          <div class="language-search">
            <a-form layout="inline">
              <a-form-item>
                <a-input-search v-model="search_term" :placeholder="$t('pages.languages.search_term')" />
              </a-form-item>
            </a-form>
          </div>
          <a-form-item class="text-right">
            <a-button type="primary" @click="save">
              <i class="fe fe-save mr-2"></i>
              {{ $t('btn.save')}}
            </a-button>
          </a-form-item>
        </div>
        <div v-bind:key="index" v-for="(item,index) in items">
          <h6>
            <strong>{{item.key}} :</strong>
          </h6>
          <a-divider></a-divider>
          <a-form-item
            v-bind:key="subindex"
            v-if="subitem.value.toLowerCase().includes(search_term.toLowerCase())"
            v-for="(subitem,subindex) in item.data"
            :label="subitem.key"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 21 }"
            class="text-left"
          >
            <input class="ant-input"  :value="subitem.value"  @input="updateItem($event.target.value,index,subindex)"/>
          </a-form-item>
        </div>
        <a-form-item class="text-right">
          <a-button type="primary" @click="save">
            <i class="fe fe-save mr-2"></i>
            {{ $t('btn.save')}}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>


<script>
export default {
  data() {
    return {
      language: {
        name: "",
        code: ""
      },
      search_term : ''
    };
  },
  mounted() {
    this.$store.dispatch("localization/languages/get", { page: 1 }).then(() => {
      for (let step = 0; step < this.table.data.length; step++) {
        if (this.table.data[step].id == this.$route.params.id) {
          this.language = this.table.data[step];
        }
      }
    });

    this.$store.dispatch("localization/languages/getTranslate", {
      language: this.$route.params.id
    }).then((r) => {
      console.log(r)
    });
  },
  computed: {
    table() {
      return this.$store.state.localization.languages.table;
    },
    translate:  {
      get() {
         return this.$store.state.localization.languages.translate;
      }
    },
    items(){
      return this.translate.data.filter((subTranslate) => {
        return subTranslate.data.some((item) => {
          return item.value.toLowerCase().includes(this.search_term.toLowerCase())
        });
      });
    },
  },
  methods : {
    save(){
      this.$store.dispatch("localization/languages/updateTranslate", {
          language  : this.language.id,
          translate : this.translate.data
      }).then(() => {
          this.$notification["success"]({
            message: this.$t("messages.success"),
            description: this.$t("messages.action_ok"),
            placement: "bottomRight "
          });
      });
    },
    updateItem(value,index,subindex){
      this.$store.commit("localization/languages/setItem",{index,subindex,value});
    }
  }
};
</script>
