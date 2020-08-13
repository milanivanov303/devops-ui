<template>
  <div class="extranet-branch">
    <div class="row" >
      <div class="col s12" >
        <h4>{{ branch }}</h4>
      </div>
    </div>
    <Builds/>
    <br>
    <Build />
  </div>
</template>

<script>
import Build from '@/views/extranet/components/Build';
import Builds from '@/components/Builds';

export default {
  components: {
    Build,
    Builds,
  },
  computed: {
    branch() {
      return this.$route.params.branch;
    },
    // containers() {
    //   return this.$store.getters['extranet/getContainersByBranch'](this.branch);
    // },
    // builds() {
    //   return this.$store.getters['builds/getActiveByBranch'](this.branch);
    // },
  },
};
</script>
