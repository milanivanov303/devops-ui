<template>
  <div class="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script lang="js">
export default {
  data() {
    return {
      defaultTitle: document.title,
    };
  },
  computed: {
    layout() {
      return `${this.$route.meta.layout || 'default'}-layout`;
    },
  },
  watch: {
    $route(to) {
      if (to.meta.title) {
        document.title = `${this.getTitle(to)} | ${this.defaultTitle}`;
      }
    },
  },
  methods: {
    getTitle(route) {
      if (typeof route.meta.title === 'function') {
        return route.meta.title(this.$route.params);
      }
      return route.meta.title;
    },
    async getUser() {
      await this.$store.dispatch('getUser');
    },
  },
  mounted() {
    this.getUser();
  }
};
</script>

<style lang="scss">
  @import "./assets/scss/styles.scss";
</style>
