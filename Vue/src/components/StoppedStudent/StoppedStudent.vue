<!-- eslint-disable prettier/prettier -->
<template>
  <div class="stopped">
    <div class="header">
      <!-- <v-icon @click="back()">arrow_back_ios</v-icon> -->
      <h2>Stopped Student</h2>
    </div>

    <div class="formTo">
      <v-col cols="3">
        <v-autocomplete
          v-model="locastion"
          :items="listLocation"
          item-text="location"
          item-value="locationID"
          label="Center"
          outlined
          dense
          @change="changeSelec"
        >
          <template v-slot:body>
            <select v-for="(locationdata, index) in locationdatas" :key="index">
              <option value="">
                {{ locationdata }}
              </option>
            </select>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col cols="3">
        <v-text-field
          @change="changeFrom"
          type="date"
          label="From date"
          v-model="fromDate"
          outlined
          dense
          hide-details
        />
      </v-col>
      <v-col cols="3">
        <v-text-field
          @change="changeTo"
          type="date"
          label="To date"
          v-model="toDate"
          outlined
          dense
          hide-details
        />
      </v-col>
    </div>
    <div class="mb-2">
      <span v-if="filtered.length != 1">Total: {{ filtered.length }} students</span>
      <span v-else>Total: {{ filtered.length }} student</span>
    </div>
    <v-card class="table-container">
      <v-data-table
        :headers="headers"
        :items="filtered"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        @page-count="pageCount = $event"
        class="elevation-0 spendingTable"
        hide-default-footer
        fixed-header
        height="80vh"
      >
        <template v-slot:header="{ props }">
          <tr class="fixed-row-filter">
            <th v-for="header in props.headers" :key="header.text">
              <div v-if="filters.hasOwnProperty(header.value)">
                <Autocomplete
                  v-if="filters.hasOwnProperty(header.value)"
                  @setFilter="setFilter"
                  :styleBorder="'border-bottom'"
                  :keyFilter="header.value"
                  :selectedInit="filters[header.value]"
                  :listItem="groupColumnValueList(header.value)"
                />
              </div>
            </th>
          </tr>
        </template>
        <template v-slot:[`item.no`]="{ index }">
          {{ itemsPerPage * (page - 1) + index + 1 }}
        </template>
        <template v-slot:[`item.studentCode`]="{ item }">
          <span class="link" @click="viewDetailProfile(item.stuUserID)">{{
            item.studentCode
          }}</span>
        </template>
        <template v-slot:[`item.fullName`]="{ item }">
          <span class="link" @click="viewDetailProfile(item.stuUserID)">{{ item.fullName }}</span>
        </template>
        <template v-slot:[`item.statuss`]="{ item }">
          <v-chip :color="getColor(item.statuss)" dark>
            {{ item.statuss }}
          </v-chip>
        </template>
        <template v-slot:[`item.dob`]="{ item }">
          {{ item.dob }}
        </template>
        <template v-slot:[`item.qc`]="{ item }">
          <p @click="viewProfileByUserId(item.qC_userID)" class="link">{{ item.qc }}</p>
        </template>
        <template v-slot:[`item.ec`]="{ item }">
          <p @click="viewProfileByUserId(item.eC_userID)" class="link">{{ item.ec }}</p>
        </template>
        <template v-slot:[`item.classCode`]="{ item }">
          <p @click="viewDetailClass(item.classID)" class="link">{{ item.classCode }}</p>
        </template>
        <!-- <template :class="'link'" @click="viewDetailClass(item.classID)">
          {{ item.classCode }}
        </template> -->
        <template v-slot:[`item.stopped`]="{ item }">
          <div v-if="item.stopped == 'Yes'" class="d-flex justify-center">
            <v-icon color="#0FA958"> mdi-checkbox-marked-circle </v-icon>
          </div>

          <div v-else class="d-flex justify-center">
            <v-icon color="#C4C4C4">mdi-checkbox-blank-circle</v-icon>
          </div>
        </template>
        <template v-slot:[`item.terminateDate`]="{ item }">
          {{ item.terminateDate }}
        </template>
        <template v-slot:[`item.studentBalAmount`]="{ item }">
          <td align="right">
            {{ Number(item.studentBalAmount.toFixed(0)).toLocaleString() }}
          </td>
        </template>
        <template v-slot:[`item.hasRoadMap`]="{ item }">
          <td>
            <div :style="{ width: '120px' }" class="d-flex justify-center">
              <img
                :class="'link'"
                :style="{ marginRight: '10px' }"
                :src="item.hasRoadmap === 'Yes' ? iconAc : iconUnAc"
              />
              <p
                @click="
                  item.hasRoadmap === 'Yes' &&
                    viewRoadMap(item.studentCode.substr(0, 5), item.stuUserID, item.classID)
                "
                :class="`link ${item.hasRoadmap === 'Yes' ? '' : 'disible'}`"
              >
                View detail
              </p>
            </div>
          </td>
        </template>
        <!-- <template v-slot:[`item.remarks`]="{ item }">
          <td>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <img
                  v-bind="attrs"
                  v-on="on"
                  v-if="item.remarks === '' || item.remarks === null"
                  :style="{ width: '18px' }"
                  @click="openEditNote(item)"
                  src="../../assets/images/notes (1).svg"
                  alt=""
                />
                <img
                  v-bind="attrs"
                  v-on="on"
                  v-else
                  :style="{ width: '18px' }"
                  @click="openEditNote(item)"
                  src="../../assets/images/notes.svg"
                  alt=""
                />
              </template>
              <span v-if="item.remarks === '' || item.remarks === null">Create note</span>
              <span v-else>View note</span>
            </v-tooltip>
            <div v-show="overlay" :class="'h'">
              <div class="card-i">
                <v-card
                  :style="{ boxShadow: 'none' }"
                  light
                  :min-width="screen < 700 ? '500' : '600'"
                >
                  <v-card-title class="text-h5" :style="{ fontWeight: 700 }">
                    Student notes
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-textarea
                    :v-model="noteText"
                    name="input-7-1"
                    label="Add lesson notes"
                    :disabled="!isEdit"
                    @change="noteOnChange"
                    :value="noteText"
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
        </template> -->
      </v-data-table>
    </v-card>

    <div
      color="#fff"
      class="pl-10 pr-10"
      width="$store.state.isActiveSidebar?'calc(100%-258px) : calc(100%-100px)"
    ></div>

    <v-footer
      color="#fff"
      class="px-10 pb-2"
      padless
      :style="
        $store.state.isActiveSidebar ? 'width: calc(100% - 100px)' : 'width: calc(100% - 258px)'
      "
      style="display: flex; justify-content: space-between; padding: 0 65px 0 0px !important"
    >
      <div>
        <v-select
          outlined
          hide-details
          dense
          :value="itemsPerPage"
          :items="[20, 50, 100, 200, 500, 1000]"
          @change="itemsPerPage = parseInt($event, 10)"
          style="height: 32px"
        ></v-select>
      </div>
      <!-- <div>
        <h3 v-if="filtered.length != 1">Total: {{ filtered.length }} records</h3>
        <h3 v-else>Total: {{ filtered.length }} record</h3>
      </div> -->
      <div>
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="7"
          elevation="0"
        ></v-pagination>
      </div>
    </v-footer>
  </div>
