<template>
  <div class="debiteur-branch">
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
import Build from '@/views/debiteur/components/Build';
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
    //   return this.$store.getters['debiteur/getContainersByBranch'](this.branch);
    // },
  },
};
</script>
