<template>
  <Modal @close="$emit('close')" class="left-align">
    <template v-slot:header class="header">Build: {{ build.name }}</template>
    <template v-slot:content>
      <br>
      <div id="selectNumberOfLogs">
        <span class="numberOfLogs">Select number of logs:</span>
        <select class="form-select"  v-model="selectedNumberOfLogs" >
          <option selected value="50">50</option>
          <option value="100">100</option>
          <option value="500">500</option>
          <option value="1000">1000</option>
        </select>
      <br>
      </div>
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
      logs: this.getServiceLogsByBuild(),
      selectedNumberOfLogs: '0',
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
          this.logs = response.data.replace(/[�\u0000-\u0001-\u0002]/g, '');
        })
        .catch((error) => error.message);
    },
  },
  watch: {
    selectedNumberOfLogs(val) {
      if (val) {
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
<style>
select.form-select{
  display: flex;
  position:absolute;
  left:40px;
  top:130px;
  width:150px;
  background-color: white;
}
span.numberOfLogs{
  display: flex;
  position:absolute;
  left:40px;
  top:110px;
  width:150px;
}
span{
  color: black;
}
pre.showLogs{
  display: flex;
  position:absolute;
  top:180px;
}
</style>
