<template>
  <div class="row">
    <div class="col s12">
      <router-link to="/">Home</router-link>
      <router-link v-for="route in routes" :to="route.path" :key="route.path">
        {{ route.meta.breadcrumb }}
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    routes() {
      return this.$route.matched;
    },
  },
};
</script>

<style lang="scss" scoped>
.row {
  margin: 10px 0 0 0;
  font-size: 16px;

  a:not(:first-child) {
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
</style>
