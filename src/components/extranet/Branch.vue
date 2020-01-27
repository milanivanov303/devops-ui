<template>
  <router-link v-bind:to="getRoute(branch)" class="collection-item">
    <div class="card">
      <div class="card-content">
        <div class="card-title">
            <span class="badge" v-if="count">{{ count }}</span>
            {{ branch.name }}

        </div>
        <p>Hash: {{ branch.hash }}</p>
        <p>Version: {{ branch.version }}</p>
      </div>
    </div>
  </router-link>
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
        path: `/extranet/branches/${branch.name}`,
        query: this.$route.query,
      };
    },
  },
};
</script>
