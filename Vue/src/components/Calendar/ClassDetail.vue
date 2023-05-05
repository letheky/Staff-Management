<template>
  <div id="lesson-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <h2 class="d-flex">
            <v-icon @click="back()">arrow_back_ios</v-icon>
            <div class="d-flex align-center">{{ classCode }}</div>
          </h2>
          <div class="pl-8 pb-10">
            <v-row>
              <v-col md="4">
                <div class="list-info">
                  <div class="item">
                    <v-row>
                      <v-col md="6">Center</v-col>
                      <v-col md="6">{{ center }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="6">Preceding class</v-col>
                      <v-col md="6">{{ precedingClass }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="6">Class admin</v-col>
                      <v-col md="6">{{ classAdmin }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="6">Customer care staff</v-col>
                      <v-col md="6">{{ customer }}</v-col>
                    </v-row>
                  </div>
                </div>
              </v-col>
              <v-col md="3">
                <div class="list-info">
                  <div class="item">
                    <v-row>
                      <v-col md="6">Class type</v-col>
                      <v-col md="6">{{ classType }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="6">Class group</v-col>
                      <v-col md="6">{{ classGroup }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="6">Start date</v-col>
                      <v-col md="6">{{ startDate }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="6">End date</v-col>
                      <v-col md="6">{{ endDate }}</v-col>
                    </v-row>
                  </div>
                </div>
              </v-col>
              <v-col md="5">
                <div class="list-info">
                  <div class="item">
                    <v-row>
                      <v-col md="4">Course name</v-col>
                      <v-col md="8">{{ level }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="4">Hours/Lesson</v-col>
                      <v-col md="8">{{ hour }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="4">Book</v-col>
                      <v-col md="8">{{ book }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="4">Note</v-col>
                      <v-col md="8">{{ note }}</v-col>
                    </v-row>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
          <v-divider style="border: 1px solid #e5e5e5"></v-divider>
          <v-tabs>
            <v-tab
              @click="
                isSchedule = true
                schedule()
              "
            >
              Schedule
            </v-tab>
            <v-tab
              @click="
                isTestAndExam = true
                testAndExam()
              "
            >
              Test and exam schedule
            </v-tab>
            <v-tab
              @click="
                isStudent = true
                listStudent()
              "
            >
              Student
            </v-tab>
          </v-tabs>
          <v-progress-linear
            v-if="isLoading"
            indeterminate
            color="primary"
            class="my-10"
          ></v-progress-linear>
          <div class="pt-3">
            <v-row>
              <v-col lg="12" md="12" sm="12" xl="12" class="pt-7 justify-space-between mb-2">
                <div>
                  <v-row v-if="isSchedule == true" no-gutters>
                    <v-col md="12" sm="12" class="pb-5 pt-5">
                      <v-progress-linear
                        v-if="isLoading"
                        indeterminate
                        color="primary"
                      ></v-progress-linear>
                      <v-data-table
                        v-if="!isLoading"
                        :headers="scheduleHeaders"
                        :items="schedules"
                        :page.sync="page"
                        :items-per-page="itemsPerPage"
                        hide-default-footer
                        @page-count="pageCount = $event"
                        :calculate-widths="calWidth"
                        class="elevation-0"
                        fixed-header
                      >
                        <template v-slot:[`item.date`]="{ item }">
                          {{ _dayjs(item.date).format('DD/MM/YYYY') }}
                        </template>

                        <template v-slot:[`item.statusLessonReport`]="{ item }">
                          <div
                            v-if="item.statusLessonReport == 'APPROVED'"
                            class="d-flex justify-center"
                          >
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
                          <div v-else-if="!item.statusLessonReport" class="d-flex justify-center">
                            <v-icon color="#C4C4C4">mdi-checkbox-blank-circle</v-icon>
                          </div>
                        </template>

                        <template v-slot:[`item.teacherAssistant`]="{ item }">
                          <div v-if="item.ta1.teacherName">
                            {{ item.ta1.teacherName }}
                          </div>
                          <div v-else>
                            {{ item.ta2.teacherName }}
                          </div>
                        </template>

                        <template v-slot:[`item.action`]="{ item }">
                          <div class="d-flex">
                            <v-tooltip top>
                              <template v-slot:activator="{ on, attrs }">
                                <i
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="viewLessonDetail(item.classID, item.scheduleID)"
                                  class="cursor isax isax-eye fs-18 font-weight-bold mr-4"
                                ></i>
                              </template>
                              <span>View lesson detail</span>
                            </v-tooltip>
                            <v-tooltip top v-if="item.hasLesssonReport">
                              <template v-slot:activator="{ on, attrs }">
                                <i
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="viewLessonReport(item.classID, item.scheduleID)"
                                  class="cursor isax isax-card-edit fs-18 font-weight-bold mr-4"
                                ></i>
                              </template>
                              <span>View lesson report</span>
                            </v-tooltip>
                            <v-tooltip top v-else>
                              <template v-slot:activator="{ on, attrs }">
                                <i
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="createLessonReport(item.classID, item.scheduleID)"
                                  class="cursor isax isax-card-edit fs-18 font-weight-bold mr-4"
                                ></i>
                              </template>
                              <span>Create lesson report</span>
                            </v-tooltip>
                          </div>
                        </template>
                      </v-data-table>
                    </v-col>
                    <div v-if="!isLoading" color="#fff" class="w-100">
                      <v-row>
                        <v-col md="3">
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
                        <v-col md="9" class="d-flex justify-end">
                          <v-pagination
                            v-model="page"
                            :length="pageCount"
                            elevation="0"
                          ></v-pagination>
                        </v-col>
                      </v-row>
                    </div>
                  </v-row>
                  <v-row v-else-if="isTestAndExam == true" no-gutters>
                    <v-col md="12">
                      <div class="pt-5">
                        <div class="pb-5">
                          <v-progress-linear
                            v-if="isLoading"
                            indeterminate
                            color="primary"
                            class="my-10"
                          ></v-progress-linear>
                          <v-data-table
                            v-if="!isLoading"
                            :headers="testAndExamHeaders"
                            :items="testAndExamList"
                            :page.sync="page"
                            :items-per-page="itemsPerPage"
                            hide-default-footer
                            @page-count="pageCount = $event"
                            class="elevation-0"
                            fixed-header
                            height="45vh"
                          >
                            <template v-slot:[`item.no`]="{ index }">
                              {{ index + 1 }}
                            </template>

                            <template v-slot:[`item.testDate`]="{ item }">
                              {{ _dayjs(item.testDate).format('DD/MM/YYYY') }}
                            </template>
                          </v-data-table>
                        </div>
                      </div>
                    </v-col>
                    <v-footer v-if="!isLoading" height="60" color="#fff" width="60%">
                      <v-row>
                        <v-col md="3">
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
                          <v-pagination
                            v-model="page"
                            :length="pageCount"
                            elevation="0"
                          ></v-pagination>
                        </v-col>
                      </v-row>
                    </v-footer>
                  </v-row>
                  <v-row v-else-if="isStudent == true" no-gutters>
                    <v-col md="12">
                      <div class="pt-5">
                        <div class="pb-5">
                          <v-progress-linear
                            v-if="isLoading"
                            indeterminate
                            color="primary"
                          ></v-progress-linear>
                          <v-data-table
                            v-if="!isLoading"
                            :headers="studentHeaders"
                            :items="students"
                            :page.sync="page"
                            :items-per-page="itemsPerPage"
                            hide-default-footer
                            @page-count="pageCount = $event"
                            class="elevation-0"
                            height="45vh"
                            fixed-header
                          >
                            <template v-slot:[`item.no`]="{ index }">
                              {{ index + 1 }}
                            </template>
                            <template v-slot:[`item.registrationDate`]="{ item }">
                              {{ _dayjs(item.registrationDate).format('DD/MM/YYYY') }}
                            </template>

                            <template v-slot:[`item.action`]="{ item }">
                              <div class="d-flex">
                                <i
                                  @click="viewLessonDetail(item.classID, item.scheduleID)"
                                  class="isax isax-eye fs-18 font-weight-bold mr-4"
                                ></i>
                              </div>
                            </template>
                          </v-data-table>
                        </div>
                      </div>
                    </v-col>
                    <v-footer v-if="!isLoading" height="60" color="#fff" width="60%">
                      <v-row>
                        <v-col md="3">
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
                          <v-pagination
                            v-model="page"
                            :length="pageCount"
                            elevation="0"
                          ></v-pagination>
                        </v-col>
                      </v-row>
                    </v-footer>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { class_managerment } from '@/api/class-management.js'
import { statistic_management } from '@/api/statistic-management.js'
import dayjs from 'dayjs'

export default {
  components: {},
  data() {
    return {
      isLoading: false,
      page: 1,
      pageCount: 0,

      itemsPerPage: 20,
      scheduleHeaders: [
        {
          text: 'Date',
          value: 'date',
          sortable: false,
        },
        {
          text: 'Time',
          value: 'classTime',
          sortable: false,
        },
        { text: 'Room', value: 'room', sortable: false },
        { text: 'Lesson', value: 'lessonNo', sortable: false },
        {
          text: 'Teacher',
          value: 'teachers.teacherName',
          sortable: false,
        },
        {
          text: 'TA',
          value: 'teacherAssistant',
          sortable: false,
        },
        {
          text: 'Lesson report',
          value: 'statusLessonReport',
          sortable: false,
        },
        { text: 'Action', value: 'action', sortable: false },
      ],
      schedules: [],
      testAndExamHeaders: [
        {
          text: 'No',
          value: 'no',
          sortable: false,
          width: '60px',
        },
        {
          text: 'Date',
          value: 'testDate',
          sortable: false,
          width: '140px',
        },
        { text: 'Lesson', value: 'lessonNo', sortable: false, width: '100px' },
        {
          text: 'Test category',
          value: 'testName',
          sortable: false,
          width: '150px',
        },
        {
          text: 'Test type',
          value: 'testType',
          sortable: false,
          width: '150px',
        },
      ],
      testAndExamList: [],
      studentHeaders: [
        {
          text: 'No',
          value: 'no',
          sortable: false,
        },
        {
          text: 'Code',
          value: 'studentCode',
          sortable: false,
        },
        {
          text: 'Student Name',
          value: 'fullName',
          sortable: false,
        },
        {
          text: 'DOB',
          value: 'dob',
          sortable: false,
        },
        {
          text: 'Due date',
          value: 'dueDate',
          sortable: false,
        },
        {
          text: 'Outstanding',
          value: 'outStanding',
          sortable: false,
        },
        {
          text: 'Student Account',
          value: 'studentAccountBalance',
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
          text: 'Start date',
          value: 'startDate',
          sortable: false,
        },
        {
          text: 'School',
          value: 'school',
          sortable: false,
        },
        { text: 'Status', value: 'registrationStatus', sortable: false },
        {
          text: 'Roadmap',
          value: 'studentType',
          sortable: false,
        },
      ],
      students: [],
      scheduleID: this.$route.query.scheduleID,
      classID: this.$route.query.classID,
      date: null,
      teacherID: JSON.parse(localStorage.getItem('currentUser')).userInfo.teacherID,
      className: '',
      department: '',
      classCode: '',
      level: '',
      classStatus: '',
      hour: '',
      book: '',
      note: '',
      center: '',
      precedingClass: '',
      classAdmin: '',
      customer: '',
      classType: '',
      classGroup: '',
      startDate: '',
      endDate: '',
      isSchedule: true,
      isTestAndExam: false,
      isStudent: false,
      calWidth: true,
    }
  },
  created() {
    console.log('object')
    this.getClassInfo()
    this.getStudentList()
  },
  methods: {
    async getClassInfo() {
      await class_managerment.getClassInfo(this.classID).then(res => {
        if (res) {
          this.classCode = res.classInfo.classCode
          this.level = res.classInfo.level
          this.classStatus = res.classInfo.classStatus
          this.hour = res.classInfo.hoursPerLesson
          this.book = res.classInfo.book
          this.note = res.classInfo.note
          this.center = res.classInfo.location
          this.precedingClass = res.classInfo.preceeding
          this.classAdmin = res.classInfo.classAdmin
          this.customer = res.classInfo.customerCareStaff
          this.classType = res.classInfo.classType
          this.classGroup = res.classInfo.classGroup
          this.startDate = this._dayjs(res.classInfo.startDate).format('DD/MM/YYYY')
          this.endDate = this._dayjs(res.classInfo.endDate).format('DD/MM/YYYY')
          this.schedules = res.schedules
          this.testAndExamList = res.testSchedule
          this.students = []
        }
      })
    },
    async getStudentList() {
      this.isLoading = true
      await statistic_management.getStudentList(this.classIDList).then(res => {
        if (res && !res.errors) {
          this.students = res
          this.students.forEach(student => {
            if (student.dueDate) student.dueDate = this._dayjs(student.dueDate).format('DD/MM/YYYY')
            student.startDate = this._dayjs(student.startDate).format('DD/MM/YYYY')
            student.dob = this._dayjs(student.dob).format('DD/MM/YYYY')
          })
        }
      })
      this.isLoading = false
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
    schedule() {
      this.isSchedule = true
      this.isTestAndExam = false
      this.isStudent = false
      this.isRecording = false
    },

    testAndExam() {
      this.isTestAndExam = true
      this.isSchedule = false
      this.isStudent = false
      this.isRecording = false
    },
    listStudent() {
      this.isStudent = true
      this.isTestAndExam = false
      this.isSchedule = false
      this.isRecording = false
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
#lesson-management {
  .list-info {
    position: relative;
    .item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed #dadbe6;
      padding: 11px 0;
    }
    .border-vertical {
      position: absolute;
      bottom: 24px;
      right: 0;
      width: 1px;
      height: 100%;
      background: url(~@/assets/images/line-vertical.png) no-repeat bottom center;
    }
  }
  .slot-infor {
    max-width: 500px;
    .item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed #dadbe6;
      padding: 11px 0;
    }
  }
  .imageVector {
    width: 19px;
    height: 18px;
  }
}
</style>
