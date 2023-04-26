<template>
  <Modal class="right-sheet" @close="$emit('close')">
    <template v-slot:header>
      <span v-if="action === 'create'">Request new instance</span>
      <span v-if="action === 'update'">Edit instance</span>
    </template>
    <template v-slot:content>
      <Alert v-if="error" :msg="error"/>
      <form class="col s12 l11">
        <fieldset>
          <legend>Select project</legend>
          <div class="row">
            <div class="col s12">
              <Autocomplete
                label="Project"
                :items="projects"
                v-model="selected.project"
                :invalid="$v.selected.project.$error"
                @change="delete selected.delivery_chain"
                @blur="$v.selected.project.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.project.$error">
                  <p v-if="!$v.selected.project.required">Project field must not be empty.</p>
                </div>
              </div>
            </div>
          </div>
          <div v-if="selected.project">
            <div class="row">
              <div class="col s12 m6">
                <TextInput
                  class="readonly"
                  label="Instance Owner"
                  v-model="selected.project.project_type.value"
                />
              </div>
              <div class="col s12 m6">
                <TextInput
                  class="readonly"
                  label="Client business area"
                  :value="getProjectBusinessArea(selected.project)"
                />
              </div>
            </div>
            <div class="row">
              <div class="col s12 m6">
                <TextInput
                  class="readonly"
                  label="iMX Business Activity"
                  :value="getProjectBusinessActivity(selected.project)"
                />
              </div>
              <div class="col s12 m6">
                <TextInput
                  class="readonly"
                  label="Business Activity Domain Template"
                  :value="selected.project.pnp_type"
                />
              </div>
            </div>
            <div class="row">
              <div class="col s12 m4">
                <TextInput
                  class="readonly"
                  label="Client specific dir"
                  :value="selected.project.clnt_cvs_dir"
                />
              </div>
              <div class="col s12 m4">
                <TextInput
                  class="readonly"
                  label="Client Code (s)"
                  :value="selected.project.clnt_code"
                />
              </div>
              <div class="col s12 m4">
                <TextInput
                  class="readonly"
                  label="Specific Client"
                  value="/G_ETUDE.GETDCLI/"
                />
              </div>
            </div>
          </div>
        </fieldset>
        <fieldset v-if="selected.project">
          <legend>Main requirements</legend>
          <div class="row">
            <div class="col s12 m6">
              <Autocomplete
                  label="Delivery chain"
                  valueKey="title"
                  :items="projectDeliveryChains"
                  v-model="selected.delivery_chain"
                  @change="delete selected.dc_role"
              />
            </div>
            <div class="col s12 m6">
              <Autocomplete
                  label="Delivery chain role"
                  :items="deliveryChainRoles"
                  valueKey="value"
                  v-model="selected.dc_role"
              />
            </div>
          </div>
          <div class="row">
            <div class="col s12 m6">
              <Autocomplete
                  label="Instance type"
                  :items="instanceTypes"
                  v-model="selected.instance_type"
              />
            </div>
            <div class="col s12 m6">
              <Autocomplete
                  label="Purpose (Environment type)"
                  :items="environmentTypes"
                  valueKey="title"
                  v-model="selected.environment_type"
              />
            </div>
          </div>
        </fieldset>
        <fieldset v-if="selected.project">
          <legend>Additional requirements</legend>
          <div class="row">
            <div class="col s12 m6">
              <Autocomplete
                label="Server Hosted"
                :items="[{ name: 'Codix Premises' }, { name: 'Oracle Cloud'}]"
                v-model="selected.server_hosted"
              />
            </div>
            <div class="col s12 m6">
              <Autocomplete
                label="Type of Instance Request"
                v-model="selected.type"
                :items="[
                  { name: 'Standard PnP (from Stable PnP with refresh from iMX REFBG2)' },
                  { name: 'Standard PnP (from Stable PnP without refresh from iMX REFBG2)'},
                  { name:
                    'Custom (clone from already existing instance with refresh from REFBG2)' },
                  { name:
                    'Custom (clone from already existing instance without refresh from REFBG2)'}
                ]"
              />
            </div>
          </div>
          <div class="row">
            <div class="col s12 m4">
              <Autocomplete
                label="OS Platform (Hardware)"
                :items="osPlatforms"
                v-model="selected.os"
              />
            </div>
            <div class="col s12 m4">
              <TextInput
                label="Oracle Fusion Middleware version"
                v-model="selected.oracle_middleware"
              />
            </div>
            <div class="col s12 m4">
              <Autocomplete
                  label="Oracle DB version"
                  :items="dbVersions"
                  valueKey="version"
                  v-model="selected.oracle_version"
              />
            </div>
          </div>
          <div class="row">
            <div class="col s12 m4">
              <span>Intranet Application version</span>
              <p>
                <label>
                  <input
                    class="with-gap" name="intranet" type="radio"
                    v-model="selected.intranet_version"/>
                  <span>iMX v8</span>
                </label>
              </p>
              <p>
                <label>
                  <input
                    class="with-gap" name="intranet" type="radio"
                    v-model="selected.intranet_version"/>
                  <span>iMX v9</span>
                </label>
              </p>
              <p>
                <label>
                  <input
                    class="with-gap" name="intranet" type="radio"
                    v-model="selected.intranet_version"/>
                  <span>iMX v10</span>
                </label>
              </p>
            </div>
            <div class="col s12 m4">
              <span>Extranet build version</span>
              <p>
                <label>
                  <input
                    class="with-gap" name="extranet" type="radio"
                    v-model="selected.extranet_version"/>
                  <span>XNET2</span>
                </label>
              </p>
              <p>
                <label>
                  <input
                    class="with-gap" name="extranet" type="radio"
                    v-model="selected.extranet_version"/>
                  <span>XNET3</span>
                </label>
              </p>
            </div>
            <div class="col s12 m4">
              <span>AD version</span>
              <p>
                <label>
                  <input class="with-gap" name="ad" type="radio" v-model="selected.ad_version"/>
                  <span>v1</span>
                </label>
              </p>
              <p>
                <label>
                  <input class="with-gap" name="ad" type="radio" v-model="selected.ad_version"/>
                  <span>v2</span>
                </label>
              </p>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <span>Select needed</span>
              <p>
                <label>
                  <input type="checkbox" class="filled-in" v-model="selected.mail"/>
                  <span>Mail</span>
                </label>
                <label>
                  <input type="checkbox" class="filled-in" v-model="selected.sms"/>
                  <span>SMS</span>
                </label>
                <label>
                  <input type="checkbox" class="filled-in" v-model="selected.fax"/>
                  <span>Fax</span>
                </label>
                <label>
                  <input type="checkbox" class="filled-in" v-model="selected.telephony"/>
                  <span>Telephony</span>
                </label>
                <label>
                  <input type="checkbox" class="filled-in" v-model="selected.imagerie"/>
                  <span>Imagerie</span>
                </label>
                <label>
                  <input type="checkbox" class="filled-in" v-model="selected.archivage"/>
                  <span>Archivage</span>
                </label>
              </p>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <Autocomplete
                  label="iMX UI Application Language"
                  :items="projectDeliveryChains"
                  v-model="selected.delivery_chain"
              />
            </div>
          </div>
          <div class="row">
            <div class="col s12 m6">
              <Autocomplete
                label="ES"
                :items="[{ name: 'STD (from std reference instance)' },
                         { name: 'Specific requirement (copy from existing instance)' }]"
                v-model="selected.es"
              />
            </div>
            <div class="col s12 m6">
              <Autocomplete
                  label="LOV"
                  :items="[{ name: 'STD (from reference instance TRAD)' },
                         { name: 'Specific requirements  (copy from existing instance)' },
                         { name: 'N/А (LOVs coming from data package)'}]"
                  v-model="selected.lov"
              />
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <span>Select needed</span>
              <p>
                <label>
                  <input type="checkbox" class="filled-in" v-model="selected.es_requirements"/>
                  <span>ES particular requirements</span>
                </label>
                <label>
                  <input type="checkbox" class="filled-in" v-model="selected.night_job"/>
                  <span>Night Job Activation</span>
                </label>
                <label>
                  <input type="checkbox" class="filled-in" v-model="selected.db_clean"/>
                  <span>DB clean</span>
                </label>
                <label>
                  <input type="checkbox" class="filled-in" v-model="selected.auto_synchronization"/>
                  <span>Activate automatic synchronization of v9 translations</span>
                </label>
              </p>
            </div>
          </div>
          <div class="row">
            <TextArea
              class="col s12"
              label="Comments"
              v-model="selected.comments"
            />
          </div>
        </fieldset>
      </form>
    </template>
    <template v-slot:footer>
      <button
        class="btn waves-effect waves-light"
        type="submit"
        name="action"
        @click="save()"
      >
        <span v-if="action==='create'">Request</span>
        <span v-else>Save</span>
      </button>
    </template>
  </Modal>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import TextArea from '../../../components/TextArea';

