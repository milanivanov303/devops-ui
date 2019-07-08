<template>
  <div class="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || "default") + "-layout";
    }
  }
};
</script>

<style lang="scss">
@import "./assets/scss/styles.scss";
</style>
