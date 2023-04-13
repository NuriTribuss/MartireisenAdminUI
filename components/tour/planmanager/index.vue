<template>
  <a-skeleton :loading="loading" :title="false">
    <a-card>
      <a-form class="form-vertical" layout="vertical">
        <a-divider class="mb-3" orientation="left">{{$t('pages.tour_plan.title')}}</a-divider>
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
        <a-table :dataSource="data" class="mt-2">
          <a-table-column :title="$t('pages.tour_plan.cols.name')" data-index="translate.name" key="title"></a-table-column>
          <a-table-column
            :title="$t('pages.pages.cols.sort_number')"
            data-index="sort_number"
            key="sort_number"
            width="150px"
          >
            <template slot-scope="sort_number">{{ sort_number }}</template>
          </a-table-column>

          <a-table-column :title="$t('btn.action')" key="action" width="160px">
            <template slot-scope="text, record">
              <a-button class="mr-1" size="small" type="primary" v-on:click="fetchField(record)">
                <i class="la la-edit text-white"></i>
              </a-button>

              <a-popconfirm :title="$t('messages.sure_delete')" @confirm="deleteRecord(record.id)">
                <a-button class="mr-2" size="small" type="danger">
                  <a-icon type="delete" />
                </a-button>
              </a-popconfirm>
            </template>
          </a-table-column>
        </a-table>
      </a-form>

      <a-drawer
        :title="title"
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

            <a-form-item
              :label-col="{ span: 9 }"
              :wrapper-col="{ span: 15 }"
              :label="$t('pages.tour_plan.cols.content')"
            >
              <a-textarea style="height:150px" v-model="form.content" row="6" />
            </a-form-item>

            <a-form-item
              v-if="!isTranslate"
              :label-col="{ span: 9 }"
              :wrapper-col="{ span: 15 }"
              :label="$t('pages.pages.cols.sort_number')"
            >
              <a-input-number :min="1" v-model="form.sort_number" />
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
    </a-card>
  </a-skeleton>
</template>

<script>
export default {
  props: ["tour_id", "languages"],
  name: "PlanManager",

  data() {
    return {
      fieldData: {},
      data: [],
      loading: true,
      visible: false,
      visibleLanguages: true,
      language: "",
      default_language: "",
      form: {
        name: "",
        content: "",
        sort_number: 1
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
        .get("/booking/tour/tour/" + this.tour_id + "/plan")
        .then(r => {
          this.loading = false;
          this.data = r.data.data;
        });
    },

    fetchField(record) {
      this.language = "";
      this.resetData();

      this.visible = true;
      this.visibleLanguages = true;

      return this.$axios
        .get("/booking/tour/tour/" + this.tour_id + "/plan/" + record.id)
        .then(response => {
          this.fieldData = response.data.data;
          this.form.id = this.fieldData.id;
          this.form.sort_number = this.fieldData.sort_number;
          this.setLanguageData();
          this.default_language = this.language;
        });
    },

    setLanguageData() {
      var translate = this.resolveTranslate(this.fieldData);
      this.language = translate.language;
      this.form.name = translate.name;
      this.form.content = translate.content;
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

    refresh() {
      this.fetch();
    },

    onClose() {
      this.visible = false;
    },

    resolveState({ errors, pending, valid }) {
      if (errors[0]) {
        return "error";
      }
      return "";
    },

    resetData() {
      this.form = {
        title: "",
        content: "",
        sort_number: 1
      };
    },

    insert(record) {
      this.visible = true;
      this.visibleLanguages = false;

      this.resetData();
      this.title = this.$t("btn.add");
    },

    deleteRecord(id) {
      this.$axios
        .delete("/booking/tour/tour/" + this.tour_id + "/plan/" + id)
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

      if (this.form.id) {
        let extra = this.language != this.default_language ? "/translate" : "";

        this.$axios
          .put(
            "/booking/tour/tour/" +
              this.tour_id +
              "/plan/" +
              this.form.id +
              extra,
            this.form
          )
          .then(response => {
            this.onResponse(response);
          })
          .catch(error => {
            this.onFailure(error.response);
          });
      } else {
        this.$axios
          .post("/booking/tour/tour/" + this.tour_id + "/plan", this.form)
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
