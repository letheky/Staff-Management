<template>
  <div id="cus-care-detail">
    <v-row no-gutters>
      <v-col md="12">
        <div>
          <v-row> </v-row>
          <!-- <v-progress-linear v-if="isLoading" indeterminate color="primary" class="my-10"></v-progress-linear> -->
          <v-data-table
            :headers="headers"
            :items="filtered"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            hide-default-header
            hide-default-footer
            @page-count="pageCount = $event"
            class="elevation-0"
            fixed-header
            height="60vh"
          >
            <template v-slot:header="{ props }">
              <thead class="v-data-table-header">
                <tr>
                  <th
                    :style="{ background: header.color, color: '#000 !important' }"
                    v-for="header in props.headers"
                    :key="header.value"
                  >
                    {{ header.text }}
                  </th>
                </tr>

                <tr class="fixed-row-filter">
                  <th v-for="header in props.headers" class="select-book" :key="header.text">
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
              </thead>
            </template>
            <template v-slot:[`item.classCode`]="{ item }">
              <p class="link" @click="viewDetailClass(item.classID)">{{ item.classCode }}</p>
            </template>
            <template v-slot:[`item.qc`]="{ item }">
              <p :class="'  link'" @click="viewProfileByUserId(item.qcid)">{{ item.qc }}</p>
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
//import { book_management } from "@/api/book_management.js";
// import Multiselect from "vue-multiselect";
import dayjs from 'dayjs'
import Autocomplete from '@/components/Utils/Autocomplete.vue'
export default {
  components: {
    // Multiselect,
    Autocomplete,
  },

  data() {
    return {
      isLoading: false,
      page: 1,
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
          value: 'fullName',
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
          text: 'Class Code',
          value: 'classCode',
          color: '#FFCF53',
          sortable: false,
        },
        {
          text: 'Quanlity Counselor',
          value: 'qc',
          color: '#FFCF53',
          sortable: false,
        },
        {
          text: 'Mobile phone',
          value: 'mobilePhone',
          color: '#A0D589',
          sortable: false,
        },
        {
          text: 'Start date',
          value: 'actualStartDate',
          color: '#FFCF53',
          sortable: false,
        },
        {
          text: 'School',
          value: 'schoolTemp',
          color: '#A0D589',
          sortable: false,
        },
        {
          text: 'Counselor’s note',
          value: 'counselorNote',
          color: '#FEBFFF',
          sortable: false,
        },
        {
          text: "Customer's feedback",
          value: 'customerNote',
          color: '#FFCF53',
          sortable: false,
        },
        {
          text: 'Create User',
          value: 'crtdUser',
          color: '#FFCF53',
          sortable: false,
        },
        {
          text: 'Create Date',
          value: 'crtdDate',
          color: '#FFCF53',
          sortable: false,
        },
        {
          text: 'Education Counselor',
          value: 'ec',
          color: '#FFCF53',
          sortable: false,
        },
      ],
      listDetail: [],
      filters: {
        studentCode: [],
        fullName: [],
        actualStartDate: [],
        dob: [],
        crtdDate: [],
        crtdUser: [],
        schoolTemp: [],
        counselorNote: [],
        customerNote: [],
        ec: [],
        qc: [],
        classCode: [],
        mobilePhone: [],
      },
    }
  },

  computed: {
    filtered() {
      const listReport = this.listDetail.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })

      return listReport
    },
  },
  props: {
    locationID: { type: Number },
    toDate: String,
    fromDate: String,
    data: Object,
  },

  created() {
    if (JSON.parse(localStorage.getItem('CusDetailFilter'))) {
      this.filters = JSON.parse(localStorage.getItem('CusDetailFilter'))
    }
    this.init()

    //this.init();
  },
  watch: {
    // locationID: function () {
    //   this.filters = {
    //     studentCode: [],
    //     fullName: [],
    //     actualStartDate: [],
    //     dob: [],
    //     crtdDate: [],
    //     crtdUser: [],
    //     schoolTemp: [],
    //     counselorNote: [],
    //     customerNote: [],
    //     ec: [],
    //     qc: [],
    //     classCode: [],
    //   }
    //   console.log('dsjdhj')
    // },
    data(datas) {
      this.listDetail = datas.details.map(item => {
        return {
          ...item,
          dob: this.formatTime(new Date(item.dob.split('T')[0])),
          actualStartDate: this.formatTime(new Date(item.actualStartDate.split('T')[0])),
        }
      })
    },

    fromDate: function () {
      this.resetF()
    },
    toDate() {
      this.filters = {
        studentCode: [],
        fullName: [],
        actualStartDate: [],
        dob: [],
        crtdDate: [],
        crtdUser: [],
        schoolTemp: [],
        counselorNote: [],
        customerNote: [],
        ec: [],
        qc: [],
        classCode: [],
      }
    },
  },
  methods: {
    init() {
      this.listDetail = this.data.details.map(item => {
        return {
          ...item,
          dob: this.formatTime(new Date(item.dob.split('T')[0])),
          actualStartDate: this.formatTime(new Date(item.actualStartDate.split('T')[0])),
        }
      })
    },
    changeFilter() {},
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
      localStorage.setItem('CusDetailFilter', JSON.stringify(this.filters))
    },
    resetF() {
      this.filters = {
        studentCode: [],
        fullName: [],
        actualStartDate: [],
        dob: [],
        crtdDate: [],
        crtdUser: [],
        schoolTemp: [],
        counselorNote: [],
        customerNote: [],
        ec: [],
        qc: [],
        classCode: [],
      }
    },
    viewProfileByUserId(userId) {
      if (userId)
        this.$router.push({
          name: 'account-management-view-account',
          params: {
            userId: userId,
          },
        })
    },
    viewDetailClass(classID) {
      localStorage.setItem('dateOfDailyClasses', this.date)
      localStorage.removeItem('isBackFromDetailDailyClasses')
      this.$router.push({
        name: 'class-management-detail',
        query: { classID: classID },
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
    toggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.listDetail
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
            'CusDetailFilter',
            JSON.stringify({
              ...this.filters,
              [value]: [],
            })
          )
        } else {
          this.filters[value] = this.listDetail
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, [])
            .slice()
          localStorage.setItem(
            'CusDetailFilter',
            JSON.stringify({
              ...this.filters,
              [value]: this.listDetail
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
    //async init() {
    // this.isLoading = true;
    // this.isChangeDateField = false;
    // this.listDetail = [];

    // if (this.listLocation.length !== 0) {
    //   let fromDate = this.year + "-" + this.month + "-01";
    //   let toDate = this.year + "-" + this.month + "-" + new Date(this.year, this.month, 0).getDate();
    //   await book_management
    //     .getInvtOrderByCenter(this.getLocationId(), fromDate, toDate)
    //     .then((res) => {
    //       if (res) {
    //         res.forEach((x) => {
    //           this.listDetail.push({
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
      return this.listDetail.map(d => d[val]).filter(y => y)
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
.link {
  cursor: pointer;
  color: #427df2 !important;
}

.link:hover {
  text-decoration: underline;
  font-weight: 700;
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
