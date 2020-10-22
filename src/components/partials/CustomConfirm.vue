<template>
  <div @submit.prevent="onSubmit" id="action" ref="custom-confirm" class="modal">
    <div class="frame">
      <div class="modal-content">
        <form>
          <div class="row">
            <p v-for="(value, key) in message"
               v-bind:key="key">{{value}}</p>
          </div>
          <div class="row">
            <div class="input-field col s12 m6 l6">
              <button class="btn waves-effect waves-light right"
                      type="submit"
                      name="action">
                      Ok</button>
            </div>
            <div class="input-field col s12 m6 l6">
              <a href="#!"
                @click="cancel"
                class="modal-close waves-effect waves-blue btn-flat left">Close</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .modal {
    max-height: 35%;
    width: 40%;
  }
  p {
    text-align: center;
  }
</style>
<script>
export default {
  props: {
    message: {
      type: Array,
      required: true,
    },
  },
  methods: {
    cancel() {
      this.$emit('selectedVal', false);
      this.$M.Modal.init(this.$refs['custom-confirm']).close();
    },
    onSubmit() {
      this.$emit('selectedVal', true);
      this.$M.Modal.init(this.$refs['custom-confirm']).close();
    },
    openModal() {
      this.$M.Modal.init(this.$refs['custom-confirm'], {
        dismissible: false,
        preventScrolling: false,
      }).open();
    },
  },
};
</script>
