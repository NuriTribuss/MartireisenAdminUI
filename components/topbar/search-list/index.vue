<template>
  <div>
    <slot v-for="(result, index) in data" v-if="result.results.length > 0">
      <div class="text-uppercase font-size-12 mb-2 text-gray-6">{{$t(result.lang)}} ({{result.results.length}})</div>
      <ul class="list-unstyled">
        <li :class="$style.item" v-for="(page, pIndex) in result.results">
          <nuxt-link :to="result.route.replace('$1', page.uuid)" :class="$style.itemLink">
            <div :class="$style.itemLink" class="mr-3">
              <i :class="$style.itemIcon" class="fe fe-file" />
            </div>
            <div>
              <div class="text-blue">{{ page.name }}</div>
              <div class="text-muted">{{ result.route.replace('$1', page.uuid) }}</div>
            </div>
          </nuxt-link>
        </li>
      </ul>
    </slot>
  </div>
</template>
<script>
export default {
  name: 'SearchInput',
  props: ["data"],
}
</script>
<style lang="scss" module>
@import "./style.module.scss";
</style>
