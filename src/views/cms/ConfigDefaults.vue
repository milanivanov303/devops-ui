<template>
  <div class="row">
    <div class="col s12">
      <div class="data-table">
        <div class="row">
          <h1 class="center-align col s12">Config Defaults</h1>
        </div>
        <Table
          :data="defaultVariables"
          sort-by="name"
          sort-dir="asc"
          @add="openAddEditVariableModal({}, 'create')"
          @edit="(row) => openAddEditVariableModal(row, 'edit')"
          :export-btn="false"
          :view-btn="false"
          :add-btn="$auth.can('can-manage-config-defaults')"
          :edit-btn="$auth.can('can-manage-config-defaults')"
          :delete-btn="false"
          :pagination="false"
          :perPage="5000"
        >
          <Column show="id" />
          <Column show="name" />
          <Column show="value" />
          <Column show="description" />
          <template v-slot:actions-before="{ row }">
            <a @click="openInterfacesModal(row)" class="right" title="Check Variable">
              <i class="material-icons">find_replace</i>
            </a>
          </template>
        </Table>

        <Modal
          v-if="showAddEditVariableModal"
          @close="closeAddEditVariableModal()"
          class="right-sheet">
          <template v-slot:header>
            <div v-if="action === 'create'">
              Create variable
            </div>
            <div v-else>
              Update {{selectedVariable.name}}
            </div>
          </template>
          <template v-slot:content>
            <form class=" col s12 l11">
              <!-- <div class="row">
                <Select
                  class="col s12"
                  label="Codix Team"
                  icon="business_center"
                  displayed="name"
                  v-model="selectedVariable.codix_team"
                  :options="codixTeams"
                  :class="{m4: action === 'create'}"
                />
                <Select
                  v-if="action === 'create'"
                  class="col s12 m4"
                  label="IMX Module"
                  icon="business_center"
                  displayed="name"
                  v-model="abbrev.imxModule"
                  :options="imxModules"
                  :class="{readonly: action === 'edit'}"
                />
                <Select
                  v-if="action === 'create'"
                  class="col s12 m4"
                  label="Submodule"
                  icon="business_center"
                  displayed="name"
                  v-model="abbrev.submodule"
                  :options="submodules"
                  :class="{readonly: action === 'edit'}"
                />
              </div> -->
              <div class="row">
                <!-- <div v-if="action === 'create'" class="input-field col s3">
                  <i class="material-icons prefix">label_outline</i>
                  <input
                    type="text"
                    id="abbrevName"
                    v-model="abbrevName"
                    :class="{readonly: action === 'edit'}">
                  <label :class="{active: abbrevName}" for="abbrevName">Abbrev</label>
                </div> -->
                <div class="input-field col s6"
                    :class="{invalid: $v.selectedVariable.name.$error}">
                  <i class="material-icons prefix">label_outline</i>
                  <input
                    type="text"
                    id="name"
                    @blur="$v.selectedVariable.name.$touch()"
                    v-model="selectedVariable.name"
                    :class="{readonly: action === 'edit'}">
                  <label :class="{active: selectedVariable.name}" for="name">Name</label>
                  <div class="validator col s12 offset-m1">
                    <div class="red-text" v-if="$v.selectedVariable.name.$error">
                      <p v-if="!$v.selectedVariable.name.required">
                        Name field must not be empty.
                      </p>
                      <p v-if="!$v.selectedVariable.name.isUnique">
                        The variable name already exists.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="input-field col s6"
                    :class="{invalid: $v.selectedVariable.value.$error}">
                  <input
                    type="text"
                    id="value"
                    @blur="$v.selectedVariable.value.$touch()"
                    v-model="selectedVariable.value"
                    :class="{readonly: action === 'edit'}">
                  <label :class="{active: selectedVariable.value}" for="value">Value</label>
                  <div class="validator col s12 offset-m1">
                    <div class="red-text" v-if="$v.selectedVariable.value.$error">
                      <p v-if="!$v.selectedVariable.value.required">
                        Value field must not be empty.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12"
                    :class="{invalid: $v.selectedVariable.description.$error}">
                  <i class="material-icons prefix">menu</i>
                  <input
                    type="text"
                    id="description"
                    @blur="$v.selectedVariable.description.$touch()"
                    v-model="selectedVariable.description">
                  <label :class="{active: selectedVariable.description}"
                         for="description">Description</label>
                </div>
                <div class="validator col s12 offset-m1">
                  <div class="red-text" v-if="$v.selectedVariable.description.$error">
                    <p v-if="!$v.selectedVariable.description.required">
                      Description field must not be empty.
                    </p>
                  </div>
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
                  <div class="validator col s12 offset-l1 offset-m1">
                    <div class="red-text" v-if="$v.commitMsg.ttsKey.$error">
                      <p v-if="!$v.commitMsg.ttsKey.required">Field is required!</p>
                      <!-- <p v-if="!$v.commitMsg.ttsKey.validKey">Not a valid TTS key.</p> -->
                    </div>
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
                      <div class="validator col s12 offset-l2 offset-m2">
                        <div class="red-text" v-if="$v.commitMsg.funcChanges.$error">
                          <p v-if="!$v.commitMsg.funcChanges.required">Field is required!</p>
                        </div>
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
                      <div class="validator col s12 offset-l2 offset-m2">
                        <div class="red-text" v-if="$v.commitMsg.techChanges.$error">
                          <p v-if="!$v.commitMsg.techChanges.required">Field is required!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </template>
          <template v-slot:footer>
            <button
              class="btn waves-effect waves-light"
              type="submit"
              name="action"
              @click="saveVariable()"
            >
              Save
            </button>
          </template>
        </Modal>

        <Modal v-if="showInterfacesModal"
               @close="closeInterfacesModal()"
               class="right-sheet"
               >
          <template v-slot:header>
            <div>Check variable <b>{{selectedVariable.name}}</b> in templates from instance</div>
          </template>
          <template v-slot:content>
            <form class="col s12 l11" ref="interfaces">
              <div class="row">
                <Select
                  class="col s12"
                  label="Instances"
                  icon="storage"
                  displayed="name"
                  :options="instances"
                  v-model="instance"
                  @change="checkInTemplates"
                />
              </div>
              <SwitchBox
                v-show="templates.options"
                class="switch-box"
                :request="templates"
              />
              <span v-if="error">{{error}}</span>
            </form>
          </template>
          <template v-slot:footer>
          </template>
        </Modal>

      </div>
    </div>
  </div>
