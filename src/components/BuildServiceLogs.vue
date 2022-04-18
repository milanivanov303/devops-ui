<template>
    <div class="row">
        <div class="col s4 offset-s8">
            <Select
              v-model="numberOfLines"
              :options="[50,100,200,500,1000]"
              icon="cloud_upload"
              label="Number of lines"
              :default-option="false"
            />
        </div>
        <pre class="col s12" ref="service-logs">{{logs}}</pre>
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
      const loader = this.$loading.show({ container: this.$refs['service-logs'] });
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
        .catch((error) => {
          this.logs = error.message;
        })
        .finally(() => loader.hide());
    },

    close() {
      clearInterval(this.interval);
    },
  },

  activated() {
    this.getServiceLogsByBuild();
    this.interval = setInterval(() => this.getServiceLogsByBuild(), 5000);
  },

  deactivated() {
    clearInterval(this.interval);
  },

  watch: {
    selectedNumberOfLogs() {
      this.getServiceLogsByBuild();
    },
  },
};
</script>

<style scoped lang="scss">
  pre {
    white-space: pre-line;
    height: 45vh;
    overflow-y:scroll;
    overflow-x:hidden;
  }
</style>
