<template>
  <div class="branches">
    <div class="row">
      <div v-bind:key="branch.name" v-for="branch in branches">
        <Branch v-bind:branch="branch" />
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
    };
  },
  mounted() {
    const loader = this.$loading.show({ container: this.$el });

    this.$store.dispatch('extranet/getBranches')
      .then((branches) => {
        this.branches = branches;
        loader.hide();
      });
  },
};
</script>
