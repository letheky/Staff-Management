<template>
  <div id="account-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 py-5">
          <h2>My Calendar</h2>
        </div>
      </v-col>
    </v-row>
    <template v-if="isLoading">
      <div class="px-10">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </div>
    </template>
    <template v-else>
      <v-row no-gutters class="fill-height">
        <v-col>
          <div class="pa-10 pt-0">
            <v-sheet height="64">
              <v-toolbar flat elevation="0">
                <v-btn text color="secondary" @click="prev">
                  <v-icon> mdi-chevron-left </v-icon>
                </v-btn>
                <v-btn outlined color="secondary" @click="setToday"> Today </v-btn>
                <v-btn text color="secondary" @click="next">
                  <v-icon> mdi-chevron-right </v-icon>
                </v-btn>
                <v-toolbar-title v-if="$refs.calendar">
                  {{ $refs.calendar.title }}
                </v-toolbar-title>
                <v-spacer></v-spacer>

                <v-btn
                  :outlined="type != 'week'"
                  :color="type == 'week' ? 'primary' : 'secondary'"
                  class="px-10 mr-3"
                  @click="type = 'week'"
                >
                  Week
                </v-btn>
                <v-btn
                  :outlined="type != 'month'"
                  :color="type == 'month' ? 'primary' : 'secondary'"
                  class="px-10"
                  @click="type = 'month'"
                >
                  Month
                </v-btn>
              </v-toolbar>
            </v-sheet>
            <v-sheet height="980">
              <v-calendar
                ref="calendar"
                v-model="focus"
                color="primary"
                :events="events"
                :event-color="getEventColor"
                event-start="startTime"
                event-end="endTime"
                event-name="className"
                :type="type"
                first-time="7:00"
                interval-count="17"
                :interval-format="intervalFormatter"
                @click:event="showEvent"
                @click:more="viewDay"
                @click:date="viewDay"
              >
                <!-- <template v-slot:event="{ event }">
                  {{ event }}
                </template> -->
              </v-calendar>
              <v-menu
                v-model="selectedOpen"
                :close-on-content-click="false"
                :activator="selectedElement"
                offset-x
              >
                <v-card min-width="350px" flat>
                  <v-toolbar flat :color="getEventColor(selectedEvent)" height="40">
                    <v-toolbar-title style="font-size: 14px" class="font-weight-bold">
                      {{ _dayjs(selectedEvent.startTime).format('DD/MM/YYYY') }}
                      : {{ selectedEvent.className }}</v-toolbar-title
                    >
                  </v-toolbar>
                  <v-card-text>
                    <!-- <div>className: {{ selectedEvent.className }}</div> -->

                    <div>Course: {{ selectedEvent.courseName }}</div>
                    <div>Room: {{ selectedEvent.room }}</div>
                    <div>
                      Time:
                      {{ _dayjs(selectedEvent.startTime).format('HH:mm') }} -
                      {{ _dayjs(selectedEvent.endTime).format('HH:mm') }}
                    </div>
                    <div>Center: {{ selectedEvent.location }}</div>
                    <div class="d-flex">
                      <v-btn
                        class="mt-2"
                        outlined
                        color="primary"
                        @click="studentAttendance(selectedEvent.classID, selectedEvent.scheduleID)"
                        >Student Attendance</v-btn
                      >
                      <v-btn
                        class="mt-2 ml-2"
                        outlined
                        color="primary"
                        @click="viewClassDetail(selectedEvent.classID)"
                        >View class detail</v-btn
                      >
                      <v-btn
                        class="mt-2 ml-2"
                        outlined
                        color="primary"
                        @click="viewLessonDetail(selectedEvent.classID, selectedEvent.scheduleID)"
                        >View lesson detail</v-btn
                      >
                      <v-btn
                        v-if="selectedEvent.statusLessonReport"
                        class="mt-2 ml-2"
                        outlined
                        color="primary"
                        @click="viewLessonReport(selectedEvent.classID, selectedEvent.scheduleID)"
                        >View lesson report</v-btn
                      >
                      <v-btn
                        v-else
                        class="mt-2 ml-2"
                        outlined
                        color="primary"
                        @click="createLessonReport(selectedEvent.classID, selectedEvent.scheduleID)"
                        >Create lesson report</v-btn
                      >
                    </div>
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-sheet>
          </div>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script>
import { class_managerment } from '@/api/class-management.js'
import dayjs from 'dayjs'
const querystring = require('querystring')

export default {
  components: {},
  data() {
    return {
      isLoading: false,
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      userID: JSON.parse(localStorage.getItem('currentUser')).userInfo.userID,
      fromDate: '',
      toDate: '',
    }
  },
  created() {},
  mounted() {
    this.$refs.calendar.checkChange()
    this.getCalendar()
  },
  methods: {
    back() {
      window.history.back()
    },
    leaveOfAbsence() {
      this.$router.push({ name: 'my-calendar-leave-of-absence-history' })
    },
    viewDay({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor(event) {
      // if (event.orgTeacherID == this.teacherID && event.teacherID != null) {
      //   return "red";
      // } else if (event.teacherID == this.teacherID) {
      //   return "blue";
      // } else {
      //   return "other";
      // }
      if (event) {
        return 'blue'
      }
    },
    setToday() {
      this.focus = ''
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => (this.selectedOpen = true)))
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    intervalFormatter(locale) {
      return locale.time
    },
    async getCalendar() {
      this.isLoading = true
      const body = {
        pUserID: this.userID,
        pFromDate: dayjs().add(-6, 'month').format('YYYY-MM-DD'),
        ptoDate: dayjs().add(6, 'month').format('YYYY-MM-DD'),
      }
      await class_managerment
        .getQCECCalendar(querystring.stringify(body))
        .then(res => {
          if (res) {
            this.events = res
          }
        })
        .catch(() => {})
      this.isLoading = false
    },
    studentAttendance(classID, scheduleID) {
      this.$router.push({
        name: 'class-management-take-attendance-student',
        query: { classID: classID, scheduleID: scheduleID },
      })
    },
    viewClassDetail(classID) {
      this.$router.push({
        name: 'class-management-detail',
        query: {
          classID: classID,
        },
      })
    },
    viewLessonDetail(classID, scheduleID) {
      this.$router.push({
        name: 'my-calendar-class-name-view-lesson-detail',
        query: { classID: classID, scheduleID: scheduleID },
      })
    },
    createLessonReport(classID, scheduleID) {
      localStorage.setItem('lessonReportRoute', this.$route.path)
      this.$router.push({
        name: 'class-management-create-lesson-report',
        query: { classID: classID, scheduleID: scheduleID },
      })
    },
    viewLessonReport(classID, scheduleID) {
      localStorage.setItem('lessonReportRoute', this.$route.path)
      this.$router.push({
        name: 'class-management-view-lesson-report',
        query: { classID: classID, scheduleID: scheduleID },
      })
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped>
header.v-sheet {
  border-bottom: 0;
}
</style>
