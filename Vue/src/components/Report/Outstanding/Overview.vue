<template>
  <div class="out-st" id="center-management">
    <v-row no-gutters class="pb-3">
      <v-col md="12">
        <div class="pa-10 pt-5">
          <h2 class="mb-4">Outstanding Report</h2>
          <v-row>
            <v-col md="3">
              <v-select
                :items="centerList"
                item-text="location"
                item-value="locationID"
                append-icon="keyboard_arrow_down"
                outlined
                dense
                hide-details
                placeholder="Center"
                v-model="chooseLocation"
                @change="changeLocation"
              >
              </v-select>
            </v-col>
          </v-row>

          <div class="d-flex justify-space-between align-center pt-2 pb-2">
            <v-col md="4" class="d-flex align-center">
              <span v-if="filtered.length != 1">Total: {{ filtered.length }} students</span>
              <span v-else>Total: {{ filtered.length }} student</span>
            </v-col>
            <b class="mr-5">
              Total outstanding fee:
              {{
                filtered
                  .reduce((total, student) => {
                    return (total += student.outstandingFeeFilter)
                  }, 0)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }}
            </b>
          </div>
          <v-progress-linear
            v-if="isLoading"
            indeterminate
            color="primary"
            class="my-10"
          ></v-progress-linear>
          <v-data-table
            v-if="!isLoading"
            :headers="headers"
            :items="filtered"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            @page-count="pageCount = $event"
            hide-default-footer
            class="elevation-0 spendingTable"
            fixed-header
            height="70vh"
          >
            <template v-slot:header="{ props }">
              <tr class="fixed-row-filter">
                <th v-for="header in props.headers" :key="header.text" class="headerOueding">
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
            <template v-slot:item="{ item, index }">
              <tr>
                <td>{{ itemsPerPage * (page - 1) + index + 1 }}</td>
                <td @click="viewDetailProfile(item.stuUserID)" :classID="item.classID" class="link">
                  {{ item.studentCode }}
                </td>
                <td class="link" @click="viewDetailProfile(item.stuUserID)">
                  <p :style="{ width: '100px' }">{{ item.studentName }}</p>
                </td>
                <td>{{ item.mobilePhone }}</td>
                <td>{{ item.dob }}</td>
                <td>
                  <p
                    :class="'link'"
                    @click="viewDetailClass(item.classID)"
                    :style="{ width: '100px' }"
                  >
                    {{ item.classCode }}
                  </p>
                </td>
                <td>{{ item.startDate }}</td>
                <td>{{ item.endDate }}</td>
                <td>{{ item.dueDate }}</td>
                <td>{{ item.dueMonth }}</td>
                <td align="right">
                  {{ item.outstandingFee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}
                </td>
                <td align="right">
                  {{ item.studentAccountBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}
                </td>
                <td>
                  <p :style="{ width: '150px' }">{{ item.qc }}</p>
                </td>
                <td>
                  <p :style="{ width: '150px' }">{{ item.ec }}</p>
                </td>
                <td>
                  <div :style="{ width: '120px' }" class="d-flex justify-center">
                    <img
                      :class="'link'"
                      :style="{ marginRight: '10px' }"
                      :src="item.hasRoadmap === 'Yes' ? iconAc : iconUnAc"
                    />
                    <p
                      @click="
                        item.hasRoadmap === 'Yes' &&
                          viewRoadMap(item.studentCode.substr(0, 5), item.classID, item.stuUserID)
                      "
                      :class="`link ${item.hasRoadmap === 'Yes' ? '' : 'disible'}`"
                    >
                      View detail
                    </p>
                  </div>
                </td>
                <!-- <td>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <img
                        v-bind="attrs"
                        v-on="on"
                        v-if="item.remark === '' || item.remark === null"
                        :style="{ width: '18px' }"
                        @click="openEditNote(item)"
                        src="../../../assets/images/notes (1).svg"
                        alt=""
                      />
                      <img
                        v-bind="attrs"
                        v-on="on"
                        v-else
                        :style="{ width: '18px' }"
                        @click="openEditNote(item)"
                        src="../../../assets/images/notes.svg"
                        alt=""
                      />
                    </template>
                    <span v-if="item.remark === '' || item.remark === null">Create note</span>
                    <span v-else>View note</span>
                  </v-tooltip>
                  <div v-show="overlay" :class="'h'">
                    <div class="card-i">
                      <v-card
                        :style="{ boxShadow: 'none' }"
                        light
                        :min-width="screen < 700 ? '500' : '600'"
                      >
                        <v-card-title class="text-h5" :style="{ fontWeight: 700 }">
                          Student notes
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-textarea
                          :v-model="noteText"
                          name="input-7-1"
                          label="Add lesson notes"
                          :disabled="!isEdit"
                          @change="noteOnChange"
                          :value="noteText"
                          outlined
                          dense
                          height="30vh"
                          class="abc mt-3 ml-5 mr-5"
                          id="abcd"
                        ></v-textarea>
                        <v-divider></v-divider>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <div :class="'mb-4'" class="btnNote">
                            <v-btn elevation="2" large @click="overlay = false">Cancel</v-btn>
                            <v-btn
                              elevation="2"
                              large
                              color="primary"
                              @click="saveNote"
                              v-if="isEdit === true"
                              >Save</v-btn
                            >
                            <v-btn elevation="2" large color="primary" @click="btn_Edit" v-else
                              >Edit</v-btn
                            >
                          </div>
                        </v-card-actions>
                      </v-card>
                    </div>
                  </div>
                </td> -->
              </tr>
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
          :items="[20, 50, 100, 200]"
          @change="itemsPerPage = parseInt($event, 10)"
          style="height: 32px"
        ></v-select>
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
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { report_management } from '@/api/report-management.js'
import Autocomplete from '@/components/Utils/Autocomplete.vue'
import iconAc from '../../../assets/images/icon-accept.svg'
import iconUnAc from '../../../assets/images/icon-unaccept.svg'
export default {
  components: { Autocomplete },
  data() {
    return {
      iconAc: iconAc,
      iconUnAc: iconUnAc,
      noteText: '',
      isEdit: false,
      overlay: false,
      isLoading: false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      headers: [
        {
          text: 'No',
          align: 'start',
          value: 'no',
        },
        { text: 'Student code', value: 'studentCode' },
        { text: 'Student name', value: 'studentName' },
        { text: 'Phone number', value: 'mobilePhone' },
        { text: 'DOB', value: 'dob' },
        { text: 'Class code', value: 'classCode' },
        { text: 'Start date', value: 'startDate' },
        { text: 'End date', value: 'endDate' },
        { text: 'Due date', value: 'dueDate' },
        { text: 'Due month', value: 'dueMonth' },
        { text: 'Outstanding fee', value: 'outstandingFee' },
        {
          text: 'Balance',
          value: 'studentAccountBalance',
        },
        { text: 'QC', value: 'qc' },
        { text: 'EC', value: 'ec' },
        { text: 'Roadmap created', value: 'hasRoadmap' },
        // { text: 'Action', value: 'remark' },
      ],
      studentList: [],
      studentIDList: [],
      roadmapList: [],
      chooseLocation: 1,
      centerList: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
      fromDate: '',
      toDate: '',
      totalOutstandingFee: 0,
      searchTexts: {
        studentCode: '',
        studentName: '',
        mobilePhone: '',
        dob: '',
        classCode: '',
        startDate: '',
        endDate: '',
        dueDate: '',
        dueMonth: '',
        studentAccountBalance: '',
        outstandingFee: '',
        qc: '',
        ec: '',
        tuitionFee: '',
        hasRoadmap: '',
        remark: '',
      },
      filters: {
        studentCode: [],
        studentName: [],
        mobilePhone: [],
        dob: [],
        classCode: [],
        startDate: [],
        endDate: [],
        dueDate: [],
        dueMonth: [],
        ec: [],
        qc: [],
        studentAccountBalance: [],
        outstandingFee: [],
        hasRoadmap: [],
        remark: [],
      },
    }
  },
  computed: {
    filtered() {
      return this.studentList.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
    },
  },
  created() {
    this.chooseLocation = parseInt(localStorage.getItem('currentCenter'))
    if (localStorage.getItem('outstandingLocation')) {
      this.chooseLocation = parseInt(localStorage.getItem('outstandingLocation'))
    }
    if (localStorage.getItem('outstandingFilter')) {
      this.filters = JSON.parse(localStorage.getItem('outstandingFilter'))
    }
    this.init()
  },
  watch: {
    totalOutstandingFee: function (newValue) {
      this.totalOutstandingFee = newValue
    },
  },
  methods: {
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
      localStorage.setItem('outstandingFilter', JSON.stringify(this.filters))
    },
    viewDetailProfile(userId) {
      this.$router.push({
        name: 'account-management-view-account',
        params: {
          userId: userId,
        },
      })
    },
    viewDetailClass(classID) {
      console.log(classID)
      this.$router.push({
        name: 'class-management-detail',
        query: { classID: classID, fromOutStanding: true },
      })
    },
    changeInputFilter(searchText, header) {
      this.searchTexts[header] = searchText
    },
    viewRoadMap(studentID, classID, userID) {
      console.log(userID)
      this.$router.push({
        name: 'student-roadmap-overview',
        query: {
          studentID: studentID,
          classID: classID,
          userID: userID,
        },
      })
    },
    async init() {
      this.isLoading = true
      await report_management.getOutstandingList(this.chooseLocation).then(res => {
        if (res) {
          res.forEach(x => {
            this.totalOutstandingFee += x.outstandingFee
            this.studentList.push(this.formatStudentInfo(x))
          })
        }
      })
      this.isLoading = false
    },
    async changeLocation(locationID) {
      this.totalOutstandingFee = 0
      localStorage.setItem('outstandingLocation', locationID)
      ;(this.filters = {
        studentCode: [],
        studentName: [],
        mobilePhone: [],
        dob: [],
        classCode: [],
        startDate: [],
        endDate: [],
        dueDate: [],
        dueMonth: [],
        ec: [],
        qc: [],
        studentAccountBalance: [],
        outstandingFee: [],
        hasRoadmap: [],
        remark: [],
      }),
        (this.isLoading = true)
      await report_management.getOutstandingList(locationID).then(res => {
        if (res) {
          this.studentList = []
          this.location = res.location
          res.forEach(x => {
            this.totalOutstandingFee += x.outstandingFee
            this.studentList.push(this.formatStudentInfo(x))
          })
        }
      })
      this.isLoading = false
    },

    formatStudentInfo(student) {
      return {
        ...student,
        dob: dayjs(student.dob).format('DD/MM/YYYY'),
        startDate: dayjs(student.startDate).format('DD/MM/YYYY'),
        endDate: dayjs(student.endDate).format('DD/MM/YYYY'),
        dueDate: dayjs(student.dueDate).format('DD/MM/YYYY'),
        dueMonth: dayjs(student.dueDate).format('MM/YYYY'),
        outstandingFeeFilter: student.outstandingFee,
        studentAccountBalance: student.studentAccountBalance
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        outstandingFee: student.outstandingFee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      }
    },
    groupColumnValueList(val) {
      return this.studentList
        .map(d => {
          return d[val]
        })
        .filter(y => y)
    },
    toggleWithSearch(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.studentList
            .filter(item => item[value].indexOf(this.searchTexts[value]) !== -1)
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, []).length
        ) {
          this.filters[value] = []
          this.searchTexts[value] = ''
        } else {
          this.filters[value] = this.studentList
            .filter(item => item[value].indexOf(this.searchTexts[value]) !== -1)
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
    toggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.studentList
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
          this.filters[value] = this.studentList
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
    // take note
    async reload() {
      this.isLoading = true
      this.overlay = false
      this.getClassInfo()
      this.isLoading = false
    },
    noteOnChange(value) {
      this.noteText = value
    },
    saveNote() {
      this.overlay = false
      this.reload()
    },

    btn_Edit() {
      this.isEdit = true
    },
    openEditNote(item) {
      if (item.remark == null || item.remark == '') this.isEdit = true
      else this.isEdit = false
      this.overlay = true
      // this.scheduleIDEdit = item.scheduleID
      this.noteText = item.remark
    },
    // end take note
    _dayjs: dayjs,
  },
}
</script>
<style>
/* .out-st .theme--light.v-data-table.v-data-table--fixed-header thead th {
  background: #0b2585 !important;
  box-shadow: inset 0 -1px 0 rgb(0 0 0 / 12%);
}

.theme--light.v-data-table.v-data-table--fixed-header thead th>span {
  color: #ffff !important;
  font-weight: 100;
} */

/* take note */
.h {
  background: rgba(0, 0, 0, 0.01);
  position: fixed;
  width: 100%;
  height: 100%;

  top: 0;
  z-index: 1000;
  left: 0;
}
.card-i {
  width: 500px;
  position: absolute;
  top: 50%;

  left: 50%;
  transform: translate(-50%, -50%);
}
.btnNote {
  float: right;
  margin-top: 20px;
}
.btnNote button {
  margin-left: 20px;
  min-width: 150px !important;
}

/* end take note */
.spendingTable tbody tr:nth-child(odd) {
  background-color: #f3faff;
}
.link {
  cursor: pointer;

  color: #427df2 !important;
}
.link:hover {
  text-decoration: underline;
  font-weight: 700;
}
/* roadmap */
.disible {
  pointer-events: none;
  color: #0c2e68;

  opacity: 0.4;
}
/* end roadmap */
.spanYes {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  gap: 10px;
  color: #deffec;
  width: 106px;
  height: 25px;
  color: #039f45;
  background: #deffec;
  border-radius: 4px;
}
.spanNo {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  gap: 10px;
  width: 106px;
  height: 25px;
  background: #fff6dd;
  border-radius: 4px;
  color: #fa8c06;
}
</style>
