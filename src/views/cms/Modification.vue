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
        <div class="col s6">
          <Select
            label="Instance status"
            icon="power_settings_new"
            displayed="value"
            v-model="instanceStatus"
            :options="instanceStatuses"
            :invalid="$v.instanceStatus.$error"
            @blur="$v.instanceStatus.$touch()"
            @change="selectedInstanceStatus"
          />
          <div class="validator red-text" v-if="$v.instanceStatus.$error">
            <span v-if="!$v.instanceStatus.required">Instance status field is required.</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col s3">
          <div class="input-field">
            <i class="material-icons prefix">label_outline</i>
            <label for="name" class="active">Variable Name</label>
            <input
              id="name"
              type="text"
              v-model="currentVariable.name"
              @change="resetCurrentVariable">
          </div>
          <div class="validator">
            <div class="silver-text" v-if="currentVariable.status === 'PENDING'">
                <p>Loading...</p>
            </div>
          </div>
          <div class="validator red-text" v-if="$v.currentVariable.name.$error">
            <span v-if="!$v.currentVariable.name.required">Field is required!</span>
          </div>
        </div>
        <div class="input-field col s1">
          <a
            class="btn-floating btn-small waves-effect waves-light tooltipped"
            data-position="right"
            data-tooltip="Check in templates"
            ref="tooltip"
            @click="checkVariable()">
            <i class="material-icons">cached</i>
          </a>
        </div>
        <div class="col s3">
          <div class="input-field">
            <i class="material-icons prefix">label_outline</i>
            <label for="name" class="active">Variable Value</label>
            <input
              id="name"
              type="text"
              v-model="currentVariable.value">
          </div>
          <div class="validator red-text" v-if="$v.currentVariable.value.$error">
            <span v-if="!$v.currentVariable.value.required">Field is required!</span>
          </div>
        </div>
        <div class="col s4">
          <Select
            label="Instances"
            icon="storage"
            displayed="name"
            v-model="instance"
            :options="instances"
            :customOption="customOptions.instances"
          />
          <div class="validator red-text" v-if="$v.instance.$error">
            <span v-if="!$v.instance.required">Field is required!</span>
          </div>
        </div>
        <div class="input-field col s1">
          <a class="btn-floating btn-small waves-effect waves-light tooltipped"
              data-position="right"
              data-tooltip="Add"
              ref="tooltip"
              @click="addVariable()"><i class="material-icons">add</i></a>
        </div>
        <div class="validator col s10">
          <div class="red-text"
                v-if="!currentVariable.defaultValue && currentVariable.status === 'OK'">
            <span>Variable does not exist in config.defaults</span>
          </div>
          <div class="red-text"
                v-if="!templates.length && currentVariable.status === 'OK'">
            <span>Variable does not exist in any template</span>
          </div>
          <div class="red-text" v-if="currentVariable.status === 'ERROR'">
            <span>Something went wrong</span>
          </div>
        </div>
      </div>
      <div v-if="templates.length" class="row">
        <table class="responsive-table striped col s8 offset-s2">
          <thead>
            <tr>
              <th>Varible was found in these templates:</th>
            </tr>
          </thead>
          <tbody>
            <tr class="click" v-for="(template, key) in templates"
                  v-bind:key="key"
                  @click="selectedTemplate = template">
              <td>{{template}}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="row">
        <search-tmp :data="searchTemplate" @return="addTemplate" class="col s12"/>
      </div>
      <inserts
        v-if="modifications"
        :modifications="modifications"/>
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
        <div class="input-field col s12 m6 l6">
          <button class="btn waves-effect waves-light right"
                  type="button"
                  name="action"
                  @click="onSubmit">Add</button>
        </div>
        <div class="input-field col s12 m6 l6">
          <a href="#!"
              class="modal-close waves-effect waves-blue btn-flat left">Close</a>
        </div>
      </div>
    </form>
    <Issue ref="issue"/>
  </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';
import Issue from '@/components/partials/Issue';
import CustomConfirm from '@/components/partials/CustomConfirm';
import config from '@/config';
import Inserts from '@/components/partials/Inserts';
import SearchTemplate from '@/components/cms/SearchTemplate';

