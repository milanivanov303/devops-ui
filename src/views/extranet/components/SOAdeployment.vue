<template>
  <div class="col s12 l12">
    <h1 class="center">SOA Module Deployment</h1>
    <custom-confirm
        ref="custom-confirm"
        :message="confirmMsg"
        @selectedVal="customConfirm"/>
    <artifacts
        ref="artifacts"
        :artifactoryArr="artifactoryArr"
        @selectedVal="selectedArtifact"/>
    <form>
      <div class="row">
        <div class="input-field col s5">
          <i class="material-icons prefix">label_outline</i>
          <label for="tts_key" class="active">TTS Key</label>
          <input
              id="tts_key"
              type="text"
              v-model.trim="ttsKey"
              @blur="$v.ttsKey.$touch()"
              @change="$v.ttsKey.$touch()">
          <div class="validator"
               v-if="$v.ttsKey.$anyError || issueStatus === 'ERROR'">
            <div class="red-text" v-if="!$v.ttsKey.required">
              <p>Field is required</p>
            </div>
            <div class="red-text" v-if="!$v.ttsKey.validKey">
              <p>Not a valid TTS key.</p>
            </div>
            <div class="red-text" v-if="issueStatus === 'ERROR'">
              <p>TTS Key does not exist in MMPI!</p>
            </div>
          </div>
        </div>
        <div class="input-field col s1">
          <a
              class="btn-floating btn-small waves-effect waves-light tooltipped"
              data-position="right"
              data-tooltip="Change issue"
              ref="tooltip"
              @click="getIssue()">
            <i class="material-icons">cached</i>
          </a>
        </div>
      </div>
      <div class="row"
           v-if="deliveryChains.length
          && !$v.ttsKey.$anyError
          && issueStatus !== 'ERROR'">
        <div class="col s6">
          <Select
              label="Delivery chains"
              icon="linear_scale"
              displayed="title"
              v-model="deliveryChain"
              :options="deliveryChains"
              :invalid="$v.deliveryChain.$error"
              @blur="$v.deliveryChain.$touch()"
              @change="selectedDeliveryChain"
          />
          <div class="validator red-text" v-if="$v.deliveryChain.$error">
            <p v-if="!$v.deliveryChain.required">Delivery chain field is required.</p>
          </div>
        </div>
        <div class="col s6" v-if="soaModif.delivery_chain_id">
          <Select
              label="Instance status"
              icon="power_settings_new"
              displayed="value"
              v-model="instanceStatus"
              :options="instanceStatuses"
              :invalid="$v.deliveryChain.$error"
              @blur="$v.instanceStatus.$touch()"
              @change="selectedInstanceStatus"
          />
          <div class="validator red-text" v-if="$v.instanceStatus.$error">
            <p v-if="!$v.instanceStatus.required">Instance status field is required.</p>
          </div>
        </div>
      </div>
      <div class="row" v-if="soaModif.instance_status">
        <div class="input-field col s11">
          <i class="material-icons prefix">label_outline</i>
          <label for="name" class="active">Artifact</label>
          <input id="name"
                 type="text"
                 v-model="soaModif.name"
                 @change="artifactoryStatus = ''">
        </div>
        <div class="input-field col s1">
          <a class="btn-floating btn-small waves-effect waves-light tooltipped"
             data-position="right"
             data-tooltip="Check Artifact"
             ref="tooltip"
             @click="checkArtifactory()"><i class="material-icons">cached</i></a>
        </div>
        <div class="validator red-text col s10" v-if="$v.soaModif.name.$error">
          <div v-if="!$v.soaModif.name.required">
            <p>Artifact field is required.</p>
          </div>
          <div class="red-text" v-if="!$v.soaModif.name.exists">
            <p>Artifact name is wrong or do not exist.</p>
          </div>
          <div class="silver-text" v-if="artifactoryStatus === 'PENDING'">
            <p>Loading...</p>
          </div>
        </div>
      </div>
      <div class="row" v-if="soaModif.name">
        <div class="input-field col s6">
          <i class="material-icons prefix">label_outline</i>
          <label for="module_name" class="active">Module name</label>
          <input id="module_name"
                 type="text"
                 :placeholder="defaultModuleName"
                 v-model="moduleName">
        </div>
        <div class="input-field col s6">
          <i class="material-icons prefix">label_outline</i>
          <label for="module_home" class="active">Module home</label>
          <input id="module_home"
                 type="text"
                 :placeholder="config.mmpi.modif_module_home"
                 v-model="moduleHome">
        </div>
      </div>
      <div class="row" v-if="soaModif.name">
        <div class="input-field col s6">
          <i class="material-icons prefix">label_outline</i>
          <label for="scripts_destination" class="active">Scripts destination</label>
          <input id="scripts_destination"
                 type="text"
                 :placeholder="config.mmpi.modif_scripts_destination"
                 v-model="scriptsDestination">
        </div>
        <div class="input-field col s6">
          <i class="material-icons prefix">label_outline</i>
          <label for="templates_destination" class="active">Templates destination</label>
          <input id="templates_destination"
                 type="text"
                 :placeholder="config.mmpi.modif_tmp_destination"
                 v-model="templatesDestination">
        </div>
      </div>
      <div class="row" v-if="soaModif.name">
        <p class="col s6">
          <label>
            <input type="checkbox"
                   v-model="additionalCmd"/>
            <span>process config templates</span>
          </label>
        </p>
      </div>
      <div class="row">
        <div class="col s12  center">
          <div class="red-text" v-if="soaSubmitStatus === 'ERROR'">
            <p>SOA Modification cannot be created!</p>
          </div>
          <div class="red-text" v-if="cmdSubmitStatus === 'ERROR'">
            <p>Command Modification cannot be created!</p>
          </div>
          <div class="green-text center"
               v-if="soaSubmitStatus === 'OK' && cmdSubmitStatus === 'OK'">
            <p>Modification has been successfully created.</p>
          </div>
        </div>
      </div>
      <div class="row" >
        <div class="input-field col s12 m6 l6">
          <button class="btn waves-effect waves-light right"
                  type="button"
                  name="action"
                  @click="onSubmit">Add</button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';
