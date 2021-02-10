<template>
  <router-link v-bind:to="getRoute(branch.name)" class="collection-item">
    <div class="card">
      <div class="card-content">
        <div class="card-title truncate">
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
    branch: null,
    count: null,
  },
  methods: {
    getRoute(branch) {
      return {
        path: `/imx_be/branches/${encodeURIComponent(branch)}`,
        query: this.$route.query,
      };
    },
  },
};
</script>
