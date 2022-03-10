<template>
  <div>

    <div class="row stages">
      <div class="col s4" v-for="stage in stages" :key="stage">
        <div v-if="currentStages.hasOwnProperty(stage)">
          <Preloader  v-if="currentStages[stage] === 'running'"/>
          <i v-else-if="currentStages[stage] === 'success'" class="material-icons green-text">
            check_circle_outline
          </i>
          <i v-else-if="currentStages[stage] === 'failed'" class="material-icons red-text">
            error_outline
          </i>
        </div>
        <div v-else>
          <i class="material-icons">radio_button_unchecked</i>
        </div>
        <span>{{ stage }}</span>
      </div>
    </div>

    <div v-if="currentStatus === 'success'" class="center" >
      <i class="material-icons large green-text">check_circle_outline</i>
      <p>Build completed successfully</p>
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
import EventBus from '@/event-bus';

export default {
  props: {
    stages: { default: () => ['build', 'deploy', 'verify'], Array },
    broadcast: null,
    status: { default: 'running', String },
    summary: { default: 'Build is running ...', String },
    error: { default: null, String },
    log: { default: '', String },
  },
  data() {
    return {
      currentStages: {},
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

    setStagesData(data) {
      if (data.action === undefined) {
        return;
      }

      const action = data.action.split('.')[0];
      const index = this.stages.indexOf(action);

      this.stages.slice(0, index).forEach((stage) => {
        this.currentStages[stage] = 'success';
      });

      this.currentStages[action] = data.status;
    },

    subscribe() {
      if (!this.$ws.isConnected()) {
        return;
      }

      this.queue = this.$ws.subscribe(
        `/queue/${this.broadcast.queue}`,
        (message) => {
          const data = JSON.parse(message.body);

          this.currentSummary = data.summary;
          this.progress = data.progress || null;

          if (data.log) {
            this.currentLog += data.log;
            this.scrollLogContainer();
          }

          this.setStagesData(data);

          if (data.status === 'failed' || (data.action === [...this.stages].pop() && data.status !== 'running')) {
            this.currentStatus = data.status;
            this.queue.unsubscribe();

            EventBus.$emit('build.created');
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
.stages {
  text-align: center;
  i {
    font-size: 10em;
  }

  span {
    text-transform: capitalize;
  }
}

.log {
  height: 60vh;
  overflow: auto;
  white-space: pre;
}
</style>
