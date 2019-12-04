<template>
  <div class="row">
    <div class="col s12">
      <Table v-bind:request="request" ></Table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      request: {
        data: 'users',
        columns: {
          name: '',
          username: '',
          email: '',
          phone: '',
          department: 'name',
        },
        add: false,
        export: false,
        action: false,
        searchable: true,
      },
    };
  },
  methods: {
    async getUsers() {
      const loader = this.$loading.show({ container: this.$el });

      const payload = {
        with: JSON.stringify(['department']),
      };

      await this.$store.dispatch('getUsers', payload).then(() => {
        loader.hide();
      });
    },
  },
  mounted() {
    this.getUsers();
  },
};
</script>
