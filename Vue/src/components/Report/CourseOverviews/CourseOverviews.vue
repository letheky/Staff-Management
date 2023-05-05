<template>
  <div class="mt-3 ml-10 mr-10" id="course-management">
    <v-row md="12" no-gutters>
      <v-col sm="2">
        <div class="d-flex justify-space-between">
          <h2>Course Overview</h2>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="2" class="mb-5">
        <v-select
          :items="centerList"
          v-model="locationID"
          item-text="location"
          item-value="locationID"
          append-icon="keyboard_arrow_down"
          outlined
          dense
          hide-details
          @change="reset"
          placeholder="Center"
        >
        </v-select>
      </v-col>

      <v-col sm="2">
        <v-autocomplete
          v-model="select"
          :items="classStatus"
          label="Class status"
          @change="reset"
          item-text="classStatus"
          item-value="classStatusID"
          outlined
          dense
        ></v-autocomplete>
      </v-col>
    </v-row>
    <template>
      <v-row no-gutters>
        <v-col md="12" class="pl-0">
          <div class="pl-0 pr-0 pb-10 pt-0">
            <v-data-table
              :headers="headers"
              :items="filtered"
              :page.sync="page"
              :items-per-page="itemsPerPage"
              hide-default-header
              hide-default-footer
              @page-count="pageCount = $event"
              class="elevation-0"
              id="revenueTable"
              fixed-header
              height="70vh"
            >
              <template v-slot:header="{ props }">
                <thead class="v-data-table-header">
                  <tr>
                    <th
                      v-for="header in props.headers"
                      :key="header.text"
                      role="columnheader"
                      scope="col"
                      aria-label="No"
                      class="text-start font-weight-bold"
                      :style="
                        'width:' +
                        header.width +
                        '; min-width:' +
                        header.width +
                        ';' +
                        ' background-color:' +
                        getColor(header.text) +
                        ';' +
                        'color:' +
                        '#0C2E68 !important'
                      "
                    >
                      <span>{{ header.text }}</span>
                    </th>
                  </tr>
                </thead>
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

              <template v-slot:[`item.classCode`]="{ item }">
                <td
                  @click="viewDetailClass(item.classID)"
                  :style="{
                    position: 'sticky',
                    left: '0',
                    cursor: 'pointer',

                    color: '#427df2',
                  }"
                  class="sticky-left link"
                >
                  <p>{{ item.classCode }}</p>
                </td>
              </template>
              <template v-slot:[`item.payableFee`]="{ item }">
                <td class="sticky-left">
                  <p>{{ numberWithCommas(item.payableFee) }}</p>
                </td>
              </template>
              <template v-slot:[`item.schoolFee`]="{ item }">
                <td class="sticky-left">
                  <p>{{ numberWithCommas(item.schoolFee) }}</p>
                </td>
              </template>
            </v-data-table>
            <!-- <v-row class="mt-2 pl-2 pr-2">
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
              <v-col class="d-flex align-center justify-end">
                <h3 v-if="filtered.length != 1">Total: {{ filtered.length }} accounts</h3>
                <h3 v-else>Total: {{ filtered.length }} account</h3>
              </v-col>
              <v-col class="d-flex justify-end">
                <v-pagination
                  v-model="page"
                  :length="pageCount"
                  :total-visible="7"
                  elevation="0"
                ></v-pagination>
              </v-col>
            </v-row> -->
          </div>
        </v-col>
      </v-row>
    </template>
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
      <v-col md="4" class="d-flex align-center justify-end"> Total : {{ filtered.length }}</v-col>
      <v-col md="6" class="d-flex justify-end">
        <v-pagination
          v-model="page"
          :length="pageCount"
          elevation="0"
          :total-visible="7"
        ></v-pagination>
      </v-col>
    </v-row>
    <!-- <popup-confirm
      @confirm="confirmActive"
      @cancel="cancelActive"
      :maxWidth="maxWidth"
      :width="width"
      :confirmColor="'success'"
      ref="confirmActive"
    >
      <v-card-title style="display: flex; flex-direction: column" slot="icon" class="pt-0">
        <v-icon x-large color="success" class="mb-5" outline>mdi-checkbox-marked-circle</v-icon>
      </v-card-title>
      <v-card-title style="display: flex; flex-direction: column" slot="title" class="pt-0 mb-5">
        <h2 class="text-center">Confirm active</h2>
        <p class="text-center">Are you sure to active this account?</p>
      </v-card-title>
      <v-card-actions> </v-card-actions>
    </popup-confirm>
    <popup-confirm
      @confirm="confirmDeactive"
      @cancel="cancelDeactive"
      :maxWidth="maxWidth"
      :width="width"
      :confirmColor="'error'"
      ref="confirmDeactive"
    >
      <v-card-title style="display: flex; flex-direction: column" slot="icon" class="pt-0">
        <v-icon x-large color="error" class="mb-5" outline>mdi-close-circle</v-icon>
      </v-card-title>
      <v-card-title style="display: flex; flex-direction: column" slot="title" class="pt-0 mb-5">
        <h2 class="text-center">Confirm deactive</h2>
        <p class="text-center">Are you sure to deactive this account?</p>
      </v-card-title>
      <v-card-actions> </v-card-actions>
    </popup-confirm> -->
    <!-- <v-row justify="center">
      <v-dialog v-model="errorDialog" persistent width="350">
        <v-card class="mx-auto pa-10">
          <div class="text-center">
            <h1>Error!</h1>
            <p>{{ message.messages.UNKNOWN_ERROR }}</p>
          </div>ourse_inter
          <div class="text-center">
            <v-btn color="error" elevation="0" @click="back()" outlined> Back </v-btn>
          </div>
        </v-card>
      </v-dialog>
    </v-row> -->
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { account_managerment } from '@/api/account-management.js'
// import PopupConfirm from '@/components/Utils/PopupConfirm.vue'
import Autocomplete from '@/components/Utils/Autocomplete.vue'
import message from '@/components/Utils/message'
import { course_inter } from '@/api/course_overview'
import { class_managerment } from '@/api/class-management'

