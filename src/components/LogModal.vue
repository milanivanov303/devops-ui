<template>
  <Modal v-if="showModal" @opened="getLogDetails" class="right-sheet">
    <template v-slot:header>{{ branch }} // Create new build </template>
    <template v-slot:content>
      <div>
        <div v-if="logDetails.status === 'success'" class="center" >
          <i class="material-icons large green-text">check_circle_outline</i>
          <p>Build completed successfully</p>
        </div>

        <div v-else-if="logDetails.status === 'failed'" class="center">
          <i class="material-icons large red-text">error_outline</i>
          <p>{{ logDetails.error || logDetails.summary }}</p>
        </div>

        <div v-else class="row">
          <div class="col s12">
            <p>{{ logDetails.summary }}</p>
            <Progress v-if="logDetails.status === 'running'" :progress="logDetails.progress"></Progress>
          </div>
        </div>

        <div class="row">
          <div class="col s12">
            <div class="log">{{ logDetails.log }}</div>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script lang="js">
export default {
  props: {
    showModal: false,
    branch: String,
    broadcast: null,
  },
  data() {
    return {
      logDetails: {
        summary: 'Build will start shortly ...',
        log: '',
      }
    }
  },
  methods: {
    getLogDetails() {

      if (this.showModal === true) {

        const subscribe = this.$ws.subscribe(
          `/queue/${this.broadcast.queue}`,
          (message) => {
            const data = JSON.parse(message.body);

            this.logDetails.status = data.status;

            if (data.summary) {
              this.logDetails.summary = data.summary;
            }
            this.logDetails.progress = data.progress || null;

            if (data.log) {
              this.logDetails.log += data.log;
            }

            if (data.status === 'failed' || (data.action === 'deploy' && data.status !== 'running')) {
              this.$emit('created');
              subscribe.unsubscribe();
            }
          },
          this.broadcast,
        );
      }
    }
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
