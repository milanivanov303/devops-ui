<template>
  <div class="card">
    <div class="card-content">
      <div class="card-title">
        <router-link v-bind:to="getRoute(branch)" class="collection-item">
          <span class="badge" v-if="count">{{ count }}</span>
          {{ branch.name }}
        </router-link>
      </div>
      <p>Hash: {{ branch.hash }}</p>
      <p>Version: {{ branch.version }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    branch: {},
    count: {},
  },
  methods: {
    getRoute(branch) {
      return {
        path: '/extranet/branches/' + branch.name,
        query: this.$route.query
      };
    }
  }
};
</script>
