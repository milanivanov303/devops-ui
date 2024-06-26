<template>
  <div class="row">
    <div class="col s12">
      <div class="data-table">
        <div class="row">
          <h1 class="center-align col s12">Response Files</h1>
        </div>
        <form @submit.prevent="submitted">
          <div class="row">
            <Select
                class="col s6"
                label="Projects"
                icon="laptop_mac"
                displayed="name"
                :options="getProjects"
                v-model="project"
                @change="selectedProject"
            />
            <Select
                class="col s6"
                label="Delivery chains"
                icon="linear_scale"
                displayed="title"
                :options="getDeliveryChains"
                v-model="deliveryChain"
                @change="selectedDeliveryChain"
            />
          </div>
        </form>
        <Table
            v-if="$store.getters['cms/getRspVariables'].length"
            :data="getVariables"
            :pagination="true"
            @add="isClicked = true"
            sort-by="name"
            sort-dir="asc"
            :export-btn="false"
            :view-btn="false"
            :add-btn="false"
            :edit-btn="true"
            :delete-btn="false"
            @edit="row => details(row, 'details')">
          <Column show="id"/>
          <Column show="name"/>
          <Column
              label="Default Variable"
              :show="row => row.default_variable ? row.default_variable.value : ''"
          />
          <Column
              label="Last change"
              :show="row => row.made_on"
          />
          <Column class="custom-size" v-for="(instance, key) in this.$store.state.cms.instances"
                  v-bind:key="key"
                  :label="instance.name"
                  :show="row => getInstanceValue(row, instance)"
          />
        </Table>

        <Modal
            ref="rsp-info"
            v-if="modalIsOpen"
            @close="cancel()"
            class="right-sheet">
          <template v-slot:header>
            <div>{{modalData.name}} information</div>
          </template>
          <template v-slot:content>
            <form class=" col s12 l11">
              <div class="row">
                <div class="input-field col s12">
                  <i class="material-icons prefix">label_outline</i>
                  <input class="read-only"
                         id="variable_name"
                         type="text"
                         :value="modalData.name">
                  <label for="variable_name" class="active">Variable Name</label>
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
                  <label for="variable_value" class="active">Variable Value</label>
                  <input disabled
                         id="variable_value"
                         type="text"
                         v-model="modalData.value">
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                  <i class="material-icons prefix">label_outline</i>
                  <label for="default_value" class="active">Default Value</label>
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
                  <label for="default_description" class="active">Default Description</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                  <i class="material-icons prefix">mode_edit</i>
                  <textarea :disabled="isDisabled"
                            id="variable_description"
                            class="materialize-textarea"
                            v-model="modalData.description"></textarea>
                  <label for="variable_description" class="active">Description</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                  <i class="material-icons prefix">label_outline</i>
                  <label for="codix_team" class="active">Codix Team</label>
                  <input disabled
                         id="codix_team"
                         type="text"
                         :value="modalData.codix_team.name">
                </div>
              </div>
            </form>
          </template>
          <template v-slot:footer>
            <button
                class="btn waves-effect waves-light"
                type="submit"
                name="action"
                @click="onSubmit()"
            >
              Save
            </button>
          </template>
        </Modal>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      instance: {},
      project: {},
      deliveryChain: {},
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
      return this.$store.getters['cms/getRspVariables'];
    },
    isDisabled() {
      // enable when a variable is selected
      return this.modalData.id === '';
    },
  },
  methods: {
    getInstanceValue(row, instance) {
      return row[instance.name] ? row[instance.name].value : '';
    },
    loadVariables() {
      const loader = this.$loading.show({ container: this.$el });
      const payload = {
        instance_id: `in ${this.$store.state.cms.instances.map((a) => a.id).join(',')}`,
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
      this.modalIsOpen = true;
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
  mounted() {
    this.loadProjects();
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'cms/updateVariable') {
        this.$store.state.cms.rspVariables
          .filter((a) => a.name === mutation.payload.name)
          .map((a) => {
            a.default_variable = mutation.payload;
            return a.default_variable;
          });
      }
    });
    this.$store.dispatch('cms/getCodixTeams');
  },
};
</script>

<style lang="scss">
.custom-size{
  word-break: break-word;
}
</style>
