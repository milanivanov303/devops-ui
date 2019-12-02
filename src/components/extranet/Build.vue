<template>
  <div class="row">
    <div class="col s12" >
      <button class="btn" @click="open()">
        <i class="material-icons left">add</i> New build
      </button>

      <Modal v-if="showModal" @close="showModal = false" @opened="initForm()" class="right-sheet">
        <template v-slot:header>New build</template>
        <template v-slot:content>
          <template v-if="build.started === false">
            <div key="form" >
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
              </div>
              <div class="row">
                <div class="input-field col s12">
                  <i class="material-icons prefix" >history</i>
                  <select id="java-version" ref="java-version" v-model="form.javaVersion">
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                  </select>
                  <label for="java-version">Java Version</label>
                </div>
              </div>
              <div class="row">
                <div class="col s12" >
                  <Autocomplete
                    label="Instance"
                    icon="dynamic_feed"
                    :items="instances"
                    v-model="form.instance"
                    :invalid="$v.form.instance.$error"
                    @blur="$v.form.instance.$touch()"
                  />
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
          <button v-if="!build.started" class="waves-effect btn" @click="start()">
            <i class="material-icons left">play_arrow</i> Start
          </button>
        </template>
      </Modal>

    </div>
  </div>
</template>

<script>

import { required } from 'vuelidate/lib/validators';
import Modal from '@/components/partials/Modal';
import Autocomplete from '@/components/partials/Autocomplete';
import Progress from '@/components/partials/Progress';
import client from '@/plugins/ws';


function initialState() {
  return {
    showModal: false,
    form: {
      client: null,
      javaVersion: 8,
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
    Modal,
    Autocomplete,
    Progress,
  },
  data() {
    return initialState();
  },
  computed: {
    branch() {
      return this.$route.params.branch;
    },
    clients() {
      return this.$store.state.extranet.clients;
    },
    instances() {
      return this.$store.state.mmpi.instances;
    },
  },
  validations: {
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
  },
  methods: {
    getClients() {
      const loader = this.$loading.show({ container: this.$el });
      this.$store.dispatch('extranet/getClients').then(() => loader.hide());
    },
    getInstances() {
      const loader = this.$loading.show({ container: this.$el });

      const payload = {
        filters: JSON.stringify({
          allOf: [
            {
              instance_type_id: {
                value: ['DEV', 'VAL'],
                operator: 'in'
              }
            },
            {
              owner: {
                allOf: [
                  {
                    key: "codix"
                  }
                ]
              }
            }
          ],
        }),
        orders: JSON.stringify({
          name: 'asc',
        }),
      };

      this.$store.dispatch('mmpi/getInstances', payload).then(() => loader.hide());
    },
    open() {
      this.form = initialState().form;
      this.build = initialState().build;

      this.showModal = true;
    },
    initForm() {
      this.$M.FormSelect.init(this.$refs['java-version']);
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
        java_version: this.form.javaVersion,
        instance: this.form.instance,
      };

      this.$store.dispatch('extranet/startBuild', payload)
        .then((response) => {
          this.build.status = 'running';

          if (!client.connected) {
            return;
          }

          const subscribe = client.subscribe(
            `/queue/${response.data.broadcast.queue}`,
            (message) => {
              const data = JSON.parse(message.body);

              if (data.summary) {
                this.build.summary = data.summary;
              }
              this.build.progress = data.progress || null;

              if (data.log) {
                this.build.log += data.log;
                this.scrollLogContainer();
              }

              if (data.status === 'failed' || (data.action === 'deploy' && data.status !== 'running')) {
                this.build.status = data.status;
                this.$store.dispatch('extranet/getContainers');
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
  mounted() {
    this.getClients();
    this.getInstances();
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
