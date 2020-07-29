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
        <Column show="deploy_instance"/>
        <Column show="app_type" :sortable="false" filter-type="dropdown"/>
        <Column show="app_version" :sortable="false" filter-type="dropdown"/>
        <Column show="branch"/>
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
        <template v-slot:actions-before="{ row }">
          <a @click="openAddEditModal('build', row)" class="green-text" title="Start Build">
            <i class="material-icons">send</i>
          </a>
        </template>
      </Table>

    </div>

    <Modal v-if="showAddEditModal" @close="closeAddEditModal()" class="right-sheet">
      <template v-slot:header>
        <span v-if="action === 'create'">Create </span>
        <span v-else-if="action === 'update'">Update </span>
        <span v-else>Build </span>
        configuration
      </template>
      <template v-slot:content>
        <template v-if="build.started === false">
          <div class="row">
            <Autocomplete
              class="col s12"
              :class="{readonly: action === 'build'}"
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
          <div class="row" v-if="!(action === 'build')">
            <Select
              class="col s12"
              :class="{readonly: action === 'build'}"
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
              :class="{readonly: action === 'build'}"
              label="Delivery chain"
              icon="refresh"
              valueKey="title"
              :items="deliveryChains"
              v-model="configuration.delivery_chain"
              :invalid="$v.configuration.delivery_chain.$error"
              @change="
                delete configuration.dev_instance
                &&
                delete configuration.val_instance
                &&
                delete configuration.deploy_instance
              "
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
              :class="{readonly: action === 'build'}"
              label="Dev Instance"
              icon="dynamic_feed"
              :items="dev_instances"
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
          <div class="row" v-if="!(action === 'build')">
            <Autocomplete
              class="col s12"
              :class="{readonly: action === 'build'}"
              label="Val Instance"
              icon="dynamic_feed"
              :items="val_instances"
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
            <Autocomplete
              class="col s12"
              :class="{readonly: action === 'build'}"
              label="Deploy Instance"
              icon="dynamic_feed"
              :items="deploy_instances"
              v-model="configuration.deploy_instance"
              :invalid="$v.configuration.deploy_instance.$error"
              @blur="$v.configuration.deploy_instance.$touch()"
            />
            <div class="validator col s12">
              <div class="red-text" v-if="$v.configuration.deploy_instance.$error">
                <p v-if="!$v.configuration.deploy_instance.required">
                  Deploy Instance field must not be empty.
                </p>
              </div>
            </div>
          </div>
          <div class="row" v-if="!(action === 'build')">
            <Select
              class="col s12"
              :class="{readonly: action === 'build'}"
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
          <div class="row" v-if="!(action === 'build')">
            <TextInput
              class="col s12"
              :class="{readonly: action === 'build'}"
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
              :class="{readonly: action === 'build'}"
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
              :class="{readonly: action === 'build'}"
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
          <div class="row" v-if="!(action === 'build')">
            <TextInput
              class="col s12"
              :class="{readonly: action === 'build'}"
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
              :class="{readonly: action === 'build'}"
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
          <div class="row" v-if="!(action === 'build')">
            <Autocomplete
              class="col s12"
              :class="{readonly: action === 'build'}"
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
          <div class="row" v-if="!(action === 'build')">
            <TextArea
              class="col s12"
              :class="{readonly: action === 'build'}"
              label="Additional info"
              icon="description"
              v-model="configuration.additional_info"
            />
          </div>
        </template>
        <template v-else>
          <div key="build" >
            <div v-if="build.status === 'success'" class="center" >
              <i class="material-icons large green-text">check_circle_outline</i>
              <p>Build completed successfully</p>
            </div>

            <div v-else-if="build.status === 'failed'" class="center">
              <i class="material-icons large red-text">error_outline</i>
              <p>{{ build.error || build.summary }}</p>
            </div>

            <div v-else class="row">
              <div class="col s12">
                <p>{{ build.summary }}</p>
                <Progress v-if="build.status === 'running'" :progress="build.progress"></Progress>
              </div>
            </div>

            <div class="row">
              <div class="col s12">
                <div class="log">{{ build.log }}</div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-slot:footer>
        <button
          class="btn waves-effect waves-light"
          type="submit"
          name="action"
          @click="action === 'build' ? buildConfiguration() : save()"
        >
          <span v-if="action === 'build'">Build</span>
          <span v-else>Save</span>
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
import client from '@/plugins/ws';

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
      build: {
        started: false,
        status: '',
        summary: '',
        progress: null,
        log: '',
        error: null,
      },
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
    val_instances() {
      if (this.configuration.delivery_chain) {
        return this.configuration.delivery_chain.instances
          .filter(instance => instance.instance_type_id === 'VAL') || [];
      }
      return [];
    },
    dev_instances() {
      if (this.configuration.delivery_chain) {
        return this.configuration.delivery_chain.instances
          .filter(instance => instance.instance_type_id === 'DEV') || [];
      }
      return [];
    },
    deploy_instances() {
      if (this.configuration.delivery_chain) {
        return this.configuration.delivery_chain.instances
          .filter(instance => instance.environment_type.type === 'EXTRANET') || [];
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
      deploy_instance: {
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
            if (this.$route.params.build === 'build') {
              return this.openAddEditModal('build', configuration);
            }
            return this.openAddEditModal('update', configuration);
          }

          this.$M.toast({ html: 'This configuration does not exist!', classes: 'toast-fail' });
        }

        return true;
      });
    },

    openAddEditModal(action, configuration = {}) {
      this.showAddEditModal = true;
      this.action = action;
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
        this.configuration.dev_instance = this.dev_instances.find(
          instance => instance.name === this.configuration.dev_instance,
        );
      }

      if (this.configuration.val_instance) {
        this.configuration.val_instance = this.val_instances.find(
          instance => instance.name === this.configuration.val_instance,
        );
      }

      if (this.configuration.deploy_instance) {
        this.configuration.deploy_instance = this.deploy_instances.find(
          instance => instance.name === this.configuration.deploy_instance,
        );
      }

      if (action === 'build') {
        this.$router.push({
          path: `/extranet/configurations/${encodeURIComponent(this.configuration.id)}/build`,
        });
      } else {
        this.$router.push({
          path: `/extranet/configurations/${encodeURIComponent(this.configuration.id || 'new')}`,
        });
      }  
    },

    closeAddEditModal() {
      this.showAddEditModal = false;
      this.build.started = false;
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
      payload.deploy_instance = this.configuration.deploy_instance.name;
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

    buildConfiguration() {
      this.build.started = true;
      this.build.summary = 'Build will start shortly ...';

      const payload = {
        instance: this.configuration.dev_instance,
        deploy_instance: this.configuration.deploy_instance,
        client: this.clients.find(client => client.package === this.configuration.prefix),
      };

      this.$store.dispatch('extranet/buildConfiguration', {
        id: this.configuration.id,
        payload,
      })
        .then((response) => {
          this.build.status = 'running';

          if (!client.connected) {
            return;
          }

          const subscribe = client.subscribe(
            `/queue/${response.data.broadcast.queue}`,
            (message) => {
              const data = JSON.parse(message.body);

              if (data.summary) {
                this.build.summary = data.summary;
              }
              this.build.progress = data.progress || null;

              if (data.log) {
                this.build.log += data.log;
                this.scrollLogContainer();
              }

              if (data.status === 'failed' || (data.action === 'deploy' && data.status !== 'running')) {
                this.build.status = data.status;
                subscribe.unsubscribe();
              }
            },
            response.data.broadcast,
          );
        })
        .catch((error) => {
          this.build.status = 'failed';
          this.build.summary = 'Could not start build';
          if (error.response.status === 403) {
            this.build.error = 'You do not have insufficient rights to create build';
          } else {
            this.build.error = error;
          }
        });
    },

    scrollLogContainer() {
      setTimeout(() => {
        const container = this.$el.querySelector('.log');
        container.scrollTop = container.scrollHeight;
      }, 100);
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

<style lang="scss" >
  .log {
    height: 60vh;
    overflow: auto;
    white-space: pre;
  }
</style>
