<template>
  <div class="app">
    <component :is="layout">
      <router-view :key="$route.name"/>
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
      let layout = 'loading';
      if (this.$route.name !== null) {
        layout = this.$route.meta.layout || 'default';
      }

      return `${layout}-layout`;
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
        return route.meta.title(this.$route);
      }
      return route.meta.title;
    },
  },

  mounted() {
    // Set favicon url
    document.querySelector("link[rel~='icon']")
      .href = `${this.$config.um.url}/applications/${this.$config.devops.code}/favicon`;
  },
};
</script>

<style lang="scss">
  @import "./assets/scss/styles.scss";
</style>
