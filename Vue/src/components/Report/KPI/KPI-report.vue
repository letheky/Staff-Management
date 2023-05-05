<template>
  <div class="kpi-report mt-5 ml-5 mr-5">
    <h1>KPI Reports</h1>
    <v-tabs>
      <v-row :class="'shadow-bar'">
        <v-tab :class="'text-normal'"> Overview </v-tab>
        <v-tab :class="'text-normal'"> Detail </v-tab>
      </v-row>
      <v-tab-item>
        <v-col cols="12" md="4" :style="{ paddingLeft: '0 !important' }">
          <v-menu
            ref="menu"
            v-model="pickDateChart"
            :close-on-content-click="true"
            transition="scale-transition"
            offset-y
            max-width="300px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                outlined
                v-model="dateInput"
                label="Choose months"
                :class="'select-month'"
                dense
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>

            <v-date-picker @change="pickDate" v-model="date" type="month"></v-date-picker>
          </v-menu>
        </v-col>
        <OverviewComponent :date="date" />
      </v-tab-item>
      <v-tab-item>
        <div class="d-flex justify-space-between pt-2" style="margin-top: 10px">
          <v-row>
            <v-col cols="12" md="4">
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="true"
                transition="scale-transition"
                offset-y
                max-width="300px"
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    outlined
                    v-model="dateInput"
                    label="Choose months"
                    dense
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker @change="pickDate" v-model="date" type="month"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                :class="'select-location'"
                v-model="category"
                :items="categories"
                dense
                label="Categories"
                outlined
                @input="changeCategory"
              >
              </v-select>
            </v-col>
          </v-row>
        </div>
        <TwoAxisYBarChart
          v-if="category == 'Revenue'"
          :title="'Total Revenue'"
          :category="category"
          :chartData="chartDataRevenueStudents"
          :chartOptions="chartOptionsRevenue"
          :total="totalRevenue"
          :data="[]"
        />
        <TwoAxisYBarChart
          v-else-if="category == 'Stopped Students'"
          :title="'Total Stopped Students'"
          :chartData="chartDataStoppedStudents"
          :chartOptions="chartOptionsStoppedStudents"
          :category="category"
          :total="totalStopped"
          :data="[]"
        />
        <div v-else>
          <h3 class="title-sale">New Sale Amount Chart</h3>
          <TwoAxisYBarChart
            :title="'Total of New Sale'"
            :category="category"
            :chartData="chartDataSaleAmount"
            :chartOptions="chartOptionsSaleAmount"
            :total="totalSaleAmount"
            :data="[]"
          />
          <h3 class="title-sale">New Sale Students Number Chart</h3>
          <TwoAxisYBarChart
            :title="' Total Students of New Sale'"
            :category="category"
            :chartData="chartDataSaleStudent"
            :chartOptions="chartOptionsSaleAmount"
            :total="totalSaleStudent"
            :data="[]"
          />
        </div>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import TwoAxisYBarChart from './TwoAxisYBarChart.vue'
