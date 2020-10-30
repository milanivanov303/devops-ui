<template>
  <div @submit.prevent="onSubmit" id="action" ref="config-add" class="modal right-sheet">
    <div class="frame">
      <div class="modal-content">
        <h3 class="center">Create Variable</h3>
        <form>
          <div class="row">
            <div class="col s4">
              <Select
                label="Codix Team"
                icon="group"
                displayed='name'
                :options="getCodixTeams"
                v-model="codixTeam"
                :invalid="$v.codixTeam.$error"
                @blur="$v.codixTeam.$touch()"
              />
              <div class="validator red-text" v-if="$v.codixTeam.$error">
                <p v-if="!$v.codixTeam.required">Field is required!</p>
              </div>
            </div>
            <div class="col s4">
              <Select
                label="IMX Module"
                icon="extension"
                displayed='name'
                :options="getModules"
                v-model="module"
                :invalid="$v.module.$error"
                @blur="$v.module.$touch()"
                @change="selectedModule"
              />
              <div class="validator red-text" v-if="$v.module.$error">
                <p v-if="!$v.module.required">Field is required!</p>
              </div>
            </div>
            <div class="col s4">
              <Select
                label="Submodule"
                icon="extension"
                displayed='name'
                :options="submodules.options"
                v-model="submodule"
                :invalid="$v.submodule.$error"
                @blur="$v.submodule.$touch()"
              />
              <div class="validator red-text" v-if="$v.submodule.$error">
                <p v-if="!$v.submodule.required">Field is required!</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s6">
              <i class="material-icons prefix">label_outline</i>
              <input id="variable_name"
                     type="text"
                     v-model="name"
                     @blur="$v.name.$touch()">
              <span v-if="fullName">{{fullName}}</span>
              <div class="validator red-text" v-if="$v.name.$error">
                  <p v-if="!$v.name.required">Field is required</p>
                  <p v-if="!$v.name.isUnique">The variable name already exists.</p>
              </div>
              <label for="icon_prefix2" class="active">Variable Name</label>
            </div>
            <div class="input-field col s6">
              <i class="material-icons prefix">label_outline</i>
              <label for="icon_prefix2" class="active">Variable Value</label>
              <input id="variable_value"
                     type="text"
                     v-model="variable.value"
                     @blur="$v.variable.value.$touch()">
              <div class="validator red-text" v-if="$v.variable.value.$error">
                <p v-if="!$v.variable.value.required">Field is required!</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <i class="material-icons prefix">insert_comment</i>
              <textarea id="variable_description"
                        class="materialize-textarea"
                        v-model.trim="variable.description"></textarea>
              <label for="icon_prefix2" class="active">Description</label>
            </div>
            <div class="validator red-text" v-if="$v.variable.description.$error">
              <p v-if="!$v.variable.description.required">Field is required!</p>
            </div>
          </div>
          <h6 class="center">COMMIT MESSAGE</h6>
          <div class="row">
            <div class="input-field col s12">
              <i class="material-icons prefix">label_outline</i>
              <label for="icon_prefix2" class="active">TTS Key</label>
              <input id="tts_key"
                     type="text"
                     v-model="commitMsg.ttsKey"
                     @blur="$v.commitMsg.ttsKey.$touch()">
              <div class="validator red-text" v-if="$v.commitMsg.ttsKey.$anyError">
                <p v-if="!$v.commitMsg.funcChanges.required">Field is required!</p>
                <p v-if="!$v.commitMsg.ttsKey.validKey">Not a valid TTS key.</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s6">
              <i class="material-icons prefix">label_outline</i>
              <label for="icon_prefix2" class="active">Func Changes</label>
              <input id="func_changes"
                     type="text"
                     v-model="commitMsg.funcChanges"
                     @blur="$v.commitMsg.funcChanges.$touch()">
              <div class="validator red-text" v-if="$v.commitMsg.funcChanges.$error">
                <p v-if="!$v.commitMsg.funcChanges.required">Field is required!</p>
              </div>
            </div>
            <div class="input-field col s6">
              <i class="material-icons prefix">label_outline</i>
              <label for="icon_prefix2" class="active">Tech Changes</label>
              <input id="tech_changes"
                     type="text"
                     v-model="commitMsg.techChanges"
                     @blur="$v.commitMsg.techChanges.$touch()">
              <div class="validator red-text" v-if="$v.commitMsg.techChanges.$error">
                <p v-if="!$v.commitMsg.techChanges.required">Field is required!</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 m6 l6">
              <button
                v-if="$auth.can('can-manage-config-defaults')"
                class="btn waves-effect waves-light right"
                type="submit"
                name="action">
                Create</button>
            </div>
            <div class="input-field col s12 m6 l6">
              <a href="#!"
                @click="cancel"
                class="modal-close waves-effect waves-blue btn-flat left">Close</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';

export default {
  mounted() {
    this.$store.dispatch('cms/getModules', {
      with: JSON.stringify({
        submodules: {},
      }),
    });
    this.$M.Modal.init(this.$refs['config-add'], {
      dismissible: false,
      preventScrolling: false,
    }).open();
  },
  data() {
    return {
      name: '',
      variable: {},
      codixTeam: {},
      submodules: {
        options: [],
      },
      module: {},
      submodule: {},
      commitMsg: {
        ttsKey: '',
        techChanges: '',
        funcChanges: '',
      },
    };
  },
  validations: {
    name: {
      required,
      isUnique(value) {
        if (value === '') return true;
        return this.$store.getters['cms/variableNameIsUnique'](this.fullName);
      },
    },
    variable: {
      value: {
        required,
      },
      description: {
        required,
      },
    },
    codixTeam: {
      required,
    },
    module: {
      required,
    },
    submodule: {
      required,
    },
    commitMsg: {
      ttsKey: {
        required,
        validKey(value) {
          return /^[A-Z]+-[0-9]+$/.test(value);
        },
      },
      funcChanges: {
        required,
      },
      techChanges: {
        required,
      },
    },
  },
  computed: {
    getCodixTeams() {
      return this.$store.state.cms.codixTeams;
    },
    getModules() {
      return this.$store.state.cms.modules;
    },
    fullName() {
      let name = '';
      if (this.codixTeam.abbreviation) {
        name = `${this.codixTeam.abbreviation}_`;
        if (this.module.abbreviation) {
          name += `${this.module.abbreviation}_`;
          if (this.submodule.abbreviation) {
            name += `${this.submodule.abbreviation}_`;
            if (this.name) {
              name += this.name.toUpperCase();
            }
          }
        }
      }
      return name;
    },
  },
  methods: {
    cancel() {
      this.$M.Modal.init(this.$refs['config-add']).close();
      this.$emit('return', false);
    },
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.variable.codix_team_id = this.codixTeam.id;
      this.variable.name = this.fullName;

      const payload = {
        variable: this.variable,
        commitMsg: this.commitMsg,
      };
      const loader = this.$loading.show({ container: this.$refs['config-add'] });
      this.$store.dispatch('cms/submitVariable', payload).then(() => {
        loader.hide();
      });
      this.cancel();
    },
    selectedModule(value) {
      this.module = value;
      this.submodules.options = value.submodules;
      this.submodule = '';
    },
  },
};
</script>
