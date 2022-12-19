<template>
  <div>
    <div class="card-header">{{$t('pages.home.process-title')}}</div>
    <div class="card-body p-2">
      <div class="air__l8">
        <a-skeleton :loading="true" :title="false"></a-skeleton>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ProcessList"
};
</script>

