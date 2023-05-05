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
                  <v-date-picker v-model="dateFrom" width="290" :no-title="false"></v-date-picker>
                  <v-time-picker
                    v-model="timeFrom"
                    color="primary"
                    format="24hr"
                    width="290"
                    :no-title="false"
                  >
                    <div class="d-flex justify-end pt-5 pb-5" style="margin-left: 35%">
                      <v-btn
                        outlined
                        elevation="0"
                        color="error"
                        class="mr-3"
                        @click="dropdownOpenFrom = false"
                        >Cancel</v-btn
                      >
                      <v-btn color="primary" elevation="0" class="mr-3" @click="confirmFrom()"
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
                    label="To date"
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
                      <div class="d-flex justify-end pt-5 pb-5" style="margin-left: 35%">
                        <v-btn
                          outlined
                          color="error"
                          elevation="0"
                          class="mr-3"
                          @click="dropdownOpenUntil = false"
                          >Cancel</v-btn
                        >
                        <v-btn color="primary" elevation="0" class="mr-3" @click="confirmUntil()"
                          >Confirm</v-btn
                        >
                      </div>
                    </v-time-picker>
                  </div>
                </div>
              </v-menu>
            </div>
            <div class="d-flex justify-end">
              <v-btn
                color="primary"
                class="mt-2"
                @click="request()"
                :disabled="reason && fromDate && untilDate ? false : true"
                >Request</v-btn
              >
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-app>
</template>

<script>
import dayjs from 'dayjs'
import { staff_absence } from '@/api/staff-absence.js'

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
      centerList: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
      fromDate: '',
      untilDate: '',
      fromNoFormatDate: '',
      untilNoFormatDate: '',
      userInfor: JSON.parse(localStorage.getItem('currentUser')).userInfo,
    }
  },
  methods: {
    confirmFrom() {
      this.fromDate =
        dayjs(this.dateFrom).format('DD/MM/YYYY') + (this.timeFrom ? '  ' + this.timeFrom : '')
      this.dropdownOpenFrom = false
      this.fromNoFormatDate = this.dateFrom + (this.timeFrom ? ',' + this.timeFrom : '')
      this.dropdownOpenFrom = false
    },
    confirmUntil() {
      this.untilDate =
        dayjs(this.dateUntil).format('DD/MM/YYYY') + (this.timeUntil ? '  ' + this.timeUntil : '')
      this.dropdownOpenUntil = false
      this.untilNoFormatDate = this.dateUntil + (this.timeUntil ? ',' + this.timeUntil : '')
      this.dropdownOpenUntil = false
    },
    request() {
      const body = {
        fromTime: this.fromNoFormatDate,
        toTime: this.untilNoFormatDate,
        reason: this.reason,
      }
      staff_absence.createStaffAbsence(body).then(res => {
        if (res) {
          this.checkSuccess = true
          setTimeout(() => {
            this.checkSuccess = false
            this.$router.push({
              name: 'application-leave-of-absence-request',
            })
          }, 1000)
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
</style>
