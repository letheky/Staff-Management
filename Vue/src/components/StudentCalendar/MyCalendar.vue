<template>
  <div id="account-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 py-5">
          <h2>Lịch học</h2>
        </div>
      </v-col>
    </v-row>
    <template v-if="isLoading">
      <div class="px-10">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </div>
    </template>
    <template v-else>
      <v-row no-gutters class="fill-height">
        <v-col>
          <div class="pa-10 pt-0">
            <v-sheet height="64">
              <v-toolbar flat elevation="0">
                <v-btn text color="secondary" @click="prev">
                  <v-icon> mdi-chevron-left </v-icon>
                </v-btn>
                <v-btn outlined color="secondary" @click="setToday"> Today </v-btn>
                <v-btn text color="secondary" @click="next">
                  <v-icon> mdi-chevron-right </v-icon>
                </v-btn>
                <v-toolbar-title v-if="$refs.calendar">
                  {{ $refs.calendar.title }}
                </v-toolbar-title>
                <v-spacer></v-spacer>

                <v-btn
                  :outlined="type != 'week'"
                  :color="type == 'week' ? 'primary' : 'secondary'"
                  class="px-10 mr-3"
                  @click="type = 'week'"
                >
                  Week
                </v-btn>
                <v-btn
                  :outlined="type != 'month'"
                  :color="type == 'month' ? 'primary' : 'secondary'"
                  class="px-10"
                  @click="type = 'month'"
                >
                  Month
                </v-btn>
              </v-toolbar>
            </v-sheet>
            <v-sheet height="980">
              <v-calendar
                ref="calendar"
                v-model="focus"
                color="primary"
                :events="events"
                :event-color="getEventColor"
                event-start="fromTime"
                event-end="toTime"
                event-name="classCode"
                :type="type"
                first-time="7:00"
                interval-count="17"
                :interval-format="intervalFormatter"
                @click:event="showEvent"
                @click:more="viewDay"
                @click:date="viewDay"
              >
                @change="updateRange"
                <!-- <template v-slot:event="{ event }">
                  {{ event }}
                </template> -->
              </v-calendar>
              <v-menu
                v-model="selectedOpen"
                :close-on-content-click="false"
                :activator="selectedElement"
                offset-x
              >
                <v-card width="400" flat>
                  <v-toolbar flat :color="'#10238E'" height="40">
                    <v-toolbar-title
                      :style="{ fontSize: '14px', color: '#ffff' }"
                      class="font-weight-bold"
                    >
                      {{ _dayjs(selectedEvent.fromTime).format('DD/MM/YYYY') }}
                      : {{ selectedEvent.classCode }}
                      <span
                        v-if="selectedEvent.classGroup === 'Make-up'"
                        :style="{
                          padding: '.5rem 1rem',
                          background: '#F6B91A',
                          borderRadius: '6px',
                          fontWeight: 600,
                        }"
                        >Học bù</span
                      >
                    </v-toolbar-title>
                  </v-toolbar>
                  <v-card-text>
                    <div class="d-flex align-center justify-space-between">
                      <div class="d-flex align-center">
                        <h4>Chương trình học: &nbsp;</h4>
                        {{ selectedEvent.courseName }}
                      </div>
                      <div>
                        <div
                          v-if="selectedEvent.attendance === 'Absent'"
                          class="d-flex align-center"
                        >
                          <h4
                            class="mr-1"
                            :style="{
                              color: selectedEvent.makeUpID ? '#FFA800' : 'red',
                            }"
                          >
                            {{ selectedEvent.makeUpID ? 'Đã đăng kí học bù' : 'Vắng mặt' }}
                          </h4>
                          <img
                            width="20"
                            :src="
                              selectedEvent.makeUpID
                                ? require('../../assets/images/icon-done-makeup.svg')
                                : require('../../assets/images/icon-close-red-round.svg')
                            "
                            alt=""
                            srcset=""
                          />
                        </div>
                        <div
                          v-if="selectedEvent.attendance === 'Attended'"
                          class="d-flex align-center"
                        >
                          <h4
                            class="mr-1"
                            :style="{
                              color: '#27AE60',
                            }"
                          >
                            Có mặt
                          </h4>
                          <img
                            width="20"
                            src="../../assets/images/icon-done-round.svg"
                            alt=""
                            srcset=""
                          />
                        </div>
                      </div>
                    </div>
                    <div class="d-flex align-center mt-1 justify-space-between">
                      <div class="d-flex align-center">
                        <h4>Phòng học: &nbsp;</h4>
                        {{ selectedEvent.room }}
                      </div>
                      <div>
                        <div v-if="selectedEvent.homework" class="d-flex align-center">
                          <h4
                            :style="{
                              color: selectedEvent.homework === 'Yes' ? '#27AE60' : 'red',
                            }"
                            class="mr-1"
                          >
                            {{
                              selectedEvent.homework === 'Yes' ? 'Đã hoàn thành' : 'Chưa hoàn thành'
                            }}
                          </h4>
                          <img
                            width="20"
                            :src="
                              selectedEvent.homework === 'Yes'
                                ? require('../../assets/images/icon-homework.svg')
                                : require('../../assets/images/icon-nohomework.svg')
                            "
                            alt=""
                            srcset=""
                          />
                        </div>
                      </div>
                    </div>

                    <div class="d-flex align-center">
                      <h4>Ca học:&nbsp;</h4>
                      {{ _dayjs(selectedEvent.fromTime).format('HH:mm') }} -
                      {{ _dayjs(selectedEvent.toTime).format('HH:mm') }}
                    </div>
                    <div class="d-flex align-center">
                      <h4>Trung tâm:&nbsp;</h4>
                      {{ selectedEvent.location }}
                    </div>
                    <div class="d-flex mt-3">
                      <v-row>
                        <v-col cols="6" class="pt-2 pb-2">
                          <v-btn
                            :style="{ width: '100%' }"
                            outlined
                            color="primary"
                            class="d-flex align-center justify-start"
                            @click="viewClassDetail(selectedEvent.classID)"
                            ><img
                              class="mr-2"
                              src="../../assets/images/icon-infor.svg"
                              alt=""
                              srcset=""
                            />
                            <p>Thông tin lớp học</p>
                          </v-btn>
                        </v-col>
                        <v-col cols="6" class="pt-2 pb-2">
                          <v-btn
                            outlined
                            class="d-flex align-center justify-start"
                            :style="{ width: '100%' }"
                            color="primary"
                            @click="viewHomework(selectedEvent.scheduleID)"
                          >
                            <img
                              class="mr-2"
                              src="../../assets/images/icon-book.svg"
                              alt=""
                              srcset=""
                            />
                            <p>Bài tập về nhà</p>
                          </v-btn>
                        </v-col>
                        <v-col :cols="getStatus(selectedEvent) ? '6' : '12'" class="pt-2 pb-2">
                          <v-btn
                            outlined
                            :style="{ width: '100%' }"
                            color="primary"
                            :class="`d-flex align-center ${
                              getStatus(selectedEvent) ? 'justify-start' : 'justify-center'
                            }`"
                            :disabled="selectedEvent.statusLessonReport !== 'APPROVED'"
                            @click="viewLessonReport(selectedEvent.scheduleID)"
                          >
                            <img
                              class="mr-2"
                              src="../../assets/images/icon-report.svg"
                              alt=""
                              srcset=""
                            />
                            <p>Báo cáo bài học</p>
                          </v-btn>
                        </v-col>
                        <v-col v-if="getStatus(selectedEvent)" cols="6" class="pt-2 pb-2">
                          <v-btn
                            @click="openReMakupLesson"
                            class="d-flex align-center justify-start"
                            :style="{ width: '100%', color: '#ffff' }"
                            color="#27AE60"
                          >
                            <img
                              class="mr-2"
                              src="../../assets/images/icon-regis.svg"
                              alt=""
                              srcset=""
                            />
                            <p>
                              {{
                                selectedEvent.makeUpID
                                  ? 'Thông tin buổi học bù'
                                  : ' Đăng kí học bù '
                              }}
                            </p>
                          </v-btn>
                        </v-col>
                      </v-row>

                      <!-- <v-btn class="mt-2 ml-2" outlined color="primary">
                        Recording
                      </v-btn> -->
                    </div>
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-sheet>
          </div>
        </v-col>
      </v-row>
      <FormMakeupLesson
        v-if="dialogForm"
        :dialog="dialogForm"
        :type="'student'"
        @setLog="setLog"
        @callData="getCalendar"
        :makeupInfor="makeupInfor"
        :justView="_dayjs().isAfter(_dayjs(selectedEvent.makeUpDate)) && selectedEvent.makeUpID"
      />
    </template>
    <v-row justify="center">
      <v-dialog v-model="homeworkDialog" persistent width="450">
        <v-card class="mx-auto">
          <v-toolbar flat :color="getEventColor(selectedEvent)" height="40">
            <v-toolbar-title style="font-size: 14px" class="font-weight-bold">
              Homework: {{ selectedEvent.classCode }},
              {{ _dayjs(selectedEvent.toTime).format('dddd DD/MM/YYYY') }}
              {{ _dayjs(selectedEvent.fromTime).format('HH:mm') }} -
              {{ _dayjs(selectedEvent.toTime).format('HH:mm') }}
            </v-toolbar-title>
          </v-toolbar>
          <div v-if="homework" class="pa-4">
            <div v-if="!homework.includes('https://')" v-html="homework"></div>
            <div v-else v-for="(item, index) in homeWorkListReplaced" :key="index">
              <a v-if="item.value" target="_blank" :href="item.value" class="link-action">
                {{ item.label.replaceAll(':', '') }}
              </a>
              <div class="text-action" v-else>
                {{ item.label }}
              </div>
            </div>
          </div>
          <p v-else class="text-center pt-2">This lesson has no homework</p>
          <div class="pl-3 pr-3">
            <div :class="'list-btn'">
              <v-btn
                class="mb-2"
                elevation="0"
                @click="
                  homeworkDialog = false
                  homeWorkListReplaced = []
                "
                outlined
              >
                Close
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { student_information } from '@/api/student-information.js'
import { class_managerment } from '@/api/class-management.js'
import dayjs from 'dayjs'
import FormMakeupLesson from '@/components/StatisticManagement/FormMakeupLesson.vue'

const querystring = require('querystring')

export default {
  components: { FormMakeupLesson },
  data() {
    return {
      linkRecord: '',
      dialogForm: false,
      isLoading: false,
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      studentID: JSON.parse(localStorage.getItem('currentUser')).userInfo.studentID,
      homeworkDialog: false,
      homework: '',
      homeWorkList: [],
      homeWorkReplace: '',
      homeWorkListReplaced: [],
    }
  },
  created() {},
  mounted() {
    this.$refs.calendar.checkChange()
    this.getCalendar()
  },
  methods: {
    getStatus(item) {
      if (item.classGroup === 'Public') {
        if (item.attendance === 'Absent') {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    setLog(data) {
      this.dialogForm = data.openDialog ? data.openDialog : false
      this.makeupInfor = data.makeup ? data.makeup : ''
    },
    openReMakupLesson() {
      this.setLog({
        openDialog: true,
        makeup: this.selectedEvent,
      })
    },
    back() {
      window.history.back()
    },
    viewDay({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor(event) {
      // if (event.orgTeacherID == this.teacherID && event.teacherID != null) {
      //   return "red";
      // } else if (event.teacherID == this.teacherID) {
      //   return "blue";
      // } else {
      //   return "other";
      // }
      if (event) {
        return 'blue'
      }
    },
    setToday() {
      this.focus = ''
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => (this.selectedOpen = true)))
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    intervalFormatter(locale) {
      return locale.time
    },
    async callDataNoLoading() {
      const body = {
        studentID: this.studentID,
        fromDate: dayjs().add(-6, 'month').format('YYYY-MM-DD'),
        toDate: dayjs().add(6, 'month').format('YYYY-MM-DD'),
      }
      await student_information.getStudentCalendar(querystring.stringify(body)).then(res => {
        if (res) {
          this.events = res
        }
      })
    },
    async getCalendar() {
      this.isLoading = true
      const body = {
        studentID: this.studentID,
        fromDate: dayjs().add(-6, 'month').format('YYYY-MM-DD'),
        toDate: dayjs().add(6, 'month').format('YYYY-MM-DD'),
      }
      await student_information.getStudentCalendar(querystring.stringify(body)).then(res => {
        if (res) {
          this.events = res
        }
      })
      this.isLoading = false
    },
    studentAttendance(classID, scheduleID) {
      this.$router.push({
        name: 'class-management-take-attendance-student',
        query: { classID: classID, scheduleID: scheduleID },
      })
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
    extractUrl(html) {
      if (!html) return

      const urlRegex =
        /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-a-zA-Z0-9+&@#/%=~_|$?!:,.]*\)|[-a-zA-Z0-9+&@#/%=~_|$?!:,.])*(?:\([-a-zA-Z0-9+&@#/%=~_|$?!:,.]*\)|[a-zA-Z0-9+&@#/%=~_|$])/g

      return html.replace(urlRegex, function (url) {
        let hyperlink = url

        if (!hyperlink.match('^https?://')) {
          hyperlink = 'http://' + hyperlink
        }

        return hyperlink
      })
    },
    getPDFLinkExport(url) {
      if (url.indexOf('https://docs.google.com/document') != 0) {
        return null
      }

      // let url = 'https://docs.google.com/document/d/13TDoyYK050BmfyPZdgS7_dgK_u8nl2KX/edit';

      const documentId = url.match(/[-\w]{25,}(?!.*[-\w]{25,})/)

      if (documentId && documentId[0]) {
        const pos = url.indexOf(documentId[0])

        const newUrl = url.substring(0, pos + documentId[0].length) + '/export?format=pdf'

        let viewUrl = 'https://docs.google.com/viewer?url=' + newUrl

        return viewUrl
      }

      return null
    },
    async viewLessonReport(scheduleID) {
      await class_managerment.viewLessonReport(scheduleID).then(res => {
        if (res) {
          if (res.status === 'APPROVED') {
            const url = this.extractUrl(res?.learningObjectives)
            if (url) {
              const pdfUrl = this.getPDFLinkExport(url)
              try {
                window.open(pdfUrl, '_blank')
              } catch (error) {
                console.log(error)
              }
            }
          }
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
.list-btn {
  width: fit-content;
  margin-left: auto;
}
</style>
