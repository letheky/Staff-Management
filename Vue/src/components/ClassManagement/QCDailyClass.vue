<template>
  <div id="course-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <div class="d-flex justify-space-between">
            <h2 class="mb-10">QC Daily classes</h2>
            <v-btn color="primary" @click="viewAllClass()">View all class</v-btn>
          </div>
          <v-row>
            <v-col md="5">
              <div class="d-flex">
                <v-btn text color="secondary" @click="prevDate">
                  <v-icon> mdi-chevron-left </v-icon>
                </v-btn>
                <v-btn outlined color="secondary" @click="setToday"> Today </v-btn>
                <v-btn text color="secondary" @click="nextDate">
                  <v-icon> mdi-chevron-right </v-icon>
                </v-btn>
                <!-- <date-picker
                  :model="date"
                  @update:model="updateDate"
                ></date-picker> -->
                <!-- <input
                  type="date"
                  style="min-height: 36px;padding: 0 12px; border: 1px solid rgba(0,0,0,0.15); border-radius: 3px ; width: 50%"
                  v-model="date"
                > -->
                <v-text-field
                  type="date"
                  v-model="date"
                  @click="isChangeDateField = true"
                  outlined
                  dense
                  hide-details
                />
                <div class="d-flex align-center ml-2">{{ dayOfWeek }}</div>
              </div>
            </v-col>
            <!-- <v-col md="2">
              <v-btn
                elevation="0"
                class="pl-5 pr-5"
                color="primary"
                @click="search()"
                :disabled="!date"
              >
                Search
              </v-btn>
            </v-col> -->
          </v-row>
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
                    v-for="header in props.headers"
                    :key="header.text"
                    role="columnheader"
                    scope="col"
                    aria-label="No"
                    class="text-start font-weight-bold"
                    :style="'width:' + header.width + '; min-width:' + header.width + ';'"
                  >
                    <span>{{ header.text }}</span>
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

            <template v-slot:[`item.teacherAssistant1`]="{ item }">
              {{ item.teacherAssistant1 }}
              <!-- <div v-if="item.teacherAssistant1">
                {{ item.teacherAssistant1 }}
              </div>
              <div v-else-if="item.teacherAssistant2">
                {{ item.teacherAssistant2 }}
              </div> -->
            </template>

            <template v-slot:[`item.statusLessonReport`]="{ item }">
              <div v-if="item.statusLessonReport == 'APPROVED'" class="d-flex justify-center">
                <v-icon color="#0FA958"> mdi-checkbox-marked-circle </v-icon>
              </div>
              <div
                v-else-if="item.statusLessonReport == 'INPROGRESS'"
                class="d-flex justify-center"
              >
                <v-icon color="#EB9516"> mdi-dots-horizontal-circle </v-icon>
              </div>
              <div v-else-if="item.statusLessonReport == 'REJECTED'" class="d-flex justify-center">
                <v-icon color="#EC1C24"> mdi-close-circle </v-icon>
              </div>
              <div v-else-if="item.statusLessonReport == 'NONE'" class="d-flex justify-center">
                <v-icon color="#C4C4C4">mdi-checkbox-blank-circle</v-icon>
              </div>
            </template>

            <template v-slot:[`item.hasAttendanced`]="{ item }">
              <div v-if="item.hasAttendanced == 'Yes'" class="d-flex justify-center">
                <v-icon color="#0FA958"> mdi-checkbox-marked-circle </v-icon>
              </div>
              <div v-else class="d-flex justify-center">
                <v-icon color="#C4C4C4">mdi-checkbox-blank-circle</v-icon>
              </div>
            </template>

            <template v-slot:[`item.hasCheckHomework`]="{ item }">
              <div v-if="item.hasCheckHomework == 'Yes'" class="d-flex justify-center">
                <v-icon color="#0FA958"> mdi-checkbox-marked-circle </v-icon>
              </div>
              <div v-else class="d-flex justify-center">
                <v-icon color="#C4C4C4">mdi-checkbox-blank-circle</v-icon>
              </div>
            </template>

            <template v-slot:[`item.action`]="{ item }">
              <v-menu>
                <template v-slot:activator="{ on, attrs }">
                  <div class="d-flex justify-center">
                    <v-btn icon height="18" width="18" v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-horizontal</v-icon>
                    </v-btn>
                  </div>
                </template>
                <v-list>
                  <v-list-item @click="viewDetailClass(item.classID)">
                    <v-list-item-title>Class details</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="item.hasReported"
                    @click="viewLessonReport(item.classID, item.scheduleID)"
                  >
                    <v-list-item-title>View lesson report</v-list-item-title>
                  </v-list-item>
                  <v-list-item v-else @click="createLessonReport(item.classID, item.scheduleID)">
                    <v-list-item-title>Create lesson report</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="item.hasAttendanced == 'Yes' && haveAttendancePermission"
                    @click="viewAttendance(item.classID, item.scheduleID)"
                  >
                    <v-list-item-title>View attendance</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-else-if="item.hasAttendanced == 'No' && haveAttendancePermission"
                    @click="takeAttendance(item.classID, item.scheduleID)"
                  >
                    <v-list-item-title>Take attendance</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
    <div v-if="!isLoading" color="#fff" class="w-100 pl-10 pr-10">
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
        <v-col md="4" class="d-flex align-center justify-end">
          <h3 v-if="filtered.length != 1">Total: {{ filtered.length }} classes</h3>
          <h3 v-else>Total: {{ filtered.length }} class</h3>
        </v-col>
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
import { class_managerment } from '@/api/class-management.js'
// import Multiselect from "vue-multiselect";
import dayjs from 'dayjs'
import message from '@/components/Utils/message'
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
          text: 'No',
          align: 'start',
          value: 'no',
          sortable: false,
        },
        {
          text: 'Center',
          value: 'center',
          sortable: false,
        },
        {
          text: 'Class code',
          value: 'classCode',
          sortable: false,
        },
        {
          text: 'Day',
          value: 'weekDay',
          sortable: false,
        },
        {
          text: 'Time',
          value: 'scheduleTime',
          sortable: false,
        },
        {
          text: 'Students',
          value: 'students',
          sortable: false,
        },
        {
          text: 'Teacher',
          value: 'teacher',
          sortable: false,
        },
        {
          text: 'Teacher assistant',
          value: 'teacherAssistant1',
          sortable: false,
        },
        {
          text: 'QC',
          value: 'qc',
          sortable: false,
        },
        {
          text: 'EC',
          value: 'ec',
          sortable: false,
        },
        {
          text: 'Report',
          value: 'statusLessonReport',
          width: '6%',
          sortable: false,
        },
        {
          text: 'Attendance',
          value: 'hasAttendanced',
          width: '8%',
          sortable: false,
        },
        {
          text: 'Homework',
          value: 'hasCheckHomework',
          width: '8%',
          sortable: false,
        },
        { text: 'Action', value: 'action', width: '7%', sortable: false },
      ],
      classList: [],
      filters: {
        classCode: [],
        center: [],
        qc: [],
        ec: [],
        classShiftName: [],
        teacher: [],
        statusLessonReport: [],
        hasAttendanced: [],
        hasCheckHomework: [],
        weekDay: [],
        teacherAssistant1: [],
        scheduleTime: [],
      },
      myUserId: 0,
      date: '',
      weekDay: '',
      dayOfWeek: '',
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      currentDate: new Date().getDate(),
      isChooseDate: false,
      centerList: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
      locationIDs: [],
      studentAttendancePermission: process.env.VUE_APP_ENV_FUNCTION_STUDENT_ATTENDANCE,
      functionRole: JSON.parse(localStorage.getItem('functionRole')),
      haveAttendancePermission: false,
      dateOfDailyClasses: localStorage.getItem('dateOfDailyClasses'),
      isBackFromDetailDailyClasses: localStorage.getItem('isBackFromDetailDailyClasses') || null,
      isChangeDateField: false,
      errorDialog: false,
      message: message,
    }
  },
  computed: {
    filtered() {
      return this.classList.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
    },
  },
  created() {
    if (!this.isBackFromDetailDailyClasses) {
      this.date =
        this.currentYear +
        '-' +
        this.checkTime(this.currentMonth) +
        '-' +
        this.checkTime(this.currentDate)
    } else {
      this.date = this.dateOfDailyClasses
    }
    this.weekDay = new Date(this.date).getDay()
    this.dayOfWeek = this.formatWeekDay(this.weekDay)
    this.centerList.forEach(x => {
      this.locationIDs.push(x.locationID)
    })
    if (
      this.functionRole.filter(
        x =>
          (x.functionID == this.studentAttendancePermission && x.cModify == true) ||
          (x.functionID == this.studentAttendancePermission && x.cFull == true)
      ).length
    ) {
      this.haveAttendancePermission = true
    }
    this.myUserId = JSON.parse(localStorage.getItem('currentUser')).userInfo.fullName
    this.setToday()
  },
  watch: {
    date: async function (value) {
      if (value && this.isChangeDateField) {
        this.isLoading = true
        this.weekDay = new Date(this.date).getDay()
        this.dayOfWeek = this.formatWeekDay(this.weekDay)
        await class_managerment
          .getQcDailyClass(this.locationIDs, value, this.myUserId)
          .then(res => {
            if (res) {
              this.classList = []
              res.schedules.forEach(x => {
                this.classList.push({
                  center: x.center,
                  centerID: x.centerID,
                  classCode: x.classCode,
                  classID: x.classID,
                  className: x.className,
                  classShiftName: x.classShiftName,
                  courseCode: x.courseCode,
                  courseNameEN: x.courseNameEN,
                  courseNameVN: x.courseNameVN,
                  hasAttendanced: x.hasAttendanced ? 'Yes' : 'No',
                  hasCheckHomework: x.hasCheckHomework ? 'Yes' : 'No',
                  hasReported: x.hasReported,
                  level: x.level,
                  levelID: x.levelID,
                  levelVN: x.levelVN,
                  scheduleID: x.scheduleID,
                  scheduleTime: x.scheduleTime,
                  statusLessonReport: x.statusLessonReport ? x.statusLessonReport : 'NONE',
                  teacher: x.teacher,
                  students: x.nbrStu,
                  qc: x.qc,
                  ec: x.ec,
                  teacherAssistant1: x.teacherAssistant1,
                  teacherAssistant1ID: x.teacherAssistant1ID,
                  teacherAssistant2: x.teacherAssistant2,
                  teacherAssistant2ID: x.teacherAssistant2ID,
                  teacherID: x.teacherID,
                  weekDay: x.weekDay,
                })
              })
              this.isChooseDate = false
            }
          })
        this.isLoading = false
      }
    },
  },
  methods: {
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
    },

    async init() {
      this.isLoading = true
      this.isChangeDateField = false
      this.classList = []
      this.weekDay = new Date(this.date).getDay()
      this.dayOfWeek = this.formatWeekDay(this.weekDay)
      await class_managerment
        .getQcDailyClass(this.locationIDs, this.date, this.myUserId)
        .then(res => {
          if (res && !res.errors) {
            res.schedules.forEach(x => {
              this.classList.push({
                center: x.center,
                centerID: x.centerID,
                classCode: x.classCode,
                classID: x.classID,
                className: x.className,
                classShiftName: x.classShiftName,
                courseCode: x.courseCode,
                courseNameEN: x.courseNameEN,
                courseNameVN: x.courseNameVN,
                hasAttendanced: x.hasAttendanced ? 'Yes' : 'No',
                hasCheckHomework: x.hasCheckHomework ? 'Yes' : 'No',
                hasReported: x.hasReported,
                level: x.level,
                levelID: x.levelID,
                levelVN: x.levelVN,
                scheduleID: x.scheduleID,
                scheduleTime: x.scheduleTime,
                statusLessonReport: x.statusLessonReport ? x.statusLessonReport : 'NONE',
                teacher: x.teacher,
                students: x.nbrStu,
                qc: x.qc,
                ec: x.ec,
                teacherAssistant1: x.teacherAssistant1,
                teacherAssistant1ID: x.teacherAssistant1ID,
                teacherAssistant2: x.teacherAssistant2,
                teacherAssistant2ID: x.teacherAssistant2ID,
                teacherID: x.teacherID,
                weekDay: x.weekDay,
              })
            })
            this.isChooseDate = false
          } else {
            this.errorDialog = true
          }
        })
        .catch(() => {
          this.errorDialog = true
        })
      this.isLoading = false
    },
    formatWeekDay(weekDay) {
      switch (weekDay) {
        case 0:
          weekDay = 'Sunday'
          break
        case 1:
          weekDay = 'Monday'
          break
        case 2:
          weekDay = 'Tuesday'
          break
        case 3:
          weekDay = 'Wednesday'
          break
        case 4:
          weekDay = 'Thursday'
          break
        case 5:
          weekDay = 'Friday'
          break
        case 6:
          weekDay = 'Saturday'
          break
      }
      return weekDay
    },
    viewAllClass() {
      this.$router.push({ name: 'class-management-overview' })
    },
    checkTime(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    groupColumnValueList(val) {
      return this.classList.map(d => d[val]).filter(y => y)
    },
    toggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.classList
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
          this.filters[value] = this.classList
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
    viewDetailClass(classID) {
      localStorage.setItem('dateOfDailyClasses', this.date)
      localStorage.removeItem('isBackFromDetailDailyClasses')
      this.$router.push({
        name: 'class-management-detail',
        query: { classID: classID },
      })
    },
    viewAttendance(classID, scheduleID) {
      localStorage.setItem('dateOfDailyClasses', this.date)
      localStorage.removeItem('isBackFromDetailDailyClasses')
      this.$router.push({
        name: 'class-management-view-student-attendance',
        query: { classID: classID, scheduleID: scheduleID },
      })
    },
    takeAttendance(classID, scheduleID) {
      localStorage.setItem('dateOfDailyClasses', this.date)
      localStorage.removeItem('isBackFromDetailDailyClasses')
      this.$router.push({
        name: 'class-management-take-attendance-student',
        query: { classID: classID, scheduleID: scheduleID },
      })
    },
    createLessonReport(classID, scheduleID) {
      localStorage.setItem('dateOfDailyClasses', this.date)
      localStorage.removeItem('isBackFromDetailDailyClasses')
      localStorage.setItem('lessonReportRoute', this.$route.path)
      this.$router.push({
        name: 'class-management-create-lesson-report',
        query: { classID: classID, scheduleID: scheduleID },
      })
    },
    viewLessonReport(classID, scheduleID) {
      localStorage.setItem('dateOfDailyClasses', this.date)
      localStorage.removeItem('isBackFromDetailDailyClasses')
      localStorage.setItem('lessonReportRoute', this.$route.path)
      this.$router.push({
        name: 'class-management-view-lesson-report',
        params: { route: this.$route.path },
        query: { classID: classID, scheduleID: scheduleID },
      })
    },
    async setToday() {
      this.isChooseDate = true
      this.date =
        this.currentYear +
        '-' +
        this.checkTime(this.currentMonth) +
        '-' +
        this.checkTime(this.currentDate)
      this.weekDay = new Date(this.date).getDay()
      this.dayOfWeek = this.formatWeekDay(this.weekDay)
      this.isLoading = true
      this.classList = []
      this.isChangeDateField = false
      await class_managerment
        .getQcDailyClass(this.locationIDs, this.date, this.myUserId)
        .then(res => {
          if (res) {
            res.schedules.forEach(x => {
              this.classList.push({
                center: x.center,
                centerID: x.centerID,
                qc: x.qc,
                ec: x.ec,
                classCode: x.classCode,
                classID: x.classID,
                className: x.className,
                classShiftName: x.classShiftName,
                courseCode: x.courseCode,
                courseNameEN: x.courseNameEN,
                courseNameVN: x.courseNameVN,
                hasAttendanced: x.hasAttendanced ? 'Yes' : 'No',
                hasCheckHomework: x.hasCheckHomework ? 'Yes' : 'No',
                hasReported: x.hasReported,
                level: x.level,
                levelID: x.levelID,
                levelVN: x.levelVN,
                scheduleID: x.scheduleID,
                scheduleTime: x.scheduleTime,
                statusLessonReport: x.statusLessonReport ? x.statusLessonReport : 'NONE',
                teacher: x.teacher,
                teacherAssistant1: x.teacherAssistant1,
                teacherAssistant1ID: x.teacherAssistant1ID,
                teacherAssistant2: x.teacherAssistant2,
                teacherAssistant2ID: x.teacherAssistant2ID,
                teacherID: x.teacherID,
                weekDay: x.weekDay,
              })
            })
            this.isChooseDate = false
          }
        })
      this.isLoading = false
    },
    async prevDate() {
      this.isChooseDate = true
      var yearOfPrevDate = this._dayjs(this.date).format('YYYY')
      var monthOfPrevDate = this._dayjs(this.date).format('MM')
      var dateOfPrevDate = this._dayjs(this.date).format('DD')
      if (dateOfPrevDate != '01') {
        this.date =
          yearOfPrevDate + '-' + monthOfPrevDate + '-' + this.checkTime(dateOfPrevDate - 1)
        this.weekDay = new Date(this.date).getDay()
        this.dayOfWeek = this.formatWeekDay(this.weekDay)
      } else if (dateOfPrevDate == '01' && monthOfPrevDate == '01') {
        this.date = yearOfPrevDate - 1 + '-' + '12' + '-' + '31'
        this.weekDay = new Date(this.date).getDay()
        this.dayOfWeek = this.formatWeekDay(this.weekDay)
      } else {
        this.date =
          yearOfPrevDate +
          '-' +
          this.checkTime(monthOfPrevDate - 1) +
          '-' +
          this.checkTime(this._dayjs(new Date(yearOfPrevDate, monthOfPrevDate - 1, 0)).format('DD'))
        this.weekDay = new Date(this.date).getDay()
        this.dayOfWeek = this.formatWeekDay(this.weekDay)
      }
      this.isLoading = true
      this.classList = []
      this.isChangeDateField = false
      await class_managerment
        .getQcDailyClass(this.locationIDs, this.date, this.myUserId)
        .then(res => {
          if (res) {
            res.schedules.forEach(x => {
              this.classList.push({
                center: x.center,
                centerID: x.centerID,
                qc: x.qc,
                ec: x.ec,
                classCode: x.classCode,
                classID: x.classID,
                className: x.className,
                classShiftName: x.classShiftName,
                courseCode: x.courseCode,
                courseNameEN: x.courseNameEN,
                courseNameVN: x.courseNameVN,
                hasAttendanced: x.hasAttendanced ? 'Yes' : 'No',
                hasCheckHomework: x.hasCheckHomework ? 'Yes' : 'No',
                hasReported: x.hasReported,
                level: x.level,
                levelID: x.levelID,
                levelVN: x.levelVN,
                scheduleID: x.scheduleID,
                scheduleTime: x.scheduleTime,
                statusLessonReport: x.statusLessonReport ? x.statusLessonReport : 'NONE',
                teacher: x.teacher,
                teacherAssistant1: x.teacherAssistant1,
                teacherAssistant1ID: x.teacherAssistant1ID,
                teacherAssistant2: x.teacherAssistant2,
                teacherAssistant2ID: x.teacherAssistant2ID,
                teacherID: x.teacherID,
                weekDay: x.weekDay,
              })
            })
            this.isChooseDate = false
          }
        })
      this.isLoading = false
    },
    async nextDate() {
      this.isChooseDate = true
      var yearOfPrevDate = this._dayjs(this.date).format('YYYY')
      var monthOfPrevDate = this._dayjs(this.date).format('MM')
      var dateOfPrevDate = this._dayjs(this.date).format('DD')
      var biggestDateOfMonth = this._dayjs(new Date(yearOfPrevDate, monthOfPrevDate, 0)).format(
        'DD'
      )
      if (dateOfPrevDate < biggestDateOfMonth) {
        this.date =
          yearOfPrevDate +
          '-' +
          monthOfPrevDate +
          '-' +
          this.checkTime(parseInt(dateOfPrevDate) + 1)
        this.weekDay = new Date(this.date).getDay()
        this.dayOfWeek = this.formatWeekDay(this.weekDay)
      } else if (dateOfPrevDate == '31' && monthOfPrevDate == '12') {
        this.date = parseInt(yearOfPrevDate) + 1 + '-' + '01' + '-' + '01'
        this.weekDay = new Date(this.date).getDay()
        this.dayOfWeek = this.formatWeekDay(this.weekDay)
      } else {
        this.date =
          yearOfPrevDate + '-' + this.checkTime(parseInt(monthOfPrevDate) + 1) + '-' + '01'
        this.weekDay = new Date(this.date).getDay()
        this.dayOfWeek = this.formatWeekDay(this.weekDay)
      }
      this.isLoading = true
      this.classList = []
      this.isChangeDateField = false
      await class_managerment
        .getQcDailyClass(this.locationIDs, this.date, this.myUserId)
        .then(res => {
          if (res) {
            res.schedules.forEach(x => {
              this.classList.push({
                center: x.center,
                centerID: x.centerID,
                qc: x.qc,
                ec: x.ec,
                classCode: x.classCode,
                classID: x.classID,
                className: x.className,
                classShiftName: x.classShiftName,
                courseCode: x.courseCode,
                courseNameEN: x.courseNameEN,
                courseNameVN: x.courseNameVN,
                hasAttendanced: x.hasAttendanced ? 'Yes' : 'No',
                hasCheckHomework: x.hasCheckHomework ? 'Yes' : 'No',
                hasReported: x.hasReported,
                level: x.level,
                levelID: x.levelID,
                levelVN: x.levelVN,
                scheduleID: x.scheduleID,
                scheduleTime: x.scheduleTime,
                statusLessonReport: x.statusLessonReport ? x.statusLessonReport : 'NONE',
                teacher: x.teacher,
                teacherAssistant1: x.teacherAssistant1,
                teacherAssistant1ID: x.teacherAssistant1ID,
                teacherAssistant2: x.teacherAssistant2,
                teacherAssistant2ID: x.teacherAssistant2ID,
                teacherID: x.teacherID,
                weekDay: x.weekDay,
              })
            })
            this.isChooseDate = false
          }
        })
      this.isLoading = false
    },
    back() {
      window.history.back()
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped></style>
