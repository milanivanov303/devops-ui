<template>
  <div class="branches">
    <div class="row">
      <div class="col s12 m6 l5">
        <TextInput label="Search" icon="search" v-model="search"/>
      </div>
    </div>
    <div class="row">
      <div :class="{'col s12 m6 l5 scroll': $route.meta.name === 'extranet-branch'}">
        <Branch
          v-for="branch in filteredBranches"
          :key="branch.name"
          :branch="branch"
          :count="getContainersCount(branch.name)"
          :class="{
            'selected-branch': $route.path === `/extranet/branches/${branch.name}`,
            'col s12 m6 l4': $route.meta.name === 'extranet-branches'
          }"
        />
      </div>
      <div v-if="$route.meta.name === 'extranet-branch'" class="col s12 m6 l7">
        <div class="card">
          <div class="card-content">
            <transition name="branch" mode="out-in">
              <router-view :key="$route.path"/>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Branch from '@/components/extranet/Branch';
import TextInput from '@/components/partials/TextInput';

export default {
  components: {
    TextInput,
    Branch,
  },
  data() {
    return {
      search: this.$route.query.search,
    };
  },
  computed: {
    branches() {
      return this.$store.state.extranet.branches;
    },
    filteredBranches() {
      if (!this.search) {
        return this.branches;
      }

      const regexp = new RegExp(this.search, 'i');
      return this.branches.filter(branch => branch.name.match(regexp));
    },
    containers() {
      return this.$store.state.extranet.containers;
    },
  },
  methods: {
    getContainersCount(branch) {
      return this.$store.getters['extranet/getContainersByBranch'](branch).length;
    },
    getBranches() {
      const loader = this.$loading.show({ container: this.$el });
      this.$store.dispatch('extranet/getBranches').then(() => {
        loader.hide();
        const selectedBranch = document.querySelector('.selected-branch');
        if (selectedBranch) {
          selectedBranch.scrollIntoView({
            block: 'start',
            inline: 'nearest',
          });
        }
      });
    },
    getContainers() {
      this.$store.dispatch('extranet/getContainers');
    },
  },
  mounted() {
    this.getBranches();
    this.getContainers();
  },
  watch: {
    search(value) {
      let query = {};
      if (value) {
        query = { search: value };
      }
      this.$router.push({ query });
    },
  },
};
</script>

<style lang="scss">
  .selected-branch {
    background-color: #ccc;
  }
  .scroll {
    max-height: 72.5vh;
    overflow-x: auto;
  }
</style>
