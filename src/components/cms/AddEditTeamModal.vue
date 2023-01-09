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
              v-model.trim="form.teamAbbrev"
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
              v-model="form.tts_group_name"
              :options="getAllTtsGrNames"
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
      <div class="row">
        <div class="input-field col s12">
          <i class="material-icons prefix">person</i>
          <input
            autocomplete="off"
            type="text"
            id="assistant"
            v-model="form.assistant">
          <label :class="{active: form.assistant}" for="assistant">Assistant</label>
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
      tts_group_name: {},
      manager: '',
      assistant: ''
    };
  },
  computed: {
    getAllTtsGrNames() {
      return [
        { name: ''},
        ...this.$store.state.cms.codixTeamsTTS,
      ];
    },
  },
  methods: {
    setModalData() {
      this.form = { ...this.selectedTeam };
      if (this.action === 'update') {
        this.form.id = this.selectedTeam.id;
        this.form.teamAbbrev = this.selectedTeam.abbreviation;
        this.form.selectedTeamName = this.selectedTeam.name;
        if (this.selectedTeam.tts_group_name) {
          this.form.tts_group_name = this.getAllTtsGrNames
            .find((ttsgrname) => ttsgrname.name === this.selectedTeam.tts_group_name);
        }
        this.form.manager = this.selectedTeam.manager;
        this.form.assistant = this.selectedTeam.assistant;
      }
    },
    getCodixTeams() {
      this.$store.dispatch('cms/getCodixTeams');
    },
    async updateCodixTeams() {
      const abbreviation = this.form.teamAbbrev.toUpperCase();
      const loader = this.$loading.show({ container: this.$el });
      let data = {};
      if (this.form.manager === '') {
        if (this.form.tts_group_name.name === '') {
          data = {
            id: this.form.id,
            tts_group_name: '',
            abbreviation: abbreviation,
            manager: '',
            assistant: this.form.assistant
          };
        }
        data = {
          id: this.form.id,
          tts_group_name: this.form.tts_group_name.name,
          abbreviation: abbreviation,
          manager: '',
          assistant: this.form.assistant
        };
      } else if (this.form.teamAbbrev === '') {
        if (this.form.tts_group_name.name === '') {
          data = {
            id: this.form.id,
            tts_group_name: '',
            abbreviation: '',
            manager: this.form.manager,
            assistant: ''
          };
        }
        data = {
          id: this.form.id,
          tts_group_name: this.form.tts_group_name.name,
          abbreviation: '',
          manager: this.form.manager,
          assistant: ''
        };
      } else if (this.form.tts_group_name === '') {
        data = {
          id: this.form.id,
          tts_group_name: '',
          abbreviation: abbreviation,
          manager: this.form.manager,
          assistant: this.form.assistant
        };
      } else {
        data = {
          id: this.form.id,
          tts_group_name: this.form.tts_group_name.name,
          abbreviation: abbreviation,
          manager: this.form.manager,
          assistant: this.form.assistant
        };
      }
      if (this.form.teamAbbrev === '') {
        if (this.form.tts_group_name.name === '') {
          data = {
            id: this.form.id,
            tts_group_name: '',
            abbreviation: '' || null,
            manager: this.form.manager,
            assistant: this.form.assistant
          };
        }
        data = {
          id: this.form.id,
          tts_group_name: this.form.tts_group_name.name,
          abbreviation: '' || null,
          manager: this.form.manager,
          assistant: this.form.assistant
        };
      } else if (this.form.teamAbbrev === '') {
        if (this.form.tts_group_name.name === '') {
          data = {
            id: this.form.id,
            tts_group_name: '',
            abbreviation: abbreviation,
            manager: '',
            assistant: ''
          };
        }
        data = {
          id: this.form.id,
          tts_group_name: this.form.tts_group_name.name,
          abbreviation: abbreviation,
          manager: '',
          assistant: ''
        };
      } else if (this.form.tts_group_name === '') {
        data = {
          id: this.form.id,
          tts_group_name: '',
          abbreviation: abbreviation,
          manager: this.form.manager,
          assistant: this.form.assistant
        };
      } else {
        data = {
          id: this.form.id,
          tts_group_name: this.form.tts_group_name.name,
          abbreviation: abbreviation,
          manager: this.form.manager,
          assistant: this.form.assistant
        };
      }
      await this.$store.dispatch('cms/updateTeams', data)
        .then(() => {
          this.$M.toast({ html: 'Team has been updated!', classes: 'toast-success' });
        })
        .catch((error) => {
          this.error = error;
          return error;
        })
        .then(() => {
          if (this.error) {
            this.$M.toast({ html: 'Error. Abbrev should be unique. Team ' +
                'not updated!', classes: 'toast-fail' });
          }
        })
      loader.hide();
      this.closeModal();

      if (!this.abbrevLength()) {
        return false;
      }
    },
    abbrevLength() {
      let abbrevLength = this.form.teamAbbrev;
      if (abbrevLength.length > 3) {
        this.$M.toast({html: `Abbreviation should be up to 3 characters.`, classes: 'toast-fail'});
        return false;
      }
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
