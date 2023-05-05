<template>
  <div class="absent">
    <v-row no-gutters>
      <v-col md="12">
        <div class="d-flex justify-space-between">
          <h2 class="d-flex">
            <v-icon @click="back()">arrow_back_ios</v-icon>
            <div class="d-flex align-center">Registration Statement Report</div>
          </h2>
        </div>
      </v-col>
    </v-row>
    <v-row :class="'absent-header justify-space-between align-center'">
      <v-col>
        <div :class="' d-flex justify-start'">
          <v-select
            v-model="locationID"
            item-text="location"
            append-icon="keyboard_arrow_down"
            item-value="locationID"
            :items="listLocation"
            label="Center"
            outlined
            :class="'select-input'"
            dense
          ></v-select>
          <v-select
            v-model="registrationStatusID"
            item-text="registrationStatus"
            append-icon="keyboard_arrow_down"
            item-value="registrationStatusID"
            :items="listRegStatus"
            label="Status"
            outlined
            :class="'select-input'"
            dense
          ></v-select>
          <v-text-field
            type="date"
            v-model="fromDate"
            label="From date"
            :class="'select-input'"
            outlined
            dense
            hide-details
            @input="changeDate"
          />
          <v-text-field
            type="date"
            v-model="toDate"
            label="To date"
            :class="'select-input'"
            outlined
            dense
            hide-details
            @input="changeDate"
          /></div
      ></v-col>
    </v-row>
    <h4>Total : {{ filtered.length }} students</h4>
    <template v-if="loading">
      <div class="pa-6">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </div>
    </template>
    <template>
      <v-data-table
        :headers="logHeaders"
        :items="filtered"
        v-if="!loading"
        :page.sync="page1"
        :items-per-page="itemsPerPage1"
        @page-count="pageCount = $event"
        hide-default-footer
        hide-default-header
        class="elevation-0 mb-5 mt-4 pts-table"
        :id="'pts-table'"
        fixed-header
        height="69vh"
        :scroll-left.camel="1000"
      >
        <template v-slot:header="{ props }">
          <thead class="v-data-table-header">
            <tr class="header-commnent">
              <th
                v-for="(header, index) in props.headers"
                :key="header.text + '' + index"
                role="columnheader"
                scope="col"
                class="text-center font-weight-light headTitle"
              >
                <span style="color: white">{{ header.text }}</span>
              </th>
            </tr>
          </thead>
          <tr class="f">
            <td
              v-for="header in props.headers"
              :key="header.value"
              :style="{
                position: 'sticky',
                top: '50px',
                background: '#ffff',
                borderBottom: '1px solid  #d1d4d4',
              }"
            >
              <div :class="'d-flex justify-center'" v-if="filters[header.value]">
                <Autocomplete
                  v-if="filters.hasOwnProperty(header.value)"
                  @setFilter="setFilter"
                  :styleBorder="''"
                  placeholder="select"
                  :keyFilter="header.value"
                  :selectedInit="filters[header.value]"
                  :listItem="
                    header.value === 'note'
                      ? ['Note', 'No Note']
                      : groupColumnValueList(header.value)
                  "
                />
              </div>
              <div v-else>
                <td></td>
              </div>
            </td>
          </tr>
        </template>
        <template v-slot:body="{ items }">
          <tbody v-if="filtered.length === 0" style="text-align: center">
            <div class="pt-3" style="position: absolute; left: 50%; transform: translate(-50%, 0)">
              No data available
            </div>
          </tbody>
          <tbody v-else>
            <tr v-for="(item, index) in items" :key="index">
              <template>
                <td>
                  <p>{{ index + 20 * (page1 - 1) + 1 }}</p>
                </td>
                <td>
                  <p
                    @click="viewStudent(item.stu_UserID)"
                    :style="{ textAlign: 'center' }"
                    class="link"
                  >
                    {{ item.studentCode }}
                  </p>
                </td>
                <td>
                  <p
                    @click="viewStudent(item.stu_UserID)"
                    class="link"
                    :style="{ textAlign: 'center' }"
                  >
                    {{ item.studentName }}
                  </p>
                </td>
                <td :style="{ textAlign: 'center' }">
                  {{ item.studentType }}
                </td>
                <td :style="{ textAlign: 'center' }">
                  {{ item.regDate }}
                </td>
                <td>
                  <p @click="viewClass(item.classID)" class="link" :style="{ textAlign: 'center' }">
                    {{ item.classCode }}
                  </p>
                </td>
                <td>
                  <p
                    @click="viewStaff(item.regUser_userID)"
                    class="link"
                    :style="{ textAlign: 'center' }"
                  >
                    {{ item.regUser }}
                  </p>
                </td>
                <td :style="{ textAlign: 'center' }">
                  {{ item.dueDate }}
                </td>
                <td :style="{ textAlign: 'center' }">
                  {{ item.startDate }}
                </td>
                <td :style="{ textAlign: 'center' }">
                  {{ item.endDate }}
                </td>
                <td>
                  <p
                    :style="{ textAlign: 'center' }"
                    v-if="item.precedingClassCode === null || item.precedingClassCode === ''"
                  >
                    -
                  </p>
                  <p
                    @click="viewClass(item.precedingClassID)"
                    class="link"
                    :style="{ textAlign: 'center' }"
                    v-else
                  >
                    {{ item.precedingClassCode }}
                  </p>
                </td>

                <td>
                  <div class="d-flex actionIcon">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <img
                          v-bind="attrs"
                          v-on="on"
                          v-if="item.note === '' || item.note === null"
                          :style="{ width: '18px' }"
                          @click="openEditNote(item)"
                          src="../../../assets/images/notes (1).svg"
                          alt=""
                        />
                        <img
                          v-bind="attrs"
                          v-on="on"
                          v-else
                          :style="{ width: '18px' }"
                          @click="openEditNote(item)"
                          src="../../../assets/images/notes.svg"
                          alt=""
                        />
                      </template>
                      <span v-if="item.note === '' || item.note === null">Create note</span>
                      <span v-else>View note</span>
                    </v-tooltip>
                  </div>
                  <div v-show="overlay" :class="'h'">
                    <div class="card-i">
                      <v-card :style="{ boxShadow: 'none' }" light>
                        <v-card-title class="text-h5" :style="{ fontWeight: 700 }">
                          Student PT note
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-textarea
                          :v-model="noteText"
                          name="input-7-1"
                          label="Add Student PT note"
                          :disabled="!isEdit"
                          :value="noteText"
                          @change="noteOnChange"
                          outlined
                          dense
                          height="30vh"
                          class="abc mt-3 ml-5 mr-5"
                          id="abcd"
                        ></v-textarea>
                        <v-divider></v-divider>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <div :class="'mb-4'" class="btnNote">
                            <v-btn elevation="2" large @click="overlay = false">Cancel</v-btn>
                            <v-btn
                              elevation="2"
                              large
                              color="primary"
                              @click="saveNote"
                              v-if="isEdit === true"
                              >Save</v-btn
                            >
                            <v-btn elevation="2" large color="primary" @click="btn_Edit" v-else
                              >Edit</v-btn
                            >
                          </div>
                        </v-card-actions>
                      </v-card>
                    </div>
                  </div>
                </td>

                <td>
                  <p :style="{ textAlign: 'center' }">{{ item.payStatus }}</p>
                </td>
                <td>
                  <p :style="{ textAlign: 'center' }">{{ item.tuitionFee }}</p>
                </td>
                <td>
                  <p :style="{ textAlign: 'center' }">{{ item.payableAmt }}</p>
                </td>
                <td>
                  <p :style="{ textAlign: 'center' }">{{ item.useStdAcc }}</p>
                </td>
                <td>
                  <p :style="{ textAlign: 'center' }">{{ item.paidAmt }}</p>
                </td>
                <td>
                  <p :style="{ textAlign: 'center' }">{{ item.outstanding }}</p>
                </td>
                <td>
                  <p
                    :style="{ textAlign: 'center' }"
                    v-if="item.invoice === null || item.invoice === ''"
                  >
                    -
                  </p>
                  <p :style="{ textAlign: 'center' }" v-else>{{ item.invoice }}</p>
                </td>
                <td>
                  <p :style="{ textAlign: 'center' }" v-if="item.disc === null || item.disc === ''">
                    -
                  </p>
                  <p :style="{ textAlign: 'center' }" v-else>{{ item.disc }}</p>
                </td>
                <td>
                  <p
                    :style="{ textAlign: 'center' }"
                    v-if="item.invoice === null || item.invoice === ''"
                  >
                    -
                  </p>
                  <p :style="{ textAlign: 'center' }" v-else>{{ item.discAmt }}</p>
                </td>
                <td>
                  <p :style="{ textAlign: 'center' }">{{ item.lastUpdateUser }}</p>
                </td>
                <td>
                  <p :style="{ textAlign: 'center' }">
                    {{ item.lastUpdateDate }}
                  </p>
                </td>
                <td>
                  <p :style="{ textAlign: 'center' }">{{ item.createUser }}</p>
                </td>
                <td>
                  <p :style="{ textAlign: 'center' }">
                    {{ item.createDate }}
                  </p>
                </td>
              </template>
            </tr>
          </tbody>
        </template>
      </v-data-table>
      <div v-if="!isLoading" color="#fff" class="pl-10 mt-3 pr-10">
        <div :style="{ zIndex: '120' }" class="d-flex align-center justify-space-between">
          <div
            :style="{
              width: '150px',
            }"
          >
            <v-select
              outlined
              hide-details
              dense
              :value="itemsPerPage1"
              :items="[20, 50, 100, 200]"
              @change="itemsPerPage1 = parseInt($event, 10)"
              style="height: 32px"
            ></v-select>
          </div>

          <v-pagination
            v-model="page1"
            :length="Math.ceil(filtered.length.toFixed() / itemsPerPage1)"
            :total-visible="7"
            elevation="0"
          ></v-pagination>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import iconAc from '../../../assets/images/icon-accept.svg'
