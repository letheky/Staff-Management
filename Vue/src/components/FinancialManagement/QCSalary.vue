<template>
  <div id="center-management">
    <v-row no-gutters class="pb-3">
      <v-col md="12">
        <div class="pa-10 pt-5">
          <div class="d-flex justify-space-between">
            <h2>QC salary</h2>
          </div>
          <v-row class="mt-5 mb-5 pt-2" style="background-color: rgba(196, 196, 196, 0.25)">
            <v-col md="2">
              <!-- <date-picker
                :model="fromDate"
                @update:model="updateFromDate"
                title="From date"
                style="background: white"
              ></date-picker> -->
              <v-text-field
                type="date"
                label="From date"
                style="background: white"
                v-model="fromDate"
                outlined
                dense
                @input="search"
                hide-details
              >
              </v-text-field>
            </v-col>
            <v-col md="2">
              <!-- <date-picker
                :model="toDate"
                @update:model="updateToDate"
                title="To date"
                style="background: white"
              ></date-picker> -->
              <v-text-field
                type="date"
                label="To date"
                style="background: white"
                v-model="toDate"
                outlined
                @input="search"
                dense
                hide-details
              >
              </v-text-field>
            </v-col>
            <v-col md="2"> </v-col>
          </v-row>

          <v-data-table
            :headers="headers"
            :items="qcSalary"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            hide-default-footer
            @page-count="pageCount = $event"
            v-model="selected"
            item-key="stt"
            :id="tables"
            class="elevation-0"
            fixed-header
            height="100%"
            hide-default-header
          >
            <template v-slot:header="{ props }">
              <thead class="v-data-table-header">
                <tr>
                  <th
                    v-for="header in props.headers"
                    :key="header.text"
                    role="columnheader"
                    scope="col"
                    aria-label="No"
                    class="text-start font-weight-bold"
                    :style="'width:' + header.width + '; min-width:' + header.width + ';'"
                  >
                    <span
                      v-if="header.value == 'rate' || header.value == 'amount'"
                      style="float: right"
                      >{{ header.text }}</span
                    >
                    <span v-else>{{ header.text }}</span>
                  </th>
                </tr>
              </thead>
              <tr class="fixed-row-filter">
                <th v-for="header in props.headers" :key="header.text">
                  <div v-if="filters.hasOwnProperty(header.value)">
                    <Autocomplete
                      v-if="filters.hasOwnProperty(header.value)"
                      @setFilter="setFilter"
                      :styleBorder="'border-bottom'"
                      :keyFilter="header.value"
                      :selectedInit="filters[header.value]"
                      :listItem="groupColumnValueList(header.value)"
                    />
                  </div>
                </th>
              </tr>
            </template>

            <template v-slot:[`item.no`]="{ index }">
              {{ index + 1 }}
            </template>

            <template v-slot:[`item.rate`]="{ item }">
              {{ numberWithCommas(item.rate) }}
            </template>

            <template v-slot:[`item.amount`]="{ item }">
              {{ numberWithCommas(item.amount) }}
            </template>

            <template v-slot:[`item.action`]="{ item }">
              <div class="text-center">
                <v-icon
                  size="18"
                  color="primary"
                  @click="viewDetail(item.teacherID, item.locationID)"
                >
                  mdi-eye
                </v-icon>
              </div>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
    <v-footer
      color="#fff"
      class="px-10 pb-2"
      padless
      :style="
        $store.state.isActiveSidebar ? 'width: calc(100% - 100px)' : 'width: calc(100% - 258px)'
      "
      style="display: flex; justify-content: space-between"
    >
      <div>
        <v-select
          outlined
          hide-details
          dense
          :value="itemsPerPage"
          :items="[20, 50, 100, 200, 500, 1000]"
          @change="itemsPerPage = parseInt($event, 10)"
          style="height: 32px"
        ></v-select>
      </div>
      <div>
        <h3 v-if="qcSalary.length != 1">Total: {{ qcSalary.length }} records</h3>
        <h3 v-else>Total: {{ qcSalary.length }} record</h3>
      </div>
      <div>
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="7"
          elevation="0"
        ></v-pagination>
      </div>
    </v-footer>
    <v-row justify="center">
      <v-dialog v-model="errorDialog" persistent width="350">
        <v-card class="mx-auto pa-10">
          <div class="text-center">
            <h1>Error!</h1>
            <p>{{ message.messages.UNKNOWN_ERROR }}</p>
          </div>
          <div class="text-center">
            <v-btn color="error" elevation="0" @click="back()" outlined> Back </v-btn>
          </div>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { account_managerment } from '@/api/account-management.js'
