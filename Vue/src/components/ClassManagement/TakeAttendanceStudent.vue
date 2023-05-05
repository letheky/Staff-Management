<template>
  <div id="center-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <div>
            <h2 class="d-flex">
              <v-icon @click="back()">arrow_back_ios</v-icon>
              <div class="d-flex align-center">Student Attendance</div>
            </h2>
            <div class="success">
              <v-alert
                :value="checkSuccess"
                transition="scale-transition"
                type="success"
                style="font-size: 14px; padding: 12px"
              >
                Update attendance successfully!
              </v-alert>
            </div>
            <h3 class="pt-3 pb-2">
              Attendance for ({{ classCode }}) from {{ classTime }} on {{ dayOfWeek }}, {{ date }}
            </h3>
          </div>
          <v-divider></v-divider>
          <div class="d-flex align-center mb-2 mt-2">
            <div>
              <span v-if="students.length > 1">Total: {{ students.length }} students</span>
              <span v-else>Total: {{ students.length }} student</span>
            </div>
            <div class="attendance-button pl-10" @click="attendanceAll()">Attendance all</div>
            <div class="attendance-button pl-10" @click="homeworkAll()">Homework all</div>
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
              :items-per-page="100"
              hide-default-footer
              class="elevation-1"
              fixed-header
            >
              <template v-slot:[`item.no`]="{ index }">
                {{ index + 1 }}
              </template>

              <template v-slot:[`item.photo`]="{ item }">
                <v-avatar size="60">
                  <img class="pa-2" v-if="!item.photo" src="@/assets/images/ImageProfile.jpg" />
                  <img v-else :src="item.photo" />
                </v-avatar>
              </template>

              <template v-slot:[`item.attendanceStatus`]="{ item }">
                <div class="d-flex align-center">
                  <v-checkbox
                    :off-icon="'$radioOff'"
                    on-icon="mdi-checkbox-marked-circle"
                    color="secondary"
                    label="Attendance"
                    value="Attended"
                    class="mr-3"
                    v-model="item.attendanceStatus"
                  >
                  </v-checkbox>
                  <v-checkbox
                    :off-icon="'$radioOff'"
                    on-icon="mdi-checkbox-marked-circle"
                    color="secondary"
                    label="Absent"
                    value="Absent"
                    v-model="item.attendanceStatus"
                  >
                  </v-checkbox>
                </div>
              </template>

              <template v-slot:[`item.homeworkStatus`]="{ item }">
                <div class="d-flex align-center">
                  <v-checkbox
                    :off-icon="'$radioOff'"
                    v-model="item.homeworkStatus"
                    class="mr-3"
                    on-icon="mdi-checkbox-marked-circle"
                    label="Yes"
                    color="secondary"
                    value="Yes"
                  ></v-checkbox>
                  <v-checkbox
                    :off-icon="'$radioOff'"
                    v-model="item.homeworkStatus"
                    on-icon="mdi-checkbox-marked-circle"
                    label="No"
                    value="No"
                    color="secondary"
                  ></v-checkbox>
                </div>
              </template>
            </v-data-table>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-footer fixed absolute height="60" color="#fff" class="pl-8 pr-8">
      <v-col md="12">
        <div class="d-flex justify-end">
          <div>
            <v-btn
              color="secondary"
              @click="
                dialog = true
                save()
              "
              >Save</v-btn
            >
          </div>
        </div>
      </v-col>
    </v-footer>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent width="350">
        <v-card class="mx-auto pa-10">
          <div class="text-center">
            <v-btn
              elevation="0"
              height="36"
              class="pl-4 pr-4 mr-3 mb-5"
              :loading="dialog"
              style="background: white"
            >
            </v-btn>
          </div>
          <div class="text-center">
            <b style="font-size: 1.5rem">Saving!</b><br />
            <span>Please wait...</span>
          </div>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="errorDialog" persistent width="350">
        <v-card class="mx-auto pa-6">
          <div class="text-center">
            <h1>Error!</h1>
            <p>This class has no students!</p>
          </div>
          <div class="text-center pt-4">
            <v-btn color="error" elevation="0" @click="back()" outlined> Back </v-btn>
          </div>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import dayjs from 'dayjs'
// import { teacher_information } from "@/api/teacher-information.js";
import { class_managerment } from '@/api/class-management.js'

