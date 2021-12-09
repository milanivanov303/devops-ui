<template>
  <pre ref="build-logs">{{logs}}</pre>
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
        })
        .catch((error) => error.message)
        .finally(() => loader.hide());
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