export default {
  components: {
    // 'popup-confirm': PopupConfirm,
    Autocomplete,
  },
  data() {
    return {
      classStatus: [],
      isLoading: false,
      accountTypes: [],
      select: 3,
      selectedAccountType: null,
      courseList: [],
      page: 1,

      pageCount: 0,
      itemsPerPage: 20,
      headers: [
        { text: 'Class Code', value: 'classCode', width: '137px' },
        { text: 'Start date', value: 'startDate', width: '101px' },
        { text: 'End date', value: 'endDate', width: '101px' },
        { text: 'Registered students', value: 'noStd', width: '109px' },
        { text: 'Completed hours', value: 'hourCompleted', width: '103px' },
        { text: 'Weeks duration', value: 'weekDuration', width: '86px' },
        { text: 'Duration', value: 'duration', width: '71px' },
        { text: 'QC', value: 'qc', width: '220px' },
        { text: 'Class note', value: 'note', width: '168px' },
        { text: 'EC', value: 'ec', width: '220px' },
        { text: 'Fee', value: 'schoolFee', width: '118px' },
        { text: 'Payable fee', value: 'payableFee', width: '118px' },
        { text: 'Pre. Class Code', value: 'preClassCode', width: '137px' },
        { text: 'Pre.StuNumber', value: 'preClsNoOfStu', width: '90px' },
        { text: 'Level', value: 'level', width: '200px' },
        { text: 'Day 1', value: 'day1', width: '69px' },
        { text: 'Time 1', value: 'time1', width: '105px' },
        { text: 'Teacher day 1', value: 'teacherDay1', width: '220px' },
        { text: 'TA day 1', value: 'tA1', width: '220px' },
        { text: 'Day 2', value: 'day2', width: '69px' },
        { text: 'Time 2', value: 'time2', width: '105px' },
        { text: 'Teacher day 2', value: 'teacherDay2', width: '220px' },
        { text: 'TA day 2', value: 'tA2', width: '220px' },
        { text: 'Day 3', value: 'day3', width: '69px' },
        { text: 'Time 3', value: 'time3', width: '105px' },
        { text: 'Teacher day 3', value: 'teacherDay3', width: '220px' },
        { text: 'TA day 3', value: 'tA3', width: '220px' },
        { text: 'TA day 4', value: 'tA4', width: '69px' },
        { text: 'Day 4', value: 'day4', width: '105px' },
        { text: 'Time 4', value: 'time4', width: '220px' },
        { text: 'Teacher day 4', value: 'teacherDay4', width: '220px' },
        { text: 'Day 5', value: 'day5', width: '69px' },
        { text: 'Time 5', value: 'time5', width: '105px' },
        { text: 'Teacher day 5', value: 'teacherDay5', width: '220px' },
        { text: 'TA day 5', value: 'tA5', width: '220px ' },
        { text: 'Day 6', value: 'day6', width: '69px' },
        { text: 'Time 6', value: 'time6', width: '105px' },
        { text: 'Teacher day 6', value: 'teacherDay6', width: '220px' },
        { text: 'TA day 6', value: 'tA6', width: '220px' },
        { text: 'Day 7', value: 'day7', width: '69px' },
        { text: 'Time 7', value: 'time7', width: '105px' },
        { text: 'Teacher day 7', value: 'teacherDay7', width: '220px' },
        { text: 'TA day 7', value: 'tA7', width: '220px' },
      ],
      filters: {
        studentCode: [],
        classCode: [],
        startDate: [],
        endDate: [],
        schoolFee: [],
        Registeredstudents: [],
        hourCompleted: [],
        weekDuration: [],
        duration: [],
        noStd: [],
        qc: [],
        note: [],
        ec: [],
        Fee: [],
        payableFee: [],
        preClassCode: [],
        preClsNoOfStu: [],
        level: [],
        day1: [],
        time1: [],
        teacherDay1: [],
        tA1: [],
        day2: [],
        time2: [],
        teacherDay2: [],
        tA2: [],
        day3: [],
        time3: [],
        teacherDay3: [],
        tA3: [],
        teacherDay4: [],
        tA4: [],
        day4: [],
        time4: [],
        teacherDay5: [],
        tA5: [],
        day5: [],
        time5: [],
        teacherDay6: [],
        tA6: [],
        day6: [],
        time6: [],
        teacherDay7: [],
        tA7: [],
        day7: [],
        time7: [],
      },
      locationList: [],
      centerList: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
      locationID: JSON.parse(localStorage.getItem('currentCenter')),
      maxWidth: 1000,
      width: 500,
      inactive: '',
      errorDialog: false,
      message: message,
    }
  },
  created() {
    this.init()
    if (localStorage.getItem('cousFilter')) {
      this.filters = JSON.parse(localStorage.getItem('cousFilter'))
    }
    if (localStorage.getItem('CosCenter')) {
      this.locationID = parseInt(JSON.parse(localStorage.getItem('CosCenter')))
    }
    if (JSON.parse(localStorage.getItem('CousStu'))) {
      this.select = JSON.parse(localStorage.getItem('CousStu'))
    }
  },
  computed: {
    filtered() {
      return this.courseList.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
    },
  },
  watch: {
    locationID: function () {
      localStorage.setItem('CosCenter', this.locationID)

      this.getListCourse()
    },
    filters: () => {},
    select: function () {
      localStorage.setItem('CousStu', this.select)

      this.getListCourse()
    },
  },
  methods: {
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
      localStorage.setItem('cousFilter', JSON.stringify(this.filters))
    },
    reset() {
      this.filters = {
        studentCode: [],
        classCode: [],
        startDate: [],
        endDate: [],
        schoolFee: [],
        Registeredstudents: [],
        hourCompleted: [],
        weekDuration: [],
        duration: [],
        noStd: [],
        qc: [],
        note: [],
        ec: [],
        Fee: [],
        payableFee: [],
        preClassCode: [],
        preClsNoOfStu: [],
        level: [],
        day1: [],
        time1: [],
        teacherDay1: [],
        tA1: [],
        day2: [],
        time2: [],
        teacherDay2: [],
        tA2: [],
        day3: [],
        time3: [],
        teacherDay3: [],
        tA3: [],
        teacherDay4: [],
        tA4: [],
        day4: [],
        time4: [],
        teacherDay5: [],
        tA5: [],
        day5: [],
        time5: [],
        teacherDay6: [],
        tA6: [],
        day6: [],
        time6: [],
        teacherDay7: [],
        tA7: [],
        day7: [],
        time7: [],
      }
    },
    viewDetailClass(classID) {
      localStorage.setItem('dateOfDailyClasses', this.date)
      localStorage.removeItem('isBackFromDetailDailyClasses')
      this.$router.push({
        name: 'class-management-detail',
        query: { classID: classID },
      })
    },

    async getListCourse() {
      await course_inter.getCourseInter(this.locationID, this.select).then(res => {
        this.courseList = res.map(item => {
          return {
            ...item,
            startDate:
              item.startDate !== null
                ? this.formatTime(new Date(item.startDate.split('T')[0]))
                : '',
            endDate:
              item.endDate !== null ? this.formatTime(new Date(item.endDate.split('T')[0])) : '',
          }
        })
      })
    },
    formatTime(date) {
      const yyyy = date.getFullYear()
      let mm = date.getMonth() + 1 // Months start at 0!
      let dd = date.getDate()

      if (dd < 10) dd = '0' + dd
      if (mm < 10) mm = '0' + mm

      const formattedToday = dd + '/' + mm + '/' + yyyy
      return formattedToday
    },
    async init() {
      this.isLoading = true
      await class_managerment.getClassStatus().then(res => {
        this.classStatus = res
      })
      await account_managerment.getAccountTypes().then(res => {
        if (res) {
          this.accountTypes = res
        }
      })
      this.getListCourse()
    },
    groupColumnValueList(val) {
      return this.courseList.map(d => d[val]).filter(y => y)
    },
    toggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.courseList
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, []).length
        ) {
          this.filters[value] = []
          localStorage.setItem(
            'cousFilter',
            JSON.stringify({
              ...this.filters,
              [value]: [],
            })
          )
        } else {
          this.filters[value] = this.courseList
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, [])
            .slice()
          localStorage.setItem(
            'cousFilter',
            JSON.stringify({
              ...this.filters,
              [value]: this.courseList
                .map(d => d[value])
                .reduce(function (accumulator, element) {
                  if (accumulator.indexOf(element) === -1) {
                    accumulator.push(element)
                  }
                  return accumulator
                }, [])
                .slice(),
            })
          )
        }
      })
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    getColor(programme) {
      if (programme === 'Class Code' || programme === 'Start date' || programme === 'End date')
        return '#A0D589'
      else if (
        programme === 'Registered students' ||
        programme === 'Completed hours' ||
        programme === 'Weeks duration' ||
        programme === 'Duration' ||
        programme === 'QC' ||
        programme === 'Class note'
      )
        return '#FFCF53'
      else if (programme === 'EC' || programme === 'Fee' || programme === 'Payable fee')
        return '#FFCACC'
      else if (
        programme === 'Pre. Class Code' ||
        programme === 'Pre.StuNumber' ||
        programme === 'Level'
      )
        return '#FFCF53'
      else if (
        programme === 'Day 1' ||
        programme === 'Time 1' ||
        programme === 'Teacher day 1' ||
        programme === 'TA day 1'
      )
        return '#BFCDFF'
      else if (
        programme === 'Day 2' ||
        programme === 'Time 2' ||
        programme === 'Teacher day 2' ||
        programme === 'TA day 2'
      )
        return '#FDE9D9'
      else if (
        programme === 'Day 3' ||
        programme === 'Time 3' ||
        programme === 'Teacher day 3' ||
        programme === 'TA day 3'
      )
        return '#BBECA6 '
      else if (
        programme === 'Day 4' ||
        programme === 'Time 4' ||
        programme === 'Teacher day 4' ||
        programme === 'TA day 4'
      )
        return '#FDE9D9'
      else if (
        programme === 'Day 5' ||
        programme === 'Time 5' ||
        programme === 'Teacher day 5' ||
        programme === 'TA day 5'
      )
        return '#FFA6A9'
      else if (
        programme === 'Day 6' ||
        programme === 'Time 6' ||
        programme === 'Teacher day 6' ||
        programme === 'TA day 6'
      )
        return '#FFD5B4'
      else if (
        programme === 'Day 7' ||
        programme === 'Time 7' ||
        programme === 'Teacher day 7' ||
        programme === 'TA day 7'
      )
        return '#FDE9D9'
      else return 'green'
    },
    back() {
      window.history.back()
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped>
#revenueTable th:nth-child(1),
#revenueTable td:nth-child(1) {
  position: sticky;
  left: 0;
}
#revenueTable th:nth-child(1),
#revenueTable td:nth-child(1) {
  background: rgb(255, 255, 255);
}
#revenueTable th:nth-child(1),
#revenueTable th:nth-child(1) {
  z-index: 3;
}
#account-management {
  margin: 40px;
}
.ticky-left {
  position: sticky !important;
  left: 0;
}
.role-list {
  .item {
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(194, 196, 205, 0.1);
    border-radius: 2px;
    padding: 14px 20px 16px 20px;
    display: flex;
    align-content: center;
    justify-content: space-between;
  }
  .link {
    cursor: pointer;

    color: #427df2 !important;
  }
  .link:hover {
    text-decoration: underline;
    font-weight: 700;
  }
  .v-list-item--active:hover::before,
  git .v-list-item--active::before {
    border-radius: 2px;
  }
}
</style>
