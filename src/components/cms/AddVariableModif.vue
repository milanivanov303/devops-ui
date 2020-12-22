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
          <div class="input-field">
            <i class="material-icons prefix">label_outline</i>
            <label for="name" class="active">Variable Name</label>
            <input
              id="name"
              type="text"
              v-model.trim="currentVariable.name"
              @change="resetCurrentVariable">
          </div>
          <div class="validator">
            <div class="silver-text" v-if="currentVariable.status === 'PENDING'">
                <p>Loading...</p>
            </div>
          <div class="validator red-text" v-if="$v.currentVariable.name.$error">
            <span v-if="!$v.currentVariable.name.required">Field is required!</span>
          </div>
            <div class="validator col s10">
              <div
                class="red-text"
                v-if="!currentVariable.defaultValue && currentVariable.status === 'OK'">
                <span>Variable does not exist in config.defaults</span>
              </div>
              <div
                class="red-text"
                v-if="!templates.length && currentVariable.status === 'OK'">
                <span>Variable does not exist in any template</span>
              </div>
              <div class="red-text" v-if="currentVariable.status === 'ERROR'">
                <span>Something went wrong</span>
              </div>
            </div>
          </div>
        </div>
        <div class="input-field col s1">
          <a
            class="btn-floating btn-small waves-effect waves-light tooltipped"
            data-position="top"
            data-tooltip="Check in templates"
            ref="tooltip"
            @click="checkVariable()">
            <i class="material-icons">cached</i>
          </a>
        </div>
        <div class="col s6">
          <div class="input-field">
            <i class="material-icons prefix">label_outline</i>
            <label for="name" class="active">Variable Value</label>
            <input
              id="name"
              type="text"
              v-model.trim="currentVariable.value">
          </div>
          <div class="validator red-text" v-if="$v.currentVariable.value.$error">
            <span v-if="!$v.currentVariable.value.required">Field is required!</span>
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
          />
          <div class="validator red-text" v-if="$v.instance.$error">
            <span v-if="!$v.instance.required">Field is required!</span>
          </div>
        </div>
      </div>
      <div v-if="templates.length" class="row">
        <table class="responsive-table striped col s12">
          <thead>
            <tr>
              <th>Varible was found in these templates:</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="click" v-for="(template, key) in templates"
              v-bind:key="key">
              <!-- @click="selectedTemplate = template"> -->
              <td>{{template}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-slot:footer v-if="currentVariable.status !== 'PENDING'">
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
  },
  data() {
    return {
      showAddEditVariableModal: false,
      instance: {},
      templates: [],
      currentVariable: {
        name: '',
        value: '',
        status: '',
        defaultValue: '',
      },
      variableModif: [],
      error: '',
    };
  },
  validations: {
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
  mounted() {
    this.$M.Tooltip.init(this.$refs.tooltip);
  },
  methods: {
    resetCurrentVariable() {
      this.currentVariable.status = '';
      this.currentVariable.defaultValue = '';
      this.templates = [];
    },
    closeModal() {
      this.currentVariable = {
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
      // don't check if the field is empty
      if (this.currentVariable.name) {
        const variable = this.currentVariable.name
          .replace(/[^\w\s]/gi, '')
          .toUpperCase();
        this.resetCurrentVariable();
        this.currentVariable.status = 'PENDING';
        await this.$store.dispatch('cms/getOneVariable', variable)
          .then((resp) => {
            this.currentVariable.currDbData = resp.data.data;
          })
          .catch((error) => {
            this.error = error;
          });
        await this.$store.dispatch('cms/getTemplates',
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
    async addVariable() {
      await this.checkVariable();
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.variableModif = {
        name: `cms set_variable ${this.currentVariable.name.toUpperCase()}='${this.currentVariable.value}'`,
        subtype: {
          key: 'cms_cmd',
        },
        contents: this.instance.name === 'All' ? 'All' : this.instance.id.toString(),
      };
      this.$emit('addVariable', this.variableModif, this.currentVariable);
      this.closeModal();
    },
  },
};
</script>
