<template>
  <a-dropdown :trigger="['click']" placement="bottomLeft">
    <div :class="$style.dropdown">
      <a-badge >
        <a-avatar shape="square" icon="user" size="large" :class="$style.avatar" />
      </a-badge>
    </div>
    <a-menu slot="overlay">
      <a-menu-item>
        <strong>Hello, {{this.$auth.user.username}}</strong>

        <div>
          <strong>Role:</strong>
          {{this.$auth.user.group}}
        </div>
      </a-menu-item>

      <a-menu-divider />
      <a-menu-item>
        <router-link to="/profile">
          <i :class="$style.menuIcon" class="la la-user"></i> Edit Profile
        </router-link>
      </a-menu-item>
      <a-menu-item>
        <a href="javascript: void(0);" @click="logout">
          <i :class="$style.menuIcon" class="la la-log-out"></i> {{$t('auth.logout')}}
        </a>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: function () {
    return {
      count: 7,
    }
  },
  computed: {
    ...mapState(['settings', 'user']),
  },
  methods: {
    addCount() {
      this.count++
    },
    logout() {
      this.$auth.logout().then(() => this.$router.push({
          path: '/login'
      }) 
  )
    },
  },
}
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
