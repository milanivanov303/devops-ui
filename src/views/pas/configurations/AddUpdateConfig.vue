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
          <Autocomplete
              class="col s12"
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
          <div class="validator col s12">
            <div class="red-text" v-if="$v.form.project.$error">
              <p v-if="!$v.form.project.required">Project field must not be empty.</p>
            </div>
          </div>
        </div>
        <div class="row">
          <Select
              class="col s12"
              :class="{readonly: action === 'view'}"
              label="Project type"
              icon="title"
              displayed="name"
              v-model="form.project_type"
              :options="projectTypes"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.form.project_type.$error">
              <p v-if="!$v.form.project_type.required">
                Project type field must not be empty.
              </p>
            </div>
          </div>
        </div>
        <div class="row">
          <Autocomplete
              class="col s12"
              :class="{readonly: action === 'view'}"
              label="Delivery chain"
              icon="refresh"
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
          <Autocomplete
              class="col s12"
              :class="{readonly: action === 'view'}"
              label="Dev Instance"
              icon="dynamic_feed"
              :items="dev_instances"
              v-model="form.dev_instance"
              :invalid="$v.form.dev_instance.$error"
              @blur="$v.form.dev_instance.$touch()"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.form.dev_instance.$error">
              <p v-if="!$v.form.dev_instance.required">
                Dev Instance field must not be empty.
              </p>
            </div>
          </div>
        </div>
        <div class="row">
          <Autocomplete
              class="col s12"
              :class="{readonly: action === 'view'}"
              label="Val Instance"
              icon="dynamic_feed"
              :items="val_instances"
              v-model="form.val_instance"
          />
        </div>
        <div class="row">
          <Autocomplete
              class="col s12"
              :class="{readonly: action === 'view'}"
              label="Deploy Dev Instance"
              icon="dynamic_feed"
              :items="deploy_instances"
              v-model="form.deploy_dev_instance"
          />
        </div>
        <div class="row">
          <Autocomplete
            class="col s12"
            :class="{readonly: action === 'view'}"
            label="Deploy Val Instance"
            icon="dynamic_feed"
            :items="deploy_instances"
            v-model="form.deploy_val_instance"
          />
        </div>
        <div class="row">
          <Select
              class="col s12"
              :class="{readonly: action === 'view'}"
              label="App type"
              icon="title"
              displayed="name"
              :options="appTypes"
              v-model="form.app_type"
              @change="delete form.branch &&
                       delete form.prefix"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.form.app_type.$error">
              <p v-if="!$v.form.app_type.required">App Type field must not be empty.</p>
            </div>
          </div>
        </div>
        <div class="row">
          <Autocomplete
              class="col s12"
              :class="{readonly: action === 'view'}"
              label="App Version"
              icon="history"
              :items="app_versions"
              valueKey="value"
              v-model="form.app_version"
              :invalid="$v.form.app_version.$error"
              @blur="$v.form.app_version.$touch()"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.form.app_version.$error">
              <p v-if="!$v.form.app_version.required">
                App Version field must not be empty.
              </p>
            </div>
          </div>
        </div>
        <div class="row">
          <Autocomplete
              class="col s12"
              :class="{readonly: action === 'view'}"
              label="Branch"
              icon="merge_type"
              :items="branches"
              v-model="form.branch"
              :invalid="$v.form.branch.$error"
              @blur="$v.form.branch.$touch()"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.form.branch.$error">
              <p v-if="!$v.form.branch.required">Branch field must not be empty.</p>
            </div>
          </div>
        </div>
        <div class="row">
        <Autocomplete
            class="col s12"
            :class="{readonly: action === 'view'}"
            label="Prefix"
            icon="people"
            valueKey="package"
            :items="clients"
            v-model="form.prefix"
            :invalid="$v.form.prefix.$error"
            @blur="$v.form.prefix.$touch()"
        />
        <div class="validator col s12">
          <div class="red-text" v-if="$v.form.prefix.$error">
            <p v-if="!$v.form.prefix.required">Prefix field must not be empty.</p>
          </div>
        </div>
        </div>
        <div class="row">
          <TextInput
              class="col s12"
              :class="{readonly: action === 'view'}"
              label="Servlet container"
              icon="dns"
              v-model="form.servlet_container"
              :invalid="$v.form.servlet_container.$error"
              @blur="$v.form.servlet_container.$touch()"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.form.servlet_container.$error">
              <p v-if="!$v.form.servlet_container.required">
                Servlet container field must not be empty.
              </p>
            </div>
          </div>
        </div>
        <div class="row">
          <Autocomplete
              class="col s12"
              :class="{readonly: action === 'view'}"
              label="JDK"
              icon="history"
              :items="[1.4, 1.5, 1.6, 1.7, 1.8]"
              v-model.number="form.jdk"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.form.jdk.$error">
              <p v-if="!$v.form.jdk.required">JDK field must not be empty.</p>
            </div>
          </div>
        </div>
        <div class="row">
          <Autocomplete
              class="col s12"
              :class="{readonly: action === 'view'}"
              label="JRE"
              icon="history"
              :items="[1.4, 1.5, 1.6, 1.7, 1.8]"
              v-model.number="form.jre"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.form.jre.$error">
              <p v-if="!$v.form.jre.required">JRE field must not be empty.</p>
            </div>
          </div>
        </div>
        <div class="row">
            <TextArea
                class="col s12"
                :class="{readonly: action === 'view'}"
                label="Additional info"
                icon="description"
                v-model="form.additional_info"
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

import TextArea from '@/components/TextArea';

export default {
  components: {
    TextArea,
  },
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
      return this.$store.state.mmpi.deploy_instances;
    },
    app_versions() {
      return this.$store.state.mmpi.app_versions;
    },
    branches() {
      if (this.form.app_type && this.form.app_type.value === 'extranet') {
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
      promises.push(this.$store.dispatch('extranet/getClients'));
      promises.push(this.$store.dispatch('debiteur/getClients'));
      Promise.all(promises)
        .then(() => {
          if (this.action !== 'create') this.setUpdateData();
        })
        .finally(() => loader.hide());
    },
    setUpdateData() {
      this.form = { ...this.configuration };

      if (this.configuration.project) {
        this.form.project = this.projects
          .find((project) => project.name === this.configuration.project);
      }

      if (this.configuration.delivery_chain) {
        this.form.delivery_chain = this.deliveryChains
          .find((deliveryChain) => deliveryChain.title === this.configuration.delivery_chain);
      }

      if (this.configuration.dev_instance) {
        this.form.dev_instance = this.dev_instances
          .find((instance) => instance.name === this.configuration.dev_instance);
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

      if (this.configuration.project_type) {
        this.form.project_type = this.projectTypes
          .find((projectType) => projectType.value === this.configuration.project_type);
      }

      if (this.configuration.app_version) {
        this.form.app_version = this.app_versions
            .find((version) => version.value === this.configuration.app_version);
      }

      if (this.configuration.app_type) {
        this.form.app_type = this.appTypes
          .find((appType) => appType.value === this.configuration.app_type);
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
      payload.app_version = this.form.app_version.name;
      payload.project = this.form.project.name;
      payload.delivery_chain = this.form.delivery_chain.title;
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

          this.$M.toast({
            html: errorText,
            classes: 'toast-fail',
          });
        });
    },
  },
  created() {
    this.getData();
  },
};
</script>
