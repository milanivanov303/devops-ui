<template>
  <Modal
    @close="closeModal('create-variable-modal')"
    class="right-sheet">
    <template v-slot:header>
      <div v-if="action === 'create'">
        Create variable
      </div>
      <div v-else>
        Update {{variable.name}}
      </div>
    </template>
    <template v-slot:content>
      <Alert v-if="error" :msg="error"/>
      <br>
      <form class=" col s12 l11" ref="config-add">
        <div class="row" v-if="action === 'create'">
          <div class="col s12 m4">
            <Select
              label="Codix Team"
              icon="people"
              displayed="name"
              v-model="variable.codix_team"
              :options="codixTeams"
              :invalid="$v.variable.codix_team.$error"
              :class="{readonly: action === 'edit'}"
            />
            <div
              class="col s12 offset-s2 validator red-text"
              v-if="$v.variable.codix_team.$error">
              <p v-if="!$v.variable.codix_team.required">Team must not be empty.</p>
            </div>
          </div>
          <div class="col s12 m4">
            <Select
              label="IMX Module"
              icon="memory"
              displayed="name"
              v-model="abbrev.imxModule"
              :options="imxModules"
              :invalid="$v.abbrev.imxModule.$error"
              :class="{readonly: action === 'edit'}"
            />
            <div
              class="col s12 offset-s2 validator red-text"
              v-if="$v.abbrev.imxModule.$error">
              <p v-if="!$v.abbrev.imxModule.required">iMX module must not be empty.</p>
            </div>
          </div>
          <div class="col s12 m4">
            <Select
              label="Submodule"
              icon="settings_input_composite"
              displayed="name"
              v-model="abbrev.submodule"
              :options="submodules"
              :invalid="$v.abbrev.submodule.$error"
              :class="{readonly: action === 'edit'}"
            />
            <div
              class="col s12 offset-s2 validator red-text"
              v-if="$v.abbrev.submodule.$error">
              <p v-if="!$v.abbrev.submodule.required">Submodule must not be empty.</p>
            </div>
          </div>
        </div>
        <div class="row">
          <div v-if="action === 'create'" class="input-field col s3">
            <i class="material-icons prefix">label_outline</i>
            <input
              readonly
              type="text"
              id="abbrevName"
              v-model="abbrevName"
              :class="{readonly: action === 'edit'}">
            <label :class="{active: abbrevName}" for="abbrevName">Abbrev</label>
          </div>
          <div class="input-field col s5"
              :class="{
                m6: action === 'edit',
                invalid: $v.variable.name.$error
              }">
            <i class="material-icons prefix">label_outline</i>
            <input
              type="text"
              id="name"
              @blur="$v.variable.name.$touch()"
              v-model="variable.name"
              :class="{readonly: action === 'edit'}">
            <label :class="{active: variable.name}" for="name">Name</label>
            <div
              class="col s12 offset-s2 validator red-text"
              v-if="$v.variable.name.$error">
              <p v-if="!$v.variable.name.required">
                Name field must not be empty.
              </p>
              <p v-if="!$v.variable.name.isUnique">
                The variable name already exists.
              </p>
            </div>
          </div>
          <div class="input-field col s4"
              :class="{
                m6: action === 'edit',
                invalid: $v.variable.value.$error
              }">
            <input
              type="text"
              id="value"
              @blur="$v.variable.value.$touch()"
              v-model="variable.value"
              :class="{
                s6: action === 'edit',
                readonly: action === 'edit'
              }">
            <label :class="{active: variable.value}" for="value">Default Value</label>
            <div
              class="col s12 validator red-text"
              v-if="$v.variable.value.$error">
              <p v-if="!$v.variable.value.required">
                Value field must not be empty.
              </p>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12"
              :class="{invalid: $v.variable.description.$error}">
            <i class="material-icons prefix">menu</i>
            <input
              type="text"
              id="description"
              @blur="$v.variable.description.$touch()"
              v-model="variable.description">
            <label :class="{active: variable.description}"
                    for="description">Description</label>
          </div>
          <div
            class="col s12 offset-s1 red-text validator"
            v-if="$v.variable.description.$error">
            <p v-if="!$v.variable.description.required">
              Description field must not be empty.
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col s12">
            <label>
              <input
                class="filled-in"
                type="checkbox"
                v-model="variable.sensitive_data"
                :disabled="action === 'edit'"/>
              <span>Contains sensitive data</span>
            </label>
          </div>
        </div>
        <div v-if="action === 'create'">
          <h6 class="center">COMMIT MESSAGE</h6>
          <div class="row">
            <div class="input-field col s12"
                :class="{invalid: $v.commitMsg.ttsKey.$error}">
              <i class="material-icons prefix">label_outline</i>
              <input id="tts_key"
                      type="text"
                      v-model="commitMsg.ttsKey"
                      @blur="$v.commitMsg.ttsKey.$touch()">
              <label :class="{active: commitMsg.ttsKey}" for="tts_key">TTS Key</label>
            </div>
            <div
              class="col s12 offset-s1 red-text validator"
              v-if="$v.commitMsg.ttsKey.$error">
              <p v-if="!$v.commitMsg.ttsKey.required">Field is required!</p>
              <p v-if="!$v.commitMsg.ttsKey.validKey">Not a valid TTS key.</p>
            </div>
          </div>
          <div class="row">
            <div class="col s6">
              <div class="row">
                <div class="input-field col s12"
                    :class="{invalid: $v.commitMsg.funcChanges.$error}">
                  <i class="material-icons prefix">label_outline</i>
                  <input id="func_changes"
                        type="text"
                        v-model="commitMsg.funcChanges"
                        @blur="$v.commitMsg.funcChanges.$touch()">
                  <label for="func_changes"
                          :class="{active: commitMsg.funcChanges}">Func Changes</label>
                </div>
                <div
                  class="col s12 offset-s2 red-text validator"
                  v-if="$v.commitMsg.funcChanges.$error">
                  <p v-if="!$v.commitMsg.funcChanges.required">Field is required!</p>
                </div>
              </div>
            </div>
            <div class="col s6">
              <div class="row">
                <div class="input-field col s12"
                    :class="{invalid: $v.commitMsg.techChanges.$error}">
                  <i class="material-icons prefix">label_outline</i>
                  <input id="tech_changes"
                        type="text"
                        v-model="commitMsg.techChanges"
                        @blur="$v.commitMsg.techChanges.$touch()">
                  <label for="tech_changes"
                          :class="{active: commitMsg.techChanges}">Tech Changes</label>
                </div>
                <div
                  class="col s12 offset-s2 validator red-text"
                  v-if="$v.commitMsg.techChanges.$error">
                  <p v-if="!$v.commitMsg.techChanges.required">Field is required!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </template>
    <template v-if="!loading" v-slot:footer>
      <button
        class="btn waves-effect waves-light"
        type="button"
        name="action"
        @click="saveVariable()">
        Save
      </button>
    </template>
  </Modal>