import CustomConfirm from "@/components/partials/CustomConfirm";
import Artifacts from "@/components/soa-modification/Artifacts";
import config from "@/config";

export default {
  components: {
    'custom-confirm': CustomConfirm,
    artifacts: Artifacts,
  },
  data() {
    return {
      soaModif: {
        type_id: 'binary',
        subtype: {
          key: 'maven',
        },
        name: '',
        issue_id: '',
        maven_repository: '',
        deployment_prefix: {
          key: 'source_path_imx_tmp',
        },
        visible: 1,
        active: 1,
        version: '',
        delivery_chain_id: '',
        instance_status: '',
      },
      cmdModif: {
        type_id: 'cmd',
        est_run_time: '00:30:00',
        check_exit_status: 1,
      },
      artifactoryName: '',
      deliveryChain: {},
      deliveryChains: [],
      instanceStatus: {},
      instanceStatuses: [],
      soaSubmitStatus: 'PENDING',
      cmdSubmitStatus: 'PENDING',
      artifactoryStatus: '',
      confirmMsg: [],
      artifactoryArr: [],
      config: {},
      defaultModuleName: '',
      additionalCmd: '',
      moduleName: '',
      moduleHome: '',
      scriptsDestination: '',
      templatesDestination: '',
      ttsKey: this.$route.params.issue,
      issueStatus: '',
    };
  },
  validations: {
    ttsKey: {
      required,
      validKey(value) {
        return /^[A-Z]+-[0-9]+$/.test(value);
      },
    },
    deliveryChain: {
      required,
    },
    instanceStatus: {
      required,
    },
    soaModif: {
      name: {
        required,
        exists() {
          return this.artifactoryStatus !== 'ERROR';
        },
      },
    },
  },
  mounted() {
    this.getIssue();
    this.getInstanceStatus();
  },
  created() {
    this.config = config;
  },
  watch: {
    ttsKey(key) {
      this.issueStatus = '';
      this.deliveryChains = [];
      this.$router.push({ params: { issue: key } });
    },
  },
  computed: {
    issue() {
      return this.$store.state.cms.issue;
    },
  },
  methods: {
    changeIssue() {
      this.issueStatus = '';
      this.deliveryChains = [];
      this.deliveryChain = {};
      this.soaModif.delivery_chain_id = '';
    },
    async getIssue() {
      this.changeIssue();
      if (this.$route.params.issue) {
        const loader = this.$loading.show({ container: this.$el });
        await this.$store.dispatch('cms/getIssue', this.$route.params.issue)
            .then(() => {
              this.soaModif.issue_id = this.$store.state.cms.issue.id;
              if (this.$store.state.cms.issue) {
                this.deliveryChains = this.$store.state.cms.issue.project.delivery_chains;
              }
              if (!this.$store.state.cms.issue
                  || (this.ttsKey !== this.$store.state.cms.issue.tts_id)) {
                this.issueStatus = 'ERROR';
              }
              loader.hide();
            });
      }
    },
    async getInstances(deliveryChain) {
      this.instances = [];
      if (deliveryChain.dc_role && deliveryChain.dc_role !== null) {
        switch (deliveryChain.dc_role.key) {
          case 'dc_rel':
            this.instances = this.filterChains(
                ['dc_hf', 'dc_min', 'dc_rel'],
                deliveryChain.type.type,
            );
            break;
          case 'dc_hf':
            this.instances = this.filterChains(
                ['dc_hf'],
                deliveryChain.type.type,
            );
            break;
          case 'dc_min':
            this.instances = this.filterChains(
                ['dc_hf', 'dc_min'],
                deliveryChain.type.type,
            );
            break;
          default:
            this.instances = [];
            break;
        }
      }
      this.instances = [
        { name: 'All' },
        { name: 'All except PROD' },
        ...this.instances,
      ];
    },
    filterChains(roles, type) {
      return this.deliveryChains.reduce((acc, chain) => {
        if (roles.includes(chain.dc_role.key)
            && chain.type.type === type) {
          chain.instances
              .filter((instance) => instance.instance_type_id !== 'DEV')
              .filter((instance) => instance.instance_type_id !== 'codix')
              .map((instance) => acc.push(instance));
        }
        return acc;
      }, []);
    },
    async getInstanceStatus() {
      this.$M.Tooltip.init(this.$refs.tooltip);
      await this.$store.dispatch('cms/getInstanceStatus');
      this.instanceStatuses = this.$store.state.cms.instanceStatus;
    },
    selectedDeliveryChain(value) {
      this.soaModif.delivery_chain_id = value.id;
    },
    selectedInstanceStatus(value) {
      this.soaModif.instance_status = value.id;
    },
    async onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const loader = this.$loading.show({ container: this.$el });
      if (this.artifactoryStatus !== 'ERROR') {
        await this.$store.dispatch('cms/addModification', this.soaModif).then((resp) => {
          if (this.$store.state.cms.error) {
            this.soaSubmitStatus = 'ERROR';
          } else {
            this.soaSubmitStatus = 'OK';
            this.prepareCmdModif(resp);
          }
        });

        await this.$store.dispatch('cms/addModification', this.cmdModif);

        if (this.additionalCmd) {
          this.cmdModif.name = `cms resolve_template ${this.moduleName || this.defaultModuleName}`;
          await this.$store.dispatch('cms/addModification', this.cmdModif);

          this.cmdModif.name = `cms deploy_config ${this.moduleName || this.defaultModuleName}`;
          await this.$store.dispatch('cms/addModification', this.cmdModif);
        }

        if (this.$store.state.cms.error) {
          this.cmdSubmitStatus = 'ERROR';
          this.confirmMsg = ['Could not created command modification!', 'Do you want to proceed to MMPI and created manually?'];
        } else {
          this.cmdSubmitStatus = 'OK';
          this.confirmMsg = ['Modification has been successfully created!', 'Do you want to proceed to MMPI?'];
        }

        this.$refs['custom-confirm'].openModal();
        loader.hide();
      }
    },
    async checkArtifactory() {
      this.artifactoryStatus = 'PENDING';
      this.artifactoryArr = [];

      // remove '/' char from the beginning of the address
      this.soaModif.name = this.soaModif.name.replace(/^\//g, '').trim();
      // return error if the given value is url
      if (/\//.test(this.soaModif.name)) {
        this.artifactoryStatus = 'ERROR';
      } else {
        // const api = Api(this.config.mmpi.url, this.config.mmpi.code);
        try {
          await api('mmpi').get(`artifactory/${this.soaModif.name}`).then((response) => {
            this.artifactoryArr = response.data.results;
            if (this.artifactoryArr.length === 0) {
              this.artifactoryStatus = 'ERROR';
            } else {
              this.$refs.artifacts.openModal();
            }
          });
        } catch (error) {
          this.artifactoryStatus = 'ERROR';
        }
      }
    },
    customConfirm(value) {
      if (value) {
        window.location.href = `${this.config.mmpi.web}/issue/${this.$route.params.issue}`;
      } else {
        this.confirmMsg = [''];
      }
    },
    selectedArtifact(value) {
      if (value) {
        [this.artifactoryName, this.defaultModuleName] = value.name.match(/(.*)-[0-9]+.*-bin\.zip/);
        this.soaModif.name = `${value.repo}/${value.path}/${value.name}`;
        const splittedName = this.soaModif.name.split('/');
        this.soaModif.version = splittedName[splittedName.length - 2];
        this.artifactoryStatus = 'OK';
        this.soaModif.maven_repository = value.repo;
      } else {
        this.artifactoryStatus = 'ERROR';
      }
    },
    prepareCmdModif(resp) {
      // set default values if empty
      const moduleName = this.moduleName || this.defaultModuleName;
      const moduleHome = this.moduleHome || this.config.mmpi.modif_module_home;
      const scriptsDestination = this.scriptsDestination
          || this.config.mmpi.modif_scripts_destination;
      const templatesDestination = this.templatesDestination
          || config.mmpi.modif_tmp_destination;
      const instance = this.deliveryChain.instances
        .find((instance) => instance.owner.key === 'codix'
              && instance.status.key === 'active'
              && instance.instance_to_delivery_chain.instance_previous_id === null);

      this.cmdModif.name = `${this.config.mmpi.modif_cmd} ${resp.deployment_prefix.value} ${this.artifactoryName} ${moduleName} ${moduleHome} ${scriptsDestination} ${templatesDestination}`;
      this.cmdModif.visible = this.soaModif.visible;
      this.cmdModif.issue_id = this.soaModif.issue_id;
      this.cmdModif.delivery_chain_id = this.soaModif.delivery_chain_id;
      this.cmdModif.instance_status = this.soaModif.instance_status;
      this.cmdModif.instance = instance;
    },
  },
};
</script>

