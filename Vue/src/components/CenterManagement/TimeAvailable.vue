<template>
  <div id="center-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <div class="d-flex">
            <h2>
              <v-icon @click="back()">arrow_back_ios</v-icon>
            </h2>
            <h2 class="pt-1">Time available management</h2>
          </div>
          <v-row class="mt-5 mb-5 pt-2">
            <v-col md="3" v-if="shift" style="background: rgba(60, 141, 239, 0.2)" class="mb-9">
              <v-autocomplete
                label="Select shift"
                v-model="shift"
                :items="shifts"
                item-value="shiftID"
                item-text="shiftTimeName"
                style="background: white"
                append-icon="info"
                @click:append="viewShift"
                @click="activeShift"
                hide-details
                outlined
                dense
              >
              </v-autocomplete>
              <v-dialog v-model="viewShiftDialog" width="500">
                <v-card>
                  <v-card-title class="title-dialog">
                    <h3>{{ shiftTimeName }}</h3>
                  </v-card-title>
                  <v-card-text class="pt-10">
                    <v-row>
                      <v-col md="4">
                        <p class="font-weight-bold pb-9" v-if="monday">Monday</p>
                        <p class="font-weight-bold pb-9" v-if="tuesday">Tuesday</p>
                        <p class="font-weight-bold pb-9" v-if="wednesday">Wednesday</p>
                        <p class="font-weight-bold pb-9" v-if="thursday">Thursday</p>
                        <p class="font-weight-bold pb-9" v-if="friday">Friday</p>
                        <p class="font-weight-bold pb-9" v-if="saturday">Saturday</p>
                        <p class="font-weight-bold" v-if="sunday">Sunday</p>
                      </v-col>
                      <v-divider vertical></v-divider>
                      <v-col style="font-size: 16px" md="8">
                        <div v-if="monTime">
                          <p class="font-weight-bold mb-1">
                            {{ monTime.substring(0, 5) }}
                          </p>
                          <p class="mb-3">
                            {{ monTime.substring(6, monTime.length) }}
                          </p>
                        </div>
                        <div v-if="tueTime">
                          <p class="font-weight-bold mb-1">
                            {{ tueTime.substring(0, 5) }}
                          </p>
                          <p class="mb-3">
                            {{ tueTime.substring(6, tueTime.length) }}
                          </p>
                        </div>
                        <div v-if="wedTime">
                          <p class="font-weight-bold mb-1">
                            {{ wedTime.substring(0, 5) }}
                          </p>
                          <p class="mb-3">
                            {{ wedTime.substring(6, wedTime.length) }}
                          </p>
                        </div>
                        <div v-if="thuTime">
                          <p class="font-weight-bold mb-1">
                            {{ thuTime.substring(0, 5) }}
                          </p>
                          <p class="mb-3">
                            {{ thuTime.substring(6, thuTime.length) }}
                          </p>
                        </div>
                        <div v-if="friTime">
                          <p class="font-weight-bold mb-1">
                            {{ friTime.substring(0, 5) }}
                          </p>
                          <p class="mb-3">
                            {{ friTime.substring(6, friTime.length) }}
                          </p>
                        </div>
                        <div v-if="satTime">
                          <p class="font-weight-bold mb-1">
                            {{ satTime.substring(0, 5) }}
                          </p>
                          <p class="mb-3">
                            {{ satTime.substring(6, satTime.length) }}
                          </p>
                        </div>
                        <div v-if="sunTime">
                          <p class="font-weight-bold mb-1">
                            {{ sunTime.substring(0, 5) }}
                          </p>
                          <p class="mb-3">
                            {{ sunTime.substring(6, sunTime.length) }}
                          </p>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-col>
            <v-col md="3" v-else>
              <v-autocomplete
                label="Select shift"
                v-model="shift"
                :items="shifts"
                item-value="shiftID"
                item-text="shiftTimeName"
                style="background: white"
                @click="activeShift"
                hide-details
                outlined
                dense
              >
              </v-autocomplete>
              <v-dialog v-model="viewShiftDialog" width="500">
                <v-card>
                  <v-card-title class="title-dialog">
                    <h3>{{ shiftTimeName }}</h3>
                  </v-card-title>
                  <v-card-text class="pt-10">
                    <v-row>
                      <v-col md="4">
                        <p class="font-weight-bold pb-9" v-if="monday">Monday</p>
                        <p class="font-weight-bold pb-9" v-if="tuesday">Tuesday</p>
                        <p class="font-weight-bold pb-9" v-if="wednesday">Wednesday</p>
                        <p class="font-weight-bold pb-9" v-if="thursday">Thursday</p>
                        <p class="font-weight-bold pb-9" v-if="friday">Friday</p>
                        <p class="font-weight-bold pb-9" v-if="saturday">Saturday</p>
                        <p class="font-weight-bold" v-if="sunday">Sunday</p>
                      </v-col>
                      <v-divider vertical></v-divider>
                      <v-col style="font-size: 16px" md="8">
                        <div v-if="monTime">
                          <p class="font-weight-bold mb-1">
                            {{ monTime.substring(0, 5) }}
                          </p>
                          <p class="mb-3">
                            {{ monTime.substring(6, monTime.length) }}
                          </p>
                        </div>
                        <div v-if="tueTime">
                          <p class="font-weight-bold mb-1">
                            {{ tueTime.substring(0, 5) }}
                          </p>
                          <p class="mb-3">
                            {{ tueTime.substring(6, tueTime.length) }}
                          </p>
                        </div>
                        <div v-if="wedTime">
                          <p class="font-weight-bold mb-1">
                            {{ wedTime.substring(0, 5) }}
                          </p>
                          <p class="mb-3">
                            {{ wedTime.substring(6, wedTime.length) }}
                          </p>
                        </div>
                        <div v-if="thuTime">
                          <p class="font-weight-bold mb-1">
                            {{ thuTime.substring(0, 5) }}
                          </p>
                          <p class="mb-3">
                            {{ thuTime.substring(6, thuTime.length) }}
                          </p>
                        </div>
                        <div v-if="friTime">
                          <p class="font-weight-bold mb-1">
                            {{ friTime.substring(0, 5) }}
                          </p>
                          <p class="mb-3">
                            {{ friTime.substring(6, friTime.length) }}
                          </p>
                        </div>
                        <div v-if="satTime">
                          <p class="font-weight-bold mb-1">
                            {{ satTime.substring(0, 5) }}
                          </p>
                          <p class="mb-3">
                            {{ satTime.substring(6, satTime.length) }}
                          </p>
                        </div>
                        <div v-if="sunTime">
                          <p class="font-weight-bold mb-1">
                            {{ sunTime.substring(0, 5) }}
                          </p>
                          <p class="mb-3">
                            {{ sunTime.substring(6, sunTime.length) }}
                          </p>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-col>
            <v-col
              md="2"
              v-if="dayOfWeek || startTime || endTime"
              style="background: rgba(60, 141, 239, 0.2); margin-bottom: auto"
            >
              <date-picker
                :model="dayOfWeek"
                @update:model="updateDate"
                title="Date"
                @changeData="activeDayTime"
              ></date-picker>
            </v-col>
            <v-col md="2" v-else>
              <date-picker
                :model="dayOfWeek"
                @update:model="updateDate"
                title="Date"
                @changeData="activeDayTime"
              ></date-picker>
            </v-col>
            <v-col
              md="2"
              v-if="dayOfWeek || startTime || endTime"
              style="background: rgba(60, 141, 239, 0.2)"
              class="mb-9"
            >
              <v-menu
                ref="menuFrom"
                v-model="fromTimePicker"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="time"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="startTime"
                    label="Start time"
                    v-bind="attrs"
                    v-on="on"
                    class="time-picker"
                    @click="activeDayTime"
                    outlined
                    dense
                    hide-details
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="fromTimePicker"
                  v-model="startTime"
                  format="24hr"
                  full-width
                  @click:minute="$refs.menuFrom.save(time)"
                ></v-time-picker>
              </v-menu>
            </v-col>
            <v-col md="2" v-else>
              <v-menu
                ref="menuFrom"
                v-model="fromTimePicker"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="time"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="startTime"
                    label="Start time"
                    v-bind="attrs"
                    v-on="on"
                    class="time-picker"
                    @click="activeDayTime"
                    outlined
                    dense
                    hide-details
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="fromTimePicker"
                  v-model="startTime"
                  format="24hr"
                  full-width
                  @click:minute="$refs.menuFrom.save(time)"
                ></v-time-picker>
              </v-menu>
            </v-col>
            <v-col
              md="2"
              v-if="dayOfWeek || startTime || endTime"
              style="background: rgba(60, 141, 239, 0.2)"
              class="mb-9"
            >
              <v-menu
                ref="menuTo"
                v-model="toTimePicker"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="time"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="endTime"
                    label="End time"
                    v-bind="attrs"
                    v-on="on"
                    class="time-picker"
                    @click="activeDayTime"
                    outlined
                    dense
                    hide-details
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="toTimePicker"
                  v-model="endTime"
                  format="24hr"
                  full-width
                  @click:minute="$refs.menuTo.save(time)"
                ></v-time-picker>
              </v-menu>
            </v-col>
            <v-col md="2" v-else>
              <v-menu
                ref="menuTo"
                v-model="toTimePicker"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="time"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="endTime"
                    label="End time"
                    v-bind="attrs"
                    v-on="on"
                    class="time-picker"
                    @click="activeDayTime"
                    outlined
                    dense
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="toTimePicker"
                  v-model="endTime"
                  format="24hr"
                  full-width
                  @click:minute="$refs.menuTo.save(time)"
                ></v-time-picker>
              </v-menu>
            </v-col>
            <v-col
              md="2"
              v-if="searchTeacher"
              style="background: rgba(60, 141, 239, 0.2)"
              class="mb-9"
            >
              <v-text-field
                outlined
                dense
                placeholder="Teacher code/name"
                hide-details
                v-model="searchTeacher"
                counter
                maxlength="100"
                style="background: white"
              ></v-text-field>
            </v-col>
            <v-col md="2" v-else>
              <v-text-field
                outlined
                dense
                placeholder="Teacher code/name"
                hide-details
                v-model="searchTeacher"
                counter
                maxlength="100"
                style="background: white"
              ></v-text-field>
            </v-col>
            <v-col md="1">
              <v-btn elevation="0" height="36" class="pl-5 pr-5" color="primary" @click="search()">
                Search
              </v-btn>
            </v-col>
          </v-row>
          <div class="pb-10 pt-0">
            <v-data-table
              :headers="headers"
              :items="filtered"
              :page.sync="page"
              :items-per-page="itemsPerPage"
              hide-default-footer
              hide-default-header
              @page-count="pageCount = $event"
              v-model="selected"
              :id="tables"
              class="elevation-1"
              height="60vh"
              fixed-header
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
                      :style="'width:' + header.width + '; min-width:' + header.width + ';'"
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
              <template v-slot:[`item.no`]="{ index }">
                {{ index + 1 }}
              </template>
              <template v-slot:[`item.availableTime`]="{ item }">
                {{ item.fromTime }} - {{ item.toTime }}
              </template>
              <template v-slot:[`item.action`]="{ item }">
                <v-icon
                  size="18"
                  @click="viewDetail(item.recordID)"
                  color="primary"
                  v-if="
                    functionRole.filter(
                      x =>
                        (x.functionID == teacherFreeTimePermission && x.cRead == true) ||
                        (x.functionID == teacherFreeTimePermission && x.cFull == true)
                    ).length == 1
                  "
                  >visibility</v-icon
                >
              </template>
            </v-data-table>
          </div>
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
        <v-col md="4" class="d-flex align-center justify-end">
          <h3 v-if="filtered.length != 1">Total: {{ filtered.length }} records</h3>
          <h3 v-else>Total: {{ filtered.length }} record</h3>
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
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { center_managerment } from '@/api/center-management.js'
import DatePicker from '@/components/Utils/DatePicker.vue'
import Autocomplete from '@/components/Utils/Autocomplete.vue'

