<template>
  <div id="task-management-calendar">
    <v-row class="px-4 py-5" no-gutters>
      <v-col md="11">
        <div>
          <h2>Task Management</h2>
        </div>
      </v-col>
      <v-col md="1">
        <v-btn :class="'btn-create-task'" @click="showCreatetask" :color="'primary'">
          Create Task
        </v-btn>
      </v-col>
    </v-row>
    <div class="pl-4 d-flex align-center mb-4" :style="{ width: '60%' }">
      <div class="d-flex mr-3" v-for="header in headers" :key="header.value">
        <p class="d-inline mt-2 mr-1" :style="{ fontWeight: '700' }">{{ header.text }}</p>
        <Autocomplete
          @setFilter="setFilter"
          :styleBorder="'out-lined'"
          placeholder="Select..."
          :keyFilter="header.value"
          :selectedInit="filters[header.value]"
          :listItem="
            header.value === 'listAssigned'
              ? groupColumnAssignList()
              : groupColumnValueList(header.value)
          "
        />
      </div>
    </div>
    <v-row class="px-7">
      <!-- <v-select :class="'task-management-select'" v-model="location" :items="selectLocation" dense label="Center"
                outlined>
            </v-select>
            <v-select :class="'task-management-select'" v-model="location" :items="selectLocation" dense
                label="Category" outlined>
            </v-select>
            <v-select :class="'task-management-select'" v-model="location" :items="selectLocation" dense
                label="Assigned to" outlined>
            </v-select> -->
    </v-row>
    <template v-if="isLoading">
      <div class="px-10">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </div>
    </template>
    <template v-else>
      <v-row no-gutters class="fill-height px-4">
        <v-col>
          <div>
            <v-sheet height="47">
              <v-row align="center" class="px-3 mt-2">
                <v-btn v-show="!isSchedule" outlined color="secondary" @click="setToday">
                  Today
                </v-btn>
                <v-btn v-show="!isSchedule" text color="secondary" @click="prev">
                  <v-icon> mdi-chevron-left </v-icon>
                </v-btn>
                <p v-show="!isSchedule">
                  {{ type === 'day' ? changeNumber(new Date(focus).getDate()) + '/' : ''
                  }}{{ changeNumber(new Date(focus).getMonth() + 1) }}/{{
                    new Date(focus).getFullYear()
                  }}
                </p>
                <v-btn v-show="!isSchedule" text color="secondary" @click="next">
                  <v-icon> mdi-chevron-right </v-icon>
                </v-btn>

                <v-spacer></v-spacer>
                <v-btn
                  :outlined="isSchedule != true"
                  :color="isSchedule === true ? 'primary' : 'secondary'"
                  class="px-10 mr-3"
                  @click=";(isSchedule = true), (type = 'type')"
                >
                  Schedule
                </v-btn>
                <v-btn
                  :outlined="type != 'day'"
                  :color="type == 'day' ? 'primary' : 'secondary'"
                  class="px-10 mr-3"
                  @click=";(type = 'day'), (isSchedule = false)"
                >
                  Day
                </v-btn>
                <v-btn
                  :outlined="type != 'week'"
                  :color="type == 'week' ? 'primary' : 'secondary'"
                  class="px-10 mr-3"
                  @click=";(type = 'week'), (isSchedule = false)"
                >
                  Week
                </v-btn>
                <v-btn
                  :outlined="type != 'month'"
                  :color="type == 'month' ? 'primary' : 'secondary'"
                  class="px-10"
                  @click=";(type = 'month'), (isSchedule = false)"
                >
                  Month
                </v-btn>
              </v-row>
            </v-sheet>
            <v-sheet :height="!isSchedule ? '980' : ''">
              <v-calendar
                ref="calendar"
                v-if="!isSchedule"
                v-model="focus"
                color="primary"
                :events="filtered"
                :event-color="getEventColor"
                event-name="subject"
                event-start="startDate"
                event-end="endDate"
                :type="type"
                first-time="7:00"
                interval-count="17"
                :interval-format="intervalFormatter"
                @click:event="showEvent"
                @click:more="viewListDay"
                @click:date="viewDay"
                :class="'task-management-calendar'"
              >
                <template v-slot:event="{ event, eventParsed }">
                  <div :class="getStyleDone(event)">
                    <p :class="`calendar-item  `">
                      {{
                        eventParsed.start.time +
                        ' ' +
                        'ID: ' +
                        event.appointmentID +
                        ' - ' +
                        event.subject
                      }}
                    </p>
                  </div>
                </template>
              </v-calendar>
              <template v-else>
                <Table :events="filtered" :selectedEvent="selectedEvent" @showEvent="showEvent" />
              </template>
              <!-- <v-calendar v-else  ref="calendar" v-model="focus" color="primary" :events="events"
                                :
                                
                                event-color="getEventColor" event-start="fromTime" event-end="toTime" 
                                :type="'day'"
                                first-time="7:00" interval-count="17" :interval-format="intervalFormatter"
                                @click:event="showEvent" @click:more="viewListDay" @click:date="viewDay"
                                @change="updateRange"
                                :class="'task-management-calendar'"
                                
                                >
                        
                              
                                <template v-slot:event="{}">

                                    <p :class="`calendar-item `">
                                     sdsds
                                    </p>
                                </template>
                                
                            </v-calendar> -->
              <v-menu
                v-if="selectedOpen"
                v-model="selectedOpen"
                :close-on-descriptions-click="false"
                :activator="selectedElement"
                :close-on-content-click="false"
                max-width="400px"
              >
                <v-card max-width="400px" flat>
                  <v-toolbar flat height="40">
                    <v-toolbar-title
                      style="font-size: 14px"
                      class="font-weight-bold icons-detail-header"
                    >
                      <img
                        v-show="!selectedEvent.isDone"
                        :style="{ cursor: 'pointer' }"
                        @click="editEvent"
                        src="../../assets/images/icon-edit.svg"
                        alt=""
                      />
                      <img
                        v-show="!selectedEvent.isDone"
                        :style="{ cursor: 'pointer' }"
                        @click="deleteEvent"
                        src="../../assets/images/icon-bin.svg"
                      />
                      <img
                        :style="{ cursor: 'pointer' }"
                        @click="showEvent"
                        src="../../assets/images/icon-close.svg"
                      />
                    </v-toolbar-title>
                  </v-toolbar>
                  <v-card-text>
                    <div class="task-detail">
                      <v-row>
                        <v-col cols="1"
                          ><span
                            :style="{ background: getEventColor(selectedEvent) }"
                            :class="`cycle `"
                          ></span>
                        </v-col>
                        <v-col>
                          ID: {{ selectedEvent.appointmentID }} - {{ selectedEvent.subject }}<br />
                          <p>{{ selectedEvent.timeLine }}</p>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="1" class="icon-detail"
                          ><img src="../../assets/images/icon-list-task.svg" />
                        </v-col>
                        <v-col>{{ selectedEvent.description }}</v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="1" class="icon-detail icon-location"
                          ><img src="../../assets/images/icon-location.svg"
                        /></v-col>
                        <v-col>{{ selectedEvent.location }}</v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="1"><img src="../../assets/images/icon-profile.svg" /> </v-col>
                        <v-col>
                          <v-row :class="' d-flex align-center'">
                            <v-col
                              cols="6"
                              :style="{ width: '50%' }"
                              :class="' d-flex align-center'"
                              v-for="assigned in selectedEvent.listAssigned"
                              :key="assigned.teacherID"
                            >
                              <img
                                v-if="assigned.isDone"
                                src="../../assets/images/icon-done.svg"
                                alt=""
                              />
                              <img v-else src="../../assets/images/icon-pendding.svg" alt="" />
                              <p class="ml-1">{{ assigned.teacherName }}</p>
                            </v-col>
                          </v-row></v-col
                        >
                      </v-row>
                      <v-row>
                        <v-col cols="1"
                          ><img src="../../assets/images/icon-type-events.svg" />
                        </v-col>
                        <v-col>{{ selectedEvent.categoryName }}</v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="1"
                          ><img
                            :style="{
                              width: '21px',
                              marginLeft: '-2px',
                              marginTop: '-3px',
                            }"
                            src="../../assets/images/icon-persion.svg"
                          />
                        </v-col>
                        <v-col>{{
                          selectedEvent.crtdUser +
                          ' at ' +
                          _dayjs(selectedEvent.crtdDate).format('DD/MM/YYYY')
                        }}</v-col>
                      </v-row>
                    </div>
                  </v-card-text>
                  <v-card-actions :class="'right-btn'" right>
                    <div>
                      <v-btn
                        v-if="teacherID === selectedEvent.teacherID"
                        @click="changeDoneEvent"
                        class="text-end"
                        text
                        >{{ selectedEvent.isDone === true ? 'Mark uncompleted' : 'Mark completed' }}
                      </v-btn>
                      <v-btn v-else @click="changeDoneEvent" class="text-end" text
                        >{{
                          selectedEvent.listAssigned.find(e => e.teacherID === teacherID).isDone ===
                          true
                            ? 'Mark uncompleted'
                            : 'Mark completed'
                        }}
                      </v-btn>
                    </div>
                  </v-card-actions>
                </v-card>
              </v-menu>

              <v-menu
                v-model="listTaskDayOpen"
                :close-on-descriptions-click="false"
                :close-on-content-click="false"
                :id="'list-select'"
                :activator="selectListElement"
              >
                <v-card flat>
                  <v-card-text :class="'detail-descriptions'">
                    <h3>
                      {{
                        listTaskDay.date !== undefined &&
                        new Date(listTaskDay.date).toLocaleString('en-us', { weekday: 'short' })
                      }}
                    </h3>
                    <h1 :style="{ width: 'fit-content', padding: '10px' }">
                      {{ listTaskDay.date !== undefined && new Date(listTaskDay.date).getDate() }}
                    </h1>

                    <div
                      v-for="(task, index) in listTaskDay.listTask"
                      :key="index"
                      @click="e => showEvent({ nativeEvent: e, event: task })"
                    >
                      <p :class="`calendar-item-list ${getStyleDone(task)} `">
                        <span
                          :style="{ background: getEventColor(task) }"
                          :class="`cycle cycle-radius `"
                        ></span>
                        {{ getTimeFromDate(task.startDate) + ' ' + task.subject }}
                      </p>
                    </div>
                  </v-card-text>
                  <v-card-actions :class="'center-text d-flex justify-center'" right>
                    <div @click="viewListDay">
                      <v-icon class="isax isax-close-circle" x-large></v-icon>
                    </div> </v-card-actions
                  >-+
                </v-card>
              </v-menu>
            </v-sheet>
          </div>
        </v-col>
      </v-row>
    </template>
    <popup-delete-task
      @confirmSingle="confirmDeleteSingle"
      @confirmIncomplete="confirmDeleteIncomplete"
      @cancel="cancelDelete"
      :maxWidth="maxWidth"
      :width="width"
      ref="confirmDelete"
    >
      <v-card-title style="display: flex; flex-direction: column" slot="icon" class="pt-0">
        <v-icon x-large color="error" class="mb-5" outline>mdi-close-circle</v-icon>
      </v-card-title>
      <v-card-title style="display: flex; flex-direction: column" slot="title" class="pt-0 mb-5">
        <h2 class="text-center">Confirm detele</h2>
        <p class="text-center">
          Choose Delete Single to delete this task<br />or choose Delete Incomplete to delete undone
          subtasks after this task?
        </p>
      </v-card-title>
      <v-card-actions> </v-card-actions>
    </popup-delete-task>
  </div>
