<template>
  <ul>
      <li>
        <router-link to="/">Home</router-link>
      </li>
      <li v-for="(route, index) in routes">
        <router-link
          :to="(index < Object.keys(routes).length - 1) ? route.path : ''"
          :key="route.path"
        >
          {{ getBreadcrumb(route) }}
        </router-link>
      </li>
  </ul>
</template>

<script lang="js">
  export default {
    computed: {
      routes() {
        return this.$route.matched;
      },
    },
    methods: {
      getBreadcrumb(route) {
        if (typeof route.meta.breadcrumb === 'function') {
          return route.meta.breadcrumb(this.$route.params);
        }
        return route.meta.breadcrumb;
      }
    }
  };
</script>

<style lang="scss" scoped>
  ul {
    li {
      &:hover {
        a {
          background-color: transparent;
        }
      }

      a {
        display: inline-block;
        padding: 0 10px;
      }

      &:not(:first-child) {
        &:before {
          content: "/";
          vertical-align: top;
          display: inline-block;
          font-weight: normal;
          font-style: normal;
          margin: 0 10px 0 8px;
        }
      }
    }
  }
</style>