</template>
<script>
import { required } from 'vuelidate/lib/validators';

export default {
  props: {
    selectedVariable: {
      type: Object,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    issue: {
      type: String,
    },
    msg: {
      type: String,
    },
  },
  data() {
    return {
      error: this.msg || '',
      name: '',
      loading: false,
      codixTeam: {},
      module: {},
      commitMsg: {
        ttsKey: this.issue,
        techChanges: '',
        funcChanges: '',
      },
      abbrev: {
        imxModule: '',
        submodule: '',
      },
      variable: { ...this.selectedVariable },
    };
  },
  validations() {
    const validations = {
      variable: {
        name: {
          required,
        },
        value: {
          required,
        },
        description: {
          required,
        },
      },
    };

    if (this.action === 'create') {
      validations.variable = {
        name: {
          isUnique() {
            if (this.variable.name === '') {
              return true;
            }
            if (this.abbrevName) {
              return this.$store.getters['cms/variableNameIsUnique'](this.abbrevName
                .concat(this.variable.name));
            }

            return this.$store.getters['cms/variableNameIsUnique'](this.variable.name);
          },
          required,
        },
        codix_team: {
          required,
        },
        value: {
          required,
        },
        description: {
          required,
        },
      };

      validations.abbrev = {
        imxModule: {
          required,
        },
        submodule: {
          required,
        },
      };

      validations.commitMsg = {
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
      };
    }

    return validations;
  },
  computed: {
    codixTeams() {
      return this.$store.state.cms.codixTeams;
    },
    imxModules() {
      return this.$store.state.cms.modules;
    },
    submodules() {
      if (this.abbrev.imxModule) {
        return this.abbrev.imxModule.submodules || [];
      }
      return [];
    },
    abbrevName() {
      let abbrevName = '';
      if (this.variable.codix_team) {
        abbrevName = `${this.variable.codix_team.abbreviation}_`;
        if (this.abbrev.imxModule) {
          abbrevName += `${this.abbrev.imxModule.abbreviation}_`;
          if (this.abbrev.submodule) {
            abbrevName += `${this.abbrev.submodule.abbreviation}_`;
          }
        }
      }
      return abbrevName;
    },
  },
  methods: {
    closeModal() {
      this.name = {};
      this.commitMsg = {
        ttsKey: '',
        techChanges: '',
        funcChanges: '',
      };
      this.error = '';
      this.$v.$reset();
      this.$emit('close');
    },
    saveVariable() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      this.variable.codix_team_id = this.codixTeam.id;
      this.variable.sensitive_data = this.variable.sensitive_data ? 1 : 0;

      const payload = {
        variable: this.variable,
      };

      if (this.action === 'create') {
        payload.commitMsg = this.commitMsg;
        if (this.abbrevName) {
          payload.variable.name = this.abbrevName.concat(this.variable.name).toUpperCase();
        }
      }
      this.loading = true;
      this.$store.dispatch('cms/submitVariable', payload)
        .then((response) => {
          let html = 'The variable has been updated!';
          if (this.action === 'create') {
            html = 'The variable is created!';
          }
          this.$M.toast({ html, classes: 'toast-success' });
          this.closeModal();
          return this.$emit('addedVariable', response.data);
        })
        .catch((error) => {
          payload.variable.name = this.variable.name;
          if (error.response.status === 403) {
            this.error = 'Sorry, but you have no rights to create new variable!';
          }
          if (error.response.status === 422) {
            this.error = 'Sorry, but variable name are already registered!';
          }
          return this.$emit('error', error.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  created() {
    this.$store.dispatch('cms/getCodixTeams');
    this.$store.dispatch('cms/getImxModules');
  },
};
</script>
