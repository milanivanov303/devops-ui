<template>
  <div>
    <h1 class="center">Configurations</h1>
    <div class="col s6 l6">
        <Select
              label="Codix Team Name"
              icon="people"
              displayed="name"
              v-model="form.codixTeam"
              :options="codixTeams"
            />
      <div class="validator red-text" v-if="$v.form.codixTeam.$error">
        <p v-if="!$v.form.codixTeam.required">Codix Team must not be empty.</p>
      </div>
    </div>
     <div class="col s6 l6">
        <Select
              label="TTS Group Name"
              icon="people"
              displayed="name"
              v-model="form.ttsTeam"
              :options="teamsTTS"
            />
       <div class="validator red-text" v-if="$v.form.ttsTeam.$error">
         <p v-if="!$v.form.ttsTeam.required">Codix Team from TTS Team must not be empty.</p>
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
    <div>
    <Table
        :data="codixTeams"
        sort-by="name"
        sort-dir="asc"
        :export-btn="false"
        :view-btn="false"
        :add-btn="false"
        :edit-btn="false"
        :delete-btn="false">
      <Column show="abbreviation"/>
      <Column show="name"/>
      <Column show="tts_group_name"/>
      <template v-slot:actions-before="{ row }">
        <a
            @click="openAddEditAbbrevModal(row, 'update')"
            data-tooltip="Add abbreviation"
            class="tooltipped">
          <i class="material-icons">add_circle_outline</i>
        </a>
      </template>
    </Table>
      <AddEditAbbrevModal
          v-if="showAddEditAbbrevModal"
          @close="showAddEditAbbrevModal = false"
          :selectedTeam="selectedTeam"
      />
    </div>
  </div>
</template>
<script>

import { required } from 'vuelidate/lib/validators';
import AddEditAbbrevModal from "../../components/cms/AddEditAbbrevModal";

export default {
  components: {
    AddEditAbbrevModal,
  },
  data() {
    return {
      form: {},
      codixTeam: {},
      ttsTeam: {},
      showAddEditAbbrevModal: false,
      selectedTeam: {},
    };
  },
  validations: {
    form: {
      codixTeam: {
        required,
      },
      ttsTeam: {
        required,
      },
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
    openAddEditAbbrevModal(team) {
      this.selectedTeam = { ...team };
      this.showAddEditAbbrevModal = true;
    },
    getCodixTeams() {
      this.$store.dispatch('cms/getCodixTeams');
    },
    async updateCodixTeams() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const loader = this.$loading.show({ container: this.$el });
      await this.$store.dispatch('cms/updateTeams', this.form)
        .then(() => {
          this.$M.toast({ html: 'Team has been updated!', classes: 'toast-success' });
        })
        .catch((error) => {
          this.error = error;
          return error;
        });
      loader.hide();
    },
  },
  created() {
    this.getCodixTeams();
    this.$store.dispatch('cms/codixTeamsTTS');
  },
};
</script>
<style lang="scss" scoped></style>
