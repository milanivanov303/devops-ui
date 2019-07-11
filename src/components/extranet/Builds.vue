<template>
  <div class="row">
    <div class="col s12" >
      <h4>Builds</h4>

      <ol>
        <li v-for="(build, index) in deployedBuilds" :key="index">
          <a :href="getDeployedBuildUrl(build)" target="_blank">{{ build.file }}</a> deployed on <b>{{ build.date }}</b>
        </li>
      </ol>

      <Build :container="container" @deployed="getDeployedBuilds()" ></Build>
    </div>
  </div>
</template>

<script>
import Api from "@/plugins/api";
import config from "@/config";
import Build from "@/components/extranet/Build";

const api = new Api(config.devops.url, config.devops.code);

export default {
  components: {
    Build
  },
  data() {
    return {
      deployedBuilds: []
    };
  },
  props: {
    container: {}
  },
  methods: {
    getDeployedBuilds() {
      const loader = this.$loading.show({ container: this.$el });

      let host = this.container.Host;
      let port = this.container.Ports.ssh;

      api.get(`extranet/build/deployed-builds?host=${host}&port=${port}`).then((response) => {
        this.deployedBuilds = response.builds;
      }).finally(() =>
        loader.hide()
      );
    },
    getDeployedBuildUrl(build) {
      return `http://${this.container.Host}:${this.container.Ports.web}/${build.file.replace('.war', '')}/`;
    }
  },
  mounted() {
    this.getDeployedBuilds();
  }
};
</script>
