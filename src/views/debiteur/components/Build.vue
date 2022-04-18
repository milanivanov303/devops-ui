<template>
  <div class="row">
    <div class="col s12" >
      <button
        v-if="$auth.can('debiteur.create-builds')"
        class="btn"
        @click="open()">
        <i class="material-icons left">add</i> New build
      </button>

      <Modal v-if="showModal" @close="close()" class="right-sheet">
        <template v-slot:header>{{ branch }} // Create new build </template>
        <template v-slot:content>
          <div v-if="!build.started"  class="col s12 l11" key="form" >
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
                <Autocomplete
                  label="Client"
                  icon="people"
                  :items="clients"
                  v-model="form.client"
                  :invalid="$v.form.client.$error"
                  @blur="$v.form.client.$touch()"
                />
              </div>
              <div class="validator col s11 offset-s1">
                <div class="red-text" v-if="$v.form.client.$error">
                  <p v-if="!$v.form.client.required">
                    Client field must not be empty.
                  </p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col s12">
                <Select
                  v-model="form.javaVersion"
                  :options="[4,5,6,7,8]"
                  :defaultOption="false"
                  label="Java Version"
                  icon="history"
                />
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
                <Select
                  :options="images"
                  icon="cloud_upload"
                  label="Deploy on"
                  displayed="label"
                  :default-option="false"
                  v-model="form.image"
                />
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
      javaVersion: 8,
      instance: null,
      image: null,
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
    clients() {
      return this.$store.state.debiteur.clients;
    },
    branches() {
      return this.$store.state.debiteur.branches;
    },
    instances() {
      return this.$store.state.mmpi.instances;
    },
    images() {
      return this.$store.state.extranet.images;
    },
  },

  validations() {
    const validations = {
      form: {
        client: {
          required,
          name: {
            required,
          },
        },
        instance: {
          required,
          name: {
            required,
          },
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
    images() {
      [this.form.image] = this.images;
    },
  },

  methods: {
    getData() {
      this.$store.dispatch('debiteur/getClients');
      this.$store.dispatch('debiteur/getBranches');
      this.$store.dispatch('extranet/getImages');
      this.$store.dispatch('mmpi/getInstances');
    },

    open() {
      this.form = initialState().form;
      this.build = initialState().build;

      this.showModal = true;

      this.getData();
    },

    close() {
      this.showModal = false;
      this.$v.$reset();
    },

    start() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      this.$store.dispatch('debiteur/startBuild', {
        branch: this.form.branch ? this.form.branch.name : this.branch,
        client: this.form.client,
        java_version: this.form.javaVersion,
        instance: this.form.instance,
        image: this.form.image,
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
