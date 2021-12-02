<template>
  <Modal
    @close="$emit('close')"
    class="right-sheet">
    <template v-slot:header>
      <div v-if="action === 'edit'"><span>Edit iMX component</span></div>
      <div v-else><span>Add new iMX component</span></div>
    </template>
    <template v-slot:content>
      <Alert v-if="error" :msg="error"/>
      <form class="col s12 l11">

        <div class="row">
          <div class="input-field col s12" :class="{invalid: $v.name.$error}">
            <i class="material-icons prefix">title</i>
            <input
              type="text"
              id="name"
              @blur="$v.name.$touch()"
              v-model="name">
            <label :class="{active: name}" for="name">
              Name (if needed use snake case e.g. component_name)
            </label>
          </div>
          <div class="validator col s12 offset-l1 offset-m1">
            <div class="red-text" v-if="$v.name.$error">
              <p v-if="!$v.name.required">Name field must not be empty.</p>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="input-field col s12">
            <i class="material-icons prefix">laptop</i>
            <input
              type="text"
              id="intranet_command"
              name="intranet_command"
              v-model="intranetCommand">
            <label :class="{active: intranetCommand}" for="intranet_command">
              Intranet command
            </label>
          </div>
        </div>

        <div class="row">
          <div class="input-field col s12">
            <i class="material-icons prefix">laptop</i>
            <input
              type="text"
              id="extranet_command"
              name="extranet_command"
              v-model="extranetCommand">
            <label :class="{active: extranetCommand}"
                   for="extranet_command">
              Extranet command
            </label>
          </div>
        </div>

        <div class="row">
          <Select id="maintenance_team"
                  class="col s12"
                  icon="person"
                  v-model="maintenanceTeam"
                  :options="teamOptions"
          />
          <label :class="{active: maintenanceTeam}"
                 class="col offset-s1"
                 for="maintenance_team">
            Maintenance team
          </label>
        </div>

        <div class="row">
          <div v-if="versions" class="col s12 l12">
            <p><b>Versions:</b></p>
          </div>
        </div>

        <div class="row">
          <div v-if="versions" class="data-table col s12 l12">
            <table>
              <thead>
                <tr>
                  <th>Version</th>
                  <th>End of support date (regular)</th>
                  <th>End of support date (extended)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(version, index) in versions" :key="index">
                  <td>
                    <span v-if="version.version">
                      {{ version.version }}
                    </span>
                  </td>
                  <td>
                    <span v-if="version.regular_eos_date">
                      {{ $date(version.regular_eos_date).toHuman('dd-MM-yyyy') }}
                    </span>
                  </td>
                  <td>
                    <span v-if="version.extended_eos_date">
                      {{ $date(version.extended_eos_date).toHuman('dd-MM-yyyy') }}
                    </span>
                  </td>
                  <td>
                    <a class="btn-floating btn-large waves-effect btn-small red"
                       data-tooltip="Remove version"
                       @click="removeFromVersions(index)">
                      <i class="material-icons">remove</i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="row">
          <div class="col s12 l12">
            <p><b>Add new version</b></p>
          </div>
        </div>

        <div class="row">
          <div class="col s12 l2 center-align">
            <i class="material-icons prefix">linear_scale</i>
            <input
              type="text"
              id="version"
              v-model="version"
              name="version">
            <span class="center-align">
              <label :class="{active: version}"
                   for="version">
                Version
              </label>
            </span>
          </div>

          <div class="col s12 l4 center-align">
            <i class="material-icons prefix">date_range</i>
            <datetime input-id="regular_eos_date"
                      id="regular_eos_date"
                      input-class="datetime-input"
                      v-model="regular_eos_date"
                      type="date"
                      class="datetime-theme"
                      format="dd-MM-yyyy"
                      :week-start="1"/>
            <label :class="{active: regular_eos_date}"
                   for="regular_eos_date">EOS date (regular)
            </label>
          </div>

          <div class="col s12 l4 center-align">
            <i class="material-icons prefix">date_range</i>
            <datetime input-id="regular_eos_date"
                      id="extended_eos_date"
                      v-model="extended_eos_date"
                      input-class="datetime-input"
                      type="date"
                      class="datetime-theme"
                      format="dd-MM-yyyy"
                      :week-start="1"/>
            <label :class="{active: extended_eos_date}"
                   for="extended_eos_date">EOS date (extended)
            </label>
          </div>

          <div class="col s12 l2 right-align">
            <a class="btn-floating btn-large waves-effect btn-medium"
               data-tooltip="Add version"
               @click="addToVersions()">
            <i class="material-icons">add</i>
            </a>
          </div>
        </div>

        <div class="row">
          <div class="validator col s12">
            <div class="red-text" v-if="versionError">
              <p>Version must not be empty.</p>
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
        @click="actionButtonCall(action)"
      >
        {{ action }}
      </button>
    </template>
  </Modal>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { Datetime } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css';

