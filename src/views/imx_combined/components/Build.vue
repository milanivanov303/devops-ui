<template>
  <div class="row">
    <div class="col s12" >
      <button
        v-if="$auth.can('imx_be.create-builds')"
        class="btn"
        @click="openBe()">
        <i class="material-icons left">add</i> New BE build
      </button>

      <Modal v-if="showModal" @close="close()" class="right-sheet">
        <template v-slot:header>{{ branch }} // Create new build <br></template>
        <template v-slot:content>
          <div v-if="build.started === false" class="col s12 l11" key="formBe" >
            <div class="row" v-if="!branch">
              <div class="col s12" >
                <Autocomplete
                  label="Branch"
                  icon="dynamic_feed"
                  :items="beBranches"
                  v-model="formBe.branch"
                  :invalid="$v.formBe.branch.$error"
                  @blur="$v.formBe.branch.$touch()"
                />
              </div>
              <div class="validator col s11 offset-s1">
                <div class="red-text" v-if="$v.formBe.branch.$error">
                  <p v-if="!$v.formBe.branch.required">
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
                  v-model="formBe.instance"
                  :invalid="$v.formBe.instance.$error"
                  @blur="$v.formBe.instance.$touch()"
                />
              </div>
              <div class="validator col s11 offset-s1">
                <div class="red-text" v-if="$v.formBe.instance.$error">
                  <p v-if="!$v.formBe.instance.required">
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
                v-model="formBe.ttsKey"
                :invalid="$v.formBe.ttsKey.$error"
                @blur="$v.formBe.ttsKey.$touch()"
              />
              <div class="validator col s12"
                   v-if="$v.formBe.ttsKey.$error">
                <div class="red-text" v-if="!$v.formBe.ttsKey.required">
                  <p>Field is required</p>
                </div>
                <div class="red-text" v-if="!$v.formBe.ttsKey.validKey">
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
            @click="startBe()"
          >
            <i class="material-icons left">play_arrow</i> Start
          </button>
        </template>
      </Modal>
    </div>

    <div class="col s12" >
      <button
        v-if="$auth.can('imx_fe.create-builds')"
        class="btn"
        @click="openFe()">
        <i class="material-icons left">add</i> New FE build
      </button>

      <Modal v-if="showModal" @close="close()" class="right-sheet">
        <template v-slot:header>{{ branch }} // Create new build <br></template>
        <template v-slot:content>
          <div v-if="build.started === false" class="col s12 l11" key="formFe" >
            <div class="row" v-if="!branch">
              <div class="col s12" >
                <Autocomplete
                  label="Branch"
                  icon="dynamic_feed"
                  :items="feBranches"
                  v-model="formFe.branch"
                  :invalid="$v.formFe.branch.$error"
                  @blur="$v.formFe.branch.$touch()"
                />
              </div>
              <div class="validator col s11 offset-s1">
                <div class="red-text" v-if="$v.formFe.branch.$error">
                  <p v-if="!$v.formFe.branch.required">
                    Branch field must not be empty.
                  </p>
                </div>
              </div>
            </div>
            <div class="row" v-if="!client">
              <div class="col s12" >
                <Autocomplete
                  label="Client"
                  icon="people"
                  :items="clients"
                  :valueKey="clientKeyColumn"
                  v-model="formFe.client"
                  :invalid="$v.formFe.client.$error"
                  @blur="$v.formFe.client.$touch()"
                  @input="debounceInput"
                />
              </div>
              <div class="validator col s11 offset-s1 ">
                <div class="red-text" v-if="$v.formFe.client.$error">
                  <p v-if="!$v.formFe.client.required">
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
                  v-model="formFe.build"
                />
              </div>
            </div>
            <div class="row">
              <div class="col s12">
                <TextInput
                  label="Endpoint"
                  icon="link"
                  v-model="formFe.endpoint"
                  :readonly="endpoint !== null"
                  :invalid="$v.formFe.endpoint.$error"
                  @blur="$v.formFe.endpoint.$touch()"
                />
              </div>

              <div class="validator col s11 offset-s1 ">
                <div class="red-text" v-if="$v.formFe.endpoint.$error">
                  <p v-if="!$v.formFe.endpoint.required">
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
            @click="startFe()"
            :disabled="isButtonDisabled"
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
    formBe: {
      branch: null,
      instance: null,
      ttsKey: '',
    },
    formFe: {
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
    client: String,
  },

  data() {
    return initialState();
  },

  computed: {
    beBranches() {
      return this.$store.state.imx_be.branches;
    },
    feBranches() {
      return this.$store.state.imx_fe.branches;
    },
    instances() {
      return this.$store.state.mmpi.instances;
    },
  },

  validations() {
    const validations = {
      formBe: {
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
        formFe: {
          client: {
            required,
          },
          endpoint: {
            required,
          },
        },
      },
    };

    if (!this.branch) {
      validations.formBe.branch = {
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
      this.$store.dispatch('imx_fe/getBranches');
      this.$store.dispatch('builds/getActive');
      this.$store.dispatch('mmpi/getProjects');
    },

    openBe() {
      this.formBe = initialState().formBe;
      this.build = initialState().build;

      this.getData();

      this.showModal = true;
    },

    openFe() {
      this.formFe = initialState().formFe;
      this.build = initialState().build;

      this.getData();

      this.showModal = true;
    },

    close() {
      this.$v.$reset();
      this.showModal = false;
      this.isButtonDisabled = false;
    },

    startBe() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      this.isButtonDisabled = true;
      this.$store.dispatch('imx_be/startBuild', {
        branch: this.formBe.branch ? this.formBe.branch.name : this.branch,
        instance: this.formBe.instance,
        ttsKey: this.formBe.ttsKey,
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

    startFe() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      this.isButtonDisabled = true;
      this.$store.dispatch('imx_fe/startBuild', {
        branch: this.formFe.branch ? this.formFe.branch.name : this.branch,
        client: this.formFe.client[this.clientKeyColumn]
          ? this.formFe.client[this.clientKeyColumn]
          : this.formFe.client,
        build: this.formFe.build,
        endpoint: this.formFe.endpoint,
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
