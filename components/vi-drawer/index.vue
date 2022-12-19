<template>
  <a-drawer
    :title="title"
    :width="width"
    @close="onClose"
    :visible="visible"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >
    <slot></slot>
    <div
      :style="{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
      }"
    >
      <a-button :style="{marginRight: '8px'}" @click="onClose" :disabled="saving">
        {{ cancelBtnLabel }}
      </a-button>
      <a-button @click="onSubmit" type="primary" :loading="saving">
        {{ submitBtnLabel }}
      </a-button>
    </div>
  </a-drawer>
</template>

<script>
export default {
  props: {
    cancelBtnLabel: {
      type: String,
      default() {
        return this.$t('btn.cancel')
      },
    },
    submitBtnLabel: {
      type: String,
      default() {
        return this.$t('btn.save')
      },
    },
    saving: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Submit',
    },
    width: {
      type: [String, Number],
      default: 380,
    },
  },
  methods: {
    onClose() {
      this.$emit('close')
    },
    onSubmit() {
      this.$emit('submit')
    },
  },
}
</script>
