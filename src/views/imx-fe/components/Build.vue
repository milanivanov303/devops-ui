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
        <template v-slot:header>{{ branch }} // Create new build <br></template>
        <template v-slot:content>
          <template v-if="build.started === false">
            <div class="col s12 l11" key="form" >
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
                  <TextInput
                    label="Endpoint"
                    icon="link"
                    v-model="form.endpoint"
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
          </template>
          <template v-else>
            <div key="build" >

              <div v-if="build.status === 'success'" class="center" >
                <i class="material-icons large green-text">check_circle_outline</i>
                <p>Build completed successfully</p>
              </div>

              <div v-else-if="build.status === 'failed'" class="center">
                <i class="material-icons large red-text">error_outline</i>
                <p>{{ build.error || build.summary }}</p>
              </div>

              <div v-else class="row">
                <div class="col s12">
                  <p>{{ build.summary }}</p>
                  <Progress v-if="build.status === 'running'" :progress="build.progress"></Progress>
                </div>
              </div>

              <div class="row">
                <div class="col s12">
                  <div class="log">{{ build.log }}</div>
                </div>
              </div>
            </div>
          </template>
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

function initialState() {
  return {
    showModal: false,
    form: {
      client: null,
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
  data() {
    return initialState();
  },
  computed: {
    branch() {
      return this.$route.params.branch;
    },
  },
  validations: {
    form: {
      client: {
        required,
      },
      endpoint: {
        required,
      },
    },
  },
  methods: {
    open() {
      this.form = initialState().form;
      this.build = initialState().build;
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

      this.build.started = true;
      this.build.summary = 'Build will start shortly ...';

      const payload = {
        branch: this.branch,
        client: this.form.client,
        endpoint: this.form.endpoint,
      };

      this.$store.dispatch('imx_fe/startBuild', payload)
        .then((response) => {
          this.build.status = 'running';

          if (!this.$ws.isConnected()) {
            return;
          }

          const subscribe = this.$ws.subscribe(
            `/queue/${response.data.broadcast.queue}`,
            (message) => {
              const data = JSON.parse(message.body);

              if (data.summary) {
                this.build.summary = data.summary;
              }

              if (data.log) {
                this.build.log += data.log;
                this.scrollLogContainer();
              }

              if (data.status && data.status !== 'running') {
                this.build.status = data.status;
                this.$emit('created');
                subscribe.unsubscribe();
              }
            },
            response.data.broadcast,
          );
        })
        .catch((error) => {
          this.build.status = 'failed';
          this.build.summary = 'Could not start build';
          if (error.response.status === 403) {
            this.build.error = 'You do not have insufficient rights to create build';
          } else {
            this.build.error = error;
          }
        });
    },
    scrollLogContainer() {
      setTimeout(() => {
        const container = this.$el.querySelector('.log');
        container.scrollTop = container.scrollHeight;
      }, 100);
    },
  },
};
</script>

<style lang="scss" >
  .log {
    height: 60vh;
    overflow: auto;
    white-space: pre;
  }
</style>
