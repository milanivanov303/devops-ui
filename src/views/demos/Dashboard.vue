<template>
    <div class="dashboard row">
        <div class="col s12 l6">
            <div class="card" ref="demos_by_status">
                <div class="card-content">
                    <span class="card-title">Number of demos by status</span>
                    <div class="col s12 l6 right">
                        <div class="input-field">
                            <Select :select="selectStartDate" @selectedVal="getDemosbyStatus"/>
                        </div>
                    </div>
                    <BarChart :data="statusChartData" :options="chartOptions"></BarChart>
                </div>
            </div>
        </div>
        <div class="col s12 l6">
            <div class="card" ref="active_demos">
                <div class="card-content">
                    <span class="card-title">Number of demos by days</span>
                    <div class="col s12 l6 right">
                        <div class="input-field">
                            <Select :select="selectStartDate" @selectedVal="getDemos"/>
                        </div>
                    </div>
                    <BarChart :data="demosChartData" :options="chartOptions"></BarChart>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import BarChart from '@/components/BarChart';

export default {
  components: {
    BarChart,
  },
  data() {
    return {
      dates: [],
      startDate: 30,
      selectStartDate: {
        id: 'startDate_select',
        name: 'startDate',
        displayed: 'name',
        icon: 'today',
        options: [
          {
            name: 'Last 24 hours',
            value: 1,
          },
          {
            name: 'Last 7 days',
            value: 7,
          },
          {
            name: 'Last 30 days',
            value: 30,
          },
        ],
        selected: {
          name: 'Last 30 days',
          value: 30,
        },
      },
      chartOptions: {
        legend: {
          display: false,
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
          }],
        },
      },
    };
  },
  computed: {
    statusChartData() {
      const demos = this.$store.getters['demo/getAllByStatus']('status-demos');

      return {
        labels: Object.keys(demos),
        datasets: [{ data: Object.values(demos).sort((a, b) => b - a) }],
      };
    },
    demosChartData() {
      const activeDemos = this.$store.getters['demo/getByStatus']('active-demos', 'active', this.dates);
      const rejectedDemos = this.$store.getters['demo/getByStatus']('active-demos', 'rejected', this.dates);
      const requestedDemos = this.$store.getters['demo/getByStatus']('active-demos', 'requested', this.dates);

      return {
        labels: Object.values(this.dates),
        datasets: [
          { data: Object.values(activeDemos), label: 'Active Demos', type: 'line' },
          { data: Object.values(rejectedDemos), label: 'Rejected Demos', type: 'line' },
          { data: Object.values(requestedDemos), label: 'Requested Demos', type: 'line' },
        ],
      };
    },
  },
  methods: {
    getDemosbyStatus(days = {}) {
      const loader1 = this.$loading.show({ container: this.$refs.demos_by_status });
      this.$store.dispatch('demo/getDemosForPeriod',
        {
          startDate: this.getStartDate(days.value || this.startDate),
          stateName: 'status-demos',
        }).finally(() => loader1.hide());
    },
    getDemos(days = {}) {
      const loader = this.$loading.show({ container: this.$refs.demos });

      const promise1 = this.$store.dispatch('demo/getDemosForPeriod',
        {
          startDate: this.getStartDate(days.value || this.startDate),
          stateName: 'active-demos',
        });
      const promise2 = this.$store.dispatch('demo/getDemosForPeriod',
        {
          startDate: this.getStartDate(days.value || this.startDate),
          stateName: 'rejected-demos',
        });
      const promise3 = this.$store.dispatch('demo/getDemosForPeriod',
        {
          startDate: this.getStartDate(days.value || this.startDate),
          stateName: 'requested-demos',
        });

      Promise.all([promise1, promise2, promise3]).finally(() => {
        loader.hide();
        this.getDates(days.value || this.startDate);
      });
    },

    getStartDate(value) {
      const newDate = new Date(
        new Date().setTime(new Date().getTime() - (value * 24 * 60 * 60 * 1000)),
      );

      return newDate.toJSON();
    },
    getDates(days) {
      const dateArray = [];
      const startDate = new Date(new Date()
        .setTime(new Date().getTime() - (days * 24 * 60 * 60 * 1000)));
      const endDate = new Date();
      let currentDate = startDate;
      while (currentDate <= endDate) {
        dateArray.push(''.concat(`${currentDate.getUTCFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`));
        currentDate = new Date(new Date()
          .setTime(currentDate.getTime() + (1 * 24 * 60 * 60 * 1000)));
      }
      this.dates = dateArray;
    },
  },
  mounted() {
    this.getDemos();
    this.getDemosbyStatus();
  },
};
</script>
