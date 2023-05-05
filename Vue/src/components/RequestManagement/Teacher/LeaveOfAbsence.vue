<template>
  <div id="center-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <div class="d-flex justify-space-between">
            <h2>Teacher leave of absence request list</h2>
          </div>
          <v-row class="pt-5">
            <v-col md="3">
              <!-- <date-picker
                :model="fromDate"
                @update:model="updateFromDate"
                title="From date"
              ></date-picker> -->
              <v-text-field
                type="date"
                label="From date"
                v-model="fromDate"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col md="3">
              <!-- <date-picker
                :model="toDate"
                @update:model="updateToDate"
                title="To date"
              ></date-picker> -->
              <v-text-field
                type="date"
                label="To date"
                v-model="toDate"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col>
              <v-btn
                color="primary"
                dense
                elevation="1"
                @click="search()"
                class="pl-5 pr-5"
                :disabled="fromDate && toDate ? false : true"
                >Search</v-btn
              >
            </v-col>
          </v-row>
          <div class="pt-2 pb-5">
            <v-btn
              outlined
              color="primary"
              class="mr-5"
              :disabled="selected.filter(x => x.status == 'PENDING').length > 0 ? false : true"
              v-if="selected.filter(x => x.status == 'PENDING').length > 0"
              @click="
                approvedOrReject = 'APPROVED'
                confirmMultiApproveOrReject()
              "
            >
              <v-icon color="success" small>mdi-check</v-icon>Approve all selected requests
            </v-btn>

            <v-btn
              outlined
              color="error"
              :disabled="selected.filter(x => x.status == 'PENDING').length > 0 ? false : true"
              v-if="selected.filter(x => x.status == 'PENDING').length > 0"
              @click="
                approvedOrReject = 'REJECTED'
                confirmMultiApproveOrReject()
              "
            >
              <v-icon color="error" small>mdi-close</v-icon>Reject all selected requests
            </v-btn>
          </div>
          <v-progress-linear
            v-if="isLoading"
            indeterminate
            color="primary"
            class="my-10"
          ></v-progress-linear>
          <div class="pb-10">
            <v-data-table
              v-if="!isLoading"
              :headers="headers"
              :items="teacherlistabsence"
              :page.sync="page"
              :items-per-page="itemsPerPage"
              hide-default-footer
              @page-count="pageCount = $event"
              show-select
              show-expand
              v-model="selected"
              item-key="recordID"
              class="elevation-1"
              fixed-header
              height="60vh"
            >
              <template v-slot:[`item.data-table-select`]="{ on, props, item }">
                <v-checkbox
                  :disabled="item.status == 'PENDING' ? false : true"
                  v-if="item.status == 'PENDING'"
                  color="secondary"
                  :ripple="false"
                  v-model="selected"
                  :value="item.status == 'PENDING' ? item : ''"
                  v-bind="props"
                  v-on="on"
                ></v-checkbox>
              </template>
              <template v-slot:[`expanded-item`]="{ item, headers }">
                <td :colspan="headers.length">
                  <v-data-table
                    :headers="headerClassList"
                    :items="item.classes"
                    :items-per-page="1000"
                    hide-default-footer
                    :height="item.classes && item.classes.length > 0 ? '200px' : '100px'"
                    class="elevation-1"
                    style="background: rgba(196, 196, 196, 0.2)"
                    fixed-header
                  >
                    <template v-slot:[`item.no`]="{ index }">
                      {{ index + 1 }}
                    </template>
                    <template v-slot:[`item.className`]="{ item }">
                      {{ item.className }}
                    </template>
                    <template v-slot:[`item.classCode`]="{ item }">
                      {{ item.classCode }}
                    </template>
                    <template v-slot:[`item.shift`]="{ item }">
                      {{ item.shift }}
                    </template>
                    <template v-slot:[`item.coverTeacher`]="{ item }">
                      {{ item.coverTeacher }}
                    </template>
                  </v-data-table>
                </td>
              </template>
              <template v-slot:[`item.no`]="{ index }">
                {{ index + 1 }}
              </template>

              <template v-slot:[`item.fullName`]="{ item }">{{ item.fullName }} </template>

              <template v-slot:[`item.reason`]="{ item }">{{ item.reason }} </template>

              <template v-slot:[`item.fromTime`]="{ item }">
                {{ _dayjs(item.fromTime).format('DD/MM/YYYY HH:mm') }}
              </template>

              <template v-slot:[`item.toTime`]="{ item }">
                {{ _dayjs(item.toTime).format('DD/MM/YYYY HH:mm') }}
              </template>

              <template v-slot:[`item.status`]="{ item }">
                <v-chip text-color="blue" small v-if="item.status === 'PENDING'">{{
                  item.status
                }}</v-chip>
                <v-chip text-color="error" small v-if="item.status === 'REJECTED'">{{
                  item.status
                }}</v-chip>
                <v-chip text-color="success" small v-if="item.status === 'APPROVED'">{{
                  item.status
                }}</v-chip>
              </template>

              <template v-slot:[`item.action`]="{ item }">
                <div class="d-flex">
                  <v-icon
                    size="18"
                    color="primary"
                    @click="viewDetail(item.teacherID, item.fromTime, item.toTime, item.recordID)"
                    >mdi-eye</v-icon
                  >
                  <v-icon
                    color="success"
                    size="18"
                    v-if="item.status == 'PENDING'"
                    @click="
                      approvedOrReject = 'APPROVED'
                      recordID = item.recordID
                      $refs.confirmRejectOrApproved.open()
                    "
                    >mdi-check</v-icon
                  >
                  <v-icon
                    size="18"
                    color="error"
                    v-if="item.status == 'PENDING'"
                    @click="
                      approvedOrReject = 'REJECTED'
                      recordID = item.recordID
                      $refs.confirmRejectOrApproved.open()
                    "
                    >mdi-close</v-icon
                  >
                </div>
              </template>
            </v-data-table>
          </div>
        </div>
      </v-col>
    </v-row>
    <div v-if="!isLoading" color="#fff" class="w-100 pl-10 pr-10">
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
        <v-col md="4" class="d-flex align-center justify-end">
          <h3 v-if="teacherlistabsence.length > 1">
            Total: {{ teacherlistabsence.length }} teachers
          </h3>
          <h3 v-else>Total: {{ teacherlistabsence.length }} teacher</h3>
        </v-col>
        <v-col md="6" class="d-flex justify-end">
          <v-pagination
            v-model="page"
            :length="pageCount"
            :total-visible="7"
            elevation="0"
          ></v-pagination>
        </v-col>
      </v-row>
    </div>
    <popup-confirm
      @confirm="confirmRejectOrApproved"
      @cancel="cancelRejectOrApproved"
      :maxWidth="maxWidth"
      :width="width"
      :confirmColor="approvedOrReject == 'REJECTED' ? 'error' : 'success'"
      ref="confirmRejectOrApproved"
    >
      <v-card-title
        style="display: flex; flex-direction: column"
        slot="icon"
        class="pt-0"
        v-if="approvedOrReject == 'REJECTED'"
      >
        <v-icon x-large color="error" class="mb-5" outline>mdi-close-circle</v-icon>
      </v-card-title>
      <v-card-title
        style="display: flex; flex-direction: column"
        slot="title"
        class="pt-0 mb-5"
        v-if="approvedOrReject == 'REJECTED'"
      >
        <h2 class="text-center">Confirm reject</h2>
        <p class="text-center">Are you sure to reject request?</p>
      </v-card-title>
      <v-card-title
        style="display: flex; flex-direction: column"
        slot="icon"
        class="pt-0"
        v-if="approvedOrReject == 'APPROVED'"
      >
        <v-icon x-large color="success" outline class="mb-5">mdi-checkbox-marked-circle</v-icon>
      </v-card-title>
      <v-card-title
        style="display: flex; flex-direction: column"
        slot="title"
        class="pt-0 mb-5"
        v-if="approvedOrReject == 'APPROVED'"
      >
        <h2 class="text-center">Confirm approved</h2>
        <p class="text-center">Are you sure to approved request?</p>
      </v-card-title>
      <v-card-actions> </v-card-actions>
    </popup-confirm>
    <v-row justify="center">
      <v-dialog v-model="errorDialog" persistent width="350">
        <v-card class="mx-auto pa-10">
          <div class="text-center">
            <h1>Error!</h1>
            <p>{{ message.messages.UNKNOWN_ERROR }}</p>
          </div>
          <div class="text-center">
            <v-btn color="error" elevation="0" @click="back()" outlined> Back </v-btn>
          </div>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { center_managerment } from '@/api/center-management.js'
