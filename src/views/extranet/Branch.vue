<template>
  <div class="extranet-branch">
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
import Build from '@/views/extranet/components/Build';
import Builds from '@/views/extranet/components/Builds';

export default {
  components: {
    Build,
    Builds,
  },
  computed: {
    branch() {
      return this.$route.params.branch;
    },
    containers() {
      return this.$store.getters['extranet/getContainersByBranch'](this.branch);
    },
  },
};
</script>
