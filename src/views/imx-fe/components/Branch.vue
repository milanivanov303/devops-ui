<template>
  <router-link v-bind:to="getRoute(branch)" class="collection-item">
    <div class="card">
      <div class="card-content">
        <div class="card-title">
            <span class="badge" v-if="count">{{ count }}</span>
            {{ branch }}
        </div>
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
        path: `/imx_fe/branches/${encodeURIComponent(branch)}`,
        query: this.$route.query,
      };
    },
  },
};
</script>
