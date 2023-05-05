<template>
  <div id="center-management">
    <v-row no-gutters>
      <v-col md="12">
        <div>
          <div class="d-flex back">
            <h2 v-show="$route.params.isMy === 0">
              <v-icon @click="back()">arrow_back_ios</v-icon>
            </h2>
            <h2 class="pt-1">QC Salary: {{ qcName }}</h2>
          </div>
          <div class="d-flex justify-space-between mt-3">
            <div class="d-flex mr-2">
              <v-select
                :class="'select-item'"
                v-model="month"
                :items="listMonth"
                dense
                label="Month"
                outlined
              >
              </v-select>
              <v-select
                :class="'select-item'"
                v-model="year"
                :items="listYear"
                dense
                label="Year"
                outlined
                class="ml-2"
              >
              </v-select>
            </div>
            <v-btn elevation="0" height="36" color="primary" @click="download">
              Download file excel
            </v-btn>
          </div>
          <div class="table-data">
            <table id="qcTable">
              <thead>
                <tr>
                  <th>Class code</th>
                  <th>Student code</th>
                  <th>Student name</th>
                  <th>Outstanding fee</th>
                  <th>End date</th>
                  <th>Count of student</th>
                  <th>Rate</th>
                  <th>Total amount</th>
                </tr>
              </thead>
              <tbody v-for="(value, index) in listClass" :key="index">
                <template>
                  <tr class="total-class">
                    <td v-on:click="change(value.classCode)">
                      <span>{{ value.classCode }}</span>
                      <v-icon :class="'open'"
                        >{{ isExpand(value.classCode) ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                      </v-icon>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{{ value.total.countStudent }}</td>
                    <td>{{ numberWithCommas(value.total.rate) }}</td>
                    <td>{{ numberWithCommas(value.total.amount) }}</td>
                  </tr>
                  <tr
                    v-for="(item, index) in value.data"
                    :key="index"
                    v-show="isExpand(value.classCode)"
                  >
                    <td></td>
                    <td>{{ item.studentCode }}</td>
                    <td>{{ item.studentName }}</td>
                    <td>{{ item.outstanding }}</td>
                    <td>{{ _dayjs(item.endDate).format('DD/MM/YYYY') }}</td>
                    <td>{{ item.nbrStu }}</td>
                    <td>{{ numberWithCommas(item.rate) }}</td>
                    <td>{{ numberWithCommas(item.amount) }}</td>
                  </tr>
                </template>
              </tbody>
              <tfoot>
                <tr>
                  <td>Grand total</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{{ numberWithCommas(totalInQc.countStudent) }}</td>
                  <td>{{ numberWithCommas(totalInQc.rate) }}</td>
                  <td>{{ numberWithCommas(totalInQc.amount) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { financial } from '@/api/financial.js'
var XLSX = require('xlsx')

export default {
  components: {},
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      open: [],
      headers: [
        {
          text: 'Class code',
          value: 'classCode',
          sortable: false,
          width: '15%',
        },
        { text: 'Student Code', value: 'studentCode', sortable: false, width: '12%' },
        {
          text: 'Student name',
          value: 'studentName',
          sortable: false,
          width: '12%',
        },
        {
          text: 'Outstanding fee',
          value: 'outstanding',
          sortable: false,
          width: '12%',
        },
        {
          text: 'End Date',
          value: 'endDate',
          sortable: false,
          width: '12%',
        },
        {
          text: 'Count of student',
          value: 'countStudent',
          sortable: false,
          width: '12%',
        },
        { text: 'Rate', value: 'rate', sortable: false, width: '25%' },
        { text: 'Total amount', value: 'amount', sortable: false, width: '25%' },
      ],
      listClass: [],
      isDownload: false,
      listYear: [2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010],
      listMonth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      qcID:
        this.$route.params.isMy === '1'
          ? JSON.parse(localStorage.getItem('qcDetailViewMe')).qcId
          : localStorage.getItem('qcDetailView') === null
          ? ''
          : JSON.parse(localStorage.getItem('qcDetailView')).qcId,
      month: '',
      year: '',
      qcName: '',
      totalInQc: { countStudent: 0, rate: 0, amount: 0 },
    }
  },
  created() {
    if (this.$route.params.isMy !== '1') {
      localStorage.getItem('searchFromDate') !== null &&
        ((this.month = new Date(localStorage.getItem('searchFromDate')).getMonth() + 1),
        (this.year = new Date(localStorage.getItem('searchFromDate')).getFullYear()))
    } else {
      this.month = new Date().getMonth() + 1
      this.year = new Date().getFullYear()
    }

    this.init()
  },
  methods: {
    async init() {
      const dataQcToView =
        this.$route.params.isMy === '1'
          ? JSON.parse(localStorage.getItem('qcDetailViewMe'))
          : JSON.parse(localStorage.getItem('qcDetailView'))
      const listYear = []
      for (let index = 2000; index <= new Date().getFullYear(); index++) {
        listYear.push(index)
      }
      this.listYear = listYear
      if (dataQcToView === null) {
        this.back()
      } else {
        await financial
          .getQcSalaryDetail({
            qcId: this.qcID,
            month: this.month,
            year: this.year,
          })
          .then(res => {
            let dataFormatClass = []
            if (res) {
              if (res.summary.length > 0) {
                this.qcName = res.summary[0].fullname
                this.totalInQc = {
                  countStudent: res.summary[0].nbrStu,
                  rate: res.summary[0].rate,
                  amount: res.summary[0].amount,
                }
              } else {
                this.qcName = ''
                this.totalInQc = { countStudent: 0, rate: 0, amount: 0 }
              }
              res.detail.forEach(x => {
                if (
                  dataFormatClass.length === 0 ||
                  !dataFormatClass.some(item => item.classCode === x.classCode)
                ) {
                  dataFormatClass.push({
                    classCode: x.classCode,
                    data: [{ ...x }],
                    total: { rate: x.rate, amount: x.amount, countStudent: x.nbrStu },
                  })
                } else {
                  dataFormatClass = dataFormatClass.map(item => {
                    if (item.classCode === x.classCode) {
                      item.total.amount += x.amount
                      item.total.countStudent += x.nbrStu
                      if (item.total.rate == 0) item.total.rate = x.rate
                      item.data.push(x)
                    }

                    return item
                    // return item.classCode === x.classCode ? {
                    //     ...item, data: [...item.data, { ...x }]
                    //   } : item
                  })
                }
              })
              this.listClass = dataFormatClass
            } else {
              this.errorDialog = true
            }
          })
          .catch(() => {
            this.errorDialog = true
          })
      }
    },
    change: function (name) {
      if (this.open.includes(name)) {
        this.open = this.open.filter(item => {
          return item !== name
        })
      } else {
        this.open = [...this.open, name]
      }
    },

    onResize() {
      this.maxHeight = window.innerHeight - 260
    },
    back() {
      this.$router.push({ name: 'financial-qc-salary' })
    },
    updateFromDate(event) {
      this.fromDate = event
    },
    updateToDate(event) {
      this.toDate = event
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    isExpand(code) {
      if (this.open.includes(code)) {
        return true
      }
      if (this.isDownload) {
        return true
      }
      return false
    },
    openAll() {
      this.isDownload = true
    },
    async download() {
      await this.openAll()
      var table_elt = document.getElementById('qcTable')
      var workbook = XLSX.utils.table_to_book(table_elt)
      XLSX.writeFile(workbook, this.qcName + '_Salary' + '.xlsm')
      this.isDownload = false
    },
    _dayjs: dayjs,
  },
  updated() {},
  watch: {
    month: function (n) {
      this.month = n
      this.init()
    },
    year: function (n) {
      this.year = n

      this.init()
    },
    $route: function () {
      const dataQcToView =
        this.$route.params.isMy === '1'
          ? JSON.parse(localStorage.getItem('qcDetailViewMe'))
          : JSON.parse(localStorage.getItem('qcDetailView'))
      this.month = dataQcToView.month
      this.year = dataQcToView.year
      this.qcID = dataQcToView.qcId
    },
  },
}
</script>
<style lang="scss" scoped>
#center-management {
  padding: 0 15px;
}

.back {
  margin-bottom: 10px;
}

.select {
  max-width: 400px;
}

.select-item {
  margin-right: 10px;
}

.table-data {
  max-height: 80vh;
  overflow: scroll;
}

i {
  position: relative;
}

.select-search {
  margin-top: 18px;
}

.total-class {
  background: #f8fafb;
}

.total-class > td {
  border: none;
}

.total-class > td span {
  margin-left: 16px !important;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  border: 1px solid #dae3e8;
}

thead tr th {
  background: #393a5c;
  color: #fff;
  min-width: 100px;
  position: relative;
  z-index: 1000;
}

thead tr th::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: -10px;
  left: 0;
  z-index: -1;
  background: #393a5c;
}

tfoot td span {
  display: inline-block;
  margin-left: 16px;
}

.shadow-bar {
  box-shadow: 0px 2px 3.45px rgba(17, 41, 63, 0.12);
}

th,
td {
  padding: 7px 7px;
}

td {
  z-index: -1;
}

tbody tr:nth-child(odd) {
  background: #e1ebff;
}

.open {
  position: static !important;
}

tfoot tr:nth-of-type(1) td {
  background: #737373;
  color: #fff;
}

thead {
  position: sticky;
  top: 0;
}

tfoot tr {
  position: sticky;
  bottom: 0;
}
</style>
