<template>
  <div class="absent">
    <h2>Absent students report</h2>
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
            v-model="date"
            label="Select date"
            :class="'select-input'"
            outlined
            dense
            hide-details
            @change="changeDate"
          /></div
      ></v-col>
      <v-col>
        <div class="btn-download">
          <v-btn elevation="0" height="36" color="primary" @click="download()">
            Download file excel
          </v-btn>
        </div></v-col
      >
    </v-row>
    <h4>Total : {{ listStudent.length }} students</h4>
    <template>
      <v-data-table
        :headers="headers"
        :items="filtered"
        :items-per-page="100000000000000000"
        hide-default-footer
        class="elevation-0 absent-table"
        :id="'absent-table'"
        fixed-header
        height="69vh"
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

        <template v-slot:[`item.classcode`]="{ item }">
          <p class="link" @click="viewClassDetail(item.classID)">{{ item.classcode }}</p>
        </template>
        <template v-slot:[`item.makeUpClassCode`]="{ item }">
          <p class="link" @click="viewClassDetail(item.makeUpClassID)">
            {{ item.makeUpClassCode }}
          </p>
        </template>
        <template v-slot:[`item.no`]="{ index }">
          <p>{{ index + 1 }}</p>
        </template>
        <template v-slot:[`item.classGroup`]="{ item }">
          <p :class="'type-makup lesson-type'" v-if="item.classGroup === 'Make-up'">
            {{ item.classGroup }}
          </p>
          <p :class="'type-public lesson-type'" v-if="item.classGroup === 'Official'">Official</p>
        </template>
        <template v-slot:[`item.fullname`]="{ item }">
          <p class="link" @click="viewStudent(item.student_userID)">{{ item.fullname }}</p>
        </template>
        <template v-slot:[`item.qc`]="{ item }">
          <p class="link" @click="viewStaff(item.qC_userID)">{{ item.qc }}</p>
        </template>
        <template v-slot:[`item.ec`]="{ item }">
          <p class="link" @click="viewStudent(item.eC_userID)">{{ item.ec }}</p>
        </template>
        <template v-slot:[`item.mkStatus`]="{ item }">
          <div :style="{ width: 'fit-content', margin: '0 auto' }">
            <img
              :style="{
                width: item.mkStatus === 'Absent' ? '34px' : '27px',
              }"
              :src="
                item.mkStatus === 'Absent'
                  ? require('../../assets/images/icon-close-red.svg')
                  : item.mkStatus === 'Attended'
                  ? require('../../assets/images/icon-done.svg')
                  : item.mkStatus === 'Pending'
                  ? require('../../assets/images/icon-pendding.svg')
                  : ''
              "
              alt=""
              srcset=""
            />
          </div>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <img
                :style="{
                  opacity:
                    !(
                      item.classGroup === 'Make-up' ||
                      dayjs().isBefore(dayjs(item.makeUpDateWithShift))
                    ) && item.makeUpID
                      ? 0.4
                      : 1,
                }"
                v-bind="attrs"
                v-on="on"
                @click="
                  item.classGroup === 'Make-up' ||
                    (item.makeUpDate && dayjs().isAfter(dayjs(item.makeUpDateWithShift))) ||
                    openForm(item)
                "
                src="../../assets/images/icon-edit-pen.svg"
              />
            </template>
            <span>
              {{
                item.classGroup === 'Make-up' ||
                (item.makeUpDate && dayjs().isAfter(dayjs(item.makeUpDateWithShift)))
                  ? "Can't Add/Edit"
                  : 'Add/Edit'
              }}</span
            >
          </v-tooltip>
        </template>
      </v-data-table>
      <FormMakeupLesson
        v-if="dialogForm"
        @setLog="setLog"
        @callData="init"
        :makeupInfor="{
          ...makeupInfor,
          classDate: makeupInfor.classDate.split('/').reverse().join('-'),
        }"
        :dialog="dialogForm"
      />
    </template>
  </div>
</template>

