<template>
  <div class="extranet-branch">
    <div class="row" >
      <div class="col s12" >
        <h4>Branch</h4>
        <p>Name: {{ branch }}</p>
      </div>
    </div>

    <ol>
      <li v-for="(container, index) in containers" :key="index">
        <a :href="getDeployedBuildUrl(container)" target="_blank">
          {{ container.Names[0].replace(/^\/|/, '') }} - {{ container.Status }}
        </a>
      </li>
    </ol>

    <Build />
  </div>
</template>

<script>
import Build from '@/components/extranet/Build';

export default {
  components: {
    Build,
  },
  computed: {
    branch() {
      return this.$route.params.branch;
    },
    containers() {
      return this.$store.getters['extranet/getContainersByBranch'](this.branch);
    },
    host() {
      return this.$store.state.extranet.host;
    }
  },
  methods: {
    getDeployedBuildUrl(container) {
      let port = container.Ports.find(value => value.PrivatePort === 8591).PublicPort;
      return `http://${this.host}:${port}${container.Names[0]}/`;
    },
  }
};
</script>
