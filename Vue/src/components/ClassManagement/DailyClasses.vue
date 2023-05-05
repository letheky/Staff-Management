<template>
  <div id="course-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <div
            v-if="$route.name === 'class-management-daily-classes'"
            class="d-flex justify-space-between"
          >
            <h2 class="mb-10">Daily Classes</h2>
            <v-btn color="primary" v-show="loginAccountTypeId === 5" @click="viewAllClass()"
              >View all class</v-btn
            >
          </div>
          <div class="d-flex justify-space-between" v-else>
            <h2 class="mb-10">QC Daily classes</h2>
            <v-btn color="primary" @click="viewAllClass()">View all class</v-btn>
          </div>
          <v-row style="margin-bottom: 5px">
            <v-col md="5">
              <div class="d-flex align-center">
                <v-btn text color="secondary" @click="prevDate">
                  <v-icon> mdi-chevron-left </v-icon>
                </v-btn>
                <v-btn outlined color="secondary" @click="setToday"> Today </v-btn>
                <v-btn text color="secondary" @click="nextDate">
                  <v-icon> mdi-chevron-right </v-icon>
                </v-btn>
                <v-select
                  v-model="locationIDs"
                  v-show="loginAccountTypeId === 5"
                  item-text="location"
                  append-icon="keyboard_arrow_down"
                  item-value="locationID"
                  :items="centerList"
                  label="Center"
                  outlined
                  multiple
                  :class="'select-input'"
                  @change="selectLocation"
                  dense
                ></v-select>
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
            hide-default-header
            :items="filtered"
            hide-default-footer
            :page.sync="page"
            :items-per-page="itemsPerPage"
            @page-count="pageCount = $event"
            class="elevation-0 spendingTable"
            fixed-header
            height="65vh"
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
                    :style="
                      'width:' +
                      header.width +
                      '; min-width:' +
                      header.width +
                      ';' +
                      'color: #ffff !important;' +
                      ';' +
                      'background-color: #0b2585 !important;'
                    "
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
            <template v-slot:item="{ item }">
              <tr>
                <td>{{ item.center }}</td>
                <td :class="' link'" @click="viewDetailClass(item.classID)">
                  <p :class="'w-120'">{{ item.classCode }}</p>
                </td>
                <td>
                  <p>{{ item.weekDay }}</p>
                </td>
                <td>{{ item.scheduleTime }}</td>
                <td>
                  <p style="text-align: center">{{ item.roomName }}</p>
                </td>

                <td>
                  <p style="text-align: center">{{ item.nbrStu }}</p>
                </td>
                <td :class="'  link'" @click="viewProfileByUserId(item.teacher_userID)">
                  {{ item.teacher }}
                </td>
                <td
                  :class="'  link'"
                  @click="
                    viewProfileByUserId(
                      item.teacherAssistant1_userID != null
                        ? item.teacherAssistant1_userID
                        : item.teacherAssistant2_userID
                    )
                  "
                >
                  {{ item.teacherAssistant1 }}
                </td>
                <td :class="'  link'" @click="viewProfileByUserId(item.qC_userID)">
                  {{ item.qc }}
                </td>
                <td :class="'  link'" @click="viewProfileByUserId(item.eC_userID)">
                  {{ item.ec }}
                </td>
                <td>
                  <div v-if="item.statusLessonReport == 'APPROVED'" class="d-flex justify-center">
                    <v-icon color="#0FA958"> mdi-checkbox-marked-circle </v-icon>
                  </div>
                  <div
                    v-else-if="item.statusLessonReport == 'INPROGRESS'"
                    class="d-flex justify-center"
                  >
                    <v-icon color="#EB9516"> mdi-dots-horizontal-circle </v-icon>
                  </div>
                  <div
                    v-else-if="item.statusLessonReport == 'REJECTED'"
                    class="d-flex justify-center"
                  >
                    <v-icon color="#EC1C24"> mdi-close-circle </v-icon>
                  </div>
                  <div v-else-if="item.statusLessonReport == 'NONE'" class="d-flex justify-center">
                    <v-icon color="#C4C4C4">mdi-checkbox-blank-circle</v-icon>
                  </div>
                </td>
                <td>
                  <div v-if="item.hasAttendanced == 'Yes'" class="d-flex justify-center">
                    <v-icon color="#0FA958"> mdi-checkbox-marked-circle </v-icon>
                  </div>
                  <div v-else class="d-flex justify-center">
                    <v-icon color="#C4C4C4">mdi-checkbox-blank-circle</v-icon>
                  </div>
                </td>
                <td>
                  <div v-if="item.hasCheckHomework == 'Yes'" class="d-flex justify-center">
                    <v-icon color="#0FA958"> mdi-checkbox-marked-circle </v-icon>
                  </div>
                  <div v-else class="d-flex justify-center">
                    <v-icon color="#C4C4C4">mdi-checkbox-blank-circle</v-icon>
                  </div>
                </td>
                <td>
                  <div class="d-flex align-center actionIcon">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <img
                          v-bind="attrs"
                          v-on="on"
                          :style="{ width: '18px' }"
                          @click="viewLessonDetail(item.classID, item.scheduleID)"
                          src="../../assets/images/carbon_view.svg"
                          alt=""
                        />

                        <!-- <i
                          v-bind="attrs"
                          v-on="on"
                          @click="viewLessonDetail(item.classID, item.scheduleID)"
                          class="cursor isax isax-eye fs-18 font-weight-bold mr-4 gray"
                        ></i> -->
                      </template>
                      <span>View lesson detail</span>
                    </v-tooltip>
                    <v-tooltip
                      v-if="item.statusLessonReport === '' || item.statusLessonReport === 'NONE'"
                      top
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <img
                          v-bind="attrs"
                          v-on="on"
                          :style="{ width: '18px' }"
                          @click="createLessonReport(item.classID, item.scheduleID)"
                          src="../../assets/images/CalendarCheck.svg"
                          alt=""
                        />
                        <!-- <i
                          v-bind="attrs"
                          v-on="on"
                          @click="createLessonReport(item.classID, item.scheduleID)"
                          class="cursor isax isax-card-edit fs-18 font-weight-bold mr-4"
                        ></i> -->
                      </template>
                      <span>Create lesson report</span>
                    </v-tooltip>
                    <v-tooltip v-else top>
                      <template v-slot:activator="{ on, attrs }">
                        <img
                          v-bind="attrs"
                          v-on="on"
                          :style="{ width: '18px' }"
                          @click="viewLessonReport(item.classID, item.scheduleID)"
                          src="../../assets/images/icon-viewLession.svg"
                          alt=""
                        />
                        <!-- <i
                          v-bind="attrs"
                          v-on="on"
                          @click="viewLessonReport(item.classID, item.scheduleID)"
                          class="cursor isax isax-card-edit fs-18 font-weight-bold mr-4"
                        ></i> -->
                      </template>
                      <span>View lesson Report</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <img
                          v-bind="attrs"
                          v-on="on"
                          :style="{ width: '18px' }"
                          @click="takeAttendance(item.classID, item.scheduleID)"
                          src="../../assets/images/Group.svg"
                          alt=""
                        />
                        <!-- <i
                          v-bind="attrs"
                          v-on="on"
                          v-if="haveAttendancePermission"
                          @click="takeAttendance(item.classID, item.scheduleID)"
                          class="cursor isax isax-calendar-tick fs-18 font-weight-bold mr-4"
                        ></i> -->
                      </template>
                      <span>Take attendance</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <img
                          v-bind="attrs"
                          v-on="on"
                          v-if="item.note === '' || item.note === null || item.note === undefined"
                          :style="{ width: '18px' }"
                          @click="openEditNote(item)"
                          src="../../assets/images/notes (1).svg"
                          alt=""
                        />
                        <img
                          v-bind="attrs"
                          v-on="on"
                          v-else
                          :style="{ width: '18px' }"
                          @click="openEditNote(item)"
                          src="../../assets/images/notes.svg"
                          alt=""
                        />
                      </template>
                      <span v-if="item.note === '' || item.note === null || item.note === undefined"
                        >Create note</span
                      >
                      <span v-else>View note</span>
                    </v-tooltip>
                  </div>
                  <div v-show="overlay" :class="'h'">
                    <div class="card-i">
                      <v-card :style="{ boxShadow: 'none' }" light>
                        <v-card-title class="text-h5" :style="{ fontWeight: 700 }">
                          Lesson notes
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
                </td>
              </tr>
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
    <!-- <v-row justify="center">
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
    </v-row> -->
  </div>