</template>
<script>
import dayjs from 'dayjs'
// import { el } from "vuetify/lib/locale";

import Autocomplete from '@/components/Utils/Autocomplete.vue'
import { report_revenue } from '../../api/report-revenuereport'
import iconAc from '../../assets/images/icon-accept.svg'
import iconUnAc from '../../assets/images/icon-unaccept.svg'
export default {
  components: { Autocomplete },
  data() {
    return {
      noteText: '',
      isEdit: false,
      overlay: false,
      isLoading: false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      locationdatas: [],
      locations: [],
      locationID: 1,
      items: [],
      iconAc: iconAc,
      iconUnAc: iconUnAc,
      filters: {
        studentCode: [],
        fullName: [],
        dob: [],
        programme: [],
        classCode: [],
        qc: [],
        ec: [],
        studentBalAmount: [],
        stopped: [],
        reasons: [],
        terminateDate: [],
        mobilePhone: [],
        hasRoadMap: [],
        remarks: [],
      },
      headers: [
        {
          text: 'No',
          align: 'start',
          value: 'no',
        },
        {
          text: 'Student Code',
          value: 'studentCode',
          sortable: true,
        },
        { text: 'Student Name', value: 'fullName' },
        { text: 'DOB', value: 'dob', sortable: true },
        { text: 'Phone Number', value: 'mobilePhone' },
        { text: 'Programme', value: 'programme' },
        { text: 'Class Code', value: 'classCode' },
        { text: 'QC', value: 'qc' },
        { text: 'EC', value: 'ec' },
        { text: 'Balance', value: 'studentBalAmount' },
        { text: 'Stopped', value: 'stopped' },
        { text: 'Reason', value: 'reasons' },
        { text: 'Terminate Date', value: 'terminateDate' },
        { text: 'Roadmap created', value: 'hasRoadMap' },
        // { text: 'Action', value: 'remarks' },
      ],
      desserts: [
        // {
        //   tt: 0,
        //   code: "28727HN",
        //   name: "Quang Công Lập",
        //   dob: "30/08/2005",
        //   phone: "098241592",
        //   programme: "Private",
        //   classcodoe: "VQ1-K2-2201",
        //   qc: "Bùi Quỳnh Anh",
        //   acc: " 1.345.000 ",
        //   statuss: "Saving fee",
        //   reason: "Reason",
        //   date: "12/06/2021",
        //   ec: "Nguyễn Thị Hoà",
        // },
      ],
      studentList: [],
      locastion: 1,
      form: '',
      to: '',
    }
  },
  created() {
    this.listLocation = JSON.parse(localStorage.getItem('currentUser')).locationPermissions
    this.locastion = parseInt(localStorage.getItem('currentCenter'))
    if (localStorage.getItem('stopTo')) {
      this.toDate = dayjs(localStorage.getItem('stopTo')).format('YYYY-MM-DD')
    } else {
      this.toDate = dayjs().format('YYYY-MM-DD')
    }
    if (localStorage.getItem('stopFrom')) {
      this.fromDate = dayjs(localStorage.getItem('stopFrom')).format('YYYY-MM-DD')
    } else {
      this.fromDate = dayjs()
        .add(-parseInt(dayjs().add(-1, 'day').format('DD')), 'day')
        .format('YYYY-MM-DD')
    }
    if (localStorage.getItem('stopCenter')) {
      this.locastion = parseInt(localStorage.getItem('stopCenter'))
    }
    if (localStorage.getItem('stopFilter')) {
      this.filters = JSON.parse(localStorage.getItem('stopFilter'))
    }

    this.init()
    // this.init2()
  },
  computed: {
    filtered() {
      return this.desserts.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
    },
  },
  methods: {
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
      localStorage.setItem('stopFilter', JSON.stringify(this.filters))
    },

    viewProfileByUserId(userId) {
      if (userId)
        this.$router.push({
          name: 'account-management-view-account',
          params: {
            userId: userId,
          },
        })
    },
    viewRoadMap(studentID, userID, classID) {
      this.$router.push({
        name: 'student-roadmap-overview',
        query: {
          studentID: studentID,
          classID: classID,
          userID: userID,
        },
      })
    },
    async reload() {
      this.isLoading = true
      this.overlay = false
      this.getClassInfo()
      this.isLoading = false
    },
    noteOnChange(value) {
      this.noteText = value
    },
    saveNote() {
      this.overlay = false
      this.reload()
    },

    btn_Edit() {
      this.isEdit = true
    },
    openEditNote(item) {
      if (item.remarks == null || item.remarks == '') this.isEdit = true
      else this.isEdit = false
      this.overlay = true
      // this.scheduleIDEdit = item.scheduleID
      this.noteText = item.remarks
    },
    async init() {
      this.desserts = []
      await report_revenue
        .getReportStopped(this.locastion, this.fromDate, this.toDate)
        .then(res => {
          if (res) {
            this.desserts = res
            this.desserts.forEach(element => {
              element.dob = this._dayjs(element.dob).format('DD/MM/YYYY')
              element.terminateDate = this._dayjs(element.terminateDate).format('DD/MM/YYYY')
              if (element.stopped == null || element.stopped == '') element.stopped = 'No'
              else element.stopped = 'Yes'
              if (element.hasRoadmap == 'Yes') element.hasRoadMap = 'Yes'
              else element.hasRoadMap = 'No'
              // if (element.remarks == null || element.remarks == '') element.remarksFilter = 'No'
              // else element.remarksFilter = 'Yes'
            })
          }
        })
    },
    // async init2() {
    //   await report_revenue.getReportLocation().then(res => {
    //     if (res) {
    //       this.locationdatas = res
    //       res.map(item => this.locations.push(item.location))
    //     }
    //   })
    // },
    changeSelec(id) {
      this.locastion = id
      localStorage.setItem('stopCenter', id)
      this.init()
    },
    getColor(programme) {
      if (programme === 'Stopped') return 'red'
      else if (programme === 'Saving fee') return 'orange'
      else return 'green'
    },
    changeFrom(id) {
      this.fromDate = dayjs(id).format('YYYY-MM-DD')
      localStorage.setItem('stopFrom', id)
      this.init()
    },
    changeTo(id) {
      this.toDate = dayjs(id).format('YYYY-MM-DD')
      localStorage.setItem('stopTo', id)
      this.init()
    },
    groupColumnValueList(val) {
      return this.desserts.map(d => d[val]).filter(y => y)
    },
    printDate: function () {
      return new Date().toLocaleDateString()
    },
    viewDetailClass(classID) {
      // localStorage.setItem('dateOfDailyClasses', this.date)
      // localStorage.removeItem('isBackFromDetailDailyClasses')
      this.$router.push({
        name: 'class-management-detail',
        query: { classID: classID },
      })
    },
    viewDetailProfile(userId) {
      this.$router.push({
        name: 'account-management-view-account',
        params: {
          userId: userId,
        },
      })
    },
    toggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.desserts
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, []).length
        ) {
          this.filters[value] = []
        } else {
          this.filters[value] = this.desserts
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, [])
            .slice()
        }
      })
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss">
/*take note*/
.h {
  background: rgba(0, 0, 0, 0.01);
  position: fixed;
  width: 100%;
  height: 100%;

  top: 0;
  z-index: 1000;
  left: 0;
}
.card-i {
  width: 500px;
  position: absolute;
  top: 50%;

  left: 50%;
  transform: translate(-50%, -50%);
}
.btnNote {
  float: right;
  margin-top: 20px;
}
.btnNote button {
  margin-left: 20px;
  min-width: 150px !important;
}
// end take note
.v-data-table-header__icon {
  display: none !important;
}
.stopped {
  padding: 20px 40px 40px 40px;
}

