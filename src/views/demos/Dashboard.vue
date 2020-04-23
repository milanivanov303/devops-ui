<template>
    <div class="dashboard row">
        <div class="col s12 l6">
            <div class="card" ref="demos_by_status">
                <div class="card-content">
                    <span class="card-title">Number of demos by status</span>
                    <div class="col s12 l6 right">
                        <div class="input-field">
                        <Select :select="selectStartDate" @selectedVal="getDemos"/>
                        </div>
                    </div>
                    <BarChart :data="statusChartData" :options="chartOptions" :height="200"></BarChart>
                </div>
            </div>
            <!-- <div class="card" ref="active_demos">
                <div class="card-content">
                    <span class="card-title">Active demos for the month</span>
                    <div class="col s12 l6 right">
                        <div class="input-field">
                        <Select :select="selectStartDate" @selectedVal="getDemos"/>
                        </div>
                    </div>
                    <BarChart :data="activeDemosChartData" :options="chartOptions" :height="100"></BarChart>
                </div>
            </div> -->
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
            const demos = this.$store.getters['demo/getAllByStatus']('status');

            return {
                labels: Object.keys(demos),
                datasets: [{ data: Object.values(demos).sort((a, b) => b - a)}],
            };
        },
        // activeDemosChartData() {
        //     const demos = this.$store.getters['demo/getByStatus']();

        //     return {
        //         labels: Object.keys(demos),
        //         datasets: [{ data: Object.values(demos).sort((a, b) => b - a), type:'line'}],
        //     };
        // }
    },
    methods: {
        async getDemos(days = {}) {
            const loader1 = this.$loading.show({ container: this.$refs.demos_by_status });
            this.$store.dispatch('demo/getDemosForPeriod',
                {
                    startDate: this.getStartDate(days.value || this.startDate),
                },
            ).finally(() => loader1.hide());
        },
        getStartDate(value) {
            const newDate = new Date(
                new Date().setTime(new Date().getTime() - (value * 24 * 60 * 60 * 1000)),
            );

            return newDate.toJSON();
        },
    },
    mounted() {
        this.getDemos();
    },
}
</script>