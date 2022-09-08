<template>
  <Modal
    @close="closeModal()"
    class="right-sheet">
    <template v-slot:header>
      <div>
        Add variable as modification
      </div>
    </template>
    <template v-slot:content>
      <div class="row">
        <div class="col s5">
          <Autocomplete
            label="Variable Name"
            icon="label_outline"
            :items="variables"
            v-model.trim="currentVariable"
            :invalid="$v.selectedVariable.name.$error"
          />
          <span class="helper-text">
            Check variable templates on: <b>{{devInstance.name}}</b>
            and config.defaults presence on <b>refbg2</b>
          </span>
          <div class="validator">
            <div class="silver-text" v-if="selectedVariable.status === 'PENDING'">
                <p class="red-text">Loading...</p>
            </div>
            <div class="validator red-text" v-if="$v.selectedVariable.name.$error">
              <span v-if="!$v.selectedVariable.name.required">Field is required!</span>
            </div>
            <div
              class="validator red-text"
              v-if="$v.selectedVariable.$error && !selectedVariable.status">
              <span v-if="!$v.selectedVariable.status.sameAs">Check variable first</span>
            </div>
            <div v-if="!loading" class="validator col s10">
              <div
                class="red-text"
                v-if="!selectedVariable.defaultValue && selectedVariable.status === 'OK'">
                <span>
                  Variable does not exist in config.defaults, add will be prompted in next step
                </span>
              </div>
              <div
                class="red-text"
                v-if="!templates.length && selectedVariable.status === 'OK'">
                <span>Variable does not exist in any template</span>
              </div>
              <div class="red-text" v-if="selectedVariable.status === 'ERROR'">
                <span>Something went wrong</span>
              </div>
            </div>
          </div>
        </div>
        <div class="input-field col s1">
          <a
            class="btn-floating btn-small waves-effect waves-light tooltipped"
            data-position="top"
            data-tooltip="Check variable"
            ref="tooltip"
            @click="checkVariable()">
            <i class="material-icons">cached</i>
          </a>
        </div>
        <div class="col s6" v-if="showVariableValueInput">
          <div class="input-field">
            <i class="material-icons prefix">label_outline</i>
            <label for="value" class="active">Variable Value</label>
            <input
              id="value"
              type="text"
              v-model.trim="selectedVariable.value">
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col s12">
          <Select
            label="Instances"
            icon="storage"
            displayed="name"
            v-model="instance"
            :options="instances"
            @change="filterInstancesId"
          />
          <div class="validator red-text" v-if="$v.instance.$error">
            <span v-if="!$v.instance.required">Field is required!</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col s12">
          <label>
            <input
              class="filled-in"
              type="checkbox"
              v-model="selectedVariable.cmsDeployCmd"/>
            <span>Add CMS deploy commands</span>
          </label>
        </div>
      </div>
      <div v-if="templates.length" class="row">
        <table class="responsive-table striped col s12">
          <thead>
            <tr>
              <th>Variable was found in these templates:</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="click"
              v-for="(template, key) in templates"
              v-bind:key="key">
              <!-- @click="selectedTemplate = template"> -->
              <td>{{template}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-slot:footer>
      <button
        class="btn waves-effect waves-light"
        type="button"
        name="action"
        @click="addVariable()">
        Add
      </button>
    </template>
  </Modal>
</template>

<script>
import { required } from 'vuelidate/lib/validators';

export default {
  props: {
    instances: {
      type: Array,
      required,
    },
    chain: {
      type: Object,
    },
  },
  data() {
    return {
      showAddEditVariableModal: false,
      instance: {},
      filteredInstances: '',
      templates: [],
      currentVariable: null,
      selectedVariable: {
        name: '',
        value: '',
        status: '',
        defaultValue: '',
      },
      variableModif: [],
      showVariableValueInput: false,
      loading: false,
      error: '',
    };
  },
  validations: {
    selectedVariable: {
      name: {
        required,
      },
      status: {
        required,
      },
    },
    instance: {
      required,
    },
  },
  mounted() {
    this.$M.Tooltip.init(this.$refs.tooltip);
  },
  watch: {
    currentVariable(value) {
      if (typeof value === 'string') {
        this.selectedVariable.name = value;
        this.showVariableValueInput = false;
        this.selectedVariable.value = '';
        return;
      }

      this.selectedVariable = { ...this.selectedVariable, ...value };
      this.selectedVariable.currDbData = value;
      this.selectedVariable.status = '';
    },
  },
  computed: {
    devInstance() {
      const [devInstance] = this.chain.instances
        .filter((instance) => instance.owner.key === 'codix')
        .filter((instance) => instance.instance_type_id === 'DEV')
        .filter((instance) => instance.instance_to_delivery_chain.instance_previous_id === null);
      return devInstance || 'refbg2';
    },
    variables() {
      return this.$store.state.cms.variables;
    },
  },
  methods: {
    filterInstancesId(value) {
      switch (value.name) {
        // case 'All except PROD':
        //   this.filteredInstances = this.chain.instances
        //     .filter((instance) => instance.instance_type_id !== 'PROD')
        //     .map((instance) => instance.id)
        //     .join(', ');
        //   break;
        case 'All':
          this.filteredInstances = 'All';
          break;
        default:
          this.filteredInstances = value.id.toString();
          break;
      }
    },
    resetselectedVariable() {
      this.selectedVariable.status = '';
      this.selectedVariable.defaultValue = '';
      this.templates = [];
    },
    closeModal() {
      this.selectedVariable = {
        name: '',
        value: '',
        status: '',
        defaultValue: '',
      };
      this.templates = [];
      this.error = '';
      this.$v.$reset();
      this.$emit('close');
    },
    async checkVariable() {
      if (!this.selectedVariable.name) {
        return this.$v.selectedVariable.name.$touch();
      }
      this.loading = true;
      const variable = this.selectedVariable.name
        .replace(/[^\w\s]/gi, '')
        .toUpperCase();
      this.resetselectedVariable();
      this.selectedVariable.status = 'PENDING';

      const promiseTemplate = this.$store.dispatch('cms/getTemplates',
        {
          instance: this.devInstance.name,
          instance_user: this.devInstance.user,
          param: variable,
          commands: [
            'list_template',
          ],
        })
        .then((resp) => {
          const { data } = resp;
          if (Object.values(data.list_template).length) {
            this.templates = Object.values(data.list_template);
          }
        });

      const promiseVariable = this.$store.dispatch('cms/getTemplates',
        {
          param: variable,
          instance_user: 'imx',
          commands: ['get_variable_default'],
        })
        .then((resp) => {
          const { data } = resp;
          if (data.get_variable_default.length) {
            this.selectedVariable.defaultValue = data.get_variable_default;
            if (this.selectedVariable.value === '') {
              this.selectedVariable.value = data.get_variable_default;
            }
          }
        });

      return Promise.all([promiseTemplate, promiseVariable])
        .then(() => {
          this.selectedVariable.status = 'OK';
          this.showVariableValueInput = true;
        })
        .catch(() => {
          this.selectedVariable.status = 'ERROR';
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async addVariable() {
      this.$v.$touch();
      if (this.$v.$invalid || this.loading) {
        return;
      }
      this.variableModif = {
        name: `cms set_variable ${this.selectedVariable.name.toUpperCase()}="${this.selectedVariable.value}"`,
        subtype: {
          key: 'cms_cmd',
        },
        contents: this.filteredInstances,
      };
      this.$emit('addVariable', this.variableModif, this.selectedVariable);
      this.closeModal();
    },
  },
  created() {
    this.loading = true;
    this.$store.dispatch('cms/getVariables')
      .then(() => {
        this.loading = false;
      });
  },
};
</script>
