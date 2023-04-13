<template>
  <a-skeleton :loading="loading" :title="false">
    <a-card>
      <a-form class="form-vertical" layout="vertical">
        <a-divider class="mb-3" orientation="left">{{$t('pages.tour_property.title')}}</a-divider>
        <div class="clearfix">
          <a-button-group class="float-right">
            <a-button v-on:click="insert({id :0})">
              <i class="la la-plus"></i>
            </a-button>
            <a-button v-on:click="refresh">
              <i class="la la-refresh-ccw"></i>
            </a-button>
          </a-button-group>
        </div>
        <a-table :dataSource="data" class="mt-2" :pagination="false">
          <a-table-column :title="$t('pages.tour_plan.cols.name')" data-index="translate.name" key="title"></a-table-column>
          <a-table-column
            :title="$t('pages.tour_property.active')"
            data-index="is_active"
            key="is_active"
            width="150px"
          >
            <template slot-scope="is_active">
              <span v-if="is_active == 1" class="badge badge-success">AKTİF</span>
              <span v-if="is_active == 0"></span>
            </template>
          </a-table-column>
          <a-table-column
            :title="$t('pages.tour_property.price_include')"
            data-index="is_free"
            key="is_free"
            width="150px"
          >
            <template slot-scope="is_free">
              <span v-if="is_free == 1" class="badge badge-success">DAHİL</span>
              <span v-if="is_free == 0"></span>
            </template>
          </a-table-column>
          <a-table-column :title="$t('pages.tour_property.price')" data-index="price" key="price"></a-table-column>
          <a-table-column :title="$t('btn.action')" key="action" width="160px">
            <template slot-scope="record"> 
            <a-button class="mr-1" size="small" type="primary" v-on:click="fetchField(record)">
                <i class="la la-edit text-white"></i>
              </a-button>
              <a-button class="mr-1" size="small" type="primary" v-on:click="fetchRecord(record)">
                <i class="la la-globe text-white"></i>
              </a-button>
            </template>
          </a-table-column>
        </a-table>
      </a-form>
      <a-drawer
        title="ikram / Hizmet Detayı"
        placement="right"
        :closable="true"
        @close="onClose"
        :visible="detailVisible"
        width="600"
      >
        <ValidationObserver ref="observer" v-slot="{ passes }">
          <a-form>
              <a-form-item
                :label-col="{ span: 9 }"
                :wrapper-col="{ span: 15 }"
                label ="Aktiflik"
              >
                <select class="ant-input" v-model="editForm.is_active">
                  <option :value="1">Aktif</option>
                  <option :value="0">Pasif</option>
                </select>
              </a-form-item>
                 <a-form-item
                :label-col="{ span: 9 }"
                :wrapper-col="{ span: 15 }"
                label ="Ücretsiz mi ? (Tur fiyatına dahil mi)"
              >
                <select class="ant-input" v-model="editForm.is_free">
                  <option :value="1">Evet</option>
                  <option :value="0">Hayır</option>
                </select>
              </a-form-item>
              <a-form-item
                :label-col="{ span: 9 }"
                :wrapper-col="{ span: 15 }"
                label ="Ücret"
              >
                <input class="ant-input" v-model="editForm.price" />
              </a-form-item>
          </a-form>
          <div class="drawer-bottom">
            <a-button class="mr-2" @click="onClose">{{$t('btn.cancel')}}</a-button>
            <a-button :loading="loading" class="w-50" @click="passes(onSubmit)" type="primary">
              <i class="la la-save mr-2"></i>
              {{$t('btn.save')}}
            </a-button>
          </div>
        </ValidationObserver>
      </a-drawer>
      <a-drawer
        title="Yeni İkram / Hizmet Ekle"
        placement="right"
        :closable="true"
        @close="onClose"
        :visible="visible"
        width="600"
      >
        <ValidationObserver ref="observer" v-slot="{ passes }">
           <a-select
            v-if="visibleLanguages"
            v-model="language"
            @change="loadData"
            class="mr-2 w-100"
          >
            <a-select-option
              :value="item.code"
              v-bind:key="index"
              v-for="(item,index) in languages.data"
            >
              <i class="flag-icon" :class="'flag-icon-'+item.code"></i>
              {{item.name}}
            </a-select-option>
          </a-select>
          <a-form>
            <a-divider>{{ $t('pages.information') }}</a-divider>
            <ValidationProvider name="name" rules="required" v-slot="slotProps">
              <a-form-item
                :label-col="{ span: 9 }"
                :wrapper-col="{ span: 15 }"
                :label="$t('pages.tour_plan.cols.name')"
                :validateStatus="resolveState(slotProps)"
                :help="slotProps.errors[0]"
              >
                <input class="ant-input" v-model="form.name" />
              </a-form-item>
            </ValidationProvider>
          </a-form>
          <div class="drawer-bottom">
            <a-button class="mr-2" @click="onClose">{{$t('btn.cancel')}}</a-button>
            <a-button :loading="loading" class="w-50" @click="passes(onSubmit)" type="primary">
              <i class="la la-save mr-2"></i>
              {{$t('btn.save')}}
            </a-button>
          </div>
        </ValidationObserver>
      </a-drawer>
    </a-card>
  </a-skeleton>
