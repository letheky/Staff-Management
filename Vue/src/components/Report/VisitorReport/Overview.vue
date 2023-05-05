<template>
  <div class="mt-5 ml-10 mr-10" id="vis-detail">
    <h2 class="mb-3">Visitor report</h2>
    <v-col>
      <v-row class="mb-0">
        <v-select
          class="ml-1"
          :items="locationPermissions"
          item-text="location"
          item-value="locationID"
          append-icon="keyboard_arrow_down"
          outlined
          @change="locationChange"
          dense
          :class="'input-select'"
          hide-details
          placeholder="Center"
          v-model="locationID"
        >
        </v-select>
        <v-text-field
          type="date"
          v-model="fromDate"
          outlined
          dense
          @input="dateChangeFrom"
          :class="'input-select ml-1'"
          hide-details
          lable="From Date"
        />
        <v-text-field
          type="date"
          v-model="toDate"
          outlined
          @input="dateChangeTo"
          lable="To Date"
          :style="{ width: '150px' }"
          :class="'input-select ml-1'"
          dense
        />
      </v-row>
      <!-- <v-autocomplete
            v-model="select"
            :items="classStatus"
            label="Class status"
            item-text="classStatus"
            item-value="classStatusID"
            outlined
            dense
          ></v-autocomplete> -->
    </v-col>
    <template v-if="isLoading">
      <div class="pa-6">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </div>
    </template>
    <v-row no-gutters>
      <v-col md="12">
        <div>
          <!-- <v-progress-linear v-if="isLoading" indeterminate color="primary" class="my-10"></v-progress-linear> -->
          <v-data-table
            v-if="!isloading"
            :headers="headers"
            :items="filtered"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            hide-default-footer
            hide-default-header
            @page-count="pageCount = $event"
            class="elevation-0 table-visitor"
            fixed-header
            height="70vh"
          >
            <template v-slot:header="{ props }">
              <thead class="v-data-table-header">
                <tr>
                  <th
                    :style="{
                      background: header.color,
                      color: '#000 !important',
                      width: header.width,
                    }"
                    v-for="header in props.headers"
                    :key="header.value"
                  >
                    {{ header.text }}
                  </th>
                </tr>

                <tr class="fixed-row-filter">
                  <th v-for="header in props.headers" class="select-book" :key="header.text">
                    <Autocomplete
                      v-if="filters.hasOwnProperty(header.value)"
                      @setFilter="setFilter"
                      :keyFilter="header.value"
                      :selectedInit="filters[header.value]"
                      :listItem="groupColumnValueList(header.value)"
                    />
                  </th>
                </tr>
              </thead>
            </template>
            <template v-slot:[`item.remarks`]="{ item }">
              <p :style="{ width: '200px' }">{{ item.remarks }}</p>
            </template>
            <template v-slot:[`item.studentName`]="{ item }">
              <p :style="{ width: '200px' }">{{ item.studentName }}</p>
            </template>
            <template v-slot:[`item.lastCallMsg`]="{ item }">
              <p :style="{ width: '300px' }">{{ item.lastCallMsg }}</p>
            </template>
            <template v-slot:[`item.remarks`]="{ item }">
              <p :style="{ width: '300px' }">{{ item.remarks }}</p>
            </template>
            <template v-slot:[`item.totPaidAmt`]="{ item }">
              <p>{{ numberWithCommas(item.totPaidAmt) }}</p>
            </template>
            <template v-slot:[`item.homePhone`]="{ item }">
              <p :style="{ width: '150px' }">{{ item.homePhone }}</p>
            </template>
            <template v-slot:[`item.mobilePhone`]="{ item }">
              <p :style="{ width: '150px' }">{{ item.mobilePhone }}</p>
            </template>
            <template v-slot:[`item.englishSchool`]="{ item }">
              <p :style="{ width: '200px' }">{{ item.englishSchool }}</p>
            </template>
            <template v-slot:[`item.address`]="{ item }">
              <p :style="{ width: '200px' }">{{ item.address }}</p>
            </template>
            <template v-slot:[`item.counselorName`]="{ item }">
              <p :style="{ width: '200px' }">{{ item.counselorName }}</p>
            </template>
            <!-- <template v-slot:body="{ items }">
                  <tbody>
                    <tr v-for="(item, index) in items" :key="index">
                      <td>{{ item.productCode }}</td>
                      <td>{{ item.description }}</td>
                      <td>{{ item.unit }}</td>
                      <td></td>
                      <td>{{ item.totQtyOrd === 0 ? "-" : item.totQtyOrd }}</td>
                      <td>{{ item.actualQty === 0 ? "-" : item.actualQty }}</td>
                      <td>{{ item.qtyRcvd === 0 ? "-" : item.qtyRcvd }}</td>
                      <td>{{ item.qtyReturned=== 0 ? "-" : item.qtyReturned}}</td>
                      <td>{{ item.quantityRemain === 0 ? "-" : item.quantityRemain }}</td>
                    </tr>
                  </tbody>
    
                  <tfoot>
                    <tr>
                      <td>Grand total</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>{{ filtered.total.totQtyOrd }}</td>
                      <td>{{ filtered.total.actualQty }}</td>
                      <td>{{ filtered.total.qtyRcvd}}</td>
                      <td>{{ filtered.total.qtyReturned }}</td>
    
                      <td>{{ filtered.total.quantityRemain }}</td>
                    </tr>
                  </tfoot>
                </template> -->
          </v-data-table>
        </div>
      </v-col>
    </v-row>
    <div v-if="!isLoading" color="#fff" :class="'w-100 fix pl-10 pr-10 footer'">
      <v-row>
        <v-col md="2">
          <v-select
            outlined
            hide-details
            dense
            :value="itemsPerPage"
            :items="[20, 50, 100, 200]"
            @change="itemsPerPage = parseInt($event, 10)"
            style="height: 32px"
          ></v-select>
        </v-col>
        <v-col md="4" class="d-flex align-center justify-end"> Total : {{ filtered.length }}</v-col>
        <v-col md="6" class="d-flex justify-end">
          <v-pagination
            v-model="page"
            :length="pageCount"
            elevation="0"
            :total-visible="7"
          ></v-pagination>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { visitor_report } from '@/api/visitor_report.js'
