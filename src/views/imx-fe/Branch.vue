<template>
  <div class="imx-fe-branch">
    <div class="row" >
      <div class="col s12" >
        <h4>{{ branch }}</h4>
      </div>
    </div>
    <Builds ref="builds" :branch="branch" module="imx-fe"/>
    <br>
    <Build @created="() => this.$refs.builds.getBuilds()"/>
  </div>
</template>

<script>
import Build from '../../views/imx-fe/components/Build';
import Builds from '../../components/Builds';

export default {
  components: {
    Build,
    Builds,
  },
  computed: {
    branch() {
      return decodeURIComponent(this.$route.params.branch);
    },
  },
};
</script>
