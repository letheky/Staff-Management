<template>
  <div class="mt-4 ml-8 mr-8" id="register">
    <div class="d-flex mb-4">
      <h2></h2>
      <h2 class="pt-1">Room usage situations</h2>
    </div>
    <div class="d-flex justify-space-between" :style="{ width: '100%' }">
      <div class="d-flex">
        <v-select
          outlined
          dense
          v-model="locationID"
          :items="listLocation"
          item-text="location"
          class="mr-4"
          :style="{ width: '200px' }"
          item-value="locationID"
          label="Center"
        />
        <v-text-field
          outlined
          dense
          type="date"
          :style="{ width: '200px' }"
          v-model="date"
          label="Select date"
        />
      </div>
      <v-btn color="primary" @click="openRegister">Room register </v-btn>
    </div>
    <v-progress-linear v-if="isLoading" indeterminate color="primary"></v-progress-linear>
    <DayPilotCalendar
      id="dp"
      :config="{ ...calendarConfig, startDate: date }"
      :events="events"
      ref="calendar"
    />
    <v-dialog v-model="dialog" v-if="dialog" width="660">
      <v-card>
        <v-card-title>
          <v-spacer></v-spacer
          ><img @click="dialog = false" src="../../assets/images/icon-close.svg" alt="" srcset=""
        /></v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-row>
                <v-col cols="3" class="pt-4 pb-0"> <h3>Class</h3></v-col>
                <v-col cols="9" class="pt-4 pb-0">
                  <h3
                    @click="viewDetailClass(selectEventRoom.classID)"
                    class="link"
                    :style="{ fontWeight: 500 }"
                  >
                    {{ selectEventRoom && selectEventRoom.classCode }}
                  </h3></v-col
                >
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col cols="3" class="pt-4 pb-0"> <h3>Teacher</h3></v-col>
                <v-col cols="9" class="pt-4 pb-0">
                  <h3
                    @click="viewAccount(selectEventRoom.teacher_userID)"
                    class="link"
                    :style="{ fontWeight: 500 }"
                  >
                    {{ selectEventRoom && selectEventRoom.teacher }}
                  </h3></v-col
                >
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col cols="3" class="pt-3 pb-0"> <h3>Date</h3></v-col>
                <v-col cols="9" class="pt-3 pb-0"
                  ><h3 :style="{ fontWeight: 500 }">
                    {{ selectEventRoom && dayjs(selectEventRoom.fromTime).format('DD/MM/YYYY') }}
                  </h3>
                </v-col></v-row
              >
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col cols="3" class="pt-4 pb-0"> <h3>TA</h3></v-col>
                <v-col cols="9" class="pt-4 pb-0">
                  <h3
                    @click="viewAccount(selectEventRoom.taID)"
                    class="link"
                    :style="{ fontWeight: 500 }"
                  >
                    {{ selectEventRoom && selectEventRoom.ta }}
                  </h3></v-col
                >
              </v-row>
            </v-col>

            <v-col>
              <v-row>
                <v-col cols="3" class="pt-3 pb-0"> <h3>Shift</h3></v-col>
                <v-col cols="9" class="pt-3 pb-0"
                  ><h3 :style="{ fontWeight: 500 }">
                    {{
                      selectEventRoom &&
                      dayjs(selectEventRoom.fromTime).format('HH:mm') +
                        ' - ' +
                        dayjs(selectEventRoom.toTime).format('HH:mm')
                    }}
                  </h3></v-col
                ></v-row
              >
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col cols="3" class="pt-4 pb-0"> <h3>QC</h3></v-col>
                <v-col cols="9" class="pt-4 pb-0">
                  <h3
                    class="link"
                    @click="viewAccount(selectEventRoom.qc_userID)"
                    :style="{ fontWeight: 500 }"
                  >
                    {{ selectEventRoom && selectEventRoom.qc }}
                  </h3></v-col
                >
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col cols="3" class="pt-4 pb-0"> <h3>Stu num</h3></v-col>
                <v-col cols="9" class="pt-4 pb-0">
                  <h3 :style="{ fontWeight: 500 }">
                    {{ selectEventRoom && selectEventRoom.nbrStu }}
                  </h3></v-col
                >
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col cols="3" class="pt-4 pb-0"> <h3>EC</h3></v-col>
                <v-col cols="9" class="pt-4 pb-0">
                  <h3
                    @click="viewAccount(ec.teacher_userID)"
                    class="link"
                    :style="{ fontWeight: 500 }"
                  >
                    {{ selectEventRoom && selectEventRoom.ec }}
                  </h3></v-col
                >
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="4" class="pt-4 pb-0">
                  <div class="d-flex align-center">
                    <h3
                      @click="
                        selectEventRoom.reportStatus === 'NONE' || !selectEventRoom.reportStatus
                          ? createLessonReport(selectEventRoom.classID, selectEventRoom.scheduleID)
                          : viewLessonReport(selectEventRoom.classID, selectEventRoom.scheduleID)
                      "
                      class="link mr-3"
                    >
                      Report
                    </h3>
                    <img
                      v-if="selectEventRoom.reportStatus === 'INPROGRESS'"
                      src="../../assets/images/icon-pendding.svg"
                      alt=""
                      srcset=""
                    />
                    <p
                      v-if="
                        selectEventRoom.reportStatus === 'NONE' || !selectEventRoom.reportStatus
                      "
                      class="emty-cycle"
                    ></p>
                    <img
                      v-if="selectEventRoom.reportStatus === 'APPROVED'"
                      src="../../assets/images/icon-done.svg"
                      alt=""
                      srcset=""
                    /><img
                      v-if="selectEventRoom.reportStatus === 'REJECTED'"
                      src="../../assets/images/icon-notDone.svg"
                      alt=""
                      srcset=""
                    /></div
                ></v-col>
                <v-col cols="4" class="pt-4 pb-0">
                  <div class="d-flex align-center">
                    <h3
                      @click="takeAttendance(selectEventRoom.classID, selectEventRoom.scheduleID)"
                      class="link mr-3"
                    >
                      Attendance
                    </h3>
                    <img
                      v-if="selectEventRoom.hasAttendance"
                      src="../../assets/images/icon-done.svg"
                      alt=""
                      srcset=""
                    />
                    <p v-else class="emty-cycle"></p></div
                ></v-col>
                <v-col cols="4" class="pt-4 pb-0">
                  <div class="d-flex align-center">
                    <h3
                      @click="takeAttendance(selectEventRoom.classID, selectEventRoom.scheduleID)"
                      class="link mr-3"
                    >
                      Homework
                    </h3>
                    <img
                      v-if="selectEventRoom.hasHomework"
                      src="../../assets/images/icon-done.svg"
                      alt=""
                      srcset=""
                    />
                    <p v-else class="emty-cycle"></p></div
                ></v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="2" class="pt-5 pb-0"> <h3>Note</h3></v-col>
                <v-col cols="10" class="pt-3 pb-0">
                  <h3 @click="viewAccount(ec.teacher_userID)" :style="{ fontWeight: 500 }">
                    {{ selectEventRoom && selectEventRoom.note }}
                  </h3>
                </v-col></v-row
              >
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="2" class="pt-5 pb-0"> <h3>Room</h3></v-col>
                <v-col cols="10" class="pt-3 pb-0">
                  <v-form ref="room" v-model="room">
                    <v-select
                      :items="roomList"
                      v-model="roomID"
                      item-text="roomName"
                      :rules="[v => !!v || 'Item is required']"
                      item-value="roomId"
                      outlined
                      dense
                    /> </v-form></v-col
              ></v-row>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" outlined @click=";(roomID = 'no'), updateOneRoom()">
            Set no room</v-btn
          >
          <v-btn color="primary" outlined @click="dialog = false"> Cancel </v-btn>
          <v-btn color="primary" @click="updateOneRoom()">Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogFormAllClass" v-if="dialogFormAllClass" width="100%">
      <v-card>
        <v-card-title>
          <div :style="{ width: '100%', position: 'relative' }">
            <h4 class="text-center" style="font-size: 20px">Room register</h4>
            <img
              :style="{ position: 'absolute', top: '5px', right: 0 }"
              @click="dialogFormAllClass = false"
              src="../../assets/images/icon-close.svg"
              alt=""
              srcset=""
            /></div
        ></v-card-title>
        <v-card-text id="register-room">
          <v-form ref="formRegister" v-model="formRegister">
            <v-data-table
              :items-per-page="100"
              :class="' elevation-1 form-room-register'"
              fixed-header
              hide-default-footer
              hide-default-header
              :headers="headersRigister"
              :items="filtered"
              height="80vh"
            >
              <template v-slot:header="{ props }">
                <thead class="header-register-room">
                  <tr>
                    <th v-for="header in props.headers" :key="header.value">
                      <p
                        class="register-font"
                        :style="{ width: header.width + 'px', textAlign: header.align }"
                      >
                        {{ header.text }}
                      </p>
                    </th>
                  </tr>
                  <tr class="fixed-row-filter">
                    <td v-for="header in props.headers" :key="header.text">
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
                    </td>
                  </tr>
                </thead>
              </template>
              <template v-slot:[`item.no`]="{ index }">
                <div>
                  <p class="register-font">{{ index + 1 }}</p>
                </div>
              </template>
              <template v-slot:[`item.classCode`]="{ item }">
                <div>
                  <p class="link register-font" @click="viewDetailClass(item.classID)">
                    {{ item.classCode }}
                  </p>
                </div>
              </template>
              <!-- <template v-slot:[`item.time`]="{ item }">
                <div>
                  <p>
                    {{ item.note }}
                  </p>
                </div>
              </template> -->
              <template v-slot:[`item.time`]="{ item }">
                <div>
                  <p class="register-font">
                    {{ item.timeShift }}
                  </p>
                </div>
              </template>
              <template v-slot:[`item.room`]="{ item }">
                <div>
                  <v-select
                    :class="'mt-2 pb-1 hidden-detail-input'"
                    outlined
                    :items="roomList"
                    item-text="roomName"
                    :rules="[v => !!v || 'Item is required']"
                    item-value="roomId"
                    dense
                    v-model="item.roomId"
                    class="register-font"
                    id="select-font"
                  >
                    <template v-slot:selection="{ item }">
                      <p class="no-room register-font" v-if="item.roomId === 'no'">
                        {{ item.roomName }}
                      </p>

                      <p class="register-font" v-else>{{ item.roomName }}</p>
                    </template>
                  </v-select>
                </div>
              </template>
            </v-data-table>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary" outlined @click="dialogFormAllClass = false"> Cancel </v-btn>
          <v-btn color="primary" @click="updateAll()">Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { DayPilotCalendar } from '@daypilot/daypilot-lite-vue'