export default {

  components: {
    datetime: Datetime,
  },

  props: {
    imxComponent: {
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
      name: this.imxComponent.name ? this.imxComponent.name : null,
      intranetCommand:
        this.imxComponent.intranet_command ? this.imxComponent.intranet_command : null,
      extranetCommand:
        this.imxComponent.extranet_command ? this.imxComponent.extranet_command : null,
      maintenanceTeam:
        this.imxComponent.maintenance_team ? this.imxComponent.maintenance_team : null,
      versions: this.imxComponent.versions ? this.imxComponent.versions : null,
      version: null,
      regular_eos_date: null,
      extended_eos_date: null,
      error: null,
      versionError: false,
      teamOptions: ['SA'],
    };
  },

  validations: {
    name: {
      required,
    },
  },

  methods: {
    actionButtonCall(funcName) {
      this[funcName]();
    },

    save() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const payload = {
        name: this.name ? this.name : null,
        maintenance_team: this.maintenanceTeam ? this.maintenanceTeam : null,
        intranet_command: this.intranetCommand ? this.intranetCommand : null,
        extranet_command: this.extranetCommand ? this.extranetCommand : null,
        versions: this.versions ? this.versions : null,
      };

      this.$store.dispatch('esxi/createImxComponent', payload)
        .then(() => {
          this.$emit('close');
          this.$M.toast({ html: 'iMX component has been created!', classes: 'toast-seccess' });
        })
        .catch((error) => {
          this.error = error;
        });
    },

    edit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const payload = {
        id: this.imxComponent.id ? this.imxComponent.id : null,
        name: this.name ? this.name : null,
        maintenance_team: this.maintenanceTeam ? this.maintenanceTeam : null,
        intranet_command: this.intranetCommand ? this.intranetCommand : null,
        extranet_command: this.extranetCommand ? this.extranetCommand : null,
        versions: this.versions ? this.versions : null,
      };

      this.$store.dispatch('esxi/updateImxComponent', payload)
        .then(() => {
          this.$emit('close');
          this.$M.toast({ html: 'iMX component has been updated!', classes: 'toast-seccess' });
        })
        .catch((error) => {
          this.error = error;
        });
    },

    addToVersions() {
      if (!this.version) {
        this.versionError = true;
        return;
      }

      if (this.versions === null) {
        this.versions = [];
      }

      this.versions.push({
        version: this.version,
        regular_eos_date: this.regular_eos_date,
        extended_eos_date: this.extended_eos_date,
      });

      this.version = null;
      this.regular_eos_date = null;
      this.extended_eos_date = null;
      this.versionError = false;
    },

    removeFromVersions(index) {
      this.versions.splice(index, 1);

      if (this.versions.length === 0) {
        this.versions = null;
      }
    },
  },

  updated() {
    this.$M.Tooltip.init(this.$el.querySelectorAll('[data-tooltip]'));
  },

};

</script>
