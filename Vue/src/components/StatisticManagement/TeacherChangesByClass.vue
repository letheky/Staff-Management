<template>
  <div id="center-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <div class="d-flex">
            <h2>
              <v-icon @click="back()">arrow_back_ios</v-icon>
            </h2>
            <h2 class="pt-1">Teacher changes by class</h2>
          </div>
          <div class="d-flex justify-space-between pt-2">
            <div class="d-flex align-center">
              <div>Center: All</div>
              <v-icon
                class="ml-4"
                size="18"
                @click="changeFilter(item.locationID)"
                color="secondary"
              >
                mdi-reload
              </v-icon>
              <div class="filter-action ml-2" @click="$refs.confirmStatistics.open()">
                Change filter
              </div>
              <div class="d-flex ml-15">
                <v-text-field
                  type="date"
                  label="From date"
                  style="background: white"
                  v-model="fromDate"
                  outlined
                  dense
                  hide-details
                />
                <v-text-field
                  class="ml-2"
                  type="date"
                  label="To date"
                  style="background: white"
                  v-model="toDate"
                  outlined
                  dense
                  hide-details
                />
                <v-btn
                  class="ml-2"
                  elevation="0"
                  height="36"
                  color="secondary"
                  :disabled="!fromDate || !toDate"
                  @click="searchDate()"
                >
                  Search
                </v-btn>
              </div>
            </div>
            <!-- <v-btn
              elevation="0"
              height="36"
              color="primary"
              @click="download()"
            >
              Download file excel
            </v-btn> -->
          </div>
          <div>Total: {{ filtered.length }} lessons have changed teachers</div>
          <div>Number of cover teacher: {{ numberOfCover }}</div>
          <div>Number of take over teacher: {{ numberOfTakeOver }}</div>
          <v-data-table
            :headers="headers"
            :items="filtered"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            hide-default-footer
            @page-count="pageCount = $event"
            class="elevation-0"
            fixed-header
            height="60vh"
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
              {{ index + 1 }}
            </template>

            <template v-slot:[`item.countOfMainTeacher`]="{ item }">
              <div class="d-flex">
                <span>{{ item.countOfMainTeacher }}</span>
                <v-menu v-if="item.countOfMainTeacher != 0">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="ml-4"
                      icon
                      height="18"
                      width="18"
                      color="secondary"
                      v-bind="attrs"
                      v-on="on"
                      @click="viewDetailTakeOverTeacher(item.classID)"
                    >
                      <v-icon>info</v-icon>
                    </v-btn>
                  </template>
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr style="background-color: #f7f7f7">
                          <th class="text-left">Date</th>
                          <th class="text-left" width="200px">Take over teacher</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(reason, index) in takeOverReasonList" :key="index">
                          <td class="fs-12">
                            {{ _dayjs(reason.date).format('DD/MM/YYYY') }}
                          </td>
                          <td class="fs-12">{{ reason.fullName }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-menu>
              </div>
            </template>

            <template v-slot:[`item.countOfCoverTeacher`]="{ item }">
              <div class="d-flex">
                <span>{{ item.countOfCoverTeacher }}</span>
                <v-menu v-if="item.countOfCoverTeacher != 0">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="ml-4"
                      icon
                      height="18"
                      width="18"
                      color="secondary"
                      v-bind="attrs"
                      v-on="on"
                      @click="viewDetailCoverTeacher(item.classID)"
                    >
                      <v-icon>info</v-icon>
                    </v-btn>
                  </template>
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr style="background-color: #f7f7f7">
                          <th class="text-left">Date</th>
                          <th class="text-left">Main teacher</th>
                          <th class="text-left">Reason</th>
                          <th class="text-left">Cover teacher</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(reason, index) in coverReasonList" :key="index">
                          <td class="fs-12">
                            {{ _dayjs(reason.date).format('DD/MM/YYYY') }}
                          </td>
                          <td class="fs-12">{{ reason.mainTeacherName }}</td>
                          <td class="fs-12">{{ reason.reason }}</td>
                          <td class="fs-12">{{ reason.coverTeacherName }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-menu>
              </div>
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
                    class="ma-3 my-1"
                    v-model="filters[header.value]"
                    :items="groupColumnValueClassList(header.value)"
                    multiple
                  >
                    <template v-slot:prepend-item>
                      <v-list-item ripple @mousedown.prevent @click="classToggle(header.value)">
                        <v-list-item-action>
                          <v-icon
                            v-if="
                              filters[header.value].length ==
                              classList
                                .map(d => d[header.value])
                                .reduce(function (accumulator, element) {
                                  if (accumulator.indexOf(element) === -1) {
                                    accumulator.push(element)
                                  }
                                  return accumulator
                                }, []).length
                            "
                          >
                            mdi-close-box
                          </v-icon>
                          <v-icon v-else> mdi-checkbox-blank-outline </v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title> Select All </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                    <template v-slot:selection="{ index }">
                      <span v-if="index == 0"> {{ filters[header.value].length }} selected </span>
                    </template>
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
import Autocomplete from '@/components/Utils/Autocomplete.vue'

import message from '@/components/Utils/message'
const querystring = require('querystring')
export default {
  components: {
    'statistic-popup': StatisticPopup,
    Autocomplete,
  },
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
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
        { text: 'Center', value: 'location', sortable: false },
        { text: 'Class code', value: 'classCode', sortable: false },
        {
          text: 'Take over teacher',
          value: 'countOfMainTeacher',
          sortable: false,
        },
        {
          text: 'Cover teacher',
          value: 'countOfCoverTeacher',
          sortable: false,
        },
      ],
      teacherList: [],
      filters: {
        location: [],
        classCode: [],
        countOfMainTeacher: [],
        countOfCoverTeacher: [],
      },
      classIDs: this.$route.query.classIds,
      classIDList: this.$route.query.classIds,
      numberOfCover: 0,
      numberOfTakeOver: 0,
      takeOverReasonList: [],
      coverReasonList: [],
      fromDate: '',
      toDate: '',
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
      return this.teacherList.filter(d => {
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
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
    },

    async init() {
      this.isLoading = true
      const body = {
        fromDate: '',
        toDate: '',
        classes: this.classIDList,
      }
      await statistic_management
        .getTeacherChangesByClass(body)
        .then(res => {
          if (res) {
            this.teacherList = res
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
    async searchDate() {
      this.isLoading = true
      const body = {
        fromDate: this.fromDate,
        toDate: this.toDate,
        classes: this.classIDList,
      }
      await statistic_management.getTeacherChangesByClass(body).then(res => {
        if (res) {
          this.teacherList = res
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
        }
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
    async viewDetailTakeOverTeacher(classID) {
      await statistic_management.getTakeOverTeacherChangesByClassDetail(classID).then(res => {
        if (res) {
          this.takeOverReasonList = res
        }
      })
    },
    async viewDetailCoverTeacher(classID) {
      await statistic_management.getCoverTeacherChangesByClassDetail(classID).then(res => {
        if (res) {
          this.coverReasonList = res
        }
      })
    },
    countTeacher() {
      this.numberOfCover = 0
      this.numberOfTakeOver = 0
      this.filtered.forEach(x => {
        this.numberOfTakeOver += x.countOfMainTeacher
        this.numberOfCover += x.countOfCoverTeacher
      })
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
        name: 'statistics-teacher-changes-by-class',
        query: {
          classIds: this.classIDs,
        },
      })
      this.classIDList = this.classIDs
      this.init()
    },
    changeFilter(centerId) {
      this.$router.push({
        name: 'center-management-detail',
        params: { centerId: centerId },
      })
    },
    groupColumnValueList(val) {
      return this.teacherList
        .map(d => d[val])
        .filter(n => typeof n === 'number' || typeof n === 'string')
    },
    toggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.teacherList
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
          this.filters[value] = this.teacherList
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
    groupColumnValueClassList(val) {
      return this.classList.map(d => d[val]).filter(y => y)
    },
    classToggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.classList
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
          this.filters[value] = this.classList
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