import iconUnAc from '../../../assets/images/icon-unaccept.svg'
import { dashboard_report } from '@/api/dashboard-report'
import Autocomplete from '@/components/Utils/Autocomplete.vue'
import dayjs from 'dayjs'
import localeVi from 'dayjs/locale/vi'

export default {
  components: { Autocomplete },
  data() {
    return {
      iconAc: iconAc,
      iconUnAc: iconUnAc,
      listStudent: [],
      isEdit: false,
      loading: false,
      isLoading: false,
      noteText: '',
      overlay: false,
      page1: 1,
      dayjs: dayjs,
      pageCount: 0,
      itemsPerPage1: 20,
      makeupInfor: {},
      dialogForm: false,
      fromDate: new Date().toISOString().split('T')[0],
      toDate: new Date().toISOString().split('T')[0],
      listLocation: [],
      listRegStatus: [],
      locationID: 1,
      registrationStatusID: 2,
      registrationID: 0,

      filters: {
        studentType: [],
        regDate: [],
        studentCode: [],
        classCode: [],
        createDate: [],
        studentName: [],
        regUser: [],
        startDate: [],
        endDate: [],
        precedingClassCode: [],
        payStatus: [],
        tuitionFee: [],
        useStdAcc: [],
        payableAmt: [],
        paidAmt: [],
        outstanding: [],
        invoice: [],
        disc: [],
        discAmt: [],
        lastUpdateUser: [],
        createUser: [],
        dueDate: [],
        note: [],
        lastUpdateDate: [],
      },
    }
  },
  computed: {
    logHeaders() {
      let headers = []
      headers.push(
        {
          text: 'No',
          value: 'no',
          sortable: false,
        },
        {
          text: 'Student code',
          value: 'studentCode',
          sortable: false,
        },
        {
          text: 'Student name',
          value: 'studentName',
          sortable: false,
        },
        {
          text: 'Student Type',
          value: 'studentType',
          sortable: false,
        },
        {
          text: 'Reg. Date',
          value: 'regDate',
          sortable: false,
        },
        {
          text: 'Class',
          value: 'classCode',
          sortable: false,
        },
        {
          text: 'Reg. User',
          value: 'regUser',
          sortable: false,
        },
        {
          text: 'Due Date',
          value: 'dueDate',
          sortable: false,
        },
        {
          text: 'Start Date',
          value: 'startDate',
          sortable: false,
        },
        {
          text: 'End Date',
          value: 'endDate',
          sortable: false,
        },

        {
          text: 'Preceding Class',
          value: 'precedingClassCode',
          sortable: false,
        },
        {
          text: 'Note',
          value: 'note',
          sortable: false,
        },
        {
          text: 'Pay Status',
          value: 'payStatus',
          sortable: false,
        },
        {
          text: 'Tuition Fee',
          value: 'tuitionFee',
          sortable: false,
        },
        {
          text: 'Payable Amt',
          value: 'payableAmt',
          sortable: false,
        },
        {
          text: 'Use.Std.Acc',
          value: 'useStdAcc',
          sortable: false,
        },
        {
          text: 'Paid Amt',
          value: 'paidAmt',
          sortable: false,
        },
        {
          text: 'Outstanding',
          value: 'outstanding',
          sortable: false,
        },
        {
          text: 'Invoice',
          value: 'invoice',
          sortable: false,
        },
        {
          text: 'Disc.%',
          value: 'disc',
          sortable: false,
        },
        {
          text: 'Disc Amt',
          value: 'discAmt',
          sortable: false,
        },
        {
          text: 'Last Update User',
          value: 'lastUpdateUser',
          sortable: false,
        },
        {
          text: 'Last Update Date',
          value: 'lastUpdateDate',
          sortable: false,
        },
        {
          text: 'Create User',
          value: 'createUser',
          sortable: false,
        },
        {
          text: 'Create Date',
          value: 'createDate',
          sortable: false,
        }
      )
      return headers
    },
    filtered() {
      return this.listStudent.filter(d => {
        return Object.keys(this.filters).every(f => {
          return (
            this.filters[f].length < 1 ||
            (f === 'note'
              ? this.filters[f].reduce((value, el) => {
                  if (d.note?.length > 0 && el === 'Note') {
                    value = true
                  }
                  if ((d.note === '' || d.note === null) && el === 'No Note') {
                    value = true
                  }
                  return value
                }, false)
              : this.filters[f].includes(d[f]))
          )
        })
      })
    },
  },
  setup() {
    return {}
  },
  created() {
    this.listLocation = JSON.parse(localStorage.getItem('currentUser')).locationPermissions
    this.locationID = parseInt(localStorage.getItem('currentCenter'))
    this.fromDate = dayjs(new Date()).startOf('month').format('YYYY-MM-DD')
    this.toDate = dayjs(new Date()).endOf('month').format('YYYY-MM-DD')
    if (localStorage.getItem('RegisStatusCenter'))
      this.locationID = parseInt(localStorage.getItem('RegisStatusCenter'))
    if (localStorage.getItem('RegisStatus'))
      this.registrationStatusID = parseInt(localStorage.getItem('RegisStatus'))
    if (localStorage.getItem('RegisStatusTo'))
      this.toDate = dayjs(localStorage.getItem('RegisStatusTo')).format('YYYY-MM-DD')
    if (localStorage.getItem('RegisStatusFrom'))
      this.fromDate = dayjs(localStorage.getItem('RegisStatusFrom')).format('YYYY-MM-DD')
    if (localStorage.getItem('RegisStatusFilter'))
      this.filters = JSON.parse(localStorage.getItem('RegisStatusFilter'))
    this.getListRegStatus()
    this.init()
    this.page1 = 1
  },
  mounted() {
    setTimeout(() => {
      document
        .getElementsByClassName('pts-table')[0]
        .getElementsByTagName('table')[0]
        .scrollIntoView({
          inline: 'end',
          behavior: 'smooth',
        })
    }, 1000)
  },

  watch: {
    locationID: function () {
      localStorage.setItem('RegisStatusCenter', this.locationID)
      this.init()
    },
    registrationStatusID: function () {
      localStorage.setItem('RegisStatus', this.registrationStatusID)
      this.init()
    },
  },
  methods: {
    getListRegStatus() {
      this.listRegStatus = [
        {
          registrationStatusID: 1,
          registrationStatus: 'Hold',
        },
        {
          registrationStatusID: 2,
          registrationStatus: 'Enrollded',
        },
        {
          registrationStatusID: 3,
          registrationStatus: 'Booked',
        },
        {
          registrationStatusID: 4,
          registrationStatus: 'Trial',
        },
      ]
    },
    getTimeInobject(shift) {
      if (shift && shift.split('-')[0].indexOf(':') !== -1) {
        let arrShift = shift.split('-')[0].split(':')
        return {
          hour: !isNaN(arrShift[0]) ? parseInt(arrShift[0]) : null,
          min: !isNaN(arrShift[1]) ? parseInt(arrShift[1]) : null,
        }
      }
      return null
    },
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
      localStorage.setItem('makeupFilter', JSON.stringify(this.filters))
    },
    back() {
      window.history.back()
    },
    openEditNote(item) {
      if (item.note == null || item.note == '' || item.note === undefined) this.isEdit = true
      else this.isEdit = false
      this.overlay = true
      this.registrationID = item.registrationID
      this.noteText = item.note
    },
    noteOnChange(value) {
      this.noteText = value
    },
    saveNote() {
      dashboard_report.updateRSNote(this.registrationID, this.noteText)
      this.overlay = false
      this.init()
    },

    btn_Edit() {
      this.isEdit = true
    },
    resetFilter() {
      this.filters = {
        ecName: [],
        status: [],
        studentCode: [],
        crtdDate: [],
        crtdUser: [],
        studentName: [],
        note: [],
        finalScore: [],
        programme: [],
        achievedLevel: [],
        comments: [],
        listening: [],
        speaking: [],
        writting: [],
        grammar: [],
        reading: [],
        phoneNum: [],
        motherNum: [],
        testDate: [],
        testTime: [],
        interviewer: [],
      }
    },
    groupColumnValueList(val) {
      return this.listStudent.map(d => d[val]).filter(y => y)
    },

    viewStudent(studentID) {
      this.$router.push({
        name: 'account-management-view-account',
        params: {
          userId: studentID,
        },
      })
    },
    viewStaff(userID) {
      this.$router.push({
        name: 'account-management-view-account',
        params: {
          userId: userID,
        },
      })
    },
    viewClass(classID){
      this.$router.push({
        name: 'class-management-detail',
        query: {
          classID: classID,
        },
      })
    },
    changeDate() {
      localStorage.setItem('RegisStatusFrom', this.fromDate)
      localStorage.setItem('RegisStatusTo', this.toDate)
      this.init()
    },
    async init() {
      this.loading = true
      await dashboard_report
        .getRSReport(this.locationID, this.fromDate, this.toDate, this.registrationStatusID)
        .then(res => {
          this.listStudent = res.map(res => {
            return {
              ...res,
              dueDate: dayjs(res.dueDate).locale(localeVi).format('DD/MM/YYYY'),
              createDate: dayjs(res.createDate).locale(localeVi).format('DD/MM/YYYY'),
              endDate: dayjs(res.endDate).locale(localeVi).format('DD/MM/YYYY'),
              lastUpdateDate: dayjs(res.lastUpdateDate).locale(localeVi).format('DD/MM/YYYY'),
              regDate: dayjs(res.regDate).locale(localeVi).format('DD/MM/YYYY'),
              startDate: dayjs(res.startDate).locale(localeVi).format('DD/MM/YYYY'),
            }
          })
          this.loading = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.select-input {
  max-width: 200px;
  margin-right: 20px !important;
}
.absent {
  padding: 36px;
}
.h {
  background: rgba(0, 0, 0, 0.01);
  position: fixed;
  width: 100%;
  height: 100%;

  top: 0;
  z-index: 1000;
  left: 0;
}
.btnNote {
  float: right;
  margin-top: 20px;
}
.note-card {
  box-shadow: none !important;
}
.btnNote button {
  margin-left: 20px;
  min-width: 150px !important;
}
.card-i {
  width: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.link {
  cursor: pointer;
  color: #427df2 !important;
}
.link:hover {
  text-decoration: underline;
  font-weight: 700;
}
.disable {
  pointer-events: none;
  color: #0c2e68;

  opacity: 0.4;
}

::v-deep .headTitle {
  background-color: #0b2585 !important;
  height: 30px !important;
  font-size: 14px !important;
  border: 0 !important;
  color: white !important;
}

tbody tr:nth-of-type(odd) {
  // background: rgb(235, 229, 229) !important;
  color: #000 !important;
}
tbody tr:nth-of-type(even) {
  // background: rgb(235, 229, 229) !important;
  background: #000 !important;
}
#pts-table {
  display: block;
  white-space: nowrap;
}
.f td:nth-of-type(1) {
  z-index: 6 !important;
  left: 0;
}
.f td:nth-of-type(2) {
  z-index: 6 !important;
  left: 40px;
}
.f td:nth-of-type(3) {
  z-index: 6 !important;
  left: 140px;
}
.f td:nth-of-type(4) {
  z-index: 6 !important;
  left: 335px;
}
.f td:nth-of-type(5) {
  z-index: 6 !important;
  left: 435px;
}
.f td:nth-of-type(6) {
  z-index: 6 !important;
  left: 535px;
}
#pts-table th {
  padding: 16px 7px;
  text-align: center;
  font-weight: 400;
}
#pts-table td {
  border-bottom: 1px solid #d1d4d4;
}

#pts-table tbody tr:nth-of-type(even) td {
  background-color: #f3faff !important;
}
#pts-table tbody tr:nth-of-type(even):hover td {
  background-color: #dbecf8 !important;
}
#pts-table tbody tr:nth-of-type(odd):hover td {
  background-color: #d7dbdd !important;
}
#pts-table tbody tr:nth-of-type(even) td {
  background-color: #f3faff !important;
}
#pts-table tbody tr:nth-of-type(even) {
  background-color: #eeeeee !important;
}

