<template>
  <div class="row">
    <div class="col s12" >
      <button
        v-if="$auth.can('imx_be.create-builds')"
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
      instance: null,
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
      return this.$store.state.imx_be.branches;
    },
    instances() {
      return this.$store.state.mmpi.instances;
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

  methods: {
    getData() {
      this.$store.dispatch('imx_be/getBranches');
      this.$store.dispatch('mmpi/getInstances');
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

      this.$store.dispatch('imx_be/startBuild', {
        branch: this.form.branch ? this.form.branch.name : this.branch,
        instance: this.form.instance,
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
