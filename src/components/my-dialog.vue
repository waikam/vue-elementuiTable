<template>
  <div>
    <el-dialog
      title="选择资源"
      width="80%"
      :visible.sync="showDialogState"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <slot></slot>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    showDialogState: { type: Boolean, default: false } // 父组件传递用于控制弹框显示隐藏
  }
}
</script>