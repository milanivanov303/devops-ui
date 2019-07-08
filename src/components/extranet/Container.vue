<template>
  <div class="container">
    <div v-if="container">
      <p>Container: {{ container.Name }}</p>
      <p>
        Status:
        <i :class="['material-icons', 'codix-text', 'text-' + container.State.Status]">fiber_manual_record</i>
        {{ container.State.Status }}
      </p>
      <button v-if="!container.State.Running" class="btn" @click="start()">Start</button>
      <button v-else class="btn" @click="stop()">Stop</button>

      <Build v-bind:container="container"></Build>

    </div>
    <button v-else class="btn" @click="create()">Create</button>
  </div>
</template>

<script>
import Build from "@/components/extranet/Build";
import Api from "@/plugins/api";
import config from "@/config";

const api = new Api(config.devops.url, config.devops.code);

export default {
  components: {
    Build
  },
  data() {
    return {
      container: null
    };
  },
  props: {
    branch: {}
  },
  methods: {
    getName() {
      return `extranet-${this.branch}`;
    },
    showLoader() {
      if (!this.loader || !this.loader.isActive) {
        this.loader = this.$loading.show({container: this.$el});
      }
    },
    create() {
      this.showLoader();
      api.post(`docker/containers/${this.getName()}`, {
        "Hostname": this.branch,
        "Tty": true,
        "Image": "avitohol.codixfr.private:5000/extranet-base:1.6.3",
        "HostConfig": {
          "PublishAllPorts": true
        },
        "Labels": {
          "type": "extranet",
          "branch": this.branch
        }
      }).then(container => {
        this.start();
      });
    },
    start() {
      this.showLoader();
      api.post(`docker/containers/start/${this.getName()}`).then(response => {
        this.get();
      });
    },
    stop() {
      this.showLoader();
      api.post(`docker/containers/stop/${this.getName()}`).then(response => {
        this.get();
      });
    },
    get() {
      this.showLoader();
      api.get(`docker/containers/${this.getName()}`).then(container => {
        this.container = container;
        this.loader.hide();
      });
    }
  },
  mounted() {
    this.get()
  }
};
</script>
