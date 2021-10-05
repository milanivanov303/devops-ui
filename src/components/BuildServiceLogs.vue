<template>
  <div>
    <div class="row">
        <div class="col s4 offset-s8" >
          <Select
            v-model="numberOfLines"
            :options="[50,100,200,500,1000]"
            icon="cloud_upload"
            label="Number of lines"
            :default-option="false"
          />
        </div>
      </div>
      <br>
      <pre>{{logs}}</pre>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    build: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      numberOfLines: 50,
      logs: null,
    };
  },

  methods: {
    getServiceLogsByBuild() {
      const parameters = `?stderr=1&stdout=1&timestamps=0&tail=${this.numberOfLines}`;

      if (this.build.status !== 'running') {
        return;
      }
      axios
        .create()
        .get(`/devops-docker-api/services/${this.build.details.service.ID}/logs${parameters}`)
        .then((response) => {
          this.logs = response.data
            .split('\n')
            .map((line) => line.slice(8))
            .join('\n');
        })
        .catch((error) => error.message);
    },

    close() {
      clearInterval(this.interval);
    },
  },

  destroyed() {
    clearInterval(this.interval);
  },

  watch: {
    selectedNumberOfLogs() {
      this.getServiceLogsByBuild();
    },
  },

  created() {
    this.getServiceLogsByBuild();
    this.interval = setInterval(() => this.getServiceLogsByBuild(), 5000);
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
