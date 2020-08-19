<template>
  <div>
    Open build {{ $route.params.name }} {{ build.status }}

    <iframe ref="iframe"></iframe>
  </div>
</template>

<script>

import { buildMixin } from '../mixins/buildMixin';

export default {
  mixins: [buildMixin],
  data() {
    return {
      build: {}
    };
  },
  methods: {
    setBuildUrl() {
      let url = this.getUrl(this.build);

      if (this.$route.query.uri) {
        url += this.$route.query.uri;
      }

      this.$refs.iframe.setAttribute('src', url);
    },

    updateUrl(data) {
      let query = Object.assign({}, this.$route.query);
      query.uri = data.location.href
        .replace(data.location.origin, '')
        .replace('/' + this.$route.params.name + '/', '');

      this.$router.push({ query });
      window.document.title = data.title;
    },

    startListener() {
      const eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
      const messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

      window[eventMethod](messageEvent, function(e) {

        try {
          const key = e.message ? "message" : "data";
          const data = JSON.parse(e[key]);

          this.updateUrl(data);
        } catch (e) { }
      }.bind(this), false);
    }
  },
  mounted() {
    this.startListener();

    // TODO: to not get services just because of the docker host
    const promise1 = this.$store.dispatch('extranet/getServices');
    const promise2 = this.$store.dispatch('builds/findBuildByName', this.$route.params.name);

    Promise.all([promise1, promise2]).then((responses) => {
      if (responses[1].data.data.length === 0) {
        return;
      }

      this.build = responses[1].data.data[0];
      if (this.build.status === 'stopped') {
        this.$store.dispatch('builds/start', this.build.id)
          .then(() => {
            this.build.status = 'running';
            this.setBuildUrl()
          });
        return;
      }

      if (this.build.status === 'running') {
        this.setBuildUrl();
      }
    });
  },
};
</script>

<style>
  body {
    margin: 0;
    overflow: hidden;
  }
  iframe {
    border: 0;
    height: 100vh;
    width: 100%
  }
</style>
