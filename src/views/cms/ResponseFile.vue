<template>
  <div class="col s12 l12">
    <h1 class="card-title center-align">Response File</h1>
    <div class="frame">
      <form @submit.prevent="submitted">
        <div class="row">
          <Select
            class="col s6"
            label="Projects"
            icon="laptop_mac"
            displayed="name"
            :options="getProjects"
            @change="selectedProject"
          />
          <Select
            class="col s6"
            label="Delivery chains"
            icon="linear_scale"
            displayed="title"
            :options="getDeliveryChains"
            @change="selectedDeliveryChain"
          />
        </div>
      </form>
      <Table
        v-if="$store.getters['cms/getRspVariables'].length"
        :request="getVariables"
        :pagination="false"
        @add="isClicked = true">
        <template v-slot:buttons="{ data }">
          <a @click="details(data, 'details')" title="details">
            <i class="material-icons right">settings</i>
          </a>
        </template>
      </Table>
      <div @submit.prevent="onSubmit" id="action" ref="rsp-info" class="modal right-sheet">
        <div class="frame">
          <div class="modal-content">
            <h3 class="center">Variable Information</h3>
            <form>
              <div class="row">
                <div class="input-field col s12">
                  <i class="material-icons prefix">label_outline</i>
                  <input disabled
                        id="variable_name"
                        type="text"
                        :value="modalData.name">
                  <label for="icon_prefix2" class="active">Variable Name</label>
                </div>
              </div>
              <div class="row">
                <Select
                  class="col s12"
                  label="Instances"
                  icon="storage"
                  displayed="name"
                  v-model="instance"
                  :options="getInstances"
                  @change="selectedInstance"
                />
              </div>
              <div class="row">
                <div class="input-field col s12">
                  <i class="material-icons prefix">label_outline</i>
                  <label for="icon_prefix2" class="active">Variable Value</label>
                  <input disabled
                        id="variable_value"
                        type="text"
                        v-model="modalData.value">
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                  <i class="material-icons prefix">label_outline</i>
                  <label for="icon_prefix2" class="active">Default Value</label>
                  <input disabled
                        id="default_value"
                        type="text"
                        :value="modalData.default_variable.value">
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                  <i class="material-icons prefix">label_outline</i>
                  <textarea disabled
                            id="default_description"
                            class="materialize-textarea"
                            v-model="modalData.default_variable.description"></textarea>
                  <label for="icon_prefix2" class="active">Default Description</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                  <i class="material-icons prefix">mode_edit</i>
                  <textarea :disabled="isDisabled"
                            id="variable_description"
                            class="materialize-textarea"
                            v-model="modalData.description"></textarea>
                  <label for="icon_prefix2" class="active">Description</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                  <i class="material-icons prefix">label_outline</i>
                  <label for="icon_prefix2" class="active">Codix Team</label>
                  <input disabled
                        id="default_value"
                        type="text"
                        :value="modalData.codix_team.name">
                </div>
              </div>
              <div class="row">
              <div class="input-field col s12 m6 l6">
                <button class="btn waves-effect waves-light right"
                        type="submit"
                        name="action"
                        :disabled="isDisabled">
                        Update </button>
              </div>
              <div class="input-field col s12 m6 l6">
                <a href="#!"
                  @click="cancel"
                  class="modal-close waves-effect waves-blue btn-flat left">Close</a>
              </div>
            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Table from '@/components/partials/Table';

