<template>
  <div class="branches">
    <div class="row">
      <div :class="{'col s12 m6 l5': $route.meta.name === 'extranet-branch'}">
        <div v-bind:key="branch.name" v-for="branch in branches">
          <div :class="{'col s12 m6 l4': $route.meta.name === 'extranet-branches'}">
            <Branch :branch="branch"
                    :container="getContainer(branch)"
                    :class="{'selected-branch':
                    $route.path === `/extranet/branches/${branch.name}`}"/>
          </div>
        </div>
      </div>
      <div class="col s12 m6 l7 card">
        <transition name="branch-info" mode="out-in">
          <router-view />
        </transition>
    </div>
  </div>
</template>

<script>
import Branch from '@/components/extranet/Branch';

export default {
  components: {
    Branch,
  },
  data() {
    return {
      branches: [],
      containers: [],
    };
  },
  methods: {
    getContainer(branch) {
      const container = this.containers.filter(container => (
        container.Labels.branch === branch.name
      ));
      return container.length === 1 ? container[0] : null;
    },
  },
  mounted() {
    const loader = this.$loading.show({ container: this.$el });

    this.$store.dispatch('extranet/getBranches')
      .then((branches) => {
        this.branches = branches;
        loader.hide();
      });

    const payload = {
      filters: JSON.stringify({
        label: ['type=extranet'],
        status: ['created', 'restarting', 'running', 'removing', 'paused', 'exited', 'dead'],
      }),
    };

    this.$store.dispatch('extranet/getContainers', payload)
      .then((containers) => {
        this.containers = containers.data;
        loader.hide();
      });
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
