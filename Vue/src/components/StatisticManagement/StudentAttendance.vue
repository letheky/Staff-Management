<template>
  <div id="center-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <div class="d-flex">
            <h2>
              <v-icon @click="back()">arrow_back_ios</v-icon>
            </h2>
            <h2 class="pt-1">Student attendance</h2>
          </div>
          <div class="d-flex justify-space-between pt-2">
            <div class="d-flex">
              <v-text-field
                placeholder="Search student"
                hide-details
                v-model="searchStudent"
                counter
                maxlength="100"
                style="background: white"
                outlined
                dense
              ></v-text-field>
              <v-btn class="ml-2" elevation="0" height="36" color="primary" @click="search()">
                <v-icon size="18"> mdi-magnify </v-icon>
              </v-btn>
            </div>
            <v-btn elevation="0" height="36" color="primary" @click="download()">
              Download file excel
            </v-btn>
          </div>
          <div class="d-flex mt-2">
            <div>Center: Trần Phú</div>
            <v-icon class="ml-4" size="18" @click="viewDetail(item.locationID)" color="secondary">
              mdi-reload
            </v-icon>
            <div class="filter-action ml-2" @click="$refs.confirmStatistics.open()">
              Change filter
            </div>
          </div>
          <div>Total: {{ filtered.length }} students</div>
          <v-data-table
            :headers="headers"
            :items="filtered"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            hide-default-footer
            @page-count="pageCount = $event"
            class="elevation-0"
            height="60vh"
            fixed-header
          >
            <template v-slot:header="{ props }">
              <tr class="fixed-row-filter">
                <th v-for="header in props.headers" :key="header.text">
                  <div v-if="filters.hasOwnProperty(header.value)">
                    <v-autocomplete
                      chips
                      small-chips
                      deletable-chips
                      hide-details
                      dense
                      multiple
                      :items="columnValueList(header.value)"
                      v-model="filters[header.value]"
                      class="ma-3 my-1"
                    >
                    </v-autocomplete>
                  </div>
                </th>
              </tr>
            </template>

            <template v-slot:[`item.no`]="{ index }">
              {{ index + 1 }}
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
    <div color="#fff" class="w-100 pl-10 pr-10">
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
        <v-col md="10" class="d-flex justify-end">
          <v-pagination
            v-model="page"
            :length="pageCount"
            :total-visible="7"
            elevation="0"
          ></v-pagination>
        </v-col>
      </v-row>
    </div>
    <statistic-popup
      @confirm="confirmStatistics"
      @cancel="cancelStatistics"
      :maxWidth="maxWidth"
      :width="width"
      ref="confirmStatistics"
    >
      <v-card-title slot="title" class="pt-0 mb-5 pa-0">
        <h4 class="mb-5">Filter the report</h4>
        <div>
          <v-autocomplete
            label="Center"
            style="width: 300px"
            v-model="center"
            :items="centers"
            item-text="location"
            item-value="location"
            @change="searchClass()"
            outlined
            dense
          ></v-autocomplete>
        </div>
        <div>
          <v-autocomplete
            label="Class status"
            style="width: 300px"
            v-model="status"
            :items="statusList"
            item-text="classStatus"
            item-value="classStatus"
            @change="searchClass()"
            outlined
            dense
          ></v-autocomplete>
        </div>
        <div class="d-flex justify-space-between" style="width: 100%">
          <div style="font-size: 14px">Class list</div>
          <div style="font-size: 14px">
            Selected {{ selected.length }}/{{ classFiltered.length }}
          </div>
        </div>
        <v-progress-linear
          v-if="isLoadingClass"
          indeterminate
          color="primary"
          class="my-10"
        ></v-progress-linear>
        <v-data-table
          v-if="!isLoadingClass"
          :headers="classHeaders"
          :items="classFiltered"
          :items-per-page="999999999"
          hide-default-footer
          fixed-header
          :height="maxHeight"
          show-select
          item-key="classID"
          v-model="selected"
          @page-count="pageCount = $event"
          class="elevation-0"
          style="width: 100%"
        >
          <template v-slot:header="{ props }">
            <tr>
              <th v-for="header in props.headers" :key="header.text">
                <div v-if="filterClass.hasOwnProperty(header.value)">
                  <v-autocomplete
                    chips
                    small-chips
                    deletable-chips
                    hide-details
                    dense
                    multiple
                    :items="columnValueClassList(header.value)"
                    v-model="filterClass[header.value]"
                    class="ma-3 my-1"
                  >
                  </v-autocomplete>
                </div>
              </th>
            </tr>
          </template>
        </v-data-table>
      </v-card-title>
      <v-card-actions> </v-card-actions>
    </statistic-popup>
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
import { class_managerment } from '@/api/class-management.js'
import { account_managerment } from '@/api/account-management.js'
import { statistic_management } from '@/api/statistic-management.js'
import StatisticPopup from '@/components/StatisticManagement/StatisticPopup.vue'
import dayjs from 'dayjs'
import message from '@/components/Utils/message'
const querystring = require('querystring')
export default {
  components: {
    'statistic-popup': StatisticPopup,
  },
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      searchStudent: '',
      width: 400,
      maxWidth: 1000,
      maxHeight: 200,
      classHeaders: [
        {
          text: 'Class code',
          value: 'classCode',
          sortable: false,
        },
      ],
      filterClass: {
        classCode: [],
      },
      classList: [],
      selected: [],
      isLoading: false,
      isLoadingClass: false,
      centers: [],
      center: localStorage.getItem('statisticCenter') || '',
      status: localStorage.getItem('statisticStatus') || '',
      statusList: [],
      headers: [
        {
          text: 'No',
          align: 'start',
          value: 'no',
          sortable: false,
        },
        { text: 'Student code', value: 'studentCode', sortable: false },
        { text: 'Student name', value: 'studentName', sortable: false },
        { text: 'Course', value: 'course', sortable: false },
        { text: 'Class', value: 'class', sortable: false },
        { text: 'Start date', value: 'startDate', sortable: false },
        { text: 'Class end date', value: 'classEndDate', sortable: false },
        { text: 'Paid', value: 'paid', sortable: false },
        { text: 'Attend', value: 'attend', sortable: false },
        { text: 'Absent', value: 'absent', sortable: false },
        {
          text: 'Percentage of attending',
          value: 'percentage',
          sortable: false,
        },
      ],
      studentList: [],
      filters: {
        studentCode: [],
        studentName: [],
        course: [],
        class: [],
        startDate: [],
        classEndDate: [],
        paid: [],
        attend: [],
        absent: [],
        percentage: [],
      },
      classIDs: this.$route.query.classIds,
      classIDList: this.$route.query.classIds,
      errorDialog: false,
      message: message,
    }
  },
  created() {
    this.searchClass()
    this.init()
    this.getListCenters()
    this.getClassStatus()
  },
  computed: {
    filtered() {
      return this.studentList.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
    },
    classFiltered() {
      return this.classList.filter(d => {
        return Object.keys(this.filterClass).every(f => {
          return this.filterClass[f].length < 1 || this.filterClass[f].includes(d[f])
        })
      })
    },
  },
  methods: {
    async init() {
      this.isLoading = true
      await statistic_management
        .getStudentAttendanceReport(this.classIDList)
        .then(res => {
          if (res) {
            this.studentList = res
            res.forEach(x => {
              this.classIDList.forEach(y => {
                if (y == x.classID) {
                  this.selected.push({
                    classCode: x.classCode,
                    classID: x.classID,
                    className: x.className,
                  })
                }
              })
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
    async getListCenters() {
      await account_managerment.getListCenter().then(res => {
        if (res) {
          this.centers = res
        }
      })
    },
    async getClassStatus() {
      await class_managerment.getClassStatus().then(res => {
        if (res) {
          res.unshift({
            classStatusID: 6,
            classStatus: 'All',
          })
          this.statusList = res
        }
      })
    },
    formatCenter(location) {
      switch (location) {
        case 'CEC Văn quán 1':
          location = 1
          break
        case 'CEC Văn quán 2':
          location = 2
          break
        case 'CEC Trần Phú':
          location = 3
          break
        case 'CEC Mỗ Lao':
          location = 4
          break
        case 'CEC Hapulico':
          location = 5
          break
        case 'CEC Liễu Giai':
          location = 6
          break
        case 'CEC Cầu Giấy':
          location = 7
          break
        case 'CEC Times City':
          location = 8
          break
        case 'NinjaKid':
          location = 9
          break
        case 'SYSTEM':
          location = 10
          break
        case 'CEC Phạm Văn Đồng':
          location = 11
          break
        case 'CEC Ngoại Giao Đoàn':
          location = 12
          break
        case 'Teacher System':
          location = 13
          break
      }
      return location
    },
    async searchClass() {
      this.selected = []
      this.isLoadingClass = true
      const body = {
        pLocationid: this.formatCenter(this.center),
        pStatus: this.status != 'All' ? this.status : '',
      }
      await class_managerment.getClassByLocation(querystring.stringify(body)).then(res => {
        if (res) {
          this.classList = res
        }
      })
      this.isLoadingClass = false
    },
    cancelStatistics() {},
    confirmStatistics() {
      this.classIDs = []
      for (var i = 0; i < this.selected.length; i++) {
        if (this.classIDs.indexOf(this.selected[i].classID) === -1) {
          this.classIDs.push(this.selected[i].classID)
        }
      }
      localStorage.setItem('statisticCenter', this.center)
      localStorage.setItem('statisticStatus', this.status)
      this.$router.push({
        name: 'statistics-student-attendance',
        query: {
          classIds: this.classIDs,
        },
      })
      this.classIDList = this.classIDs
      this.init()
    },
    viewDetail(centerId) {
      this.$router.push({
        name: 'center-management-detail',
        params: { centerId: centerId },
      })
    },
    columnValueList(val) {
      return this.studentList.map(d => d[val]).filter(y => y)
    },
    columnValueClassList(val) {
      return this.classList.map(d => d[val]).filter(y => y)
    },
    checkTime(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    back() {
      this.$router.push({ name: 'home' })
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped>
.filter-action {
  cursor: pointer;
  color: #2196f3;
  text-decoration: underline;
}
</style>