export default {
  // components: {
  //   Table,
  // },
  mounted() {
    this.loadProjects();
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'cms/updateVariable') {
        this.$store.state.cms.rspVariables
          .filter(a => a.name === mutation.payload.name)
          .map((a) => {
            a.default_variable = mutation.payload;
            return a.default_variable;
          });
      }
    });
    this.$store.dispatch('cms/getCodixTeams');
  },
  data() {
    return {
      instance: {},
      modalData: {
        id: '',
        name: '',
        value: '',
        default_variable: {
          value: '',
          description: '',
        },
        codix_team: {
          name: '',
        },
        description: '',
      },
      modalIsOpen: false,
    };
  },
  computed: {
    getInstances() {
      return this.$store.state.cms.instances;
      // selected: this.$store.state.cms.selectedInstance,
    },
    getProjects() {
      return this.$store.state.cms.projects;
      // selected: this.$store.state.cms.selectedProject
    },
    getDeliveryChains() {
      return this.$store.state.cms.deliveryChains;
      // this.$store.state.cms.selectedDeliveryChain,
    },
    getVariables() {
      const variables = {
        data: 'cms/getRspVariables',
        columns: {
          id: '',
          name: '',
          default_variable: 'value',
        },
        action: true,
        searchable: true,
      };
      // creating columns with instances names
      this.$store.state.cms.instances.map(a => a.name).forEach((e) => {
        variables.columns[e] = 'value';
        return variables.columns[e];
      });
      return variables;
    },
    isDisabled() {
      // enable when a variable is selected
      return this.modalData.id === '';
    },
  },
  methods: {
    loadVariables() {
      const loader = this.$loading.show({ container: this.$el });
      const payload = {
        instance_id: `in ${this.$store.state.cms.instances.map(a => a.id).join(',')}`,
        with: JSON.stringify({
          default_variable: {},
        }),
        limit: 1000000,
      };
      this.$store.dispatch('cms/getRspVariables', payload).then(() => {
        loader.hide();
      });
    },
    selectedProject(value) {
      this.$store.dispatch('cms/getSelectedProject', value);
      this.$store.dispatch('cms/getDeliveryChains', value);
      this.$store.dispatch('cms/getRspVariables', '');
    },
    loadProjects() {
      const loader = this.$loading.show({ container: this.$el });
      this.$store.dispatch('cms/getProjects').then(() => {
        loader.hide();
      });
    },
    selectedDeliveryChain(value) {
      this.$store.dispatch('cms/getSelectedDeliveryChain', value);
      this.$store.dispatch('cms/getInstances', value);
      this.$store.dispatch('cms/getRspVariables', '');
      this.loadVariables();
    },
    details(value) {
      this.modalData.name = value.name;
      if (value.default_variable) {
        this.modalData.default_variable.value = value.default_variable.value;
        this.modalData.default_variable.description = value.default_variable.description;
        if (value.default_variable.codix_team_id) {
          this.modalData.codix_team = this.$store.getters['cms/getOneCodixTeam'](value.default_variable.codix_team_id);
        }
      }
      this.$store.dispatch('cms/getSelectedInstance', '');
      this.$M.Modal.init(this.$refs['rsp-info'], {
        dismissible: false,
        onOpenStart: this.modalIsOpen = true,
      }).open();
    },
    selectedInstance(value) {
      this.$store.dispatch('cms/getSelectedInstance', value);
      const selectedVar = this.$store.getters['cms/getOneRspVariable']({ name: this.modalData.name, instance_id: value.id });
      if (selectedVar) {
        this.modalData.id = selectedVar.id;
        this.modalData.value = selectedVar.value;
        this.modalData.description = selectedVar.description;
      } else {
        this.modalData.id = '';
        this.modalData.value = 'Not Registered!';
        this.modalData.description = '';
      }
    },
    cancel() {
      this.$M.Modal.init(this.$refs['rsp-info']).close();
      this.instance = {};
      this.modalIsOpen = false;
      this.resetForm();
    },
    async onSubmit() {
      const payload = {
        id: this.modalData.id,
        description: this.modalData.description,
      };
      const loader = this.$loading.show({ container: this.$refs['rsp-info'] });
      await this.$store.dispatch('cms/updateRspVariable', payload);
      this.modalIsOpen = false;
      this.$M.Modal.init(this.$refs['rsp-info']).close();
      this.resetForm();
      loader.hide();
    },
    resetForm() {
      this.instance = {};
      this.modalData = {
        id: '',
        name: '',
        value: '',
        default_variable: {
          value: '',
          description: '',
        },
        codix_team: {
          name: '',
        },
        description: '',
      };
      // remove overflow
      document.body.removeAttribute('style');
    },
  },
};
</script>
