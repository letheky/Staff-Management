<template>
  <v-app>
    <div id="center-management">
      <v-progress-linear
        v-if="isLoading"
        indeterminate
        color="primary"
        class="my-10"
      ></v-progress-linear>
      <v-row no-gutters v-if="!isLoading">
        <v-col md="12">
          <div class="pa-10 pt-5">
            <div class="d-flex justify-space-between">
              <h2 class="d-flex">
                <v-icon @click="back()">arrow_back_ios</v-icon>
                <div class="d-flex align-center">
                  Leave of absence request detail
                </div>
              </h2>
            </div>
            <div class="success">
              <v-alert
                :value="checkSuccess"
                transition="scale-transition"
                type="success"
                style="font-size: 14px; padding: 12px"
              >
                Assign teacher cover successfully
              </v-alert>
            </div>
            <div class="d-flex align-center">
              <div class="ml-10">
                <v-avatar class="" size="125">
                  <i class="isax isax-profile-circle fs-125"></i>
                </v-avatar>
              </div>
              <div>
                <span class="ml-5 mr-5 fs-24">{{
                  teacherDetail.fullName
                }}</span>
                <a @click="viewProfile(teacherID)" style="font-size: 20px"
                  >View profile</a
                >
              </div>
            </div>
            <div class="pt-5">
              <v-textarea
                outlined
                label="Reason for leave of absence"
                v-model="reason"
                value=""
                :readonly="true"
              ></v-textarea>
            </div>
            <div class="d-flex">
              <div class="mr-10">
                <p class="mb-2 font-weight-bold">From</p>
                <span>{{ _dayjs(fromTime).format("DD/MM/YYYY, HH:mm") }}</span>
              </div>
              <div class="ml-10">
                <p class="mb-2 font-weight-bold">Until</p>
                <span>{{ _dayjs(toTime).format("DD/MM/YYYY, HH:mm") }}</span>
              </div>
              <div class="pl-10 font-weight-bold">
                <span class="pr-2">Status</span>
                <v-chip
                  text-color="blue"
                  small
                  v-if="teacherDetail.status === 'PENDING'"
                  >{{ teacherDetail.status }}</v-chip
                >
                <v-chip
                  text-color="error"
                  small
                  v-if="teacherDetail.status === 'REJECTED'"
                  >{{ teacherDetail.status }}</v-chip
                >
                <v-chip
                  text-color="success"
                  small
                  v-if="teacherDetail.status === 'APPROVED'"
                  >{{ teacherDetail.status }}</v-chip
                >
              </div>
            </div>
            <div>
              <h3 class="pt-5 pb-3">
                {{ teacherlistabsence[0].fullName }}'s Schedule
                <span
                  >from {{ _dayjs(fromTime).format("DD/MM/YYYY, HH:mm") }}</span
                >
                <span>
                  to {{ _dayjs(toTime).format("DD/MM/YYYY, HH:mm") }}</span
                >
              </h3>
              <a class="font-weight-bold pl-5" style="color: #246aff">
                <v-btn
                  :disabled="selected.length > 0 ? false : true"
                  outlined
                  color="primary"
                  @click="
                    $refs.confirmAddTeacherCover.open();
                    lisTeacher();
                    selectMulti = true;
                  "
                >
                  <v-icon color="primary" class="mr-1" small
                    >mdi-account-multiple-plus</v-icon
                  >
                  Add cover teachers
                </v-btn>
              </a>
              <div class="pb-10">
                <v-data-table
                  :headers="headers"
                  :items="lisAbsenceDetail"
                  :page.sync="page"
                  :items-per-page="itemsPerPage"
                  hide-default-footer
                  @page-count="pageCount = $event"
                  show-select
                  v-model="selected"
                  item-key="scheduleID"
                  class="elevation-0"
                  checkbox-color="secondary"
                >
                  <template
                    v-slot:[`item.data-table-select`]="{ on, props, item }"
                  >
                    <v-checkbox
                      :disabled="item.teacherID ? true : false"
                      color="secondary"
                      :ripple="false"
                      v-model="selected"
                      :value="item.teacherID ? '' : item"
                      v-bind="props"
                      v-on="on"
                    ></v-checkbox>
                  </template>

                  <template v-slot:[`item.no`]="{ index }">
                    {{ index + 1 }}
                  </template>

                  <template v-slot:[`item.date`]="{ item }">
                    {{ _dayjs(item.date).format("YYYY-MM-DD") }}
                  </template>

                  <template v-slot:[`item.orgTeacher`]="{ item }">
                    {{ item.orgTeacher }}
                  </template>

                  <template v-slot:[`item.teacherScale`]="{ item }">
                    {{ item.teacherScale }}
                  </template>

                  <template v-slot:[`item.teacher`]="{ item }">
                    {{ item.teacher }}
                  </template>

                  <template v-slot:[`item.action`]="{ item }">
                    <div class="d-flex">
                      <v-icon
                        size="18"
                        color="primary"
                        v-if="item.teacher"
                        src="@/assets/images/icons_person-add.png"
                        class="edit-teacher-cover"
                        @click="
                          $refs.confirmAddTeacherCover.open();
                          teacherName = item.teacherID;
                          scale = item.teacherScaleID;
                          listTeacherandScale(item.startTime, item.endTime);
                          scheduleID = item.scheduleID;
                          selectMulti = false;
                        "
                      >
                        mdi-account-edit
                      </v-icon>
                      <v-icon
                        size="18"
                        color="primary"
                        v-else
                        @click="
                          $refs.confirmAddTeacherCover.open();
                          listTeacherandScale(item.startTime, item.endTime);
                          selectMulti = false;
                          classID = item.classID;
                          scheduleID = item.scheduleID;
                          coverTeacherScaleID = 1;
                        "
                        >mdi-account-plus</v-icon
                      >
                    </div>
                  </template>
                </v-data-table>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-footer
        v-if="!isLoading"
        fixed
        absolute
        height="60"
        color="#fff"
        class="pl-10 pr-10"
        width="80%"
      >
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
          <v-col class="d-flex align-center justify-end">
            <h3 v-if="lisAbsenceDetail.length > 1">
              Total: {{ lisAbsenceDetail.length }} records
            </h3>
            <h3 v-else>Total: {{ lisAbsenceDetail.length }} record</h3>
          </v-col>
          <v-col class="d-flex justify-end">
            <v-pagination
              v-model="page"
              :length="pageCount"
              :total-visible="7"
              elevation="0"
            ></v-pagination>
          </v-col>
        </v-row>
      </v-footer>
      <popup-confirm
        @confirm="confirmAddTeacherCover"
        @cancel="cancelAddTeacherCover"
        :maxWidth="maxWidth"
        :width="
          showCalendar == true && !isLoadingPopUp
            ? width
            : showCalendar == false && !isLoadingPopUp
            ? widthCalendar
            : widthCalendar
        "
        :checkConfirm="checkConfirm"
        confirmColor="primary"
        ref="confirmAddTeacherCover"
      >
        <v-card-title
          style="display: flex; flex-direction: column"
          slot="icon"
          class="pt-0"
        >
          <v-icon x-large color="primary" outline>mdi-account-plus</v-icon>
        </v-card-title>
        <v-card-title
          style="display: flex; flex-direction: column"
          slot="title"
          class="pt-0"
        >
          <h2 class="text-center">Add teacher</h2>
        </v-card-title>
        <v-card-title slot="content">
          <v-row justify="center" v-if="isLoadingPopUp" class="pa-6">
            <v-progress-circular
              :size="70"
              :width="7"
              color="indigo darken-2"
              indeterminate
            ></v-progress-circular>
          </v-row>
          <v-row
            justify="center"
            v-if="showCalendar == false && !isLoadingPopUp"
          >
            <v-col md="6">
              <v-autocomplete
                v-model="teacherName"
                placeholder="Enter teacher by code/name"
                :items="teacherNames"
                item-text="fullName"
                item-value="teacherID"
                class="mb-5"
                outlined
                hide-details
              >
                <template v-slot:selection="{ item }">
                  <v-avatar v-if="item.fullName">
                    <i class="isax isax-profile-circle fs-24"></i> </v-avatar
                  >{{ item.fullName }}
                </template>
                <template v-slot:item="{ item }">
                  <v-avatar class="">
                    <i class="isax isax-profile-circle fs-24"></i> </v-avatar
                  >{{ item.fullName }}
                </template>
              </v-autocomplete>
              <v-select
                v-model="scale"
                placeholder="Teacher scale"
                :items="teacherRates"
                item-text="scaleName"
                item-value="scaleID"
                class="mb-5"
                outlined
                hide-details
              ></v-select>
            </v-col>
          </v-row>
          <v-row v-if="showCalendar == true && !isLoadingPopUp">
            <v-col md="5">
              <v-autocomplete
                v-model="teacherName"
                placeholder="Enter teacher by code/name"
                :items="teacherNames"
                item-text="fullName"
                item-value="teacherID"
                class="mb-5"
                outlined
                hide-details
              >
                <template v-slot:selection="{ item }">
                  <v-avatar>
                    <i class="isax isax-profile-circle fs-24"></i> </v-avatar
                  >{{ item.fullName }}
                </template>
                <template v-slot:item="{ item }">
                  <v-avatar>
                    <i class="isax isax-profile-circle fs-24"></i> </v-avatar
                  >{{ item.fullName }}
                </template>
              </v-autocomplete>
              <v-autocomplete
                v-model="scale"
                placeholder="Teacher scale"
                :items="teacherRates"
                item-text="scale"
                item-value="scaleID"
                class="mb-5"
                outlined
                hide-details
              ></v-autocomplete>
            </v-col>
            <v-col class="" md="7">
              <template>
                <v-row no-gutters class="fill-height">
                  <v-col>
                    <div class="pt-0">
                      <v-sheet height="44" class="mb-5">
                        <v-toolbar flat elevation="0">
                          <v-icon color="secondary" @click="prev">
                            mdi-chevron-left
                          </v-icon>
                          <v-btn
                            outlined
                            dense
                            class=""
                            color="secondary"
                            @click="setToday"
                          >
                            Today
                          </v-btn>
                          <v-icon @click="next" color="secondary">
                            mdi-chevron-right
                          </v-icon>
                          <v-toolbar-title
                            v-if="$refs.calendar"
                            style="font-size: 14px"
                          >
                            {{ $refs.calendar.title }}
                          </v-toolbar-title>
                          <v-spacer></v-spacer>
                          <v-btn
                            :color="checkTimeAvalibale == true ? 'primary' : ''"
                            class="mr-2"
                            @click="
                              checkTimeAvalibale = true;
                              setToday();
                              timeAvaiable();
                            "
                            >Time available</v-btn
                          >
                          <v-btn
                            :color="
                              checkTimeAvalibale == false ? 'primary' : ''
                            "
                            @click="
                              checkTimeAvalibale = false;
                              setToday();
                              schedule();
                            "
                            >Schedule</v-btn
                          >
                        </v-toolbar>
                      </v-sheet>
                      <v-progress-linear
                        v-if="isLoadingCalendar"
                        indeterminate
                        color="primary"
                        class="my-10"
                      ></v-progress-linear>
                      <v-sheet height="306" v-if="!isLoadingCalendar">
                        <v-calendar
                          ref="calendar"
                          v-model="focus"
                          color="primary"
                          :events="events"
                          :event-color="getEventColor"
                          :event-ripple="false"
                          event-start="fromTime"
                          event-end="toTime"
                          event-name="crtdUser"
                          :type="type"
                          first-time="7:00"
                          interval-count="17"
                          :interval-format="intervalFormatter"
                          @click:event="showEvent"
                          @click:time="viewDay"
                          interval-height="20"
                        >
                        </v-calendar>

                        <v-menu
                          v-model="selectedOpen"
                          :close-on-content-click="false"
                          :activator="selectedElement"
                          offset-x
                        >
                          <v-card
                            min-width="250px"
                            flat
                            v-if="checkTimeAvalibale == false"
                          >
                            <v-toolbar
                              flat
                              :color="getEventColor(selectedEvent)"
                              height="30"
                            >
                              <v-toolbar-title
                                style="font-size: 14px"
                                class="font-weight-bold"
                              >
                                {{
                                  _dayjs(selectedEvent.date).format(
                                    "DD/MM/YYYY"
                                  )
                                }}
                                : {{ selectedEvent.className }}</v-toolbar-title
                              >
                            </v-toolbar>
                            <v-card-text>
                              <div>Course: {{ selectedEvent.courseName }}</div>
                              <div>Room: {{ selectedEvent.room }}</div>
                              <div>
                                Time:
                                {{
                                  _dayjs(selectedEvent.fromTime).format("HH:mm")
                                }}
                                -
                                {{
                                  _dayjs(selectedEvent.toTime).format("HH:mm")
                                }}
                              </div>
                              <!-- <div>Center: {{ selectedEvent.location }}</div> -->
                            </v-card-text>
                          </v-card>
                          <v-card min-width="250px" flat v-else>
                            <v-toolbar
                              flat
                              :color="getEventColor(selectedEvent)"
                              height="40"
                            >
                              <v-toolbar-title
                                style="font-size: 14px"
                                class="font-weight-bold"
                                >{{ selectedEvent.crtdUser }}</v-toolbar-title
                              >
                            </v-toolbar>
                            <v-card-text>
                              <div>Type: {{ selectedEvent.type }}</div>
                              <div>From time: {{ selectedEvent.fromTime }}</div>
                              <div>To time: {{ selectedEvent.toTime }}</div>
                            </v-card-text>
                          </v-card>
                        </v-menu>
                      </v-sheet>
                    </div>
                  </v-col>
                </v-row>
              </template>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-actions> </v-card-actions>
      </popup-confirm>
    </div>
  </v-app>
