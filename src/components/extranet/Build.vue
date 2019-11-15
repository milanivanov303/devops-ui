<template>
  <div class="row">
    <div class="col s12" >
      <button class="btn" @click="open()">Start</button>
      <div ref="start-build-modal" class="modal right-sheet">
        <div class="modal-content">
          <h4 class="left-align">Build</h4>
          <template v-if="build.started === false">
            <div key="form" >
              <div class="row">
                <div class="input-field col s12">
                  <select id="client" ref="client" v-model="form.client">
                    <option disabled value="">Choose client</option>
                    <option v-for="(client, index) in clients"
                           :value="client"
                           :key="index">{{ client.name }}</option>
                  </select>
                  <label for="client">Client</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
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
                <div class="input-field col s12">
                  <select id="instance" ref="instance" v-model="form.instance">
                    <option disabled value="">Choose instance</option>
                    <option v-for="(instance, index) in instances"
                            :value="instance"
                            :key="index">{{ instance.name }}</option>
                  </select>
                  <label for="instance">Instance</label>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div key="build" >
              <div class="row">
                <div class="col s12">
                  <p>{{ build.summary }}</p>
                  <div v-if="build.status === 'running'" class="progress">
                    <div
                      v-if="build.progress"
                      class="determinate"
                      :style="{width: build.progress + '%'}">
                    </div>
                    <div v-else class="indeterminate"></div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col s12">
                  <div class="log">{{ build.log }}</div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="modal-footer">
          <button
            :class="{ 'waves-effect': true, btn: true, disabled: build.summary }"
            @click="start()"
          >
            Start
          </button>
          <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import client from '@/plugins/ws';

function initialState() {
  return {
    form: {
      client: [],
      javaVersion: 8,
      instance: [],
    },
    build: {
      started: false,
      status: '',
      summary: '',
      progress: null,
      log: '',
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
    clients() {
      return this.$store.state.extranet.clients;
    },
    instances() {
      return this.$store.state.mmpi.instances;
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
          anyOf: [
            { instance_type_id: 'DEV' },
            { instance_type_id: 'VAL' },
          ],
        }),
      };

      this.$store.dispatch('mmpi/getInstances', payload).then(() => loader.hide());
    },
    open() {
      this.form = initialState()['form'];
      this.build = initialState()['build'];

      this.$M.Modal.init(this.$refs['start-build-modal'], {
        dismissible: false,
        preventScrolling: true,
        onOpenEnd: () => {
          this.$M.FormSelect.init(this.$refs.client);
          this.$M.FormSelect.init(this.$refs['java-version']);
          this.$M.FormSelect.init(this.$refs.instance);
        }
      });

      this.$M.Modal.getInstance(this.$refs['start-build-modal']).open();
    },
    start() {
      this.build.started = true;
      this.build.summary = 'Build will start shortly ...';

      this.$store.dispatch('extranet/startBuild', {
        branch: this.branch,
        client: this.form.client,
        java_version: this.form.javaVersion,
        instance: this.form.instance,
      })
        .then((build) => {
          this.build.status = 'running';

          if (!client.connected) {
            return;
          }

          const subscribe = client.subscribe(
            `/queue/${build.broadcast.queue}`,
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
            build.broadcast,
          );
        })
        .catch((error) => {
          this.build.status = 'failed';
          this.build.summary = 'Could not start build';
          this.build.log = error;
        });
    },
    scrollLogContainer() {
      setTimeout(() => {
        var container = this.$el.querySelector(".log");
        container.scrollTop = container.scrollHeight;
      }, 100);
    }
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
