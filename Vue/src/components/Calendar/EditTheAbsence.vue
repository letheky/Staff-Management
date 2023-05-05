<template>
  <v-app>
    <div id="center-management">
      <v-row no-gutters>
        <v-col md="12">
          <div class="pa-10 pt-5">
            <div class="d-flex justify-space-between">
              <h2 class="d-flex">
                <v-icon @click="back()">arrow_back_ios</v-icon>
                <div class="d-flex align-center">
                  Request a leave of absence
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
                Update absence successfully
              </v-alert>
            </div>
            <div class="pt-5">
              <v-textarea
                outlined
                label="Reason for leave of absence"
                v-model="reason"
                value=""
              ></v-textarea>
            </div>
            <div class="d-flex">
              <v-menu
                transition="scale-transition"
                offset-y
                :close-on-content-click="false"
                v-model="dropdownOpenFrom"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    outlined
                    label="From date"
                    class="mr-2"
                    v-model="fromDate"
                    hide-details
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <div class="d-flex">
                  <v-date-picker
                    v-model="dateFrom"
                    width="290"
                    :no-title="false"
                  ></v-date-picker>
                  <v-time-picker
                    v-model="timeFrom"
                    format="24hr"
                    color="primary"
                    width="290"
                    :no-title="false"
                  >
                    <div
                      class="d-flex justify-end pt-5 pb-5"
                      style="margin-left: 35%"
                    >
                      <v-btn
                        outlined
                        elevation="0"
                        color="error"
                        class="mr-3"
                        @click="dropdownOpenFrom = false"
                        >Cancel</v-btn
                      >
                      <v-btn
                        color="primary"
                        elevation="0"
                        class="mr-3"
                        @click="confirmFrom()"
                        >Confirm</v-btn
                      >
                    </div>
                  </v-time-picker>
                </div>
              </v-menu>

              <v-menu
                transition="scale-transition"
                offset-y
                :close-on-content-click="false"
                v-model="dropdownOpenUntil"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    outlined
                    label="To Date"
                    class="ml-2"
                    v-model="untilDate"
                    hide-details
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <div>
                  <div class="d-flex">
                    <v-date-picker
                      v-model="dateUntil"
                      width="290"
                      :no-title="false"
                    ></v-date-picker>
                    <v-time-picker
                      v-model="timeUntil"
                      format="24hr"
                      color="primary"
                      width="290"
                      :no-title="false"
                    >
                      <div
                        class="d-flex justify-end pt-5 pb-5"
                        style="margin-left: 35%"
                      >
                        <v-btn
                          outlined
                          color="error"
                          elevation="0"
                          class="mr-3"
                          @click="dropdownOpenUntil = false"
                          >Cancel</v-btn
                        >
                        <v-btn
                          color="primary"
                          elevation="0"
                          class="mr-3"
                          @click="confirmUntil()"
                          >Confirm</v-btn
                        >
                      </div>
                    </v-time-picker>
                  </div>
                </div>
              </v-menu>
              <v-icon
                color="primary"
                x-large
                :disabled="fromDate && untilDate ? false : true"
                @click="showView = true"
                >mdi-alert-circle</v-icon
              >
              <v-btn
                color="primary"
                class="mr-3 mt-2"
                @click="request()"
                :disabled="reason && fromDate && untilDate ? false : true"
                >Request</v-btn
              >
            </div>
            <div v-if="showView === true">
              <h3 class="pt-5 pb-5">
                View my schedule
                <span v-if="fromDate">from {{ fromDate }}</span>
                <span v-if="untilDate"> to {{ untilDate }}</span>
              </h3>
              <v-data-table
                :headers="headers"
                :items="lisAbsenceDetail"
                :page.sync="page"
                :items-per-page="itemsPerPage"
                hide-default-footer
                @page-count="pageCount = $event"
                class="elevation-0"
                height="60vh"
                fixed-header
              >
                <template v-slot:[`item.no`]="{ index }">
                  {{ index + 1 }}
                </template>

                <template v-slot:[`item.date`]="{ item }">
                  {{ _dayjs(item.date).format("YYYY-MM-DD") }}
                </template>

                <template v-slot:[`item.status`]="{}">
                  <v-chip text-color="blue" small>pending</v-chip>
                </template>

                <template v-slot:[`item.action`]="{ item }">
                  <div class="d-flex">
                    <i
                      @click="editClass(item.classID)"
                      class="isax isax-edit-2 fs-18 font-weight-bold mr-4"
                    ></i>
                    <v-icon size="18" color="primary">visibility</v-icon>
                  </div>
                </template>
              </v-data-table>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-footer height="60" color="#fff" class="pl-10 pr-10" width="95%">
        <v-row>
          <v-col md="2" v-if="showView === true">
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
          <v-col md="10" class="d-flex justify-end" v-if="showView === true">
            <v-pagination
              v-model="page"
              :length="pageCount"
              elevation="0"
            ></v-pagination>
          </v-col>
          <v-col class="d-flex justify-end"> </v-col>
        </v-row>
      </v-footer>
    </div>
  </v-app>