</template>

<script>
import { class_managerment } from '@/api/class-management.js'
// import Multiselect from "vue-multiselect";
import dayjs from 'dayjs'
import message from '@/components/Utils/message'

import Autocomplete from '@/components/Utils/Autocomplete.vue'
import { center_managerment } from '@/api/center-management'
export default {
  components: {
    Autocomplete,
    // Multiselect,
  },
  data() {
    return {
      noteText: '',
      isEdit: false,
      btn: true,
      listLocation: [],
      listUser: [],
      dialog: false,
      note: '',
      overlay: false,
      someValue: true,
      // vale: 'Bạn có thể dễ dàng điền vào toàn bộ chú giải côngf cụ của mình vì tôi đề cập rằng có những thẻ không được sử dụng ở đây, nó được làm trên trang tính có thể được lấp đầy với thẻ span bên trong span Bất cứ điều gì bạn muốn viết, bạn có thể ...',
      // colors: [
      //   '#ffccc7',
      //   '#ffd8bf',
      //   '#ffe7ba',
      //   '#f4ffb8',
      //   '#b5f5ec',
      //   '#bae7ff',
      //   '#efdbff',
      //   '#ffd6e7',
      //   '#fdc2fd',
      //   '#c7eea4',
      //   '#fff1b8',
      //   '#FF85C0',
      //   '#5CDBD3',
      //   '#668AFF',
      //   '#B26AFF',
      //   '#FFF455',
      //   '#8CFF49',
      //   '#FF7875',
      //   '#FF8D87',
      //   '#DDFA76',
      //   '#FFE17E',
      // ],
      items: [
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' },
      ],
      isLoading: false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      headers: [
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
          text: 'Room',
          value: 'roomName',
          sortable: false,
        },
        {
          text: 'Students',
          value: 'nbrStu',
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
      isCall: false,
      myUserName: JSON.parse(localStorage.getItem('currentUser')).userInfo.fullName,
      filters: {
        classCode: [],
        center: [],
        qc: [],
        ec: [],
        roomName: [],
        classShiftName: [],
        teacher: [],
        student: [],
        statusLessonReport: [],
        hasAttendanced: [],
        hasCheckHomework: [],
        weekDay: [],
        nbrStu: [],
        teacherAssistant1: [],
        scheduleTime: [],
      },
      date: '',
      weekDay: '',
      dayOfWeek: '',
      currentYear: localStorage.getItem('dateOfDailyClasses')
        ? new Date(localStorage.getItem('dateOfDailyClasses')).getFullYear()
        : new Date().getFullYear(),
      currentMonth: localStorage.getItem('dateOfDailyClasses')
        ? new Date(localStorage.getItem('dateOfDailyClasses')).getMonth() + 1
        : new Date().getMonth() + 1,
      currentDate: localStorage.getItem('dateOfDailyClasses')
        ? new Date(localStorage.getItem('dateOfDailyClasses')).getDate()
        : new Date().getDate(),
      isChooseDate: false,
      centerList: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
      locationIDs: [],
      studentAttendancePermission: process.env.VUE_APP_ENV_FUNCTION_STUDENT_ATTENDANCE,
      functionRole:
        localStorage.getItem('functionRole') != null
          ? JSON.parse(localStorage.getItem('functionRole'))
          : [],
      haveAttendancePermission: false,
      dateOfDailyClasses: localStorage.getItem('dateOfDailyClasses'),
      isBackFromDetailDailyClasses: localStorage.getItem('isBackFromDetailDailyClasses') || null,
      isChangeDateField: false,
      errorDialog: false,
      nameRoute: '',
      message: message,
      loginAccountTypeId: 0,
      userID: JSON.parse(localStorage.getItem('currentUser')).userInfo.userID,
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
  update() {
    if (this.nameRoute === '') {
      this.nameRoute = this.$route.name
    } else {
      if (this.nameRoute !== this.$route.name) {
        this.nameRoute = this.$route.name
        location.reload()
      }
    }
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
    let dateLocalDaily = localStorage.getItem('dateOfDailyClasses')
    if (dateLocalDaily) this.date = dateLocalDaily
    else this.setToday()
    this.locationIDs = [parseInt(localStorage.getItem('currentCenter'))]

    this.centerList.forEach(x => {
      this.loginAccountTypeId = x.accountTypeID
    })

    if (localStorage.getItem('dailyClassCenterSearch')) {
      this.locationIDs = JSON.parse(localStorage.getItem('dailyClassCenterSearch'))
    }

    if (this.centerList.length === 1) {
      this.centerList.forEach(x => {
        this.locationIDs.push(x.locationID)
      })
    }
    if (localStorage.getItem('filterDailyClass')) {
      this.filters = JSON.parse(localStorage.getItem('filterDailyClass'))
    }
    if (
      this.loginAccountTypeId === 4 ||
      this.functionRole.filter(
        x =>
          (x.functionID == this.studentAttendancePermission && x.cModify == true) ||
          (x.functionID == this.studentAttendancePermission && x.cFull == true)
      ).length
    ) {
      this.haveAttendancePermission = true
    }
  },
  watch: {
    date: async function (value) {
      if (value) {
        localStorage.setItem('dateOfDailyClasses', this.date)
        this.isLoading = true
        this.weekDay = new Date(this.date).getDay()
        this.dayOfWeek = this.formatWeekDay(this.weekDay)
        this.init()
        this.isLoading = false
      }
    },
    locationIDs: function () {},
    listLocation: () => {},
    $route() {
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
      let dateLocalDaily = localStorage.getItem('dateOfDailyClasses')
      if (dateLocalDaily) this.date = dateLocalDaily
      else this.setToday()
      this.locationIDs = [parseInt(localStorage.getItem('currentCenter'))]

      this.centerList.forEach(x => {
        this.loginAccountTypeId = x.accountTypeID
      })

      if (localStorage.getItem('dailyClassCenterSearch')) {
        this.locationIDs = JSON.parse(localStorage.getItem('dailyClassCenterSearch'))
      }

      if (this.centerList.length === 1) {
        this.centerList.forEach(x => {
          this.locationIDs.push(x.locationID)
        })
      }
      if (localStorage.getItem('filterDailyClass')) {
        this.filters = JSON.parse(localStorage.getItem('filterDailyClass'))
      }
      if (
        this.loginAccountTypeId === 4 ||
        this.functionRole.filter(
          x =>
            (x.functionID == this.studentAttendancePermission && x.cModify == true) ||
            (x.functionID == this.studentAttendancePermission && x.cFull == true)
        ).length
      ) {
        this.haveAttendancePermission = true
      }
      this.getSchedules()
    },
  },
  methods: {
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
      localStorage.setItem('filterDailyClass', JSON.stringify(this.filters))
    },
    saveNote() {
      class_managerment.updateNote(this.noteText, this.scheduleIDEdit)
      this.init()
    },
    btn_Edit() {
      this.isEdit = true
      // this.someValue = !this.someValue
    },
    openEditNote(item) {
      if (item.note == null || item.note == '' || item.note === undefined) this.isEdit = true
      else this.isEdit = false
      this.overlay = true
      this.scheduleIDEdit = item.scheduleID
      this.noteText = item.note
    },
    selectLocation(value) {
      localStorage.setItem('dailyClassCenterSearch', JSON.stringify(value))
      this.init()
    },
    viewLessonDetail(classID, scheduleID) {
      this.$router.push({
        name: 'my-calendar-class-name-view-lesson-detail',
        query: { classID: classID, scheduleID: scheduleID },
      })
    },
    viewDetailTeacherAndQc(userId) {
      const userView = this.listUser.find(user => user.teacherID === userId)

      if (userId === 0 || userId === null || userId === '') {
        return
      } else {
        this.$router.push({
          name: 'account-management-view-account',
          params: {
            userId: userView !== undefined ? userView.userID : '',
          },
        })
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
    async getTeacherScheduleInDays() {
      let dateTime = this.date
      if (this.date === undefined) {
        dateTime = new Date().toISOString().split('T')[0]
        this.date = dateTime
      }

      await class_managerment
        .getTeacherScheduleInDays(this.userID, dateTime)
        .then(res => {
          if (res && !res.errors) {
            const classList = []
            res.schedules.forEach(x => {
              classList.push({
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
                nbrStu: x.nbrStu,
                qc: x.qc,
                qcid: x.qcid,
                ec: x.ec,
                ecid: x.ecid,
                roomName: x.roomName,
                teacherAssistant1: x.teacherAssistant1,
                teacherAssistant1ID: x.teacherAssistant1ID,
                teacherAssistant2: x.teacherAssistant2,
                teacherAssistant2ID: x.teacherAssistant2ID,
                teacherID: x.teacherID,
                weekDay: x.weekDay,
                note: x.note,
                teacher_userID: x.teacher_userID,
                teacherAssistant1_userID: x.teacherAssistant1_userID,
                teacherAssistant2_userID: x.teacherAssistant2_userID,
                qC_userID: x.qC_userID,
                eC_userID: x.eC_userID,
              })
            })
            this.classList = classList
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
    async getStaffScheduleInDays() {
      const listLocationCheck =
        this.locationIDs.length == 0
          ? this.centerList.map(item => item.locationID)
          : this.locationIDs
      let dateTime = this.date
      if (this.date === undefined) {
        dateTime = new Date().toISOString().split('T')[0]
        this.date = dateTime
      }
      await class_managerment
        .getScheduleInDays(listLocationCheck, dateTime)
        .then(res => {
          if (res && !res.errors) {
            const classList = []
            res.schedules.forEach(x => {
              classList.push({
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
                roomName: x.roomName,
                scheduleTime: x.scheduleTime,
                statusLessonReport: x.statusLessonReport ? x.statusLessonReport : 'NONE',
                teacher: x.teacher,
                nbrStu: x.nbrStu,
                qc: x.qc,
                qcid: x.qcid,
                ecid: x.ecid,
                ec: x.ec,
                teacherAssistant1: x.teacherAssistant1,
                teacherAssistant1ID: x.teacherAssistant1ID,
                teacherAssistant2: x.teacherAssistant2,
                teacherAssistant2ID: x.teacherAssistant2ID,
                teacherID: x.teacherID,
                weekDay: x.weekDay,
                note: x.note,
                teacher_userID: x.teacher_userID,
                teacherAssistant1_userID: x.teacherAssistant1_userID,
                teacherAssistant2_userID: x.teacherAssistant2_userID,
                qC_userID: x.qC_userID,
                eC_userID: x.eC_userID,
              })
            })
            this.classList = classList
            this.isChooseDate = false
          } else {
            this.errorDialog = true
          }
        })
        .catch(() => {
          this.errorDialog = true
        })
    },
    async getSchedulesByQc() {
      const listLocationCheck =
        this.locationIDs.length == 0
          ? this.centerList.map(item => item.locationID)
          : this.locationIDs
      let dateTime = this.date
      if (this.date === undefined) {
        dateTime = new Date().toISOString().split('T')[0]
        this.date = dateTime
      }
      await class_managerment
        .getQcDailyClass(listLocationCheck, dateTime, this.myUserName)
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
                roomName: x.roomName,
                statusLessonReport: x.statusLessonReport ? x.statusLessonReport : 'NONE',
                teacher: x.teacher,
                nbrStu: x.nbrStu,
                qc: x.qc,
                qcid: x.qcid,
                ecid: x.ecid,
                ec: x.ec,
                teacherAssistant1: x.teacherAssistant1,
                teacherAssistant1ID: x.teacherAssistant1ID,
                teacherAssistant2: x.teacherAssistant2,
                teacherAssistant2ID: x.teacherAssistant2ID,
                teacherID: x.teacherID,
                weekDay: x.weekDay,
                note: x.note,
                teacher_userID: x.teacher_userID,
                teacherAssistant1_userID: x.teacherAssistant1_userID,
                teacherAssistant2_userID: x.teacherAssistant2_userID,
                qC_userID: x.qC_userID,
                eC_userID: x.eC_userID,
              })
            })
            this.isChooseDate = false
          }
        })
    },
    getSchedules() {
      if (this.$route.name === 'qc-daily-class') {
        this.getSchedulesByQc()
      } else {
        if (this.loginAccountTypeId === 5) this.getStaffScheduleInDays()
        else if (this.loginAccountTypeId === 4) this.getTeacherScheduleInDays()
      }
    },
    async init() {
      this.overlay = false
      this.isLoading = true
      this.isChangeDateField = false
      this.classList = []
      this.weekDay = new Date(this.date).getDay()
      this.dayOfWeek = this.formatWeekDay(this.weekDay)
      await center_managerment.getAllCenter().then(res => {
        this.listLocation = [{ location: 'None', locationID: 0 }, ...res]
      })
      await this.getSchedules()

      this.isLoading = false
    },
    noteOnChange(value) {
      this.noteText = value
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
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
    lessonNotes(classID, scheduleID) {
      localStorage.setItem('dateOfDailyClasses', this.date)
      localStorage.removeItem('isBackFromDetailDailyClasses')
      this.$router.push({
        name: 'class-management-lesson-notes',
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
      this.date = new Date().toISOString().split('T')[0]
      this.checkTime(this.currentDate)

      this.weekDay = new Date().getDay()
      this.dayOfWeek = this.formatWeekDay(this.weekDay)
      this.isLoading = true
      this.classList = []
      this.isChangeDateField = false
      await this.getSchedules()
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
      await this.getSchedules()
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
      await this.getSchedules()
      this.isLoading = false
    },
    back() {
      window.history.back()
    },
    _dayjs: dayjs,
  },
}
</script>
<style>
.actionIcon img {
  margin-left: 10px;
}
.select-input {
  margin-right: 5px;
}
.select-input input {
  width: 130px;
}
.reds {
  background-color: #ffccc7;
}

.ml {
  background-color: #ffd8bf;
}

.q2 {
  background-color: #ffe7ba;
}

.link {
  cursor: pointer;
  color: #427df2 !important;
}

.link:hover {
  text-decoration: underline;
  font-weight: 700;
}

.text-start {
  padding: 0 !important;
}

.abc {
  margin: 10px !important;
}

.btnNote {
  float: right;
  margin-top: 20px;
}
.note-card {
  box-shadow: none !important;
}
.btnNote button {
  margin-left: 20px;
  min-width: 150px !important;
}

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
.text-start {
  padding: 0 16px !important;
}
.spendingTable tbody tr:nth-child(odd) {
  background-color: #eaf1ff;
}
</style>
