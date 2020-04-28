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
                    <BarChart :data="statusChartData" :options="chartOptions" :height="200"></BarChart>
                </div>
            </div>
        </div>   
        <div class="col s12 l6">
            <div class="card" ref="active_demos">
                <div class="card-content">
                    <span class="card-title">Number of active demos</span>
                    <div class="col s12 l6 right">
                        <div class="input-field">
                            <Select :select="selectStartDate" @selectedVal="getDemos"/>
                        </div>
                    </div>
                    <BarChart :data="activeDemosChartData" :options="chartOptions" :height="200"></BarChart>
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
        }
    },
    computed: {
        statusChartData() {
            const demos = this.$store.getters['demo/getAllByStatus']('status-demos');

            return {
                labels: Object.keys(demos),
                datasets: [{ data: Object.values(demos).sort((a, b) => b - a)}],
            };
        },
        activeDemosChartData() {
            const demos = this.$store.getters['demo/getByStatus']('active-demos', 'active', this.getDates());

            return {
                labels: Object.keys(demos),
                datasets: [{ data: Object.values(demos), type: 'line'}],
            };
        }
    },
    methods: {
        getDemosbyStatus(days = {}) {
            const loader1 = this.$loading.show({ container: this.$refs.demos_by_status });
            this.$store.dispatch('demo/getDemosForPeriod',
                {
                    startDate: this.getStartDate(days.value || this.startDate),
                    stateName: 'status-demos',
                },
            ).finally(() => loader1.hide());
        },
        getDemos(days = {}) {
            const loader1 = this.$loading.show({ container: this.$refs.active_demos });
            this.$store.dispatch('demo/getDemosForPeriod',
                {
                    startDate: this.getStartDate(days.value || this.startDate),
                    stateName: 'active-demos',
                },
            ).finally(() => loader1.hide());
        },
      
        getStartDate(value) {
            const newDate = new Date(
                new Date().setTime(new Date().getTime() - (value * 24 * 60 * 60 * 1000)),
            );

            return newDate.toJSON();
        },
        getDates() {
            var dateArray = new Array;
            var startDate = new Date(new Date().setTime(new Date().getTime() - (this.selectStartDate.selected.value * 24 * 60 * 60 * 1000)));
            var endDate = new Date();
            var currentDate = startDate;
            while (currentDate <= endDate) {
                dateArray.push("".concat(currentDate.getUTCFullYear() + "-" + (currentDate.getMonth()+1) + "-" + currentDate.getDate()))
                currentDate = new Date(new Date().setTime(currentDate.getTime() + (1 * 24 * 60 * 60 * 1000)));
            }
            return dateArray;
        }
    },
    mounted() {
        this.getDemos();
        this.getDemosbyStatus();
    },
}
</script>