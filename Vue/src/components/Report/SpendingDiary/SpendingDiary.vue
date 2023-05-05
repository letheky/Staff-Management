<template>
  <div id="center-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <div style="border-bottom: 1px solid #ececf6; padding-bottom: 18px">
            <h2>Daily Spending Diary</h2>
          </div>
          <div class="d-flex justify-space-between mt-5">
            <div class="d-flex">
              <v-autocomplete
                label="Center"
                v-model="locationID"
                :items="centers"
                item-text="location"
                item-value="locationID"
                outlined
                dense
                hide-details
              ></v-autocomplete>
              <v-text-field
                label="From"
                type="date"
                v-model="fromDate"
                outlined
                dense
                class="ml-7 mr-2"
                style="width: 200px"
              ></v-text-field>
              <v-text-field
                label="To"
                type="date"
                v-model="toDate"
                outlined
                dense
                style="width: 200px"
                class="mr-2"
              ></v-text-field>
            </div>
            <v-btn
              v-if="tab == 0 && isFilled()"
              elevation="0"
              height="36"
              color="primary"
              @click="$refs.totalSpending.download()"
            >
              Download file excel
            </v-btn>
            <v-btn
              v-else-if="tab == 1 && isFilled()"
              elevation="0"
              height="36"
              color="primary"
              @click="$refs.income.download()"
            >
              Download file excel
            </v-btn>
            <v-btn
              v-else-if="tab == 2 && isFilled()"
              elevation="0"
              height="36"
              color="primary"
              @click="$refs.expenses.download()"
            >
              Download file excel
            </v-btn>
            <v-btn v-else elevation="0" height="36" color="primary"> Download file excel </v-btn>
          </div>
          <v-tabs v-model="tab" class="tab-container mb-5">
            <v-tab>Total Spending Diary</v-tab>
            <v-tab>Income</v-tab>
            <v-tab>Expenses</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <TotalSpending
                @inputData="updateMessage"
                ref="totalSpending"
                :centerId="this.getId"
                :fromDate="fromDate"
                :toDate="toDate"
              ></TotalSpending>
            </v-tab-item>
            <v-tab-item>
              <IncomeDiary
                ref="income"
                :centerId="this.getId"
                :fromDate="fromDate"
                :toDate="toDate"
              ></IncomeDiary>
            </v-tab-item>
            <v-tab-item>
              <ExpensesDiary
                ref="expenses"
                :centerId="this.getId"
                :fromDate="fromDate"
                :toDate="toDate"
              ></ExpensesDiary>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import TotalSpending from './TotalSpending.vue'
import IncomeDiary from './IncomeDiary.vue'
import ExpensesDiary from './ExpensesDiary.vue'
var XLSX = require('xlsx')

export default {
  components: { TotalSpending, IncomeDiary, ExpensesDiary },
  data() {
    return {
      isLoading: false,
      centers: [],
      tab: 0,
      locationID: '',
      tempCenter: '',
      fromDate: '',
      toDate: '',
      isClick: false,
      totalList: [],
    }
  },
  created() {
    this.fromDate = dayjs().format('YYYY-MM-DD')
    this.toDate = dayjs().format('YYYY-MM-DD')
    this.centers = JSON.parse(localStorage.getItem('currentUser')).locationPermissions
    this.locationID = parseInt(localStorage.getItem('currentCenter'))
  },
  computed: {
    getId() {
      return this.locationID
    },
  },
  methods: {
    async init() {},
    isFilled() {
      if (this.locationID && this.fromDate && this.toDate) {
        return true
      }
      return false
    },
    downloadExcel() {
      if (this.studentList.length > 0) {
        var table_elt = document.getElementById('attendTable')
        var workbook = XLSX.utils.table_to_book(table_elt)
        XLSX.writeFile(workbook, 'Attendance at ' + this.className + '.xlsm')
      }
    },
    _dayjs: dayjs,
  },
  watch: {},
}
</script>
<style lang="scss" scoped>
.v-tab {
  text-transform: none;
}

.tab-container {
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.v-footer {
  box-shadow: 0px -2px 16px rgba(141, 141, 147, 0.1) !important;
}
</style>
