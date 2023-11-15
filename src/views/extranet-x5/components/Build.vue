<template>
  <div class="row">
    <div class="col s12" >
      <button
          v-if="$auth.can('extranet.create-builds')"
          class="btn"
          @click="open()">
        <i class="material-icons left">add</i> New build
      </button>

      <Modal v-if="showModal" @close="close()" class="right-sheet">
        <template v-slot:header>{{ branch }} // Create new build </template>
        <template v-slot:content>
          <div v-if="!build.started" class="col s12 l11" key="form" >
            <div class="row" v-if="!branch">
              <div class="col s12" >
                <Autocomplete
                    label="Branch"
                    icon="dynamic_feed"
                    :items="branches"
                    v-model="form.branch"
                    :invalid="$v.form.branch.$error"
                    @blur="$v.form.branch.$touch()"
                />
              </div>
              <div class="validator col s11 offset-s1">
                <div class="red-text" v-if="$v.form.branch.$error">
                  <p v-if="!$v.form.branch.required">
                    Branch field must not be empty.
                  </p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col s12">
                <Autocomplete
                    label="Instance"
                    icon="dynamic_feed"
                    :items="instances"
                    v-model="form.instance"
                    :invalid="$v.form.instance.$error"
                    @blur="$v.form.instance.$touch()"
                />
              </div>
              <div class="validator col s11 offset-s1">
                <div class="red-text" v-if="$v.form.instance.$error">
                  <p v-if="!$v.form.instance.required">
                    Instance field must not be empty.
                  </p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col s12" >
                <TextInput
                    label="Backend url"
                    icon="link"
                    v-model="form.be_url"
                    :readonly="be_url !== null"
                    :invalid="$v.form.be_url.$error"
                    @blur="$v.form.be_url.$touch()"
                    @input="debounceInput"
                />
              </div>
              <div class="validator col s11 offset-s1 ">
                <div class="red-text" v-if="$v.form.be_url.$error">
                  <p v-if="!$v.form.be_url.required">
                    Backend url field must not be empty.
                  </p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col s12 readonly">
                <div class="col s1">
                  <i class="material-icons sensitive-info">keyboard_arrow_right</i>
                </div>
                <div class="col s3">
                  <p>Api client_id:</p>
                </div>
                <div class="col s8">
                  <i v-if="form.api_client && form.api_client.trim() !== ''"
                     class="material-icons green-text">
                    check
                  </i>
                  <i v-else class="material-icons red-text">close</i>
                </div>
              </div>
              <div class="validator col s11 offset-s1">
                <div class="red-text" v-if="$v.form.api_client.$error">
                  <p v-if="!$v.form.api_client.required">
                    Api-client field must not be empty. Check X5 records in Devops matrix.
                  </p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col s12 readonly">
                <div class="col s1">
                  <i class="material-icons sensitive-info">keyboard_arrow_right</i>
                </div>
                <div class="col s3">
                  <p>Api client_secret:</p>
                </div>
                <div class="col s8">
                  <i v-if="form.api_secret && form.api_secret.trim() !== ''"
                     class="material-icons green-text">
                    check
                  </i>
                  <i v-else class="material-icons red-text">close</i>
                </div>
              </div>
              <div class="validator col s11 offset-s1">
                <div class="red-text" v-if="$v.form.api_secret.$error">
                  <p v-if="!$v.form.api_secret.required">
                    Api client_secret field must not be empty. Check X5 records in Devops matrix.
                  </p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col s12 readonly">
                <div class="col s1">
                  <i class="material-icons sensitive-info">keyboard_arrow_right</i>
                </div>
                <div class="col s3">
                  <p>Config client_id:</p>
                </div>
                <div class="col s8">
                  <i v-if="form.client_id_password && form.client_id_password.trim() !== ''"
                     class="material-icons green-text">
                    check
                  </i>
                  <i v-else class="material-icons red-text">close</i>
                </div>
              </div>
              <div class="validator col s11 offset-s1">
                <div class="red-text" v-if="$v.form.client_id_password.$error">
                  <p v-if="!$v.form.client_id_password.required">
                    Config client_id field must not be empty.
                  </p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col s12 readonly">
                <div class="col s1">
                  <i class="material-icons sensitive-info">keyboard_arrow_right</i>
                </div>
                <div class="col s3">
                  <p>Config client_secret:</p>
                </div>
                <div class="col s8">
                  <i v-if="form.client_secret_password && form.client_secret_password.trim() !== ''"
                     class="material-icons green-text">
                    check
                  </i>
                  <i v-else class="material-icons red-text">close</i>
                </div>
              </div>
              <div class="validator col s11 offset-s1">
                <div class="red-text" v-if="$v.form.client_secret_password.$error">
                  <p v-if="!$v.form.client_secret_password.required">
                    Config client_secret field must not be empty.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <BuildProgress
              v-else
              :broadcast="build.broadcast"
              :status="build.status"
              :summary="build.summary"
              :error="build.error"
          />
        </template>
        <template v-slot:footer>
          <button
              v-if="!build.started"
              class="waves-effect btn"
              :disabled="isButtonDisabled"
              @click="start()"
          >
            <i class="material-icons left">play_arrow</i> Start
          </button>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script>

