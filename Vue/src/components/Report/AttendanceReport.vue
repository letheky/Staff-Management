<template>
  <div id="center-management" class="d-flex flex-column">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <div class="d-flex">
            <h2 class="pt-1">Student Attendance</h2>
          </div>
          <div class="d-flex justify-space-between mt-3">
            <div class="d-flex">
              <v-autocomplete
                v-model="locationID"
                item-text="location"
                append-icon="keyboard_arrow_down"
                item-value="locationID"
                :items="centers"
                label="Center"
                outlined
                :class="'mr-2'"
                @change="searchClass()"
                dense
                style="z-index: 4"
              ></v-autocomplete>
              <v-autocomplete
                label="Class status"
                v-model="status"
                :items="statusList"
                item-text="classStatus"
                item-value="classStatus"
                @change="searchClass()"
                outlined
                dense
                hide-details
                class="mr-2"
                style="z-index: 4"
              ></v-autocomplete>
              <v-autocomplete
                label="Select Class"
                v-model="classCode"
                :items="classList"
                item-text="classCode"
                item-value="classID"
                outlined
                dense
                hide-details
                class="mr-2"
                @change="changeClass()"
                style="z-index: 4"
              ></v-autocomplete>
              <v-text-field
                v-if="!errorDate"
                @input="changeFrom"
                type="date"
                label="From date"
                v-model="fromDate"
                outlined
                dense
                :disabled="classCode !== '' ? false : true"
                hide-details
              />
              <v-text-field
                v-else
                @input="changeTo"
                type="date"
                label="From date"
                v-model="fromDate"
                outlined
                :disabled="classCode !== '' ? false : true"
                dense
                error
                hide-details
              />
              <v-text-field
                v-if="!errorDate"
                :class="'ml-3'"
                @input="changeTo"
                type="date"
                label="To date"
                v-model="toDate"
                :disabled="classCode !== '' ? false : true"
                outlined
                dense
                hide-details
              />
              <v-text-field
                v-else
                @input="changeTo"
                :class="'ml-3'"
                type="date"
                label="To date"
                v-model="toDate"
                outlined
                :disabled="classCode !== '' ? false : true"
                dense
                error
                hide-details
              />
            </div>
            <v-btn elevation="0" height="36" color="primary" @click="downloadExcel">
              Download file excel
            </v-btn>
          </div>
          <div class="d-flex my-3 total-div">
            Class:
            <span :class="'link ml-1 mr-1'" @click="viewClassDetail(classCode)">
              {{ className }}
            </span>
            from {{ startDate }} to {{ endDate }} with {{ scheduleList.length }} schedules. Total:
            {{ this.filtered.length }}&nbsp;
            <div v-if="this.filtered.length > 1">students</div>
            <div v-else>student</div>
          </div>
          <v-progress-linear
            v-if="isLoading"
            indeterminate
            color="primary"
            class="my-10"
          ></v-progress-linear>
          <v-data-table
            v-if="!isLoading"
            :headers="logHeaders"
            :items="filtered"
            :items-per-page="-1"
            hide-default-header
            hide-default-footer
            id="attendTable"
            class="elevation-0 mb-5"
            fixed-header
            height="70vh"
          >
            <template v-slot:header="{ props }">
              <thead class="v-data-table-header">
                <tr>
                  <th
                    v-for="(header, index) in props.headers"
                    :key="header.text + '' + index"
                    role="columnheader"
                    scope="col"
                    class="text-center font-weight-light headTitle"
                  >
                    <span style="color: white">{{ header.text }}</span>
                  </th>
                </tr>
              </thead>
              <tr id="autocomplete-fix-size">
                <td v-for="header in props.headers" :key="header.value">
                  <div
                    :class="'d-flex justify-center align-center'"
                    style="height: 48px"
                    v-if="filters[header.value]"
                  >
                    <Autocomplete
                      v-if="filters.hasOwnProperty(header.value)"
                      @setFilter="setFilter"
                      :styleBorder="'border-bottom'"
                      :keyFilter="header.value"
                      :selectedInit="filters[header.value]"
                      :listItem="groupColumnValueList(header.value)"
                    />
                  </div>
                  <div v-else>
                    <td></td>
                  </div>
                </td>
              </tr>
            </template>
            <template v-slot:body="{ items }">
              <tbody v-if="items.length === 0" style="text-align: center">
                <div
                  class="pt-3"
                  style="position: absolute; left: 50%; transform: translate(-50%, 0)"
                >
                  No data available
                </div>
              </tbody>
              <tbody v-else v-for="(item, index) in items" :key="index">
                <tr>
                  <td>{{ index + 1 }}</td>
                  <td class="data-fixed-columns" style="text-align: left">
                    {{ item.studentCode }}
                  </td>
                  <td style="text-align: left">{{ item.fullname }}</td>
                  <td style="text-align: left">{{ item.mobilePhone }}</td>
                  <td class="attendDay">{{ item.absentDays }}</td>
                  <td class="attendDay">{{ item.attendDays }}</td>
                  <td v-for="(date, index) in item.schedules" :key="'date' + index">
                    <div v-if="date.attendanceStatus == 'Attended'" class="spanBox attendSpan">
                      <span>ATTEND</span>
                    </div>
                    <div v-else-if="date.attendanceStatus == 'Absent'" class="spanBox absentSpan">
                      <span>ABSENT</span>
                    </div>
                    <div v-else class="spanBox noSpan">
                      <span>NOT ATTEND</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { class_managerment } from '@/api/class-management.js'