import { financial } from '@/api/financial.js'
import Autocomplete from '@/components/Utils/Autocomplete.vue'
const querystring = require('querystring')
import message from '@/components/Utils/message'
export default {
  components: { Autocomplete },
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      selected: [],
      headers: [
        {
          text: 'No',
          value: 'no',
          sortable: false,
        },
        {
          text: 'QC Code',
          value: 'teacherCode',
          sortable: false,
          width: '100px',
        },
        {
          text: 'QC Name',
          value: 'fullname',
          sortable: false,
        },
        {
          text: 'Location',
          value: 'location',
          sortable: false,
        },
        {
          text: 'Num of Students',
          value: 'nbrStu',
          sortable: false,
        },
        {
          text: 'Num of Students Stopped',
          value: 'nbrStopped',
          sortable: false,
        },
        {
          text: 'Rate',
          value: 'rate',
          sortable: false,
          align: 'right',
        },
        {
          text: 'Amount',
          value: 'amount',
          sortable: false,
          align: 'right',
        },
        { text: 'Action', value: 'action', sortable: false },
      ],
      centerList: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
      currentCenter: JSON.parse(localStorage.getItem('currentCenter')),
      searchKeyQC: '',
      fromDate: '',
      toDate: '',
      tables: 'tables',
      name: 'QC salary',
      isDisable: false,
      isExporting: false,
      teacherIDS: [],
      filters: {
        teacherCode: [],
        fullname: [],
        location: [],
      },
      qcListFiltered: [],
      errorDialog: false,
      message: message,
    }
  },
  computed: {
    qcSalary() {
      return this.qcListFiltered.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
    },
  },
  created() {
    this.init()
  },
  watch: {
    selected: function (value) {
      console.log(value)
    },
  },
  methods: {
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
      localStorage.setItem('filterQcSalary', JSON.stringify(this.filters))
    },
    async init() {
      const filterQcSalary = localStorage.getItem('filterQcSalary')
      filterQcSalary !== null && (this.filters = JSON.parse(filterQcSalary))
      // const currentYear = new Date().getFullYear()
      // const currentMonth = new Date().getMonth() + 1
      // const currentDate = new Date().getDate()
      localStorage.getItem('searchKeyQC') !== null &&
        (this.searchKeyQC = JSON.parse(localStorage.getItem('searchKeyQC')))
      localStorage.getItem('searchFromDate') !== null
        ? (this.fromDate = JSON.parse(localStorage.getItem('searchFromDate')))
        : (this.fromDate =
            new Date().getFullYear() +
            '-' +
            this.checkTime(new Date().getMonth() + 1) +
            '-' +
            this.checkTime(new Date().getDate()))

      localStorage.getItem('searchToDate') !== null
        ? (this.toDate = JSON.parse(localStorage.getItem('searchToDate')))
        : (this.toDate =
            new Date().getFullYear() +
            '-' +
            this.checkTime(new Date().getMonth() + 1) +
            '-' +
            this.checkTime(new Date().getDate()))
      this.searchKeyQC =
        JSON.parse(localStorage.getItem('searchKeyQC')) == null
          ? ''
          : JSON.parse(localStorage.getItem('searchKeyQC'))
      await financial
        .getQCList(this.searchKeyQC, this.fromDate, this.toDate)
        .then(res => {
          this.qcListFiltered = res
        })
        .catch(() => {
          this.errorDialog = true
        })
    },
    search() {
      localStorage.setItem('searchKeyQC', JSON.stringify(this.searchKeyQC))
      localStorage.setItem('searchFromDate', JSON.stringify(this.fromDate))
      localStorage.setItem('searchToDate', JSON.stringify(this.toDate))
      financial.getQCList(this.searchKeyQC, this.fromDate, this.toDate).then(res => {
        this.qcListFiltered = res
        this.filters = {
          teacherCode: [],
          fullname: [],
          location: [],
        }
      })
    },
    groupColumnValueList(val) {
      return this.qcListFiltered.map(d => d[val]).filter(y => y)
    },
    toggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.qcListFiltered
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, []).length
        ) {
          this.filters[value] = []
        } else {
          this.filters[value] = this.qcListFiltered
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, [])
            .slice()
        }
      })
    },
    viewDetail(qcId, locationID) {
      const objectQcToView = {
        qcId: qcId,
        locationID: locationID,
        month: new Date(this.fromDate).getMonth() + 1,
        year: new Date(this.fromDate).getFullYear(),
      }
      localStorage.setItem('qcDetailView', JSON.stringify(objectQcToView))
      this.$router.push({
        name: 'financial-detail-qc-salary',
        params: { isMy: 0 },
      })
    },
    async exportExcel() {
      this.teacherIDS = []

      for (var i = 0; i < this.selected.length; i++) {
        if (this.teacherIDS.indexOf(this.selected[i].teacherID) === -1) {
          this.teacherIDS.push(this.selected[i].teacherID)
        }
      }

      this.isDisable = true
      this.isExporting = true
      let body = {
        fromDate: this.fromDate,
        toDate: this.toDate,
      }
      await account_managerment
        .exportExcelQCSalary(this.teacherIDS, querystring.stringify(body))
        .then(data => {
          var fileURL = window.URL.createObjectURL(data)
          var fileLink = document.createElement('a')
          var today = new Date()
          var fileName = 'QC_salary' + today.getFullYear()
          ;+'-' + this.checkTime(today.getMonth() + 1) + '-' + this.checkTime(today.getDate())
          fileLink.href = fileURL
          fileLink.setAttribute('download', fileName + '.xls')
          document.body.appendChild(fileLink)

          fileLink.click()
          fileLink.remove()
        })
        .finally(() => {
          this.isExporting = false
          this.isDisable = false
        })
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    checkTime(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    back() {
      window.history.back()
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped></style>
