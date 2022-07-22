<template>
  <Modal
      @close="closeModal()"
      class="right-sheet">
    <template v-slot:header>
      <div>
        Update {{ form.selectedTeamName }} abbreviation
      </div>
    </template>
    <template v-slot:content>
      <div class="row">
        <div class="input-field col s12">
          <i class="material-icons prefix">font_download</i>
          <input
              autocomplete="off"
              type="text"
              id="abbrev"
              v-model="form.teamAbbrev">
          <label :class="{active: form.teamAbbrev}" for="abbrev">Abbreviation</label>
        </div>
        <div class="validator red-text" v-if="$v.form.teamAbbrev.$error">
          <p v-if="!$v.form.teamAbbrev.required">Abbreviation field must not be empty.</p>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <button
          class="btn waves-effect waves-light"
          type="submit"
          name="action"
          @click="addUpdateAbbrev()">
        Save
      </button>
    </template>
  </Modal>
</template>

<script>
import { required } from 'vuelidate/lib/validators';

export default {
  props: {
    selectedTeam: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      error: '',
      loading: false,
      form: {},
      teamAbbrev: '',
      selectedTeamName: '',
    };
  },
  validations: {
    form: {
      teamAbbrev: {
        required,
      },
    },
  },
  methods: {
    setModalData() {
      this.form = {};
      this.form.id = this.selectedTeam.id;
      this.form.selectedTeamName = this.selectedTeam.name;
    },
    getCodixTeams() {
      this.$store.dispatch('cms/getCodixTeams');
    },
    async addUpdateAbbrev() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const loader = this.$loading.show({ container: this.$el });
      await this.$store.dispatch('cms/updateTeamsAbbrev', this.form)
        .then(() => {
          this.$M.toast({ html: 'Team has been updated!', classes: 'toast-success' });
        })
        .catch((error) => {
          this.error = error;
          return error;
        });
      loader.hide();
    },
    closeModal() {
      this.error = '';
      this.$v.$reset();
      this.$emit('close');
    },
  },
  created() {
    this.getCodixTeams();
  },
  mounted() {
    this.setModalData();
  },
};
</script>