</template>

<script>
import dayjs from "dayjs";
import { teacher_information } from "@/api/teacher-information.js";
import { center_managerment } from "@/api/center-management.js";
import PopupConfirm from "@/components/Utils/PopupConfirm.vue";
const querystring = require("querystring");

export default {
  components: {
    "popup-confirm": PopupConfirm,
  },
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      checkSuccess: false,
      reason: "",
      lisAbsenceDetail: [],
      classTime: "",
      isLoading: false,
      checkConfirm: true,
      maxWidth: 1500,
      width: 1000,
      widthCalendar: 600,
      teacherNames: [],
      selectMulti: false,
      headers: [
        {
          text: "No",
          align: "start",
          value: "no",
          sortable: false,
          width: "5%",
        },
        {
          text: "Class",
          value: "className",
          sortable: false,
          width: "17%",
        },
        { text: "Course", value: "courseName", sortable: false, width: "12%" },
        { text: "Date", value: "date", sortable: false, width: "15%" },
        {
          text: "Class time",
          value: "classTime",
          sortable: false,
          width: "15%",
        },
        {
          text: "Cover teacher",
          value: "teacher",
          sortable: false,
          width: "17%",
        },
        {
          text: "Scale",
          value: "teacherScale",
          sortable: false,
          width: "10%",
        },
        { text: "Action", value: "action", sortable: false, width: "15%" },
      ],
      userInfor: JSON.parse(localStorage.getItem("currentUser")).userInfo,
      teacherID: this.$route.params.teacherID,
      fromTime: this.$route.params.fromTime,
      toTime: this.$route.params.toTime,
      recordID: this.$route.params.recordID,
      teacherlistabsence: [],
      teacherDetail: null,
      showCalendar: false,
      focus: "",
      type: "week",
      typeToLabel: {
        month: "Month",
        week: "Week",
        day: "Day",
        "4day": "4 Days",
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      teacherName: "",
      scale: "",
      classID: "",
      scheduleID: "",
      coverTeacherScaleID: "",
      selected: [],
      scheduleIDS: [],
      fromTimes: [],
      toTimes: [],
      index: 0,
      teacherRates: [],
      checkTimeAvalibale: true,
      isLoadingPopUp: false,
      isLoadingCalendar: false,
      teacherTypeID: null,
      teacherGroupID: null,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      list5: [],
      list6: [],
      list7: [],
      listMon: [],
      listTue: [],
      listWed: [],
      listThu: [],
      listFri: [],
      listSat: [],
      listSun: [],
    };
  },
  created() {
    this.getCalendar();
  },
  watch: {
    teacherName: function (value) {
      if (value) {
        this.showCalendar = true;
        value & this.scale ? (this.checkConfirm = false) : "";
        center_managerment.teacherScale(value).then((res) => {
          if (res.mess.message == "Ok") {
            this.teacherRates = res.teacherScales;
          }
        });
        this.checkTimeAvalibale == true
          ? this.listTeacherFreeTime()
          : this.schedule();
      } else this.showCalendar = false;
    },
    scale: function (value) {
      if (value && this.teacherName) {
        this.checkConfirm = false;
      }
    },
  },
  methods: {
    async getCalendar() {
      this.isLoading = true;
      const body = {
        teacherID: this.teacherID,
        fromDate: dayjs(this.fromTime).format("YYYY-MM-DD"),
        toDate: dayjs(this.toTime).format("YYYY-MM-DD"),
      };
      await teacher_information
        .getTeacherCalendar(querystring.stringify(body))
        .then((res) => {
          if (res.mess.code == 200) {
            res.schedue.forEach((x) => {
              this.lisAbsenceDetail.push({
                classID: x.classID,
                className: x.className,
                classTime: x.classTime,
                courseName: x.courseName,
                date: x.date,
                endTime: x.endTime,
                hrsTaugh: x.hrsTaugh,
                orgScaleID: x.orgScaleID,
                orgTeacher: x.orgTeacher,
                orgTeacherID: x.orgTeacherID,
                orgTeacherScale: x.orgTeacherScale,
                room: x.room,
                roomID: x.roomID,
                salaryPerHrs: x.salaryPerHrs,
                scheduleID: x.scheduleID,
                startTime: x.startTime,
                status: x.status,
                teacher:
                  x.orgTeacherID && x.orgTeacherID != 0 ? x.teacher : null,
                teacherCode: x.teacherCode,
                teacherID:
                  x.orgTeacherID && x.orgTeacherID != 0 ? x.teacherID : null,
                teacherScale:
                  x.orgTeacherID && x.orgTeacherID != 0 ? x.teacherScale : null,
                teacherScaleID:
                  x.orgTeacherID && x.orgTeacherID != 0
                    ? x.teacherScaleID
                    : null,
              });
            });
            teacher_information.getListTeacherGroup().then((a) => {
              a.forEach((b) => {
                if (b.teacherGroup == res.orgTeacherGroup) {
                  this.teacherGroupID = b.teacherGroupID;
                }
              });
            });
            teacher_information.getListTeacherType().then((x) => {
              x.forEach((y) => {
                if (y.teacherType == res.orgTeacherType) {
                  this.teacherTypeID = y.teacherTypeID;
                }
              });
            });
          }
        });
      await center_managerment
        .leaveAdminAbsence(
          dayjs(this.fromTime).format("YYYY-MM-DD"),
          dayjs(this.toTime).add(1, "day").format("YYYY-MM-DD"),
          4
        )
        .then((res) => {
          if (res.mess.code == 200) {
            this.teacherlistabsence = res.teacher;
            this.teacherlistabsence.forEach((x) => {
              if (x.recordID == this.recordID) {
                this.teacherDetail = x;
              }
            });
            this.reason = this.teacherDetail.reason;
          }
        });
      this.isLoading = false;
    },
    async schedule() {
      this.selectedOpen = false;
      this.events = [];
      this.isLoadingCalendar = true;
      const body = {
        teacherID: this.teacherName,
        fromDate: dayjs().add(-6, "month").format("YYYY-MM-DD"),
        toDate: dayjs().add(6, "month").format("YYYY-MM-DD"),
      };
      await teacher_information
        .getTeacherCalendar(querystring.stringify(body))
        .then((res) => {
          if (res.mess.code == 200) {
            res.schedue.forEach((x) => {
              this.events.push({
                classID: x.classID,
                className: x.className,
                classTime: x.classTime,
                courseName: x.courseName,
                date: x.date,
                hrsTaugh: x.hrsTaugh,
                orgScaleID: x.orgScaleID,
                orgTeacher: x.orgTeacher,
                orgTeacherID: x.orgTeacherID,
                orgTeacherScale: x.orgTeacherScale,
                room: x.room,
                roomID: x.roomID,
                salaryPerHrs: x.salaryPerHrs,
                scheduleID: x.scheduleID,
                status: x.status,
                teacher: x.teacher,
                teacherCode: x.teacherCode,
                teacherID: x.teacherID,
                teacherScale: x.teacherScale,
                teacherScaleID: x.teacherScaleID,
                fromTime: x.startTime,
                toTime: x.endTime,
              });
            });
            setTimeout(() => {
              this.isLoadingCalendar = false;
            }, 1000);
          }
        });
    },

    timeAvaiable() {
      this.events = [];
      this.listTeacherFreeTime();
    },

    cancelAddTeacherCover() {
      this.showCalendar = false;
      this.teacherName = "";
      this.scale = "";
      this.checkConfirm = true;
    },

    confirmAddTeacherCover() {
      if (this.selectMulti == false) {
        const body = {
          scheduleID: this.scheduleID,
          coverTeacherID: this.teacherName,
          coverTeacherScaleID: this.scale,
        };
        center_managerment
          .addCoverTeacher(querystring.stringify(body))
          .then((res) => {
            if (res.mess.message == "Ok") {
              this.checkSuccess = true;
              setTimeout(() => {
                this.checkSuccess = false;
                this.showCalendar = false;
                this.teacherName = null;
                this.checkConfirm = true;
                this.lisAbsenceDetail = [];
                this.scale = "";
                this.getCalendar();
              }, 1000);
            }
          });
      } else {
        (this.scheduleIDS = []),
          this.selected.forEach((x) => {
            if (x.orgTeacher == null) {
              this.scheduleIDS.push(x.scheduleID);
            }
          });
        const body = {
          scheduleID: this.scheduleIDS,
          coverTeacherID: this.teacherName,
          coverTeacherScaleID: this.scale,
        };
        center_managerment
          .addCoverTeacher(querystring.stringify(body))
          .then((res) => {
            if (res.mess.message == "Ok") {
              this.checkSuccess = true;
              setTimeout(() => {
                this.checkSuccess = false;
                this.showCalendar = false;
                this.teacherName = null;
                this.checkConfirm = true;
                this.lisAbsenceDetail = [];
                this.scale = "";
                this.getCalendar();
              }, 1000);
            }
          });
      }
    },

    viewDay({ date }) {
      this.focus = date;
      // this.type = "day";
    },
    getEventColor(event) {
      if (event.type == "Weekly") {
        return "blue";
      } else if (event.type == "Fix") {
        return "green";
      } else {
        return "blue";
      }
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      if (this.checkTimeAvalibale == true) {
        if (
          this.year !=
          dayjs(this.$refs.calendar.lastStart.date)
            .add(-1, "day")
            .format("YYYY")
        ) {
          this.year = dayjs(this.$refs.calendar.lastStart.date)
            .add(-1, "day")
            .format("YYYY");
          this.listTeacherFreeTime();
        }
      }
      this.$refs.calendar.prev();
    },
    next() {
      if (this.checkTimeAvalibale == true) {
        if (
          this.year !=
          dayjs(this.$refs.calendar.lastStart.date).add(7, "day").format("YYYY")
        ) {
          this.year = dayjs(this.$refs.calendar.lastStart.date)
            .add(7, "day")
            .format("YYYY");
          this.listTeacherFreeTime();
        }
      }
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    intervalFormatter(locale) {
      return locale.time;
    },
    async listTeacherandScale(startTime, endTime) {
      this.isLoadingPopUp = true;
      const body = {
        fromTime: startTime,
        toTime: endTime,
        teacherGroupID: this.teacherGroupID,
        teacherTypeID: this.teacherTypeID,
      };
      await center_managerment
        .listFreeTime(querystring.stringify(body))
        .then((res) => {
          if (res.mess.code == 200) {
            this.teacherNames = res.teacherFreeTime;
            this.isLoadingPopUp = false;
          }
        });
    },

    listTeacherFreeTime() {
      this.selectedOpen = false;
      this.events = [];
      this.list1 = [];
      this.list2 = [];
      this.list3 = [];
      this.list4 = [];
      this.list5 = [];
      this.list6 = [];
      this.list7 = [];
      this.listMon = [];
      this.listTue = [];
      this.listWed = [];
      this.listThu = [];
      this.listFri = [];
      this.listSat = [];
      this.listSun = [];
      var dayone = this.year - 1 + "-12-18";
      var daytwo = this.year - 1 + "-12-19";
      var daythree = this.year - 1 + "-12-20";
      var dayfour = this.year - 1 + "-12-21";
      var dayfive = this.year - 1 + "-12-22";
      var daysix = this.year - 1 + "-12-23";
      var dayseven = this.year - 1 + "-12-24";
      for (var j = 1; j <= 54; j++) {
        if (j) {
          dayone = dayjs(dayone).add(7, "day").format();
          daytwo = dayjs(daytwo).add(7, "day").format();
          daythree = dayjs(daythree).add(7, "day").format();
          dayfour = dayjs(dayfour).add(7, "day").format();
          dayfive = dayjs(dayfive).add(7, "day").format();
          daysix = dayjs(daysix).add(7, "day").format();
          dayseven = dayjs(dayseven).add(7, "day").format();
          this.list1.push({
            date: dayjs(dayone).format("YYYY-MM-DD"),
          });
          this.list2.push({
            date: dayjs(daytwo).format("YYYY-MM-DD"),
          });
          this.list3.push({
            date: dayjs(daythree).format("YYYY-MM-DD"),
          });
          this.list4.push({
            date: dayjs(dayfour).format("YYYY-MM-DD"),
          });
          this.list5.push({
            date: dayjs(dayfive).format("YYYY-MM-DD"),
          });
          this.list6.push({
            date: dayjs(daysix).format("YYYY-MM-DD"),
          });
          this.list7.push({
            date: dayjs(dayseven).format("YYYY-MM-DD"),
          });
        }
      }

      new Date(this.list1[0].date).getDay() == 6
        ? (this.listSat = this.list1)
        : new Date(this.list1[0].date).getDay() == 0
        ? (this.listSun = this.list1)
        : new Date(this.list1[0].date).getDay() == 1
        ? (this.listMon = this.list1)
        : new Date(this.list1[0].date).getDay() == 2
        ? (this.listTue = this.list1)
        : new Date(this.list1[0].date).getDay() == 3
        ? (this.listWed = this.list1)
        : new Date(this.list1[0].date).getDay() == 4
        ? (this.listThu = this.list1)
        : new Date(this.list1[0].date).getDay() == 5
        ? (this.listFri = this.list1)
        : null;

      new Date(this.list2[0].date).getDay() == 6
        ? (this.listSat = this.list2)
        : new Date(this.list2[0].date).getDay() == 0
        ? (this.listSun = this.list2)
        : new Date(this.list2[0].date).getDay() == 1
        ? (this.listMon = this.list2)
        : new Date(this.list2[0].date).getDay() == 2
        ? (this.listTue = this.list2)
        : new Date(this.list2[0].date).getDay() == 3
        ? (this.listWed = this.list2)
        : new Date(this.list2[0].date).getDay() == 4
        ? (this.listThu = this.list2)
        : new Date(this.list2[0].date).getDay() == 5
        ? (this.listFri = this.list2)
        : null;

      new Date(this.list3[0].date).getDay() == 6
        ? (this.listSat = this.list3)
        : new Date(this.list3[0].date).getDay() == 0
        ? (this.listSun = this.list3)
        : new Date(this.list3[0].date).getDay() == 1
        ? (this.listMon = this.list3)
        : new Date(this.list3[0].date).getDay() == 2
        ? (this.listTue = this.list3)
        : new Date(this.list3[0].date).getDay() == 3
        ? (this.listWed = this.list3)
        : new Date(this.list3[0].date).getDay() == 4
        ? (this.listThu = this.list3)
        : new Date(this.list3[0].date).getDay() == 5
        ? (this.listFri = this.list3)
        : null;

      new Date(this.list4[0].date).getDay() == 6
        ? (this.listSat = this.list4)
        : new Date(this.list4[0].date).getDay() == 0
        ? (this.listSun = this.list4)
        : new Date(this.list4[0].date).getDay() == 1
        ? (this.listMon = this.list4)
        : new Date(this.list4[0].date).getDay() == 2
        ? (this.listTue = this.list4)
        : new Date(this.list4[0].date).getDay() == 3
        ? (this.listWed = this.list4)
        : new Date(this.list4[0].date).getDay() == 4
        ? (this.listThu = this.list4)
        : new Date(this.list4[0].date).getDay() == 5
        ? (this.listFri = this.list4)
        : null;

      new Date(this.list5[0].date).getDay() == 6
        ? (this.listSat = this.list5)
        : new Date(this.list5[0].date).getDay() == 0
        ? (this.listSun = this.list5)
        : new Date(this.list5[0].date).getDay() == 1
        ? (this.listMon = this.list5)
        : new Date(this.list5[0].date).getDay() == 2
        ? (this.listTue = this.list5)
        : new Date(this.list5[0].date).getDay() == 3
        ? (this.listWed = this.list5)
        : new Date(this.list5[0].date).getDay() == 4
        ? (this.listThu = this.list5)
        : new Date(this.list5[0].date).getDay() == 5
        ? (this.listFri = this.list5)
        : null;

      new Date(this.list6[0].date).getDay() == 6
        ? (this.listSat = this.list6)
        : new Date(this.list6[0].date).getDay() == 0
        ? (this.listSun = this.list6)
        : new Date(this.list6[0].date).getDay() == 1
        ? (this.listMon = this.list6)
        : new Date(this.list6[0].date).getDay() == 2
        ? (this.listTue = this.list6)
        : new Date(this.list6[0].date).getDay() == 3
        ? (this.listWed = this.list6)
        : new Date(this.list6[0].date).getDay() == 4
        ? (this.listThu = this.list6)
        : new Date(this.list6[0].date).getDay() == 5
        ? (this.listFri = this.list6)
        : null;

      new Date(this.list7[0].date).getDay() == 6
        ? (this.listSat = this.list7)
        : new Date(this.list7[0].date).getDay() == 0
        ? (this.listSun = this.list7)
        : new Date(this.list7[0].date).getDay() == 1
        ? (this.listMon = this.list7)
        : new Date(this.list7[0].date).getDay() == 2
        ? (this.listTue = this.list7)
        : new Date(this.list7[0].date).getDay() == 3
        ? (this.listWed = this.list7)
        : new Date(this.list7[0].date).getDay() == 4
        ? (this.listThu = this.list7)
        : new Date(this.list7[0].date).getDay() == 5
        ? (this.listFri = this.list7)
        : null;

      this.isLoadingCalendar = true;
      const bodyFreeTime = {
        teacherID: this.teacherName,
      };
      teacher_information
        .listTeacherFreeTime(querystring.stringify(bodyFreeTime))
        .then((res) => {
          if (res) {
            res.teacherFreeTimeList.forEach((x) => {
              if (x.dayOfWeek == "Mon" && x.type == "Weekly") {
                this.listMon.forEach((y) => {
                  this.events.push({
                    crtdDate: x.crtdDate,
                    crtdUser: x.crtdUser,
                    dayOfMonth: x.dayOfMonth,
                    dayOfWeek: x.dayOfWeek,
                    fromTime: y.date + " " + x.fromTime,
                    lUpdDate: x.lUpdDate,
                    lUpdUser: x.lUpdUser,
                    note: x.note,
                    recordID: x.recordID,
                    teacherID: x.teacherID,
                    toTime: y.date + " " + x.toTime,
                    type: x.type,
                  });
                });
              }
              if (x.dayOfWeek == "Tue" && x.type == "Weekly") {
                this.listTue.forEach((y) => {
                  this.events.push({
                    crtdDate: x.crtdDate,
                    crtdUser: x.crtdUser,
                    dayOfMonth: x.dayOfMonth,
                    dayOfWeek: x.dayOfWeek,
                    fromTime: y.date + " " + x.fromTime,
                    lUpdDate: x.lUpdDate,
                    lUpdUser: x.lUpdUser,
                    note: x.note,
                    recordID: x.recordID,
                    teacherID: x.teacherID,
                    toTime: y.date + " " + x.toTime,
                    type: x.type,
                  });
                });
              }
              if (x.dayOfWeek == "Wed" && x.type == "Weekly") {
                this.listWed.forEach((y) => {
                  this.events.push({
                    crtdDate: x.crtdDate,
                    crtdUser: x.crtdUser,
                    dayOfMonth: x.dayOfMonth,
                    dayOfWeek: x.dayOfWeek,
                    fromTime: y.date + " " + x.fromTime,
                    lUpdDate: x.lUpdDate,
                    lUpdUser: x.lUpdUser,
                    note: x.note,
                    recordID: x.recordID,
                    teacherID: x.teacherID,
                    toTime: y.date + " " + x.toTime,
                    type: x.type,
                  });
                });
              }
              if (x.dayOfWeek == "Thu" && x.type == "Weekly") {
                this.listThu.forEach((y) => {
                  this.events.push({
                    crtdDate: x.crtdDate,
                    crtdUser: x.crtdUser,
                    dayOfMonth: x.dayOfMonth,
                    dayOfWeek: x.dayOfWeek,
                    fromTime: y.date + " " + x.fromTime,
                    lUpdDate: x.lUpdDate,
                    lUpdUser: x.lUpdUser,
                    note: x.note,
                    recordID: x.recordID,
                    teacherID: x.teacherID,
                    toTime: y.date + " " + x.toTime,
                    type: x.type,
                  });
                });
              }
              if (x.dayOfWeek == "Fri" && x.type == "Weekly") {
                this.listFri.forEach((y) => {
                  this.events.push({
                    crtdDate: x.crtdDate,
                    crtdUser: x.crtdUser,
                    dayOfMonth: x.dayOfMonth,
                    dayOfWeek: x.dayOfWeek,
                    fromTime: y.date + " " + x.fromTime,
                    lUpdDate: x.lUpdDate,
                    lUpdUser: x.lUpdUser,
                    note: x.note,
                    recordID: x.recordID,
                    teacherID: x.teacherID,
                    toTime: y.date + " " + x.toTime,
                    type: x.type,
                  });
                });
              }
              if (x.dayOfWeek == "Sat" && x.type == "Weekly") {
                this.listSat.forEach((y) => {
                  this.events.push({
                    crtdDate: x.crtdDate,
                    crtdUser: x.crtdUser,
                    dayOfMonth: x.dayOfMonth,
                    dayOfWeek: x.dayOfWeek,
                    fromTime: y.date + " " + x.fromTime,
                    lUpdDate: x.lUpdDate,
                    lUpdUser: x.lUpdUser,
                    note: x.note,
                    recordID: x.recordID,
                    teacherID: x.teacherID,
                    toTime: y.date + " " + x.toTime,
                    type: x.type,
                  });
                });
              }
              if (x.dayOfWeek == "Sun" && x.type == "Weekly") {
                this.listSun.forEach((y) => {
                  this.events.push({
                    crtdDate: x.crtdDate,
                    crtdUser: x.crtdUser,
                    dayOfMonth: x.dayOfMonth,
                    dayOfWeek: x.dayOfWeek,
                    fromTime: y.date + " " + x.fromTime,
                    lUpdDate: x.lUpdDate,
                    lUpdUser: x.lUpdUser,
                    note: x.note,
                    recordID: x.recordID,
                    teacherID: x.teacherID,
                    toTime: y.date + " " + x.toTime,
                    type: x.type,
                  });
                });
              }
              if (x.dayOfMonth != "" && x.type == "Fix") {
                this.events.push({
                  crtdDate: x.crtdDate,
                  crtdUser: x.crtdUser,
                  dayOfMonth: x.dayOfMonth,
                  dayOfWeek: x.dayOfWeek,
                  fromTime:
                    dayjs(x.dayOfMonth).format("YYYY-MM-DD") + " " + x.fromTime,
                  lUpdDate: x.lUpdDate,
                  lUpdUser: x.lUpdUser,
                  note: x.note,
                  recordID: x.recordID,
                  teacherID: x.teacherID,
                  toTime:
                    dayjs(x.dayOfMonth).format("YYYY-MM-DD") + " " + x.toTime,
                  type: x.type,
                });
              }
            });
            setTimeout(() => {
              this.isLoadingCalendar = false;
            }, 1000);
          }
        });
    },

    //  setTimeout(() => {
    //           this.isLoadingCalendar = false;
    //         }, 1000);
    viewProfile(userId) {
      this.$router.push({
        name: "account-management-view-account",
        params: { userId: userId },
      });
    },
    lisTeacher() {
      this.fromTimes = [];
      this.toTimes = [];
      this.selected.forEach((x) => {
        this.fromTimes.push(x.startTime);
        this.toTimes.push(x.endTime);
      });
      this.isLoadingPopUp = true;
      const body = {
        fromTime: this.fromTimes,
        toTime: this.toTimes,
        teacherGroupID: this.teacherGroupID,
        teacherTypeID: this.teacherTypeID,
      };
      center_managerment
        .listFreeTime(querystring.stringify(body))
        .then((res) => {
          if (res.mess.code == 200) {
            this.teacherNames = res.teacherFreeTime;
            this.isLoadingPopUp = false;
          }
        });
    },
    back() {
      localStorage.setItem("isBackFromDetailTeacherAbsenceRequest", true);
      window.history.back();
    },
    _dayjs: dayjs,
  },
};
</script>
<style lang="scss" scoped>
.success {
  width: 300px;
  position: absolute;
  right: 0;
  bottom: 5%;
  z-index: 999;
}
.edit-teacher-cover {
  width: 14px;
  height: 16px;
}
</style>
