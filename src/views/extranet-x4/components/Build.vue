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
                  icon="storage"
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
                  icon="dns"
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
              <div class="col s12 m6">
                <Autocomplete
                  label="Config"
                  icon="style"
                  :items="configs"
                  valueKey="name"
                  v-model="form.config"
                  :invalid="$v.form.config.$error"
                  @blur="$v.form.config.$touch()"
                />
                <div class="validator">
                  <div class="red-text" v-if="$v.form.config.$error">
                    <p v-if="!$v.form.config.required">
                      Config field must not be empty.
                    </p>
                  </div>
                </div>
              </div>
              <div class="col s12 m6">
                <Autocomplete
                    label="Project"
                    :items="projects"
                    valueKey="name"
                    v-model="form.project"
                />
              </div>
            </div>
            <div class="row">
              <div class="col s12" >
                <Select
                  :options="images"
                  icon="file_upload"
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
import EventBus from '@/event-bus';

function initialState() {
  return {
    isButtonDisabled: false,
    showModal: false,
    form: {
      branch: null,
      instance: null,
      config: null,
      project: null,
      image: null,
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
      return this.$store.state['extranet-x4'].branches;
    },
    instances() {
      return this.$store.state.mmpi.instances;
    },
    configs() {
      return this.$store.state.pas.params.filter((x) => x.type === 'x4' && x.category === 'config');
    },
    projects() {
      return this.$store.state.pas.params.filter((x) => x.type === 'x4' && x.category === 'project');
    },
    images() {
      return this.$store.state['extranet-x4'].images;
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
        config: {
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
      this.$store.dispatch('extranet-x4/getBranches');
      this.$store.dispatch('mmpi/getInstances');
      this.$store.dispatch('extranet-x4/getImages');
      this.$store.dispatch('pas/getParams');
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
      this.$store.dispatch('extranet-x4/startBuild', {
        branch: this.form.branch ? this.form.branch.name : this.branch,
        instance: this.form.instance,
        config: this.form.config.name,
        project:
            this.form.project !== null && typeof this.form.project.name !== 'undefined' ? this.form.project.name : null,
        image: this.form.image,
        do_release: null,
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
