<template>
  <Modal @close="$emit('close')" class="right-sheet">
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
        <div class="row">
          <TextInput
            class="col s12"
            label="TTS Key"
            icon="dynamic_feed"
            v-model="form.ttsKey"
            :invalid="$v.form.ttsKey.$error"
            @blur="$v.form.ttsKey.$touch()"
          />
          <div class="validator col s12"
               v-if="$v.form.ttsKey.$error">
            <div class="red-text" v-if="!$v.form.ttsKey.required">
              <p>Field is required</p>
            </div>
            <div class="red-text" v-if="!$v.form.ttsKey.validKey">
              <p>Not a valid TTS key.</p>
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
        :disabled="isButtonDisabled"
        @click="start()"
      >
        <i class="material-icons left">play_arrow</i> Start
      </button>
    </template>
  </Modal>
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
      ttsKey: '',
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
        ttsKey: {
          required,
          validKey(value) {
            return /^(?:[A-Z]|[0-9])+-[0-9]+$/.test(value);
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

    start() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      this.isButtonDisabled = true;
      this.$store.dispatch('imx_be/startBuild', {
        branch: this.form.branch ? this.form.branch.name : this.branch,
        instance: this.form.instance,
        ttsKey: this.form.ttsKey,
      })
        .then((response) => {
          if (response.data.broadcast) {
            this.build.status = 'running';
            this.build.summary = 'Build will start shortly ...';
            this.build.broadcast = response.data.broadcast;
            EventBus.$emit('build.created');
          }

          this.build.summary = response.data.summary;
          this.build.status = 'failed';
        })
        .catch((error) => {
          this.build.status = 'failed';
          this.build.summary = 'Could not start build';
          if (error.response.status === 403) {
            this.build.error = 'You do not have sufficient rights to create a build';
          } else {
            this.build.error = error;
          }
        })
        .finally(() => { this.build.started = true; });
    },
  },
};
</script>