import { required } from 'vuelidate/lib/validators';
import BuildProgress from '@/components/BuildProgress';
import _ from 'lodash';
import EventBus from '@/event-bus';

function initialState() {
  return {
    isButtonDisabled: false,
    showModal: false,
    form: {
      branch: null,
      instance: null,
      api_client: null,
      api_secret: null,
      client_id_password: null,
      client_secret_password: null,
      be_url: null,
    },
    build: {
      started: false,
      status: '',
      summary: '',
      error: null,
      broadcast: null,
    },
  };
}

export default {
  components: {
    BuildProgress,
  },

  props: {
    branch: String,
  },

  data() {
    return initialState();
  },

  computed: {
    branches() {
      return this.$store.state['extranet-x5'].branches;
    },
    instances() {
      const mmpiInstances = this.$store.state.mmpi.instances;

      let x5instances = this.configurations.reduce((accumulator, configuration) => {
        if (configuration.app_type === 'extranet' && configuration.app_version === 'X5') {
          accumulator.push(
            configuration.dev_instance,
            configuration.val_instance,
            configuration.deploy_dev_instance,
          );
        }
        return accumulator;
      }, []);

      x5instances = x5instances.filter((el) => el);

      const instances = mmpiInstances.filter(
        (mmpiInstance) => x5instances.includes(mmpiInstance.name),
      );

      return instances;
    },
    configurations() {
      return this.$store.state.pas.configurations;
    },
    be_url() {
      if (!this.form.build || !this.form.build.details) {
        return null;
      }

      return this.form.build.details.be_url.replace(/\/+$/, '');
    },
  },

  validations() {
    const validations = {
      form: {
        instance: {
          required,
          name: {
            required,
          },
        },
        api_client: {
          required,
        },
        api_secret: {
          required,
        },
        client_id_password: {
          required,
        },
        client_secret_password: {
          required,
        },
        be_url: {
          required,
        },
      },
    };

    if (!this.branch) {
      validations.form.branch = {
        required,
        name: {
          required,
        },
      };
    }

    return validations;
  },

  watch: {
    'form.instance': _.debounce(function fn() {
      const loader = this.$loading.show({ container: this.$refs.modal });

      if (!this.form.instance || !this.form.instance.name) {
        loader.hide();
        return false;
      }

      this.setApiArguments(this.form.instance.name);

      return this.$store
        .dispatch('extranet-x5/getBackendUrl', {
          instanceName: this.form.instance.name,
          instanceHost: this.form.instance.host,
          instanceUser: this.form.instance.user,
        })
        .then((response) => {
          this.form.be_url = response.data.be_url;
        })
        .catch(() => {
          this.form.be_url = null;
          this.$M.toast({
            html: 'Error retrieving backend url. Please type manually',
            classes: 'toast-fail',
          });
        })
        .finally(() => {
          loader.hide();
        });
    }, 1000),
  },

  methods: {
    open() {
      this.form = initialState().form;
      this.build = initialState().build;
      this.showModal = true;
    },

    close() {
      this.showModal = false;
      this.isButtonDisabled = false;
      this.$v.$reset();
    },

    start() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      this.isButtonDisabled = true;

      this.$store.dispatch('extranet-x5/startBuild', {
        branch: this.form.branch ? this.form.branch.name : this.branch,
        instance: this.form.instance,
        api_client: this.form.api_client,
        api_secret: this.form.api_secret,
        client_id_password: this.form.client_id_password,
        client_secret_password: this.form.client_secret_password,
        be_url: this.form.be_url,
      })
        .then((response) => {
          this.build.status = 'running';
          this.build.summary = 'Build will start shortly ...';
          this.build.broadcast = response.data.broadcast;
          EventBus.$emit('build.created');
        })
        .catch((error) => {
          this.build.status = 'failed';
          this.build.summary = 'Could not start build';
          if (error.response.status === 403) {
            this.build.error = 'You do not have insufficient rights to create build';
          } else {
            this.build.error = error;
          }
        })
        .finally(() => { this.build.started = true; });
    },

    setApiArguments(instanceName) {
      const x5record = this.configurations.find(
        (configuration) => configuration.app_type === 'extranet'
              && configuration.app_version === 'X5'
              && configuration.dev_instance === instanceName,
      );

      this.form.api_client = x5record ? x5record.api_client : null;
      this.form.api_secret = x5record ? x5record.api_secret : null;
      this.form.client_id_password = x5record ? x5record.client_id_password : null;
      this.form.client_secret_password = x5record ? x5record.client_secret_password : null;
    },
  },
  beforeCreate() {
    this.$store.dispatch('extranet-x5/getBranches');
    this.$store.dispatch('mmpi/getInstances');
    this.$store.dispatch('pas/getConfigurations');
  },
};
</script>
<style scoped>
.sensitive-info{
  margin-left: 26px;
}
</style>
