<template>
  <div id="add-new-course">
    <div v-if="isLoading">
      <v-row no-gutters>
        <v-col>
          <div class="px-10 pt-5">
            <v-progress-linear
              indeterminate
              color="primary"
              class="my-10"
            ></v-progress-linear>
          </div>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-row no-gutters class="mb-15">
        <v-col>
          <div class="px-10">
            <h2 class="d-flex mb-5 pt-5">
              <v-icon @click="back()">arrow_back_ios</v-icon>
              <div class="d-flex align-center">Add new class</div>
            </h2>
            <h3 class="mb-2">Course information</h3>
            <v-row>
              <v-col md="4">
                <v-autocomplete
                  label="Department *"
                  outlined
                  :items="departments"
                  item-text="department"
                  item-value="departmentID"
                  v-model="classInfo.departmentID"
                  hide-details
                ></v-autocomplete>
              </v-col>
              <v-col md="4">
                <v-autocomplete
                  label="Program *"
                  outlined
                  :items="programmes"
                  item-text="programme"
                  item-value="programmeID"
                  v-model="classInfo.programmeID"
                  hide-details
                ></v-autocomplete>
              </v-col>
              <v-col md="4">
                <v-autocomplete
                  label="Course *"
                  outlined
                  :items="courses"
                  item-text="level"
                  item-value="levelID"
                  v-model="classInfo.levelID"
                  hide-details
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="2">
                <v-text-field
                  outlined
                  label="Duration (hrs)"
                  hide-details
                  v-model="classInfo.duration"
                ></v-text-field>
              </v-col>
              <v-col md="3">
                <v-text-field
                  outlined
                  label="Fee per hours (VND)"
                  hide-details
                  v-model="classInfo.feePerHour"
                ></v-text-field>
              </v-col>
              <v-col md="4">
                <v-autocomplete
                  label="Course tmpl. *"
                  outlined
                  :items="coursesTmpl"
                  item-text="coursesTmpl"
                  item-value="coursesTmplID"
                  v-model="classInfo.coursesTmplID"
                  hide-details
                ></v-autocomplete>
              </v-col>
              <v-col md="3">
                <v-autocomplete
                  label="Book"
                  outlined
                  :items="courses"
                  item-text="book"
                  item-value="bookID"
                  v-model="classInfo.bookID"
                  hide-details
                ></v-autocomplete>
              </v-col>
            </v-row>
            <h3 class="mb-2 mt-3">Class information</h3>
            <v-row>
              <v-col md="6">
                <v-text-field
                  outlined
                  label="Center *"
                  hide-details
                  v-model="centerName"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col md="6">
                <v-autocomplete
                  label="Class admin *"
                  outlined
                  :items="users"
                  item-text="userName"
                  item-value="userID"
                  v-model="classInfo.previousClassID"
                  hide-details
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="6">
                <v-autocomplete
                  label="Select Preceding"
                  outlined
                  :items="classList.filter((x) => x.classStatusID == 4)"
                  item-text="classCode"
                  item-value="classID"
                  v-model="classInfo.previousClassID"
                  hide-details
                ></v-autocomplete>
              </v-col>
              <v-col md="6">
                <v-autocomplete
                  label="Customer care staff *"
                  outlined
                  :items="users"
                  item-text="userName"
                  item-value="userID"
                  v-model="classInfo.customerCareStaffID"
                  hide-details
                ></v-autocomplete>
              </v-col>
              <v-col md="4">
                <v-textarea
                  outlined
                  label="Note"
                  hide-details
                  v-model="classInfo.note"
                ></v-textarea>
              </v-col>
              <v-col md="4">
                <v-textarea
                  outlined
                  label="EN Teacher’s comment"
                  hide-details
                  v-model="classInfo.enTeacherComment"
                ></v-textarea>
              </v-col>
              <v-col md="4">
                <v-textarea
                  outlined
                  label="VN Teacher’s comment:"
                  hide-details
                  v-model="classInfo.vnTeacherComment"
                ></v-textarea>
              </v-col>
            </v-row>
            <h3 class="mb-2 mt-3">Class setting</h3>
            <v-row>
              <v-col md="6">
                <v-text-field
                  outlined
                  label="Min Student *"
                  hide-details
                  v-model="classInfo.minAttendants"
                ></v-text-field>
              </v-col>
              <v-col md="6">
                <v-autocomplete
                  label="Class type"
                  outlined
                  :items="types"
                  item-text="classType"
                  item-value="classTypeID"
                  v-model="classInfo.classTypeID"
                  hide-details
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="6">
                <v-text-field
                  outlined
                  label="Max Student *"
                  hide-details
                  v-model="classInfo.maxAttendants"
                ></v-text-field>
              </v-col>
              <v-col md="6">
                <v-autocomplete
                  label="Class group *"
                  outlined
                  :items="groups"
                  item-text="classGroup"
                  item-value="classGroupID"
                  v-model="classInfo.classGroupID"
                  hide-details
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="6">
                <v-autocomplete
                  label="Select Shift"
                  outlined
                  :items="shifts"
                  item-text="shift"
                  item-value="shiftID"
                  v-model="classInfo.shiftID"
                  hide-details
                ></v-autocomplete>
              </v-col>
              <v-col md="6">
                <v-autocomplete
                  label="Class status *"
                  outlined
                  :items="status"
                  item-text="classStatus"
                  item-value="classStatusID"
                  v-model="classInfo.classStatusID"
                  hide-details
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="6">
                <v-text-field
                  outlined
                  label="Hrs/Lession"
                  hide-details
                  v-model="classInfo.hoursPerLesson"
                ></v-text-field>
              </v-col>
              <v-col md="6">
                <v-text-field
                  outlined
                  label="Week"
                  hide-details
                  v-model="classInfo.weekDuration"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="6">
                <date-picker
                  title="Start *"
                  :model.sync="classInfo.startDate"
                />
              </v-col>
              <v-col md="6">
                <date-picker title="End *" :model.sync="classInfo.endDate" />
              </v-col>
            </v-row>

            <h3 class="mb-2">Shift setting</h3>
            <v-row>
              <v-col>
                <v-data-table
                  :headers="headers"
                  :items="shiftTable"
                  hide-default-footer
                  class="elevation-0"
                >
                  <template v-slot:[`item.time`]="{ item }">
                    <v-text-field
                      class="pt-2"
                      outlined
                      dense
                      v-model="item.time"
                    ></v-text-field>
                  </template>
                  <template v-slot:[`item.room`]="{ item }">
                    <v-autocomplete
                      class="pt-2"
                      :items="rooms"
                      item-text="roomNo"
                      item-value="roomID"
                      outlined
                      dense
                      v-model="item.roomID"
                    >
                    </v-autocomplete>
                  </template>
                  <template v-slot:[`item.teacher`]="{ item }">
                    <v-autocomplete
                      class="pt-2"
                      outlined
                      dense
                      :items="users"
                      item-text="fullName"
                      item-value="userID"
                      v-model="item.teacherID"
                    ></v-autocomplete>
                  </template>
                  <template v-slot:[`item.teacherScale`]="{ item }">
                    <v-autocomplete
                      class="pt-2"
                      :items="teacherScales"
                      item-text="scaleName"
                      item-value="scaleID"
                      outlined
                      dense
                      v-model="item.scaleID"
                    >
                    </v-autocomplete>
                  </template>
                  <template v-slot:[`item.teacherFee`]="{ item }">
                    <v-text-field
                      class="pt-2"
                      outlined
                      dense
                      v-model="item.teacherFee"
                    ></v-text-field>
                  </template>
                  <template v-slot:[`item.teacherAssistant`]="{ item }">
                    <v-autocomplete
                      class="pt-2"
                      :items="teacherAssistants"
                      outlined
                      dense
                      v-model="item.teacherAssistant"
                    >
                    </v-autocomplete>
                  </template>
                  <template v-slot:[`item.taScale`]="{ item }">
                    <v-autocomplete
                      class="pt-2"
                      :items="taScales"
                      item-text="scaleName"
                      item-value="scaleID"
                      outlined
                      dense
                      v-model="item.scaleID"
                    >
                    </v-autocomplete>
                  </template>
                  <template v-slot:[`item.taFee`]="{ item }">
                    <v-text-field
                      class="pt-2"
                      outlined
                      dense
                      v-model="item.taFee"
                    ></v-text-field>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
      <v-footer fixed absolute height="60" color="#fff" class="pl-10 pr-10">
        <v-row>
          <v-col>
            <v-btn
              outlined
              small
              elevation="0"
              color="error"
              height="36"
              class="pl-16 pr-16 mr-5"
              >Cancel</v-btn
            >
            <v-btn
              small
              elevation="0"
              color="secondary"
              height="36"
              class="pl-16 pr-16"
              @click="review()"
              >Review</v-btn
            >
          </v-col>
        </v-row>
      </v-footer>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { class_managerment } from "@/api/class-management.js";
