<template>
  <div class="extranet-branch">
    <div class="row" >
      <div class="col s12" >
        <h4>{{ branch }}</h4>
        <router-link :to="'/extranet/branches/'+branch+'/documentation'">
          <i class="material-icons right">library_books</i>
        </router-link>
        <router-view :key="$route.path" repo="extranet" :branch="branch"/>
      </div>
    </div>
    <Builds :branch="branch" module="extranet"/>
    <br>
    <Build/>
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
