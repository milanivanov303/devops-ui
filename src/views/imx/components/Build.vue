<template>
  <div class="row">
    <div class="col s12" >
        <button
            class="btn right"
            @click="open()">
            <i class="material-icons left">add</i> New build
        </button>

        <Modal v-if="showModal" @close="close()" class="right-sheet">
            <template v-slot:header>Create new iMX build <br></template>
            <template v-slot:content>
                <div v-if="building.started === false" class="col s12 l11" key="form">
                    <span class="card-title">TTS</span>
                    <div class="row">
                        <div class="col s12" >
                            <TextInput
                              label="TTS key"
                              icon="apps"
                              v-model="build.tts_key"
                              @blur="$v.build.tts_key.$touch()"
                              :invalid="$v.build.tts_key.$error"
                            />
                        </div>
                    </div>
                    <div class="validator col s11 offset-s1">
                      <div class="red-text" v-if="$v.build.tts_key.$error">
                        <p v-if="!$v.build.tts_key.required">
                            TTS key field must not be empty.
                        </p>
                      </div>
                    </div>
                    <span class="card-title">Back-end</span>
                    <div class="row">
                        <div class="col s12">
                            <Autocomplete
                            label="BE Branch"
                            icon="laptop_chromebook"
                            :items="be_branches"
                            v-model="build.be_branch"
                            @blur="$v.build.be_branch.$touch()"
                            :invalid="$v.build.be_branch.$error"
                            />
                        </div>
                        <div class="validator col s11 offset-s1">
                            <div class="red-text" v-if="$v.build.be_branch.$error">
                                <p v-if="!$v.build.be_branch.required">
                                    Back end branch field must not be empty.
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
                            v-model="build.instance"
                            @blur="$v.build.instance.$touch()"
                            :invalid="$v.build.instance.$error"
                            />
                        </div>
                        <div class="validator col s11 offset-s1">
                            <div class="red-text" v-if="$v.build.instance.$error">
                                <p v-if="!$v.build.instance.required">
                                    Instance field must not be empty.
                                </p>
                            </div>
                        </div>
                    </div>
                    <span class="card-title">Front-end</span>
                    <div class="row">
                        <div class="col s12">
                            <Autocomplete
                            label="FE Branch"
                            icon="laptop_chromebook"
                            :items="fe_branches"
                            v-model="build.fe_branch"
                            @blur="$v.build.fe_branch.$touch()"
                            :invalid="$v.build.fe_branch.$error"
                            />
                        </div>
                        <div class="validator col s11 offset-s1">
                            <div class="red-text" v-if="$v.build.fe_branch.$error">
                                <p v-if="!$v.build.fe_branch.required">
                                    Front end branch field must not be empty.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col s12" >
                            <TextInput
                            label="Client"
                            icon="people"
                            v-model="build.client"
                            @blur="$v.build.client.$touch()"
                            :invalid="$v.build.client.$error"
                            />
                        </div>
                        <div class="validator col s11 offset-s1 ">
                            <div class="red-text" v-if="$v.build.client.$error">
                                <p v-if="!$v.build.client.required">
                                    Client field must not be empty.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <BuildProgress
                    v-else
                    :broadcast="build.broadcast"
                    :status="building.status"
                    :summary="building.summary"
                    :error="building.error"
                ></BuildProgress>
            </template>
            <template v-slot:footer>
            <button
                id="start-btn"
                v-if="!building.started"
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

export default {
  components: {
    BuildProgress,
  },

  data() {
    return {
      showModal: false,
      build: {},
      building: {
        started: false,
        status: '',
        summary: '',
        progress: null,
        log: '',
        error: null,
      },
    };
  },

  computed: {
    be_branches() {
      return this.$store.state.imx_be.branches;
    },
    fe_branches() {
      return this.$store.state.imx_fe.branches;
    },
    instances() {
      return this.$store.state.mmpi.instances;
    },
  },

  validations: {
    build: {
      tts_key: {
        required,
      },
      be_branch: {
        required,
      },
      instance: {
        required,
      },
      fe_branch: {
        required,
      },
      client: {
        required,
      },
    },
  },

  methods: {
    getData() {
      const promises = [];
      promises.push(this.$store.dispatch('imx_be/getBranches'));
      promises.push(this.$store.dispatch('mmpi/getInstances'));
      promises.push(this.$store.dispatch('imx_fe/getBranches'));

      Promise.all(promises)
        .then(() => {
          if (this.$route.params.key) {
            this.build.tts_key = this.$route.params.key;
          }
        });
    },

    open() {
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

      const payload = { ...this.build };
      payload.be_branch = this.build.be_branch.name;
      payload.fe_branch = this.build.fe_branch.name;

      this.$store.dispatch('imx/startBuild', payload)
        .then((response) => {
          this.building.status = 'running';
          this.building.summary = 'Build will start shortly ...';
          this.building.broadcast = response.data.broadcast;
          EventBus.$emit('build.created');
        })
        .catch((error) => {
          this.building.status = 'failed';
          this.building.summary = 'Could not start build';
          if (error.response.status === 403) {
            this.building.error = 'You do not have insufficient rights to create build';
          } else {
            this.building.error = error;
          }
        })
        .finally(() => { this.building.started = true; });
    },
  },
};
</script>
