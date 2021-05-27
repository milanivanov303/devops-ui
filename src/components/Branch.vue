<template>
  <router-link :to="getTo()">
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
    module: String,
    branch: {},
    count: {},
  },

  methods: {
    getTo() {
      const query = { ...this.$route.query };
      query.branch = this.branch.name;

      return { query };
    },
  },
};
</script>
