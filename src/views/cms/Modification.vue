<template>
  <div class="row">
    <h1 class="center">CMS Modification</h1>
    <Alert v-if="error !== ''" :msg="error"/>
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
      <div
        class="row"
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
            <span v-if="!$v.deliveryChain.required">Delivery chain field is required.</span>
          </div>
        </div>
        <div class="col s6" v-if="form.delivery_chain_id">
          <div class="col s6">
            <button
              class="btn waves-effect waves-light col s12"
              type="button"
              name="action"
              @click="showAddModifVariableModal = true">Add Variable
            </button>
            <AddVariableModif
              v-if="showAddModifVariableModal"
              :instances="instances"
              :chain="deliveryChain"
              @addVariable="addVariable"
              @close="closeModal('add-modif-variable')"/>
          </div>
          <div class="col s6">
            <button
              class="btn waves-effect waves-light col s12"
              type="button"
              name="action"
              @click="showAddModifTemplateModal = true">Add Template
            </button>
            <AddTemplateModif
              v-if="showAddModifTemplateModal"
              @addTemplate="addTemplate"
              @close="closeModal('add-template-variable')"/>
          </div>
        </div>
      </div>
      <div v-if="modifications.length">
        <inserts :modifications="modifications" @remove="key => modifications.splice(key, 1)"/>
        <div class="validator red-text" v-if="$v.modifications.$error">
          <p v-if="!$v.modifications.required">There are no added modifications!</p>
        </div>
        <div class="row">
          <div class="col s12 center">
            <div class="red-text" v-if="submitStatus === 'ERROR'">
              <p>CMS Modification cannot be created!</p>
            </div>
            <div class="green-text center"
                  v-if="submitStatus === 'OK' && cmdSubmitStatus === 'OK'">
              <p>Modification has been successfully created.</p>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12 center">
            <button class="btn waves-effect waves-light"
                    type="button"
                    name="action"
                    @click="onSubmit">Add Modifications</button>
          </div>
        </div>
      </div>
    </form>
    <CreateConfigDefault
      v-if="showAddEditVariableModal"
      @close="closeModal('add-new-variable')"
      @addedVariable="addNewVariable"
      :issue="issue.tts_id"
      :selectedVariable="selectedVariable"
      :msg="varMsg"
      :action="varAction"/>
    <Modal v-if="showConfirmModal" @close="showConfirmModal = false" class="confirm">
      <template v-slot:content>
        <div v-if="error" class="center">
          <i class="material-icons large red-text">error_outline</i>
          <p>{{ error }}</p>
        </div>
        <div v-else>
          <div v-html="confirmMsg"></div>
        </div>
      </template>
      <template v-slot:footer>
        <button
          v-if="error === ''"
          class="waves-effect btn"
          @click="customConfirm()">
          <i class="material-icons left">link</i> Go to MMPI
        </button>
      </template>
    </Modal>
  </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';
import config from '@/config';
import Inserts from '@/components/cms/Inserts';
import CreateConfigDefault from '@/components/cms/CreateConfigDefault';
import AddVariableModif from '@/components/cms/AddVariableModif';
import AddTemplateModif from '@/components/cms/AddTemplateModif';

