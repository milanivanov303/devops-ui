<template>
  <div>
    <p>Open build {{ $route.params.name }}</p>
  </div>
</template>

<script>

import config from "@/config";
import Axios from "axios";

const um = Axios.create({
  baseURL: config.um.url,
  headers: {
    Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1OTk2NTk4NDUsIm5hbSI6IkVBIEF1dG8iLCJ1c3IiOiJlYV9hdXRvIiwiZW1sIjoicGhwaWRAY29kaXhmci5wcml2YXRlIiwidHlwIjoicmVmcmVzaCJ9.pTZMqjRVdgEI7UFSYBdbvef4h_DSeYA-AQSyuI9Gh0VWecKVj1eyD-aMGpB0tU40Ytrla8UJXIUqQ0hadsoPi6YLQrzooPApAJwbYN8mf2fr1KML2HS7hbi2hogH5xPuzr-oOnDNR7gyzk5CZyOWrJqbljR7ZbXJCtlwCCqVdEjD9IolBpN2E3VbqQuYToMcD-F4zP1JHP4u60logYJTfm3ITMY5vFju9Viw_HJfK6qJGSfdP6RbMMVGC2LUzY3ErD30_u_ypQbJ7MP1aHlzwKGLNSNFa3_0rhaMLShpuSsYLylamhItmYIy_fM9C95qnftUrAFOmv3x518srHztlQ`
  }
});

const api = Axios.create({
  baseURL: config.devops.url
});
api.interceptors.request.use();
api.interceptors.response.use(null, error => {
  if (error.response.status === 401) {
    return um.get(`auth/token?code=${config.devops.code}`).then((response) => {
      error.config.headers.Authorization = `Bearer ${response.data.token}`;
      return Axios.create().request(error.config);
    });
  }
  return Promise.reject(error);
});

export default {
  data() {
    return {
      build: {}
    };
  },
  methods: {
    checkBuild() {

      api.get(`builds/${this.build.id}/ping`)
        .then(() => {
          // TODO: show build working message here !!!

          setTimeout(() => window.location.reload(), 1000);
        })
        .catch(() => {
          setTimeout(() => this.checkBuild(),3000);
        });
    },
  },

  mounted() {
    const filters = JSON.stringify({
      filters: JSON.stringify({
        allOf: [
          {
            'details->service->Spec->Name': this.$route.params.name,
          },
        ],
      }),
    });

    api.get(`builds?filters=${filters}`)
      .then((response) => {
        if (response.data.data.length === 0) {

          // TODO: show build not found message here !!!

          return;
        }

        this.build = response.data.data[0];
        if (this.build.status === 'stopped') {

          // TODO: show starting build message here !!!

          api.get(`builds/${this.build.id}/ping`)
            .then(() => {

              // TODO: show build started message here !!!

              // We wait for tomcat to start now
              this.checkBuild();
            });
          return;
        }

        this.checkBuild();
    });
  },
};
</script>
