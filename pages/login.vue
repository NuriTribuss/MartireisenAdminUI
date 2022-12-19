<template>
    <div>
    <a-row class="row">
        <a-col class="login-right col-12 col-md-4" >
        <login></login>
      </a-col>
      <a-col class="login-left d-none d-md-flex col-8" >
          <div class="content">
            <hr class="w-25"/>
          </div>
      </a-col>
      
    </a-row>
    </div>
</template>

<script>
import Login from '~/components/auth/Login.vue'

export default {
  
  layout : 'login',
  components: {
    Login
  }
}
</script>

<style>

.login-left {
    background-image : url("~assets/img/login-right.jpg");
    height: 100vh;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    display: -webkit-box;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
}

.login-left:after {
  
    content: "";
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    width: 100%;
}
.login-left .content {
    position: relative;
    z-index: 5;
}
.login-left .content {
    font-size: 1.25rem;
    font-weight: 300;
}

.login-left h2 {
    font-size: 4.5rem;
}
.login-left h2 span {
    font-weight: 600 !important;
}

.login-left img {
    width: 250px;
    height: auto;
}

.login-left hr {
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid #d9e2ef;
    margin: 90px 0 1em;
    padding: 0;
}
.login-right {
    height: 100vh;
    background-color: #fff;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
}

</style>
