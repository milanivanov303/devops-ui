<template>
  <div>
    <div v-if="currentStatus === 'success'" class="center" >
      <i class="material-icons large green-text">check_circle_outline</i>
      <p>Export completed successfully</p>
    </div>

    <div v-else-if="currentStatus === 'failed'" class="center">
      <i class="material-icons large red-text">error_outline</i>
      <p>{{ currentError || currentSummary }}</p>
    </div>

    <div v-else class="row">
      <div class="col s12">
        <p>{{ currentSummary }}</p>
        <Progress v-if="currentStatus === 'running'" :progress="progress"></Progress>
      </div>
    </div>

    <div class="row">
      <div class="col s12">
        <div ref="log" class="log">{{ currentLog }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="js">

import config from '@/config';
import WebSocket from '@/plugins/ws';

export default {
  props: {
    ws: null,
    broadcast: null,
    status: { default: 'running', String },
    summary: { default: 'Export is running ...', String },
    error: { default: null, String },
    log: { default: '', String },
  },
  data() {
    return {
      currentWsConnect: this.ws,
      currentStatus: this.status,
      currentSummary: this.summary,
      currentError: this.error,
      currentLog: this.log,
      progress: null,
      queue: null,
    };
  },

  methods: {
    scrollLogContainer() {
      setTimeout(() => {
        const container = this.$refs.log;
        container.scrollTop = container.scrollHeight;
      }, 100);
    },

    subscribe() {
      this.currentWsConnect = new WebSocket(
        config.ws.url,
        config.ws.username_es,
        config.ws.password_es,
        config.ws.vhost_es,
      );

      if (!this.currentWsConnect.client.connected) {
        return;
      }

      this.queue = this.currentWsConnect.client.subscribe(
        `/queue/${this.broadcast.queue}`,
        (message) => {
          const data = JSON.parse(message.body);

          this.currentSummary = data.summary;
          this.progress = data.progress || null;

          if (data.log) {
            this.currentLog += data.log;
            this.scrollLogContainer();
          }

          if (data.status === 'failed' || (data.action === 'deploy' && data.status !== 'running')) {
            this.currentStatus = data.status;
            this.queue.unsubscribe();

            this.$emit('openModal');
          }
        },
        this.broadcast,
      );
    },
  },

  watch: {
    broadcast() {
      this.subscribe();
    },
  },

  mounted() {
    if (this.broadcast) {
      this.subscribe();
    }
  },

  beforeDestroy() {
    this.queue.unsubscribe();
  },
};
</script>

<style lang="scss" scoped>
.log {
  height: 60vh;
  overflow: auto;
  white-space: pre;
}
</style>