</template>

<script>
// import { student_information } from "@/api/student-information.js";
import { class_managerment } from '@/api/class-management.js'
import { center_managerment } from '@/api/center-management'
import Autocomplete from '@/components/Utils/Autocomplete.vue'
import dayjs from 'dayjs'
import PopupDeleteTask from '@/components/Utils/PopupDeleteTask.vue'
import Table from './Table.vue'
import { task_management } from '@/api/task-management'
// const querystring = require("querystring");

export default {
  components: {
    'popup-delete-task': PopupDeleteTask,
    Table,
    Autocomplete,
  },
  data() {
    return {
      dayjs: dayjs,
      textRule: [v => !!v || 'Field is required'],
      maxWidth: 1000,
      width: 650,
      s: true,
      error: 'true',
      isSchedule: false,
      isLoading: false,
      focus: new Date(),
      listCategories: [],
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      headers: [
        {
          text: 'Center',
          value: 'location',
          sortable: false,
        },
        {
          text: 'Category',
          value: 'categoryName',
          sortable: false,
        },

        {
          text: 'Assigned',
          value: 'listAssigned',

          sortable: false,
        },
        {
          text: 'TaskID',
          value: 'appointmentID',
          sortable: false,
        },

        //{ text: "Action", value: "action", width: "7%", sortable: false },
      ],
      filters: {
        location: [],
        categoryName: [],
        listAssigned: [],
        appointmentID: [],
      },
      taskObject: {
        subject: 'string',
        description: 'string',
        startDate: '2022-10-13T10:10:54.094Z',
        endDate: '2022-10-13T10:10:54.094Z',
        locationID: [],
        appointmentCategoryID: 0,
        taskCategoryID: 0,

        visibilityID: 0,
        isDone: true,
      },
      selectedEvent: {},
      selectListElement: null,
      listTaskDayOpen: false,
      listTaskDay: {
        date: '2000-22-2',
        listTask: [],
      },
      listLocation: [],
      selectedElement: null,
      selectedOpen: false,
      events: [],
      studentID: JSON.parse(localStorage.getItem('currentUser')).userInfo.studentID,
      homeworkDialog: false,
      homework: '',
      teacherID: JSON.parse(localStorage.getItem('currentUser')).userInfo.teacherID,
      homeWorkList: [],
      homeWorkReplace: '',
      homeWorkListReplaced: [],
    }
  },

  created() {
    this.init()
  },
  mounted() {
    this.$refs.calendar.checkChange()
    this.getCalendar()
  },

  watch: {
    listCategories: () => {},
    selectedEvent: () => {},
    events: () => {},
    listLocation: () => {},
  },
  computed: {
    filtered() {
      const listEvent = this.events.filter(d => {
        return Object.keys(this.filters).every(f => {
          function checkInAssign(filters, listAssigned, fil) {
            let isInAssign = false
            listAssigned.forEach(element => {
              if (filters[fil].includes(element.teacherName)) {
                isInAssign = true
              }
            })
            return isInAssign
          }
          if (f === 'listAssigned') {
            return this.filters[f].length < 1 || checkInAssign(this.filters, d.listAssigned, f)
          } else {
            return this.filters[f].length < 1 || this.filters[f].includes(d[f])
          }
        })
      })

      return listEvent
    },
  },
  methods: {
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
    },
    changeNumber(number) {
      if (number < 10) {
        return '0' + number
      }
      return number
    },
    groupColumnValueList(val) {
      if (val === 'location') {
        return JSON.parse(localStorage.getItem('currentUser')).locationPermissions.map(
          e => e.location
        )
      }
      return this.events.map(d => d[val])
    },
    groupColumnAssignList() {
      let listAssignedSelect = []
      this.events.forEach(e => {
        listAssignedSelect.push(...e.listAssigned.map(element => element.teacherName))
      })
      return listAssignedSelect
    },
    // changeSelect(data , name , nameList) {
    //   console.log()
    //   if (data.includes('All')) {
    //     if (data.length === 1) {
    //       this[name] = this.nameList
    //       this.selectAll = true
    //     } else if (
    //       data.length > 1 &&
    //       data.length < this.listQc.length &&
    //       this.selectAll === false
    //     ) {
    //       this.listQcSelect = this.listQc
    //       this.selectAll = true
    //     } else {
    //       this.listQcSelect = data.filter(item => item != 'All')
    //       this.selectAll = false
    //     }
    //   } else {
    //     if (this.selectAll === true) {
    //       this.listQcSelect = []
    //       this.selectAll = false
    //     } else {
    //       if (data.length >= 0 && data.length < this.listQc.length - 1) {
    //         this.listQcSelect = data
    //         this.selectAll = false
    //       } else {
    //         this.listQcSelect = this.listQc
    //         this.selectAll = true
    //       }
    //     }
    //   }
    //   this.dataReport = this.dataReportOr.filter(item => {
    //     return data.includes(item.qc)
    //   })
    // },
    toggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.events
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (value === 'listAssigned') {
                element.forEach(e => {
                  if (accumulator.indexOf(e.teacherName) === -1) {
                    accumulator.push(e.teacherName)
                  }
                })
              }
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, []).length
        ) {
          this.filters[value] = []
        } else {
          this.filters[value] = this.events
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (value === 'listAssigned') {
                element.forEach(e => {
                  if (accumulator.indexOf(e.teacherName) === -1) {
                    accumulator.push(e.teacherName)
                  }
                })
              }
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
      await center_managerment.getAllCenter().then(res => {
        this.listLocation = [{ location: 'None', locationID: 0 }, ...res]
      })
      const teacherID = JSON.parse(localStorage.getItem('currentUser')).userInfo.teacherID
      if (this.listLocation.length !== 0) {
        await task_management.appointmentByTeacherID(teacherID).then(res => {
          this.events = res

          this.events = res.map(element => {
            return {
              ...element,
              startDate: element.startDate.split('.')[0],
              endDate: element.endDate.split('.')[0],
              listAssign: [],
              location: this.listLocation.find(item => element.locationID === item.locationID)
                .location,
            }
          })
        })
      }

      await task_management.getappointmentCatelories_List().then(res => {
        if (res) {
          this.listCategories = res
        }
      })
      this.isLoading = false
    },
    async changeDoneEvent() {
      const selectEvent = this.events.find(
        e => e.appointmentID === this.selectedEvent.appointmentID
      )
      let eventChanged = {
        ...selectEvent,
        percentComplete: !this.selectedEvent.isDone ? 100 : 0,
      }
      const teacherID = JSON.parse(localStorage.getItem('currentUser')).userInfo.teacherID
      if (eventChanged.teacherID === teacherID && eventChanged.isDone === false) {
        eventChanged = {
          ...eventChanged,
          listAssigned: eventChanged.listAssigned.map(item => {
            return {
              ...item,
              isDone: true,
            }
          }),
          isDone: true,
        }
      } else if (eventChanged.teacherID === teacherID && eventChanged.isDone === true) {
        eventChanged = {
          ...eventChanged,
          listAssigned: eventChanged.listAssigned.map(item => {
            return {
              ...item,
              isDone: false,
            }
          }),
          isDone: false,
        }
      } else {
        if (eventChanged.teacherID !== teacherID) {
          eventChanged.isDone = this.selectedEvent.isDone
          eventChanged.listAssigned = eventChanged.listAssigned.map(item => {
            return item.teacherID === teacherID
              ? {
                  ...item,
                  isDone: !item.isDone,
                }
              : item
          })
        }
      }

      await task_management.appointment_Update(eventChanged).catch(() => {})
      this.selectedEvent = eventChanged
      this.events = this.events.map(item =>
        item.appointmentID === eventChanged.appointmentID ? eventChanged : item
      )
    },
    editEvent() {
      this.$router.push({
        name: 'update-task',
        params: { taskID: this.selectedEvent.appointmentID },
      })
    },

    getLocationName(id) {
      if (id !== undefined) {
        if (this.listLocation.length !== 0) {
          return this.listLocation.find(item => item.locationID === id).location
        } else {
          return
        }
      }
    },
    back() {
      window.history.back()
    },
    showCreatetask() {
      this.$router.push('create-task')
    },
    randomDate(start, end) {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    },
    viewDay({ date }) {
      this.focus = date
      this.type = 'day'
      this.listTaskDayOpen = false
    },
    getTimeFromDate(date) {
      let hours = date.split('T')[1].split(':')[0]
      let ampm = hours >= 12 ? 'PM' : 'AM'
      hours = hours >= 12 ? hours - 12 : hours
      let minutes = date.split('T')[1].split(':')[1]

      return hours + ':' + minutes + ' ' + ampm
    },
    cancelDelete() {},
    async confirmDeleteSingle() {
      await task_management.appointment_Delete(this.selectedEvent.appointmentID).then(() => {
        this.init()
      })
    },
    async confirmDeleteIncomplete() {
      await task_management.appointment_Delete(this.selectedEvent.appointmentID, true).then(() => {
        this.init()
      })
    },
    deleteEvent() {
      this.$refs.confirmDelete.open()
    },
    viewListDay({ date }, MouseEvent) {
      const open = () => {
        this.selectListElement = MouseEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => (this.listTaskDayOpen = true)))
      }

      if (this.listTaskDayOpen) {
        this.listTaskDayOpen = false
        this.selectListElement = MouseEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      let events = this.events.filter(item => {
        return (
          new Date(item.startDate.split('T')[0]).getDate() === new Date(date).getDate() &&
          new Date(item.startDate.split('T')[0]).getMonth() === new Date(date).getMonth() &&
          new Date(item.startDate.split('T')[0]).getFullYear() === new Date(date).getFullYear()
        )
      })
      events = events.map(item => {
        return { ...item, listAssign: [] }
      })

      this.listTaskDay = {
        date: date,
        listTask: events,
      }
    },
    getEventColor(event) {
      function rgba2hex(hex) {
        let A = '0.4'
        return (
          'rgba(' +
          parseInt(hex.substring(1, 3), 16) +
          ',' +
          parseInt(hex.substring(3, 5), 16) +
          ',' +
          parseInt(hex.substring(5, 7), 16) +
          ',' +
          A +
          ')'
        )
      }

      const category = this.listCategories.find(
        element => element.appointmentCategoryID === event.appointmentCategoryID
      )
      if (category && category.colorCode) {
        let colorCode = `${
          category.colorCode[0] !== '#' ? '#' + category.colorCode : category.colorCode
        }`
        if (event.isDone === true) {
          return rgba2hex(colorCode)
        }
        return colorCode
      } else {
        return '#616161'
      }
    },

    setToday() {
      this.focus = new Date().toISOString()
    },
    getStyleDone(event) {
      if (event.isDone) {
        return 'event-done'
      } else {
        return ''
      }
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },

    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = {
          ...event,
          timeLine: dayjs(event.startDate).isSame(dayjs(event.endDate), 'day')
            ? new Date(event.startDate).toLocaleString('en-us', { weekday: 'long' }) +
              '  ' +
              new Date(event.startDate).toLocaleString('en-us', { month: 'long' }) +
              ',' +
              '  ' +
              +new Date(event.startDate).getFullYear() +
              '  ' +
              event.startDate.split('T')[1].split('.')[0] +
              ' - ' +
              event.endDate.split('T')[1].split('.')[0]
            : 'From : ' +
              dayjs(event.startDate).format('DD/MM/YYYY') +
              '- To: ' +
              dayjs(event.endDate).format('DD/MM/YYYY'),
        }
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => (this.selectedOpen = true)))
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    intervalFormatter(locale) {
      return locale.time
    },
    setBgDone(event) {
      if (event.classCode === '2101') {
        return 'bgDone'
      } else {
        return ''
      }
    },
    formatDate(date) {
      return new Date(new Date(date).toISOString().split('.')[0])
    },
    async getCalendar() {
      this.isLoading = true
    },
    studentAttendance(classID, scheduleID) {
      this.$router.push({
        name: 'class-management-take-attendance-student',
        query: { classID: classID, scheduleID: scheduleID },
      })
    },
    getColorCycle(event) {
      if (event.category === 'Giảng dạy') {
        return 'cycle-violet'
      } else if (event.category === 'Tư vấn') {
        return 'cycle-orange'
      } else if (event.category === 'Hẹn lịch test') {
        return 'cycle-blue'
      } else if (event.category === 'Họp cơ sở') {
        return 'cycle-green'
      } else {
        return 'cycle-black'
      }
    },
    viewClassDetail(classID) {
      this.$router.push({
        name: 'student-calendar-class-detail',
        query: {
          classID: classID,
        },
      })
    },
    async viewHomework(scheduleID) {
      this.homeworkDialog = true
      await class_managerment.getClassScheduleDetail(scheduleID).then(res => {
        if (res.mess.message == 'Ok') {
          this.homework = res.syllabusItem.syllabus.homeWork
          if (this.homework.includes('<br/>') || this.homework.includes('<br />')) {
            this.homework = this.homework.replaceAll('<br/>', '<br>')
            this.homework = this.homework.replaceAll('<br />', '<br>')
          }
          this.homeWorkList = this.homework.split('<br>')
          this.homeWorkList.forEach(x => {
            this.homeWorkReplace = x.replaceAll('https://', '*https://').split('*')
            this.homeWorkListReplaced.push({
              label: this.homeWorkReplace[0],
              value: this.homeWorkReplace[1],
            })
          })
        }
      })
    },
    async viewLessonReport(scheduleID) {
      await class_managerment.viewLessonReport(scheduleID).then(res => {
        if (res) {
          let routeData = res.learningObjectives
          window.open(routeData, '_blank')
        }
      })
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped>
header.v-sheet {
  border-bottom: 0;
}

.center-text {
  width: fit-descriptions;
  margin: auto;
}

.right-btn {
  border-top: 1px solid rgb(173, 171, 171);
}

.right-btn > div {
  width: fit-descriptions;
  margin-left: auto;
}

.calendar-top > div {
  padding: 0;
}

.list-event-day {
  position: absolute;
  top: 100px;
  left: 400px;
}

.list-task {
  width: 200px;
  overflow: scroll;
}

.task-detail {
  width: 100%;
}

.btn-create-task {
  float: right;
}

.task-detail > *:nth-child(1) > * {
  padding-top: 0;
}

.task-detail * {
  padding-bottom: 0;
}

.bgDone {
  background: #df8484;
}

.icons-detail-header {
  margin-left: auto;
}

.icons-detail-header > img {
  padding-left: 15px;
}
.icon-location img {
  width: 18px;
}
.text-white {
  color: #fff !important;
}

.event-done {
  text-decoration: line-through;
}

.task-management-select {
  max-width: 170px;
  margin-right: 20px;
}

.cycle {
  width: 16px;
  display: inline-block;
  font-size: 8px;
  height: 16px;

  padding: 0 5px;
  margin-bottom: -0.6px;
}

.cycle-radius {
  border-radius: 10px;
}

.cycle-black {
  background: #616161;
}

.task-management-calendar > div > div {
  text-align: left !important;
}

.cycle-green {
  background: #0b8043;
}

.cycle-blue {
  background: #7986cb;
}

.cycle-violet {
  background: #8e24aa;
}

.cycle-orange {
  background: #f4511e;
}

.calendar-item-list {
  margin: 2px 0;
  color: rgb(0, 0, 0);
  border-radius: 6px;
  margin-left: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 2px 3px;
  gap: 3px;
}
.calendar-item {
  margin-left: 4px;
}

.calendar-item-list:hover {
  border: 1px solid rgb(200, 197, 197);
}

.detail-descriptions {
  padding-bottom: 0;
}

.detail-descriptions h1 {
  background: #1a73e8;
  color: #fff;
  border-radius: 50%;
  width: fit-descriptions;
  text-align: center;
  // padding: 1rem 1.2rem;
  margin: 0 auto;
}

.detail-descriptions h3 {
  text-align: center;
  margin-bottom: 5px;
}
</style>
