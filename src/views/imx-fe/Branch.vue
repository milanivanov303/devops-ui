<template>
  <div class="imx-fe-branch">
    <div class="row" >
      <div class="col s12" >
        <h4>{{ branch }}</h4>
      </div>
    </div>
    <Builds :containers="containers"></Builds>
    <br>
    <Build />
  </div>
</template>

<script>
import Build from '@/views/imx-fe/components/Build';
import Builds from '@/views/imx-fe/components/Builds';

export default {
  components: {
    Build,
    Builds,
  },
  computed: {
    branch() {
      return decodeURIComponent(this.$route.params.branch);
    },
    containers() {
      return this.$store.getters['imx_fe/getContainersByBranch'](this.branch);
    },
  },
};
</script>
