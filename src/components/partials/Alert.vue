<template>
  <div class="alert error scale-transition">
    <span class="white-text">
      {{ msg }}
    </span>
    <a href="#" class="alert-close right" @click="close()">
      <i class="material-icons">close</i>
    </a>
  </div>
</template>

<script>
export default {
  props: [
    'msg'
  ],
  methods: {
    close() {
      this.$el.classList.add('hide');
    }
  },
};
</script>
