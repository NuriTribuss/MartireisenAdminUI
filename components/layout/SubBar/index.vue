<template>
  <div :class="$style.subbar">
    <ul :class="$style.breadcrumbs" class="mr-4">
      <li :class="$style.breadcrumb">
        <a href="#" class="style.breadcrumbLink">Main</a>
      </li>
      <li :class="$style.breadcrumb">
        <a href="#" :class="[$style.breadcrumbLink, $style.breadcrumbLink__current]">Dashboard</a>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" module>
@import "./style.module.scss";
</style>