</template>

<script>
export default {
  props: ["tour_id", "languages"],
  name: "PropertyManager",

  data() {
    return {
      fieldData: {},
      data: [],
      loading: true,
      visible: false,
      detailVisible : false,
      language: "",
      default_language: "",
      visibleLanguages: true,

      form: {
        name: ""
      },
      editForm : {
        a:false,
        price : 0,
        is_active : 0 ,
        is_free : 0,
      },
      title: ""
    };
  },
  computed: {
    isTranslate() {
      return this.language != this.default_language;
    },
    languages() {
      return this.$store.state.localization.languages.table;
    }
  },
  methods: {
    fetch() {
      this.loading = true;
      this.$axios
        .get("/booking/tour/tour/" + this.tour_id + "/property")
        .then(r => {
          this.loading = false;
          this.data = r.data.data;
        });
    },

    fetchField(record) {

      this.detailVisible = true;
      this.editForm.a = true;
      this.editForm.id = record.id;
      this.editForm.is_free = record.is_free;
      this.editForm.is_active = record.is_active;
      this.editForm.price = record.price;
    },

    fetchRecord(record) {
      this.language = "";
      this.resetData();

      this.visible = true;
      this.visibleLanguages = true;

      return this.$axios
        .get("/booking/tour/tour/" + this.tour_id + "/property/" + record.id)
        .then(response => {
          this.fieldData = response.data.data;
          this.form.id = this.fieldData.id;
          this.setLanguageData();
          this.default_language = this.language;
        });
    },

    refresh() {
      this.fetch();
    },

    onClose() {
      this.visible = false;
      this.detailVisible = false;
    },

    resolveState({ errors, pending, valid }) {
      if (errors[0]) {
        return "error";
      }
      return "";
    },

    resetData() {
      this.form = {
        name: ""
      };
      this.editForm.a = false;
    },

    insert(record) {
      this.visible = true;
      this.visibleLanguages = false;

      this.resetData();
      this.title = this.$t("btn.add");
    },

    setLanguageData() {
      var translate = this.resolveTranslate(this.fieldData);
      this.language = translate.language;
      this.form.name = translate.name;
      this.form.language = translate.language;
    },

    loadData() {
      this.setLanguageData();
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


    deleteRecord(id) {
      this.$axios
        .delete("/booking/tour/tour/" + this.tour_id + "/property/" + id)
        .then(response => {
          if (response.data.status) {
            this.$message.success(this.$t("messages.delete_ok"));
            this.fetch();
          } else {
            this.$message.error(response.data.message);
          }
        })
        .catch(error => {});
    },

    onSubmit() {
      this.loading = true;

      
      
      if (this.editForm.a) {
        this.$axios
          .put(
            "/booking/tour/tour/" + this.tour_id + "/property/",
            this.editForm
          )
          .then(response => {
            this.onResponse(response);
          })
          .catch(error => {
            this.onFailure(error.response);
          });
      } else if(this.form.id > 0){
         this.$axios
          .put(
            "/booking/tour/tour/" + this.tour_id + "/property/"+this.form.id+'/translate',
            this.form
          )
          .then(response => {
            this.onResponse(response);
          })
          .catch(error => {
            this.onFailure(error.response);
          });
      }else {  
        this.$axios
          .post("/booking/tour/tour/" + this.tour_id + "/property", this.form)
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
        this.visible = false;
      }
      this.onClose();
      this.loading = false;
      this.fetch();
    },

    onFailure(response) {
      this.$notification["error"]({
        message: this.$t("messages.warning"),
        description: response.data.message,
        placement: "bottomRight "
      });
      this.loading = false;
    }
  },

  mounted() {
    this.fetch();
  }
};
</script>
