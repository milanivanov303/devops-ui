<template>
  <div class="branches">
    <div class="row">
      <div v-bind:key="branch.name" v-for="branch in branches">
        <Branch :branch="branch" :container="getContainer(branch)" />
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
