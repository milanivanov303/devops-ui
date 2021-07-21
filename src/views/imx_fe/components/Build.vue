<template>
  <div class="row">
    <div class="col s12" >
      <button
        v-if="$auth.can('imx_fe.create-builds')"
        class="btn"
        @click="open()">
        <i class="material-icons left">add</i> New build
      </button>

      <Modal v-if="showModal" @close="close()" class="right-sheet">
        <template v-slot:header>{{ branch }} // Create new build <br></template>
        <template v-slot:content>
          <div v-if="build.started === false" class="col s12 l11" key="form" >
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
              <div class="col s12" >
                <TextInput
                  label="Client"
                  icon="people"
                  v-model="form.client"
                  :invalid="$v.form.client.$error"
                  @blur="$v.form.client.$touch()"
                />
              </div>
              <div class="validator col s11 offset-s1 ">
                <div class="red-text" v-if="$v.form.client.$error">
                  <p v-if="!$v.form.client.required">
                    Client field must not be empty.
                  </p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col s12" >
                <Autocomplete
                  label="BE Build"
                  icon="laptop_chromebook"
                  :items="builds"
                  v-model="form.build"
                />
              </div>
            </div>
            <div class="row">
              <div class="col s12">
                <TextInput
                  label="Endpoint"
                  icon="link"
                  v-model="form.endpoint"
                  :readonly="endpoint !== null"
                  :invalid="$v.form.endpoint.$error"
                  @blur="$v.form.endpoint.$touch()"
                />
              </div>

              <div class="validator col s11 offset-s1 ">
                <div class="red-text" v-if="$v.form.endpoint.$error">
                  <p v-if="!$v.form.endpoint.required">
                    Endpoint field must not be empty.
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
          ></BuildProgress>
        </template>
        <template v-slot:footer>
          <button
            id="start-btn"
            v-if="!build.started"
            class="waves-effect btn"
            @click="start()">
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
import EventBus from '@/event-bus';

function initialState() {
  return {
    showModal: false,
    form: {
      branch: null,
      client: null,
      build: null,
      endpoint: null,
    },
    build: {
      started: false,
      status: '',
      summary: '',
      progress: null,
      log: '',
      error: null,
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
      return this.$store.state.imx_fe.branches;
    },
    builds() {
      return this.$store.getters['builds/getActiveByModule']('imx_be')
        .filter((build) => build.status !== 'building');
    },
    endpoint() {
      if (!this.form.build) {
        return null;
      }

      return this.form.build.details.url;
    },
  },

  validations() {
    const validations = {
      form: {
        client: {
          required,
        },
        endpoint: {
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
    endpoint(value) {
      this.form.endpoint = value;
    },
  },

  methods: {
    getData() {
      this.$store.dispatch('imx_fe/getBranches');
      this.$store.dispatch('builds/getActive');
    },

    open() {
      this.form = initialState().form;
      this.build = initialState().build;

      this.getData();

      this.showModal = true;
    },

    close() {
      this.$v.$reset();
      this.showModal = false;
    },

    start() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      this.$store.dispatch('imx_fe/startBuild', {
        branch: this.form.branch ? this.form.branch.name : this.branch,
        client: this.form.client,
        build: this.form.build,
        endpoint: this.form.endpoint,
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
  },
};
</script>
