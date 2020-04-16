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
import Build from '@/components/extranet/Build';
import Builds from '@/components/extranet/Builds';

export default {
  components: {
    Build,
    Builds,
  },
  computed: {
    branch() {
      return this.$route.params.branch;
    },
  },
};
</script>
