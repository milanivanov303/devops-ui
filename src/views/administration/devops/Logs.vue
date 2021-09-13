<template>
  <Logs :index="index" :axios="axios"/>
</template>

<script>
import { Logs } from '@enterpriseapps/vue-administration';
import config from '@/config';
import Axios from 'axios';

export default {
  components: {
    Logs,
  },
  computed: {
    index() {
      return config.project;
    },
    axios() {
      const axios = Axios.create({
        baseURL: config.elastic.url,
        headers: {
          Authorization: `Basic ${btoa(`${config.elastic.username}:${config.elastic.pass}`)}`,
          'Content-Type': 'application/json',
        },
      });
      axios.CancelToken = Axios.CancelToken;
      return axios;
    },
  },
};
</script>
