<template>
  <div id="center-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <div>
            <h2 class="d-flex">
              <!-- <v-icon @click="back()">arrow_back_ios</v-icon> -->
              <div class="d-flex align-center">Student Attendance</div>
            </h2>
            <h3 class="pa-5">
              Attendance for ({{ classCode }}) from {{ classTime.substring(0, 5) }} -
              {{ classTime.substring(6, classTime.length) }} on
              {{
                weekDay == 'Mon'
                  ? 'Monday'
                  : weekDay == 'Tue'
                  ? 'Tuesday'
                  : weekDay == 'Wed'
                  ? 'Wednesday'
                  : weekDay == 'Thu'
                  ? 'Thursday'
                  : weekDay == 'Fri'
                  ? 'Friday'
                  : weekDay == 'Sat'
                  ? 'Saturday'
                  : weekDay == 'Sun'
                  ? 'Sunday'
                  : ''
              }}
              {{ _dayjs(date).format('DD/MM/YYYY') }} in room {{ room }}
            </h3>
          </div>
          <v-divider></v-divider>
          <div class="d-flex justify-space-between">
            <div class="pt-5 pb-4">Total: {{ students.length }} students</div>
            <div class="pt-5 pb-4">
              <v-btn @click="takeAttendance()" color="secondary">Take attendance</v-btn>
            </div>
          </div>
          <div class="pb-10">
            <v-progress-linear
              v-if="isLoading"
              indeterminate
              color="primary"
              class="my-10"
            ></v-progress-linear>
            <v-data-table
              v-if="!isLoading"
              :headers="headers"
              :items="students"
              :page.sync="page"
              :items-per-page="itemsPerPage"
              hide-default-footer
              @page-count="pageCount = $event"
              class="elevation-1"
            >
              <template v-slot:[`item.no`]="{ index }">
                {{ index + 1 }}
              </template>

              <template v-slot:[`item.status`]="{ item }">
                <v-chip v-if="item.attendanceStatus == 'Attended'" small text-color="green">{{
                  item.attendanceStatus
                }}</v-chip>
                <v-chip v-else small text-color="red">{{ item.status }}</v-chip>
              </template>
            </v-data-table>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-footer fixed absolute height="60" color="#fff" class="pl-10 pr-10">
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
        <v-col class="d-flex justify-end">
          <v-pagination v-model="page" :length="pageCount" elevation="0"></v-pagination>
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { class_managerment } from '@/api/class-management.js'
// const querystring = require("querystring");

export default {
  components: {},
  data() {
    return {
      isLoading: false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      classID: this.$route.query.classID,
      scheduleID: this.$route.query.scheduleID,
      headers: [
        {
          text: 'No',
          align: 'start',
          value: 'no',
          sortable: false,
        },
        {
          text: 'Student code',
          value: 'studentCode',
          sortable: false,
        },
        { text: 'Student Name', value: 'fullName', sortable: false },
        {
          text: 'Attendance',
          value: 'attendanceStatus',
          sortable: false,
        },
        {
          text: 'Homework',
          value: 'homeworkStatus',
          sortable: false,
        },
        {
          text: 'Note',
          value: 'teacherComment',
          sortable: false,
        },
      ],
      //   currentUser: JSON.parse(localStorage.getItem("currentUser")),
      //   currentCenter: JSON.parse(localStorage.getItem("currentCenter")),
      students: [],
      classCode: '',
      classTime: '',
      weekDay: '',
      room: '',
      date: '',
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      this.isLoading = true
      await class_managerment.getStudentAttendance(this.scheduleID).then(res => {
        if (res) {
          this.students = res.studentRegistedBySchedules
          // res.studentAttendances.forEach((x) => {
          //   this.classCode = x.classCode;
          //   this.classTime = x.classTime;
          //   this.weekDay = x.weekDay;
          //   this.room = x.room;
          //   this.date = x.date;
          // });
        }
      })
      this.isLoading = false
    },
    takeAttendance() {
      this.$router.push({
        name: 'class-management-take-attendance-student',
        query: {
          classID: this.classID,
          scheduleID: this.scheduleID,
        },
      })
    },
    back() {
      window.history.back()
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped></style>
