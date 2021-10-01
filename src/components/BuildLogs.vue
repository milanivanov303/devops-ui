<template>
  <div>
    <pre>{{logs}}</pre>
  </div>
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
      api('devops')
        .post(`builds/${this.build.id}/logs`)
        .then((response) => {
          this.logs = response.data;
        })
        .catch((error) => error.message);
    },
  },

  beforeMount() {
    this.getLogsByBuild();
  },

};
</script>

<style scoped lang="scss">
pre {
  width: 100%;
  height: 70%;
  overflow: auto;
  //white-space: pre-wrap;
}
</style>