import Autocomplete from '@/components/Utils/Autocomplete.vue'
// import Multiselect from "vue-multiselect";
import dayjs from 'dayjs'

export default {
  components: {
    Autocomplete,
  },
  data() {
    return {
      page: 1,
      locationID: parseInt(localStorage.getItem('currentCenter')),
      dataCusCare: [],
      locationList: [],
      isLoading: false,
      fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 2)
        .toISOString()
        .split('T')[0],
      toDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
        .toISOString()
        .split('T')[0],
      locationPermissions: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
      pageCount: 0,
      itemsPerPage: 20,
      headers: [
        {
          text: 'Stu. Code',
          value: 'studentCode',
          color: '#A0D589',
          sortable: false,
        },
        {
          text: 'Student name',
          value: 'studentName',
          color: '#A0D589',
          sortable: false,
        },
        {
          text: 'DOB',
          value: 'dob',
          color: '#A0D589',
          sortable: false,
        },

        {
          text: 'Book PT',
          value: 'bookPT',
          color: '#FFCF53',
          sortable: false,
        },
        {
          text: 'Done PT',
          value: 'isPT',
          color: '#FFCF53',
          sortable: false,
        },
        {
          text: 'Registered',
          value: 'registered',
          color: '#FFCF53',
          sortable: false,
        },
        {
          text: 'Counselor',
          value: 'counselorName',
          color: '#FDE9D9',
          sortable: false,
        },
        {
          text: 'School',
          value: 'englishSchool',
          color: '#BFCDFF',
          sortable: false,
        },
        {
          text: 'Source Reference',
          value: 'sourceReference',
          color: '#FFCF53',
          sortable: false,
        },
        {
          text: 'Last call msg ',
          value: 'lastCallMsg',
          color: '#BFCDFF',
          sortable: false,
        },
        {
          text: 'Create date',
          value: 'crtdDate',
          color: '#A0D589',
          sortable: false,
        },
        {
          text: 'Test date report',
          value: 'ec',
          color: '#A0D589',
          sortable: false,
        },
        {
          text: 'Remarks',
          width: '200px',
          value: 'remarks',
          color: '#BFCDFF',
          sortable: false,
        },
        {
          text: 'Interviewer',
          value: 'interViewer',
          color: '#FEBFFF',
          sortable: false,
        },
        {
          text: 'Paid amount',
          value: 'totPaidAmt',
          color: '#FFCF53',
          sortable: false,
        },
        {
          text: 'Payment Date',
          value: 'paymentDate',
          color: '#A0D589',
          sortable: false,
        },
        {
          text: 'Start date',
          value: 'startDate',
          color: '#A0D589',
          sortable: false,
        },
        {
          text: 'Email',
          value: 'email',
          color: '#BFCDFF',
          sortable: false,
        },
        {
          text: 'Home phone',
          value: 'homePhone',
          color: '#A0D589',
          sortable: false,
        },
        {
          text: 'Mobile phone',
          value: 'mobilePhone',
          color: '#BFCDFF',
          sortable: false,
        },
        {
          text: 'Address',
          value: 'address',
          color: '#BFCDFF',
          sortable: false,
        },
      ],
      listVisit: [],
      filters: {
        studentCode: [],

        fullName: [],

        dob: [],

        homePhone: [],

        mobilePhone: [],

        studentName: [],
        englishSchool: [],
        bookPT: [],

        isPT: [],

        registered: [],

        counselorName: [],

        remarks: [],
        totPaidAmt: [],
        sourceReference: [],
        lastCallMsg: [],

        crtdDate: [],

        ec: [],

        email: [],
        address: [],
        interViewer: [],

        paymentDate: [],

        startDate: [],
      },
    }
  },

  computed: {
    filtered() {
      const listReport = this.listVisit.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })

      return listReport
    },
  },
  created() {
    if (localStorage.getItem('VisFrom') !== null) this.fromDate = localStorage.getItem('VisFrom')
    if (localStorage.getItem('VisTo') !== null) this.toDate = localStorage.getItem('VisTo')
    if (localStorage.getItem('VisCenter') !== null)
      this.locationID = JSON.parse(localStorage.getItem('VisCenter'))
    this.getVisitorList()
    if (localStorage.getItem('VisFilter') !== null) {
      this.filters = JSON.parse(localStorage.getItem('VisFilter'))
    }
  },

  methods: {
    // changeFilter() {
    //   localStorage.setItem('VisFilter', JSON.stringify(this.filters))
    // },
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
      localStorage.setItem('VisFilter', JSON.stringify(this.filters))
    },
    dateChangeTo() {
      localStorage.setItem('VisTo', this.toDate)
      this.filters = {
        studentCode: [],

        fullName: [],

        dob: [],

        homePhone: [],

        mobilePhone: [],

        studentName: [],
        englishSchool: [],
        bookPT: [],

        isPT: [],

        registered: [],

        counselorName: [],

        remarks: [],
        totPaidAmt: [],
        sourceReference: [],
        lastCallMsg: [],

        crtdDate: [],

        ec: [],

        email: [],
        address: [],
        interViewer: [],

        paymentDate: [],

        startDate: [],
      }
      this.getVisitorList()
    },
    locationChange() {
      localStorage.setItem('VisCenter', this.locationID)
      this.filters = {
        studentCode: [],

        fullName: [],

        dob: [],

        homePhone: [],

        mobilePhone: [],

        studentName: [],
        englishSchool: [],
        bookPT: [],

        isPT: [],

        registered: [],

        counselorName: [],

        remarks: [],
        totPaidAmt: [],
        sourceReference: [],
        lastCallMsg: [],

        crtdDate: [],

        ec: [],

        email: [],
        address: [],
        interViewer: [],

        paymentDate: [],

        startDate: [],
      }
      this.getVisitorList()
    },
    dateChangeFrom() {
      localStorage.setItem('VisFrom', this.fromDate)
      this.filters = {
        studentCode: [],

        fullName: [],

        dob: [],

        homePhone: [],

        mobilePhone: [],

        studentName: [],
        englishSchool: [],
        bookPT: [],

        isPT: [],

        registered: [],

        counselorName: [],

        remarks: [],
        totPaidAmt: [],
        sourceReference: [],
        lastCallMsg: [],

        crtdDate: [],

        ec: [],

        email: [],
        address: [],
        interViewer: [],

        paymentDate: [],

        startDate: [],
      }
      this.getVisitorList()
    },
    async getVisitorList() {
      this.isLoading = true
      this.listVisit = []
      await visitor_report.getVisitorList(this.locationID, this.fromDate, this.toDate).then(res => {
        this.listVisit = res.map(item => {
          return {
            ...item,
            dob: item.dob === null ? '' : this.formatTime(new Date(item.dob.split('T')[0])),
            paymentDate:
              item.paymentDate === null
                ? ''
                : this.formatTime(new Date(item.paymentDate.split('T')[0])),
            crtdDate:
              item.crtdDate === null ? '' : this.formatTime(new Date(item.crtdDate.split('T')[0])),
            startDate:
              item.startDate === null
                ? ''
                : this.formatTime(new Date(item.startDate.split('T')[0])),
          }
        })
        this.isLoading = false
      })
    },
    formatTime(date) {
      const yyyy = date.getFullYear()
      let mm = date.getMonth() + 1 // Months start at 0!
      let dd = date.getDate()

      if (dd < 10) dd = '0' + dd
      if (mm < 10) mm = '0' + mm

      const formattedToday = dd + '/' + mm + '/' + yyyy
      return formattedToday
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    //async init() {
    // this.isLoading = true;
    // this.isChangeDateField = false;
    // this.listVisit = [];

    // if (this.listLocation.length !== 0) {
    //   let fromDate = this.year + "-" + this.month + "-01";
    //   let toDate = this.year + "-" + this.month + "-" + new Date(this.year, this.month, 0).getDate();
    //   await book_management
    //     .getInvtOrderByCenter(this.getLocationId(), fromDate, toDate)
    //     .then((res) => {
    //       if (res) {
    //         res.forEach((x) => {
    //           this.listVisit.push({
    //             productCode: x.productCode,

    //             totQtyOrd: x.totQtyOrd,
    //             actualQty: x.actualQty,
    //             qtyRcvd: x.qtyRcvd,
    //             qtyReturned: x.qtyReturned,
    //             unit: x.unit === "Bộ" ? "Bộ" : x.unit,
    //             description: x.description,

    //             quantityRemain: x.actualQty - x.qtyRcvd
    //           });
    //         });

    //         this.isChooseDate = false;
    //         this.isLoading = false;
    //       } else {
    //         this.errorDialog = true;
    //       }
    //     })
    //     .catch(() => {
    //       this.errorDialog = true;
    //     });
    // }
    //  },
    //   getLocationId() {
    //     if (this.listLocation.length === 0) {
    //       return;
    //     } else {
    //       return this.listLocation.find((element) => {
    //         return element.name === this.location;
    //       }).id;
    //     }
    //   },
    groupColumnValueList(val) {
      return this.listVisit.map(d => d[val])
    },
    toggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.listVisit
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, []).length
        ) {
          this.filters[value] = []
          localStorage.setItem(
            'VisFilter',
            JSON.stringify({
              ...this.filters,
              [value]: [],
            })
          )
          localStorage.setItem(
            'VisFilter',
            JSON.stringify({
              ...this.filters,
              [value]: [],
            })
          )
        } else {
          this.filters[value] = this.listVisit
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, [])
            .slice()
          localStorage.setItem(
            'VisFilter',
            JSON.stringify({
              ...this.filters,
              [value]: this.listVisit
                .map(d => d[value])
                .reduce(function (accumulator, element) {
                  if (accumulator.indexOf(element) === -1) {
                    accumulator.push(element)
                  }
                  return accumulator
                }, [])
                .slice(),
            })
          )
        }
      })
    },
    back() {
      window.history.back()
    },

    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped>
