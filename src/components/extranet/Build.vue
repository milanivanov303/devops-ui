<template>
  <div class="row">
    <div class="col s12" >
      <button class="btn" @click="open()">Start</button>
      <div ref="start-build-modal" class="modal right-sheet">
        <div class="modal-content">
          <h4 class="left-align">Build</h4>

          <div :class="{'hide': build.summary}">
            <div class="row">
              <div class="input-field col s12">
                <select id="client" ref="client" v-model="build.client">
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
                <select id="java-version" ref="java-version" v-model="build.javaVersion">
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
                <select id="instance" ref="instance" v-model="build.instance">
                  <option disabled value="">Choose instance</option>
                  <option v-for="(instance, index) in instances"
                          :value="instance"
                          :key="index">{{ instance.name }}</option>
                </select>
                <label for="instance">Instance</label>
              </div>
            </div>
          </div>

          <div :class="{'hide': !build.summary}">
            <div class="row">
              <div class="col s12">
                <p>{{ build.summary }}</p>
                <div class="progress">
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

const Stomp = require('stompjs');

const ws = new WebSocket('ws://bezmer.codixfr.private:15674/ws');
const client = Stomp.over(ws);

client.connect(
  'devops',
  'spoved',
  () => {},
  () => {},
  'devops',
);

// client.debug = function(str) {};

const build = {
  client: [],
  javaVersion: 8,
  instance: [],
  summary: '',
  progress: null,
  log: '',
};

const report = {
  build: {
    starting: 'Build will start shortly ...',
    running: 'Build is running ...',
    success: 'Build successfully',
    failed: 'Build has failed. Check log for details',
  },
  'build.download': {
    running: 'Downloading build ...',
    success: 'Build was downloaded successfully',
    failed: 'Could not download build!',
  },
  'repack.upload': {
    running: 'Uploading build to instance for repack...',
    success: 'Build was uploaded successfully',
    failed: 'Could not upload build!',
  },
  repack: {
    running: 'Repack is running ...',
    success: 'Repacked successfully',
    failed: 'Could not repack build!',
  },
  'repack.download': {
    running: 'Downloading repacked build ...',
    success: 'Repacked build downloaded successfully',
    failed: 'Could not download repacked build!',
  },
  container: {
    running: 'Creating container for deploy ...',
    success: 'Container was created successfully',
    failed: 'Could not created container',
  },
  deploy: {
    running: 'Deploying build ...',
    success: 'Doployed successfully',
    failed: 'Could not deploy build',
  },
};

export default {
  data() {
    return {
      build,
      report,
    };
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
      this.build = JSON.parse(JSON.stringify(build));
      setTimeout(() => {
        this.$M.FormSelect.init(this.$refs.client);
        this.$M.FormSelect.init(this.$refs['java-version']);
        this.$M.FormSelect.init(this.$refs.instance);
      }, 100);
      this.$M.Modal.getInstance(this.$refs['start-build-modal']).open();
    },
    start() {
      this.build.summary = this.report.build.starting;

      this.$store.dispatch('extranet/startBuild', {
        branch: this.branch,
        client: this.build.client,
        java_version: this.build.javaVersion,
        instance: this.build.instance,
      })
        .then((build) => {
          if (!client.connected) {
            return;
          }

          client.subscribe(
            `/queue/${build.broadcast.queue}`,
            (message) => {
              const data = JSON.parse(message.body);

              this.build.summary = this.report[data.action][data.status];
              this.build.progress = data.progress || null;
              this.build.log += data.log || '';
            },
            build.broadcast,
          );
        })
        .catch((error) => {
          this.build.summary = this.report.build.failed;
          this.build.log = error;
        });
    },
  },
  mounted() {
    this.$M.Modal.init(this.$refs['start-build-modal'], {
      dismissible: false,
      preventScrolling: true,
    });

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
