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
// import Api from '@/plugins/api';
// import config from '@/config';

// const api = new Api(config.devops.url, config.devops.code);

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
    // api.get('extranet/branches').then((branches) => {
    //   this.branches = branches;
    //   loader.hide();
    // });
    this.$store.dispatch('devopsapi/get', 'extranet/branches')
      .then((branches) => {
        this.branches = branches;
        loader.hide();
      });
  },
};
</script>
