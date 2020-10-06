<template>
  <div>
    <p id="name">{{ name }}</p>
    <p id="username">{{ username }}</p>
  </div>
</template>

<script>

import config from '@/config';

export default {
  computed: {
    name() {
      return this.$route.query.name;
    },
    username() {
      return this.$route.query.username;
    },
  },
  mounted() {
    if (!window.location.search) {
      window.location.href = `${config.um.url}/../logged-in-user?return_url=${encodeURI(window.location.href)}`;
    }
  },
};
</script>
