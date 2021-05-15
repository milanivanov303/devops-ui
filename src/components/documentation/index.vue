<template>
  <Modal @close="close()" class="fullscreen">
    <template v-slot:header>
      Documentation for <b>{{ repo }}</b> branch <b>{{ branch }}</b>
    </template>
    <template v-slot:content>
      <div v-if="error" class="row error">
        <div class="s12 center">
          <i class="material-icons">error</i>
          <h5>{{ error }}</h5>
        </div>
      </div>

      <Details v-if="view === 'list' && !error" :repo="repo" :branch="branch"/>
      <List v-if="view === 'list' && !error" :specs="specs" @show="show"/>

      <transition name="raml" mode="out-in">
        <Raml v-if="view === 'raml'" :repo="repo" :branch="branch" :file="file"/>
      </transition>

      <transition name="openapi" mode="out-in">
        <Openapi v-if="view === 'openapi'" :repo="repo" :branch="branch" :file="file"/>
      </transition>

      <transition name="api-console" mode="out-in">
        <ApiConsole v-if="view === 'api-console'" :repo="repo" :branch="branch" :file="file"/>
      </transition>
    </template>
    <template v-slot:footer>
      <button
        v-if="view !== 'list'"
        class="waves-effect btn"
        @click="goBack()"
      >
        Back to API list
      </button>
    </template>
  </Modal>
</template>

<script>

import Details from "./Details";
import List from "./List";
import Raml from "./Raml";
import Openapi from "./Openapi";
import ApiConsole from "./ApiConsole";

export default {
  components: {
    Details,
    List,
    Raml,
    Openapi,
    ApiConsole,
  },

  props: {
    repo: String,
    branch: String,
  },

  data() {
    let view = 'list';
    if (this.$route.query.view) {
      view = this.$route.query.view;
    }

    let file = null;
    if (this.$route.query.file) {
      file = this.$route.query.file;
    }

    return {
      view,
      file,
      specs: [],
      error: null,
    };
  },
  methods: {
    getSpecs() {
      const loader = this.$loading.show({ container: this.$el });

      this.$store.dispatch('documentation/getSpecs', {
        branch: this.branch,
        repo: this.repo,
      })
        .then(response => {
          this.specs = response.data;
        })
        .catch(() => {
          this.error = 'Documentation has not been generated!';
        })
        .finally(
          () => loader.hide()
        );
    },

    show(file, view) {
      this.file = file;
      this.view = view;

      let query = this.$route.query;
      query.file = file;
      query.view = view;

      this.$router.push({
        query: {
          file: file,
          view: view,
        },
      });
    },

    close() {
      this.$emit('close')

      this.$router.push({
        path: `/${this.repo}/branches/${this.branch}`,
        query: { },
      });
    },

    goBack() {
      this.view = 'list';

      let query = this.$route.query;
      delete query.file;
      delete query.view;

      this.$router.push({ query });
    },
  },

  mounted() {
    this.getSpecs();
  },
};
</script>

<style lang="scss" scoped>
.error {
  margin-top: 200px;

  i {
    font-size: 17rem;
    color: #C40147;
  }
}
</style>