#pts-table tbody tr td:nth-of-type(1) {
  z-index: 4;
  p {
    width: 20px;
  }
  position: sticky;
  left: 0px;
  z-index: 4;
  background: #fff;
}
#pts-table tbody tr td:nth-of-type(2) {
  z-index: 4;
  p {
    width: 70px;
  }
  position: sticky;
  left: 40px;
  z-index: 4;
  background: #fff;
}
#pts-table tr:nth-of-type(1) td {
  z-index: 4;
}
#pts-table tbody tr td:nth-of-type(3) {
  p {
    width: 170px;
  }
  position: sticky;
  left: 140px;
  z-index: 4;
  background: #fff;
}
#pts-table tbody tr td:nth-of-type(4) {
  p {
    width: 70px;
  }
  position: sticky;
  left: 335px;
  z-index: 4;
  background: #fff;
}
#pts-table tbody tr td:nth-of-type(5) {
  p {
    width: 70px;
  }
  position: sticky;
  left: 435px;
  z-index: 4;
  background: #fff;
}
#pts-table tbody tr td:nth-of-type(6) {
  p {
    width: 170px;
  }
  position: sticky;
  left: 535px;
  z-index: 4;
  background: #fff;
}
#pts-table tr:nth-child(2) {
  left: 140px;
  z-index: 4;
  background: #fff;
}
#pts-table tbody tr td:nth-child(1) {
  width: 20px;
}
.header-commnent {
  background: #0b2585;
}
.header-commnent th:nth-child(1) {
  z-index: 5;
  span {
    width: 20px;
  }
  position: sticky;
  left: 0px;
}
.header-commnent th:nth-child(2) {
  z-index: 5;
  span {
    width: 70px;
  }
  position: sticky;
  left: 45px;
}
.header-commnent th:nth-child(3) {
  z-index: 5;
  span {
    width: 250px;
  }
  position: sticky;
  left: 140px;
}
.header-commnent th:nth-child(4) {
  z-index: 5;
  span {
    width: 70px;
  }
  position: sticky;
  left: 335px;
}
.header-commnent th:nth-child(5) {
  z-index: 5;
  span {
    width: 70px;
  }
  position: sticky;
  left: 435px;
}
.header-commnent th:nth-child(6) {
  z-index: 5;
  span {
    width: 250px;
  }
  position: sticky;
  left: 535px;
}
</style>