</template>

<script>


import { required } from 'vuelidate/lib/validators';
import SwitchBox from '@/components/partials/SwitchBox';

export default {
  components: {
    SwitchBox,
  },
  data() {
    return {
      showAddEditVariableModal: false,
      showInterfacesModal: false,
      selectedVariable: {},
      action: '',
      error: '',
      // abbrev: {},
      instance: {},
      templates: {},
      commitMsg: {},
    };
  },
  validations() {
    const validations = {
      selectedVariable: {
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
      validations.selectedVariable.name = {
        isUnique() {
          if (this.selectedVariable.name === '') {
            return true;
          }
          // if (this.abbrevName) {
          //   return this.$store.getters['cms/variableNameIsUnique'](this.abbrevName
          //         .concat(this.selectedVariable.name));
          // }

          return this.$store.getters['cms/variableNameIsUnique'](this.selectedVariable.name);
        },
        required,
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
    defaultVariables() {
      return this.$store.state.cms.variables;
    },
    // codixTeams() {
    //   return this.$store.state.cms.codixTeams;
    // },
    // imxModules() {
    //   return this.$store.state.cms.modules;
    // },
    // submodules() {
    //   if (this.abbrev.imxModule) {
    //     return this.abbrev.imxModule.submodules || [];
    //   }
    //   return [];
    // },
    // abbrevName() {
    //   let abbrevName = '';
    //   if (this.selectedVariable.codix_team) {
    //     abbrevName = `${this.selectedVariable.codix_team.abbreviation}_`;
    //     if (this.abbrev.imxModule) {
    //       abbrevName += `${this.abbrev.imxModule.abbreviation}_`;
    //       if (this.abbrev.submodule) {
    //         abbrevName += `${this.abbrev.submodule.abbreviation}_`;
    //       }
    //     }
    //   }
    //   return abbrevName;
    // },

    instances() {
      return this.$store.state.mmpi.devInstances;
    },
  },

  methods: {
    openAddEditVariableModal(variable, action) {
      this.showAddEditVariableModal = true;
      this.selectedVariable = { ...variable };
      this.action = action;

      // if (this.selectedVariable.codix_team_id) {
      //   this.selectedVariable.codix_team = this.codixTeams.find(
      //     codixTeam => codixTeam.id === this.selectedVariable.codix_team_id,
      //   );
      // }
    },
    closeAddEditVariableModal() {
      this.showAddEditVariableModal = false;
      this.name = {};
      this.commitMsg = {};

      this.$v.$reset();
    },
    openInterfacesModal(variable) {
      this.showInterfacesModal = true;
      this.selectedVariable = { ...variable };
    },
    closeInterfacesModal() {
      this.showInterfacesModal = false;
      this.instance = {};
      this.templates = {};
      this.error = '';
    },


    getDefaultVariables() {
      const loader = this.$loading.show({ container: this.$el });

      this.$store.dispatch('cms/getVariables')
        .then(() => {
          loader.hide();
        });
      // this.$store.dispatch('cms/getCodixTeams');
    },
    // getInstances() {
    //   this.$store.dispatch('mmpi/getDevInstances');
    // },
    // getImxModules() {
    //   this.$store.dispatch('cms/getImxModules');
    // },

    saveVariable() {
      debugger;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const payload = {
        variable: this.selectedVariable,
      };

      // payload.variable.codix_team_id = this.selectedVariable.codix_team.id;

      if (this.action === 'create') {
        payload.commitMsg = this.commitMsg;
        // if (this.abbrevName) {
        //   payload.variable.name = this.abbrevName.concat(this.selectedVariable.name);
        // }
      }

      this.$store.dispatch('cms/submitVariable', payload)
        .then(() => {
          this.closeAddEditVariableModal();
          if (this.action === 'create') {
            this.$M.toast({ html: 'The variable is created!', classes: 'toast-seccess' });
            return;
          }
          this.$M.toast({ html: 'The variable has been updated!', classes: 'toast-seccess' });
        })
        .catch((error) => {
          this.error = error;
          return error;
        });
    },

    checkInTemplates(instance) {
      this.error = '';
      const loader = this.$loading.show({ container: this.$refs.interfaces });
      const payload = {
        instance: instance.host,
        instance_user: instance.user,
        param: this.selectedVariable.name,
        commands: [
          'list_template',
        ],
      };
      this.$store.dispatch('cms/checkVariableTemplates', payload)
        .then((response) => {
          loader.hide();
          this.templates = {
            header: `${this.selectedVariable.name} templates on ${instance.name}`,
            options: response.list_template,
          };

          if (response.list_template.length === 0) {
            this.error = `The variable does not exist in any tamplates on ${instance.name}`;
          }
        })
        .catch((error) => {
          loader.hide();
          this.templates = {};
          this.error = `${error}: Could not connect to ${instance.name}`;
        });
    },

  },

  mounted() {
    this.getDefaultVariables();
    // this.getInstances();
    // this.getImxModules();
  },
};
</script>
