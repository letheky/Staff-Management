<template>
  <div id="account-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="d-flex justify-space-between pa-10 pb-0 py-5">
          <div>
            <h2>
              <v-icon @click="back()">arrow_back_ios</v-icon
              >{{ teacherName }} ({{ teacherCode }})
            </h2>
            <div v-if="message == 'Success'" class="success">
              <v-alert
                :value="checkSuccess"
                transition="scale-transition"
                type="success"
                style="font-size: 14px; padding: 12px"
              >
                Register free time successfully!
              </v-alert>
            </div>
          </div>
          <div>
            <router-link
              :to="{ name: 'center-management-view-detail-time-available' }"
            >
              <v-btn style="background-color: mediumblue" dark
                >Time available</v-btn
              >
            </router-link>
            <v-btn class="ml-2" @click="viewSchedule(teacherID)"
              >Schedule</v-btn
            >
          </div>
        </div>
        <div class="d-flex pa-10 py-5">
          <v-row>
            <v-col class="title-action-classes ml-8 mt-2" md="2"></v-col>
            <v-col md="3"><p>Availability for permanent classes</p></v-col>
            <v-col class="title-action-cover ml-8 mt-2" md="2"></v-col>
            <v-col md="2"><p>Availability for cover</p></v-col>
          </v-row>
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
                <v-btn outlined color="secondary" @click="setToday">
                  Today
                </v-btn>
                <v-btn text color="secondary" @click="next">
                  <v-icon> mdi-chevron-right </v-icon>
                </v-btn>
                <v-toolbar-title v-if="$refs.calendar">
                  {{ $refs.calendar.title }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
            </v-sheet>
            <v-sheet height="980">
              <v-calendar
                ref="calendar"
                v-model="focus"
                color="primary"
                :events="events"
                :event-color="getEventColor"
                event-text-color="black"
                :event-ripple="false"
                event-start="fromTime"
                event-end="toTime"
                event-name="crtdUser"
                :type="type"
                first-time="7:00"
                interval-count="17"
                :interval-format="intervalFormatter"
                @click:event="showEvent"
              >
              </v-calendar>
              <!-- <v-menu
                v-model="selectedOpen"
                :close-on-content-click="false"
                :activator="selectedElement"
                offset-x
              >
                <v-card min-width="350px" flat>
                  <v-toolbar
                    flat
                    :color="getEventColor(selectedEvent)"
                    height="40"
                  >
                    <v-toolbar-title
                      style="font-size: 14px"
                      class="font-weight-bold"
                    >
                      {{ _dayjs(selectedEvent.startTime).format("DD/MM/YYYY") }}
                      : {{ selectedEvent.className }}</v-toolbar-title
                    >
                  </v-toolbar>
                  <v-card-text>
                    <div>className: {{ selectedEvent.className }}</div>
                    <div>courseName: {{ selectedEvent.courseName }}</div>
                    <div>room: {{ selectedEvent.room }}</div>
                    <div>
                      time:
                      {{ _dayjs(selectedEvent.startTime).format("HH:MM") }} -
                      {{ _dayjs(selectedEvent.endTime).format("HH:MM") }}
                    </div>
                    <div>teacher: {{ selectedEvent.teacher }}</div>
                    <div>orgTeacher: {{ selectedEvent.orgTeacher }}</div>
                    <div>status: {{ selectedEvent.status }}</div>
                  </v-card-text>
                </v-card>
              </v-menu> -->
            </v-sheet>
          </div>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { center_managerment } from "@/api/center-management.js";

const querystring = require("querystring");
export default {
  components: {},
  data() {
    return {
      isLoading: false,
      focus: "",
      type: "week",
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      recordID: this.$route.params.recordId,
      teacherID: "",
      time: null,
      weekDay: "",
      weekDayPop: "",
      weekDays: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      typeAddTime: null,
      addTimeDialog: false,
      addTimeAvailableDialog: false,
      fromTime: "",
      fromTimePicker: false,
      toTime: "",
      toTimePicker: false,
      fromTimePop: "",
      fromTimePickerPop: false,
      toTimePop: "",
      toTimePickerPop: false,
      picker: "",
      weekDayPicked: null,
      fromDate: "",
      checkPermanent: true,
      checkCover: false,
      dragEvent: null,
      dragStart: null,
      createEvent: null,
      createStart: null,
      extendOriginal: null,
      checkSuccess: false,
      message: "",
      teacherName: "",
      teacherCode: "",
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
    this.init();
  },
  mounted() {
    // this.$refs.calendar.checkChange();
    this.getCalendar();
  },
  methods: {
    back() {
      window.history.back();
    },
    getEventColor(event) {
      if (event.type == "Weekly") {
        return "#c4faa2";
      } else {
        return "#FEE4E2";
      }
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
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
    viewSchedule(teacherId) {
      this.$router.push({
        name: "center-management-view-schedule",
        params: { teacherId: teacherId },
      });
    },
    async getCalendar() {
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

      this.isLoading = true;
      const body = {
        recordID: this.recordID,
        // fromDate: dayjs().add(-6, "month").format("YYYY-MM-DD"),
        // toDate: dayjs().add(6, "month").format("YYYY-MM-DD"),
      };
      await center_managerment
        .listTeacherFreeTime(querystring.stringify(body))
        .then((res) => {
          if (res) {
            res.teacherFreeTimeList.forEach((x) => {
              if (this.recordID == x.recordID) {
                this.teacherName = x.teacher;
                this.teacherCode = x.teacherCode;
                this.teacherID = x.teacherID;
              }
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
          }
        });
      this.isLoading = false;
    },
    _dayjs: dayjs,
  },
};
</script>
<style lang="scss" scoped>
header.v-sheet {
  border-bottom: 0;
}
.button-permanent-classes {
  border-radius: 1rem;
  background-color: lightgreen !important;
}
.button-cover {
  border-radius: 1rem;
  background-color: lightcoral !important;
}
.add-time-button-active {
  background-color: #e6edfa !important;
  color: #2f72ed;
  border-radius: 1.2rem;
  padding: 4px;
  text-align: center;
}
.add-time-button {
  background-color: white !important;
  border-radius: 1.2rem;
  padding: 4px;
  text-align: center;
}
.success {
  width: 300px;
  position: absolute;
  right: 0;
  top: 5%;
  z-index: 999;
}
.title-action-classes {
  background-color: #c4faa2;
  height: 30px;
  max-width: 80px;
  border-radius: 0.25rem;
}
.title-action-cover {
  background-color: #fee4e2;
  height: 30px;
  max-width: 80px;
  border-radius: 0.25rem;
}
</style>
