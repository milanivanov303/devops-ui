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
        </fieldset>
        <fieldset v-if="selected.project">
          <legend>Project Details from MMPI</legend>
          <div class="row">
            <div class="col s12 m2">
              <TextInput
                  class="readonly"
                  label="Project type"
                  v-model="selected.project.project_type.value"
              />
            </div>
            <div class="col s12 m5">
              <TextInput
                  class="readonly"
                  label="Client business area"
                  :value="getProjectBusinessArea(selected.project)"
              />
            </div>
            <div class="col s12 m5">
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
                  label="iMX Business Activity"
                  :value="getProjectBusinessActivity(selected.project)"
              />
            </div>
            <div class="col s12 m4">
              <TextInput
                  class="readonly"
                  label="G_ETUDE.ACTIVITE"
                  :value="getProjectActivity()"
              />
            </div>
            <div class="col s12 m4">
              <TextInput
                  class="readonly"
                  label="G_ETUDE.ACTIVITE_GPC"
                  :value="selected.project.activite_gpc"
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
                  label="Client Code"
                  :value="selected.project.clnt_code"
              />
            </div>
            <div class="col s12 m4">
              <TextInput
                  class="readonly"
                  label="Other Client Code"
                  :value="selected.project.clnt_code2"
              />
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 m4">
              <input id="getdcli" :value="selected.project.getdcli" class="readonly"/>
              <label :class="{active: selected.project.getdcli}" for="getdcli">
                G_ETUDE.GETDCLI
              </label>
              <span class="helper-text">equal to client code if empty</span>
            </div>
            <div class="col s12 m4">
              <TextInput
                  class="readonly"
                  label="G_ETUDE.GETDCLI2"
                  :value="selected.project.getdcli2"
              />
            </div>
            <div class="input-field col s12 m4">
              <input id="imx_formstag" :value="selected.project.imx_formstag" class="readonly"/>
              <label :class="{active: selected.project.imx_formstag}" for="imx_formstag">
                IMX_FORMSTAG
              </label>
              <span class="helper-text">equal to GETDCLI if empty</span>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <TextArea
                  class="readonly"
                  label="Application languages"
                  :value="getApplicationLanguages(selected.project)"
              />
            </div>
          </div>
        </fieldset>
        <fieldset v-if="selected.project">
          <legend>Main requirements</legend>
          <div class="row">
            <div class="col s12 m6">
              <Autocomplete
                  label="Instance Owner"
                  :items="[{ name: 'Client' }, { name: 'Codix'}]"
                  v-model="selected.owner"
                  :invalid="$v.selected.owner.$error"
                  @blur="$v.selected.owner.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.owner.$error">
                  <p v-if="!$v.selected.owner.required">Instance owner field must not be empty.</p>
                </div>
              </div>
            </div>
            <div class="col s12 m6">
              <Autocomplete
                  label="Server Hosted"
                  :items="[{ name: 'Codix Premises' }, { name: 'Oracle Cloud'}]"
                  v-model="selected.server_hosted"
                  :invalid="$v.selected.server_hosted.$error"
                  @blur="$v.selected.server_hosted.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.server_hosted.$error">
                  <p v-if="!$v.selected.server_hosted.required">
                    Server hosted field must not be empty.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <Autocomplete
                  @change="showRequestTypeComment"
                  label="Type of Instance Request"
                  v-model="type_of_request.type"
                  :items="[
                  { name: 'Standard PnP (from Stable PnP with refresh from iMX REFBG2)' },
                  { name: 'Standard PnP (from Stable PnP without refresh from iMX REFBG2)'},
                  { name:
                    'Custom (clone from already existing instance with refresh from REFBG2)' },
                  { name:
                    'Custom (clone from already existing instance without refresh from REFBG2)'}
                ]"
                  :invalid="$v.type_of_request.type.$error"
                  @blur="$v.type_of_request.type.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.type_of_request.type.$error">
                  <p v-if="!$v.type_of_request.type.required">
                    Type of instance requested field must not be empty.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="row" v-if="showRequestTypeComment()">
            <TextArea
                class="col s12"
                label="Specify from where to build (database, iMX sources)"
                v-model="type_of_request.comment"
                :invalid="$v.type_of_request.comment.$error"
                @blur="$v.type_of_request.comment.$touch()"
            />
            <div class="validator">
              <div class="red-text" v-if="$v.type_of_request.comment.$error">
                <p v-if="!$v.type_of_request.comment.required">Field must not be empty.</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col s12 m6">
              <Autocomplete
                  label="Delivery chain"
                  valueKey="title"
                  :items="projectDeliveryChains"
                  v-model="selected.delivery_chain"
                  @change="delete selected.dc_role"
                  :invalid="$v.selected.delivery_chain.$error"
                  @blur="$v.selected.delivery_chain.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.delivery_chain.$error">
                  <p v-if="!$v.selected.delivery_chain.required">
                    Delivery chain field must not be empty.
                  </p>
                </div>
              </div>
            </div>
            <div class="col s12 m6">
              <Autocomplete
                  label="Delivery chain role"
                  :items="deliveryChainRoles"
                  valueKey="value"
                  v-model="selected.dc_role"
                  :invalid="$v.selected.dc_role.$error"
                  @blur="$v.selected.dc_role.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.dc_role.$error">
                  <p v-if="!$v.selected.dc_role.required">
                    Delivery chain role field must not be empty.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 m6">
              <input id="volume"
                     v-model="selected.dev_volume"
                     :invalid="$v.selected.dev_volume.$error"
                     @blur="$v.selected.dev_volume.$touch()"/>
              <label :class="{active: selected.dev_volume}" for="volume">
                Expected new DEV during the customization
              </label>
              <span class="helper-text">small, medium, large, extra-large</span>
              <div class="validator">
                <div class="red-text" v-if="$v.selected.dev_volume.$error">
                  <p v-if="!$v.selected.dev_volume.required">Field must not be empty.</p>
                </div>
              </div>
            </div>
            <div class="col s12 m6">
              <Autocomplete
                  label="Purpose (Environment type)"
                  :items="environmentTypes"
                  valueKey="title"
                  v-model="selected.environment_type"
                  :invalid="$v.selected.environment_type.$error"
                  @blur="$v.selected.environment_type.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.environment_type.$error">
                  <p v-if="!$v.selected.environment_type.required">
                    Purpose field must not be empty.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
        <fieldset v-if="selected.project">
          <legend>Required iMX modules (instance version)</legend>
          <div class="row">
            <div class="col s12 m4">
              <Autocomplete
                  label="Intranet Application version"
                  :items="instanceTypesVersions.filter(v => v.subtype === 'IMX')"
                  valueKey="value"
                  v-model="selected.intranet_version"
              />
            </div>
            <div class="col s12 m4">
              <Autocomplete
                  label="Extranet Build version"
                  :items="instanceTypesVersions.filter(v => v.subtype === 'EXTRANET')"
                  valueKey="value"
                  v-model="selected.extranet_version"
              />
            </div>
            <div class="col s12 m4">
              <Autocomplete
                  label="AD version"
                  :items="instanceTypesVersions.filter(v => v.subtype === 'AD')"
                  valueKey="value"
                  v-model="selected.ad_version"
              />
            </div>
            <div class="validator col s12">
              <div class="red-text" v-if="$v.selected.intranet_version.$error">
                <p v-if="!$v.selected.intranet_version.required">
                  Please select at least one version.
                </p>
              </div>
            </div>
          </div>
        </fieldset>
        <fieldset v-if="selected.project">
          <legend>
            Technical requirements (software components versions per technical specification)
          </legend>
          <div class="row">
            <div class="col s12" :class="{'m6': selected.os}">
              <Autocomplete
                label="OS Platform (Hardware)"
                :items="osPlatforms"
                v-model="selected.os"
                @change="delete selected.os_version"
                :invalid="$v.selected.os.$error"
                @blur="$v.selected.os.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.os.$error">
                  <p v-if="!$v.selected.os.required">OS field must not be empty.</p>
                </div>
              </div>
            </div>
            <div class="col s12 m6" v-if="selected.os">
              <Autocomplete
                  label="Oracle DB version"
                  :items="dbVersions"
                  valueKey="version"
                  v-model="selected.os_version"
                  :invalid="$v.selected.os_version.$error"
                  @blur="$v.selected.os_version.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.os_version.$error">
                  <p v-if="!$v.selected.os_version.required">OS version field must not be empty.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col s12" :class="{'m6': selected.oracle_middleware}">
              <Autocomplete
                  label="Oracle Fusion Middleware"
                  :items="middlewareOptions"
                  v-model="selected.oracle_middleware"
                  @change="delete selected.middleware_version"
              />
            </div>
            <div class="col s12 m6" v-if="selected.oracle_middleware">
              <Autocomplete
                  label="Oracle Fusion Middleware version"
                  :items="middlewareVersions"
                  valueKey="version"
                  v-model="selected.middleware_version"
                  :invalid="$v.selected.middleware_version.$error"
                  @blur="$v.selected.middleware_version.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.middleware_version.$error">
                  <p v-if="!$v.selected.middleware_version.required">
                    Middleware version field must not be empty.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col s12" :class="{'m6': selected.oracle_db}">
              <Autocomplete
                  label="Oracle DB(RDBMS)"
                  :items="oracleDb"
                  v-model="selected.oracle_db"
                  @change="delete selected.oracle_version"
                  :invalid="$v.selected.oracle_db.$error"
                  @blur="$v.selected.oracle_db.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.oracle_db.$error">
                  <p v-if="!$v.selected.oracle_db.required">Oracle DB field must not be empty.</p>
                </div>
              </div>
            </div>
            <div class="col s12 m6" v-if="selected.oracle_db">
              <Autocomplete
                  label="Oracle DB(RDBMS) version"
                  :items="oracleVersions"
                  valueKey="version"
                  v-model="selected.oracle_version"
                  :invalid="$v.selected.oracle_version.$error"
                  @blur="$v.selected.oracle_version.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.oracle_version.$error">
                  <p v-if="!$v.selected.oracle_version.required">
                    Oracle DB version field must not be empty.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col s12 m4">
              <Autocomplete
                  label="WSL"
                  :items="wslVersions"
                  valueKey="version"
                  v-model="selected.wsl"
                  :invalid="$v.selected.wsl.$error"
                  @blur="$v.selected.wsl.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.wsl.$error">
                  <p v-if="!$v.selected.wsl.required">WSL field must not be empty.</p>
                </div>
              </div>
            </div>
            <div class="col s12 m4">
              <Autocomplete
                  label="Tomcat/WAS"
                  :items="tomcatVersions"
                  valueKey="version"
                  v-model="selected.tomcat"
                  :invalid="$v.selected.tomcat.$error"
                  @blur="$v.selected.tomcat.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.tomcat.$error">
                  <p v-if="!$v.selected.tomcat.required">Tomcat field must not be empty.</p>
                </div>
              </div>
            </div>
            <div class="col s12 m4">
              <Autocomplete
                  label="HTTPD"
                  :items="httpdVersions"
                  valueKey="version"
                  v-model="selected.httpd"
                  :invalid="$v.selected.httpd.$error"
                  @blur="$v.selected.httpd.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.httpd.$error">
                  <p v-if="!$v.selected.httpd.required">HTTPD field must not be empty.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col s12" :class="{'m6': selected.java}">
              <Autocomplete
                  label="Java components"
                  :items="javaComponents"
                  valueKey="name"
                  v-model="selected.java"
                  @change="delete selected.java_version"
                  :invalid="$v.selected.java.$error"
                  @blur="$v.selected.java.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.java.$error">
                  <p v-if="!$v.selected.java.required">Java field must not be empty.</p>
                </div>
              </div>
            </div>
            <div class="col s12 m6" v-if="selected.java">
              <Autocomplete
                  label="Java version"
                  :items="javaVersions"
                  valueKey="version"
                  v-model="selected.java_version"
                  :invalid="$v.selected.java_version.$error"
                  @blur="$v.selected.java_version.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.java_version.$error">
                  <p v-if="!$v.selected.java_version.required">
                    Java version field must not be empty.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
        <fieldset v-if="selected.project">
          <legend>Instance Setup (specific variables)</legend>
          <div class="row">
            <div class="col s12 m6">
              <TextInput
                  class="readonly"
                  label="$IMX_FORMSTAG"
                  :value="getFormsTag()"
              />
            </div>
            <div class="col s12 m6">
              <TextInput
                  class="readonly"
                  label="$IMX_FORMSACTIVITY"
                  :value="getProjectActivity()"
              />
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <Select
                  class="languages"
                  displayed="name"
                  label="iMX UI Application Language/s ($FORMS_LNG)"
                  :options="languages"
                  :multiple="true"
                  v-model="selected.ui_lang"
                  :invalid="$v.selected.ui_lang.$error"
                  @blur="$v.selected.ui_lang.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.ui_lang.$error">
                  <p v-if="!$v.selected.ui_lang.required">
                    iMX UI application language field must not be empty.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <Select
                  :options="languages"
                  displayed="name"
                  label="Extranet application languages"
                  :multiple="true"
                  v-model="selected.extranet_lang"
                  :invalid="$v.selected.extranet_lang.$error"
                  @blur="$v.selected.extranet_lang.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.extranet_lang.$error">
                  <p v-if="!$v.selected.extranet_lang.required">
                    Extranet application languages field must not be empty.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
        <fieldset v-if="selected.project">
          <legend>Additional iMX components</legend>
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
        </fieldset>
        <fieldset v-if="selected.project">
          <legend>Other</legend>
          <div class="row">
            <div class="col s12 m6">
              <Autocomplete
                  label="ES"
                  :items="[{ name: 'STD (from std reference instance)' },
                           { name: 'Specific requirement (copy from existing instance)' }]"
                  v-model="selected.es"
                  :invalid="$v.selected.es.$error"
                  @blur="$v.selected.es.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.es.$error">
                  <p v-if="!$v.selected.es.required">ES field must not be empty.</p>
                </div>
              </div>
            </div>
            <div class="col s12 m6">
              <Autocomplete
                  label="LOV"
                  :items="[{ name: 'STD (from reference instance TRAD)' },
                           { name: 'Specific requirements  (copy from existing instance)' },
                           { name: 'N/А (LOVs coming from data package)'}]"
                  v-model="selected.lov"
                  :invalid="$v.selected.lov.$error"
                  @blur="$v.selected.lov.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.lov.$error">
                  <p v-if="!$v.selected.lov.required">LOV field must not be empty.</p>
                </div>
              </div>
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
      type_of_request: {},
    };
  },
  validations() {
    const validations = {
      selected: {
        project: {
          required,
        },
        owner: {
          required,
        },
        server_hosted: {
          required,
        },
        delivery_chain: {
          required,
        },
        dc_role: {
          required,
        },
        dev_volume: {
          required,
        },
        environment_type: {
          required,
        },
        intranet_version: {},
        os: {
          required,
        },
        os_version: {
          required,
        },
        middleware_version: {
          required,
        },
        oracle_db: {
          required,
        },
        oracle_version: {
          required,
        },
        wsl: {
          required,
        },
        tomcat: {
          required,
        },
        httpd: {
          required,
        },
        java: {
          required,
        },
        java_version: {
          required,
        },
        ui_lang: {
          required,
        },
        extranet_lang: {
          required,
        },
        es: {
          required,
        },
        lov: {
          required,
        },
      },
      type_of_request: {
        type: {
          required,
        },
        comment: {},
      },
    };

    if (this.showRequestTypeComment()) {
      validations.type_of_request.comment = { required };
    }
    if (!(this.selected.intranet_version
          || this.selected.extranet_version
          || this.selected.ad_version)) {
      validations.selected.intranet_version = { required };
    }

    return validations;
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
    environmentTypes() {
      return this.$store.state.mmpi.environmentTypes || [];
    },
    instanceTypesVersions() {
      return this.$store.state.mmpi.instanceTypesVersions || [];
    },
    osPlatforms() {
      return this.$store.state.esxi.imxComponents.filter((component) => component.type === 'OS') || [];
    },
    oracleDb() {
      return this.$store.state.esxi.imxComponents.filter((component) => component.type === 'DB') || [];
    },
    dbVersions() {
      if (this.selected.os) {
        return this.selected.os.versions.filter((version) => version.approved === 'Yes') || [];
      }
      return [];
    },
    oracleVersions() {
      if (this.selected.oracle_db) {
        return this.selected.oracle_db.versions.filter((version) => version.approved === 'Yes') || [];
      }
      return [];
    },
    middlewareOptions() {
      return this.$store.state.esxi.imxComponents
        .filter((component) => component.name_key === 'OFM' || component.name_key === 'OIC') || [];
    },
    middlewareVersions() {
      if (this.selected.oracle_middleware) {
        return this.selected.oracle_middleware.versions.filter((version) => version.approved === 'Yes') || [];
      }
      return [];
    },
    tomcatVersions() {
      // Tomcat + WAS
      const versions = this.$store.state.esxi.imxComponents
        .filter((component) => component.name.includes('Apache Tomcat') || component.name_key === 'WAS')
        .flatMap((component) => component.versions) ?? [];
      return versions.filter((version) => version.approved === 'Yes') || [];
    },
    httpdVersions() {
      return this.$store.state.esxi.imxComponents.find((component) => component.name
        .includes('Apache HTTP Server')).versions.filter((version) => version.approved === 'Yes') || [];
    },
    wslVersions() {
      return this.$store.state.esxi.imxComponents.find((component) => component.name
        .includes('WLS')).versions.filter((version) => version.approved === 'Yes') || [];
    },
    javaComponents() {
      return this.$store.state.esxi.imxComponents.filter((component) => component.type === 'SDK') || [];
    },
    javaVersions() {
      if (this.selected.java) {
        return this.selected.java.versions.filter((version) => version.approved === 'Yes') || [];
      }
      return [];
    },
    languages() {
      return this.$store.state.esxi.languages || [];
    },
  },
  methods: {
    getProjectBusinessArea(project) {
      if (project.project_specifics && project.project_specifics.length > 0) {
        const businessType = project.project_specifics.find((ps) => ps.project_specific_feature.subtype === 'business_type');
        return businessType ? businessType.project_specific_feature.value : '';
      }
      return '';
    },
    getProjectBusinessActivity(project) {
      if (project.type_business.length > 0) {
        return project.type_business[0].value || '';
      }
      return '';
    },
    getProjectActivity() {
      return this.selected.project.activity ? this.selected.project.activity.key : '';
    },
    getApplicationLanguages(project) {
      return project.languages.flatMap((language) => language.value).join(', ');
    },
    getDefaultDeliveryChainRole() {
      if (this.selected.delivery_chain && this.selected.delivery_chain.dc_role) {
        this.selected.dc_role = { value: this.selected.delivery_chain.dc_role.value };
      }
    },
    showRequestTypeComment() {
      return this.type_of_request.type && this.type_of_request.type.name.includes('Custom');
    },
    getFormsTag() {
      return this.selected.project.imx_formstag
        ?? this.selected.project.getdcli
        ?? this.selected.project.clnt_code;
    },

    mapData() {
      this.selected = { ...this.request };
      this.selected.project = this.projects
        .find((project) => project.name === this.request.project);
      this.selected.owner = { name: this.request.owner };
      this.selected.server_hosted = { name: this.request.server_hosted };
      this.type_of_request = {
        type: { name: this.request.type_of_request.type },
        comment: this.request.type_of_request.comment ?? '',
      };
      this.selected.delivery_chain = this.projectDeliveryChains
        .find((dc) => dc.title === this.request.delivery_chain);
      this.selected.dc_role = this.deliveryChainRoles
        .find((role) => role.value === this.request.dc_role);
      this.selected.environment_type = this.environmentTypes
        .find((type) => type.title === this.request.environment_type);

      this.request.instance_version.forEach((version) => {
        this.selected[`${version.module.toLowerCase()}_version`] = this.instanceTypesVersions
          .find((vr) => vr.value === version.version);
      });

      this.selected.os = this.osPlatforms.find((os) => os.name === this.request.os.name);
      this.selected.os_version = this.dbVersions
        .find((version) => version.version === this.request.os.version);
      this.selected.oracle_middleware = this.middlewareOptions
        .find((mid) => mid.name === this.request.oracle_middleware.name);
      this.selected.middleware_version = this.middlewareVersions
        .find((version) => version.version === this.request.oracle_middleware.version);
      this.selected.oracle_db = this.oracleDb
        .find((os) => os.name === this.request.oracle_db.name);
      this.selected.oracle_version = this.oracleVersions
        .find((version) => version.version === this.request.oracle_db.version);
      this.selected.wsl = this.wslVersions.find((wsl) => wsl.version === this.request.wsl);
      this.selected.tomcat = this.tomcatVersions
        .find((tomcat) => tomcat.version === this.request.tomcat);
      this.selected.httpd = this.httpdVersions
        .find((httpd) => httpd.version === this.request.httpd);
      this.selected.java = this.javaComponents.find((os) => os.name === this.request.java.name);
      this.selected.java_version = this.javaVersions
        .find((version) => version.version === this.request.java.version);
    },
    getPayloadData() {
      const payload = {};

      if (this.selected.id) {
        payload.id = this.selected.id;
      }

      payload.project = this.selected.project.name;
      payload.owner = this.selected.owner.name;
      payload.server_hosted = this.selected.server_hosted.name;
      payload.type_of_request = {
        type: this.type_of_request.type.name,
        comment: this.type_of_request.comment,
      };
      payload.delivery_chain = this.selected.delivery_chain.title;
      payload.dc_role = this.selected.dc_role.value;
      payload.environment_type = this.selected.environment_type.title;
      payload.dev_volume = this.selected.dev_volume;

      const versions = [];
      if (this.selected.intranet_version) {
        versions.push({ module: 'Intranet', version: this.selected.intranet_version.value });
      }
      if (this.selected.extranet_version) {
        versions.push({ module: 'Extranet', version: this.selected.extranet_version.value });
      }
      if (this.selected.ad_version) {
        versions.push({ module: 'Ad', version: this.selected.ad_version.value });
      }
      payload.instance_version = versions;

      payload.os = { name: this.selected.os.name, version: this.selected.os_version.version };
      payload.oracle_middleware = {
        name: this.selected.oracle_middleware.name,
        version: this.selected.middleware_version.version,
      };
      payload.oracle_db = {
        name: this.selected.oracle_db.name,
        version: this.selected.oracle_version.version,
      };
      payload.wsl = this.selected.wsl.version;
      payload.tomcat = this.selected.tomcat.version;
      payload.httpd = this.selected.httpd.version;
      payload.java = { name: this.selected.java.name, version: this.selected.java_version.version };
      payload.ui_lang = this.selected.ui_lang;
      payload.extranet_lang = this.selected.extranet_lang;

      if (this.selected.mail) {
        payload.mail = 1;
      }
      if (this.selected.sms) {
        payload.sms = 1;
      }
      if (this.selected.fax) {
        payload.fax = 1;
      }
      if (this.selected.telephony) {
        payload.telephony = 1;
      }
      if (this.selected.imagerie) {
        payload.imagerie = 1;
      }
      if (this.selected.archivage) {
        payload.archivage = 1;
      }

      payload.es = this.selected.es.name;
      payload.lov = this.selected.lov.name;

      if (this.selected.es_requirements) {
        payload.es_requirements = 1;
      }
      if (this.selected.night_job) {
        payload.night_job = 1;
      }
      if (this.selected.db_clean) {
        payload.db_clean = 1;
      }
      if (this.selected.auto_synchronization) {
        payload.auto_synchronization = 1;
      }

      payload.comments = this.selected.comments;

      return payload;
    },

    save() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      this.$store.dispatch(`esxi/${this.action}RequestedInstance`, this.getPayloadData())
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
      // TO DO
      this.getDefaultDeliveryChainRole();
    },
  },

  mounted() {
    if (this.action === 'update') {
      this.mapData();
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

.select-wrapper {
  color: #9e9e9e !important;
  fill: #9e9e9e !important;
}
</style>
