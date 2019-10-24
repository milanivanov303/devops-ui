<template>
  <div class="row">
    <div class="col s12" >
      <button class="btn" @click="open()">Start</button>
      <div ref="start-build-modal" class="modal right-sheet">
        <div class="modal-content">
          <h4 class="left-align">Build</h4>
          <div v-if="build.status">

            <div v-if="build.deploy.status === 'running'" class="row">
              <div class="col s12">
                Deploying build ....
                <div class="progress">
                  <div class="indeterminate"></div>
                </div>
              </div>
            </div>

            <div v-else-if="build.deploy.status === 'success'" class="row">
              <div class="col s12">
                deployed
              </div>
            </div>

            <div v-else-if="build.deploy.status === 'failed'" class="row">
              <div class="col s12">
                deployed has failed
                <p>{{ build.deploy.error }}</p>
              </div>
            </div>

            <div v-else-if="build.repack.status === 'running'" class="row">
              <div class="col s12">
                Repacking build ....
                <div class="progress">
                  <div class="indeterminate"></div>
                </div>
              </div>
            </div>

            <div v-else-if="build.repack.status === 'success'" class="row">
              <div class="col s12">
                repacked
              </div>
            </div>

            <div v-else-if="build.repack.status === 'failed'" class="row">
              <div class="col s12">
                repack has failed
                <p>{{ build.repack.error }}</p>
              </div>
            </div>

            <div v-else-if="build.status === 'starting'" class="row">
              <div class="col s12">
                <p>Build starting ...</p>
                <div class="progress">
                  <div class="indeterminate"></div>
                </div>
              </div>
            </div>

            <div v-else-if="build.status === 'running'" class="row">
              <div class="col s12">
                <p>Build is running ...</p>
                <div class="progress">
                  <div class="indeterminate"></div>
                </div>
              </div>
            </div>

            <div v-else-if="build.status === 'failed'" class="row">
              <div class="col s12">
                build failed!!!
              </div>
            </div>

            <div v-if="build.status === 'running' || build.status === 'failed'" class="row">
              <div class="col s12">
                <pre>{{ build.log }}</pre>
              </div>
            </div>

            <div v-if="build.repack.status === 'running' || build.repack.status === 'failed'" class="row">
              <div class="col s12">
                <pre>{{ build.log }}</pre>
              </div>
            </div>

          </div>
          <div v-else>
            <div class="row">
              <div class="input-field col s12">
                <select id="client" ref="client" v-model="build.client">
                  <option disabled value="">Choose client</option>
                  <option v-for="(client, index) in clients"
                         :value="client.package"
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
        </div>
        <div class="modal-footer">
          <button
            :class="{ 'waves-effect': true, btn: true, disabled: build.status }"
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

  var Stomp = require('stompjs');
  var client = Stomp.client('ws://localhost:15674/ws');

  client.connect(
    'devops',
    'devops',
    () => console.log('connected'),
    (error) => console.log(error),
    'devops'
  );

  const build = {
    client: '',
    javaVersion: 8,
    instance: '',
    log: '',
    logFile: '',
    status: null,
    error: '',
    repack: {
      status: null,
      error: '',
    },
    deploy: {
      status: null,
      error: '',
    },
  };

  export default {
    data() {
      return {
        clients: [],
        build,
      };
    },
    props: {
      container: {},
    },
    computed: {
        instances() {
            return this.$store.state.mmpi.instances;
        }
    },
    methods: {
      getClients() {
        const loader = this.$loading.show({ container: this.$el });

        this.$store.dispatch('extranet/getClients')
          .then((clients) => {
            this.clients = clients;
            loader.hide();
          });
      },
      getInstances() {
          const loader = this.$loading.show({ container: this.$el });

          const payload = {
              'filters': JSON.stringify({
                  'anyOf': [
                      {'instance_type_id': 'DEV'},
                      {'instance_type_id': 'VAL'}
                  ]
              })
          };

          this.$store.dispatch('mmpi/getInstances', payload)
              .then((instances) => {
                  loader.hide();
              });
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
        this.build.status = 'starting';
        const payload = {
          branch: this.container.Config.Labels.branch,
          client: this.build.client,
          java_version: this.build.javaVersion
        };
        this.$store.dispatch('extranet/startBuild', payload)
          .then((build) => {
            if (build.status === 'started') {
              this.build.status = 'running';
              return this.watchBuild(build.queue);
            }
            this.build.status = 'failed';
            this.build.error = build.error;
          })
          .catch((error) => {
            this.build.status = 'failed';
            this.build.error = error;
          });
      },
      watchBuild(queue) {
        if (!client.connected) {
          return;
        }

        client.subscribe(`/queue/${queue}`, (message) => {
          var build = JSON.parse(message.body);

          if (build.status === 'success') {
            this.repack(build.war_file);
          }

          this.build.status = build.status;
          this.build.log += build.log || '';
        });
      },
      repack(warFile) {
        this.build.repack.status = 'starting';
        const payload = {
            war_file: warFile,
            instance: this.build.instance
        };
        this.$store.dispatch('extranet/repackBuild', payload)
          .then((repack) => {
              if (repack.status === 'started') {
                this.build.repack.status = 'running';
                return this.watchRepack(repack.queue);
              }
              this.build.repack.status = 'failed';
              this.build.repack.error = repack.error;
          })
          .catch((error) => {
              this.build.repack.status = 'failed';
              this.build.repack.error = error;
          });
      },
      watchRepack(queue) {
          if (!client.connected) {
              return;
          }

          client.subscribe(`/queue/${queue}`, (message) => {
              var repack = JSON.parse(message.body);

              if (repack.status === 'success') {
                  this.deploy(repack.war_file);
              }

              this.build.repack.status = repack.status;
              this.build.log += repack.log || '';
          });
      },
      deploy(warFile) {
        this.build.deploy.status = 'running';
        const payload = {
          host: this.container.Host,
          port: this.container.Ports.ssh,
          war_file: warFile,
        };
        this.$store.dispatch('extranet/deployBuild', payload)
          .then((deploy) => {
            if (deploy.status === 'success') {
              this.build.deploy.status = 'success';
              this.$emit('deployed', warFile);
              return;
            }
            this.build.deploy.status = 'failed';
            this.build.deploy.error = deploy.error;
          })
          .catch((error) => {
            this.build.deploy.status = 'failed';
            this.build.deploy.error = error;
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
  pre {
    max-height: 200px;
    overflow: auto;
  }
</style>
