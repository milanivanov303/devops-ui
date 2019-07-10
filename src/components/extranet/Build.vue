<template>
  <div class="row">
    <div class="col s12" >
      <button class="btn" @click="open()">Start</button>
      <div ref="start-build-modal" class="modal">
        <div class="modal-content">
          <h4 class="left-align">Build</h4>
          <div v-if="build.started">

            <div v-if="build.running" class="row">
              <div v-if="build.running" class="col s12">
                <p>Build is running ...</p>
                <div class="progress">
                  <div class="indeterminate"></div>
                </div>
              </div>
            </div>

            <div v-if="build.failed" class="row">
              <div class="col s12">
                build failed!!!
              </div>
            </div>

            <div v-if="build.running || build.failed" class="row">
              <div class="col s12">
                <pre>{{ build.log }}</pre>
              </div>
            </div>

            <div v-if="build.deployRunning" class="row">
              <div class="col s12">
                Deploying build ....
                <div class="progress">
                  <div class="indeterminate"></div>
                </div>
              </div>
            </div>

            <div v-if="build.deploySuccess" class="row">
              <div class="col s12">
                deployed
              </div>
            </div>

            <div v-if="build.deployFailed" class="row">
              <div class="col s12">
                deployed has failed
                <p>{{ build.deploy.error }}</p>
              </div>
            </div>

          </div>
          <div v-else>
            <div class="row">
              <div class="input-field col s12">
                <select id="client" ref="client" v-model="build.client">
                  <option value=""></option>
                  <option v-for="client in clients" :value="client.package">
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
          <button :class="{ 'waves-effect': true, btn: true, disabled: build.started }" @click="start()">
            Start
          </button>
          <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as M from "materialize-css/dist/js/materialize";
import Api from "@/plugins/api";
import config from "@/config";

const api = new Api(config.devops.url, config.devops.code);

const build = {
  client: "",
  javaVersion: 8,
  log: "",
  logFile: "",
  started: false,
  running: false,
  success: false,
  failed: false,
  error: "",
  deployRunning: false,
  deploySuccess: false,
  deployFailed: false,
  deployError: ""
};

export default {
  data() {
    return {
      clients: [],
      build: build
    };
  },
  props: {
    container: {}
  },
  methods: {
    getClients() {
      const loader = this.$loading.show({ container: this.$el });

      api.get("extranet/clients").then(clients => {
        this.clients = clients;
        loader.hide();
      });
    },
    open() {
      this.build = JSON.parse(JSON.stringify(build));
      setTimeout(() => {
        M.FormSelect.init(this.$refs.client);
        M.FormSelect.init(this.$refs["java-version"]);
      }, 100);
      M.Modal.getInstance(this.$refs["start-build-modal"]).open();
    },
    start() {
      this.build.started = true;
      api.post("extranet/build/start", {
        branch: this.container.Config.Labels.branch,
        client: this.build.client,
        java_version: this.build.javaVersion
      })
      .then(build => {
        if (build.started) {
          this.build.running = true;
          this.build.logFile = build.log_file;
          this.check();
          return;
        }
        this.build.failed = true;
        this.build.error = response.error;
      })
      .catch(() => {
        this.build.failed = true;
      });
    },
    check() {
      setTimeout(() => {
        api.post("extranet/build/check", {
          branch: this.container.Config.Labels.branch,
          log_file: this.build.logFile,
          log_lines: this.build.log.length
        })
        .then(build => {
          this.build.log = build.log;
          this.build.running = build.running;
          if (build.running) {
            return this.check();
          }

          let warFile = this.getWarFile();
          if (warFile) {
            return this.deploy(warFile);
          }

          this.build.failed = true;
        });
      }, 2000);
    },
    getWarFile() {
      let logLines = this.build.log.trim().split(/\r?\n/);
      let warFile  = logLines[logLines.length - 1];

      warFile = warFile.split('/');
      warFile[warFile.length - 1] = 'LOCAL_' + warFile[warFile.length - 1];
      warFile = warFile.join('/');

      if (warFile.match('.war$')) {
        return warFile;
      }

      return null;
    },
    deploy(warFile) {
      let port = this.container.NetworkSettings.Ports['22/tcp'][0].HostPort;

      this.build.deployRunning = true;
      api.post("extranet/build/deploy", {
        port: port,
        war_file: warFile
      }).then((response) => {
        this.build.deploy.running = false;
        if (response.deployed) {
          this.build.deploySuccess = true;
          this.$emit('deployed', warFile);
          return;
        }
        this.build.deployFailed = true;
        this.build.deployError = response.error;
      })
      .catch(() => {
        this.build.deployFailed = true;
      });
    }
  },
  mounted() {
    M.Modal.init(this.$refs["start-build-modal"], {
      dismissible: false,
      preventScrolling: true
    });

    this.getClients();
  }
};
</script>
