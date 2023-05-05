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
          <div class="pb-2">
            <v-btn @click="viewTimeAvailable()">Time available</v-btn>
            <v-btn style="background-color: mediumblue" dark class="ml-2"
              >Schedule</v-btn
            >
          </div>
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
                <v-btn
                  outlined
                  class="mr-4"
                  color="secondary"
                  @click="setToday"
                >
                  Today
                </v-btn>
                <v-btn text color="secondary" @click="prev">
                  <v-icon> mdi-chevron-left </v-icon>
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
                event-start="startTime"
                event-end="endTime"
                event-name="className"
                :type="type"
                first-time="7:00"
                interval-count="17"
                :interval-format="intervalFormatter"
                @click:event="showEvent"
              >
                @change="updateRange"
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
                    <!-- <div>className: {{ selectedEvent.className }}</div> -->
                    <div>Course: {{ selectedEvent.courseName }}</div>
                    <div>Room: {{ selectedEvent.room }}</div>
                    <div>
                      Time:
                      {{ _dayjs(selectedEvent.startTime).format("HH:MM") }} -
                      {{ _dayjs(selectedEvent.endTime).format("HH:MM") }}
                    </div>
                    <!-- <div>teacher: {{ selectedEvent.teacher }}</div>
                    <div>orgTeacher: {{ selectedEvent.orgTeacher }}</div>
                    <div>status: {{ selectedEvent.status }}</div> -->
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
import dayjs from "dayjs";
import { teacher_information } from "@/api/teacher-information.js";

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
      teacherID: this.$route.params.teacherId,
      teacherName: "",
      teacherCode: "",
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
      this.$router.push({ name: "center-management-time-available" });
    },
    getEventColor(event) {
      if (event.orgTeacherID == this.teacherID && event.teacherID != null) {
        return "red";
      } else if (event.teacherID == this.teacherID) {
        return "blue";
      } else {
        return "other";
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
    viewTimeAvailable() {
      window.history.back();
    },
    async getCalendar() {
      this.isLoading = true;
      const body = {
        teacherID: this.teacherID,
        fromDate: dayjs().add(-6, "month").format("YYYY-MM-DD"),
        toDate: dayjs().add(6, "month").format("YYYY-MM-DD"),
      };
      await teacher_information
        .getTeacherCalendar(querystring.stringify(body))
        .then((res) => {
          if (res.mess.code == 200) {
            this.events = res.schedue;
            res.schedue.forEach((x) => {
              this.teacherName = x.teacher;
              this.teacherCode = x.teacherCode;
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
