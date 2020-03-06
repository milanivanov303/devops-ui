<template>
  <div>
    <p id="name">{{ name }}</p>
    <p id="username">{{ username }}</p>
  </div>
</template>

<script>

import { getParam } from '@/plugins/helpers';
import config from '@/config';

export default {
  computed: {
    name() {
      return getParam('name');
    },
    username() {
      return getParam('username');
    },
  },
  mounted() {
    if (!window.location.search) {
      window.location.href = `${config.um.url}/../logged-in-user`;
    }
  },
};
</script>