import { room } from '@/api/room.js'

import dayjs from 'dayjs'
import Autocomplete from '@/components/Utils/Autocomplete.vue'
export default {
  setup() {
    return {
      dayjs,
    }
  },
  components: {
    DayPilotCalendar,
    Autocomplete,
  },
  created() {
    this.listLocation = JSON.parse(localStorage.getItem('currentUser')).locationPermissions
    this.locationID = parseInt(localStorage.getItem('currentCenter'))
    if (localStorage.getItem('roomlocation'))
      this.locationID = JSON.parse(localStorage.getItem('roomlocation'))
    if (localStorage.getItem('roomDate')) {
      this.date = localStorage.getItem('roomDate')
    } else {
      this.date = dayjs().format('YYYY-MM-DD')
    }
    this.getNoRoom()
    this.getListRoomCalendar()
    this.getListRoom()
    console.log(this.listRoomRegister)
  },
  computed: {
    filtered() {
      const listRoomRegister = this.listRoomRegister.filter(d => {
        return Object.keys(this.filters).every(f => {
          return (
            this.filters[f].length < 1 ||
            (f === 'locationt'
              ? this.filters.locationt.some(element => d.locationt.includes(element))
              : this.filters[f].includes(d[f]))
          )
        })
      })

      // console.log(
      //   listUser.reduce((arr, item) => {
      //     if (arr) {
      //       if () {
      //         console.log(item)
      //         if (
      //           arr
      //             .find(element => element.userID === item.userID)
      //             .listLocations.find(i => i.locationID === item.locationID)
      //         ) {
      //           arr[
      //             arr
      //               .map(function (e) {
      //                 return e.userID
      //               })
      //               .indexOf(item.userID)
      //           ] = {
      //             ...arr.find(element => element.userID === item.userID),
      //             listLocations: arr
      //               .find(element => element.userID === item.userID)
      //               .listLocations.push({
      //                 locationID: item.locationID,
      //                 location: item.location,
      //               }),
      //           }
      //         }
      //       } else {
      //         arr.push({
      //           ...item,
      //           listLocations: [{ locationID: item.locationID, location: item.location }],
      //         })
      //       }
      //     }
      //     return arr
      //   }, [])
      // )
      return listRoomRegister
    },
    calendar() {
      return this.$refs.calendar.control
    },
  },
  methods: {
    groupColumnValueList(val) {
      return this.listRoomRegister.map(d => d[val])
    },
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
    },
    createLessonReport(classID, scheduleID) {
      localStorage.setItem('dateOfDailyClasses', this.date)
      localStorage.removeItem('isBackFromDetailDailyClasses')
      localStorage.setItem('lessonReportRoute', this.$route.path)
      this.$router.push({
        name: 'class-management-create-lesson-report',
        query: { classID: classID, scheduleID: scheduleID },
      })
    },
    viewLessonReport(classID, scheduleID) {
      localStorage.setItem('dateOfDailyClasses', this.date)
      localStorage.removeItem('isBackFromDetailDailyClasses')
      localStorage.setItem('lessonReportRoute', this.$route.path)
      this.$router.push({
        name: 'class-management-view-lesson-report',
        params: { route: this.$route.path },
        query: { classID: classID, scheduleID: scheduleID },
      })
    },
    viewAccount(userID) {
      this.$router.push({
        name: 'account-management-view-account',
        params: {
          userId: userID,
        },
      })
    },
    changeSelect() {
      localStorage.setItem('roomlocation', this.locationID)
      localStorage.setItem('roomDate', this.date)
      this.getListRoomCalendar()
      this.getNoRoom()
      this.getListRoom()
    },
    takeAttendance(classID, scheduleID) {
      localStorage.setItem('dateOfDailyClasses', this.date)
      localStorage.removeItem('isBackFromDetailDailyClasses')
      localStorage.setItem('takeAttendanceFromTeacher', true)
      this.$router.push({
        name: 'class-management-take-attendance-student',
        query: { classID: classID, scheduleID: scheduleID },
      })
    },
    openRegister() {
      this.roomList = [...this.roomList, { roomName: 'No room', roomId: 'no' }]
      this.listRoomRegister = [
        ...this.noRooms.map(res => {
          return { ...res, roomId: 'no', roomName: 'No room' }
        }),
        ...this.dataRoom.map(item => {
          return { ...item, studentNum: item.nbrStu, roomId: item.roomID }
        }),
      ].map(item => {
        return {
          ...item,
          timeShift:
            dayjs(item?.fromTime).format('HH:mm') + ' - ' + dayjs(item?.toTime).format('HH:mm'),
          // note: item.note ? 'there is a note' : 'no note here',
        }
      })
      this.dialogFormAllClass = true
    },
    async getNoRoom() {
      await room.getNoRoom(this.locationID, this.date).then(res => {
        this.noRooms = res
      })
    },
    async updateOneRoom() {
      this.$refs.room.validate()
      const dataUpdate = {
        roomId: this.roomID === 'no' ? null : this.roomID,
        scheduleId: this.selectEventRoom.scheduleID,
      }
      if (this.room) {
        await room.updateRoom([dataUpdate]).then(() => {
          this.dialog = false
          this.getNoRoom()
          this.getListRoomCalendar()
          this.getListRoom()
        })
      }
    },
    viewDetailClass(classID) {
      this.$router.push({
        name: 'class-management-detail',
        query: { classID: classID },
      })
    },
    async updateAll() {
      this.$refs.formRegister.validate()
      const dataUpdate = this.listRoomRegister.map(res => {
        return {
          roomId: res.roomId === 'no' ? null : res.roomId,
          scheduleId: res.scheduleID,
        }
      })
      if (this.formRegister) {
        await room.updateRoom(dataUpdate).then(() => {
          this.dialogFormAllClass = false
          this.getNoRoom()
          this.getListRoomCalendar()
          this.getListRoom()
        })
      }
    },
    async getListRoomCalendar() {
      this.isLoading = true
      await room
        .getListRoomCalendar(this.locationID, this.date)
        .then(res => {
          let roomList = res.map(item => {
            return {
              name: item.roomName,
              id: item.roomID,
            }
          })
          let schedulesListWithRoom = res.reduce((arr, item, index) => {
            if (item.schedules) {
              arr = [
                ...arr,
                ...item.schedules.map(schedule => {
                  return {
                    ...schedule,
                    roomID: item.roomID,
                    roomName: item.roomName,
                    id: schedule.scheduleID,
                    start: schedule?.fromTime,
                    end: schedule?.toTime,
                    resource: item.roomID,
                    html: `<h3>${schedule.classCode}</h3><p class='pt-0 pb-0'>${
                      dayjs(schedule.fromTime).format('HH:mm') +
                      ' - ' +
                      dayjs(schedule.toTime).format('HH:mm')
                    }</p><p class='pt-0 pb-0'>Room ${item.roomName}</p>`,
                    backColor: index % 2 === 0 ? '#D6D6D4' : '#FFFFFF',
                    barColor: '#737277',
                    fontColor: '#0B2585',
                    backBarColor: '#DDE4FF',
                    borderColor: '#0B2585',
                    borderWidth: 3,
                  }
                }),
              ]
            }

            return arr
          }, [])
          this.dataRoom = schedulesListWithRoom
          // console.log(schedulesListWithRoom, roomList)
          this.calendar.update({ columns: roomList })
          this.calendar.update({ events: schedulesListWithRoom })
          this.isLoading = false
        })
        .catch(() => {
          this.dataRoom = []
        })
    },
    openEdit(event) {
      this.dialog = true

      this.roomID = event?.e?.data?.resource
      this.selectEventRoom = {
        ...event?.e?.data,
        ta: event?.e?.data?.teacherAssistant1
          ? event?.e?.data?.teacherAssistant1
          : event?.e?.data?.teacherAssistant2,
        taID: event?.e?.data?.teacherAssistant1_userID
          ? event?.e?.data?.teacherAssistant1_userID
          : event?.e?.data?.teacherAssistant2_userID,
      }
    },
    async getListRoom() {
      this.isLoading = true
      await room.getListRoom(this.locationID, this.date).then(res => {
        this.roomList = [...res]
        this.isLoading = false
      })
    },
  },
  mounted() {
    this.getListRoomCalendar()
  },
  data() {
    return {
      dataRoom: [],
      headersRigister: [
        {
          value: 'no',
          text: 'No ',
          sortable: false,
          align: 'center',
        },
        {
          value: 'classCode',
          text: 'Class code ',
          sortable: false,
          align: 'center',
          width: 120,
        },
        {
          value: 'classNote',
          text: 'Class note ',
          sortable: false,
          align: 'center',
          width: 120,
        },
        {
          value: 'timeShift',
          text: 'Time',
          sortable: false,
          align: 'center',
          width: 120,
        },
        // {
        //   value: 'studentNum',
        //   text: 'Student number',
        //   sortable: false,
        //   align: 'center',
        // },

        {
          value: 'room',
          text: 'Room',
          sortable: false,
          align: 'center',
          width: 120,
        },
      ],
      filters: {
        classCode: [],
        timeShift: [],
        studentNum: [],
        classNote: [],
      },
      isLoading: false,
      listRoomRegister: [],
      dialog: false,
      noRooms: [],
      dialogFormAllClass: false,
      events: [],
      room: false,
      listLocation: [],
      locationID: 0,
      roomID: '',
      roomList: [],
      selectEventRoom: null,
      date: dayjs().format('YYYY-MM-DD'),
      calendarConfig: {
        viewType: 'Resources',
        timeFormat: 'Clock12Hours',
        timeRangeSelectedHandling: 'Enabled',
        eventMoveHandling: 'Disabled',
        onEventClick: event => this.openEdit(event),
        eventDeleteHandling: 'Disabled',

        // onEventResized: args => {
        //   console.log('Event resized', args.e)
        // },
      },
    }
  },
  watch: {
    locationID: function () {
      this.changeSelect()
    },
    date: function () {
      this.changeSelect()
    },
  },
}
</script>

<style lang="scss" scoped>
.emty-cycle {
  width: 24px;
  height: 24px;
  background: rgb(196, 196, 196);
  border-radius: 50%;
}
.header-register-room {
  th {
    position: sticky;
    top: 0;
  }
  background: #0b2585;

  text-align: center !important;
  p {
    color: #ffff !important;
  }
}
.link {
  cursor: pointer;
  color: #427df2 !important;
}

.link:hover {
  text-decoration: underline;
  font-weight: 700;
}
.register-font {
  font-size: 22px;
}

.no-room {
  background-color: #f6b91a;
  color: antiquewhite;
  padding: 4px 5px;
  border-radius: 3px;
}
.v-dialog__content {
  z-index: 1001 !important;
}
.v-menu__content {
  z-index: 1003 !important;
  .v-list--dense {
    .v-list-item {
      .v-list-item__content {
        .v-list-item__title {
          font-size: 18px !important;
        }
      }
    }
  }
}
</style>
