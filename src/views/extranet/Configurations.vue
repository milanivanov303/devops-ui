<template>
  <div class="configurations">
    <div class="data-table">
      <Table v-bind:request="request" ></Table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      request: {
        data: 'extranet/getConfigurations',
        columns: {
          project: '',
          type: '',
          version: '',
          delivery_chain: '',
          instance: '',
          branch: '',
          prefix: '',
          servlet_container: '',
          jdk: '',
          jre: '',
          description: ''
        },
        add: true,
        export: true,
        action: true,
        searchable: true,
      },
    };
  },
  methods: {
    getConfigurations() {
      const loader = this.$loading.show({ container: this.$el });
      this.$store.dispatch('extranet/getConfigurations').then(() => {
        loader.hide();
      });
    }
  },
  mounted() {
    this.getConfigurations();
  },
};
</script>
