<template>
  <Modal @close="$emit('close')">
    <template v-slot:header>
      <div v-if="action === 'update'">Edit {{ selected.name }} component</div>
      <div v-else>Add new iMX component</div>
    </template>
    <template v-slot:content>
      <div class="row">
        <Alert v-if="error" :msg="error"/>
        <form class="col s12">
          <fieldset>
            <legend>Main details</legend>
            <div class="row">
              <div class="col s12 m6">
                <TextInput
                  :class="{invalid: $v.selected.name.$error}"
                  icon="title"
                  label="Name"
                  v-model="selected.name"
                  @blur="$v.selected.name.$touch()"
                />
                <div class="validator">
                  <div class="red-text" v-if="$v.selected.name.$error">
                    <p v-if="!$v.selected.name.required">Name field must not be empty.</p>
                  </div>
                </div>
              </div>
              <div class="col s12 m6">
                <TextInput
                  class="col s12"
                  :class="{invalid: $v.selected.name_key.$error}"
                  label="Name key"
                  v-model="selected.name_key"
                  @blur="$v.selected.name_key.$touch()"
                />
                <div class="validator">
                  <div class="red-text" v-if="$v.selected.name_key.$error">
                    <p v-if="!$v.selected.name_key.required">
                      Name key field must not be empty.
                    </p>
                    <p v-if="!$v.selected.name_key.keyValidator">
                      Name key must contain maximum 30 characters.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <TextInput
                class="col s12"
                icon="laptop"
                label="URL"
                v-model="selected.url"
              />
            </div>
            <div class="row">
              <Autocomplete
                id="type"
                class="col s12"
                :class="{invalid: $v.selected.type.$error}"
                icon="list"
                label="Type"
                v-model="selected.type"
                :items="typeOptions"
                @blur="$v.selected.type.$touch()"
              />
              <div class="validator col s12 offset-l1 offset-m1">
                <div class="red-text"
                     v-if="$v.selected.type.$error || selected.type === 'undefined'">
                  <p>Type field must not be empty.</p>
                </div>
              </div>
            </div>
            <div class="row">
              <TextInput
                class="col s12"
                icon="settings_ethernet"
                label="Intranet command"
                v-model="selected.intranet_command"
              />
            </div>
            <div class="row">
              <TextInput
                class="col s12"
                icon="code"
                label="Extranet command"
                v-model="selected.extranet_command"
              />
            </div>
            <div class="row">
              <Select
                class="col s12 m6"
                icon="person"
                label="Maintenance team"
                v-model="selectedTeam"
                :options="teamOptions"
              />
              <Select
                class="col s12 m6"
                icon="person"
                label="Email address"
                v-model="selectedEmail"
                :options="savedEmails"
              />
            </div>
          </fieldset>
          <fieldset v-if="selected.versions">
            <legend>Versions</legend>
            <div class="row" v-for="version in selected.versions" :key="version.id">
              <TextInput
                class="col s12 m6 l1"
                label="Version"
                v-model="version.version"
              />
              <TextInput
                class="col s12 m6 l2"
                label="Version Type"
                v-model="version.version_type"
              />
              <div class="input-field col s12 m6 l2">
                <datetime :input-id="'regular_eos_date_'.concat(version.version)"
                          input-class="datetime-input"
                          type="date"
                          v-model="version.regular_eos_date"
                          class="datetime-theme"
                          format="dd-MM-yyyy"
                          :week-start="1"/>
                <label :class="{active: version.regular_eos_date}"
                       :for="'regular_eos_date_'.concat(version.version)">EOS date (regular)
                </label>
              </div>
              <div class="input-field col s12 m6 l2">
                <datetime :input-id="'extended_eos_date'.concat(version.version)"
                          input-class="datetime-input"
                          type="date"
                          v-model="version.extended_eos_date"
                          class="datetime-theme"
                          format="dd-MM-yyyy"
                          :week-start="1"/>
                <label :class="{active: version.extended_eos_date}"
                       :for="'extended_eos_date'.concat(version.version)">EOS date (extended)
                </label>
              </div>
              <Select
                  class="col s12 m6 l2"
                  label="Approved by Codix"
                  v-model="version.approved"
                  defaultOptionText="Choose option"
                  :options="['Yes', 'No', 'In progress']"
              />
              <Select
                  class="col s12 m6 l2"
                  label="Security validated"
                  v-model="version.secured"
                  defaultOptionText="Choose option"
                  :options="['Yes', 'No']"
              />
              <div class="col s12 l1 right-align">
                <TooltipButton
                    class="red btn-floating btn-small"
                    icon="remove"
                    @click="removeFromVersions(version)"
                    style="margin-top: 5px;"
                />
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Add new version</legend>
            <div class="row">
              <TextInput
                class="col s12 l1"
                :class="{invalid: !$v.newVersion.version.versionValidator}"
                label="Version"
                v-model="newVersion.version"
                @blur="$v.newVersion.version.$touch()"
              />
              <TextInput
                class="col s12 l2"
                label="Version Type"
                v-model="newVersion.version_type"
              />
              <div class="input-field col s12 l2">
                <datetime input-id="regular_eos_date"
                          input-class="datetime-input"
                          type="date"
                          v-model="newVersion.regular_eos_date"
                          class="datetime-theme"
                          format="dd-MM-yyyy"
                          :week-start="1"/>
                <label :class="{active: newVersion.regular_eos_date}"
                       for="regular_eos_date">EOS date (regular)
                </label>
              </div>
              <div class="input-field col s12 l2">
                <datetime input-id="extended_eos_date"
                          input-class="datetime-input"
                          type="date"
                          v-model="newVersion.extended_eos_date"
                          class="datetime-theme"
                          format="dd-MM-yyyy"
                          :week-start="1"/>
                <label :class="{active: newVersion.extended_eos_date}"
                       for="extended_eos_date">EOS date (extended)
                </label>
              </div>
              <Select
                  class="col s12 l2"
                  label="Approved by Codix"
                  v-model="newVersion.approved"
                  defaultOptionText="Choose option"
                  :options="['Yes', 'No', 'In progress']"
              />
              <Select
                  class="col s12 l2"
                  label="Security validated"
                  v-model="newVersion.secured"
                  defaultOptionText="Choose option"
                  :options="['Yes', 'No']"
              />
              <div class="col s12 l1 right-align">
                <TooltipButton
                  :class="{'readonly': !newVersion.version}"
                  tooltip="Add"
                  class="btn-floating btn-small"
                  icon="add"
                  @click="addToVersions()"
                  style="margin-top: 5px;"
                />
              </div>
              <div class="validator col s12 offset-l1 offset-m1">
                <div class="red-text" v-if="!$v.newVersion.version.versionValidator">
                  <p v-if="!$v.newVersion.version.versionValidator">
                    Invalid version format!
                  </p>
                </div>
              </div>
            </div>
            <span>
              NOTE: Please, make sure to include the new version to the list above before saving
            </span>
          </fieldset>
        </form>
      </div>
    </template>
    <template v-slot:footer>
      <button
        class="btn waves-effect waves-light"
        type="submit"
        name="action"
        @click="save()"
      >
        Save
      </button>
    </template>
  </Modal>
