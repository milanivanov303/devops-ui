<template>
  <div class="row">
    <h1 class="center">Modules</h1>
     <div class="col s12 m4">
            <Select
              label="Modules"
              icon="memory"
              displayed="name"
              v-model="abbrev.getModule"
              :options="getModules"
            />
           </div>
     <div class="col s12 l8">
      <table  class="highlight striped responsive-table">
        <thead>
          <tr>
            <th>#</th>
            <th>SubModules name</th>
            <th>Abbreviation</th>
          </tr>
        </thead>
       <tbody>
        <tr v-for="(module, key) in submodules"  v-bind:key="key">
          <td class="left-align">{{module.id}}</td>
          <td class="left-align">{{module.name}}</td>
          <td class="left-align">{{module.abbreviation}}</td>
        </tr>
      </tbody>
     </table>
    </div>
  </div>
</template>
<script>

export default {
  components: {},
  mounted() {},
  watch: {},
  data() {
    return {
      abbrev: {
        modules: '',
        submodule: '',
      },
    };
  },
  validations: {},
  computed: {
    getModules() {
      return this.$store.state.cms.modules;
    },
    submodules() {
      if (this.abbrev.getModule) {
        return this.abbrev.getModule.submodules || [];
      }
      return [];
    },
  },
  methods: {},
  created() {
    this.$store.dispatch('cms/getModules');
  },
};
</script>
<style lang="scss" scoped></style>
