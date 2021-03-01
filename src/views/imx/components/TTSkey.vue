<template>
  <router-link v-bind:to="getRoute(ttsKey)" class="collection-item">
    <div class="card">
      <div class="card-content">
        <div class="card-title">
            <span class="badge" v-if="count">{{ count }}</span>
            {{ ttsKey }}
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    ttsKey: null,
    count: null,
  },
  methods: {
    getRoute(ttsKey) {
      return {
        path: `/imx/tts_keys/${encodeURIComponent(ttsKey)}`,
        query: this.$route.query,
      };
    },
  },
};
</script>
