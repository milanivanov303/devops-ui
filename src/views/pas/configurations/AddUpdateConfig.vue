<template>
  <Modal class="right-sheet" @close="$emit('close')" >
    <template v-slot:header>
      <span v-if="action === 'create'">Create configuration </span>
      <span v-else-if="action === 'update'">Update configuration</span>
      <span v-else>View configuration's details</span>
    </template>
    <template v-slot:content>
      <form>
        <div class="row">
          <div class="col s12 m6">
            <Autocomplete
                :class="{readonly: action === 'view'}"
                label="Project"
                icon="list_alt"
                :items="projects"
                v-model="form.project"
                :invalid="$v.form.project.$error"
                @change="delete form.delivery_chain &&
                        delete form.dev_instance &&
                        delete form.val_instance"
                @blur="$v.form.project.$touch()"
            />
            <div class="validator">
              <div class="red-text" v-if="$v.form.project.$error">
                <p v-if="!$v.form.project.required">Project field must not be empty.</p>
              </div>
            </div>
          </div>
          <div class="col s12 m6">
            <Select
                :class="{readonly: action === 'view'}"
                label="Project type"
                displayed="name"
                v-model="form.project_type"
                :options="projectTypes"
            />
            <div class="validator">
              <div class="red-text" v-if="$v.form.project_type.$error">
                <p v-if="!$v.form.project_type.required">
                  Project type field must not be empty.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <Autocomplete
              class="col s12"
              :class="{readonly: action === 'view'}"
              label="Delivery chain"
              icon="wrap_text"
              valueKey="title"
              :items="deliveryChains"
              v-model="form.delivery_chain"
              :invalid="$v.form.delivery_chain.$error"
              @change="
                delete form.dev_instance
                &&
                delete form.val_instance
                &&
                delete form.deploy_dev_instance
                &&
                delete form.deploy_val_instance
              "
              @blur="$v.form.delivery_chain.$touch()"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.form.delivery_chain.$error">
              <p v-if="!$v.form.delivery_chain.required">
                Delivery chain field must not be empty.
              </p>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col s12 m6">
            <Autocomplete
                :class="{readonly: action === 'view'}"
                label="Dev Instance"
                icon="dynamic_feed"
                :items="dev_instances"
                v-model="form.dev_instance"
                :invalid="$v.form.dev_instance.$error"
                @blur="$v.form.dev_instance.$touch()"
            />
            <div class="validator">
              <div class="red-text" v-if="$v.form.dev_instance.$error">
                <p v-if="!$v.form.dev_instance.required">
                  Dev Instance field must not be empty.
                </p>
              </div>
            </div>
          </div>
          <div class="col s12 m6">
            <Autocomplete
                :class="{readonly: action === 'view'}"
                label="Val Instance"
                :items="val_instances"
                v-model="form.val_instance"
            />
          </div>
        </div>
        <div class="row">
          <div class="col s12 m6">
            <Autocomplete
              :class="{readonly: action === 'view'}"
              label="Deploy Dev Instance"
              icon="dynamic_feed"
              :items="deploy_instances"
              v-model="form.deploy_dev_instance"
            />
          </div>
          <div class="col s12 m6">
            <Autocomplete
                :class="{readonly: action === 'view'}"
                label="Deploy Val Instance"
                :items="deploy_instances"
                v-model="form.deploy_val_instance"
            />
          </div>
        </div>
        <div class="row">
          <div class="col s12 m6">
            <Select
              :class="{readonly: action === 'view'}"
              label="App type"
              icon="style"
              displayed="name"
              :options="appTypes"
              v-model="form.app_type"
              @change="delete form.branch &&
                     delete form.prefix"
            />
            <div class="validator">
              <div class="red-text" v-if="$v.form.app_type.$error">
                <p v-if="!$v.form.app_type.required">App Type field must not be empty.</p>
              </div>
            </div>
          </div>
          <div class="col s12 m6">
            <Autocomplete
                :class="{readonly: action === 'view'}"
                label="App Version"
                :items="app_versions"
                valueKey="value"
                v-model="form.app_version"
                :invalid="$v.form.app_version.$error"
                @blur="$v.form.app_version.$touch()"
            />
            <div class="validator">
              <div class="red-text" v-if="$v.form.app_version.$error">
                <p v-if="!$v.form.app_version.required">
                  App Version field must not be empty.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col s12 m6">
            <Autocomplete
              :class="{readonly: action === 'view'}"
              label="Branch"
              icon="merge_type"
              :items="branches"
              v-model="form.branch"
              :invalid="$v.form.branch.$error"
              @blur="$v.form.branch.$touch()"
            />
            <div class="validator">
              <div class="red-text" v-if="$v.form.branch.$error">
                <p v-if="!$v.form.branch.required">Branch field must not be empty.</p>
              </div>
            </div>
          </div>
          <div class="col s12 m6">
            <Autocomplete
                :class="{readonly: action === 'view'}"
                label="Prefix"
                valueKey="package"
                :items="clients"
                v-model="form.prefix"
                :invalid="$v.form.prefix.$error"
                @blur="$v.form.prefix.$touch()"
            />
            <div class="validator">
              <div class="red-text" v-if="$v.form.prefix.$error">
                <p v-if="!$v.form.prefix.required">Prefix field must not be empty.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col s12 m6">
            <TextInput
                :class="{readonly: action === 'view'}"
                label="Servlet container"
                icon="storage"
                v-model="form.servlet_container"
                :invalid="$v.form.servlet_container.$error"
                @blur="$v.form.servlet_container.$touch()"
            />
            <div class="validator">
              <div class="red-text" v-if="$v.form.servlet_container.$error">
                <p v-if="!$v.form.servlet_container.required">
                  Servlet container field must not be empty.
                </p>
              </div>
            </div>
          </div>
          <div class="col s12 m3">
            <Select
              :class="{readonly: action === 'view'}"
              label="JDK"
              :options="[1.4, 1.5, 1.6, 1.7, 1.8]"
              v-model.number="form.jdk"
            />
            <div class="validator">
              <div class="red-text" v-if="$v.form.jdk.$error">
                <p v-if="!$v.form.jdk.required">JDK field must not be empty.</p>
              </div>
            </div>
          </div>
          <div class="col s12 m3">
            <Select
              :class="{readonly: action === 'view'}"
              label="JRE"
              :options="[1.4, 1.5, 1.6, 1.7, 1.8]"
              v-model.number="form.jre"
            />
            <div class="validator">
              <div class="red-text" v-if="$v.form.jre.$error">
                <p v-if="!$v.form.jre.required">JRE field must not be empty.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="row" v-if="form.app_version && form.app_version.value === 'X5'">
          <TextInput
              class="col s12 m6"
              :class="{readonly: action === 'view'}"
              label="Api-client"
              icon="compare_arrows"
              v-model="form.api_client"
          />
          <TextInput
              class="col s12 m6"
              :class="{readonly: action === 'view'}"
              label="Api-secret"
              v-model="form.api_secret"
          />
        </div>
        <div class="row">
          <div class="col s12">
            <div class="input-field">
              <i class="material-icons prefix">description</i>
              <textarea
                id="additional-info"
                class="materialize-textarea"
                v-model="form.additional_info"
                :style="{'min-height': '70px',
                'overflow-y': action === 'view' ? 'scroll' : 'auto'}"
              />
              <label for="additional-info" :class="{active: form.additional_info}">
                Additional info
              </label>
            </div>
          </div>
        </div>
        <div class="row" v-if="form.created_on">
          <TextInput
              class="col s12 m6"
              :class="{readonly: action === 'view'}"
              label="Created by"
              icon="person_add"
              v-model="form.created_by"
          />
          <TextInput
              class="col s12 m6"
              :class="{readonly: action === 'view'}"
              label="Created on"
              v-model="form.created_on"
          />
        </div>
        <div class="row" v-if="form.updated_on">
          <TextInput
              class="col s12 m6 readonly"
              label="Updated by"
              icon="person"
              :value="form.updated_by"
          />
          <TextInput
              class="col s12 m6 readonly"
              label="Updated on"
              :value="form.updated_on"
          />
        </div>
      </form>
    </template>
    <template v-slot:footer>
      <button
          v-if="action !== 'view'"
          class="btn waves-effect waves-light"
          type="submit"
          name="action"
          @click="save()">Save
      </button>
    </template>
  </Modal>
