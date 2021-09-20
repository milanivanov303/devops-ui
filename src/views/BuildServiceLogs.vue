<template>
  <Modal @close="$emit('close')" class="left-align">
    <template v-slot:header class="header">Build: {{ build.name }}</template>
    <template v-slot:content>
      <br>
      <div class="row">
          <div class="col s12" >
            <Select
              v-model="selectedNumberOfLogs"
              :options="[50,100,200,500,1000]"
              icon="cloud_upload"
              label="Select number of logs:"
              displayed="label"
              :default-option="false"
              @change="$emit('change', selectedNumberOfLogs)"
            />
          </div>
        </div>
        <br>
<pre class="showLogs">
{{logs}}
</pre>
    </template>
    <template v-slot:footer></template>
  </Modal>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      selectedNumberOfLogs: '',
      logs: null,
    };
  },
  methods: {
    getServiceLogsByBuild() {
      const serviceID = this.build.details.service.ID;
      const numberOfLogs = `&tail=${this.selectedNumberOfLogs}`;
      axios({
        url: `/devops-docker-api/services/${serviceID}/logs?stderr=true&stdout=true&details=true${numberOfLogs}`,
        method: 'GET',
        responseType: 'application/json',
      })
        .then((response) => {
          // eslint-disable-next-line no-control-regex,vue/no-parsing-error,no-irregular-whitespace
          this.logs = response.data.replace(/[\x00-\x08\x0E-\x1F\x7F-\uFFFF]/g, '');
        })
        .catch((error) => error.message);
    },
  },
  watch: {
    selectedNumberOfLogs(val) {
      if (val) {
        this.selectedNumberOfLogs = val;
        this.getServiceLogsByBuild();
      }
    },
  },
  props: {
    build: {
      type: Object,
      required: true,
    },
  },
  created() {
    this.interval = setInterval(() => this.getServiceLogsByBuild(), 1000);
  },
};
</script>