import OverviewComponent from './OverviewComponent.vue'
import { kpi_report } from '@/api/kpi_report.js'
export default {
  components: {
    TwoAxisYBarChart,
    OverviewComponent,
  },
  created() {
    this.init()
  },
  methods: {
    pickDate(value) {
      let dateArr = value.split('-')
      this.dateInput = `${dateArr[1]}/${dateArr[0]}`

      this.init()
    },
    changeCategory(data) {
      this.category = data
    },
    getShortLabelLocation(label) {
      let lableToArr = label.split(' ')
      let stringShort = ''
      lableToArr.forEach(element => {
        if (element === 'CEC') {
          stringShort += ''
        } else {
          stringShort += element[0]
        }
      })
      return stringShort.toUpperCase(stringShort)
    },
    watch: {
      date: function () {
        this.init()
      },
    },
    async init() {
      const month = new Date(this.date).getMonth() + 1
      const year = new Date(this.date).getFullYear()
      await kpi_report.getKPIStoppedStudent(month, year).then(res => {
        const labelLocationList = res.map(item => this.getShortLabelLocation(item.location))
        const dataKpiStoppedCol = res.map(item => item.noStoppedStudent)
        const dataKpiStoppedTotal = res.map(item => item.noStu)
        const dataKpiStoppedLine = res.map(item =>
          item.noStu ? ((item.noStoppedStudent / item.noStu) * 100).toFixed(1) : 0
        )
        const total = res
          .map(item => item.noStoppedStudent)
          .reduce((a, b) => {
            return a + b
          })
        this.totalStopped = total
        this.chartDataStoppedStudents = {
          labelHeader: ['Students', '%'],
          chartGlossary: [
            {
              bgColor: '#0C2E68',
              text: 'Stopped Students ',
              box: '',
              color: '',
            },
            {
              bgColor: '#90BE6D',
              text: 'Out of tuition students',
              box: '',
              color: '',
            },
            {
              text: 'Stopped Students / Out of tuition students',
              box: '130,24%',
              bgColor: '#CFFFD1',
              color: '#27AE60',
            },
          ],
          ...this.chartDataStoppedStudents,
          labels: labelLocationList,
          datasets: [
            { ...this.chartDataStoppedStudents.datasets[0], data: dataKpiStoppedLine },
            { ...this.chartDataStoppedStudents.datasets[1], data: dataKpiStoppedCol },
            { ...this.chartDataStoppedStudents.datasets[2], data: dataKpiStoppedTotal },
          ],
        }
      })
      await kpi_report.getKPIRevenue(month, year).then(res => {
        const labelLocationList = res.map(item => this.getShortLabelLocation(item.location))
        const dataKpiRevenueColActu = res.map(item => item.revAmount / 10000000)
        const dataKpiRevenueColTarget = res.map(item => item.revTarget / 10000000)
        const total = res
          .map(item => item.revAmount)
          .reduce((a, b) => {
            return a + b
          })
        this.totalRevenue = total
        const dataKpiRevenueLine = res.map(item => {
          if ((item.revAmount / item.revTarget) * 100 === Infinity) {
            return 0
          }
          return ((item.revAmount / item.revTarget) * 100).toFixed(1)
        })
        this.chartDataRevenueStudents = {
          labelHeader: ['mil VNĐ', '%'],
          chartGlossary: [
            {
              bgColor: '#0C2E68',
              text: 'Revenue Students ',
              box: '',
              color: '',
            },
            {
              text: 'Revenue Students / Total Students ',
              box: '130,24%',
              bgColor: '#CFFFD1',
              color: '#27AE60',
            },
          ],

          ...this.chartDataRevenueStudents,
          labels: labelLocationList,
          datasets: [
            { ...this.chartDataRevenueStudents.datasets[0], data: dataKpiRevenueLine },
            { ...this.chartDataRevenueStudents.datasets[1], data: dataKpiRevenueColActu },
            { ...this.chartDataRevenueStudents.datasets[2], data: dataKpiRevenueColTarget },
          ],
        }
      })
      await kpi_report.getKPISales(month, year).then(res => {
        const labelLocationList = res.map(item => this.getShortLabelLocation(item.location))
        const dataKpiSalesAmonutActual = res.map(item => item.paidAmt / 1000000)
        const dataKpiSalesAmonutTarget = res.map(item => item.nsTarget / 1000000)
        const dataKpiSalesStudentActual = res.map(item => item.nbrStu)
        const dataKpiSalesStudentTarget = res.map(item => item.qtyTarget)

        this.totalSaleAmount = res
          .map(item => item.paidAmt)
          .reduce((a, b) => {
            return a + b
          })
        this.totalSaleStudent = res
          .map(item => item.nbrStu)
          .reduce((a, b) => {
            return a + b
          })
        const dataSalesAmonutLine = res.map(item => {
          if ((item.paidAmt / item.nsTarget) * 100 === Infinity) {
            return 0
          }
          return ((item.paidAmt / item.nsTarget) * 100).toFixed(1)
        })
        const dataSalesStudentLine = res.map(item => {
          if ((item.nbrStu / item.qtyTarget) * 100 === Infinity) {
            return 0
          }
          return ((item.nbrStu / item.qtyTarget) * 100).toFixed(1)
        })
        this.chartDataSaleAmount = {
          ...this.chartDataSaleAmount,
          labels: labelLocationList,
          datasets: [
            { ...this.chartDataSaleAmount.datasets[0], data: dataSalesAmonutLine },
            { ...this.chartDataSaleAmount.datasets[1], data: dataKpiSalesAmonutActual },
            { ...this.chartDataSaleAmount.datasets[2], data: dataKpiSalesAmonutTarget },
          ],
        }
        this.chartDataSaleStudent = {
          ...this.chartDataSaleStudent,
          labels: labelLocationList,
          datasets: [
            { ...this.chartDataSaleStudent.datasets[0], data: dataSalesStudentLine },
            { ...this.chartDataSaleStudent.datasets[1], data: dataKpiSalesStudentActual },
            { ...this.chartDataSaleStudent.datasets[2], data: dataKpiSalesStudentTarget },
          ],
        }
      })
    },
  },
  data() {
    return {
      pickDateChart: false,
      dateInput: new Date().getMonth() + 1 + '/' + new Date().getFullYear(),
      headers: [
        {
          text: 'Center',
          align: 'start',
          sortable: false,
          value: 'center',
        },
        { text: 'Revenue', value: 'revenue' },
        { text: 'Stopped Students', value: 'stoppedStudents' },
        { text: 'New Sale', value: 'newSale' },
        { text: 'Average Student', value: 'averageStudent' },
        { text: 'Customer Care', value: 'customerCare' },
      ],
      KPI: [],
      date: new Date().toISOString().substr(0, 7),
      menu: false,
      categories: ['Revenue', 'Stopped Students', 'New Sale'],
      category: 'Revenue',
      chartLabelRevenue: ['(mil VND)', '%'],
      chartLabelStoppedStudents: ['(student)'],
      totalRevenue: 0,
      totalStopped: 0,
      totalSaleAmount: 0,
      totalSaleStudent: 0,
      chartDataSaleStudent: {
        labelHeader: ['mil VNĐ', '%'],
        chartGlossary: [
          {
            bgColor: '#0C2E68',
            text: 'Actual New Sale Students',
            box: '',
            color: '',
          },
          {
            bgColor: '#90BE6D',
            text: 'Target New Sale Students ',
            box: '',
            color: '',
          },
          {
            text: 'Actual / Target New Sale Students',
            box: '130,24%',
            bgColor: '#CFFFD1',
            color: '#27AE60',
          },
        ],
        total: 10000,
        labels: [],
        datasets: [
          {
            label: 'Percentage',
            type: 'line',
            backgroundColor: '#000',
            borderColor: 'red',
            datalabels: {
              formatter: function (value) {
                return value + '%'
              },
              backgroundColor: function (context) {
                const dataNumber = parseFloat(context.dataset.data[context.dataIndex])
                if (dataNumber < 100) {
                  return ' #FFD6D6'
                } else if (dataNumber === 100) {
                  return ' #FFEEB2'
                } else {
                  return '#CFFFD1'
                }
              },
              color: function (context) {
                const dataNumber = parseFloat(context.dataset.data[context.dataIndex])
                if (dataNumber < 100) {
                  return ' #DC322D'
                } else if (dataNumber === 100) {
                  return ' #9B7B00'
                } else {
                  return '#27AE60'
                }
              },
              align: 'end',
              anchor: 'end',
            },

            data: [],
            yAxisID: 'y1',
            ticks: {
              autoSkip: false,
              maxRotation: 90,
              minRotation: 90,
              fontSize: 10,
              fontColor: 'Black',
              defaultFontFamily: 'Arial, Helvetica, sans-serif',
            },
          },

          {
            label: 'Actual',
            backgroundColor: '#0C2E68',
            type: 'bar',
            datalabels: {
              formatter: Math.round,
              padding: 6,
              color: '#000',
              align: 'end',
              anchor: 'end',
            },
            data: [],
            yAxisID: 'y',
          },
          {
            label: 'Target',
            backgroundColor: '#90BE6D',
            type: 'bar',

            datalabels: {
              formatter: Math.round,
              padding: 6,
              color: '#000',

              align: 'end',
              anchor: 'end',
            },
            data: [],
            yAxisID: 'y',
          },
        ],
      },
      chartDataSaleAmount: {
        labelHeader: ['mil VNĐ', '%'],
        chartGlossary: [
          {
            bgColor: '#0C2E68',
            text: 'Actual New Sale ',
            box: '',
            color: '',
          },
          {
            bgColor: '#90BE6D',
            text: 'Target New Sale ',
            box: '',
            color: '',
          },
          {
            text: 'Actual / Target New Sale ',
            box: '130,24%',
            bgColor: '#CFFFD1',
            color: '#27AE60',
          },
        ],
        total: 10000,
        labels: [],
        datasets: [
          {
            label: 'Percentage',
            type: 'line',
            backgroundColor: '#000',
            borderColor: 'red',
            datalabels: {
              formatter: function (value) {
                return value + '%'
              },
              backgroundColor: function (context) {
                const dataNumber = parseFloat(context.dataset.data[context.dataIndex])
                if (dataNumber < 100) {
                  return ' #FFD6D6'
                } else if (dataNumber === 100) {
                  return ' #FFEEB2'
                } else {
                  return '#CFFFD1'
                }
              },
              color: function (context) {
                const dataNumber = parseFloat(context.dataset.data[context.dataIndex])
                if (dataNumber < 100) {
                  return ' #DC322D'
                } else if (dataNumber === 100) {
                  return ' #9B7B00'
                } else {
                  return '#27AE60'
                }
              },
              align: 'end',
              anchor: 'end',
            },

            data: [],
            yAxisID: 'y1',
            ticks: {
              autoSkip: false,
              maxRotation: 90,
              minRotation: 90,
              fontSize: 10,
              fontColor: 'Black',
              defaultFontFamily: 'Arial, Helvetica, sans-serif',
            },
          },

          {
            label: 'Actual',
            backgroundColor: '#0C2E68',
            type: 'bar',
            datalabels: {
              formatter: Math.round,
              padding: 6,
              color: '#000',
              align: 'end',
              anchor: 'end',
            },
            data: [],
            yAxisID: 'y',
          },
          {
            label: 'Target',
            backgroundColor: '#90BE6D',
            type: 'bar',

            datalabels: {
              formatter: Math.round,
              padding: 6,
              color: '#000',

              align: 'end',
              anchor: 'end',
            },
            data: [],
            yAxisID: 'y',
          },
        ],
      },
      chartDataRevenueStudents: {
        labelHeader: ['mil VNĐ', '%'],
        chartGlossary: [
          {
            bgColor: '#0C2E68',
            text: 'Actual Revenue ',
            box: '',
            color: '',
          },
          {
            bgColor: '#90BE6D',
            text: 'Target Revenue ',
            box: '',
            color: '',
          },
          {
            text: 'Actual / Target Revenue ',
            box: '130,24%',
            bgColor: '#CFFFD1',
            color: '#27AE60',
          },
        ],
        total: 10000,
        labels: [],
        datasets: [
          {
            label: 'Percentage',
            type: 'line',
            backgroundColor: '#000',
            borderColor: 'red',
            datalabels: {
              formatter: function (value) {
                return value + '%'
              },
              backgroundColor: function (context) {
                const dataNumber = parseFloat(context.dataset.data[context.dataIndex])
                if (dataNumber < 100) {
                  return ' #FFD6D6'
                } else if (dataNumber === 100) {
                  return ' #FFEEB2'
                } else {
                  return '#CFFFD1'
                }
              },
              color: function (context) {
                const dataNumber = parseFloat(context.dataset.data[context.dataIndex])
                if (dataNumber < 100) {
                  return ' #DC322D'
                } else if (dataNumber === 100) {
                  return ' #9B7B00'
                } else {
                  return '#27AE60'
                }
              },
              align: 'end',
              anchor: 'end',
            },

            data: [],
            yAxisID: 'y1',
            ticks: {
              autoSkip: false,
              maxRotation: 90,
              minRotation: 90,
              fontSize: 10,
              fontColor: 'Black',
              defaultFontFamily: 'Arial, Helvetica, sans-serif',
            },
          },

          {
            label: 'Actual',
            backgroundColor: '#0C2E68',
            type: 'bar',
            datalabels: {
              formatter: Math.round,
              padding: 6,
              color: '#000',
              align: 'end',
              anchor: 'end',
            },
            data: [],
            yAxisID: 'y',
          },
          {
            label: 'Target',
            backgroundColor: '#90BE6D',
            type: 'bar',

            datalabels: {
              formatter: Math.round,
              padding: 6,
              color: '#000',

              align: 'end',
              anchor: 'end',
            },
            data: [],
            yAxisID: 'y',
          },
        ],
      },
      chartDataStoppedStudents: {
        labels: [],
        datasets: [
          {
            label: 'Percentage',
            type: 'line',
            backgroundColor: '#000',
            borderColor: 'red',

            datalabels: {
              formatter: function (value) {
                return value + '%'
              },
              backgroundColor: function (context) {
                const dataNumber = parseInt(context.dataset.data[context.dataIndex])
                if (dataNumber > 10) {
                  return ' #FFD6D6'
                } else if (dataNumber === 10) {
                  return ' #FFEEB2'
                } else {
                  return '#CFFFD1'
                }
              },
              color: function (context) {
                const dataNumber = parseInt(context.dataset.data[context.dataIndex])
                if (dataNumber > 10) {
                  return ' #DC322D'
                } else if (dataNumber === 10) {
                  return ' #9B7B00'
                } else {
                  return '#27AE60'
                }
              },
              align: 'end',
              anchor: 'end',
            },

            data: [],
            yAxisID: 'y1',
            ticks: {
              autoSkip: false,
              maxRotation: 90,
              minRotation: 90,
              fontSize: 10,
              fontColor: 'Black',
              defaultFontFamily: 'Arial, Helvetica, sans-serif',
            },
          },
          {
            label: 'Actual',
            backgroundColor: '#0C2E68',
            type: 'bar',
            datalabels: {
              formatter: Math.round,
              padding: 6,
              color: '#000',

              align: 'end',
              anchor: 'end',
            },
            data: [],
            yAxisID: 'y',
          },
          {
            label: 'Target',
            backgroundColor: '#90BE6D',
            type: 'bar',

            datalabels: {
              formatter: Math.round,
              padding: 6,
              color: '#000',

              align: 'end',
              anchor: 'end',
            },
            data: [],
            yAxisID: 'y',
          },
        ],
      },
      chartOptionsRevenue: {
        responsive: true,

        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            // grid line settings
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          },
        },
        layout: {
          padding: {
            top: 32,
            right: 16,
            bottom: 16,
            left: 8,
          },
        },
      },
      chartOptionsSaleAmount: {
        responsive: true,
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          },
        },
        layout: {
          padding: {
            top: 32,
            right: 16,
            bottom: 16,
            left: 8,
          },
        },
      },
      chartOptionsStoppedStudents: {
        responsive: true,

        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            // grid line settings
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          },
        },
        layout: {
          padding: {
            top: 32,
            right: 16,
            bottom: 16,
            left: 8,
          },
        },
      },
    }
  },
}
</script>

<style scoped lang="scss">
.text-normal {
  text-transform: initial;
}

.kpi-report {
  padding: 0 20px;
}

.title-sale {
  margin-bottom: 10px;
}

.shadow-bar[data-v-f94e587a]::before {
  content: '';
  position: absolute;
  bottom: 0px;
  left: 0;
  width: 100%;
  background: white;
  height: 0.5px;
  z-index: 10000;
  box-shadow: 5px 16px 10px 10px #1b1b1b;
}

.kpi-report h1 {
  font-size: 21px;
}
.select-month {
  padding-left: 0 !important;
}
</style>
