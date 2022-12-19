<template>
  <div
    :class="{
      [$style.footer]: true,
      [$style.footerFullWidth]: settings.isContentNoMaxWidth
    }"
  >
    <div :class="$style.inner">
      <div class="row">
        <div class="col-md-8">
          <p>{{$t('general.copyright')}}</p>
        </div>
        </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState(['settings']),
}
</script>

<style>
.ant-layout-footer > div {
  max-width : 100rem !important;
}
</style>
<style lang="scss" module>
@import "./style.module.scss";
</style>
