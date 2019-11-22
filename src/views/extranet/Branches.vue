<template>
  <div class="branches">
    <div class="row">
      <div v-if="$route.meta.name !== 'extranet-build'"
           :class="{'col s12 m6 l5': $route.meta.name === 'extranet-branch'}">
        <div v-bind:key="branch.name" v-for="branch in branches">
          <div :class="{'col s12 m6 l4': $route.meta.name === 'extranet-branches'}">
            <Branch
              :branch="branch"
              :count="getContainersCount(branch.name)"
              :class="{'selected-branch': $route.path === `/extranet/branches/${branch.name}`}"
            />
          </div>
        </div>
      </div>
      <div class="col s12 m6 l7">
        <div class="card">
          <div class="card-content">
            <transition name="branch-info" mode="out-in">
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

export default {
  components: {
    Branch,
  },
  computed: {
    branches() {
      return this.$store.state.extranet.branches;
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
      this.$store.dispatch('extranet/getBranches').then(() => loader.hide());
    },
    getContainers() {
      this.$store.dispatch('extranet/getContainers');
    },
  },
  mounted() {
    this.getBranches();
    this.getContainers();
  },
};
</script>

<style>
.selected-branch{
  background-color: #ccc;
}
.branch-info-enter-active {
  transition: opacity 1s, transform 1s;
}
.branch-info-enter {
  opacity: 0;
  transform: translateX(20%);
}
</style>
