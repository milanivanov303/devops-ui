<template>
  <pre ref="build-logs" id="build-logs">{{logs}}</pre>
</template>

<script>

export default {
  props: {
    build: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      logs: null,
    };
  },

  methods: {
    getLogsByBuild() {
      const loader = this.$loading.show({ container: this.$refs['build-logs'] });
      api('devops')
        .post(`builds/${this.build.id}/logs`)
        .then((response) => {
          this.logs = response.data;
          loader.hide();
        })
        .catch((error) => error.message, loader.hide())
        .finally(() => {
          const logElement = document.getElementById('build-logs');
          logElement.innerHTML = logElement.innerHTML.replace(/(https?:\/\/[^"\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        });
    },
  },

  activated() {
    this.getLogsByBuild();
  },

};
</script>

<style scoped lang="scss">
  pre {
    white-space: pre-line;
    height: 60vh;
    overflow-y:scroll;
    overflow-x:hidden;
  }
</style>
