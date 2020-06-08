import { mixins, Bar } from 'vue-chartjs';

function dataHandler() {
  const colors = [];
  this.data.datasets[0].data.forEach(() => {
    colors.push(this.generateRandomColor());
  });
  this.data.datasets[0].backgroundColor = colors;

  this.chartData = this.data;
}

export default {
  extends: Bar,
  mixins: [mixins.reactiveData],
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
    options: {
      type: Object,
      default: () => {
        return {
          legend: {
            display: false,
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                stepSize: 1,
              },
            }],
          },
        };
      },
    },
    height: {
      type: Number,
    },
  },
  methods: {
    generateRandomColor() {
      const letters = '0123456789ABCDEF'.split('');

      let color = '#';
      for (let j = 0; j < 6; j += 1) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
  },
  watch: {
    data: dataHandler,
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
