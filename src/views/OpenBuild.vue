<template>
  <div>
    <p>Open build {{ $route.params.name }}</p>
  </div>
</template>

<script>

export default {
  data() {
    return {
      build: {}
    };
  },
  methods: {
    checkBuild() {

      this.$store.dispatch('builds/ping', this.build.id)
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
    this.$store.dispatch('builds/findBuildByName', this.$route.params.name)
      .then((response) => {
        if (response.data.data.length === 0) {

          // TODO: show build not found message here !!!

          return;
        }

        this.build = response.data.data[0];
        if (this.build.status === 'stopped') {

          // TODO: show starting build message here !!!

          this.$store.dispatch('builds/start', this.build.id)
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
