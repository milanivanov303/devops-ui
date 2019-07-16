<template>
  <div class="row">
    <div class="col s12" >
      <button class="btn" @click="open()">Start</button>
      <div ref="start-build-modal" class="modal">
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

          </div>
          <div v-else>
            <div class="row">
              <div class="input-field col s12">
                <select id="client" ref="client" v-model="build.client">
                  <option value=""></option>
                  <option v-for="(client, index) in clients" :value="client.package" :key="index">
                    {{ client.name }}
                  </option>
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
import * as M from 'materialize-css/dist/js/materialize';
// import Api from '@/plugins/api';
// import config from '@/config';

// const api = new Api(config.devops.url, config.devops.code);

const build = {
  client: '',
  javaVersion: 8,
  log: '',
  logFile: '',
  status: null,
  error: '',
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
  methods: {
    getClients() {
      const loader = this.$loading.show({ container: this.$el });

      // api.get('extranet/clients').then((clients) => {
      //   this.clients = clients;
      //   loader.hide();
      // });
      const payload = {
        uri: 'extranet/clients',
      };
      this.$store.dispatch('devopsapi/get', payload)
        .then((clients) => {
          this.clients = clients;
          loader.hide();
        });
    },
    open() {
      this.build = JSON.parse(JSON.stringify(build));
      setTimeout(() => {
        M.FormSelect.init(this.$refs.client);
        M.FormSelect.init(this.$refs['java-version']);
      }, 100);
      M.Modal.getInstance(this.$refs['start-build-modal']).open();
    },
    start() {
      this.build.status = 'starting';
      const payload = {
        uri: 'extranet/build/start',
        data: {
          branch: this.container.Config.Labels.branch,
          client: this.build.client,
          java_version: this.build.javaVersion,
        },
      };
      this.$store.dispatch('devopsapi/post', payload)
        .then((build) => {
          if (build.started) {
            this.build.status = 'running';
            this.build.logFile = build.log_file;
            this.check();
            return;
          }
          this.build.status = 'failed';
          this.build.error = build.error;
        })
        .catch((error) => {
          this.build.status = 'failed';
          this.build.error = error;
        });
      // api.post('extranet/build/start', {
      //   branch: this.container.Config.Labels.branch,
      //   client: this.build.client,
      //   java_version: this.build.javaVersion,
      // })
      //   .then((build) => {
      //     if (build.started) {
      //       this.build.status = 'running';
      //       this.build.logFile = build.log_file;
      //       this.check();
      //       return;
      //     }
      //     this.build.status = 'failed';
      //     this.build.error = build.error;
      //   })
      //   .catch((error) => {
      //     this.build.status = 'failed';
      //     this.build.error = error;
      //   });
    },
    check() {
      setTimeout(() => {
        const payload = {
          uri: 'extranet/build/check',
          data: {
            branch: this.container.Config.Labels.branch,
            log_file: this.build.logFile,
            log_start_line: this.build.log.split('\n').length,
          },
        };
        this.$store.dispatch('devopsapi/post', payload)
          .then((build) => {
            this.build.log += build.log;

            if (build.running) {
              return this.check();
            }

            const warFile = this.getWarFile();
            if (warFile) {
              this.build.status = 'success';
              return this.deploy(warFile);
            }

            this.build.status = 'failed';
            return this.build.status;
          });
        // api.post('extranet/build/check', {
        //   branch: this.container.Config.Labels.branch,
        //   log_file: this.build.logFile,
        //   log_start_line: this.build.log.split('\n').length,
        // })
        //   .then((build) => {
        //     this.build.log += build.log;

        //     if (build.running) {
        //       return this.check();
        //     }

        //     const warFile = this.getWarFile();
        //     if (warFile) {
        //       this.build.status = 'success';
        //       return this.deploy(warFile);
        //     }

        //     this.build.status = 'failed';
        //     return this.build.status;
        //   });
      }, 2000);
    },
    getWarFile() {
      const logLines = this.build.log.trim().split(/\r?\n/);
      let warFile = logLines[logLines.length - 1];

      warFile = warFile.split('/');
      warFile[warFile.length - 1] = `LOCAL_${warFile[warFile.length - 1]}`;
      warFile = warFile.join('/');

      if (warFile.match('.war$')) {
        return warFile;
      }

      return null;
    },
    deploy(warFile) {
      this.build.deploy.status = 'running';
      const payload = {
        uri: 'extranet/build/deploy',
        data: {
          host: this.container.Host,
          port: this.container.Ports.ssh,
          war_file: warFile,
        },
      };
      this.$store.dispatch('devopsapi/post', payload)
        .then((response) => {
          if (response.deployed) {
            this.build.deploy.status = 'success';
            this.$emit('deployed', warFile);
            return;
          }
          this.build.deploy.status = 'failed';
          this.build.deploy.error = response.error;
        })
        .catch((error) => {
          this.build.deploy.status = 'failed';
          this.build.deploy.error = error;
        });
      // api.post('extranet/build/deploy', {
      //   host: this.container.Host,
      //   port: this.container.Ports.ssh,
      //   war_file: warFile,
      // }).then((response) => {
      //   if (response.deployed) {
      //     this.build.deploy.status = 'success';
      //     this.$emit('deployed', warFile);
      //     return;
      //   }
      //   this.build.deploy.status = 'failed';
      //   this.build.deploy.error = response.error;
      // })
      //   .catch((error) => {
      //     this.build.deploy.status = 'failed';
      //     this.build.deploy.error = error;
      //   });
    },
  },
  mounted() {
    M.Modal.init(this.$refs['start-build-modal'], {
      dismissible: false,
      preventScrolling: true,
    });

    this.getClients();
  },
};
</script>

<style lang="scss" >
  pre {
    max-height: 200px;
    overflow: auto;
  }
</style>