</template>

<script>
import dayjs from "dayjs";
import { teacher_absence } from "@/api/teacher-absence.js";
import { teacher_information } from "@/api/teacher-information.js";
const querystring = require("querystring");

export default {
  components: {},
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      dateFrom: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      timeFrom: "",
      dateUntil: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      timeUntil: "",
      dropdownOpenFrom: false,
      dropdownOpenUntil: false,
      checkSuccess: false,
      reason: "",
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
          width: "20%",
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
          text: "Hrs Taugh",
          value: "hrsTaugh",
          sortable: false,
          width: "15%",
        },
        {
          text: "Fee/hrs",
          value: "salaryPerHrs",
          sortable: false,
          width: "10%",
        },
      ],
      centerList: JSON.parse(localStorage.getItem("currentUser"))
        .locationPermissions,
      fromDate: "",
      untilDate: "",
      fromNoFormatDate: "",
      untilNoFormatDate: "",
      showView: false,
      recordID: this.$route.params.recordID,
      leaveOfAbsence: "",
      userInfor: JSON.parse(localStorage.getItem("currentUser")).userInfo,
      lisAbsenceDetail: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await teacher_absence
        .leaveAbsence(this.userInfor.teacherID)
        .then((res) => {
          if (res.mess.code == 200) {
            res.teacherAbsence.forEach((x) => {
              if (this.recordID == x.recordID) {
                this.reason = x.reason;
                this.fromDate = dayjs(x.fromTime).format(
                  "DD/MM/YYYY  HH:mm:ss"
                );
                this.untilDate = dayjs(x.toTime).format("DD/MM/YYYY  HH:mm:ss");
                this.fromNoFormatDate = dayjs(x.fromTime).format(
                  "YYYY-MM-DD,hh:mm:ss"
                );
                this.untilNoFormatDate = dayjs(x.toTime).format(
                  "YYYY-MM-DD,hh:mm:ss"
                );
              }
            });
          }
        });
      const body = {
        teacherID: this.userInfor.teacherID,
        fromDate: dayjs(this.fromNoFormatDate).format("YYYY-MM-DD"),
        toDate: dayjs(this.untilNoFormatDate).format("YYYY-MM-DD"),
      };
      await teacher_information
        .getTeacherCalendar(querystring.stringify(body))
        .then((res) => {
          if (res.mess.code == 200) {
            this.lisAbsenceDetail = res.schedue;
          }
        });
    },
    confirmFrom() {
      this.fromDate =
        dayjs(this.dateFrom).format("DD/MM/YYYY") +
        (this.timeFrom ? "," + this.timeFrom : "");
      this.dropdownOpenFrom = false;
      this.fromNoFormatDate =
        this.dateFrom + (this.timeFrom ? "," + this.timeFrom : "");
      this.dropdownOpenFrom = false;
    },
    confirmUntil() {
      this.untilDate =
        dayjs(this.dateUntil).format("DD/MM/YYYY") +
        (this.timeUntil ? "," + this.timeUntil : "");
      this.dropdownOpenUntil = false;
      this.untilNoFormatDate =
        this.dateUntil + (this.timeUntil ? "," + this.timeUntil : "");
      this.dropdownOpenUntil = false;
    },
    request() {
      teacher_absence
        .updateAbsence(
          this.recordID,
          this.fromNoFormatDate,
          this.untilNoFormatDate,
          this.reason
        )
        .then((res) => {
          if (res.code == 200) {
            this.checkSuccess = true;
            setTimeout(() => {
              this.checkSuccess = false;
              this.$router.push({
                name: "my-calendar-leave-of-absence-history",
              });
            }, 1000);
          }
        });
    },
    back() {
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
  top: 5%;
  z-index: 999;
}
</style>
