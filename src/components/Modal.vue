<template>
  <div class="modal modal-fixed-footer">
    <div class="modal-header">
      <slot name="header"></slot>
      <a class="modal-close waves-effect waves-green btn-flat right">
        <i class="material-icons">close</i>
      </a>
    </div>
    <div class="modal-content">
      <slot name="content"></slot>
    </div>
    <div class="modal-footer">
      <slot name="footer"></slot>
      <a class="modal-close waves-effect waves-green btn-flat">Close</a>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$M.Modal
      .init(this.$el, {
        dismissible: false,
        preventScrolling: true,
        onOpenStart: () => this.$emit('open'),
        onOpenEnd: () => this.$emit('opened'),
        onCloseStart: () => this.$emit('close'),
        onCloseEnd: () => this.$emit('closed'),

      })
      .open();
  },
  destroyed() {
    this.$M.Modal.getInstance(this.$el).close();
  },
};
</script>

<style lang="scss" scoped>
.modal.modal-fixed-footer {
  .modal-header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    position: absolute;
    top: 0;
    height: 56px;
    width: 100%;
    padding: 10px;
    font-size: 1.6rem;
  }
  .modal-content {
    height: calc(100% - 112px);
    margin-top: 56px;
  }
}
</style>
