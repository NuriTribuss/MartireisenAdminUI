<template>
  <div :class="$style.topbar">
    
    <div class="mr-auto d-none d-md-block">
    </div>
  
  
    <div class="mr-4 d-none d-sm-block">
      <air-language-switcher />
    </div>
    <div class>
      <air-user-menu />
    </div>
  </div>
</template>

<script>
import AirStatus from '@/components/layout/TopBar/Status'
import AirLanguageSwitcher from '@/components/layout/TopBar/LanguageSwitcher'
// import AirActions from '@/components/layout/TopBar/Actions'
import AirUserMenu from '@/components/layout/TopBar/UserMenu'

export default {
  components: {
    AirStatus,
    AirLanguageSwitcher,
    // AirActions,
    AirUserMenu,
  },
}
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
