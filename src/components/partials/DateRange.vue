<template>
    <div class="date-range">
        <div class="input-field col s6 m6 l6">
            <i class="material-icons prefix">date_range</i>
            <input id="startDate"
                   name="start_date"
                   type="text"
                   class="datepicker"
                   v-model.lazy="startDate"
                   @change="returnStartDate"/>
            <label>Start Date</label>
        </div>
        <div class="input-field col s6 m6 l6">
            <input id="endDate"
                   name="end_date"
                   type="text"
                   class="datepicker"
                   v-model.lazy="endDate"
                   @change="returnEndDate"/>
            <label>End Date</label>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      startDate: '',
      endDate: '',
    };
  },
  methods: {
    returnStartDate() {
      this.$emit('startDatePick', this.startDate);
    },
    returnEndDate() {
      this.$emit('endDatePick', this.endDate);
    },
    dateRange() {
      const startDate = document.querySelector('#startDate');
      const endDate = document.querySelector('#endDate');
      endDate.setAttribute('disabled', 'disabled');

      this.$M.Datepicker.init(startDate, {
        format: 'yyyy-mm-dd',
        disableWeekends: true,
        firstDay: 1,
        minDate: new Date(),
        onSelect: (date) => {
          endDate.removeAttribute('disabled');
          this.$M.Datepicker.init(endDate, {
            format: 'yyyy-mm-dd',
            disableWeekends: true,
            firstDay: 1,
            minDate: date,
          });
        },
      });
    },
  },
  mounted() {
    this.dateRange();
  },
};
</script>

<style scoped>
.date-range {
    padding: 0 0;
}
</style>