<script>
import { statistic_management } from '@/api/statistic-management'
import FormMakeupLesson from './FormMakeupLesson.vue'
import Autocomplete from '@/components/Utils/Autocomplete.vue'
import XLSX from 'xlsx'
import dayjs from 'dayjs'
export default {
  components: { Autocomplete, FormMakeupLesson },
  data() {
    return {
      listStudent: [],
      makeupInfor: {},
      dialogForm: false,
      date: new Date().toISOString().split('T')[0],
      listLocation: [],
      locationID: 1,
      headers: [
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
          value: 'fullname',
          sortable: false,
        },
        {
          text: 'Phone',
          value: 'mobilePhone',
          sortable: false,
        },
        {
          text: 'Class code',
          value: 'classcode',
          sortable: false,
        },
        {
          text: 'Class date',
          value: 'classDate',
          sortable: false,
        },
        {
          text: 'Time',
          value: 'classTime',
          sortable: false,
        },
        {
          text: 'Lesson type',
          value: 'classGroup',
          sortable: false,
        },
        {
          text: 'QC',
          value: 'qc',
          sortable: false,
        },
        {
          text: 'EC',
          value: 'ec',
          sortable: false,
        },

        {
          text: 'Make-up class',
          value: 'makeUpClassCode',
          sortable: false,
        },
        {
          text: 'Make-up date',
          value: 'makeUpDate',
          sortable: false,
        },
        {
          text: 'Make-up shift',
          value: 'makeUpShift',
          sortable: false,
        },
        {
          text: 'Make-up shift',
          value: 'makeUpShift',
          sortable: false,
        },
        {
          text: 'MK Status',
          value: 'mkStatus',
          sortable: false,
        },
        {
          text: 'Action',
          value: 'action',
          sortable: false,
        },
      ],
      filters: {
        classcode: [],
        studentCode: [],
        classDate: [],
        qc: [],
        ec: [],
        mkStatus: [],
        makeUpClassCode: [],
        fullname: [],
        classTime: [],
        mobilePhone: [],
        makeUpShift: [],
        makeUpDate: [],
        classGroup: [],
      },
    }
  },
  computed: {
    filtered() {
      return this.listStudent.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
    },
  },
  setup() {
    return {
      dayjs: dayjs,
    }
  },
  created() {
    this.listLocation = JSON.parse(localStorage.getItem('currentUser')).locationPermissions
    this.locationID = parseInt(localStorage.getItem('currentCenter'))
    if (localStorage.getItem('absCenter'))
      this.locationID = parseInt(localStorage.getItem('absCenter'))
    if (localStorage.getItem('absDate')) this.date = localStorage.getItem('absDate')
    if (localStorage.getItem('absentStudent'))
      this.filters = JSON.parse(localStorage.getItem('absentStudent'))
    this.init()
  },

  watch: {
    date: function () {
      localStorage.setItem('absDate', this.date)
      this.init()
    },
    locationID: function () {
      localStorage.setItem('absCenter', this.locationID)
      this.init()
    },
  },
  methods: {
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
      localStorage.setItem('absentStudent', JSON.stringify(this.filters))
    },
    setLog(data) {
      console.log(data)
      this.dialogForm = data.openDialog ? data.openDialog : false
      this.makeupInfor = data.makeup ? data.makeupInfor : ''
    },
    openForm(makeupInfor) {
      this.makeupInfor = makeupInfor
      this.dialogForm = true
    },
    groupColumnValueList(val) {
      return this.listStudent.map(d => d[val]).filter(y => y)
    },
    toggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.listStudent
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
          this.filters[value] = this.listStudent
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
    viewClassDetail(classID) {
      this.$router.push({
        name: 'class-management-detail',
        query: {
          classID: classID,
        },
      })
    },
    changeDate(val) {
      this.date = val
    },
    async init() {
      await statistic_management.getStudentAbsentReport(this.locationID, this.date).then(res => {
        this.listStudent = res.map(item => {
          return {
            ...item,
            makeUpDate: item.makeUpDate ? dayjs(item.makeUpDate).format('DD/MM/YYYY') : '',
            classGroup: item.classGroup === 'Public' ? 'Official' : item.classGroup,
            classDate: item.classDate ? dayjs(item.classDate).format('DD/MM/YYYY') : '',
            mkStatus: !item.mkStatus && item.makeUpID ? 'Pending' : item.mkStatus,
            makeUpDateWithShift:
              this.getTimeInobject(item.makeUpShift) &&
              dayjs(item.makeUpDate)
                .add(this.getTimeInobject(item.makeUpShift).hour, 'hour')
                .add(this.getTimeInobject(item.makeUpShift).min, 'minute'),
            // no: index + 1,
            // classGroup: index === 2 ? 'Make-up' : 'Public',
            // makeUpID: index === 3 || index === 2 ? null : 2323,
            // makeUpClassID: index === 3 || index === 2 ? null : 2910,
            // makeUpClassCode: index === 3 || index === 2 ? null : 'VQ1-B1-2203',
            // makeUpLessonNo: index === 3 || index === 2 ? null : 1,
            // makeUpDate: index === 3 || index === 2 ? null : ' 2023-03-11',
            // makeUpShift: index === 3 || index === 2 ? null : '17:30 - 19:00',
          }
        })
      })
    },
    async download() {
      var table_elt = document.getElementById('absent-table').getElementsByTagName('table')[0]
      var workbook = XLSX.utils.table_to_book(table_elt)
      XLSX.writeFile(workbook, 'Absent_students_report' + this.date + '.xlsm')
      this.isDownload = false
    },
  },
}
</script>

<style lang="scss" scoped>
.lesson-type {
  width: 80px;
  height: 30px;
  color: #ffff;
  line-height: 30px;
  border-radius: 4px;
  text-align: center;

  &.type-public {
    background: #27ae60;
  }
  &.type-makup {
    background: #f6b91a;
  }
}
.absent-btn-download {
  width: fit-content;
  margin-left: auto;
}
.select-input {
  max-width: 300px;
  margin-right: 40px !important;
}
h4 {
  margin-bottom: 14px;
}
h2 {
  margin-bottom: 20px;
}
.absent {
  padding: 20px 36px;
}
.absent-table {
  border-radius: 5px;
  overflow: hidden;
}
.btn-download {
  width: fit-content;
  margin-left: auto;
}
.link {
}
.link {
  cursor: pointer;

  color: #427df2 !important;
}

.link:hover {
  text-decoration: underline;
  font-weight: 700;
}
</style>
