<template>
  <div class="configurations">
    <div class="data-table">
      <Table v-bind:request="request"  @add="openAddEditModal('create')">
        <template v-slot:buttons="{ data }">
          <a v-if="$auth.can('extranet.manage-configuration')"
             @click="openDeleteModal(data)">
            <i class="material-icons right">delete</i>
          </a>
          <a v-if="$auth.can('extranet.manage-configuration')"
             @click="openAddEditModal('update', data)">
            <i class="material-icons right">edit</i>
          </a>
        </template>
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
          <TextInput
            class="col s12"
            label="Type"
            icon="title"
            v-model="configuration.type"
            :invalid="$v.configuration.type.$error"
            @blur="$v.configuration.type.$touch()"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.configuration.type.$error">
              <p v-if="!$v.configuration.type.required">Type field must not be empty.</p>
            </div>
          </div>
        </div>
        <div class="row">
          <TextInput
            class="col s12"
            label="Version"
            icon="history"
            v-model="configuration.version"
            :invalid="$v.configuration.version.$error"
            @blur="$v.configuration.version.$touch()"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.configuration.version.$error">
              <p v-if="!$v.configuration.version.required">Version field must not be empty.</p>
            </div>
          </div>
        </div>
        <div class="row">
          <Autocomplete
            class="col s12"
            label="Project"
            icon="list_alt"
            :items="projects"
            v-model="configuration.project"
            :invalid="$v.configuration.project.$error"
            @change="delete configuration.delivery_chain && delete configuration.instance"
            @blur="$v.configuration.project.$touch()"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.configuration.project.$error">
              <p v-if="!$v.configuration.project.required">Project field must not be empty.</p>
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
            @change="delete configuration.instance"
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
            label="Instance"
            icon="dynamic_feed"
            :items="instances"
            v-model="configuration.instance"
            :invalid="$v.configuration.instance.$error"
            @blur="$v.configuration.instance.$touch()"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.configuration.instance.$error">
              <p v-if="!$v.configuration.instance.required">Instance field must not be empty.</p>
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
              <p v-if="!$v.configuration.branch.required">Instance field must not be empty.</p>
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
            label="Description"
            icon="description"
            v-model="configuration.description"
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

export default {
  components: {
    Autocomplete,
    TextArea,
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
      request: {
        data: 'extranet/getConfigurations',
        columns: {
          project: '',
          type: '',
          version: '',
          delivery_chain: '',
          instance: '',
          branch: '',
          prefix: '',
          servlet_container: '',
          jdk: '',
          jre: '',
          description: '',
        },
        add: this.$auth.can('extranet.manage-configuration'),
        export: false,
        action: true,
        searchable: true,
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
    instances() {
      if (this.configuration.delivery_chain) {
        return this.configuration.delivery_chain.instances || [];
      }
      return [];
    },
    branches() {
      return this.$store.state.extranet.branches || [];
    },
    clients() {
      return this.$store.state.extranet.clients || [];
    },
  },
  validations: {
    configuration: {
      type: {
        required,
      },
      version: {
        required,
      },
      project: {
        required,
      },
      delivery_chain: {
        required,
      },
      instance: {
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
      promises.push(this.$store.dispatch('extranet/getClients'));

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
      if (this.configuration.delivery_chain) {
        this.configuration.delivery_chain = this.deliveryChains.find(
          deliveryChain => deliveryChain.title === this.configuration.delivery_chain,
        );
      }
      if (this.configuration.instance) {
        this.configuration.instance = this.instances.find(
          instance => instance.name === this.configuration.instance,
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

      payload.type = this.configuration.type;
      payload.version = this.configuration.version;
      payload.project = this.configuration.project.name;
      payload.delivery_chain = this.configuration.delivery_chain.title;
      payload.instance = this.configuration.instance.name;
      payload.branch = this.configuration.branch.name;
      payload.prefix = this.configuration.prefix.package;

      this.$store.dispatch(`extranet/${this.action}Configuration`, payload)
        .then(() => {
          this.$M.toast({
            html: `The configuration has been ${this.action}d!`,
            classes: 'toast-seccess'
          });
          this.showAddEditModal = false;
        })
        .catch((error) => {
          if (error.response.status === 403) {
            this.$M.toast({
              html: `You do not have insufficient rights to ${this.action} this configuration`,
              classes: 'toast-fail'
            });
          }
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
