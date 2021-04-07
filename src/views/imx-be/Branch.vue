<template>
  <div class="imx-fe-branch">
    <div class="row" >
      <div class="col s12">
        <h4>{{ branch }}</h4>
          <router-link :to="'/imx_be/branches/'+branch+'/doc'">
            <i class="material-icons right">library_books</i>
          </router-link>
          <router-view :key="$route.path" repo="imx_be"/>
      </div>
    </div>
    <Builds ref="builds" :branch="branch" module="imx_be"/>
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
      return decodeURIComponent(this.$route.params.branch);
    },
  },
};
</script>