const querystring = require('querystring')
export default {
  components: {
    'date-picker': DatePicker,
    Autocomplete,
  },
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      selected: [],
      headers: [
        {
          text: 'No',
          value: 'no',
          sortable: false,
        },
        {
          text: 'User Name',
          value: 'userName',
          sortable: false,
        },
        {
          text: 'Teacher Name',
          value: 'fullName',
          sortable: false,
        },
        { text: 'Teacher group', value: 'teacherGroup', sortable: false },
        {
          text: 'Teacher type',
          value: 'teacherType',
          sortable: false,
        },
        {
          text: 'Day of week',
          value: 'dayOfWeek',
          sortable: false,
        },
        {
          text: 'Available time',
          value: 'availableTime',
          sortable: false,
        },
        {
          text: 'Mobile',
          value: 'mobilePhone',
          sortable: false,
        },
        {
          text: 'Email',
          value: 'email',
          sortable: false,
        },
        {
          text: 'Action',
          value: 'action',
          sortable: false,
        },
      ],
      filters: {
        userName: [],
        fullName: [],
        teacherGroup: [],
        teacherType: [],
        dayOfWeek: [],
      },
      timeAvailableList: [],
      centerList: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
      currentCenter: JSON.parse(localStorage.getItem('currentCenter')),
      shift: '',
      shifts: [],
      dayOfWeek: '',
      dayOfWeeks: [],
      startTime: '',
      fromTimePicker: false,
      endTime: '',
      toTimePicker: false,
      searchTeacher: '',
      tables: 'tables',
      name: 'teacher salary',
      viewShiftDialog: false,
      shiftTimeName: '',
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
      monTime: '',
      tueTime: '',
      wedTime: '',
      thuTime: '',
      friTime: '',
      satTime: '',
      sunTime: '',
      days: '',
      time: '',
      functionRole: JSON.parse(localStorage.getItem('functionRole')),
      teacherFreeTimePermission: process.env.VUE_APP_ENV_FUNCTION_TEACHER_FREE_TIME,
    }
  },
  created() {
    this.init()
  },
  computed: {
    filtered() {
      return this.timeAvailableList.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
    },
  },
  watch: {
    selected: function (value) {
      console.log(value)
    },
    searchTeacher: function () {
      this.shift = ''
      this.dayOfWeek = ''
      this.startTime = ''
      this.endTime = ''
    },
  },
  methods: {
    activeShift() {
      this.dayOfWeek = ''
      this.startTime = ''
      this.endTime = ''
      this.searchTeacher = ''
    },
    activeDayTime() {
      this.shift = ''
      this.searchTeacher = ''
    },
    async viewShift() {
      this.viewShiftDialog = true
      await center_managerment.getListShifts().then(res => {
        if (res) {
          this.shifts = res.shifts
          res.shifts.forEach(x => {
            if (this.shift == x.shiftID) {
              this.shiftTimeName = x.shiftTimeName
              this.monday = x.monday
              this.tuesday = x.tuesday
              this.wednesday = x.wednesday
              this.thursday = x.thursday
              this.friday = x.friday
              this.saturday = x.saturday
              this.sunday = x.sunday
              this.monTime = x.monTime
              this.tueTime = x.tueTime
              this.wedTime = x.wedTime
              this.thuTime = x.thuTime
              this.friTime = x.friTime
              this.satTime = x.satTime
              this.sunTime = x.sunTime
            }
          })
        }
      })
    },
    groupColumnValueList(val) {
      return this.timeAvailableList.map(d => d[val]).filter(y => y)
    },
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
    },

    toggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.timeAvailableList
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
          this.filters[value] = this.timeAvailableList
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
    async init() {
      await center_managerment.getListShifts().then(res => {
        if (res) {
          this.shifts = res.shifts
        }
      })
      await center_managerment.getListDayOfWeek().then(res => {
        if (res) {
          res.forEach(x => {
            for (var i = 0; i < x.sort; i++) {
              this.dayOfWeeks.push(
                x.days == 'Mon'
                  ? 'Monday'
                  : x.days == 'Tue'
                  ? 'Tuesday'
                  : x.days == 'Wed'
                  ? 'Wednesday'
                  : x.days == 'Thu'
                  ? 'Thursday'
                  : x.days == 'Fri'
                  ? 'Friday'
                  : x.days == 'Sat'
                  ? 'Saturday'
                  : x.days == 'Sun'
                  ? 'Sunday'
                  : ''
              )
            }
          })
        }
      })
      const body = {
        teacherKey: '',
        shiftID: '',
        dayOfWeek: '',
        fromTime: '',
        toTime: '',
      }
      await center_managerment.listTeacherAvailableTime(querystring.stringify(body)).then(res => {
        if (res) {
          this.timeAvailableList = res.teacherFreeTimeList
          res.teacherFreeTimeList.forEach(x => {
            switch (x.dayOfWeek) {
              case 'Sun':
                x.dayOfWeek = 'Sunday'
                break
              case 'Mon':
                x.dayOfWeek = 'Monday'
                break
              case 'Tue':
                x.dayOfWeek = 'Tuesday'
                break
              case 'Wed':
                x.dayOfWeek = 'Wednesday'
                break
              case 'Thu':
                x.dayOfWeek = 'Thursday'
                break
              case 'Fri':
                x.dayOfWeek = 'Friday'
                break
              case 'Sat':
                x.dayOfWeek = 'Saturday'
                break
            }
          })
        }
      })
    },
    async search() {
      const body = {
        teacherKey: this.searchTeacher ? this.searchTeacher : '',
        shiftID: this.shift ? this.shift : '',
        dayOfWeek: this.dayOfWeek ? this.dayOfWeek : '',
        fromTime: this.startTime ? this.startTime : '',
        toTime: this.endTime ? this.endTime : '',
      }
      await center_managerment.listTeacherAvailableTime(querystring.stringify(body)).then(res => {
        if (res) {
          this.timeAvailableList = res.teacherFreeTimeList
        }
      })
    },
    viewDetail(recordId) {
      this.$router.push({
        name: 'center-management-view-detail-time-available',
        params: { recordId: recordId },
      })
    },
    updateDate(event) {
      this.dayOfWeek = event
    },
    back() {
      window.history.back()
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped>
.title-dialog {
  background: lightblue;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
}
.time-picker {
  background: white;
  ::-webkit-calendar-picker-indicator {
    display: none;
  }
}
</style>
