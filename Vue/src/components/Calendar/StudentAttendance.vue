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
            <h3 class="pa-5">
              Attendance for ({{ classCode }}) from {{ classTime }} on {{ dayOfWeek }},
              {{ date }}
            </h3>
          </div>
          <v-divider></v-divider>
          <div class="pt-5 pb-2">
            <span v-if="students.length != 1">Total: {{ students.length }} students</span>
            <span v-else>Total: {{ students.length }} student</span>
          </div>
          <div class="attendance-button mb-2" @click="attendanceAll()">Attendance all</div>
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

              <template v-slot:[`item.attendanceStatus`]="{ item }"
                ><v-radio-group class="mt-0" v-model="item.attendanceStatus" hide-details row>
                  <v-radio
                    on-icon="mdi-checkbox-marked-circle"
                    color="secondary"
                    label="Attendance"
                    value="Attended"
                  ></v-radio>
                  <v-radio
                    on-icon="mdi-checkbox-marked-circle"
                    color="secondary"
                    label="Absent"
                    value="Absent"
                  ></v-radio>
                </v-radio-group>
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
      //   page: 1,
      //   pageCount: 0,
      //   itemsPerPage: 20,
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
        {
          text: 'Status',
          value: 'attendanceStatus',
          sortable: false,
        },
      ],
      students: [],
      ordinalNo: '',
      checkSuccess: false,
      status: '',
      classCode: '',
      classTime: '',
      date: '',
      dayOfWeek: '',
      dialog: false,
      errorDialog: false,
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
      this.students.forEach(x => {
        x.attendanceStatus = 'Attended'
      })
    },
    async save() {
      this.params = []
      console.log(this.students)
      this.students.forEach(x => {
        this.params.push({
          studentID: x.studentID,
          registrationID: x.registrationID,
          ordinalNo: parseInt(x.ordinalNo),
          isJoinToLesson: x.attendanceStatus == 'Attended' ? true : false,
        })
      })
      const body = {
        students: this.params,
      }
      await class_managerment
        .updateAttendanceStudent(this.classID, this.scheduleID, body)
        .then(res => {
          if (res) {
            this.dialog = true
            this.checkSuccess = true
            setTimeout(() => {
              this.checkSuccess = false
              this.$router.push({
                name: 'class-management-detail',
                query: { classID: this.classID, scheduleID: this.scheduleID },
              })
            }, 2000)
            this.dialog = false
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