import PopupConfirm from '@/components/Utils/PopupConfirm.vue'
import message from '@/components/Utils/message'
export default {
  components: {
    'popup-confirm': PopupConfirm,
  },
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      dropdownOpenFrom: false,
      dropdownOpenTo: false,
      fromDate: '',
      toDate: '',
      selected: [],
      classList: [],
      isLoading: false,
      approvedOrReject: '',
      maxWidth: 1000,
      width: 400,
      headers: [
        {
          text: 'No',
          align: 'start',
          value: 'no',
          sortable: false,
          width: '5%',
        },
        {
          text: 'Teacher',
          value: 'fullName',
          sortable: false,
          width: '25%',
        },
        {
          text: 'Reason for leave of absence',
          value: 'reason',
          sortable: false,
          width: '30%',
        },
        { text: 'From', value: 'fromTime', sortable: false, width: '15%' },
        {
          text: 'Until',
          value: 'toTime',
          sortable: false,
          width: '15%',
        },
        {
          text: 'Status',
          value: 'status',
          sortable: false,
          width: '10%',
        },
        { text: 'Action', value: 'action', sortable: false, width: '15%' },
      ],
      headerClassList: [
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
          width: '5%',
        },
        {
          text: 'Course',
          value: 'classCode',
          sortable: false,
          width: '5%',
        },
        {
          text: 'Shift',
          value: 'shift',
          sortable: false,
          width: '5%',
        },
        {
          text: 'Cover teachers',
          value: 'coverTeacher',
          sortable: false,
          width: '5%',
        },
      ],
      currentUser: JSON.parse(localStorage.getItem('currentUser')),
      currentCenter: JSON.parse(localStorage.getItem('currentCenter')),
      teacherlistabsence: [],
      recordID: '',
      recordIDS: [],
      fromDateOfTeacherAbsenceRequest: localStorage.getItem('fromDateOfTeacherAbsenceRequest'),
      toDateOfTeacherAbsenceRequest: localStorage.getItem('toDateOfTeacherAbsenceRequest'),
      isBackFromDetailTeacherAbsenceRequest:
        localStorage.getItem('isBackFromDetailTeacherAbsenceRequest') || null,
      errorDialog: false,
      message: message,
    }
  },
  created() {
    if (!this.isBackFromDetailTeacherAbsenceRequest) {
      this.fromDate = dayjs()
        .add(-parseInt(dayjs().add(-1, 'day').format('DD')), 'day')
        .format('YYYY-MM-DD')
      this.toDate = dayjs().format('YYYY-MM-DD')
    } else {
      this.fromDate = this.fromDateOfTeacherAbsenceRequest
      this.toDate = this.toDateOfTeacherAbsenceRequest
    }
    this.init()
  },
  watch: {
    selected: function (value) {
      value.forEach(x => {
        if (x.status == 'PENDING') {
          // this.selected.push(x);
          console.log(x)
        }
      })
    },
  },
  methods: {
    async init() {
      this.isLoading = true
      await center_managerment
        .leaveAdminAbsence(this.fromDate, this.toDate, 4)
        .then(res => {
          if (res.mess && res.mess.code == 200) {
            this.teacherlistabsence = res.teacher
            this.teacherlistabsence.forEach(x => {
              if (x.status == null) {
                x.status = 'PENDING'
              }
            })
          } else {
            this.errorDialog = true
          }
        })
        .catch(() => {
          this.errorDialog = true
        })
      this.isLoading = false
    },
    search() {
      this.init()
    },
    cancelRejectOrApproved() {},
    confirmRejectOrApproved() {
      center_managerment.adminApprovedAbsence(this.recordID, this.approvedOrReject).then(res => {
        if (res) {
          this.init()
        }
      })
    },
    confirmMultiApproveOrReject() {
      this.selected.forEach(x => {
        if (x.status == 'PENDING') {
          this.recordIDS.push(x.recordID)
        }
      })
      center_managerment.adminApprovedAbsence(this.recordIDS, this.approvedOrReject).then(res => {
        if (res) {
          this.init()
          this.selected = []
        }
      })
    },
    viewDetail(teacherID, fromTime, toTime, recordID) {
      localStorage.setItem('fromDateOfTeacherAbsenceRequest', this.fromDate)
      localStorage.setItem('toDateOfTeacherAbsenceRequest', this.toDate)
      localStorage.removeItem('isBackFromDetailTeacherAbsenceRequest')
      this.$router.push({
        name: 'teacher-leave-absence-request-detail',
        params: {
          teacherID: teacherID,
          fromTime: fromTime,
          toTime: toTime,
          recordID: recordID,
        },
      })
    },
    updateFromDate(event) {
      this.fromDate = event
    },
    updateToDate(event) {
      this.toDate = event
    },
    back() {
      window.history.back()
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped></style>
