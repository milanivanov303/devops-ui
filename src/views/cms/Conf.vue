<template>
  <div class="row">
    <h1 class="center">Configurations</h1>
    <div class="col s6 l6">
        <Select
              label="Codix Team"
              icon="people"
              displayed="name"
              v-model="codix_team"
              :options="codixTeams"
            />
    </div>
     <div class="col s6 l6">
        <Select
              label="Codix Team from TTS"
              icon="people"
              displayed="name"
              v-model="teamstts"
              :options="codixTeamsTTS"
            />
    </div>
    <div class="col s12 l12 ">
        <button
        class="btn waves-effect waves-light right"
        type="button"
        name="action">
        <!-- @click=""> -->
        Update Codix Teams
      </button>
    </div>
  </div>
</template>
<script>

export default {
  components: {},
  mounted() {},
  watch: {},
  data() {
    return {};
  },
  validations: {},
  computed: {
    codixTeams() {
      return this.$store.state.cms.codixTeams;
    },
    teamsTTS() {
      return this.$store.state.cms.codixTeamsTTS;
    },
  },
  methods: {},
  created() {
    this.$store.dispatch('cms/getCodixTeams');
    this.$store.dispatch('cms/codixTeamsTTS');
  },
};
</script>
<style lang="scss" scoped></style>
