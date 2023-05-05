<template>
  <div class="chart-kpi">
    <h1>{{ title }} : {{ numberWithCommas(total) }}</h1>

    <div>
      <div class="chart-t">
        <p v-for="(header, index) in chartData.labelHeader" :key="index">{{ header }}</p>
        <Bar
          :chart-options="chartOptions"
          :chart-data="chartData"
          :chart-id="chartId"
          :dataset-id-key="datasetIdKey"
          :animation="con"
          :plugins="plugins"
          :css-classes="cssClasses"
          :styles="styles"
          :width="width"
          :height="40"
        />
      </div>
      <table class="label">
        <tr v-for="(note, index) in chartData.chartGlossary" :key="index" class="actual label-item">
          <td v-if="note.box === ''">
            <span class="box-emty" :style="{ background: note.bgColor }"></span>
          </td>

          <td v-else :style="{ padding: '2px', background: note.bgColor, borderRadius: '4px' }">
            {{ note.box }}
          </td>
          <td>{{ note.text }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs/legacy'
import {
  Chart as ChartJS,
  Title,
  Tooltip,

  // Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register({
  Title,
  Tooltip,
  // Legend,

  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
})

const topLabels = {
  id: 'topLabels',
  afterDataSetDraw() {},
}
export default {
  name: 'BarChart',
  components: { Bar },
  props: {
    chartOptions: {
      type: Object,
    },
    title: {
      type: String,
    },
    chartData: {
      type: Array,
    },
    chartId: {
      type: String,
      default: 'bar-chart',
    },
    datasetIdKey: {
      type: String,
      default: 'label',
    },
    total: {
      type: String,
    },
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 100,
    },
    cssClasses: {
      default: '',
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    // plugins: {
    //   type: Object,
    //   default: () => { },
    // },
    category: String, // determine the type of chart
    data: Array,
  },

  data() {
    return {
      plugins: [ChartDataLabels, topLabels],
    }
  },
  methods: {
    numberWithCommas(number) {
      var parts = parseInt(number).toString().split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      return parts.join(',')
    },
  },
  watch: {
    chartData: function () {},
    total: () => {},
  },
}
</script>
<style scoped lang="scss">
.chart-t {
  position: relative;
}

.chart-t > p {
  position: absolute;
  top: 0;
  left: 0.5%;
  font-weight: 700;
}

.chart-kpi {
  padding: 16px 20px;
  margin: 0 5px;
  margin-bottom: 3rem;
  border-radius: 5px;
  box-shadow: -2px 0px 7px #dfdada;
}

.chart-kpi h1 {
  padding-left: 3rem;
}

table {
  border-collapse: separate !important;
  border-spacing: 15px 0;
}

.chart-t > p:nth-child(2) {
  position: absolute;
  top: 0;

  left: 96%;
}

.box-emty {
  display: inline-block;
  width: 24px;
  height: 15px;
}

// .label-item span:nth-of-type(1){
//      display: inline-block;
//      width: 30px;
//      background: #000;
//      height: 20px;
// }
// .label-item:nth-of-type(2) span:nth-of-type(1){
//      display: inline-block;
//      width: 40px;
//      background: rgb(219, 93, 93);
//      height: 20px;
// }
</style>