</template>
<script>
import { required } from 'vuelidate/lib/validators';

export default {
  props: {
    action: String,
    configuration: Object,
  },
  data() {
    return {
      error: '',
      form: {},
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
    };
  },
  computed: {
    projects() {
      return this.$store.state.mmpi.projects;
    },
    deliveryChains() {
      if (this.form.project) {
        return this.form.project.delivery_chains || [];
      }
      return [];
    },
    val_instances() {
      if (this.form.delivery_chain) {
        return this.form.delivery_chain.instances
          .filter((instance) => instance.instance_type_id === 'VAL') || [];
      }
      return [];
    },
    dev_instances() {
      if (this.form.delivery_chain) {
        return this.form.delivery_chain.instances
          .filter((instance) => instance.instance_type_id === 'DEV') || [];
      }
      return [];
    },
    deploy_instances() {
      return this.$store.state.mmpi.deploy_instances || [];
    },
    app_versions() {
      return this.$store.state.mmpi.app_versions;
    },
    branches() {
      if (this.form.app_type && this.form.app_type.value === 'extranet') {
        if (this.form.app_version && this.form.app_version.value === 'X4') {
          return this.$store.state['extranet-x4'].branches;
        }
        return this.$store.state.extranet.branches;
      }

      if (this.form.app_type && this.form.app_type.value === 'debiteur') {
        return this.$store.state.debiteur.branches;
      }

      return [];
    },
    clients() {
      if (this.form.app_type && this.form.app_type.value === 'extranet') {
        return this.$store.state.extranet.clients;
      }

      if (this.form.app_type && this.form.app_type.value === 'debiteur') {
        return this.$store.state.debiteur.clients;
      }

      return [];
    },
  },
  validations: {
    form: {
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
      promises.push(this.$store.dispatch('mmpi/getProjects'));
      promises.push(this.$store.dispatch('mmpi/getDeployInstances'));
      promises.push(this.$store.dispatch('mmpi/getAppVersions'));
      promises.push(this.$store.dispatch('extranet/getBranches'));
      promises.push(this.$store.dispatch('debiteur/getBranches'));
      promises.push(this.$store.dispatch('extranet-x4/getBranches'));
      promises.push(this.$store.dispatch('extranet/getClients'));
      promises.push(this.$store.dispatch('debiteur/getClients'));
      Promise.all(promises)
        .then(() => {
          if (this.action !== 'create') this.mapData();
        })
        .finally(() => loader.hide());
    },
    mapData() {
      this.form = { ...this.configuration };

      this.form.project = this.projects
        .find((project) => project.name === this.configuration.project);
      this.form.delivery_chain = this.deliveryChains
        .find((deliveryChain) => deliveryChain.id === this.configuration.delivery_chain_id);
      this.form.dev_instance = this.dev_instances
        .find((instance) => instance.name === this.configuration.dev_instance);
      this.form.app_type = this.appTypes
        .find((appType) => appType.value === this.configuration.app_type);

      if (this.configuration.project_type) {
        this.form.project_type = this.projectTypes
          .find((projectType) => projectType.value === this.configuration.project_type);
      }
      if (this.configuration.val_instance) {
        this.form.val_instance = this.val_instances
          .find((instance) => instance.name === this.configuration.val_instance);
      }
      if (this.configuration.deploy_dev_instance) {
        this.form.deploy_dev_instance = this.deploy_instances
          .find((instance) => instance.name === this.configuration.deploy_dev_instance);
      }
      if (this.configuration.deploy_val_instance) {
        this.form.deploy_val_instance = this.deploy_instances
          .find((instance) => instance.name === this.configuration.deploy_val_instance);
      }
      if (this.configuration.app_version) {
        this.form.app_version = this.app_versions
          .find((version) => version.value === this.configuration.app_version);
      }
      if (this.configuration.created_on) {
        this.form.created_on = this.$date(this.configuration.created_on).toHuman();
      }
      if (this.configuration.updated_on) {
        this.form.updated_on = this.$date(this.configuration.updated_on).toHuman();
      }
    },

    save() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const payload = { ...this.form };
      payload.app_type = this.form.app_type.value;
      payload.project_type = this.form.project_type.value;
      payload.app_version = this.form.app_version.value;
      payload.project = this.form.project.name;
      payload.delivery_chain_id = this.form.delivery_chain.id;
      payload.dev_instance = this.form.dev_instance.name;
      if (this.form.val_instance) {
        payload.val_instance = this.form.val_instance.name;
      }
      if (this.form.deploy_dev_instance) {
        payload.deploy_dev_instance = this.form.deploy_dev_instance.name;
      }
      if (this.form.deploy_val_instance) {
        payload.deploy_val_instance = this.form.deploy_val_instance.name;
      }
      payload.branch = this.form.branch.name;
      payload.prefix = this.form.prefix.package;

      delete payload.created_on;
      delete payload.created_by;
      delete payload.updated_on;
      delete payload.updated_by;

      this.$store.dispatch(`pas/${this.action}Configuration`, payload)
        .then(() => {
          this.$M.toast({
            html: `The configuration has been ${this.action}d!`,
            classes: 'toast-success',
          });
          this.$emit('close');
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
          this.$M.toast({ html: errorText, classes: 'toast-fail' });
        });
    },
  },
  created() {
    this.getData();
  },
};
</script>
