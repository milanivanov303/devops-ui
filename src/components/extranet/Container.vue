<template>
  <div class="row">
      <div class="col s12" >
        <h4>Container</h4>
        <div v-if="container">
          <p>Name: {{ container.Name }}</p>
          <p>
            WEB port: {{ this.container.Ports.web }}
          </p>
          <p>
            SSH port: {{ this.container.Ports.ssh }}
            (ssh ex1@{{ this.container.Host }} -p {{ this.container.Ports.ssh }})
          </p>
          <p>
            Status:
            <i :class="['material-icons', 'codix-text', 'text-' + container.State.Status]">
              fiber_manual_record
            </i>
            {{ container.State.Status }}
            <button v-if="container.State.Running" class="btn" @click="stop()">Stop</button>
            <button v-else class="btn" @click="start()">Start</button>
          </p>

          <Builds v-bind:container="container"></Builds>
      </div>

      <button v-else class="btn" @click="create()">Create</button>

    </div>
  </div>
</template>

<script>
import Builds from '@/components/extranet/Builds';
// import Api from '@/plugins/api';
import config from '@/config';

// const api = new Api(config.devops.url, config.devops.code);

export default {
  components: {
    Builds,
  },
  data() {
    return {
      container: null,
    };
  },
  props: {
    branch: {},
  },
  methods: {
    getName() {
      return `extranet-${this.branch}`;
    },
    showLoader() {
      if (!this.loader || !this.loader.isActive) {
        this.loader = this.$loading.show({ container: this.$el });
      }
    },
    create() {
      this.showLoader();
      const payload = {
        container: this.getName(),
        data: {
          Hostname: this.branch,
          Tty: true,
          Image: config.extranet.docker.image,
          HostConfig: {
            PublishAllPorts: true,
          },
          Labels: {
            type: 'extranet',
            branch: this.branch,
          },
        },
      };
      this.$store.dispatch('extranet/createContainer', payload)
        .then(() => {
          this.start();
        });
    },
    start() {
      this.showLoader();
      const payload = {
        container: this.getName(),
      };
      this.$store.dispatch('extranet/startContainer', payload)
        .then(() => {
          this.get();
        });
    },
    stop() {
      this.showLoader();
      const payload = {
        container: this.getName(),
      };
      this.$store.dispatch('extranet/stopContainer', payload)
        .then(() => {
          this.get();
        });
    },
    get() {
      this.showLoader();
      const payload = {
        container: this.getName(),
      };
      this.$store.dispatch('extranet/getContainer', payload)
        .then((response) => {
          if (response) {
            this.container = response.data;
            this.container.Host = response.meta.host;
            this.container.Ports = {
              ssh: this.container.NetworkSettings.Ports['22/tcp'][0].HostPort,
              web: this.container.NetworkSettings.Ports['8591/tcp'][0].HostPort,
            };
          }
        })
        .finally(() => this.loader.hide());
    },
  },
  mounted() {
    this.get();
  },
};
</script>
