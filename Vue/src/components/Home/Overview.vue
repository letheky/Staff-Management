<template>
  <div class="home">
    <v-col class="select-location" sm="12" xs="12" md="12" lg="3">
      <v-select
        :items="centerList"
        item-text="location"
        item-value="locationID"
        append-icon="keyboard_arrow_down"
        outlined
        dense
        hide-details
        placeholder="Center"
        v-model="locationID"
        @change="changeLocation"
      >
      </v-select>
    </v-col>
    <v-row>
      <v-col sm="12" xs="12" md="12" lg="6">
        <TableData
          :locationid="locationID"
          :filters="filterBirthDay"
          :headers="colsBirthday"
          :keyGet="null"
          type="birthday"
          :searchTexts="getObjectSearch(filterBirthDay)"
          @getData="staff_absence.getUserBirthDay"
          :listLocation="listLocation"
          :dataHeader="headerBirthday"
          @handleData="handleBirthDay"
        />
      </v-col>
      <v-col sm="12" xs="12" md="12" lg="6">
        <TableData
          :locationid="locationID"
          :filters="filterRunOutMoney"
          :headers="colsRunOutMoney"
          :searchTexts="getObjectSearch(filterRunOutMoney)"
          :keyGet="null"
          @getData="student_information.getOutstandingPaymentbyDueDate"
          :listLocation="listLocation"
          :dataHeader="headerRunOutMoney"
        />
      </v-col>
      <v-col sm="12" xs="12" md="12" lg="6">
        <TableData
          :locationid="locationID"
          :filters="filtersRegistered"
          :headers="colsRegistered"
          :keyGet="'registers'"
          :searchTexts="getObjectSearch(filtersRegistered)"
          @getData="student_information.getVisitAndRegister"
          :listLocation="listLocation"
          :dataHeader="headerRegisteredStu"
        />
      </v-col>
      <v-col sm="12" xs="12" md="12" lg="6">
        <TableData
          :locationid="locationID"
          :filters="filtersPlacementTest"
          :headers="colsPlacementTest"
          :keyGet="null"
          :searchTexts="getObjectSearch(filtersPlacementTest)"
          @getData="student_information.getPlacementTest"
          :listLocation="listLocation"
          :dataHeader="headerScheduleStu"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import TableData from './TableData.vue'

import iconRunOut from '../../assets/images/icon-run-out.svg'
import iconRegister from '../../assets/images/icon-regis-stu.svg'
import iconSchedule from '../../assets/images/icon-pt-stu-schedule.svg'
import { center_managerment } from '@/api/center-management'

