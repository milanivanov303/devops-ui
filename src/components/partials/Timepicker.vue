<template>
    <div class="time-range">
        <div class="input-field col s6 m6 l6">
            <i class="material-icons prefix">alarm</i>
            <input name="start_time"
                   type="text"
                   class="timepicker"
                   v-model.lazy="startTime"
                   @change="returnStartTime"/>
            <label>Start Time</label>
        </div>
        <div class="input-field col s6 m6 l6">
            <input name="end_time"
                   type="text"
                   class="timepicker"
                   v-model.lazy="endTime"
                   @change="returnEndTime"/>
            <label>End Time</label>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      startTime: '',
      endTime: '',
    };
  },
  methods: {
    returnStartTime() {
      this.$emit('startTimePick', this.startTime);
    },
    returnEndTime() {
      this.$emit('endTimePick', this.endTime);
    },
    timeRange() {
      const time = document.querySelectorAll('.timepicker');
      this.$M.Timepicker.init(time, {
        twelveHour: false,
      });
    },
  },
  mounted() {
    this.timeRange();
  },
};
</script>

<style scoped>
.time-range {
    padding: 0 0;
}
</style>