</template>

<script>
import { Datetime } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css';

import { required, helpers } from 'vuelidate/lib/validators';

const versionValidator = helpers.regex('versionValidator', /^\d+(\.\d+)*$/);
const keyValidator = helpers.regex('keyValidator', /^(?=^[a-zA-Z]+(?:_[a-zA-Z]+)*)\w{1,30}?$/);

const TooltipButton = () => import('@/components/partials/TooltipButton');

export default {
  components: {
    datetime: Datetime,
    TooltipButton,
  },

  props: {
    component: {
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
      selected: { ...this.component },
      selectedTeam: this.component.maintenance_team ? this.component.maintenance_team.name : '',
      selectedEmail: this.component.maintenance_team ? this.component.maintenance_team.email_address : '',
      newVersion: {},
      teamOptions: ['SA', 'DevOps', 'IMX V9'],
      typeOptions: [
        { name: 'OS' },
        { name: 'DB' },
        { name: 'SDK' },
        { name: 'Library' },
        { name: 'Cross-platform software' },
      ],
      error: null,
    };
  },
  validations: {
    selected: {
      name: {
        required,
      },
      name_key: {
        keyValidator, required,
      },
      type: {
        required,
      },
    },
    newVersion: {
      version: {
        versionValidator,
      },
    },
  },

  computed: {
    savedEmails() {
      return this.$store.state.esxi.savedEmails.map((email) => `${email.name}:${email.email_address}`);
    },
    sortedVersions() {
      return this.component.versions.slice()
        .sort((a, b) => a.version.localeCompare(b.version, undefined, { numeric: true }));
    },
  },

  methods: {
    save() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      this.selected.type = this.selected.type.name;

      if (this.selectedTeam || this.selectedEmail) {
        this.selected.maintenance_team = {
          name: this.selectedTeam || '',
          email_address: this.selectedEmail ? this.selectedEmail.split(':')[1] || '' : '',
        };
      }

      this.$store.dispatch(`esxi/${this.action}ImxComponent`, this.selected)
        .then(() => {
          this.$emit('close');
          this.$M.toast({ html: `The iMX component has been ${this.action}d!`, classes: 'toast-success' });
        })
        .catch((error) => {
          this.error = error;
        });
    },

    addToVersions() {
      if (!this.$v.newVersion.version.versionValidator) {
        return;
      }

      if (!this.checkVersions()) {
        return;
      }

      if (!this.selected.versions) {
        this.selected.versions = [];
      }
      this.selected.versions.push(this.newVersion);
      this.newVersion = {};
    },
    removeFromVersions(version) {
      const idx = this.selected.versions.findIndex((v) => v.version === version.version);
      this.selected.versions.splice(idx, 1);
    },
    checkVersions() {
      const splitVersion = this.newVersion.version.split('.');

      if ((this.newVersion.approved === 'Yes' || this.newVersion.approved === null)
        && splitVersion.length > 2) {
        this.$M.toast({ html: 'Please type main version!', classes: 'toast-fail' });
        return false;
      }
      return true;
    },
  },

  created() {
    this.$store.dispatch('esxi/getSavedEmails');
    if (this.selected.type) {
      this.selected.type = { name: this.selected.type };
    }
  },
};

</script>
<style scooped>
label {
  font-size: 13px !important;
}
.input-field > label:not(.label-icon).active {
  transform: translateY(-7px) scale(1) !important;
}
.readonly {
  background-color: #CBCBCB;
}
.datetime-input {
  max-width: 100% !important;
}
.modal-content {
  overflow-x: hidden;
}
</style>
