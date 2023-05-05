<template>
  <div>
    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="primary"
      class="my-10"
    ></v-progress-linear>
    <v-data-table
      v-if="!isLoading"
      :headers="headers"
      :items="dataFromDateList"
      :items-per-page="-1"
      hide-default-header
      hide-default-footer
      class="elevation-0 mb-5 dailyTable"
      fixed-header
      height="70vh"
      id="dailyTable"
    >
      <template v-slot:body="{ items, headers }">
        <thead class="v-data-table-header">
          <tr>
            <th
              v-for="header in headers"
              :key="header.text"
              class="headTitle"
              role="columnheader"
              scope="col"
            >
              <span style="color: white">{{ header.text }}</span>
            </th>
          </tr>
        </thead>
        <tbody v-if="items.length == 0" style="text-align: center">
          <tr style="background: white">
            <td :colspan="headers.length">No data available</td>
          </tr>
        </tbody>
        <tbody v-else v-for="(data, index) in items" :key="index">
          <tr class="date-filter">
            <td v-on:click="data.isOpen = !data.isOpen" style="white-space: nowrap">
              <span>{{ data.formatDate }}</span>
              <v-icon large>{{ data.isOpen ? 'mdi-chevron-down' : 'mdi-chevron-right' }} </v-icon>
            </td>
            <td colspan="6"></td>
            <td style="text-align: right">{{ numberWithCommas(data.totalPrePaid) }}</td>
            <td style="text-align: right">{{ numberWithCommas(data.totalAmount) }}</td>
            <td style="text-align: right">{{ numberWithCommas(data.totalOther) }}</td>
            <td style="text-align: right">{{ numberWithCommas(data.totalPaidAmt) }}</td>
          </tr>
          <tr v-for="(item, index) in data.data" :key="index" v-show="data.isOpen">
            <td></td>
            <td>{{ item.counselorname }}</td>
            <td>{{ item.paymentType }}</td>
            <td>{{ item.studentCode }}</td>
            <td>{{ item.studentName }}</td>
            <td>{{ item.studentType }}</td>
            <td>{{ item.product }}</td>
            <td style="text-align: right">{{ numberWithCommas(item.prePaid) }}</td>
            <td style="text-align: right">{{ numberWithCommas(item.paidAmt) }}</td>
            <td style="text-align: right">{{ numberWithCommas(item.otherAmt) }}</td>
            <td style="text-align: right">{{ numberWithCommas(item.totalPaidAmt) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="7" style="font-weight: bold">Grand Total</td>
            <td style="text-align: right">{{ numberWithCommas(filtered.totalPrePaid) }}</td>
            <td style="text-align: right">{{ numberWithCommas(filtered.totalAmount) }}</td>
            <td style="text-align: right">{{ numberWithCommas(filtered.totalOther) }}</td>
            <td style="text-align: right">{{ numberWithCommas(filtered.totalPaidAmt) }}</td>
          </tr>
        </tfoot>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { report_management } from '@/api/report-management'
export default {
  components: {},
  props: ['centerId', 'fromDate', 'toDate'],
  data() {
    return {
      isLoading: false,
      headers: [
        { text: 'Payment date', align: 'center', value: 'paymentDate', sortable: false },
        { text: 'Counselor name', value: 'counselorname', align: 'center', sortable: false },
        { text: 'Payment type', value: 'paymentType', align: 'center', sortable: false },
        { text: 'Student code', value: 'studentCode', align: 'center', sortable: false },
        { text: 'Student name', value: 'studentName', align: 'center', sortable: false },
        { text: 'Student type', value: 'studentType', align: 'center', sortable: false },
        { text: 'Product', value: 'product', align: 'center', sortable: false },
        { text: 'Pre paid', value: 'prePaid', align: 'center', sortable: false },
        { text: 'Total amount', value: 'amount', align: 'center', sortable: false },
        { text: 'Others', value: 'otherAmt', align: 'center', sortable: false },
        { text: 'Total paid amt', value: 'totalPaidAmt', align: 'center', sortable: false },
      ],
      filters: {},
      cashList: [],
      dataFromDateList: [],
      tempDataFromDateList: [],
      dateList: [],
      date: [],
      selectAll: false,
      centerName: '',
    }
  },
  computed: {
    filtered() {
      let grandTotal = {
        totalPrePaid: 0,
        totalAmount: 0,
        totalOther: 0,
        totalPaidAmt: 0,
      }
      this.dataFromDateList.forEach(d => {
        grandTotal.totalPrePaid += d.totalPrePaid
        grandTotal.totalAmount += d.totalAmount
        grandTotal.totalOther += d.totalOther
        grandTotal.totalPaidAmt += d.totalPaidAmt
      })
      grandTotal.totalPrePaid = Number(grandTotal.totalPrePaid.toFixed(0))
      grandTotal.totalAmount = Number(grandTotal.totalAmount.toFixed(0))
      grandTotal.totalOther = Number(grandTotal.totalOther.toFixed(0))
      grandTotal.totalPaidAmt = Number(grandTotal.totalPaidAmt.toFixed(0))
      return grandTotal
    },
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      if (this.centerId != '' && this.fromDate != '' && this.toDate != '') {
        this.isLoading = true
        await report_management
          .getDailyCash(this.centerId, this.fromDate, this.toDate)
          .then(res => {
            if (res.length > 0) {
              res.sort((a, b) => new Date(a.paymentDate) - new Date(b.paymentDate))
              this.cashList = res
              const set = new Set(res.map(obj => obj.paymentDate))
              const res1 = []
              let tempDateList = ['All']
              for (const date of set.keys()) {
                const datas = res.filter(obj => obj.paymentDate === date).map(obj => obj)
                let a = 0,
                  b = 0,
                  c = 0,
                  e = 0
                datas.forEach(d => {
                  d.prePaid = Number(d.prePaid.toFixed(0))
                  d.paidAmt = Number(d.paidAmt.toFixed(0))
                  d.otherAmt = Number(d.otherAmt.toFixed(0))
                  d.totalPaidAmt = Number(d.totalPaidAmt.toFixed(0))
                  a += d.prePaid
                  b += d.paidAmt
                  c += d.otherAmt
                  e += d.totalPaidAmt
                })
                res1.push({
                  date: date,
                  formatDate: this._dayjs(date).format('DD/MM/YYYY'),
                  data: datas,
                  totalPrePaid: Number(a.toFixed(0)),
                  totalAmount: Number(b.toFixed(0)),
                  totalOther: Number(c.toFixed(0)),
                  totalPaidAmt: Number(e.toFixed(0)),
                  isOpen: false,
                })
                tempDateList.push(this._dayjs(date).format('DD/MM/YYYY'))
              }
              this.dataFromDateList = res1
              this.tempDataFromDateList = res1
              this.dateList = tempDateList
            } else {
              this.cashList = []
              this.dataFromDateList = []
              this.tempDataFromDateList = []
              this.dateList = []
            }
          })
          .catch(e => {
            console.log(e)
          })
        this.isLoading = false
      }
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    _dayjs: dayjs,
  },
  watch: {
    centerId: function () {
      this.init()
      console.log('sdsjkdhskj')
    },
    fromDate: function () {
      this.init()
    },
    toDate: function () {
      this.init()
    },
  },
}
</script>

<style lang="scss" scoped>
.headTitle {
  background-color: #0b2585 !important;
  text-align: center !important;
  font-weight: 700 !important;
  font-family: 'Helvetica' !important;
  font-size: 14px !important;
}

.dailyTable th,
td {
  border: 1px solid #dae3e8;
}
.dailyTable tbody tr:nth-child(odd) {
  background-color: #f3faff;
}
.dailyTable tbody tr:nth-child(odd):hover td {
  background-color: #dbecf8;
}
.dailyTable .date-filter {
  background-color: #eaeaea !important;
}
.dailyTable .date-filter:hover td {
  background-color: #eaeaea !important;
}

.date-filter td {
  border: 1px solid #eaeaea !important;
}

.dailyTable tfoot tr {
  position: sticky;
  bottom: 0;
  background: #9e9e9e;
}
</style>