export default {
  components: {},
  data() {
    return {
      isLoading: false,
      scheduleID: this.$route.query.scheduleID,
      classID: this.$route.query.classID,
      teacherID: JSON.parse(localStorage.getItem('currentUser')).userInfo.teacherID,
      headers: [
        {
          text: 'No',
          align: 'start',
          value: 'no',
          sortable: false,
        },
        { text: 'Avatar', value: 'photo', sortable: false },
        {
          text: 'Student code',
          value: 'studentCode',
          sortable: false,
        },
        { text: 'Student Name', value: 'fullName', sortable: false },
        { text: 'Mobile phone', value: 'mobilePhone', sortable: false },
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
      ],
      students: [],
      ordinalNo: '',
      checkSuccess: false,
      params: [],
      status: '',
      classCode: '',
      classTime: '',
      date: '',
      dayOfWeek: '',
      dialog: false,
      takeAttendanceFromTeacher: localStorage.getItem('takeAttendanceFromTeacher') || null,
      errorDialog: false,
      attendanceAllValue: '',
      homeworkAllValue: '',
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      this.isLoading = true
      await class_managerment.getClassScheduleDetail(this.scheduleID).then(res => {
        if (res) {
          this.classCode = res.syllabusItem.scheduleInfos.classCode
          this.classTime = res.syllabusItem.scheduleInfos.classTime
          this.date = this._dayjs(res.syllabusItem.scheduleInfos.date).format('DD/MM/YYYY')
          this.dayOfWeek = new Date(res.syllabusItem.scheduleInfos.date).getDay()
          switch (this.dayOfWeek) {
            case 0:
              this.dayOfWeek = 'Sunday'
              break
            case 1:
              this.dayOfWeek = 'Monday'
              break
            case 2:
              this.dayOfWeek = 'Tuesday'
              break
            case 3:
              this.dayOfWeek = 'Wednesday'
              break
            case 4:
              this.dayOfWeek = 'Thursday'
              break
            case 5:
              this.dayOfWeek = 'Friday'
              break
            case 6:
              this.dayOfWeek = 'Saturday'
          }
        }
      })
      await class_managerment
        .getStudentAttendance(this.scheduleID)
        .then(res => {
          if (res.studentRegistedBySchedules.length) {
            this.students = res.studentRegistedBySchedules
          } else {
            this.errorDialog = true
          }
        })
        .catch(() => {
          this.errorDialog = true
        })
      this.isLoading = false
    },
    attendanceAll() {
      if (this.attendanceAllValue == 'Attended') this.attendanceAllValue = 'Absent'
      else if (this.attendanceAllValue == 'Absent') this.attendanceAllValue = ''
      else this.attendanceAllValue = 'Attended'
      this.students.forEach(x => {
        x.attendanceStatus = this.attendanceAllValue
      })
    },
    homeworkAll() {
      if (this.homeworkAllValue == 'Yes') this.homeworkAllValue = 'No'
      else if (this.homeworkAllValue == 'No') this.homeworkAllValue = ''
      else this.homeworkAllValue = 'Yes'
      this.students.forEach(x => {
        x.homeworkStatus = this.homeworkAllValue
      })
    },
    async save() {
      this.params = []
      console.log(this.students)
      const students = []
      this.students.forEach(x => {
        students.push({
          studentID: x.studentID,
          registrationID: x.registrationID,
          ordinalNo: parseInt(x.ordinalNo),
          isJoinToLesson:
            x.attendanceStatus == 'Attended'
              ? true
              : x.attendanceStatus === null || x.attendanceStatus === ''
              ? null
              : false,
          homeworkStatus: x.homeworkStatus,
        })
      })

      const body = {
        students: students,
      }

      await class_managerment
        .updateAttendanceStudent(this.classID, this.scheduleID, body)
        .then(res => {
          if (res) {
            this.dialog = true
            this.checkSuccess = true
            this.checkSuccess = false
            localStorage.setItem('isBackFromDetailDailyClasses', true)
            window.history.back()
            // setTimeout(() => {

            // if (this.takeAttendanceFromTeacher) {
            //   this.$router.push({
            //     name: "my-calendar-daily-classes",
            //   });
            // } else {
            //   this.$router.push({
            //     name: "class-management-class-list",
            //   });
            // }
            // }, 2000);
            this.dialog = false
          }
        })
    },
    back() {
      localStorage.setItem('isBackFromDetailDailyClasses', true)
      window.history.back()
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped>
.success {
  width: 300px;
  position: absolute;
  right: 0;
  bottom: 5%;
  z-index: 999;
}

.attendance-button {
  text-decoration: underline;
  cursor: pointer;
  color: #246aff;
}
</style>