import { course_managerment } from "@/api/course-management.js";
import { account_managerment } from "@/api/account-management.js";
import { teacher_information } from "@/api/teacher-information.js";

import DatePicker from "@/components/Utils/DatePicker.vue";

const querystring = require("querystring");

export default {
  components: {
    "date-picker": DatePicker,
  },
  data() {
    return {
      isLoading: false,
      departments: [],
      programmes: [],
      shifts: [],
      groups: [],
      courses: [],
      status: [],
      types: [],
      users: [],
      centerName: "",
      centers: JSON.parse(localStorage.getItem("currentUser"))
        .locationPermissions,
      currentCenter: JSON.parse(localStorage.getItem("currentCenter")),
      classInfo: {
        className: "",
        shiftID: 0,
        weekDay: "",
        classTime: "",
        breakTime: "",
        hoursPerLesson: 0,
        roomID: 0,
        startDate: "",
        endDate: "",
        companyID: 0,
        contractID: 0,
        classStatusID: 2,
        classGroupID: 1,
        previousClassID: 0,
        departmentID: 0,
        programmeID: 0,
        levelID: 0,
        moduleID: 0,
        courseTemplateID: 0,
        certificateTemplateID: 0,
        schoolFee: 0,
        discountTypeID: 0,
        discountPct: 0,
        noStdsReEnrollment: 0,
        duration: 0,
        weekDuration: 0,
        minAttendants: 0,
        maxAttendants: 0,
        dueDate: "2021-12-13T04:27:23.576Z",
        teacherID: 0,
        teacherSalary: 0,
        teacherAssistant1ID: 0,
        teacherAssistant1Salary: 0,
        teacherAssistant2ID: 0,
        teacherAssistant2Salary: 0,
        locationID: JSON.parse(localStorage.getItem("currentCenter")),
        crtdUser: "string",
        crtdDate: "2021-12-13T04:27:23.576Z",
        lUpdUser: "string",
        lUpdDate: "2021-12-13T04:27:23.576Z",
        classTypeID: 0,
        productID: 0,
        note: "",
        paidFromStdAccount: 0,
        payableAmount: 0,
        actualEndDate: "2021-12-13T04:27:23.578Z",
        pic: 0,
        classRatioID: 0,
        syllabusID: 0,
        clsCounselorID: 0,
        clsStudentTypeID: 0,
        clsRegistrationDate: "2021-12-13T04:27:23.578Z",
        teaScaleID: 0,
        tA1ScaleID: 0,
        tA2ScaleID: 0,
        oldClassID: 0,
        classShiftName: "",
        feePerHour: 0,
        feePerLesson: 0,
        customerCareStaffID: 0,
        enTeacherComment: "",
        vnTeacherComment: "",
      },
      headers: [
        { text: "Time", value: "time", sortable: false },
        { text: "Room", value: "room", sortable: false },
        { text: "Teacher", value: "teacher", sortable: false },
        {
          text: "Teacher Scale",
          value: "teacherScale",
          sortable: false,
        },
        {
          text: "Teacher Fee",
          value: "teacherFee",
          sortable: false,
        },
        {
          text: "Teacher Assistant",
          value: "teacherAssistant",
          sortable: false,
        },
        {
          text: "TA Scale",
          value: "taScale",
          sortable: false,
        },
        { text: "TA Fee", value: "taFee", sortable: false },
      ],
      shiftTable: [
        {
          time: "Mon, 12h30-14h",
          room: "",
          teacher: "",
          teacherScale: "",
          teacherFee: "Scale 1 fee",
          teacherAssistant: "",
          taScale: "",
          taFee: "Scale 2 fee",
        },
      ],
      locationIds: [],
    };
  },
  created() {
    this.init();
  },
  watch: {
    "classInfo.departmentID": function (value) {
      this.getProgramme(value);
    },
    "classInfo.programmeID": function (value) {
      this.courseList(value);
    },
  },
  methods: {
    async init() {
      this.isLoading = true;
      await course_managerment.getDepartment().then((res) => {
        if (res) {
          this.departments = res;
        }
      });

      await class_managerment.getClassGroup().then((res) => {
        if (res) {
          this.groups = res;
        }
      });

      await class_managerment.getClassShift().then((res) => {
        if (res) {
          this.shifts = res;
        }
      });

      await class_managerment.getClassStatus().then((res) => {
        if (res) {
          this.status = res;
        }
      });

      await class_managerment.getClassType().then((res) => {
        if (res) {
          this.types = res;
        }
      });

      await class_managerment.getClassRoom().then((res) => {
        if (res) {
          this.rooms = res;
        }
      });

      await teacher_information.getListTeacherRate().then((res) => {
        if (res) {
          this.teacherScales = res;
          this.taScales = res;
        }
      });
      this.centers.forEach((x) => {
        this.locationIds.push(x.locationID);
      });
      await account_managerment.getUserList(this.locationIds).then((res) => {
        if (res.mess.message == "Ok") {
          // this.users = res.filter((x) => x.accountTypeID == 0 && x.isActive);
          this.users = res.salary;
          res.salary.forEach((x) => {
            this.centerName = x.location;
          });
        }
      });

      const obj = {
        findKey: null,
        locationID: this.currentCenter,
      };

      await class_managerment
        .searchClass(querystring.stringify(obj))
        .then((res) => {
          if (res) {
            this.classList = res;
          }
        });

      this.isLoading = false;
    },
    async getProgramme(departmentID) {
      await course_managerment.getProgramme(departmentID).then((res) => {
        if (res) {
          this.programmes = res;
        }
      });
    },
    async courseList(programmeID) {
      await course_managerment.getCourseByProgramme(programmeID).then((res) => {
        if (res) {
          this.courses = res;
        }
      });
    },
    review() {},
    currentDate() {
      return dayjs().format("YYYY-MM-DD");
    },
    _dayjs: dayjs,
    back() {
      window.history.back();
    },
  },
};
</script>
<style lang="scss" scoped>
.description {
  background: #faf9ff;
  border-radius: 4px;
  padding: 8px 16px 14px 16px;
  margin-bottom: 14px;
  small {
    font-size: 12px;
    line-height: 14px;
  }
}
.course-info {
  background: #faf9ff;
  border-radius: 6px;
  padding: 10px 24px 24px 24px;
  margin-bottom: 20px;
  .item {
    display: flex;
    border-bottom: 1px dashed #dadbe6;
    padding: 10px 0;
    // line-height: 40px;
    div:first-child {
      width: 170px;
      min-width: 170px;
    }
  }
}
</style>
