<template>
  <Modal @close="$emit('close')" class="right-sheet">
    <template v-slot:header>
      <div v-if="action === 'update'">Edit {{ selected.name }} component</div>
      <div v-else>Add new iMX component</div>
    </template>
    <template v-slot:content>
      <Alert v-if="error" :msg="error"/>
      <form class="col s12 l11">
        <div class="row">
          <TextInput
            class="col s12"
            :class="{invalid: $v.selected.name.$error}"
            icon="title"
            label="Name"
            v-model="selected.name"
            @blur="$v.selected.name.$touch()"
          />
          <div class="validator col s12 offset-l1 offset-m1">
            <div class="red-text" v-if="$v.selected.name.$error">
              <p v-if="!$v.selected.name.required">Name field must not be empty.</p>
            </div>
          </div>
        </div>
        <div class="row">
          <TextInput
            class="col s12"
            :class="{invalid: $v.selected.name_key.$error}"
            icon="title"
            label="Name key"
            v-model="selected.name_key"
            @blur="$v.selected.name_key.$touch()"
          />
          <div class="validator col s12 offset-l1 offset-m1">
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
        <div class="row">
          <TextInput
            class="col s12"
            icon="laptop"
            label="URL"
            v-model="selected.url"
          />
        </div>
        <div class="row">
          <Select
            id="type"
            class="col s12"
            :class="{invalid: $v.selected.type.$error || selected.type === 'undefined'}"
            icon="list"
            label="Types"
            v-model="selected.type"
            :options="typeOptions"
            @blur="$v.selected.type.$touch()"
          />
          <div class="validator col s12 offset-l1 offset-m1">
            <div class="red-text" v-if="$v.selected.type.$error || selected.type === 'undefined'">
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
            id="maintenance_team"
            class="col s12"
            icon="person"
            label="Maintenance team"
            v-model="selected.maintenance_team"
            :options="teamOptions"
          />
        </div>
        <div v-if="selected.versions">
          <div class="row" v-for="version in selected.versions" :key="version.id">
            <TextInput
              class="col s12 l3 readonly"
              icon="linear_scale"
              label="Approved by Codix"
              v-model="version.approved"
            />
            <TextInput
              class="col s12 l3 readonly"
              icon="linear_scale"
              label="Version"
              v-model="version.version"
            />
            <div class="input-field col s12 l4">
              <i class="material-icons prefix">date_range</i>
              <datetime :input-id="'regular_eos_date_'.concat(version.version)"
                        input-class="datetime-input"
                        type="date"
                        v-model="version.regular_eos_date"
                        :min-datetime="dateNow"
                        class="datetime-theme"
                        format="dd-MM-yyyy"
                        :week-start="1"/>
              <label :class="{active: version.regular_eos_date}"
                     :for="'regular_eos_date_'.concat(version.version)">EOS date (regular)
              </label>
            </div>
            <div class="input-field col s12 l4">
              <i class="material-icons prefix">date_range</i>
              <datetime :input-id="'extended_eos_date'.concat(version.version)"
                        input-class="datetime-input"
                        type="date"
                        v-model="version.extended_eos_date"
                        :min-datetime="version.regular_eos_date || dateNow"
                        class="datetime-theme"
                        format="dd-MM-yyyy"
                        :week-start="1"/>
              <label :class="{active: version.extended_eos_date}"
                     :for="'extended_eos_date'.concat(version.version)">EOS date (extended)
              </label>
            </div>
            <div class="col s12 l1 right-align">
              <TooltipButton
                class="btn-floating btn-small red"
                icon="remove"
                @click="removeFromVersions(version)">
              </TooltipButton>
            </div>
          </div>
        </div>
        <div class="row">
          <Select
            class="col 12 l2"
            :multiple="false"
            label="Approved by Codix"
            :options="chooseOptions"
            v-model="newVersion.approved"
            @blur="$v.newVersion.approved.$touch()"
          />
          <TextInput
            class="col s12 l2"
            :class="{invalid: !$v.newVersion.version.versionValidator}"
            icon="linear_scale"
            label="Version"
            v-model="newVersion.version"
            @blur="$v.newVersion.version.$touch()"
          />
          <div class="input-field col s12 l3">
            <i class="material-icons prefix">date_range</i>
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
            <div class="input-field col s12 l4">
            <i class="material-icons prefix">date_range</i>
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
            <div class="col s12 l1 right-align" v-if="newVersion.version">
            <TooltipButton
              class="btn-floating btn-small"
              icon="add"
              @click="addToVersions()">
            </TooltipButton>
            </div>
            </div>
        <div class="row">
          <div class="validator col s12 offset-l1 offset-m1">
            <div class="red-text" v-if="!$v.newVersion.version.versionValidator">
              <p v-if="!$v.newVersion.version.versionValidator">
                Invalid version format!
              </p>
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
        @click="save()"
      >
        Save
      </button>
    </template>
  </Modal>
</template>

<script>
import { DateTime } from 'luxon';
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
      selected: this.component,
      newVersion: {
        approved: null,
      },
      dateNow: DateTime.local().toISO(),
      teamOptions: ['SA'],
      typeOptions: ['OS', 'DB', 'SDK', 'Library', 'Cross-platform software'],
      error: null,
      chooseOptions: ['Yes', 'No'],
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
  methods: {
    save() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
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
};

</script>
