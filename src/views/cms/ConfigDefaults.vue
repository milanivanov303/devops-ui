<template>
  <div class="row">
    <div class="col s12">
      <div class="data-table">
        <div class="row">
          <h1 class="center-align col s12">Config Defaults</h1>
        </div>
        <Alert v-if="error" :msg="error"/>
        <div v-if="loading || defaultVariables.length === 0" class="center" >
          <Preloader class="big"/>
        </div>
        <Table
          v-else
          :data="defaultVariables"
          sort-by="name"
          sort-dir="asc"
          @add="openAddEditVariableModal({}, 'create')"
          @edit="(row) => openAddEditVariableModal(row, 'edit')"
          :export-btn="false"
          :view-btn="false"
          :add-btn="$auth.can('can-manage-config-defaults')"
          :edit-btn="$auth.can('can-manage-config-defaults')"
          :delete-btn="false">
          <Column show="id" />
          <Column show="name" />
          <Column show="value" />
          <Column
            label="Value"
            :show="row => row.sensitive_data ? '*********' : row.value"
          />
          <Column show="description" />
          <template v-slot:actions-before="{ row }">
            <a @click="openInterfacesModal(row)" class="right" title="Check Variable">
              <i class="material-icons">find_replace</i>
            </a>
          </template>
        </Table>
        <CreateConfigDefault
          v-if="showAddEditVariableModal"
          @close="closeModal()"
          @addedVariable="closeModal()"
          @error="(err) => this.error = err"
          :selectedVariable="selectedVariable"
          :action="action"/>

        <Modal
          v-if="showInterfacesModal"
          @close="closeInterfacesModal()"
          class="right-sheet">
          <template v-slot:header>
            <div>Check variable <b>{{selectedVariable.name}}</b> in templates from instance</div>
          </template>
          <template v-slot:content>
            <form class="col s12 l11" ref="interfaces">
              <div class="row">
                <Select
                  class="col s12"
                  label="Instances"
                  icon="storage"
                  displayed="name"
                  :options="instances"
                  v-model="instance"
                  @change="checkInTemplates"
                />
              </div>
              <SwitchBox
                v-show="templates.options"
                class="switch-box"
                :request="templates"
              />
              <span v-if="error">{{error}}</span>
            </form>
          </template>
          <template v-slot:footer>
          </template>
        </Modal>

      </div>
    </div>
  </div>
</template>

<script>
import CreateConfigDefault from '@/components/cms/CreateConfigDefault';
import SwitchBox from '@/components/partials/SwitchBox';

export default {
  components: {
    SwitchBox,
    CreateConfigDefault,
  },
  data() {
    return {
      showAddEditVariableModal: false,
      showInterfacesModal: false,
      selectedVariable: {},
      action: '',
      error: '',
      instance: {},
      templates: {},
      loading: false,
    };
  },
  computed: {
    defaultVariables() {
      return this.$store.state.cms.variables;
    },
    instances() {
      return this.$store.state.mmpi.devInstances;
    },
  },

  methods: {
    openAddEditVariableModal(variable, action) {
      this.showAddEditVariableModal = true;
      this.selectedVariable = { ...variable };
      this.action = action;
    },
    closeModal() {
      this.showAddEditVariableModal = false;
    },
    openInterfacesModal(variable) {
      this.showInterfacesModal = true;
      this.selectedVariable = { ...variable };
    },
    closeInterfacesModal() {
      this.showInterfacesModal = false;
      this.instance = {};
      this.templates = {};
      this.error = '';
    },
    checkInTemplates(instance) {
      console.log(instance);
      this.error = '';
      const loader = this.$loading.show({ container: this.$refs.interfaces });
      const payload = {
        instance: instance.host,
        instance_user: instance.user,
        param: this.selectedVariable.name,
        commands: [
          'list_template',
        ],
      };
      this.$store.dispatch('cms/checkVariableTemplates', payload)
        .then((response) => {
          loader.hide();
          this.templates = {
            header: `${this.selectedVariable.name} templates on ${instance.name}`,
            options: response.list_template,
          };

          if (response.list_template.length === 0) {
            this.error = `The variable does not exist in any tamplates on ${instance.name}`;
          }
        })
        .catch((error) => {
          loader.hide();
          this.templates = {};
          this.error = `${error}: Could not connect to ${instance.name}`;
        });
    },
  },

  created() {
    this.loading = true;
    this.$store.dispatch('cms/getVariables')
      .then(() => {
        this.loading = false;
      });
    this.$store.dispatch('mmpi/getDevInstances');
  },
};
</script>
