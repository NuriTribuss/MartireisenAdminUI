<template>
  <a-dropdown :trigger="['click']" placement="bottomLeft">
    <div :class="$style.dropdown">
      <i class="la la-help-circle" :class="$style.icon"></i>
      <span class="d-none d-xl-inline">{{ $t('help.title')}}</span>
    </div>
    <a-menu slot="overlay">
      
      <a-menu-item-group :title="$t('help.developer')">
        <a-menu-item>
          <a href="" target="_blank">{{ $t('help.developer_doc')}}</a>
        </a-menu-item>
        <a-menu-item>
          <a href="" target="_blank">{{ $t('help.api_doc')}}</a>
        </a-menu-item>
      </a-menu-item-group>
      <a-menu-divider />
      
    </a-menu>
  </a-dropdown>
</template>

<style lang="scss" module>
@import "./style.module.scss";
</style>
