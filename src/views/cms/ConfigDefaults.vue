<template>
  <div class="row">
    <div class="col s12 l12">
      <div class="data-table">
        <div class="row">
          <h1 class="card-title center-align col s12 l12">Config Defaults</h1>
        </div>
        <Table 
          :data="defaultVariables"
          :pagination="false"
          @add="isClicked = true"
          @edit="(row) => details(row, 'details')"
          :perPage="5000"
          sort-by="name"
          sort-dir="asc"
          :export-btn="false"
          :view-btn="false"
          :add-btn="$auth.can('can-manage-config-defaults')"
          :edit-btn="$auth.can('can-manage-config-defaults')"
          :delete-btn="false">
          <Column
              show="id"
          />
          <Column
              show="name"
          />
          <Column
              show="value"
          />
          <Column
              label="Description"
              show="description"
          />
        </Table>
        <create-modal v-if="isClicked"
                      @return="isClicked = false"></create-modal>
        <div @submit.prevent="onSubmit" id="action" ref="config-info" class="modal right-sheet">
          <div class="frame">
            <div class="modal-content">
              <h3 class="center">Variable Information</h3>
              <Alert
                v-if="error !== ''"
                :msg="error"/>
              <form>
                <div class="row">
                  <div class="input-field col s12">
                    <i class="material-icons prefix">label_outline</i>
                    <input
                      disabled
                      id="variable_name"
                      type="text"
                      v-model="selectedVariable.name">
                    <label for="variable_name" class="active">Variable Name</label>
                  </div>
                </div>
                <div class="row">
                  <div class="input-field col s12">
                    <i class="material-icons prefix">label_outline</i>
                    <label for="up_variable_value" class="active">Variable Value</label>
                    <input
                      disabled
                      id="up_variable_value"
                      type="text"
                      v-model="selectedVariable.value">
                  </div>
                </div>
                <div class="row">
                  <div class="input-field col s12">
                    <i class="material-icons prefix">mode_edit</i>
                    <textarea id="variable_description"
                              class="materialize-textarea"
                              v-model.trim="selectedVariable.description"></textarea>
                    <label for="icon_prefix2" class="active">Description</label>
                  </div>
                </div>
                <div class="row">
                  <Select class="col s12" v-if="modal.isOpen"
                          label="Codix Team"
                          icon="group"
                          displayed="name"
                          :selected="this.$store.getters['cms/getOneCodixTeam'](this.selectedVariable.codix_team_id)"
                          :options="codixTeams"
                          v-model="selectedVariable.codix_team"
                          @change="selectedCodixTeam"/>
                </div>
                <div class="row">
                  <div class="input-field col s12 m6 l6">
                    <button
                      v-if="$auth.can('can-manage-config-defaults')"
                      class="btn waves-effect waves-light right"
                      type="submit"
                      name="action">
                      Update</button>
                  </div>
                  <div class="input-field col s12 m6 l6">
                    <a href="#!"
                      @click="cancel"
                        class="modal-close waves-effect waves-blue btn-flat left">Close</a>
                  </div>
                  <div class="row">
                    <Select
                      class="col s12"
                      label="Instances"
                      icon="storage"
                      displayed="name"
                      helperText="Check variable in templates from instance"
                      :options="instances"
                      v-model="instance"
                      @change="checkInTemplates"
                    />
                  </div>
                  <SwitchBox
                    v-show="templates.options"
                    class="switch-box"
                    :request="templates"/>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CreateConfigDefault from '@/components/cms/CreateConfigDefault';
import SwitchBox from '@/components/partials/SwitchBox';

export default {
  components: {
    'create-modal': CreateConfigDefault,
    SwitchBox,
  },
  mounted() { 
    this.prepareData();
  },
  data() {
    return {
      instance: {},
      templates: {},
      error: '',
      selectedVariable: {
        name: '',
        value: '',
        description: '',
      },
      modal: {
        isOpen: false,
      },
      isClicked: false,
    };
  },
  computed: {
    defaultVariables() {
      return this.$store.state.cms.variables;
    },
    instances() {
      return this.$store.state.mmpi.devInstances;
    },
    codixTeams() {
      return this.$store.state.cms.codixTeams;
    }
  },
  methods: {
    async prepareData() {
      await this.loadDefaultVariables();
      await this.loadInstances();
    },
    loadDefaultVariables() {
      const loader = this.$loading.show({ container: this.$el });
      const payload = {
        orders: JSON.stringify({ name: 'asc' }),
        limit: '1000000',
      };
      this.$store.dispatch('cms/getVariables', payload).then(() => {
        loader.hide();
      });
      this.$store.dispatch('cms/getCodixTeams');
    },
    selectedCodixTeam(codixTeam) {
      this.selectedVariable.codix_team_id = codixTeam.id;
    },
    details(variable) {
      this.selectedVariable = Object.assign({}, variable);
      
      if (this.selectedVariable.codix_team_id) {
        this.selectedVariable.codix_team = this.codixTeams.find(
          codixTeam => codixTeam.id === this.selectedVariable.codix_team_id,
        );
      }

      this.$M.Modal.init(this.$refs['config-info'], {
        dismissible: false,
        onOpenStart: this.modal.isOpen = true,
        preventScrolling: false,
      }).open();
    },
    cancel() {
      this.$M.Modal.init(this.$refs['config-info']).close();
      this.templates = {};
      this.instance = {};
      this.error = '';
      this.modal.isOpen = false;
    },
    async checkInTemplates(instance) {
      const loader = this.$loading.show({ container: this.$refs['config-info'] });
      const payload = {
        instance: instance.host,
        instance_user: instance.user,
        param: this.selectedVariable.name,
        commands: [
          'list_template',
        ],
      };
      await this.$store.dispatch('cms/checkVariableTemplates', payload)
        .then((response) => {
          this.templates = {
            header: `${this.selectedVariable.name} templates`,
            options: response.list_template,
          };

          if (response.list_template.length === 0) {
            this.error = `The variable does not exist in any tamplates on ${instance.name}`;
          }
        })
        .catch((error) => {
          this.templates = {};
          this.error = `${error}: Could not connect to ${instance.name}`;
        });
      loader.hide();
    },
    onSubmit() {
      const loader = this.$loading.show({ container: this.$el });
      this.$store.dispatch('cms/submitVariable', this.selectedVariable).then(() => {
        loader.hide();
      });
      this.cancel();
    },
    async loadInstances() {
      await this.$store.dispatch('mmpi/getDevInstances');
    },
  },
};
</script>
