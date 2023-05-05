<template>
  <v-app>
    <div id="center-management">
      <v-row no-gutters>
        <v-col md="12">
          <div class="pa-10 pt-5">
            <div class="d-flex justify-space-between">
              <h2 class="d-flex">
                <v-icon @click="back()">arrow_back_ios</v-icon>
                <div class="d-flex align-center">Request a leave of absence</div>
              </h2>
            </div>
            <div class="success">
              <v-alert
                :value="checkSuccess"
                transition="scale-transition"
                type="success"
                style="font-size: 14px; padding: 12px"
              >
                Create absence successfully
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
              <!-- <v-menu
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
                    color="primary"
                    format="24hr"
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
              </v-menu> -->
              <v-text-field
                type="datetime-local"
                label="From Time"
                style="background: white"
                v-model="dateFrom"
                outlined
                hide-details
              />

              <v-text-field
                type="datetime-local"
                label="To Time"
                style="background: white"
                v-model="dateUntil"
                outlined
                hide-details
              />

              <!-- <v-menu
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
              </v-menu> -->
              <!-- <v-icon
                color="primary"
                x-large
                :disabled="dateFrom && dateUntil ? false : true"
                @click="
                  showView = true;
                  viewAbsence();
                "
                >mdi-alert-circle</v-icon
              > -->
              <v-btn
                color="primary"
                class="ml-3 mt-2"
                @click="request()"
                :disabled="reason && dateFrom && dateUntil ? false : true"
                >Request</v-btn
              >
            </div>
            <div v-if="reason && dateFrom && dateUntil">
              <h3 class="text-view pt-5 pb-5" @click="viewAbsence()">
                View my schedule
                <span>from {{ _dayjs(dateFrom).format('DD/MM/YYYY, HH:mm') }}</span>
                <span> to {{ _dayjs(dateUntil).format('DD/MM/YYYY, HH:mm') }}</span>
              </h3>
              <v-data-table
                :headers="headers"
                :items="lisAbsenceDetail"
                :page.sync="page"
                :items-per-page="itemsPerPage"
                hide-default-footer
                @page-count="pageCount = $event"
                class="elevation-0"
              >
                <template v-slot:[`item.no`]="{ index }">
                  {{ index + 1 }}
                </template>

                <template v-slot:[`item.date`]="{ item }">
                  {{ _dayjs(item.date).format('YYYY-MM-DD') }}
                </template>
              </v-data-table>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-footer fixed absolute height="60" color="#fff" class="pl-10 pr-10">
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
            <v-pagination v-model="page" :length="pageCount" elevation="0"></v-pagination>
          </v-col>
          <v-col class="d-flex justify-end"> </v-col>
        </v-row>
      </v-footer>
    </div>
  </v-app>
</template>

<script>
import dayjs from 'dayjs'
import { teacher_absence } from '@/api/teacher-absence.js'
import { teacher_information } from '@/api/teacher-information.js'
const querystring = require('querystring')

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
      timeFrom: '',
      dateUntil: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      timeUntil: '',
      dropdownOpenFrom: false,
      dropdownOpenUntil: false,
      checkSuccess: false,
      reason: '',
      headers: [
        {
          text: 'No',
          align: 'start',
          value: 'no',
          sortable: false,
          width: '5%',
        },
        {
          text: 'Class',
          value: 'className',
          sortable: false,
          width: '20%',
        },
        { text: 'Course', value: 'courseName', sortable: false, width: '12%' },
        { text: 'Date', value: 'date', sortable: false, width: '15%' },
        {
          text: 'Class time',
          value: 'classTime',
          sortable: false,
          width: '15%',
        },
        {
          text: 'Hrs Taugh',
          value: 'hrsTaugh',
          sortable: false,
          width: '15%',
        },
        { text: 'Fee/hrs', value: 'feehrs', sortable: false, width: '10%' },
      ],
      centerList: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
      fromDate: '',
      untilDate: '',
      fromNoFormatDate: '',
      untilNoFormatDate: '',
      showView: false,
      lisAbsenceDetail: [],
      userInfor: JSON.parse(localStorage.getItem('currentUser')).userInfo,
    }
  },
  methods: {
    viewDetail(centerId) {
      this.$router.push({
        name: 'center-management-detail',
        params: { centerId: centerId },
      })
    },
    // confirmFrom() {
    //   this.fromDate =
    //     dayjs(this.dateFrom).format("DD/MM/YYYY") +
    //     (this.timeFrom ? "  " + this.timeFrom : "");
    //   this.dropdownOpenFrom = false;
    //   this.fromNoFormatDate =
    //     this.dateFrom + (this.timeFrom ? "," + this.timeFrom : "");
    //   this.dropdownOpenFrom = false;
    // },
    // confirmUntil() {
    //   this.untilDate =
    //     dayjs(this.dateUntil).format("DD/MM/YYYY") +
    //     (this.timeUntil ? "  " + this.timeUntil : "");
    //   this.dropdownOpenUntil = false;
    //   this.untilNoFormatDate =
    //     this.dateUntil + (this.timeUntil ? "," + this.timeUntil : "");
    //   this.dropdownOpenUntil = false;
    // },
    request() {
      teacher_absence.registerAbsence(this.dateFrom, this.dateUntil, this.reason).then(res => {
        if (res) {
          this.checkSuccess = true
          setTimeout(() => {
            this.checkSuccess = false
            this.$router.push({
              name: 'my-calendar-leave-of-absence-history',
            })
          }, 1000)
        }
      })
    },
    viewAbsence() {
      const body = {
        teacherID: this.userInfor.teacherID,
        fromDate: dayjs(this.dateFrom).format('YYYY-MM-DD'),
        toDate: dayjs(this.dateUntil).format('YYYY-MM-DD'),
      }
      teacher_information.getTeacherCalendar(querystring.stringify(body)).then(res => {
        if (res.mess.code == 200) {
          this.lisAbsenceDetail = res.schedue
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
  top: 5%;
  z-index: 999;
}
.text-view {
  color: #246aff;
  text-decoration: underline;
  cursor: pointer;
}
</style>