import { account_managerment } from '@/api/account-management.js'
import { report_management } from '@/api/report-management'
import dayjs from 'dayjs'
import Autocomplete from '@/components/Utils/Autocomplete.vue'

import message from '@/components/Utils/message'
import QueryString from 'qs'
var XLSX = require('xlsx')

export default {
  components: { Autocomplete },
  data() {
    return {
      fromDate: '',
      toDate: '',
      width: 400,
      maxWidth: 1000,
      maxHeight: 200,
      classList: [],
      isLoading: false,
      isLoadingClass: false,
      centers: [],
      center: '',
      locationID: 0,
      status: 'In progress',
      classCode: '',
      errorDate: false,
      statusList: [],
      statusListView: [],
      studentList: [],
      studentListView: [],
      dataRow: [],
      classIDs: this.$route.query.classIds,
      classIDList: this.$route.query.classIds,
      errorDialog: false,
      message: message,
      scheduleList: [],
      scheduleListView: [],
      className: '',
      endDate: '',
      startDate: '',
      filters: {
        studentCode: [],
        fullname: [],
      },
      json_fields: {
        'Student code': 'studentCode',
        'Student name': 'fullname',
        'Phone number': 'mobilePhone',
        'Absent days': 'absentDays',
        'Attend days': 'attendDays',
      },
    }
  },
  created() {
    if (localStorage.getItem('attClass')) {
      this.classCode = parseInt(localStorage.getItem('attClass'))
    }
    if (localStorage.getItem('atteTo')) {
      this.fromDate = localStorage.getItem('atteTo')
    }
    if (localStorage.getItem('attFilter')) {
      this.filters = JSON.parse(localStorage.getItem('attFilter'))
    } else {
      this.fromDate = dayjs()
        .add(-parseInt(dayjs().add(-1, 'day').format('DD')), 'day')
        .format('YYYY-MM-DD')
    }
    if (localStorage.getItem('atteFrom')) {
      this.toDate = localStorage.getItem('atteFrom')
    } else {
      this.toDate = dayjs().format('YYYY-MM-DD')
    }
    if (localStorage.getItem('atteStatus')) {
      this.status = localStorage.getItem('atteStatus')
    }
    if (localStorage.getItem('atteCenter')) {
      this.locationID = parseInt(localStorage.getItem('atteCenter'))
    } else {
      this.locationID = parseInt(localStorage.getItem('currentCenter'))
    }

    this.centers = []
    this.classList = []
    // this.center = 'CEC Văn quán 1'
    this.centers = JSON.parse(localStorage.getItem('currentUser')).locationPermissions
    this.resetData()
    // this.getListCenters()
    this.changeClasss()
    this.getClassStatus()
    this.searchClass()
    this.changeClasss()
  },
  computed: {
    logHeaders() {
      let headers = []
      headers.push(
        { text: 'No', value: 'no' },
        { text: 'Student code', value: 'studentCode' },
        { text: 'Student name', value: 'fullname' },
        { text: 'Phone number', value: 'mobilePhone' },
        { text: 'Absent days', value: 'absentDays' },
        { text: 'Attend days', value: 'attendDays' }
      )
      this.scheduleListView.forEach(date => {
        headers.push({
          text: this._dayjs(date).format('DD/MM/YYYY'),
          value: date,
        })
      })
      return headers
    },
    filtered() {
      let logR = this.studentList.map(log => {
        let dtrRecord = []
        let absentDays = 0
        let attendDays = 0
        this.scheduleListView.forEach(date => {
          let date0, status0
          log.schedules.filter(sc => {
            if (sc.date === date) {
              date0 = date
              status0 = sc.attendanceStatus
              if (status0 === 'Absent') absentDays++
              else if (status0 === 'Attended') attendDays++
            }
          })
          dtrRecord.push({
            date: date0,
            attendanceStatus: status0,
          })
        })
        return Object.assign(
          {},
          {
            studentCode: log.studentCode,
            fullname: log.fullname,
            mobilePhone: log.mobilePhone,
            schedules: dtrRecord,
            absentDays: absentDays,
            attendDays: attendDays,
          }
        )
      })
      logR = logR.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
      return logR
    },
  },
  watch: {
    errorDate: () => {},
  },
  methods: {
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
      localStorage.setItem('attFilter', JSON.stringify(this.filters))
    },

    groupColumnValueList(val) {
      return this.studentList.map(item => item[val])
    },
    toggle(header) {
      this.$nextTick(() => {
        if (this.filters[header].length === this.studentList.length) {
          this.filters[header] = []
        } else {
          this.filters[header] = this.studentList.map(item => item[header])
        }
      })
    },
    async init() {
      if (this.studentList.length == 0) {
        if (this.classCode == null || this.classCode == '') return
        this.isLoading = true
        await report_management
          .getAttendaceReport(this.classCode)
          .then(res => {
            if (res) {
              this.studentList = res
            } else {
              this.errorDialog = true
            }
          })
          .catch(() => {
            this.errorDialog = true
          })
        this.isLoading = false
      }
    },
    async getSchedules() {
      if (this.scheduleList.length > 0) {
        this.scheduleListView = this.scheduleList.filter(
          item =>
            dayjs(item).format('YYYY-MM-DD') >= this.fromDate &&
            dayjs(item).format('YYYY-MM-DD') <= this.toDate
        )
      } else {
        if (this.classCode == null || this.classCode == '') return
        await class_managerment.getClassInfo(this.classCode).then(res => {
          let schedules = res.schedules
          this.scheduleListView = []
          this.scheduleList = []
          let datas = []
          schedules.forEach(s => {
            this.scheduleList.push(s.date)
            datas.push(s.date)
            this.scheduleListView = datas.filter(
              item =>
                dayjs(item).format('YYYY-MM-DD') >= this.fromDate &&
                dayjs(item).format('YYYY-MM-DD') <= this.toDate
            )
          })

          this.className = res.classInfo.classCode
          this.startDate = dayjs(res.classInfo.startDate).format('DD/MM/YYYY')
          this.endDate = dayjs(res.classInfo.endDate).format('DD/MM/YYYY')
        })
      }
    },
    async getListCenters() {
      await account_managerment.getListCenter().then(res => {
        if (res) {
          this.centers = res
          // this.center = this.centers[0].location
        }
      })
    },
    async getClassStatus() {
      await class_managerment.getClassStatus().then(res => {
        if (res) {
          res.unshift({
            classStatusID: 6,
            classStatus: 'All',
          })
          this.statusList = res
        }
      })
    },
    async searchClass() {
      this.isLoadingClass = true
      this.resetData()
      localStorage.setItem('atteStatus', this.status)
      localStorage.setItem('atteCenter', this.locationID)
      const body = {
        pLocationid: this.locationID,
        pStatus: this.status != 'All' ? this.status : '',
      }

      await class_managerment.getClassByLocation(QueryString.stringify(body)).then(res => {
        if (res) {
          this.classList = res
          // console.log('this.classList', this.classList)
        }
      })
      this.isLoadingClass = false
    },
    resetData() {
      this.studentListView = []
      this.studentList = []
      this.scheduleListView = []
      this.scheduleList = []

      // this.fromDate = null
      // this.toDate = null
    },
    viewClassDetail(classID) {
      if (classID == null || classID == 0) return
      this.$router.push({
        name: 'class-management-detail',
        query: {
          classID: classID,
        },
      })
    },
    changeClass() {
      this.resetData()
      this.filters = {
        studentCode: [],
        fullname: [],
      }
      this.confirmStatistics()
      localStorage.setItem('attClass', this.classCode)
    },
    changeClasss() {
      this.resetData()
      this.confirmStatistics()
      localStorage.setItem('attClass', this.classCode)
    },
    confirmStatistics() {
      this.init()
      this.getSchedules()
    },
    viewDetail(centerId) {
      this.$router.push({
        name: 'center-management-detail',
        params: { centerId: centerId },
      })
    },
    columnValueClassList(val) {
      return this.classList.map(d => d[val]).filter(y => y)
    },
    checkTime(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    back() {
      this.$router.push({ name: 'home' })
    },
    downloadExcel() {
      if (this.studentList.length > 0) {
        var table_elt = document.getElementById('attendTable')
        var workbook = XLSX.utils.table_to_book(table_elt)
        XLSX.writeFile(workbook, 'Attendance at ' + this.className + '.xlsm')
      }
    },
    changeFrom(id) {
      this.toFrom = id

      localStorage.setItem('atteFrom', dayjs(id).format('YYYY-MM-DD'))
      this.confirmStatistics()
    },
    changeTo(id) {
      this.toDate = id
      localStorage.setItem('atteTo', dayjs(id).format('YYYY-MM-DD'))
      console.log(id)
      this.confirmStatistics()
      this.filters = {
        studentCode: [],
        fullname: [],
      }
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped>
.filter-action {
  cursor: pointer;
  color: #2196f3;
  text-decoration: underline;
}
.total-div {
  color: #0c2e68;
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 16px;
}

::v-deep .headTitle {
  background-color: #0b2585 !important;
  height: 30px !important;
  font-size: 14px !important;
  border: 0 !important;
  color: white !important;
}

.v-text-field {
  width: 200px;
}
tbody tr:nth-of-type(odd) {
  // background: rgb(235, 229, 229) !important;
  color: #000 !important;
}
tbody tr:nth-of-type(even) {
  // background: rgb(235, 229, 229) !important;
  background: #000 !important;
}
#attendTable {
  display: block;
  white-space: nowrap;
}
.f td:nth-of-type(1) {
  z-index: 102 !important;
  left: 0;
}
.f td:nth-of-type(2) {
  z-index: 102 !important;
  left: 40px;
}
.f td:nth-of-type(3) {
  z-index: 102 !important;
  left: 140px;
}
#attendTable th {
  padding: 16px 7px;
  text-align: center;
  font-weight: 400;
}
#attendTable td {
  border-bottom: 1px solid #d1d4d4;
}

