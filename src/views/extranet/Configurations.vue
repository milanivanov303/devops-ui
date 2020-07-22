<template>
  <div class="configurations">
    <div class="data-table">

      <Table
        :data="configurations"
        sort-by="project"
        sort-dir="asc"
        :export-btn="false"
        :view-btn="false"
        :add-btn="$auth.can('extranet.manage-configurations')"
        :edit-btn="$auth.can('extranet.manage-configurations')"
        :delete-btn="$auth.can('extranet.manage-configurations')"
        @add="openAddEditModal('create')"
        @edit="(row) => openAddEditModal('update', row)"
        @delete="openDeleteModal"
      >
        <Column show="project" :sortable="false" filter-type="search"/>
        <Column show="project_type" :sortable="false" filter-type="dropdown"/>
        <Column show="delivery_chain"/>
        <Column show="dev_instance"/>
        <Column show="val_instance"/>
        <Column show="app_type" :sortable="false" filter-type="dropdown"/>
        <Column show="app_version" :sortable="false" filter-type="dropdown"/>
        <Column show="branch" :sortable="false" filter-type="search"/>
        <Column show="prefix"/>
        <Column show="servlet_container"/>
        <Column show="jdk"/>
        <Column show="jre"/>
        <Column
          show="additional_info"
          v-if="
            $auth.can('extranet.manage-configurations')
            ||
            $auth.can('extranet.see-configurations-additional-info')
          "
        />
      </Table>

    </div>

    <Modal v-if="showAddEditModal" @close="closeAddEditModal()" class="right-sheet">
      <template v-slot:header>
        <span v-if="action === 'create'">Create </span>
        <span v-else>Update </span>
        configuration
      </template>
      <template v-slot:content>
        <div class="row">
          <Autocomplete
            class="col s12"
            label="Project"
            icon="list_alt"
            :items="projects"
            v-model="configuration.project"
            :invalid="$v.configuration.project.$error"
            @change="delete configuration.delivery_chain &&
                      delete configuration.dev_instance &&
                      delete configuration.val_instance"
            @blur="$v.configuration.project.$touch()"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.configuration.project.$error">
              <p v-if="!$v.configuration.project.required">Project field must not be empty.</p>
            </div>
          </div>
        </div>
        <div class="row">
          <Select
            class="col s12"
            label="Project type"
            icon="title"
            displayed="name"
            v-model="configuration.project_type"
            :options="projectTypes"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.configuration.project_type.$error">
              <p v-if="!$v.configuration.project_type.required">
                Project type field must not be empty.
              </p>
            </div>
          </div>
        </div>
        <div class="row">
          <Autocomplete
            class="col s12"
            label="Delivery chain"
            icon="refresh"
            valueKey="title"
            :items="deliveryChains"
            v-model="configuration.delivery_chain"
            :invalid="$v.configuration.delivery_chain.$error"
            @change="delete configuration.dev_instance && delete configuration.val_instance"
            @blur="$v.configuration.delivery_chain.$touch()"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.configuration.delivery_chain.$error">
              <p v-if="!$v.configuration.delivery_chain.required">
                Delivery chain field must not be empty.
              </p>
            </div>
          </div>
        </div>
        <div class="row">
          <Autocomplete
            class="col s12"
            label="Dev Instance"
            icon="dynamic_feed"
            :items="instances"
            v-model="configuration.dev_instance"
            :invalid="$v.configuration.dev_instance.$error"
            @blur="$v.configuration.dev_instance.$touch()"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.configuration.dev_instance.$error">
              <p v-if="!$v.configuration.dev_instance.required">
                Dev Instance field must not be empty.
              </p>
            </div>
          </div>
        </div>
        <div class="row">
          <Autocomplete
            class="col s12"
            label="Val Instance"
            icon="dynamic_feed"
            :items="instances"
            v-model="configuration.val_instance"
            :invalid="$v.configuration.val_instance.$error"
            @blur="$v.configuration.val_instance.$touch()"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.configuration.val_instance.$error">
              <p v-if="!$v.configuration.val_instance.required">
                Val Instance field must not be empty.
              </p>
            </div>
          </div>
        </div>
        <div class="row">
          <Select
            class="col s12"
            label="App type"
            icon="title"
            displayed="name"
            :options="appTypes"
            v-model="configuration.app_type"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.configuration.app_type.$error">
              <p v-if="!$v.configuration.app_type.required">App Type field must not be empty.</p>
            </div>
          </div>
        </div>
        <div class="row">
          <TextInput
            class="col s12"
            label="App Version"
            icon="history"
            v-model="configuration.app_version"
            :invalid="$v.configuration.app_version.$error"
            @blur="$v.configuration.app_version.$touch()"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.configuration.app_version.$error">
              <p v-if="!$v.configuration.app_version.required">
                App Version field must not be empty.
              </p>
            </div>
          </div>
        </div>
        <div class="row">
          <Autocomplete
            class="col s12"
            label="Branch"
            icon="merge_type"
            :items="branches"
            v-model="configuration.branch"
            :invalid="$v.configuration.branch.$error"
            @blur="$v.configuration.branch.$touch()"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.configuration.branch.$error">
              <p v-if="!$v.configuration.branch.required">Branch field must not be empty.</p>
            </div>
          </div>
        </div>
        <div class="row">
          <Autocomplete
            class="col s12"
            label="Prefix"
            icon="people"
            valueKey="package"
            :items="clients"
            v-model="configuration.prefix"
            :invalid="$v.configuration.prefix.$error"
            @blur="$v.configuration.prefix.$touch()"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.configuration.prefix.$error">
              <p v-if="!$v.configuration.prefix.required">Prefix field must not be empty.</p>
            </div>
          </div>
        </div>
        <div class="row">
          <TextInput
            class="col s12"
            label="Servlet container"
            icon="dns"
            v-model="configuration.servlet_container"
            :invalid="$v.configuration.servlet_container.$error"
            @blur="$v.configuration.servlet_container.$touch()"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.configuration.servlet_container.$error">
              <p v-if="!$v.configuration.servlet_container.required">
                Servlet container field must not be empty.
              </p>
            </div>
          </div>
        </div>
        <div class="row">
          <Autocomplete
            class="col s12"
            label="JDK"
            icon="history"
            :items="[1.4, 1.5, 1.6, 1.7, 1.8]"
            v-model.number="configuration.jdk"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.configuration.jdk.$error">
              <p v-if="!$v.configuration.jdk.required">JDK field must not be empty.</p>
            </div>
          </div>
        </div>
        <div class="row">
          <Autocomplete
            class="col s12"
            label="JRE"
            icon="history"
            :items="[1.4, 1.5, 1.6, 1.7, 1.8]"
            v-model.number="configuration.jre"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.configuration.jre.$error">
              <p v-if="!$v.configuration.jre.required">JRE field must not be empty.</p>
            </div>
          </div>
        </div>
        <div class="row">
          <TextArea
            class="col s12"
            label="Additional info"
            icon="description"
            v-model="configuration.additional_info"
          />
        </div>
      </template>
      <template v-slot:footer>
        <button
          class="btn waves-effect waves-light"
          type="submit"
          name="action"
          @click="save()"
        >
          Save
        </button>
      </template>
    </Modal>

    <Modal v-if="showRemoveModal" @close="showRemoveModal = false" class="confirm">
      <template v-slot:content>
        <div v-if="removing" class="center" >
          <Preloader class="big"/>
          <p>Removing configuration ...</p>
        </div>
        <div v-else-if="error" class="center">
          <i class="material-icons large red-text">error_outline</i>
          <p>{{ error }}</p>
        </div>
        <div v-else>
          Are you sure you what to remove this configuration?
        </div>
      </template>
      <template v-slot:footer>
        <button
          v-if="!removing && !removed"
          class="waves-effect btn red"
          @click="remove()"
        >
          <i class="material-icons left">delete</i> Remove
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import Autocomplete from '@/components/Autocomplete';
import TextArea from '@/components/TextArea';

