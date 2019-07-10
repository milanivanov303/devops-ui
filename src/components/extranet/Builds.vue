<template>
  <div class="row">
    <div class="col s12" >
      <h4>Builds</h4>

      <ol>
        <li v-for="deployedBuild in deployedBuilds" >
          <b>{{ deployedBuild.file }}</b> deployed on <b>{{ deployedBuild.date }}</b>
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

      let port = this.container.NetworkSettings.Ports['22/tcp'][0].HostPort;

      api.get(`extranet/build/deployed-builds?port=${port}`).then((response) => {
        this.deployedBuilds = response.builds;
      }).finally(() => loader.hide());
    }
  },
  mounted() {
    this.getDeployedBuilds();
  }
};
</script>
