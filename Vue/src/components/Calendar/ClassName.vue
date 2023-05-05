<template>
  <div id="lesson-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <h2 class="d-flex">
            <v-icon @click="back()">arrow_back_ios</v-icon>
            <div class="d-flex align-center">{{ className }}</div>
          </h2>
          <div class="pl-8 pb-10">
            <span style="color: #0c2e68" class="fs-14"
              >Product name: {{ department }}</span
            >
            <h3>{{ classCode }} ({{ classStatus }})</h3>
          </div>
          <v-divider style="border: 1px solid #e5e5e5"></v-divider>
          <v-tabs>
            <v-tab
              @click="
                isSchedule = true;
                schedule();
              "
            >
              Schedule
            </v-tab>
            <v-tab
              @click="
                isTestAndExam = true;
                testAndExam();
              "
            >
              Test and exam schedule
            </v-tab>
            <v-tab
              @click="
                isStudent = true;
                listStudent();
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
              <v-col md="8" class="pt-7">
                <div class="d-flex justify-space-between mb-2">
                  <v-row v-if="isSchedule == true" no-gutters>
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
                            :headers="scheduleHeaders"
                            :items="schedules"
                            :page.sync="page"
                            :items-per-page="itemsPerPage"
                            hide-default-footer
                            @page-count="pageCount = $event"
                            class="elevation-0"
                            fixed-header
                            height="65vh"
                          >
                            <template v-slot:[`item.date`]="{ item }">
                              {{ _dayjs(item.date).format("DD/MM/YYYY") }}
                            </template>

                            <template v-slot:[`item.action`]="{ item }">
                              <div class="d-flex">
                                <v-tooltip top>
                                  <template v-slot:activator="{ on, attrs }">
                                    <i
                                      v-bind="attrs"
                                      v-on="on"
                                      @click="
                                        viewLessonDetail(
                                          item.classID,
                                          item.scheduleID
                                        )
                                      "
                                      class="
                                        isax isax-eye
                                        fs-18
                                        font-weight-bold
                                        mr-4
                                      "
                                    ></i>
                                  </template>
                                  <span>View lesson detail</span>
                                </v-tooltip>
                                <v-tooltip top>
                                  <template v-slot:activator="{ on, attrs }">
                                    <i
                                      v-bind="attrs"
                                      v-on="on"
                                      @click="
                                        takeAttendance(
                                          item.classID,
                                          item.scheduleID
                                        )
                                      "
                                      class="
                                        isax isax-calendar-tick
                                        fs-18
                                        font-weight-bold
                                        mr-4
                                      "
                                    ></i>
                                  </template>
                                  <span>Take attendance</span>
                                </v-tooltip>
                              </div>
                            </template>
                          </v-data-table>
                        </div>
                      </div>
                    </v-col>
                    <v-footer v-if="!isLoading" height="60" color="#fff">
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
                          >
                            <template v-slot:[`item.no`]="{ index }">
                              {{ index + 1 }}
                            </template>

                            <template v-slot:[`item.testDate`]="{ item }">
                              {{ _dayjs(item.testDate).format("DD/MM/YYYY") }}
                            </template>
                          </v-data-table>
                        </div>
                      </div>
                    </v-col>
                    <v-footer v-if="!isLoading" height="60" color="#fff">
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
                          >
                            <template v-slot:[`item.no`]="{ index }">
                              {{ index + 1 }}
                            </template>
                            <template
                              v-slot:[`item.registrationDate`]="{ item }"
                            >
                              {{
                                _dayjs(item.registrationDate).format(
                                  "DD/MM/YYYY"
                                )
                              }}
                            </template>

                            <template v-slot:[`item.action`]="{ item }">
                              <div class="d-flex">
                                <i
                                  @click="
                                    viewLessonDetail(
                                      item.classID,
                                      item.scheduleID
                                    )
                                  "
                                  class="
                                    isax isax-eye
                                    fs-18
                                    font-weight-bold
                                    mr-4
                                  "
                                ></i>
                              </div>
                            </template>
                          </v-data-table>
                        </div>
                      </div>
                    </v-col>
                    <v-footer v-if="!isLoading" height="60" color="#fff">
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
              <v-divider vertical />
              <v-col md="4">
                <h2>Course information</h2>
                <div class="list-info">
                  <div class="item">
                    <v-row>
                      <v-col md="6">Hrs/Lession</v-col>
                      <v-col md="6">{{ hour }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="6">Book</v-col>
                      <v-col md="6">{{ book }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="6">Note</v-col>
                      <v-col md="6">{{ note }}</v-col>
                    </v-row>
                  </div>
                </div>
                <h2 class="pt-2">Class information</h2>
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
            </v-row>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { class_managerment } from "@/api/class-management.js";
import dayjs from "dayjs";

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
          text: "Date",
          value: "date",
          sortable: false,
          width: "110px",
        },
        {
          text: "Time",
          value: "classTime",
          sortable: false,
          width: "110px",
        },
        { text: "Room", value: "room", sortable: false, width: "50px" },
        { text: "Lesson", value: "lessonNo", sortable: false, width: "50px" },
        {
          text: "Teacher",
          value: "teachers.teacherName",
          sortable: false,
          width: "110px",
        },
        {
          text: "TA",
          value: "ta1.teacherName",
          sortable: false,
          width: "100px",
        },
        { text: "Action", value: "action", sortable: false },
      ],
      schedules: [],
      testAndExamHeaders: [
        {
          text: "No",
          value: "no",
          sortable: false,
          width: "60px",
        },
        {
          text: "Date",
          value: "testDate",
          sortable: false,
          width: "140px",
        },
        { text: "Lesson", value: "lessonNo", sortable: false, width: "100px" },
        {
          text: "Test category",
          value: "testName",
          sortable: false,
          width: "150px",
        },
        {
          text: "Test type",
          value: "testType",
          sortable: false,
          width: "150px",
        },
      ],
      testAndExamList: [],
      studentHeaders: [
        {
          text: "No",
          value: "no",
          sortable: false,
        },
        {
          text: "Student",
          value: "student",
          sortable: false,
          width: "200px",
        },
        {
          text: "Student Type",
          value: "studentType",
          sortable: false,
          width: "180px",
        },
        { text: "Date", value: "registrationDate", sortable: false },
        { text: "Status", value: "registrationStatus", sortable: false },
      ],
      students: [],
      classID: this.$route.query.classID,
      date: null,
      teacherID: JSON.parse(localStorage.getItem("currentUser")).userInfo
        .teacherID,
      className: "",
      department: "",
      classCode: "",
      classStatus: "",
      hour: "",
      book: "",
      note: "",
      center: "",
      precedingClass: "",
      classAdmin: "",
      customer: "",
      classType: "",
      classGroup: "",
      startDate: "",
      endDate: "",
      isSchedule: true,
      isTestAndExam: false,
      isStudent: false,
    };
  },
  created() {
    this.getCalendar();
  },
  methods: {
    async getCalendar() {
      await class_managerment.getClassInfo(this.classID).then((res) => {
        if (res) {
          this.className = res.classInfo.className;
          this.department = res.classInfo.department;
          this.classCode = res.classInfo.classCode;
          this.classStatus = res.classInfo.classStatus;
          this.hour = res.classInfo.hoursPerLesson;
          this.book = res.classInfo.book;
          this.note = res.classInfo.note;
          this.center = res.classInfo.location;
          this.precedingClass = res.classInfo.preceeding;
          this.classAdmin = res.classInfo.classAdmin;
          this.customer = res.classInfo.customerCareStaff;
          this.classType = res.classInfo.classType;
          this.classGroup = res.classInfo.classGroup;
          this.startDate = this._dayjs(res.classInfo.startDate).format(
            "DD/MM/YYYY"
          );
          this.endDate = this._dayjs(res.classInfo.endDate).format(
            "DD/MM/YYYY"
          );
          this.schedules = res.schedules;
          this.testAndExamList = res.testSchedule;
          this.students = res.students;
        }
      });
    },
    viewLessonDetail(classID, scheduleID) {
      this.$router.push({
        name: "my-calendar-class-name-view-lesson-detail",
        query: { classID: classID, scheduleID: scheduleID },
      });
    },
    takeAttendance(classID, scheduleID) {
      this.$router.push({
        name: "class-management-take-attendance-student",
        query: { classID: classID, scheduleID: scheduleID },
      });
    },
    schedule() {
      this.isSchedule = true;
      this.isTestAndExam = false;
      this.isStudent = false;
    },
    testAndExam() {
      this.isTestAndExam = true;
      this.isSchedule = false;
      this.isStudent = false;
    },
    listStudent() {
      this.isStudent = true;
      this.isTestAndExam = false;
      this.isSchedule = false;
    },
    back() {
      window.history.back();
    },
    _dayjs: dayjs,
  },
};
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
      background: url(~@/assets/images/line-vertical.png) no-repeat bottom
        center;
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