export default {
  components: { TextArea },
  props: {
    action: { String, default: 'create' },
    request: { Object, default: {} },
  },
  data() {
    return {
      error: null,
      selected: {},
    };
  },
  validations: {
    selected: {
      project: {
        required,
      },
    },
  },
  computed: {
    projects() {
      return this.$store.state.mmpi.requestProjects || [];
    },
    projectDeliveryChains() {
      if (this.selected.project && this.selected.project.delivery_chains) {
        const deliveryChains = this.selected.project.delivery_chains;
        deliveryChains.push({ title: 'NEW' });
        return deliveryChains || [];
      }
      return [];
    },
    deliveryChainRoles() {
      return this.$store.state.mmpi.delivery_chain_roles || [];
    },
    instanceTypes() {
      return [
        { name: 'Intranet' },
        { name: 'Extranet' },
        { name: 'AD' },
      ];
    },
    environmentTypes() {
      return this.$store.state.mmpi.environmentTypes || [];
    },
    osPlatforms() {
      return this.$store.state.esxi.osPlatforms;
    },
    dbVersions() {
      if (this.selected.os) {
        return this.selected.os.versions.filter((version) => version.approved) || [];
      }
      return [];
    },
  },
  methods: {
    setUpdateData() {
      this.selected = { ...this.request };

      if (this.request.project) {
        this.selected.project = this.projects
          .find((project) => project.name === this.request.project);
      }

      if (this.request.delivery_chain) {
        this.selected.delivery_chain = this.projectDeliveryChains
          .find((deliveryChain) => deliveryChain.title === this.request.delivery_chain);
      }

      if (this.request.dc_role) {
        this.selected.dc_role = this.deliveryChainRoles
          .find((dcRole) => dcRole.value === this.request.dc_role);
      }

      if (this.request.instance_type) {
        this.selected.instance_type = this.instanceTypes
          .find((instanceType) => instanceType.type === this.request.instance_type);
      }

      if (this.request.environment_type) {
        this.selected.environment_type = this.environmentTypes
          .find((environmentType) => environmentType.title === this.request.environment_type);
      }
    },

    getProjectBusinessArea(project) {
      if (project.project_specifics.length > 0) {
        return project.project_specifics.find((ps) => ps.project_specific_feature.subtype === 'business_type')
          .project_specific_feature.value || '';
      }
      return '';
    },
    getProjectBusinessActivity(project) {
      if (project.type_business.length > 0) {
        return project.type_business[0].value || '';
      }
      return '';
    },
    getDefaultDeliveryChainRole() {
      if (this.selected.delivery_chain && this.selected.delivery_chain.dc_role) {
        this.selected.dc_role = { value: this.selected.delivery_chain.dc_role.value };
      }
    },

    save() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const payload = {
        id: this.selected.id,
        project: this.selected.project.name,
        delivery_chain: this.selected.delivery_chain.title,
        dc_role: this.selected.dc_role.value,
        instance_type: this.selected.instance_type.type,
        environment_type: this.selected.environment_type.title,
        comments: this.selected.comments,
      };

      if (this.selected.mail) {
        payload.mail = this.selected.mail.value;
      }

      if (this.selected.telephony) {
        payload.telephony = this.selected.telephony.value;
      }

      if (this.selected.fax) {
        payload.fax = this.selected.fax.value;
      }

      if (this.selected.sms) {
        payload.sms = this.selected.sms.value;
      }

      if (this.selected.imagerie) {
        payload.imagerie = this.selected.imagerie.value;
      }

      if (this.selected.archivage) {
        payload.archivage = this.selected.archivage.value;
      }

      this.$store.dispatch(`esxi/${this.action}RequestedInstance`, payload)
        .then(() => {
          this.$emit('close');
          if (this.action === 'create') {
            this.$M.toast({ html: 'The instance has been requested', classes: 'toast-success' });
            return;
          }
          this.$M.toast({ html: 'The requested instance has been updated', classes: 'toast-success' });
        })
        .catch((error) => {
          this.error = error;
        });
    },
  },

  watch: {
    /* eslint func-names: ["error", "as-needed"] */
    'selected.delivery_chain': function () {
      this.getDefaultDeliveryChainRole();
    },
  },

  mounted() {
    if (this.action === 'update') {
      this.setUpdateData();
    }
  },
};

</script>
<style scoped>
fieldset {
  padding: 1em 0.75em 0.625em;
}
[type="checkbox"] + span:not(.lever) {
  padding: 0 25px;
}
</style>
