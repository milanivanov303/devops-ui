<template>
  <div class="row">
    <h1 class="center">Configurations</h1>
    <div class="col s6 l6">
        <Select
              label="Codix Team"
              icon="people"
              displayed="name"
              v-model="codixTeam"
              :options="codixTeams"
            />
      <div class="validator red-text" v-if="$v.codixTeam.$error">
        <p v-if="!$v.codixTeam.required">Codix Team must not be empty.</p>
      </div>
    </div>
     <div class="col s6 l6">
        <Select
              label="Codix Team from TTS"
              icon="people"
              displayed="name"
              v-model="ttsTeam"
              :options="teamsTTS"
            />
       <div class="validator red-text" v-if="$v.ttsTeam.$error">
         <p v-if="!$v.ttsTeam.required">Codix Team from TTS Team must not be empty.</p>
       </div>
    </div>
    <div class="col s12 l12 ">
        <button
        class="btn waves-effect waves-light right"
        type="button"
        name="action"
        @click="updateCodixTeams">
        Update Codix Teams
      </button>
    </div>
  </div>
</template>
<script>

import { required } from 'vuelidate/lib/validators';

export default {
  data() {
    return {
      codixTeam: {},
      ttsTeam: {},
    };
  },
  validations: {
    codixTeam: {
      required,
    },
    ttsTeam: {
      required,
    },
  },
  computed: {
    codixTeams() {
      return this.$store.state.cms.codixTeams;
    },
    teamsTTS() {
      return this.$store.state.cms.codixTeamsTTS;
    },
  },
  methods: {
    async updateCodixTeams() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      console.log(this.codixTeam.id, this.ttsTeam.name)
      const loader = this.$loading.show({ container: this.$el });
      await this.$store.dispatch('cms/updateTeams', this.codixTeam.id)
        .then(() => {
          this.$M.toast({ html: 'Team has been updated!', classes: 'toast-seccess' });
        })
        .catch((error) => {
          this.error = error;
          return error;
        });
      loader.hide();
    },
  },
  created() {
    this.$store.dispatch('cms/getCodixTeams');
    this.$store.dispatch('cms/codixTeamsTTS');
  },
};
</script>
<style lang="scss" scoped></style>
