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
              <TextInput
                  class="col s12 readonly"
                  label="Api-client"
                  icon="compare_arrows"
                  v-model="form.api_client"
              />
              <div class="validator col s11 offset-s1">
                <div class="red-text" v-if="$v.form.api_client.$error">
                  <p v-if="!$v.form.api_client.required">
                    Api-client field must not be empty. Check X5 records in Devops matrix.
                  </p>
                </div>
              </div>
            </div>
            <div class="row">
              <TextInput
                  class="col s12 readonly"
                  label="Api-secret"
                  icon="compare_arrows"
                  v-model="form.api_secret"
              />
              <div class="validator col s11 offset-s1">
                <div class="red-text" v-if="$v.form.api_secret.$error">
                  <p v-if="!$v.form.api_secret.required">
                    Api-secret field must not be empty. Check X5 records in Devops matrix.
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
// import EventBus from '@/event-bus';

function initialState() {
  return {
    isButtonDisabled: false,
    showModal: false,
    form: {
      branch: null,
      instance: null,
      api_client: null,
      api_secret: null,
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
      return this.$store.state.mmpi.instances;
    },
    configurations() {
      return this.$store.state.pas.configurations;
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
    'form.instance': function fn() {
      const x5record = this.configurations.find(
        (configuration) => configuration.app_type === 'extranet'
              && configuration.app_version === 'X5'
              && configuration.dev_instance === this.form.instance.name,
      );

      this.form.api_client = x5record ? x5record.api_client : null;
      this.form.api_secret = x5record ? x5record.api_secret : null;
    },
  },

  methods: {
    getData() {
      this.$store.dispatch('extranet-x5/getBranches');
      this.$store.dispatch('mmpi/getInstances');
      this.$store.dispatch('pas/getConfigurations');
    },

    open() {
      this.form = initialState().form;
      this.build = initialState().build;

      this.getData();

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
      const branch1 = this.form.branch ? this.form.branch.name : this.branch;
      const instance1 = this.form.instance;

      alert(`Will trigger pipeline with the following parameters: ${branch1} ${instance1.name} ${this.form.api_client} ${this.form.api_client}`);

      // this.$store.dispatch('extranet-x5/startBuild', {
      //   branch: this.form.branch ? this.form.branch.name : this.branch,
      //   instance: this.form.instance,
      //   api_client: this.form.api_client,
      //   api_secret: this.form.api_secret,
      // })
      //   .then((response) => {
      //     this.build.status = 'running';
      //     this.build.summary = 'Build will start shortly ...';
      //     this.build.broadcast = response.data.broadcast;
      //     EventBus.$emit('build.created');
      //   })
      //   .catch((error) => {
      //     this.build.status = 'failed';
      //     this.build.summary = 'Could not start build';
      //     if (error.response.status === 403) {
      //       this.build.error = 'You do not have insufficient rights to create build';
      //     } else {
      //       this.build.error = error;
      //     }
      //   })
      //   .finally(() => { this.build.started = true; });
    },
  },
};
</script>
