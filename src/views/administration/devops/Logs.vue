<template>
    <Logs :index="appCode" :axios="axios"/>
</template>

<script>
import { Logs } from '@enterpriseapps/vue-administration';
import Axios from 'axios';

export default {
  components: {
    Logs,
  },
  computed: {
    appCode() {
      return this.$config.devops.code.toLowerCase();
    },
    axios() {
      const axios = Axios.create({
        baseURL: this.$config.elastic.url,
        headers: {
          Authorization: `Basic ${btoa(`${this.$config.elastic.username}:${this.$config.elastic.pass}`)}`,
          'Content-Type': 'application/json',
        },
      });
      axios.CancelToken = Axios.CancelToken;
      return axios;
    },
  },
};
</script>
