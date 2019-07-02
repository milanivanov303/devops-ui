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
  },
  mounted() {
    M.AutoInit();
  }
};
</script>

<style lang="scss">
@import "./assets/scss/styles.scss";
</style>