.header {
  display: flex;
}

.header h2 {
  margin-left: 5px;
}

.formTo {
  display: flex;
  .col {
    padding-left: 0;
  }
}
.v-data-table-header {
  background-color: #0b2585;
  z-index: 5;
}
.sortable {
  color: #fff !important;
  background-color: #0b2585 !important;

  font-weight: 100;
  text-align: center;
  /* padding-top: 20px !important; */
}
.v-application .pl-10 {
  padding-left: 40px !important;
  margin-top: 100px;
}
.spendingTable tbody tr:nth-child(odd) {
  background-color: #f3faff;
}
.text-start {
  padding: 0 16px !important;
}
.link {
  cursor: pointer;
  color: #427df2 !important;
}
.link:hover {
  text-decoration: underline;
  font-weight: 700;
}
// roadmap
.disible {
  pointer-events: none;
  color: #0c2e68;

  opacity: 0.4;
}
// end roadmap
.spanYes {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  gap: 10px;
  color: #deffec;
  width: 106px;
  height: 25px;
  color: #039f45;
  background: #deffec;
  border-radius: 4px;
}
.spanNo {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  gap: 10px;
  width: 106px;
  height: 25px;
  background: #fff6dd;
  border-radius: 4px;
  color: #fa8c06;
}
</style>
