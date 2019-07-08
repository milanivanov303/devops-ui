<template>
  <div class="build">
    build component {{ container.Name }}

    <button class="btn" @click="open()">Start build</button>

    <div ref="start-build-modal" class="modal">
      <div class="modal-content">
        <h4 class="left-align">Start Build</h4>
        <div v-if="build.started" class="row">
          <div class="col s12">
            <pre>{{ build.log }}</pre>
          </div>
        </div>
        <div v-else>
          <div class="row">
            <div class="input-field col s12">
            <select id="client" ref="client" v-model="build.client">
              <option value=""></option>
              <option v-for="client in clients" :value="client.package">{{ client.name }}</option>
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
        <button :class="{'waves-effect': true, btn: true, disabled: build.started}" @click="start()">Start</button>
        <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "@/plugins/api";
import config from "@/config";

const api = new Api(config.devops.url, config.devops.code);

export default {
  data() {
    return {
      clients: [],
      build: {
        started: false,
        running: false,
        log: "",
        logFile: "",
        branch: this.container.Config.Labels.branch,
        client: "",
        javaVersion: 8
      }
    };
  },
  props: {
    container: {}
  },
  methods: {
    open() {
      this.build.started = false;
      this.build.running = false;
      M.Modal.getInstance(this.$refs['start-build-modal']).open();
    },
    start() {
      api.post("extranet/start-build", {
        branch: this.build.branch,
        client: this.build.client,
        java_version: this.build.javaVersion
      }).then((build) => {
        this.build.logFile = build.log_file;
        this.build.started = true;
        this.build.running = true;
        this.check();
      });
    },
    check() {
      setTimeout(() => {
        api.post("extranet/check-build", {
          branch: this.build.branch,
          log_file: this.build.logFile
        }).then((build) => {
          this.build.log = build.log;
          this.build.running = build.running;
          if (build.running) {
            this.check();
          }
        });
      }, 5000);
    }
  },
  mounted() {
    M.Modal.init(this.$refs['start-build-modal']);
    M.FormSelect.init(this.$refs['java-version']);

    let loader = this.$loading.show({ container: this.$el });

    api.get("extranet/clients").then(clients => {
      this.clients = clients;
      loader.hide();
      setTimeout(() => M.FormSelect.init(this.$refs.client), 100);
    });
  }
};
</script>
