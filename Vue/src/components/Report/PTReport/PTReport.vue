<template>
  <div class="absent">
    <v-row no-gutters>
      <v-col md="12">
        <div class="d-flex justify-space-between">
          <h2 class="d-flex">
            <v-icon @click="back()">arrow_back_ios</v-icon>
            <div class="d-flex align-center">Placement Test Report</div>
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
                    header.value === 'comments'
                      ? ['Comments', 'No Comment']
                      : header.value === 'note'
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
                  {{ item.testDate }}
                </td>
                <td :style="{ textAlign: 'center' }">
                  {{ item.testStartTime }} - {{ item.testEndTime }}
                </td>
                <td>
                  <p
                    :style="{ textAlign: 'center' }"
                    v-if="item.counselorName === '' || item.counselorName === null"
                  >
                    -
                  </p>
                  <p
                    :style="{ textAlign: 'center' }"
                    
                    v-else
                  >
                    {{ item.counselorName }}
                  </p>
                </td>
                <td>
                  <p :style="{ textAlign: 'center' }">{{ item.status }}</p>
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
                  <p :style="{ textAlign: 'center' }">{{ item.finalScore }}</p>
                </td>
                <td>
                  <p
                    :style="{ textAlign: 'center' }"
                    v-if="item.programme === '' || item.programme === null"
                  >
                    -
                  </p>
                  <p v-else :style="{ textAlign: 'center' }">{{ item.programme }}</p>
                </td>
                <td>
                  <p
                    :style="{ textAlign: 'center' }"
                    v-if="item.achievedLevel === '' || item.achievedLevel === null"
                  >
                    -
                  </p>
                  <p v-else :style="{ textAlign: 'center' }">{{ item.achievedLevel }}</p>
                </td>
                <td :style="{ textAlign: 'center' }">
                  <div :style="{ width: '120px' }" class="d-flex justify-center">
                    <img
                      :class="'link'"
                      :style="{ marginRight: '10px' }"
                      :src="
                        item.writtingComments.length === 0 &&
                        item.speakingComments.length === 0 &&
                        item.teacherComments.length === 0
                          ? iconUnAc
                          : iconAc
                      "
                    />
                    <p
                      @click="
                        ;(item.writtingComments.length !== 0 ||
                          item.speakingComments.length !== 0 ||
                          item.teacherComments.length !== 0) &&
                          openComments(item)
                      "
                      :class="` ${
                        item.writtingComments.length === 0 &&
                        item.speakingComments.length === 0 &&
                        item.teacherComments.length === 0
                          ? 'disable'
                          : 'link'
                      }`"
                    >
                      View detail
                    </p>
                  </div>
                  <div v-show="overlay2" :class="'h'">
                    <div class="card-i">
                      <v-card :style="{ boxShadow: 'none' }" light>
                        <div class="d-flex">
                          <v-card-title class="text-h5" :style="{ fontWeight: 700 }">
                            Comment on student's placement test
                          </v-card-title>
                          <v-btn
                            elevation="2"
                            medium
                            class="ml-auto mt-3 mr-3"
                            @click="overlay2 = false"
                            >Close</v-btn
                          >
                        </div>
                        <div class="px-5 d-flex justify-space-between align-items-center mb-3">
                          <h5>{{ studentName }} - {{ studentCode }}</h5>
                          <p class="pl-3">Final score - {{ finalScore }}</p>
                          <p class="ml-auto flex-end">Send by - {{ interviewer }}</p>
                        </div>
                        <v-divider></v-divider>
                        <v-textarea
                          :v-model="generalComments"
                          name="input-7-1"
                          label="Teacher's general comment"
                          :value="generalComments"
                          disabled
                          outlined
                          dense
                          height="15vh"
                          class="abc mt-3 ml-5 mr-5"
                        ></v-textarea>
                        <v-textarea
                          :v-model="writtingComments"
                          name="input-7-1"
                          label="Writting comment"
                          :value="writtingComments"
                          outlined
                          disabled
                          dense
                          height="15vh"
                          class="abc mt-3 ml-5 mr-5"
                        ></v-textarea>
                        <v-textarea
                          :v-model="speakingComments"
                          name="input-7-1"
                          label="Speaking comment"
                          :value="speakingComments"
                          outlined
                          disabled
                          dense
                          height="15vh"
                          class="abc mt-3 ml-5 mr-5"
                        ></v-textarea>
                      </v-card>
                    </div>
                  </div>
                </td>
                <td>
                  <p :style="{ textAlign: 'center' }">{{ item.listening }}</p>
                </td>
                <td>
                  <p :style="{ textAlign: 'center' }">{{ item.speaking }}</p>
                </td>
                <td>
                  <p :style="{ textAlign: 'center' }">{{ item.reading }}</p>
                </td>
                <td>
                  <p :style="{ textAlign: 'center' }">{{ item.writting }}</p>
                </td>
                <td>
                  <p :style="{ textAlign: 'center' }">{{ item.grammar }}</p>
                </td>
                <td>
                  <p
                    :style="{ textAlign: 'center' }"
                    v-if="item.interviewer === '' || item.interviewer === null"
                  >
                    -
                  </p>
                  <p v-else :style="{ textAlign: 'center' }">{{ item.interviewer }}</p>
                </td>
                <td>
                  <p :style="{ textAlign: 'center' }">{{ item.crtdUser }}</p>
                </td>
                <td>
                  <p :style="{ textAlign: 'center' }">
                    {{ item.crtdDate }}
                  </p>
                </td>
                <td>
                  <div v-if="item.phoneNum.length > 10">
                    <div
                      v-for="(phone, index) in item.phoneNum.split(',')"
                      :key="index"
                      :style="{ textAlign: 'center' }"
                    >
                      <p :style="{ textAlign: 'center' }">{{ phone }}</p>
                    </div>
                  </div>
                  <p v-else :style="{ textAlign: 'center' }">{{ item.phoneNum }}</p>
                </td>
                <td>
                  <p
                    :style="{ textAlign: 'center' }"
                    v-if="item.motherNum === '' || item.motherNum === null"
                  >
                    -
                  </p>
                  <div v-else-if="item.motherNum.length > 10">
                    <div
                      v-for="(phone, index) in item.motherNum.split(',')"
                      :key="index"
                      :style="{ textAlign: 'center' }"
                    >
                      <p :style="{ textAlign: 'center' }">{{ phone }}</p>
                    </div>
                  </div>
                  <p v-else :style="{ textAlign: 'center' }">{{ item.motherNum }}</p>
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
import Autocomplete from '@/components/Utils/Autocomplete.vue'
import { dashboard_report } from '@/api/dashboard-report'
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
      PlacementTestID: 0,
      speakingComments: '',
      writtingComments: '',
      generalComments: '',
      studentName: '',
      studentCode: '',
      interviewer: '',
      finalScore: '',
      overlay: false,
      overlay2: false,
      page1: 1,
      dayjs: dayjs,
      pageCount: 0,
      itemsPerPage1: 20,
      fromDate: new Date().toISOString().split('T')[0],
      toDate: new Date().toISOString().split('T')[0],
      listLocation: [],
      locationID: 1,

      filters: {
        counselorName: [],
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
          text: 'Test Date',
          value: 'testDate',
          sortable: false,
        },
        {
          text: 'Test Time',
          value: 'testTime',
          sortable: false,
        },
        {
          text: 'EC',
          value: 'counselorName',
          sortable: false,
        },
        {
          text: 'Status',
          value: 'status',
          sortable: false,
        },
        {
          text: 'Note',
          value: 'note',
          sortable: false,
        },
        {
          text: 'Final score',
          value: 'finalScore',
          sortable: false,
        },
        {
          text: 'Programme',
          value: 'programme',
          sortable: false,
        },

        {
          text: 'Achieved level',
          value: 'achievedLevel',
          sortable: false,
        },
        {
          text: 'Comments',
          value: 'comments',
          sortable: false,
        },
        {
          text: 'Listening',
          value: 'listening',
          sortable: false,
        },
        {
          text: 'Speaking',
          value: 'speaking',
          sortable: false,
        },
        {
          text: 'Reading',
          value: 'reading',
          sortable: false,
        },
        {
          text: 'Writting',
          value: 'writting',
          sortable: false,
        },
        {
          text: 'Grammar',
          value: 'grammar',
          sortable: false,
        },
        {
          text: 'Interviewer',
          value: 'interviewer',
          sortable: false,
        },
        {
          text: 'CrtdUser',
          value: 'crtdUser',
          sortable: false,
        },
        {
          text: 'CrtdDate',
          value: 'crtdDate',
          sortable: false,
        },
        {
          text: 'Mobile Phone',
          value: 'phoneNum',
          sortable: false,
        },
        {
          text: 'Mother Phone',
          value: 'motherNum',
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
            (f === 'comments'
              ? this.filters[f].reduce((value, el) => {
                  if (
                    (Object.values(d.comments)[0] !== '' ||
                      Object.values(d.comments)[1] !== '' ||
                      Object.values(d.comments)[2] !== '') &&
                    el === 'Comments'
                  ) {
                    value = true
                  }
                  if (
                    Object.values(d.comments)[0] === '' &&
                    Object.values(d.comments)[1] === '' &&
                    Object.values(d.comments)[2] === '' &&
                    el === 'No Comment'
                  ) {
                    value = true
                  }
                  return value
                }, false)
              : this.filters[f].includes(d[f])) ||
            (f === 'note'
              ? this.filters[f].reduce((value, el) => {
                  if (Object.keys(d.note)?.length > 0 && el === 'Note') {
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
    console.log(this.fromDate, this.toDate)
    if (localStorage.getItem('PTCenter'))
      this.locationID = parseInt(localStorage.getItem('PTCenter'))
    if (localStorage.getItem('PTTo'))
      this.toDate = dayjs(localStorage.getItem('PTTo')).format('YYYY-MM-DD')
    if (localStorage.getItem('PTFrom'))
      this.fromDate = dayjs(localStorage.getItem('PTFrom')).format('YYYY-MM-DD')
    if (localStorage.getItem('PTFilter'))
      this.filters = JSON.parse(localStorage.getItem('PTFilter'))
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
      localStorage.setItem('PTCenter', this.locationID)
      this.init()
    },
  },
  methods: {
    phoneNumber(str) {
      return str.split(',').length > 1 ? str.split(',').join('</>') : str
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
    viewDetailProfile(userId) {
      this.$router.push({
        name: 'account-management-view-account',
        params: {
          userId: userId,
        },
      })
    },
    back() {
      window.history.back()
    },
    openEditNote(item) {
      if (item.note == null || item.note == '' || item.note === undefined) this.isEdit = true
      else this.isEdit = false
      this.overlay = true
      this.PlacementTestID = item.placementTestID
      this.noteText = item.note
    },
    openComments(item) {
      this.overlay2 = true
      this.generalComments = item.teacherComments
      this.writtingComments = item.writtingComments
      this.speakingComments = item.speakingComments
      this.interviewer = item.interviewer
      this.studentName = item.studentName
      this.studentCode = item.studentCode
      this.finalScore = item.finalScore
    },
    noteOnChange(value) {
      this.noteText = value
    },
    saveNote() {
      dashboard_report.updatePTRemark(this.PlacementTestID, this.noteText)
      this.overlay = false
      this.init()
    },

    btn_Edit() {
      this.isEdit = true
    },
    resetFilter() {
      this.filters = {
        counselorName: [],
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
    changeDate() {
      localStorage.setItem('PTFrom', this.fromDate)
      localStorage.setItem('PTTo', this.toDate)
      this.init()
    },
    async init() {
      this.loading = true
      await dashboard_report.getPTReport(this.locationID, this.fromDate, this.toDate).then(res => {
        this.listStudent = res.map(res => {
          return {
            ...res,
            testTime: res.testStartTime + '-' + res.testEndTime,
            testDate: dayjs(res.testDate).locale(localeVi).format('DD/MM/YYYY'),
            crtdDate: dayjs(res.crtdDate).locale(localeVi).format('DD/MM/YYYY'),
            comments: {
              teacherComments: res.teacherComments,
              speakingComments: res.speakingComments,
              writtingComments: res.writtingComments,
            },
          }
        })
        this.loading = false
      })
    },

    //   async callDataWithNoLoading() {
    //     await makeuplesson.getMakeupList(this.locationID, this.fromDate, this.toDate).then(res => {
    //       this.listStudent = res.map(item => {
    //         return {
    //           ...item,
    //           makeUpDateWithShift:
    //             this.getTimeInobject(item.makeUpShift) &&
    //             dayjs(item.makeUpDate)
    //               .add(this.getTimeInobject(item.makeUpShift).hour, 'hour')
    //               .add(this.getTimeInobject(item.makeUpShift).min, 'minute'),
    //           attendStatus: item.attendStatus ? 'Pending' : item.attendStatus,
    //           classGroup: item.classGroup === 'Public' ? 'Official' : item.classGroup,
    //           makeUpDate: dayjs(item.makeUpDate).format('DD/MM/YYYY'),
    //           classDate: dayjs(item.classDate).format('DD/MM/YYYY'),
    //         }
    //       })
    //     })
    //   },
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
