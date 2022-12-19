<template>
  <div class="container-fluid">
    <div class="air__utils__heading">
      <h5 class="float-left">{{ $t('pages.groups.permissions.title', {'name': baseTitle })}}</h5>
      <div class="d-flex">
        <nuxt-link to="/users/groups">
          <a-button type="primary">
            <i class="fe fe-arrow-left"></i>
            {{ $t('btn.back') }}
          </a-button>
        </nuxt-link>
      </div>
    </div>

    <a-card :loading="loading">
        <div class="accordion">
            <div class="card" v-for="(permission, index) in permissions" :key="index">
                <div class="card-header">
                    <div class="checkbox">
                        {{ permission.name }}<br>
                        <a-button type="text" class="collapse-btn" v-on:click="collapseActive($event)">{{$t('pages.groups.permissions.detail')}} ({{permission.children.length}}) <i class="fe fe-chevron-down"></i> </a-button>
                    </div>
                    <div class="switch green">
                        <span>{{$t('pages.groups.permissions.read')}}</span>
                        <a-switch @change="updateStatus(permission, 'get')" :checked="checkStatus(permission, 'get')"/>
                    </div>
                    <div class="switch green">
                        <span>{{$t('pages.groups.permissions.create')}}</span>
                        <a-switch @change="updateStatus(permission, 'post')" :checked="checkStatus(permission, 'post')"/>
                    </div>
                    <div class="switch green">
                        <span>{{$t('pages.groups.permissions.update')}}</span>
                        <a-switch @change="updateStatus(permission, 'put')" :checked="checkStatus(permission, 'put')"/>
                    </div>
                    <div class="switch green">
                        <span>{{$t('pages.groups.permissions.delete')}}</span>
                        <a-switch @change="updateStatus(permission, 'delete')" :checked="checkStatus(permission, 'delete')"/>
                    </div>
                </div>
                <div class="card-content">

                    <div class="row" v-for="(children, cIndex) in permission.children" :key="cIndex">
                        <div class="item">
                            {{children.name}} ({{children.path}})
                        </div>
                        <div class="item">
                            <a-checkbox @change="onChangeStatus(children, 'get')" v-model="children.get.active" :disabled="!children.get.available"></a-checkbox>
                        </div>
                        <div class="item">
                            <a-checkbox @change="onChangeStatus(children, 'post')" v-model="children.post.active" :disabled="!children.post.available"></a-checkbox>
                        </div>
                        <div class="item">
                            <a-checkbox @change="onChangeStatus(children, 'put')" v-model="children.put.active" :disabled="!children.put.available"></a-checkbox>
                        </div>
                        <div class="item">
                            <a-checkbox @change="onChangeStatus(children, 'delete')" v-model="children.delete.active" :disabled="!children.delete.available"></a-checkbox>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </a-card>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                loading: true,
                permissions: [],
                accordion: {
                    show1: false,
                }
            }
        },
        mounted(){
          this.fetchData();
        },
        methods: {
            fetchData(){
              this.$axios.get(`/sys/user/group/${this.$route.params.id}/permissiontree`).then(res => {
                this.permissions = res.data.data;
                this.loading = false
              })
            },
            updatePermission(active, method, route){
              this.$axios.put(`/sys/user/group/${this.$route.params.id}/updatepermission`, {route, method, active}).then(response => {
                //this.onResponse(response);
              }).catch(error => {
                this.onFailure(error.response);
              });
            },
            onResponse(response) {
              let result = response.data.data;
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
              this.$notification["error"]({
                message: this.$t("messages.warning"),
                description: response.data.message,
                placement: "bottomRight "
              });
            },
            onChangeStatus(children, method){
              this.updatePermission(children[method].active, method, children.path);
            },
            updateStatus(permission, type){
              let status = !this.checkStatus(permission, type);
              if(permission){
                permission.children.forEach(perm => {
                  if(perm[type].available == true){
                    perm[type].active = status;
                    this.updatePermission(perm[type].active, type, perm.path);
                  }
                });
              }
            },
            checkStatus(permission, type){
              let status = true;
              if(permission){
                permission.children.forEach(perm => {
                  if(perm[type].active == false && perm[type].available == true) status = false;
                });
              }
              return status;
            },
            collapseActive: function(e){

                const btn = e.target;
                const cardContent = btn.parentElement.parentElement.nextElementSibling;

                if (cardContent.style.display === "block") {
                    cardContent.style.display = "none";
                } else {
                    cardContent.style.display = "block";
                }
            }
        }
    }
</script>


<style lang="scss">
    .accordion {
        .card {
            border: none;
            .card-header {
            background-color:#f7f9fa;
            display: flex;
            justify-content: space-between;
            color:#000;
            padding: 15px 0;
            >div {
                padding: 0;
                width: 15%;
                flex-basis: 15%;
                text-align: center;
                &.checkbox {
                    text-align: left;
                    width: 40%;
                    flex-basis: 40%;
                    padding-left: 15px;
                    > button {
                        margin-left: 25px;
                        font-size: 14px;
                        color: #2f88f4;
                        font-weight: 600;
                        background-color: transparent;
                        border: none;
                        padding: 0;
                        &:hover,
                        &:focus {
                            box-shadow: none;
                            outline: 0
                        }
                    }
                    .ant-checkbox-wrapper {
                        span {
                            color: #000;
                            font-size: 16px;
                            font-weight: 500
                        }
                    }
                }
                &.switch {
                    >span {
                        display: block;
                        margin-bottom: 5px;
                        text-align: center
                    }
                    &.green .ant-switch-checked {
                        background-color:#58cc7e;
                    }
                    &.yellow .ant-switch-checked {
                        background-color:#fad027;
                        &:after {
                            left: 75%;
                        }
                    }
                }
            }
            .ant-checkbox-wrapper {
                display: block;

            }

        }
        .card-content {
            display: none;
            .row {
                display: flex;
                margin: 0;
                .item {
                    width: 15%;
                    flex-basis: 15%;
                    text-align: center;
                    padding: 15px;
                    border-bottom: 1px solid #eee;
                    border-right: 1px solid #eee;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    &:first-child {
                        width: 40%;
                        flex-basis: 40%;
                        text-align: left;
                        justify-content: flex-start;
                        border-left: 1px solid #eee;
                    }
                }
            }
        }
        }
    }
</style>