import { Table, Column } from '@/components/table';

export default {
  components: {
    Autocomplete,
    TextArea,
    Table,
    Column,
  },
  data() {
    return {
      showAddEditModal: false,
      action: '',
      configuration: {},
      showRemoveModal: false,
      removing: false,
      removed: false,
      error: '',
      projectTypes: [
        {
          name: 'Migration',
          value: 'migration',
        },
        {
          name: 'New',
          value: 'new',
        },
        {
          name: 'N/A',
          value: 'n/a',
        },
      ],
      appTypes: [
        {
          name: 'Extranet',
          value: 'extranet',
        },
        {
          name: 'Debiteur',
          value: 'debiteur',
        },
      ],
      filterColumns: [
        'project_type', 'app_type',
      ],
    };
  },
  computed: {
    configurations() {
      return this.$store.state.extranet.configurations;
    },
    projects() {
      return this.$store.state.mmpi.projects;
    },
    deliveryChains() {
      if (this.configuration.project) {
        return this.configuration.project.delivery_chains || [];
      }
      return [];
    },
    instances() {
      if (this.configuration.delivery_chain) {
        return this.configuration.delivery_chain.instances || [];
      }
      return [];
    },
    branches() {
      if (this.configuration.app_type && this.configuration.app_type.value === 'extranet') {
        return this.$store.state.extranet.branches;
      }

      if (this.configuration.app_type && this.configuration.app_type.value === 'debiteur') {
        return this.$store.state.debiteur.branches;
      }

      return [];
    },
    clients() {
      if (this.configuration.app_type && this.configuration.app_type.value === 'extranet') {
        return this.$store.state.extranet.clients;
      }

      if (this.configuration.app_type && this.configuration.app_type.value === 'debiteur') {
        return this.$store.state.debiteur.clients;
      }

      return [];
    },
  },
  validations: {
    configuration: {
      app_type: {
        required,
      },
      app_version: {
        required,
      },
      project_type: {
        required,
      },
      project: {
        required,
      },
      delivery_chain: {
        required,
      },
      dev_instance: {
        required,
      },
      val_instance: {
        required,
      },
      branch: {
        required,
      },
      prefix: {
        required,
      },
      servlet_container: {
        required,
      },
      jdk: {
        required,
      },
      jre: {
        required,
      },
    },
  },
  methods: {
    getData() {
      const loader = this.$loading.show({ container: this.$el });
      const promises = [];
      promises.push(this.$store.dispatch('extranet/getConfigurations'));
      promises.push(this.$store.dispatch('mmpi/getProjects'));
      promises.push(this.$store.dispatch('extranet/getBranches'));
      promises.push(this.$store.dispatch('debiteur/getBranches'));
      promises.push(this.$store.dispatch('extranet/getClients'));
      promises.push(this.$store.dispatch('debiteur/getClients'));

      Promise.all(promises).finally(() => {
        loader.hide();

        if (this.$route.params.id) {
          if (this.$route.params.id === 'new') {
            return this.openAddEditModal('create');
          }

          const configuration = this.configurations.find(
            configuration => configuration.id === parseInt(this.$route.params.id, 10),
          );
          if (configuration) {
            return this.openAddEditModal('update', configuration);
          }

          this.$M.toast({ html: 'This configuration does not exist!', classes: 'toast-fail' });
        }

        return true;
      });
    },

    openAddEditModal(action, configuration = {}) {
      this.configuration = Object.assign({}, configuration);

      if (this.configuration.project) {
        this.configuration.project = this.projects.find(
          project => project.name === this.configuration.project,
        );
      }

      if (this.configuration.project_type) {
        this.configuration.project_type = this.projectTypes.find(
          projectType => projectType.value === this.configuration.project_type,
        );
      }

      if (this.configuration.app_type) {
        this.configuration.app_type = this.appTypes.find(
          appType => appType.value === this.configuration.app_type,
        );
      }

      if (this.configuration.delivery_chain) {
        this.configuration.delivery_chain = this.deliveryChains.find(
          deliveryChain => deliveryChain.title === this.configuration.delivery_chain,
        );
      }

      if (this.configuration.dev_instance) {
        this.configuration.dev_instance = this.instances.find(
          instance => instance.name === this.configuration.dev_instance,
        );
      }

      if (this.configuration.val_instance) {
        this.configuration.val_instance = this.instances.find(
          instance => instance.name === this.configuration.val_instance,
        );
      }

      this.$router.push({
        path: `/extranet/configurations/${encodeURIComponent(this.configuration.id || 'new')}`,
      });

      this.showAddEditModal = true;
      this.action = action;
    },

    closeAddEditModal() {
      this.showAddEditModal = false;
      this.$v.$reset();

      this.$router.push({
        path: '/extranet/configurations',
      });
    },

    save() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const payload = Object.assign({}, this.configuration);

      payload.app_type = this.configuration.app_type.value;
      payload.project_type = this.configuration.project_type.value;
      payload.app_version = this.configuration.app_version;
      payload.project = this.configuration.project.name;
      payload.delivery_chain = this.configuration.delivery_chain.title;
      payload.dev_instance = this.configuration.dev_instance.name;
      payload.val_instance = this.configuration.val_instance.name;
      payload.branch = this.configuration.branch.name;
      payload.prefix = this.configuration.prefix.package;

      this.$store.dispatch(`extranet/${this.action}Configuration`, payload)
        .then(() => {
          this.$M.toast({
            html: `The configuration has been ${this.action}d!`,
            classes: 'toast-seccess',
          });
          this.showAddEditModal = false;
        })
        .catch((error) => {
          if (error.response.status === 403) {
            this.$M.toast({
              html: `You do not have insufficient rights to ${this.action} this configuration`,
              classes: 'toast-fail',
            });
            return;
          }

          let errorText = '';
          Object.values(error.response.data).forEach((value) => {
            errorText += `${value.join('<br>')}<br>`;
          });

          this.$M.toast({
            html: errorText,
            classes: 'toast-fail',
          });
        });
    },

    openDeleteModal(configuration) {
      this.configuration = configuration;
      this.removing = false;
      this.removed = false;
      this.error = '';
      this.showRemoveModal = true;
    },

    remove() {
      this.removing = true;
      this.$store.dispatch('extranet/deleteConfiguration', this.configuration.id)
        .then(() => {
          this.removed = true;
          this.showRemoveModal = false;
          this.$M.toast({ html: 'The configuration has been removed!', classes: 'toast-seccess' });
        })
        .catch((error) => {
          if (error.response.status === 403) {
            this.error = 'You do not have insufficient rights to remove this configuration';
          }
        })
        .finally(() => { this.removing = false; });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
