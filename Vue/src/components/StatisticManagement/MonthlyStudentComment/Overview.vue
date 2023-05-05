<template>
  <div id="month-student-comment" class="d-flex flex-column">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <div class="d-flex">
            <h2 class="pt-1">Monthly Student Comments</h2>
          </div>
          <div :style="{ zIndex: '120' }">
            <div class="d-flex justify-space-between mt-3">
              <div class="d-flex">
                <v-autocomplete
                  v-model="locationID"
                  item-text="location"
                  append-icon="keyboard_arrow_down"
                  item-value="locationID"
                  :items="centers"
                  label="Center"
                  outlined
                  :class="'mr-2'"
                  dense
                >
                </v-autocomplete>
                <v-autocomplete
                  label="Class status"
                  v-model="classStatusID"
                  :items="statusList"
                  item-text="classStatus"
                  item-value="classStatusID"
                  outlined
                  dense
                  hide-details
                  class="mr-2"
                ></v-autocomplete>
                <div
                  :style="{ zIndex: 4 }"
                  :class="'datepicker'"
                  class="datapicker-with-label mr-2"
                >
                  <p>From month</p>

                  <date-picker
                    v-model="fromMonth"
                    :format="'MM/YYYY'"
                    type="month"
                    placeholder="Select month"
                  ></date-picker>
                </div>
                <div :style="{ zIndex: 4 }" class="datapicker-with-label">
                  <p>To month</p>

                  <date-picker
                    :class="'datepicker'"
                    v-model="toMonth"
                    :format="'MM/YYYY'"
                    type="month"
                    placeholder="Select month"
                  ></date-picker>
                </div>
                <v-autocomplete
                  label="Class code"
                  v-model="classID"
                  append-icon="keyboard_arrow_down"
                  :items="classList"
                  item-text="classCode"
                  item-value="classID"
                  chips
                  small-chips
                  deletable-chips
                  hide-details
                  outlined
                  dense
                  multiple
                  class="mr-2"
                ></v-autocomplete>
              </div>
              <v-btn class="primary flex-end" @click="searchComment">Search</v-btn>
            </div>
          </div>
          <!-- <div class="d-flex my-3 total-div">
            Class:
            <span :class="'link'" @click="viewClassDetail(classCode)"> {{ className }} </span>from
            {{ startDate }} to {{ endDate }} with {{ scheduleList.length }} schedules. Total:
            {{ this.filtered.length }}&nbsp;
            <div v-if="this.filtered.length > 1">students</div>
            <div v-else>student</div>
          </div> -->
          <v-progress-linear
            v-if="isLoading"
            indeterminate
            color="primary"
            class="my-10"
          ></v-progress-linear>
          <div>
            <v-tabs v-model="tab" class="tab-sadown mb-2">
              <v-tab> <h3 class="text-normal">Teacher’s comment</h3></v-tab>
              <v-tab> <h3 class="text-normal">Guardian’s comment</h3> </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
              <v-tab-item>
                <div>
                  <CommentTable
                    :toMonth="toMonth"
                    :fromMonth="fromMonth"
                    :classStatusID="classStatusID"
                    :locationID="locationID"
                    :filtersName="'fevalM'"
                    v-if="!isLoading1"
                    :students="students"
                    :commentList="commentList"
                    @setLog="setLog"
                    :type="'evaluate'"
                  />
                </div>
              </v-tab-item>
              <v-tab-item>
                <div>
                  <CommentTable
                    :toMonth="toMonth"
                    :fromMonth="fromMonth"
                    :classStatusID="classStatusID"
                    :locationID="locationID"
                    :students="students"
                    v-if="!isLoading"
                    :commentList="commentList"
                    @setLog="setLog"
                    :filtersName="'fgualM'"
                    :type="'guardianEvaluate'"
                  />
                </div>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </div>
      </v-col>
    </v-row>
    <div v-if="dialog">
      <DigCommentDetail
        :dialog="dialog"
        :comment="commentSelect"
        @setLog="setLog"
        @callData="getListStudent"
      />
    </div>
  </div>
</template>

<script>
import { class_managerment } from '@/api/class-management.js'
import DatePicker from 'vue2-datepicker'

import 'vue2-datepicker/index.css'
import dayjs from 'dayjs'

// import message from '@/components/Utils/message'
import QueryString from 'qs'
import DigCommentDetail from './DigCommentDetail.vue'
import CommentTable from './CommentTable.vue'
import { monthly_comment } from '@/api/monthly.js'