export default {
  components: {
    inserts: Inserts,
    AddVariableModif,
    CreateConfigDefault,
    AddTemplateModif,
  },
  created() {
    this.loadData();
  },
  mounted() {
    this.getIssue();
  },
  watch: {
    ttsKey(key) {
      this.issueStatus = '';
      this.deliveryChains = [];
      this.$router.history.replace({ params: { issue: key } });
    },
  },
  data() {
    return {
      showConfirmModal: false,
      showAddEditVariableModal: false,
      showAddModifVariableModal: false,
      showAddModifTemplateModal: false,
      selectedVariable: {},
      notAddedVariable: {},
      notAddedVariableVal: '',
      varAction: '',
      error: '',
      varMsg: '',
      action: '',
      form: {
        type_id: 'cms',
        issue_id: '',
        visible: 1,
        active: 1,
        delivery_chain_id: '',
        instance_status: '',
      },
      deliveryChain: {},
      instanceStatuses: [],
      instances: [],
      submitStatus: 'PENDING',
      issueStatus: '',
      confirmMsg: '',
      modifications: [],
      selectedTemplate: null,
      ttsKey: this.$route.params.issue,
      deliveryChains: [],
    };
  },
  validations: {
    deliveryChain: {
      required,
    },
    modifications: {
      required,
    },
    ttsKey: {
      required,
      validKey(value) {
        return /^[A-Z]+-[0-9]+$/.test(value);
      },
    },
  },
  computed: {
    issue() {
      return this.$store.state.cms.issue;
    },
    searchTemplate() {
      let sourcePath = '';
      let sourceName = '';
      if (this.selectedTemplate !== null) {
        const regex = /(.+)(?:\/)(.+(_tpl)|(_bin))/;
        [this.selectedTemplate, sourcePath, sourceName] = this.selectedTemplate.match(regex);
        // remove '/' char from the beginning or end of the address
        sourcePath = sourcePath.replace(/^\/|\/$/, '');
      }
      return {
        add: true,
        selectedTemplate: { source_path: sourcePath, source_name: sourceName },
      };
    },
  },
  methods: {
    changeIssue() {
      this.issueStatus = '';
      this.deliveryChains = [];
      this.deliveryChain = {};
      this.form.delivery_chain_id = '';
      this.modifications = [];
    },
    closeModal(modal) {
      switch (modal) {
        case 'add-modif-variable':
          this.showAddModifVariableModal = false;
          break;
        case 'add-new-variable':
          this.varMsg = '';
          this.showAddEditVariableModal = false;
          break;
        case 'add-template-variable':
          this.showAddModifTemplateModal = false;
          break;
        default:
          break;
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
    async loadData() {
      this.getInstanceStatus();
      this.$store.dispatch('cms/getVariables');
    },
    addTemplate(template) {
      if (template) {
        this.modifications.push({
          name: template.template.path_and_name,
          version: template.revision.revision,
          revision_converted: template.revision.revision_converted,
          subtype: {
            key: 'cms_source',
          },
        });
        this.addCMSDeployCmd();
      }
    },
    addVariable(value, variable) {
      this.notAddedVariable = value;
      this.selectedVariable.name = variable.name.toUpperCase();
      this.notAddedVariableVal = variable.value;
      if (variable.cmsDeployCmd) {
        this.addCMSDeployCmd();
      }
      if (variable.defaultValue) {
        if (variable.currDbData.description) {
          return this.modifications.push(value);
        }
        this.selectedVariable.value = variable.currDbData.value;
        this.varMsg = 'Varible does not have description, please add it.';
        this.varAction = 'edit';
      } else {
        this.selectedVariable.value = variable.value;
        this.varAction = 'create';
        this.varMsg = 'Varible not found in config defaults, please add it.';
      }
      this.showAddEditVariableModal = true;
      return this.showAddEditVariableModal;
    },
    addCMSDeployCmd() {
      this.modifications.push({
        name: 'cms resolve_template', // ${template.template.source_name}`,
        subtype: {
          key: 'cms_cmd',
        },
      });
      this.modifications.push({
        name: 'cms deploy_config', // ${template.template.source_name}`,
        subtype: {
          key: 'cms_cmd',
        },
      });
    },
    addNewVariable(value) {
      this.notAddedVariable.name = `cms set_variable ${value.data.name}='${this.notAddedVariableVal}'`;
      this.modifications.push(this.notAddedVariable);
      this.notAddedVariable = '';
    },
    async getIssue() {
      this.changeIssue();
      if (this.$route.params.issue) {
        const loader = this.$loading.show({ container: this.$el });
        await this.$store.dispatch('cms/getIssue', this.$route.params.issue)
          .then(() => {
            this.form.issue_id = this.$store.state.cms.issue.id;
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
    async getInstanceStatus() {
      this.$M.Tooltip.init(this.$refs.tooltip);
      await this.$store.dispatch('cms/getInstanceStatus');
      this.instanceStatuses = this.$store.state.cms.instanceStatus;
      this.form.instance_status = this.instanceStatuses.find((is) => is.value === 'Installer decision').id;
    },
    selectedDeliveryChain(value) {
      this.form.delivery_chain_id = value.id;
      this.getInstances(value);
    },
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.$store.state.cms.error = '';
      const loader = this.$loading.show({ container: this.$el });
      this.modifications.reduce(async (previousPromise, m) => {
        await previousPromise;
        return this.$store.dispatch('cms/addModification', { ...this.form, ...m });
      }, Promise.resolve()).then(() => {
        if (this.$store.state.cms.error) {
          this.error = this.$store.state.cms.error;
          this.confirmMsg = 'Could not create modification';
        } else {
          this.confirmMsg = 'Modification has been successfully created! Do you want to proceed to MMPI?';
          this.showConfirmModal = true;
        }
        loader.hide();
      });
    },
    customConfirm() {
      this.modifications = [];
      this.showConfirmModal = false;
      this.confirmMsg = '';
      window.open(`${config.mmpi.web}/issue/${this.$route.params.issue}`, '_blank');
    },
  },
};
</script>
<style lang="scss" scoped>

.card-inner {
    width: 45%;
    margin: 2rem 0rem 2rem 2rem;
}
.silver-text {
  padding-left: 3rem;
}
label {
  margin-left: 3.4rem;
}
.click {
  cursor: pointer;
}
</style>
