<template>
  <div>
    <div class="air__utils__heading">
      <h5>ID : #{{ticket.code}}</h5>
      <nuxt-link to="/tickets">
        <a-button type="primary">
          <i class="fe fe-arrow-left"></i> Geri
        </a-button>
      </nuxt-link>
    </div>
    <div class="row" v-if="ticket.id">
      <div class="col-12 col-md-3">
        <div class="card">
          <div class="card-body">
            <a-skeleton :loading="ticketLoading">
              <a href="#" class="mt-2 mb-3 d-flex flex-nowrap align-items-center index_item_bF_Bi">
                <div class="a mr-3 flex-shrink-0">
                  <a-avatar shape="square" size="large" icon="user" />
                </div>
                <div class="flex-grow-1 index_info_1s5ZY">
                  <div
                    class="text-dark font-size-18 font-weight-bold text-truncate"
                  >{{ticket.company_name}}
                 
                  </div>
                  <i class="fe fe-mail mr-2"></i>{{company.email}} 
                </div>
                <!---->
              </a>

              <div class="py-2 border-bottom">
                <div class="font-weight-bold mb-2">Domain</div>
                <div>{{ticket.domain}}</div>
              </div>
              <div class="py-2 border-bottom">
                <div class="font-weight-bold mb-2">Proje / Ürün</div>
                <div>{{ticket.product_name}}</div>
              </div>
              <div class="table-responsive mt-2">
                <table class="table table-borderless">
                  <tbody>
                    <tr>
                      <td class="text-gray-6 pl-0">Önem Düzeyi</td>
                      <td class="pr-0 text-right">
                        <span
                          class="badge mr-2 w-50"
                          :class="['badge-' + ticket.level.class]"
                        >{{ticket.level.name}}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="text-gray-6 pl-0">Durum</td>
                      <td class="pr-0 text-right">
                        <span
                          class="badge w-50 mr-2"
                          :class="['badge-' + ticket.status.class]"
                        >{{ticket.status.name}}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </a-skeleton>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-9">
        <div class="card">
          <a-skeleton :loading="messageLoading">
            <div class="card-header card-header-flex align-items-center">
              <div class="d-flex flex-column justify-content-center mr-auto">
                <h5 class="mb-0 mr-2 font-size-18">{{ticket.subject}}</h5>
              </div>
              <div>
                <a-tooltip placement="top" v-if="ticket.status.id != 2">
                  <template slot="title">
                    <span>Talebi Kapat</span>
                  </template>
                  <a-popconfirm
                    title="Talep Kapatılacaktır.Onaylıyor musunuz ? "
                    ok-text="Evet"
                    cancel-text="Hayır"
                    @confirm="closeMessage"
                  >
                    <a href="javascript: void(0);" class="btn btn-sm btn-light mr-2">
                      <i class="fe fe-unlock" />
                    </a>
                  </a-popconfirm>
                </a-tooltip>
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>Mark as important</span>
                  </template>
                </a-tooltip>
              </div>
            </div>
            <div class="card-body">
              <div>
                <vue-custom-scrollbar>
                  <div class="d-flex flex-column justify-content-end height-100p">
                    <div
                      v-for="(message, index) in messages"
                      :key="index"
                      :class="[$style.message, message.user_id !== 0 ? $style.answer : '']"
                    >
                      <div :class="$style.messageContent">
                        <div
                          class="text-gray-4 font-size-12 text-uppercase"
                        >{{ message.user_id !== 0 ? message.user_name : ticket.company_name}}</div>
                        <div>
                          {{message.message}}
                          <br />
                          <small
                            class="mt-2 float-right"
                          >{{$moment(message.created_at).format('DD.MM.YYYY - HH:mm')}}</small>
                        </div>
                      </div>
                      <div class="air__utils__avatar" :class="$style.messageAvatar">
                        <a-avatar shape="square" size="large" icon="user" />
                      </div>
                    </div>
                  </div>
                </vue-custom-scrollbar>
              </div>
              <div class="mb-3 mt-4">
                <hr />
                <textarea
                  type="text"
                  row="5"
                  class="form-control"
                  v-model="message"
                  placeholder="Cevap Gönder"
                />
                <button
                  class="w-25 btn btn-primary rounded-0 mt-3 mb-2 float-right"
                  type="button"
                  @click="createMessage"
                >
                  <i class="mr-2 fe fe-send align-middle" />Gönder
                </button>
              </div>
            </div>
          </a-skeleton>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vueCustomScrollbar from "vue-custom-scrollbar";

export default {
  components: { vueCustomScrollbar },
  data: function() {
    const activeIndex = 0;
    return {
      activeIndex,
      messages: [],
      messageLoading: false,
      ticketLoading: false,
      message: "",
      ticket: {},
      company: {},
      dialogs: [],
      name: "", //dialogs[activeIndex].name,
      position: "", //dialogs[activeIndex].position,
      dialog: "" //dialogs[activeIndex].dialog,
    };
  },
  methods: {
    getMessage() {
      this.messageLoading = true;
      this.$axios
        .get(`/ticket/ticket/${this.$route.params.id}/messages`)
        .then(res => {
          this.visible = true;
          this.messages = res.data.data;
          this.ticket = res.data.parent;
          this.messageLoading = false;
          this.ticketLoading = true;
          this.getCompany(this.ticket.company_id);
        });
    },
    getCompany(id) {
      this.$axios.get(`/company/company/${id}`).then(res => {
        this.visible = true;
        this.company = res.data.data;
        this.ticketLoading = false;
      });
    },
    createMessage() {
      this.$axios
        .post(`/ticket/ticket/${this.$route.params.id}/messages`, {
          message: this.message
        })
        .then(res => {
          this.message = "";
          this.getMessage();
        });
    },
    closeMessage() {
      this.$axios
        .put(`/ticket/ticket/${this.$route.params.id}`, { status: 2 })
        .then(res => {
          this.$notification["success"]({
            message: "Başarılı",
            description: "Talep Kapatılmıştır",
            placement: "bottomRight "
          });
          this.getMessage();
        });
    }
  },
  mounted() {
    this.getMessage();
  }
};
</script>

<style lang="scss" module>
@import "@/assets/styles/mixins.scss";

.dialogs {
  height: 100%;

  @media (max-width: $sm-max-width) {
    max-height: rem(240);
    margin-bottom: rem(15);
  }
}

.item {
  padding: rem(10);
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: rem(15);

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background-color: lighten($gray-1, 2);
  }
}

.current {
  background-color: $gray-1;

  &:hover {
    background-color: $gray-1;
  }
}

.info {
  min-width: 0;
}

.unread {
  min-width: 15px;
}

.message {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: flex-end;
  justify-content: flex-end;
  margin-top: rem(15);
  overflow: hidden;
  flex-shrink: 0;

  &.answer {
    flex-direction: row-reverse;

    .messageAvatar {
      margin-left: 0;
      margin-right: rem(15);
    }

    .messageContent {
      &::before {
        left: auto;
        right: 100%;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-right: 4px solid $gray-1;
        border-left: none;
      }
    }
  }
}

.messageAvatar {
  flex-shrink: 0;
  margin-left: rem(15);
}

.messageContent {
  background-color: $gray-1;
  position: relative;
  border-radius: 5px;
  padding-left: rem(15);
  padding-right: rem(15);
  padding-top: rem(6);
  padding-bottom: rem(6);

  &::before {
    content: "";
    position: absolute;
    left: 100%;
    bottom: 16px;
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 4px solid $gray-1;
    border-right: none;
  }
}
</style>
