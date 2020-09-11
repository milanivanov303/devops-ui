<template>
  <div>
    <p>Open build {{ name }}</p>
  </div>
</template>

<script>

const api = window.apiAuto('devops');

export default {
  data() {
    return {
      build: {},
    };
  },
  computed: {
    name() {
      return this.$route.params.name;
    },
  },
  methods: {
    checkBuild() {
      api.get(`builds/${this.build.id}/ping`)
        .then(() => {
          // TODO: show build working message here !!!

          // setTimeout(() => window.location.reload(), 1000);
        })
        .catch(() => {
          setTimeout(() => this.checkBuild(), 3000);
        });
    },
  },

  mounted() {
    api.get('builds', { name: this.name })
      .then((response) => {
        if (response.data.data.length === 0) {
          // TODO: show build not found message here !!!

          return;
        }

        [this.build] = response.data.data;
        if (this.build.status === 'stopped') {
          // TODO: show starting build message here !!!

          api.post(`builds/${this.build.id}/start`)
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
