<template>
  <div class="row">
    <h1 class="center">CMS Modification</h1>
    <custom-confirm
      ref="custom-confirm"
      :message="confirmMsg"
      @selectedVal="customConfirm"/>
    <form>
      <div class="row">
        <div class="input-field col s5">
          <i class="material-icons prefix">settings_applications</i>
          <label for="issue" class="active">Issue</label>
          <input
            disabled
            id="issue"
            type="text"
            v-model="issue.tts_id">
        </div>
        <div class="input-field col s1">
          <a
            class="btn-floating btn-small waves-effect waves-light tooltipped"
            data-position="right"
            data-tooltip="Change issue"
            ref="tooltip"
            @click="selectIssue()">
            <i class="material-icons">cached</i>
          </a>
        </div>
      </div>
      <div class="row">
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
              @close="closeModal('add-template-variable')"/>
          </div>
        </div>
      </div>
      <!-- <div class="row">
        <search-tmp :data="searchTemplate" @return="addTemplate" class="col s12"/>
      </div> -->
      <div v-if="modifications.length">
        <inserts :modifications="modifications"/>
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
    <Issue ref="issue"/>
    <CreateConfigDefault
      v-if="showAddEditVariableModal"
      @close="closeModal('add-new-variable')"
      @addedVariable="addNewVariable"
      :issue="issue.tts_id"
      :selectedVariable="selectedVariable"
      :msg="varMsg"
      :action="'create'"/>
  </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';
import Issue from '@/components/partials/Issue';
import CustomConfirm from '@/components/partials/CustomConfirm';
import config from '@/config';
import Inserts from '@/components/partials/Inserts';
// import SearchTemplate from '@/components/cms/SearchTemplate';
import CreateConfigDefault from '@/components/cms/CreateConfigDefault';
import AddVariableModif from '@/components/cms/AddVariableModif';
import AddTemplateModif from '@/components/cms/AddTemplateModif';

export default {
  components: {
    Issue,
    'custom-confirm': CustomConfirm,
    inserts: Inserts,
    // 'search-tmp': SearchTemplate,
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
  data() {
    return {
      showAddEditVariableModal: false,
      showAddModifVariableModal: false,
      showAddModifTemplateModal: false,
      selectedVariable: {},
      notAddedVariable: {},
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
      instance: {},
      instances: [],
      submitStatus: 'PENDING',
      confirmMsg: [],
      modifications: [],
      selectedTemplate: null,
    };
  },
  validations: {
    deliveryChain: {
      required,
    },
    modifications: {
      required,
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
    deliveryChains() {
      if (this.$store.state.cms.issue) {
        return this.$store.state.cms.issue.project.delivery_chains;
      }
      return [];
    },
  },
  methods: {
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
        ...this.instances,
      ];
    },
    filterChains(roles, type) {
      return this.deliveryChains.reduce((acc, chain) => {
        if (roles.includes(chain.dc_role.key)
          && chain.type.type === type) {
          chain.instances
            .filter(instance => instance.instance_type_id !== 'DEV')
            .map(instance => acc.push(instance));
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
        this.modifications.push({
          name: `cms resolve_template ${template.template.source_name}`,
          subtype: {
            key: 'cms_cmd',
          },
        });
        this.modifications.push({
          name: `cms deploy_config ${template.template.source_name}`,
          subtype: {
            key: 'cms_cmd',
          },
        });
      }
    },
    addVariable(value, variable) {
      if (variable.defaultValue) {
        return this.modifications.push(value);
      }
      this.varMsg = 'Varible not found in config defaults, please add it.';
      this.notAddedVariable = value;
      this.selectedVariable = {
        name: variable.name.toUpperCase(),
        value: variable.value,
      };
      this.showAddEditVariableModal = true;
      return this.showAddEditVariableModal;
    },
    addNewVariable(value) {
      this.notAddedVariable.name = `cms set_variable ${value.data.name}='${value.data.value}'`;
      this.modifications.push(this.notAddedVariable);
    },
    selectIssue() {
      return this.$refs.issue.openModal();
    },
    async getIssue() {
      // if issue exists
      if (this.$store.state.cms.issue) {
        this.form.issue_id = this.$store.state.cms.issue.id;
      } else if (this.$route.params.issue) { // when the issue is send as param in the url
        await this.$store.dispatch('cms/getIssue', this.$route.params.issue);
        this.form.issue_id = this.$store.state.cms.issue.id;
      } else { // open modal to select Issue
        this.selectIssue();
      }
    },
    async getInstanceStatus() {
      this.$M.Tooltip.init(this.$refs.tooltip);
      await this.$store.dispatch('cms/getInstanceStatus');
      this.instanceStatuses = this.$store.state.cms.instanceStatus;
      this.form.instance_status = this.instanceStatuses.find(is => is.value === 'Installer decision').id;
    },
    selectedDeliveryChain(value) {
      this.form.delivery_chain_id = value.id;
      this.getInstances(value);
    },
    onSubmit() {
      this.$v.deliveryChain.$touch();
      this.$v.modifications.$touch();
      this.$v.currentVariable.$reset();
      this.$v.instance.$reset();
      if (this.$v.deliveryChain.$invalid
          || this.$v.modifications.$invalid) {
        return;
      }
      this.$store.state.cms.error = '';
      const loader = this.$loading.show({ container: this.$el });
      if (this.currentVariable.status !== 'ERROR') {
        this.modifications.reduce(async (previousPromise, m) => {
          await previousPromise;
          return this.$store.dispatch('cms/addModification', { ...this.form, ...m });
        }, Promise.resolve()).then(() => {
          if (this.$store.state.cms.error) {
            this.confirmMsg = ['Could not create modification!'];
          } else {
            this.confirmMsg = ['Modification has been successfully created!', 'Do you want to proceed to MMPI?'];
          }
          this.$refs['custom-confirm'].openModal();
          loader.hide();
        });
      }
    },
    customConfirm(value) {
      if (value) {
        window.location.href = `${config.mmpi.web}/issue/${this.$route.params.issue}`;
      } else {
        this.confirmMsg = '';
      }
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
