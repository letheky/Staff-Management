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
      :items="filtered.filterList"
      :items-per-page="-1"
      hide-default-header
      hide-default-footer
      id="attendTable"
      class="elevation-0 mb-5 spendingTable"
      fixed-header
      height="60vh"
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
        <tr class="fixed-row-filter">
          <th v-for="header in headers" :key="header.text" class="abc">
            <div v-if="header.value == 'paymentDate'">
              <Autocomplete
                v-if="filters.hasOwnProperty(header.value)"
                @setFilter="setFilter"
                :styleBorder="'border-bottom'"
                :keyFilter="'paymentDate'"
                :selectedInit="[]"
                :listItem="dateList"
              />
            </div>
          </th>
        </tr>
        <tbody v-if="items.length == 0" style="text-align: center">
          <tr style="background: white">
            <td :colspan="headers.length">No data available</td>
          </tr>
        </tbody>
        <tbody v-else v-for="(data, index) in filtered.filterList" :key="index">
          <tr class="date-filter">
            <td colspan="3" v-on:click="data.isOpen = !data.isOpen">
              <span>{{ data.formatDate }}</span>
              <v-icon large>{{ data.isOpen ? 'mdi-chevron-down' : 'mdi-chevron-right' }} </v-icon>
            </td>
            <td style="text-align: right">
              {{ numberWithCommas(data.totalReciept) }}
            </td>
            <td style="text-align: right">
              {{ numberWithCommas(data.totalDisbursement) }}
            </td>
            <td colspan="3"></td>
          </tr>
          <tr v-for="(item, index) in data.data" :key="index" v-show="data.isOpen">
            <td></td>
            <td style="width: 231px">{{ item.description }}</td>
            <td style="text-align: right">{{ item.cashAccount }}</td>
            <td style="text-align: right">
              {{ numberWithCommas(item.receiptAmt) }}
            </td>
            <td style="text-align: right">
              {{ numberWithCommas(item.disbursementAMt) }}
            </td>
            <td>{{ item.entryType }}</td>
            <td>{{ item.remarks }}</td>
            <td>{{ item.reason }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="font-weight: bold">Grand Total</td>
            <td></td>
            <td style="text-align: right">
              {{ filtered.grandTotal.totalReciept }}
            </td>
            <td style="text-align: right">
              {{ filtered.grandTotal.totalDisbursement }}
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { report_management } from '@/api/report-management'

import Autocomplete from '@/components/Utils/Autocomplete.vue'
export default {
  components: { Autocomplete },
  props: ['centerId', 'fromDate', 'toDate'],
  data() {
    return {
      tempMessage: document.getElementById('attendTable'),
      isLoading: false,
      headers: [
        {
          text: 'Date',
          align: 'center',
          value: 'paymentDate',
          sortable: false,
        },
        {
          text: 'Description',
          value: 'description',
          align: 'center',
          sortable: false,
        },
        {
          text: 'Cash Account',
          value: 'cashAccount',
          align: 'center',
          sortable: false,
        },
        {
          text: 'Receipt Amount',
          value: 'receiptAmount',
          align: 'center',
          sortable: false,
        },
        {
          text: 'Disbursement Amount',
          value: 'disbursementAmount',
          align: 'center',
          sortable: false,
        },
        {
          text: 'Transaction Type',
          value: 'entryType',
          align: 'center',
          sortable: false,
        },
        { text: 'Notes', value: 'notes', align: 'center', sortable: false },
        { text: 'Reason', value: 'reason', align: 'center', sortable: false },
      ],
      filters: {
        paymentDate: [],
        description: [],
        cashAccount: [],
        receiptAmount: [],
        disbursementAmount: [],
        entryType: [],
        notes: [],
        reason: [],
      },
      journalList: [],
      dataFromDateList: [],
      tempDataFromDateList: [],
      dateList: [],
      date: [],
      selectAll: false,
    }
  },
  computed: {
    filtered() {
      let filterList = this.dataFromDateList.filter(d => {
        console.log()
        return (
          this.filters.paymentDate < 1 ||
          this.filters.paymentDate.includes(dayjs(d.date).format('DD/MM/YYYY'))
        )
      })
      let grandTotal = {
        totalReciept: 0,
        totalDisbursement: 0,
      }
      this.dataFromDateList.forEach(d => {
        grandTotal.totalReciept += d.totalReciept
        grandTotal.totalDisbursement += d.totalDisbursement
      })
      grandTotal.totalReciept = this.numberWithCommas(grandTotal.totalReciept)
      grandTotal.totalDisbursement = this.numberWithCommas(grandTotal.totalDisbursement)
      return { filterList, grandTotal }
    },
  },
  created() {
    this.init()
  },
  methods: {
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
    },

    async init() {
      if (this.centerId != '' && this.fromDate != '' && this.toDate != '') {
        this.isLoading = true
        await report_management
          .getCashJournalReport(this.centerId, this.fromDate, this.toDate)
          .then(res => {
            if (res) {
              res.sort((a, b) => new Date(a.paymentDate) - new Date(b.paymentDate))
              this.journalList = res
              let tempTotal = []
              res.forEach(d => {
                tempTotal.push({
                  ...d,
                  paymentDate: this._dayjs(d.paymentDate).format('DD/MM/YYYY'),
                })
              })
              this.$emit('inputData', this.tempMessage)
              this.$emit('getTotalList', tempTotal)
              const set = new Set(res.map(obj => obj.paymentDate))
              const res1 = []
              let tempDateList = []
              for (const date of set.keys()) {
                const datas = res.filter(obj => obj.paymentDate === date).map(obj => obj)
                let a = 0,
                  b = 0
                datas.forEach(d => {
                  a += d.receiptAmt
                  b += d.disbursementAMt
                })
                res1.push({
                  date: date,
                  formatDate: this._dayjs(date).format('DD/MM/YYYY'),
                  data: datas,
                  totalReciept: a,
                  totalDisbursement: b,
                  isOpen: false,
                })
                tempDateList.push(this._dayjs(date).format('DD/MM/YYYY'))
              }
              this.dataFromDateList = res1
              this.tempDataFromDateList = res1
              this.dateList = tempDateList
            }
          })
          .catch(e => {
            console.log(e)
          })
        this.isLoading = false
      }
    },

    filterByDate: function (data) {
      if (data.includes('All') || data.length === 0) {
        this.dataFromDateList = this.tempDataFromDateList
      } else {
        this.dataFromDateList = this.tempDataFromDateList.filter(item => {
          return data.includes(item.formatDate)
        })
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
    date: function (data) {
      this.filterByDate(data)
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

.spendingTable th,
td {
  border: 1px solid #dae3e8;
}

.spendingTable .date-filter {
  background-color: #eaeaea !important;
}

.date-filter td {
  border: 1px solid #eaeaea !important;
}

.spendingTable tfoot tr {
  position: sticky;
  bottom: 0;
  background: #9e9e9e;
}

.spendingTable tbody tr:nth-child(odd) {
  background-color: #bde6fbb0;
}
</style>
