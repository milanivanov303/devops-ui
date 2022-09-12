<template>
  <Modal
    @close="closeModal()"
    class="right-sheet">
    <template v-slot:header>
      Update {{ form.selectedTeamName }}
    </template>
    <template v-slot:content>

      <div class="row">
        <div class="input-field col s12">
          <i class="material-icons prefix">font_download</i>
          <input
            autocomplete="off"
            type="text"
            id="abbrev"
            v-model="form.teamAbbrev"
          />
          <label :class="{active: form.teamAbbrev}" for="abbrev">Abbreviation</label>
        </div>
      </div>

      <div class="row">
        <div class="input-field col s12">
          <i class="material-icons prefix">dehaze</i>
          <input
            :readonly="true"
            autocomplete="off"
            type="text"
            id="name"
            v-model="form.selectedTeamName">
          <label :class="{active: form.selectedTeamName}" for="name">Name</label>
        </div>
      </div>

      <div class="row">
        <div class="col s12">
          <Select
            label="TTS Group Name"
            icon="group"
            displayed="name"
            v-model="form.TTSGroupName"
            :options="teamsTTS"
          />
        </div>
      </div>

      <div class="row">
        <div class="input-field col s12">
          <i class="material-icons prefix">person</i>
          <input
            autocomplete="off"
            type="text"
            id="manager"
            v-model="form.manager">
          <label :class="{active: form.manager}" for="manager">Manager</label>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <button
        class="btn waves-effect waves-light"
        type="submit"
        name="action"
        @click="updateCodixTeams()">
        Save
      </button>
    </template>
  </Modal>
</template>

<script>
export default {
  props: {
    selectedTeam: {
      type: Object,
      required: true,
    },
    action: {
      type: String,
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
      TTSGroupName: '',
      manager: '',
    };
  },
  computed: {
    teamsTTS() {
      return this.$store.state.cms.codixTeamsTTS;
    },
  },
  methods: {
    setModalData() {
      this.form = {};
      if (this.action === 'update') {
        this.form.id = this.selectedTeam.id;
        this.form.teamAbbrev = this.selectedTeam.abbreviation;
        this.form.selectedTeamName = this.selectedTeam.name;
        this.form.TTSGroupName = this.selectedTeam.tts_group_name;
        this.form.manager = this.selectedTeam.manager;
      }
    },
    getCodixTeams() {
      this.$store.dispatch('cms/getCodixTeams');
    },
    async updateCodixTeams() {
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
      this.closeModal();
    },
    closeModal() {
      this.error = '';
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