#attendTable tbody:nth-of-type(even) tr td {
  background-color: #f3faff !important;
}

#attendTable tbody tr:nth-of-type(odd):hover td {
  background-color: #d7dbdd !important;
}
#attendTable tbody:nth-of-type(even) tr:hover td {
  background-color: #dbecf8 !important;
}
#attendTable tbody tr:nth-of-type(even) {
  background-color: #eeeeee !important;
}

#attendTable tbody tr td:nth-of-type(1) {
  z-index: 2;
  p {
    width: 20px;
  }
  position: sticky;
  left: 0px;
  z-index: 100;
  background: #fff;
}
#attendTable tbody tr td:nth-of-type(2) {
  z-index: 2;
  p {
    width: 70px;
  }
  position: sticky;
  left: 40px;
  z-index: 10;
  background: #fff;
  color: #427df2 !important;
}
#attendTable tr:nth-of-type(1) td {
  z-index: 100;
}
#attendTable tbody tr td:nth-of-type(3) {
  p {
    width: 170px;
  }
  position: sticky;
  left: 140px;
  z-index: 3;
  background: #fff;
  color: #427df2 !important;
}
#attendTable tr:nth-child(2) {
  left: 140px;
  z-index: 10;
  background: #fff;
}
#attendTable tbody tr td:nth-child(1) {
  width: 20px;
}

#attendTable th:nth-child(1),
#attendTable th:nth-child(2),
#attendTable th:nth-child(3) {
  z-index: 4;
}
#attendTable tbody tr td {
  z-index: 0 !important;
}
.spanBox {
  border-radius: 7px;
  padding: 3px 10px;
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.attendSpan {
  background-color: #27ae601a;
  color: #27ae60;
}

.absentSpan {
  background-color: #e11c1c1a;
  color: #e11c1c;
}

.noSpan {
  background-color: #4450511a;
}

.attendDay {
  background: #fff;
  color: #000 !important;
}
.link {
  cursor: pointer;

  color: #427df2 !important;
}

.link:hover {
  text-decoration: underline;
  font-weight: 700;
}
</style>
