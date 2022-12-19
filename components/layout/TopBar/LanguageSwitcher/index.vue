<template>
  <a-dropdown :trigger="['click']" placement="bottomRight">
    <div :class="$style.dropdown">
      <span>{{ $i18n.locale.toUpperCase()}}</span>
    </div>
    <a-menu slot="overlay">
      <a-menu-item v-bind:key="index" v-for="(locale,index) in $i18n.availableLocales" v-on:click="$i18n.locale = locale">
        <span class="text-uppercase font-size-12 mr-2">{{locale.toUpperCase()}}</span>
        {{ $t('languages.'+locale) }}
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<style lang="scss" module>
@import "./style.module.scss";
</style>
