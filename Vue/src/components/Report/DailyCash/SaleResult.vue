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
      <template v-slot:body="{}">
        <thead class="v-data-table-header">
          <tr>
            <th>Student type</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>New student</td>
            <td></td>
          </tr>
          <tr>
            <td>Re-enrollment</td>
            <td></td>
          </tr>
          <tr>
            <td>Actual amount</td>
            <td></td>
          </tr>
          <tr>
            <td>Target</td>
            <td></td>
          </tr>
          <tr>
            <td>Average</td>
            <td></td>
          </tr>
        </tbody>
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
                  a += d.prePaid
                  b += 0
                  c += d.otherAmt
                  e += d.totalPaidAmt
                })
                res1.push({
                  date: date,
                  formatDate: this._dayjs(date).format('DD/MM/YYYY'),
                  data: datas,
                  totalPrePaid: a,
                  totalAmount: b,
                  totalOther: c,
                  totalPaidAmt: e,
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
.dailyTable .date-filter:hover td {
  background-color: #eaeaea !important;
}
.dailyTable tbody tr:nth-child(odd) {
  background-color: #f3faff;
}
.dailyTable tbody tr:nth-child(odd):hover td {
  background-color: #dbecf8;
}
</style>