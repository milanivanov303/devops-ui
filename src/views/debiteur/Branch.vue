<template>
  <div class="debiteur-branch">
    <div class="row" >
      <div class="col s12" >
        <h4>{{ branch }}</h4>
      </div>
    </div>
    <Builds ref="builds" :branch="branch" module="debiteur"/>
    <br>
    <Build @created="() => this.$refs.builds.getBuilds()"/>
  </div>
</template>

<script>
import Build from './components/Build';
import Builds from '../../components/Builds';

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
