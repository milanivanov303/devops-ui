<template>
  <div>
    <Alert v-if="currentError" :msg="currentError"/>
    <div class="row stages">
      <div class="col stage" v-for="stage in stages" :key="stage"
          :class="['s'.concat( 12 / stages.length ), getStageResult(stage)]">
        <div v-if="currentStages[stage] !== null">
          <Preloader v-if="currentStages[stage] === 'running'"/>
          <i v-else-if="currentStages[stage] === 'success'" class="material-icons">
            check_circle
          </i>
          <i v-else-if="currentStages[stage] === 'failed'" class="material-icons">
            cancel
          </i>
        </div>
        <div v-else>
          <i class="material-icons">radio_button_unchecked</i>
        </div>
        <h6>{{ stage }}</h6>
      </div>
    </div>

<!--    <div v-if="currentStatus === 'success'" class="center" >-->
<!--      <i class="material-icons large success">check_circle_outline</i>-->
<!--      <p>Build completed successfully</p>-->
<!--    </div>-->
<!--    <div v-else-if="currentStatus === 'failed'" class="center">-->
<!--      <i class="material-icons large fail">error_outline</i>-->
<!--      <p>{{ currentError || currentSummary }}</p>-->
<!--    </div>-->

    <div class="row">
      <div class="col s12">
        <h6>{{ currentSummary }} <i class="material-icons">flight_takeoff</i> </h6>
      </div>
    </div>

    <div class="row">
      <div class="col s12">
        <div ref="log" class="log" id="log">
          <p v-for="(line, index) in parseLog(currentLog)" :key="index" v-html="line"></p>
        </div>
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
    const currentStages = {};
    this.stages.forEach((stage) => {
      currentStages[stage] = null;
    });

    return {
      currentStages,
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

    parseLog(log) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;

      const lines = log.split('\n');

      return lines.map((line) => line.replace(urlRegex, '<a href="$1" target="_blank">$1</a>'));
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

    getStageResult(stage) {
      if (Object.prototype.hasOwnProperty.call(this.currentStages, stage)) {
        if (this.currentStages[stage] === 'success') {
          return 'success';
        }
        if (this.currentStages[stage] === 'failed') {
          return 'fail';
        }
      }
      return '';
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
:after, :before {
  right:100%;
}
.stages {
  text-align: center;
  white-space:nowrap;
  .stage {
    display: inline-block;
    position: relative;
    filter: drop-shadow(6px 3px 4px #00000054);
    i {
      position: relative;
      display: inline-block;
      font-size: 6em;
      color: #22283136;
    }
    &:before {
      content: '';
      width: 70%;
      position:absolute;
      top:30%;
      right: 65%;
      z-index: -10;
      border-bottom: 5px solid;
      color: #bbbbbb;
    }
    &:first-of-type:before {
      display:none;
    }
    &.success {
      &:before {
        color: #29A19C;
      }
      i {
        color: #29A19C;
      };
    }
    &.fail {
      &:before {
        color: #C40147;
      }
      i {
        color: #C40147;
      };
    }
  }
  h6 {
    text-transform: capitalize;
  }
}
.preloader-wrapper.active {
  margin-bottom: 8.5px;
  margin-top: 8.55px;
  width: 60px;
  height: 60px;
}
.log {
  height: 60vh;
  overflow: auto;
  white-space: pre;
}
</style>
