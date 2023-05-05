<template>
  <div class="sale-report">
    <h2>Sale Report</h2>
    <div class="d-flex">
      <v-select
        v-model="locationID"
        item-text="location"
        append-icon="keyboard_arrow_down"
        item-value="locationID"
        :items="listLocation"
        label="Center"
        outlined
        :class="'select-input'"
        dense
      ></v-select>

      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on">
            <v-text-field
              v-if="errorDate"
              :class="'select-input'"
              error
              v-model="dateToText"
              @input="searchDate"
              dense
              outlined
              label="Month/Year"
              append-icon="mdi-calendar-month"
            ></v-text-field>
            <v-text-field
              v-else
              :class="'select-input'"
              v-model="dateToText"
              dense
              outlined
              label="Month/Year"
              @input="searchDate"
              append-icon="mdi-calendar-month"
            ></v-text-field>
          </div>
        </template>

        <v-date-picker
          :class="'pt-0'"
          @change="dateChange"
          v-model="date"
          type="month"
        ></v-date-picker>
      </v-menu>
    </div>
    <v-tabs v-model="tab" class="tab-sadown mb-5">
      <v-tab><span class="text-normal"> Sale report by EC </span> </v-tab>
      <v-tab><span class="text-normal"> Sale report by QC </span> </v-tab>
      <v-tab><span class="text-normal"> Sale report detail</span> </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item
        ><TableByECQC :locationID="locationID" :date="date" :errorDate="errorDate" />
      </v-tab-item>
      <v-tab-item
        ><SaleReportByQc :locationID="locationID" :date="date" :errorDate="errorDate" />
      </v-tab-item>
      <v-tab-item
        ><SaleReportDetail :locationID="locationID" :date="date" :errorDate="errorDate" />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import TableByECQC from './TableByECQC.vue'
import SaleReportDetail from './SaleReportDetail.vue'
import SaleReportByQc from './SaleReportByQc.vue'
// import 'vue2-datepicker/index.css'

export default {
  components: { TableByECQC, SaleReportDetail, SaleReportByQc },
  data() {
    return {
      tab: 0,
      errorDate: false,
      listLocation: [],
      locationID: parseInt(localStorage.getItem('currentCenter')),
      dateToText: new Date().getMonth() + 1 + '/' + new Date().getFullYear(),
      date: new Date().toISOString().substr(0, 10),
    }
  },
  setup() {
    return {}
  },
  created() {
    if (localStorage.getItem('saleDate')) {
      this.date = localStorage.getItem('saleDate')
      this.dateChange(localStorage.getItem('saleDate'))
    }
    if (localStorage.getItem('saleLocation')) {
      this.locationID = parseInt(localStorage.getItem('saleLocation'))
    }
    this.init()
  },
  methods: {
    async init() {
      const listLocation = JSON.parse(localStorage.getItem('currentUser')).locationPermissions
      this.listLocation = listLocation
    },
    dateChange(date) {
      const dateToArr = date.split('-')
      this.dateToText = dateToArr[1] + '/' + dateToArr[0]
    },
    searchDate(date) {
      const dateToArr = date.split('/')
      if (dateToArr.length === 2) {
        if (
          !isNaN(new Date(dateToArr[1], dateToArr[0])) &&
          dateToArr[0] <= 12 &&
          dateToArr[1] &&
          dateToArr[0] !== ''
        ) {
          this.date = dateToArr[1] + '-' + dateToArr[0]
          this.errorDate = false
        }
      } else {
        this.date = new Date().toISOString().substr(0, 10)
        this.errorDate = true
      }
    },
  },
  watch: {
    locationID: function (id) {
      localStorage.setItem('saleLocation', id)
    },
    date: function (date) {
      localStorage.setItem('saleDate', date)
    },
  },
}
</script>

<style lang="scss" scoped>
.sale-report {
  padding: 0 36px;
}
.select-input {
  max-width: 170px;
  margin-right: 20px;
}
.text-normal {
  text-transform: initial;
}
h2 {
  margin: 16px 0;
}
.tab-sadown {
  position: relative;
  box-shadow: 0px 9px 2px -9px #000;
}
</style>
