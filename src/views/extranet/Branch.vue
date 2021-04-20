<template>
  <div class="extranet-branch">
    <div class="row" >
      <div class="col s12" >
        <h4>
          {{ branch }}
          <a @click="openDocs()" title="Show documentation">
            <i class="material-icons right">library_books</i>
          </a>
        </h4>
      </div>
    </div>
    <Builds :branch="branch" module="extranet"/>
    <br>
    <Build/>

    <ApiDocumentation
      v-if="showDocs"
      repo="extranet"
      :branch="branch"
      @close="closeDocs()"
    ></ApiDocumentation>

  </div>
</template>

<script>
import Build from './components/Build';
import Builds from '../../components/Builds';
import ApiDocumentation from '@/components/ApiDocumentation';

export default {
  components: {
    ApiDocumentation,
    Build,
    Builds,
  },
  data() {
    return {
      showDocs: false,
    };
  },
  methods: {
    openDocs() {
      this.showDocs = true;

      this.$router.history.replace({
        path: `/extranet/branches/${this.branch}/docs`,
        query: this.$route.query,
      });
    },
    closeDocs() {
      this.showDocs = false;

      this.$router.history.replace({
        path: `/extranet/branches/${this.branch}`,
      });
    },
  },
  computed: {
    action() {
      return this.$route.params.action;
    },
    branch() {
      return decodeURIComponent(this.$route.params.branch);
    },
  },
  created() {
    if (this.action === 'docs') {
      this.openDocs();
    }
  },
};
</script>
