<template>
  <div id="lesson-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <v-row>
            <v-col md="8">
              <div class="d-flex justify-space-between">
                <h2 class="d-flex">
                  <v-icon @click="back()">arrow_back_ios</v-icon>
                  <div class="d-flex align-center">View lesson report</div>
                </h2>
                <div class="d-flex">
                  <v-btn
                    v-if="
                      status != 'APPROVED' && status != 'REJECTED' && userInfo.accountTypeID != 4
                    "
                    class="mr-3"
                    color="error"
                    @click="
                      dialog = true
                      reject()
                    "
                  >
                    Reject
                  </v-btn>
                  <v-btn
                    v-if="status != 'APPROVED' && userInfo.accountTypeID != 4"
                    class="mr-2"
                    color="secondary"
                    @click="
                      dialog = true
                      approve()
                    "
                  >
                    Approve
                  </v-btn>
                </div>
              </div>
            </v-col>
            <v-col md="4">
              <div class="d-flex justify-space-between">
                <div v-if="status == 'INPROGRESS'" class="d-flex align-center">
                  <v-icon color="#EB9516"> mdi-dots-horizontal-circle </v-icon>
                  <span class="ml-2">Pending</span>
                </div>
                <div v-else-if="status == 'APPROVED'" class="d-flex align-center">
                  <v-icon color="#0FA958"> mdi-checkbox-marked-circle </v-icon>
                  <span class="ml-2">Approved</span>
                </div>
                <div v-else-if="status == 'REJECTED'" class="d-flex align-center">
                  <v-icon color="#EC1C24"> mdi-close-circle </v-icon>
                  <span class="ml-2">Rejected</span>
                </div>
                <v-btn color="secondary" @click="editLessonReport(classID, scheduleID)" outlined>
                  Edit lesson report
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <div class="pt-5">
            <v-row>
              <v-col md="8">
                <v-progress-linear
                  v-if="isLoading"
                  indeterminate
                  color="primary"
                  class="my-10"
                ></v-progress-linear>
                <div v-else class="d-table">
                  <div class="d-table-row">
                    <div class="d-table-cell border">
                      <h4 class="mr-2">Link</h4>
                    </div>
                    <a :href="link" v-html="link" target="_blank" class="d-table-cell border"></a>
                  </div>
                </div>
              </v-col>
              <v-divider style="height: 70vh" vertical />
              <v-col md="4">
                <h2>Class information</h2>
                <div class="list-info">
                  <div class="item">
                    <v-row>
                      <v-col md="6">Course</v-col>
                      <v-col md="6">{{ course }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="6">Class code</v-col>
                      <v-col md="6">{{ classCode }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="6">Class name</v-col>
                      <v-col md="6">{{ className }}</v-col>
                    </v-row>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" persistent width="350">
      <v-card class="mx-auto pa-10">
        <div class="text-center">
          <v-btn
            elevation="0"
            height="36"
            class="pl-4 pr-4 mr-3 mb-5"
            :loading="dialog"
            style="background: white"
          >
          </v-btn>
        </div>
        <div class="text-center">
          <b style="font-size: 1.5rem">Updating!</b><br />
          <span>Please wait...</span>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { class_managerment } from '@/api/class-management.js'
import dayjs from 'dayjs'
const querystring = require('querystring')

export default {
  components: {},
  data() {
    return {
      customToolbarNotImage: [
        [{ font: [] }],
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline'],
        [{ color: [] }],
        [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        ['clean'],
        ['blockquote'],
        ['link'],
      ],
      customToolbarImage: [
        [{ font: [] }],
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline'],
        [{ color: [] }],
        [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        ['clean'],
        ['blockquote'],
        ['link', 'image'],
      ],
      isLoading: false,
      classID: this.$route.query.classID,
      scheduleID: this.$route.query.scheduleID,
      link: '',
      course: '',
      classCode: '',
      className: '',
      status: '',
      route: localStorage.getItem('lessonReportRoute'),
      userInfo: JSON.parse(localStorage.getItem('currentUser')).userInfo,
      dialog: false,
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      await class_managerment.getClassInfo(this.classID).then(res => {
        if (res) {
          this.course = res.classInfo.programme
          this.classCode = res.classInfo.classCode
          this.className = res.classInfo.className
        }
      })
      this.isLoading = true
      await class_managerment.viewLessonReport(this.scheduleID).then(res => {
        if (res) {
          this.link = res.learningObjectives
          this.warmUp = res.warmUp
          this.runningContent = res.runningContent
          this.homework = res.homework
          this.comments = res.comments
          this.status = res.status
        }
      })
      this.isLoading = false
    },
    editLessonReport(classID, scheduleID) {
      this.$router.push({
        name: 'class-management-edit-lesson-report',
        query: { classID: classID, scheduleID: scheduleID },
      })
    },
    async reject() {
      const body = {
        scheduleID: this.scheduleID,
        status: 'REJECTED',
      }
      await class_managerment.changeStatusLessonReport(querystring.stringify(body)).then(res => {
        if (res) {
          this.dialog = true
          setTimeout(() => {
            if (this.route == '/class-management/class-list') {
              localStorage.setItem('isBackFromDetailDailyClasses', true)
              this.$router.push({ name: 'class-management-class-list' })
            } else if (this.route == '/class-management/detail') {
              this.$router.push({
                name: 'class-management-detail',
                query: { classID: this.classID },
              })
            } else if (this.route == '/my-calendar/overview') {
              this.$router.push({
                name: 'my-calendar-overview',
              })
            }
          }, 2000)
          this.dialog = false
        }
        this.init()
      })
    },
    async approve() {
      const body = {
        scheduleID: this.scheduleID,
        status: 'APPROVED',
      }
      await class_managerment.changeStatusLessonReport(querystring.stringify(body)).then(res => {
        if (res) {
          this.dialog = true
          setTimeout(() => {
            if (this.route == '/class-management/class-list') {
              localStorage.setItem('isBackFromDetailDailyClasses', true)
              this.$router.push({ name: 'class-management-class-list' })
            } else if (this.route == '/class-management/detail') {
              this.$router.push({
                name: 'class-management-detail',
                query: { classID: this.classID },
              })
            } else if (this.route == '/my-calendar/overview') {
              this.$router.push({
                name: 'my-calendar-overview',
              })
            }
          }, 1000)
          this.dialog = false
        }
        this.init()
      })
    },
    back() {
      localStorage.setItem('isBackFromDetailDailyClasses', true)
      window.history.back()
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped>
#lesson-management {
  .border {
    border: 1px solid #f0f0f0;
    padding: 12px;
  }
  .list-info {
    position: relative;
    .item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed #dadbe6;
      padding: 11px 0;
    }
  }
}
</style>