fieldset {
  display: none;
}

.select-book {
  padding: 0 !important;
  background-color: #ffff !important;
}
.input-select {
  max-width: 190px;
}
.select-book * {
  margin: 0 !important;
}

#book-inventory-i-o {
  margin-top: 35px;
}

.select-item {
  height: 35px;
}

tfoot tr td {
  border: none !important;
  color: #000;
  background: #9e9e9e;
}

table {
  border-collapse: collapse;
}

.table-data {
  max-height: 70vh;
  overflow: scroll;
}

.th-2 {
  width: 400px;
}

.v-data-table-header tr:nth-of-type(1) th {
  background: #0b2585;
}

.v-data-table-header tr:nth-of-type(2) th {
  background: #f8fafb;
}

td,
th {
  border: 1px solid !important;
  text-align: center !important;
}

.v-data-table-header {
  position: relative;
  position: sticky;
  top: 0;
}

.v-data-table-header::before {
  content: '';
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  background: #dae3e8;
}

tbody tr:nth-child(even) {
  background: #bde6fb;
}

th {
  z-index: 10000;
}

td,
th {
  border: 1px solid #dae3e8 !important;
  padding: 5px 20px;
  text-align: left !important;
}

.footer {
  padding: 0 !important;
  margin-top: 20px;
}

tfoot {
  position: sticky;
  bottom: 0;
}
</style>