import { student_information } from '@/api/student-information'
import { staff_absence } from '@/api/staff-absence'
export default {
  setup() {
    return {
      iconRunOut,
      iconRegister,
      iconSchedule,
      student_information,
      staff_absence,
    }
  },
  data() {
    return {
      centerList: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
      locationID: parseInt(localStorage.getItem('currentCenter')),
      student_information,
      staff_absence,
      listLocation: [],
      filterRunOutMoney: {
        studentCode: [],
        studentName: [],
        dueDate: [],
        outstandingFee: [],
        ec: [],
      },
      filterBirthDay: {
        code: [],
        name: [],
        dob: [],
        location: [],
        classCode: [],
        qc: [],
        ec: [],
      },
      filtersRegistered: {
        studentCode: [],
        studentType: [],
        studentName: [],
        registrationDate: [],
        classCode: [],
        register: [],
        regUser: [],
      },
      filtersPlacementTest: {
        studentCode: [],
        studentName: [],
        testTime: [],
        ec: [],
        testDate: [],
      },

      colsRunOutMoney: [
        {
          text: 'Student code',
          value: 'studentCode',
          sortable: false,
          color: '#000',
          formatMoney: false,
        },
        {
          text: 'Student name',
          value: 'studentName',
          width: '12%',
          color: '#427DF2',
          align: 'left',
          formatMoney: false,
        },

        {
          text: 'Due date',
          value: 'dueDate',
          sortable: false,
          color: '#000',
          formatMoney: false,
          formatDate: true,
        },
        {
          text: 'Outstanding',
          value: 'outstandingFee',
          sortable: true,
          color: '#000',
          formatMoney: true,
          align: 'right',
        },
        {
          text: 'Ec',
          value: 'ec',
          sortable: false,
          color: '#427DF2',
        },
      ],
      colsRegistered: [
        {
          text: 'Student Code',
          value: 'studentCode',
          sortable: false,
          color: '#000',
          formatMoney: false,
        },
        {
          text: 'Student Name',
          value: 'studentName',
          width: '12%',
          sortable: false,
          color: '#427DF2',
          formatMoney: false,
        },
        {
          text: 'Student Type',
          value: 'studentType',
          sortable: false,
          color: '#000',
        },
        {
          text: 'Registration Date',
          value: 'registrationDate',
          formatDate: true,
          sortable: false,
          color: '#000',
          formatMoney: false,
        },
        {
          text: 'Class Code',
          value: 'classCode',
          sortable: false,
          color: '#427DF2',
          formatMoney: false,
        },
        {
          text: 'Reg User',
          value: 'regUser',
          sortable: false,
          color: '#427DF2',
          formatMoney: false,
        },
      ],
      colsBirthday: [
        {
          text: 'Code',
          value: 'code',
          sortable: false,
          color: '#000',
          formatMoney: false,
        },
        {
          text: 'Name',
          value: 'name',
          width: '12%',
          sortable: false,
          color: '#427DF2',
          formatMoney: false,
        },
        {
          text: 'Birthday',
          value: 'dob',
          sortable: false,
          color: '#000',
          formatDate: true,
          formatMoney: false,
        },
        {
          text: 'Class code',
          value: 'classCode',
          sortable: false,
          color: '#427DF2',
          formatMoney: false,
        },
        {
          text: 'QC',
          value: 'qc',
          sortable: false,
          color: '#427DF2',
          formatMoney: false,
        },
        {
          text: 'EC',
          value: 'ec',
          sortable: false,
          color: '#427DF2',
          formatMoney: false,
        },
      ],
      colsPlacementTest: [
        {
          text: 'Student Code',
          value: 'studentCode',
          sortable: false,
          color: '#000',
          formatMoney: false,
        },
        {
          text: 'Student Name',
          value: 'studentName',
          sortable: false,
          color: '#427DF2',
          formatMoney: false,
        },

        {
          text: 'Test Date',
          value: 'testDate',
          sortable: false,
          color: '#000',
          formatDate: true,
          formatMoney: false,
        },
        {
          text: 'Test Time',
          value: 'testTime',
          sortable: false,
          color: '#000',
        },
        {
          text: 'Ec',
          value: 'ec',
          sortable: false,
          color: '#427DF2',
          formatMoney: false,
        },
      ],
      headerRunOutMoney: {
        icon: iconRunOut,
        text: 'Running out of money',
        listLink: [
          {
            text: 'View ',
            link: '/report/outstanding-report',
          },
        ],
      },
      headerRegisteredStu: {
        text: 'New Registered Students',
        icon: iconRegister,
        listLink: [
          {
            text: 'Registered Students',
            link: '/report/registration-statement-report',
          },
        ],
      },
      headerScheduleStu: {
        text: 'PT Students Schedule',
        icon: iconSchedule,
        listLink: [
          {
            text: 'View Students PT Report',
            link: '/report/placement-test-student-report',
          },
        ],
      },
      headerBirthday: {
        text: 'Upcoming Birthdays',
        icon: iconSchedule,
        listLink: [
          {
            text: '? Report',
            link: '/download/',
          },
        ],
      },
    }
  },
  watch: {
    listLocation: function (newListLocation) {
      if (newListLocation.length !== 0) {
        this.location = newListLocation[0].locationID
        this.listLocationSelect = newListLocation.map(item => {
          return item.location
        })
      }
    },
  },

  created() {
    this.init()
  },
  methods: {
    getObjectSearch(filters) {
      return Object.keys(filters).reduce((objectSearch, searchName) => {
        objectSearch[searchName] = ''
        return objectSearch
      }, {})
    },
    async init() {
      await center_managerment.getAllCenter().then(res => {
        this.listLocation = res
      })
    },
    changeLocation(locationID) {
      this.locationID = locationID
      this.init()
    },
    handleBirthDay(data) {
      const newListBrith = []
      data.employees.forEach(item => {
        newListBrith.push({
          code: item.teacherCode,
          name: item.teacherName,
          dob: item.dob,
          qc: '-',
          ec: '-',
          qC_userID: '',
          eC_userID: '',
          location: item.location,
          classID: '-',
          classCode: '-',
        })
      })
      data.students.forEach(item => {
        newListBrith.push({
          code: item.studentCode,
          name: item.studentName,
          dob: item.dob,
          location: item.location,
          classCode: item.classCode,
          qc: item.qc,
          ec: item.ec,
          student_userID: String(item.student_userID),
          qC_userID: item.qC_userID,
          eC_userID: item.eC_userID,
          classID: item.classID,
        })
      })
      return newListBrith
    },
  },
  components: { TableData },
}
</script>

<style lang="scss" scoped>
.home {
  padding: 3rem 1rem;
}

.mg-3 {
  margin-top: 3rem;
}

.select-location {
  padding-left: 0 !important;
}
</style>
