<template>
  <div class="modal modal-fixed-footer">
    <div class="modal-content">
      <div class="row">
        <div class="col s12 l11 offset-l1">
          <h4 class="left">
            <slot name="header"></slot>
          </h4>
          <a href="#!" class="modal-close waves-effect waves-green btn-flat right">
            <i class="material-icons">close</i>
          </a>
        </div>
      </div >
      <slot name="content"></slot>
    </div>
    <div class="modal-footer">
      <slot name="footer"></slot>
      <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>
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
};
</script>