export default {
  components: {
    Issue,
    'custom-confirm': CustomConfirm,
    inserts: Inserts,
    'search-tmp': SearchTemplate,
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      form: {
        type_id: 'cms',
        issue_id: '',
        visible: 1,
        active: 1,
        delivery_chain_id: '',
        instance_status: '',
      },
      deliveryChain: {},
      instanceStatus: {},
      instanceStatuses: [],
      customOptions: {
        instances: {
          text: 'All',
          value: 'All',
        },
      },
      instance: {},
      instances: [],
      submitStatus: 'PENDING',
      confirmMsg: [],
      templates: [],
      modifications: [],
      currentVariable: {
        name: '',
        value: '',
        status: '',
        defaultValue: '',
      },
      selectedTemplate: null,
    };
  },
  validations: {
    deliveryChain: {
      required,
    },
    instanceStatus: {
      required,
    },
    modifications: {
      required,
    },
    currentVariable: {
      name: {
        required,
      },
      value: {
        required,
      },
    },
    instance: {
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
    async getInstances(deliveryChain) {
      console.log('Get INSTANCES - delivery_chain.dc_role');
      console.log(deliveryChain);
      if (deliveryChain.dc_role) {
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
            break;
        }
      }
      console.log('INSTANCES');
      console.log(this.instances);
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
      await this.getIssue();
      await this.getInstanceStatus();
    },
    resetCurrentVariable() {
      this.currentVariable.status = '';
      this.currentVariable.defaultValue = '';
      this.templates = [];
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
    addVariable() {
      if (this.currentVariable.name && this.currentVariable.value) {
        this.modifications.push({
          name: `cms set_variable ${this.currentVariable.name.toUpperCase()}='${this.currentVariable.value}'`,
          subtype: {
            key: 'cms_cmd',
          },
          contents: this.instance === 'All' ? 'All' : this.instance.id.toString(),
        });
        this.currentVariable = {};
        this.templates = [];
      } else {
        this.$v.currentVariable.$touch();
        this.$v.instance.$touch();
      }
    },
    selectIssue() {
      return this.$refs.issue.openModal();
    },
    async getIssue() {
      // if issue exists
      if (this.$store.state.cms.issue) {
        this.form.issue_id = this.$store.state.cms.issue.id;
      } else if (this.$route.params.issue) { // when the issue is send as param in the url
        const loader = this.$loading.show({ container: this.$el });

        await this.$store.dispatch('cms/getIssue', this.$route.params.issue);
        this.form.issue_id = this.$store.state.cms.issue.id;
        loader.hide();
      } else { // open modal to select Issue
        this.selectIssue();
      }
    },
    async getInstanceStatus() {
      const loader = this.$loading.show({ container: this.$el });
      this.$M.Tooltip.init(this.$refs.tooltip);
      await this.$store.dispatch('cms/getInstanceStatus');
      this.instanceStatuses = this.$store.state.cms.instanceStatus;
      this.instanceStatus = this.instanceStatuses.find(is => is.value === 'Installer decision');
      this.selectedInstanceStatus(this.instanceStatus);
      loader.hide();
    },
    selectedDeliveryChain(value) {
      this.form.delivery_chain_id = value.id;
      this.getInstances(value);
    },
    selectedInstanceStatus(value) {
      this.form.instance_status = value.id;
    },
    onSubmit() {
      this.$v.deliveryChain.$touch();
      this.$v.modifications.$touch();
      this.$v.instanceStatus.$touch();
      this.$v.currentVariable.$reset();
      this.$v.instance.$reset();
      if (this.$v.deliveryChain.$invalid
          || this.$v.modifications.$invalid
          || this.$v.instanceStatus.$invalid) {
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
    async checkVariable() {
      // don't check if the field is empty
      if (this.currentVariable.name) {
        const variable = this.currentVariable.name
          .replace(/[^\w\s]/gi, '')
          .toUpperCase();
        this.resetCurrentVariable();
        this.currentVariable.status = 'PENDING';
        this.$store.dispatch('cms/getTemplates',
          {
            param: variable,
            commands: [
              'list_template',
              'get_variable_default',
            ],
          })
          .then((resp) => {
            const { data } = resp;
            if (data.list_template.length) {
              this.templates = data.list_template.map(t => t.replace('/app/imx/', ''));
            }
            if (data.get_variable_default.length) {
              this.currentVariable.defaultValue = data.get_variable_default;
            }
            this.currentVariable.status = 'OK';
          })
          .catch(() => {
            this.currentVariable.status = 'ERROR';
          });
      } else {
        this.$v.currentVariable.name.$touch();
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