export default {
  components: { DigCommentDetail, CommentTable, 'date-picker': DatePicker },
  data() {
    return {
      fromMonth: new Date(dayjs().subtract(1, 'month').format()),
      toMonth: new Date(),
      tab: 0,
      locationID: JSON.parse(localStorage.getItem('currentCenter')),
      commentSelect: null,
      statusList: [],
      students: [],
      isLoading: false,
      isLoading1: false,
      dialog: false,
      centers: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
      dayjs: dayjs,

      listStudent: [],
      commentList: [],
      classList: [],
      classStatusID: 3,
      bodyAPI: {},
      classID: [],
    }
  },
  created() {
    if (localStorage.getItem('monthlycommentTo')) {
      this.toMonth = new Date(localStorage.getItem('monthlycommentTo'))
    }
    if (localStorage.getItem('monthlycommentFrom')) {
      this.fromMonth = new Date(localStorage.getItem('monthlycommentFrom'))
    }
    if (localStorage.getItem('monthlycommentStatus')) {
      this.classStatusID = JSON.parse(localStorage.getItem('monthlycommentStatus'))
    }
    if (localStorage.getItem('monthlycommentLocation')) {
      this.locationID = JSON.parse(localStorage.getItem('monthlycommentLocation'))
    }
    if (localStorage.getItem('monthlycommentClassIDs')) {
      this.classID = JSON.parse(localStorage.getItem('monthlycommentClassIDs'))
    }
    this.getClassStatus()
    this.getClassList()
  },
  computed: {},
  watch: {},
  methods: {
    searchComment() {
      localStorage.removeItem('fgualM')
      localStorage.removeItem('fevalM')
      localStorage.setItem('monthlycommentLocation', this.locationID)
      localStorage.setItem('monthlycommentStatus', this.classStatusID)
      localStorage.setItem('monthlycommentFrom', this.fromMonth)
      localStorage.setItem('monthlycommentTo', this.toMonth)
      localStorage.setItem('monthlycommentClassIDs', JSON.stringify(this.classID))
      this.getListStudent()
      this.getListStudent()
    },

    async getClassStatus() {
      await class_managerment.getClassStatus().then(res => {
        if (res) {
          res.unshift({
            classStatusID: 6,
            classStatus: 'All',
          })
          this.statusList = res
          this.classStatus = this.classStatusID < 6 ? res[this.classStatusID].classStatus : ''
          this.bodyAPI = {
            pLocationid: this.locationID,
            pStatus: this.classStatus,
          }
        }
      })
      await class_managerment.getClassByLocation(QueryString.stringify(this.bodyAPI)).then(res => {
        if (res) {
          this.classList = res
        }
      })
    },
    async getClassList() {
      await class_managerment.getClassByLocation(QueryString.stringify(this.bodyAPI)).then(res => {
        if (res) {
          this.classList = res
        }
      })
    },
    setLog(data) {
      this.dialog = data.openLog
      this.commentSelect = data.comment
    },
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
      localStorage.setItem('attFilter', JSON.stringify(this.filters))
    },

    async getListStudent() {
      const dataSearch = {
        locationIDs: this.locationID,
        classStatusID: this.classStatusID,
        fromMonth: !isNaN(dayjs(this.fromMonth)) ? dayjs(this.fromMonth).format('YYYY-MM') : '',
        toMonth: !isNaN(dayjs(this.toMonth)) ? dayjs(this.toMonth).format('YYYY-MM') : '',
        classID: this.classID,
      }

      this.isLoading = true
      this.isLoading1 = true
      await monthly_comment
        .getListStudentByCenterAndMore(dataSearch)
        .then(res => {
          if (!res.errors) {
            this.students = res
            this.isLoading = false
            this.isLoading1 = false
          } else {
            this.commentList = []
            this.students = []
            this.isLoading = false
            this.isLoading1 = false
          }
        })
        .catch(() => {
          this.commentList = []
          this.students = []
        })
      monthly_comment
        .getListCommentByCenterAndMore(dataSearch)
        .then(res => {
          if (!res.errors) {
            this.commentList = res
            this.isLoading = false
            this.isLoading1 = false
          } else {
            this.commentList = []
            this.students = []
            this.isLoading = false
            this.isLoading1 = false
          }
        })
        .catch(() => {
          this.commentList = []
          this.students = []
          this.isLoading1 = false
        })
    },
    back() {
      this.$router.push({ name: 'home' })
    },

    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped>
.text-normal {
  text-transform: initial;
}
.tab-sadown {
  position: relative;
  box-shadow: 0px 9px 2px -9px #000;
}
.datapicker-with-label {
  position: relative;
  p {
    position: absolute;
    top: -7px;
    z-index: 100;
    left: 10px;
    font-size: 10px;
    background: #fff;
  }
}
</style>
