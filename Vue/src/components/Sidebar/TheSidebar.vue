<template>
  <v-navigation-drawer
    app
    width="258"
    color="primary"
    permanent
    :mini-variant.sync="$store.state.isActiveSidebar"
    mini-variant-width="100"
  >
    <router-link :to="{ name: 'home' }">
      <img
        src="@/assets/images/logo-white.svg"
        class="pa-3 pb-0"
        :style="$store.state.isActiveSidebar ? 'width : 80px; padding-left: 25px !important' : ''"
      />
    </router-link>
    <v-list>
      <v-list-item
        v-if="currentUser.userInfo.accountTypeID === 5"
        class="menu-title dashboard"
        to="/dashboard"
      >
        <v-list-item-icon class="my-2" style="margin-right: 14px !important">
          <i :class="'isax fs-24 isax-grid-2'"></i>
        </v-list-item-icon>
        <v-list-item-title v-text="'Dashboard'"> </v-list-item-title>
      </v-list-item>
      <v-list-item
        v-if="currentUser.userInfo.accountTypeID === 5 || currentUser.userInfo.accountTypeID === 4"
        class="menu-title dashboard"
        to="/task-management/overview"
      >
        <v-list-item-icon class="my-2" style="margin-right: 14px !important">
          <i :class="'isax fs-24 isax-task'"></i>
        </v-list-item-icon>
        <v-list-item-title v-text="'Task Management'"> </v-list-item-title>
      </v-list-item>
      <v-list-item
        v-if="currentUser.userInfo.accountTypeID === 5"
        class="menu-title dashboard"
        to="/feedback-management-messenger"
      >
        <v-list-item-icon class="my-2" style="margin-right: 14px !important">
          <img src="../../assets/images/icon-fb-admin.svg" alt="" class="" />
        </v-list-item-icon>
        <v-list-item-title v-text="'Feedback New'"> </v-list-item-title>
      </v-list-item>
      <v-list-item
        v-if="currentUser.userInfo.accountTypeID === 5"
        class="menu-title dashboard"
        to="/feedback-management-admin"
      >
        <v-list-item-icon class="my-2" style="margin-right: 14px !important">
          <img src="../../assets/images/icon-fb-management.svg" alt="" class="" />
        </v-list-item-icon>
        <v-list-item-title v-text="'Feedback Management'"> </v-list-item-title>
      </v-list-item>
      <div v-for="item in listRole" :key="item.title">
        <div v-if="item.title === 'Schedule' && item.accountType === 'Student'">
          <v-list-item
            v-for="itemChild in item.items"
            :key="itemChild.title"
            class="menu-title dashboard pb-2 pt-2"
            :to="itemChild.path"
          >
            <img :src="itemChild.iconImg" alt="" class="mr-4" />
            <v-list-item-title v-text="itemChild.title"> </v-list-item-title>
          </v-list-item>
        </div>
        <div v-else-if="item.accountType === 'Teacher'">
          <v-list-item
            v-for="itemChild in item.items"
            :key="itemChild.title"
            class="menu-title dashboard pb-2 pt-2"
            :to="itemChild.path"
          >
            <img :src="itemChild.iconImg" alt="" class="mr-4" />
            <v-list-item-title v-text="itemChild.title"> </v-list-item-title>
          </v-list-item>
        </div>
        <v-list-group v-else v-model="item.active" no-action append-icon="arrow_drop_down">
          <template v-slot:activator>
            <v-list-item-icon class="my-2" style="margin-right: 14px !important">
              <img v-if="item.icon.indexOf('isax')" :src="item.icon" alt="" />
              <i v-else :class="'isax fs-24 ' + item.icon"></i>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"> </v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item v-for="child in item.items" :key="child.title" :to="child.path">
            <v-list-item-content>
              <v-list-item-title
                @click="filterPopUp(child.title)"
                :class="
                  child.path == $route.path ||
                  (!child.path &&
                    child.title == 'Feedback' &&
                    $route.path.includes('/center-management/feedback-management')) ||
                  (!child.path &&
                    child.title == 'Students by class' &&
                    $route.path.includes('/statistics/student-by-class')) ||
                  (!child.path &&
                    child.title == 'Students attendance report' &&
                    $route.path.includes('/statistics/student-attendance')) ||
                  (!child.path &&
                    child.title == 'Teacher changes by class' &&
                    $route.path.includes('/statistics/teacher-changes-by-class'))
                    ? 'menu-title-active'
                    : 'menu-title'
                "
              >
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">{{ child.title }}</div>
                  </template>
                  <div v-html="formatTitle(child.title)"></div>
                </v-tooltip>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </div>
    </v-list>
    <popup-filter
      @confirm="confirmFilter"
      @cancel="cancelFilter"
      :maxWidth="maxWidth"
      :width="width"
      ref="confirmFilter"
    >
      <v-card-title slot="title" class="pt-0 mb-5 pa-0">
        <h4 class="mb-5">Filter the feedback</h4>
        <div class="mb-3">
          <!-- <date-picker
            :model="fromDate"
            @update:model="updateFromDate"
            title="From date"
            style="width: 300px"
          ></date-picker> -->
          <v-text-field
            type="date"
            label="From date"
            style="width: 330px"
            v-model="fromDate"
            outlined
            dense
            hide-details
          >
          </v-text-field>
        </div>
        <div>
          <!-- <date-picker
            :model="toDate"
            @update:model="updateToDate"
            title="To date"
            style="width: 300px"
          ></date-picker> -->
          <v-text-field
            type="date"
            label="To date"
            style="width: 330px"
            v-model="toDate"
            outlined
            dense
            hide-details
          >
          </v-text-field>
        </div>
      </v-card-title>
      <v-card-actions> </v-card-actions>
    </popup-filter>
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
          <div style="font-size: 14px">Selected {{ selected.length }}/{{ filtered.length }}</div>
        </div>
        <v-progress-linear
          v-if="isLoading"
          indeterminate
          color="primary"
          class="my-10"
        ></v-progress-linear>
        <v-data-table
          v-if="!isLoading"
          :headers="headers"
          :items="filtered"
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
        </v-data-table>
      </v-card-title>
      <v-card-actions> </v-card-actions>
    </statistic-popup>
  </v-navigation-drawer>
</template>

<script>
import PopupFilter from '@/components/CenterManagement/FeedBackManagement/PopupFilter.vue'
// import DatePicker from "@/components/Utils/DatePicker.vue";
import dayjs from 'dayjs'
import StatisticPopup from '@/components/StatisticManagement/StatisticPopup.vue'
import { class_managerment } from '@/api/class-management.js'
import { account_managerment } from '@/api/account-management.js'
import iconCalStu from '../../assets/images/icon-cal.svg'
import iconRoadMapStu from '../../assets/images/icon-roadmap.svg'
import iconFeedBackStu from '../../assets/images/icon-feedback.svg'
import iconRecordStu from '../../assets/images/icon-record-student.svg'
import iconRecordMonthly from '../../assets/images/icon-monthy-bar.svg'
// import iconLibrary from '../../assets/images/icon-library.svg'
const querystring = require('querystring')
export default {
  components: {
    'popup-filter': PopupFilter,
    // "date-picker": DatePicker,
    'statistic-popup': StatisticPopup,
  },
  data() {
    return {
      iconCalStu: iconCalStu,
      iconFeedBackStu: iconFeedBackStu,
      iconRecordStu: iconRecordStu,
      iconRoadMapStu: iconRoadMapStu,
      hello: 'salary',
      fromDate: dayjs()
        .add(-parseInt(dayjs().add(-1, 'day').format('DD')), 'day')
        .format('YYYY-MM-DD'),
      toDate: dayjs(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)).format(
        'YYYY-MM-DD'
      ),
      width: 400,
      maxWidth: 1000,
      maxHeight: 200,
      headers: [
        {
          text: 'Class code',
          value: 'classCode',
          sortable: false,
        },
      ],
      filters: {
        classCode: [],
      },
      classList: [],
      selected: [],
      isLoading: false,
      centers: [],
      center: localStorage.getItem('statisticCenter') || '',
      status: localStorage.getItem('statisticStatus') || '',
      statusList: [],
      classIds: [],
      items: [
        {
          icon: 'isax-building-3',
          typeIcon: '',
          items: [
            {
              title: 'Center Management',
              path: '/center-management/overview',
              functionID: process.env.VUE_APP_ENV_FUNCTION_CENTERS,
            },
            {
              title: 'News Management',
              path: '/center-management/view-news',
              functionID: process.env.VUE_APP_ENV_FUNCTION_NEWS,
            },

            {
              title: 'Feedback',
              functionID: process.env.VUE_APP_ENV_FUNCTION_FEEDBACK,
            },
          ],
          title: 'Center',
          accountType: 'Staff',
        },
        {
          typeIcon: '',
          icon: 'isax-money',
          items: [
            {
              title: 'Teacher Salary',
              path: '/financial/teacher-salary',
              functionID: process.env.VUE_APP_ENV_FUNCTION_TEACHER_SALARY,
            },
            {
              title: 'QC Salary',
              path: '/financial/qc-salary',
              functionID: process.env.VUE_APP_ENV_FUNCTION_QC_SALARY_MANAGEMENT,
            },
            {
              title: 'My Salary',
              path: '/financial/detail-qc-salary/1',
              functionID: process.env.VUE_APP_ENV_FUNCTION_MY_SALARY,
            },
          ],
          title: 'Financial',
          accountType: 'Staff',
        },
        {
          typeIcon: '',
          icon: require('../../assets/images/icon-activity.svg'),
          items: [
            {
              title: 'Activity list',
              path: '/activities/list-activities',
              functionID: process.env.VUE_APP_ENV_FUNCTION_ACTIVITY_LIST,
            },
            {
              title: 'Registration management',
              path: '/activities/register-list',
              functionID: process.env.VUE_APP_ENV_FUNCTION_ACTIVITY_REGISTER,
            },
            {
              title: 'Side activities note ',
              path: '/activities/note-list',
              functionID: process.env.VUE_APP_ENV_FUNCTION_ACTIVITY_REGISTER,
            },
            {
              title: 'Activity report',
              path: '/activities/report-activities',
              functionID: process.env.VUE_APP_ENV_FUNCTION_ACTIVITY_REPORT,
            },
          ],
          title: 'Side activity',
          accountType: 'Staff',
        },
        {
          typeIcon: '',
          icon: require('../../assets/images/icon-library.svg'),
          items: [
            {
              title: 'Teacher library',
              path: '/libraries/teacher-library',
              functionID: process.env.VUE_APP_ENV_FUNCTION_TEACHER_LIBRARY,
            },
            {
              title: 'Student library',
              path: '/libraries/student-library',
              functionID: process.env.VUE_APP_ENV_FUNCTION_STUDENT_LIBRARY,
            },
            {
              title: 'Internal library',
              path: '/libraries/internal-library',
              functionID: process.env.VUE_APP_ENV_FUNCTION_INTERNAL_LIBRARY,
            },
          ],
          title: 'Reference library',
          accountType: 'Staff',
        },
        {
          typeIcon: '',
          icon: 'isax-book',
          items: [
            {
              title: 'Calendar',
              path: '/class-management/calendar',
              functionID: process.env.VUE_APP_ENV_FUNCTION_QC_CALENDAR,
            },

            {
              title: 'Daily Classes',
              path: '/class-management/daily-classes',
              functionID: process.env.VUE_APP_ENV_FUNCTION_CLASSES,
            },
            {
              title: 'Daily Classes by QC',
              path: '/class-management/qc-daily-class',
              functionID: process.env.VUE_APP_ENV_FUNCTION_QC_DAILY_CLASS,
            },
            {
              title: 'Course Management',
              path: '/course-management/overview',
              functionID: process.env.VUE_APP_ENV_FUNCTION_LEVELS,
            },
            {
              title: 'Class Management',
              path: '/class-management/overview',
              functionID: process.env.VUE_APP_ENV_FUNCTION_CLASSES,
            },
            {
              title: 'Monthly Student Comments',
              path: '/class-management/month-student-comments',
              functionID: process.env.VUE_APP_ENV_FUNCTION_REPORT,
            },
            {
              title: 'Student Recording',
              path: '/class-management/student-recording',
              functionID: process.env.VUE_APP_ENV_FUNCTION_STUDENT_RECORDING,
            },
            {
              title: 'Achievements & Rewards',
              path: '/reward',
              functionID: process.env.VUE_APP_ENV_FUNCTION_REPORT,
            },
            {
              title: 'Make-up lessons',
              path: '/makeup-lesson',
              functionID: process.env.VUE_APP_ENV_FUNCTION_MAKEUP_LESSON_REPORT,
            },
            {
              title: 'Room usage situation',
              path: '/room/calendar',
              functionID: process.env.VUE_APP_ENV_FUNCTION_ROOM,
            },
          ],
          title: 'Academic',
          accountType: 'Staff',
        },
        {
          icon: 'isax-profile-2user',
          active: false,
          typeIcon: '',
          items: [
            {
              title: 'Account list',
              path: '/account-management/overview',
              functionID: process.env.VUE_APP_ENV_FUNCTION_USER_PROFILE,
            },
            {
              title: "Teacher's time available",
              path: '/center-management/time-available',
              functionID: process.env.VUE_APP_ENV_FUNCTION_TEACHER_FREE_TIME,
            },
          ],
          title: 'Account Information',
          accountType: 'Staff',
        },
        {
          icon: 'isax-setting',
          typeIcon: '',
          items: [
            {
              title: 'My leave of absence request',
              path: '/application/leave-of-absence-request',
            },
          ],
          title: 'Application',
          accountType: 'Staff',
        },
        {
          icon: 'isax-edit',
          typeIcon: '',
          items: [
            {
              title: 'Teacher leave of absence',
              path: '/request/teacher-leave-of-absence-request',
              functionID: process.env.VUE_APP_ENV_FUNCTION_TEACHER_ABSENCE,
            },
            {
              title: 'Staff leave of absence',
              path: '/request/staff-leave-of-absence-request',
              functionID: process.env.VUE_APP_ENV_FUNCTION_TEACHER_ABSENCE,
            },
          ],
          title: 'Request',
          accountType: 'Staff',
        },
        {
          icon: 'isax-stickynote',
          typeIcon: '',
          items: [
            {
              title: 'Teachers on leave',
              path: '/statistics/teacher-on-leave',
              functionID: process.env.VUE_APP_ENV_FUNCTION_REPORT,
            },
            {
              title: 'Staffs on leave',
              path: '/statistics/staff-on-leave',
              functionID: process.env.VUE_APP_ENV_FUNCTION_REPORT,
            },

            {
              title: 'Teacher changes by class',
              functionID: process.env.VUE_APP_ENV_FUNCTION_REPORT,
            },
          ],
          title: 'Statistics',
          accountType: 'Staff',
        },
        {
          icon: 'isax-setting',
          typeIcon: '',
          items: [],
          title: 'System',
          accountType: 'Staff',
        },
        {
          icon: 'isax-calendar',
          typeIcon: '',
          items: [
            {
              iconImg: iconCalStu,
              title: 'Calendar',
              path: '/my-calendar/overview',
            },
            {
              iconImg: require('../../assets/images/icon-feetime.svg'),
              title: 'Register Free Time',
              path: '/my-calendar/register-free-time',
            },
            {
              iconImg: require('../../assets/images/icon-leave.svg'),
              title: 'Leave of Absent',
              path: '/my-calendar/leave-of-absence-history',
            },
            {
              iconImg: require('../../assets/images/icon-dailyclass.svg'),
              title: 'Daily Classes',
              path: '/class-management/daily-classes',
            },
            {
              iconImg: require('../../assets/images/icon-library.svg'),
              title: 'Teacher library',
              path: '/libraries/teacher-library',
            },
            {
              iconImg: require('../../assets/images/icon-library.svg'),
              title: 'Student library',
              path: '/libraries/student-library',
            },
            {
              iconImg: require('../../assets/images/icon-library.svg'),
              title: 'Internal library',
              path: '/libraries/internal-library',
            },
          ],
          title: 'Schedule',
          accountType: 'Teacher',
        },
        {
          icon: 'isax-briefcase',
          typeIcon: '',
          items: [
            {
              iconImg: require('../../assets/images/icon-salary.svg'),
              title: 'Salary',
              path: '/salary/list',
            },
          ],
          title: 'Salary record',
          accountType: 'Teacher',
        },
        {
          icon: 'isax-calendar',
          typeIcon: '',
          items: [
            {
              title: 'Lịch học',
              iconImg: iconCalStu,
              path: '/student-calendar/overview',
            },
            {
              title: 'Lộ trình khóa học',
              iconImg: iconRoadMapStu,
              path: '/student-roadmap/overview',
            },
            {
              title: 'Phản hồi',
              iconImg: iconFeedBackStu,
              path: '/feedback-management-messenger',
            },
            {
              title: 'Bài tập ghi âm',
              iconImg: iconRecordStu,
              path: '/record-by-stu',
            },
            {
              title: 'Nhận xét hàng tháng',
              iconImg: iconRecordMonthly,
              path: '/student-monthly-comment',
            },
            {
              title: 'Thành tích và khen thưởng',
              iconImg: require('../../assets/images/icon-reward.svg'),
              path: '/reward-student',
            },
            {
              title: 'Thư viện tham khảo',
              iconImg: require('../../assets/images/icon-library.svg'),
              path: '/libraries/student-library',
            },
          ],
          title: 'Schedule',
          accountType: 'Student',
        },
        {
          icon: require('../../assets/images/icon-operation.svg'),
          typeIcon: 'imgIcon',

          items: [
            {
              title: 'Student Attendance Report',
              path: '/report/student-attendance',
              functionID: process.env.VUE_APP_ENV_FUNCTION_STUDENT_ATTENDANCE_REPORT,
            },
            {
              title: 'Absent Students Report',
              path: '/statistics/student-absent-report',
              functionID: process.env.VUE_APP_ENV_FUNCTION_STUDENT_ATTENDANCE_REPORT,
            },
            {
              title: 'Student Homework Report',
              path: '/report/student-homework',
              functionID: process.env.VUE_APP_ENV_FUNCTION_STUDENT_ATTENDANCE_REPORT,
            },
            {
              title: 'No Homework Report',
              path: '/no-home-work',
              functionID: process.env.VUE_APP_ENV_FUNCTION_NO_HOMEWORK_REPORT,
            },
            {
              title: 'Customer Care Report',
              path: '/report/custoner-care',
              functionID: process.env.VUE_APP_ENV_FUNCTION_CUSTOMER_CARE_REPORT,
            },
            {
              title: 'Daily Cash',
              path: '/report/daily-cash',
              functionID: process.env.VUE_APP_ENV_FUNCTION_DAILY_CASH,
            },
          ],
          title: 'Operation Reports',
          accountType: 'Staff',
        },
        {
          icon: require('../../assets/images/icon-salereport.svg'),

          items: [
            {
              title: 'Telesales Report',
              path: '/telesales',
              functionID: process.env.VUE_APP_ENV_FUNCTION_TELESALES_REPORT,
            },
            {
              title: 'Visitor Report',
              path: '/report/visitor',
              functionID: process.env.VUE_APP_ENV_FUNCTION_VISITOR_REPORT,
            },
            {
              title: 'Sale Report',
              path: '/report/sale-report',
              functionID: process.env.VUE_APP_ENV_FUNCTION_SALE_REPORT,
            },

            {
              title: 'Daily Cash',
              path: '/report/daily-cash',
              functionID: process.env.VUE_APP_ENV_FUNCTION_DAILY_CASH,
            },
          ],
          title: 'Sale Reports',
          accountType: 'Staff',
          typeIcon: 'imgIcon',
        },

        {
          icon: require('../../assets/images/icon-cm.svg'),
          typeIcon: 'imgIcon',
          items: [
            {
              title: 'Student Average Report',
              path: '/report/student-av-report',
              functionID: process.env.VUE_APP_ENV_FUNCTION_STUDENT_AVERAGE,
            },
            {
              title: 'Outstanding Report',
              path: '/report/outstanding-report',
              functionID: process.env.VUE_APP_ENV_FUNCTION_OUTSTANDING,
            },
            {
              title: 'Stopped Student Report',
              path: '/report/StoppedStudent',
              functionID: process.env.VUE_APP_ENV_FUNCTION_STUDENT_STOPPED,
            },
            {
              title: 'KPI Report',
              path: '/report/kpi',
              functionID: process.env.VUE_APP_ENV_FUNCTION_KPI_REPORTS,
            },
            {
              title: 'Course Overview',
              path: '/report/courseOverview',
              functionID: process.env.VUE_APP_ENV_FUNCTION_COURSE_OVERVIEW,
            },
            {
              title: 'Revenue Report',
              path: '/report/RevenueReport',
              functionID: process.env.VUE_APP_ENV_FUNCTION_REVENUE_REPORT,
            },

            {
              title: 'Center Revenue',
              path: '/report/revenue-report',
              functionID: process.env.VUE_APP_ENV_FUNCTION_REVENUE_CENTER_REPORT,
            },
            {
              title: 'Sale Report',
              path: '/report/sale-report',
              functionID: process.env.VUE_APP_ENV_FUNCTION_SALE_REPORT,
            },
          ],
          title: 'CM Reports',
          accountType: 'Staff',
        },
        {
          typeIcon: 'imgIcon',
          icon: require('../../assets/images/icon-account.svg'),

          items: [
            {
              title: 'Daily Spending Diary',
              path: '/report/daily-spending-diary',
              functionID: process.env.VUE_APP_ENV_FUNCTION_DAILY_SPENDING_DIARY,
            },
            {
              title: 'Daily Cash',
              path: '/report/daily-cash',
              functionID: process.env.VUE_APP_ENV_FUNCTION_DAILY_CASH,
            },
            {
              title: 'Book Inventory',
              path: '/report/book-inventory',
              functionID: process.env.VUE_APP_ENV_FUNCTION_BOOK_INVENTORY,
            },

            {
              title: 'Sale Report',
              path: '/report/sale-report',
              functionID: process.env.VUE_APP_ENV_FUNCTION_SALE_REPORT,
            },
          ],
          title: 'Accounting Reports',
          accountType: 'Staff',
        },
      ],
      currentCenter: JSON.parse(localStorage.getItem('currentCenter')),
      locationPermission: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
      functionRole: JSON.parse(localStorage.getItem('functionRole')),
      accountTypeID: localStorage.getItem('accountTypeID'),
      currentUser: JSON.parse(localStorage.getItem('currentUser')),
      listRole: [],
      count: 0,
      accountTy: null,
      active: false,
      resizeImage: false,
    }
  },
  mounted() {
    this.locationPermission.forEach(x => {
      if (this.currentCenter === x.locationID) {
        this.items = this.items.filter(y => y.accountType == x.accountTypeName)
        this.accountTy = x.accountTypeName
      }
    })
    this.items.forEach(x => {
      if (this.accountTy == 'Staff') {
        this.count = x.items.length
        x.items.forEach(y => {
          if (
            this.functionRole.filter(
              z =>
                (z.functionID == y.functionID && z.cFull == true) ||
                (z.functionID == y.functionID && z.cRead == true) ||
                (z.functionID == y.functionID && z.cModify == true)
            ).length == 1
          ) {
            x.items.push(y)
          }
        })
        x.items.splice(0, this.count)
      }
      if (x.items.length > 0) {
        if (this.currentUser.userInfo.accountTypeID == 5) {
          this.listRole.push({
            accountType: x.items.length > 0 ? x.accountType : null,
            icon: x.items.length > 0 ? x.icon : null,
            items: x.items,
            title: x.items.length > 0 ? x.title : null,
          })
        } else if (this.currentUser.userInfo.accountTypeID == 4) {
          this.listRole.push({
            accountType: x.items.length > 0 ? x.accountType : null,
            icon: x.items.length > 0 ? x.icon : null,
            items: x.items,
            title: x.items.length > 0 ? x.title : null,
          })
          this.listRole = this.listRole.filter(x => x.accountType == 'Teacher')
        } else if (this.currentUser.userInfo.accountTypeID == 1) {
          this.listRole.push({
            accountType: x.items.length > 0 ? x.accountType : null,
            icon: x.items.length > 0 ? x.icon : null,
            items: x.items,
            title: x.items.length > 0 ? x.title : null,
          })
          this.listRole = this.listRole.filter(x => x.accountType == 'Student')
        }
      }
      if (
        x.title == 'Application' &&
        this.currentUser.userInfo.accountTypeID != 1 &&
        this.currentUser.userInfo.accountTypeID != 2 &&
        this.currentUser.userInfo.accountTypeID != 3
      ) {
        this.listRole.push({
          icon: 'isax-setting',
          items: [
            {
              title: 'My leave of absence request',
              path: '/application/leave-of-absence-request',
            },
          ],
          title: 'Application',
          accountType: 'Staff',
        })

        // this.listRole = [{
        //   icon: "isax-building-3",
        //   title: "Dashboard",
        //   accountType: "Staff",
        //   path: "/application/leave-of-absence-request",
        //   items: []
        // }, ...this.listRole];
      }
    })
    // this.functionRole.forEach((x) => {
    //   if (x.functionID == 343) {
    //     console.log(x);
    //   }
    // });
  },
  computed: {
    filtered() {
      return this.classList.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
    },
  },
  methods: {
    // changeStatusSidebar() {
    //   this.$store.commit("changeStatusSidebar", !this.isActiveSidebar);
    // },
    // isActiveItem(currentName, item) {
    //   var temp = false;
    //   // Level 1, 2
    //   if (
    //     item.name == currentName ||
    //     item.children.filter((x) => x.name == currentName).length > 0
    //   ) {
    //     temp = true;
    //   }
    //   // Level 3
    //   if (item.children.length > 0) {
    //     item.children.forEach((element) => {
    //       if (
    //         element.children.filter((y) => y.name == currentName).length > 0
    //       ) {
    //         temp = true;
    //       }
    //     });
    //   }
    //   return temp;
    // },
    formatTitle(title) {
      switch (title) {
        case 'Center Management':
          title = 'Center information'
          break
        case 'News Management':
          title = 'News management'
          break
        case 'Feedback':
          title = 'Feedback management<br/>Download file excel'
          break
        case 'Notification Management':
          title = 'Create notifications<br/>Set up automatic notifications'
          break
        case 'Teacher Salary':
          title = 'Teacher salary<br/>Download file excel'
          break
        case 'Daily Classes':
          title = 'Class details<br/>Lesson report<br/>Attendance'
          break
        case 'Course Management':
          title = 'Course information'
          break
        case 'Class Management':
          title =
            'Class schedule - Lesson report & Attendance<br/>Class test schedule<br/>Registered students list'
          break
        case 'Account list':
          title =
            "Active/inactive account<br/>Teacher's calendar<br/>Teacher's time available<br/>Teacher's leave of absence application"
          break
        case 'Teacher calendar':
          title = 'Class detail<br/>Lesson detail<br/>Student attendance<br/>Lesson report'
          break
        case "Teacher's time available":
          title = 'Find teachers with available time'
          break
        case 'Students attendance report':
          title = 'Students by class<br/>Download file excel'
          break
        case 'Teacher changes by class':
          title = 'Teacher changes by class<br/>Download file excel'
          break
        case 'Calendar':
          title = 'Class detail<br/>Lesson detail<br/>Student Attendance<br/>Lesson report'
          break
        case 'Register Free Time':
          title = 'Register free time'
          break
        case 'Salary':
          title = 'Salary detail<br/>Download file excel'
          break
      }
      return title
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
      this.isLoading = true
      const body = {
        pLocationid: this.formatCenter(this.center),
        pStatus: this.status != 'All' ? this.status : '',
      }
      await class_managerment.getClassByLocation(querystring.stringify(body)).then(res => {
        if (res) {
          this.classList = res
        }
      })
      this.isLoading = false
    },
    filterPopUp(title) {
      this.active = true
      if (
        title === 'Feedback' &&
        this.$router.history.current.name !== 'center-management-feedback'
      ) {
        this.$refs.confirmFilter.open()
      } else if (
        (title === 'Students by class' &&
          this.$router.history.current.name !== 'statistics-student-by-class') ||
        (title === 'Students attendance report' &&
          this.$router.history.current.name !== 'statistics-student-attendance') ||
        (title === 'Teacher changes by class' &&
          this.$router.history.current.name !== 'statistics-teacher-changes-by-class')
      ) {
        this.$refs.confirmStatistics.open(title)
        this.getListCenters()
        this.getClassStatus()
      }
    },
    cancelFilter() {},
    confirmFilter() {
      this.$router.push({
        name: 'center-management-feedback',
        params: {
          fromDate: this.fromDate,
          toDate: this.toDate,
        },
      })
    },
    cancelStatistics() {},
    confirmStatistics(title) {
      this.classIds = []
      for (var i = 0; i < this.selected.length; i++) {
        if (this.classIds.indexOf(this.selected[i].classID) === -1) {
          this.classIds.push(this.selected[i].classID)
        }
      }
      localStorage.setItem('statisticCenter', this.center)
      localStorage.setItem('statisticStatus', this.status)
      localStorage.setItem('statisticClassIdList', JSON.stringify(this.classIds))
      if (title === 'Students by class') {
        this.$router.push({
          name: 'statistics-student-by-class',
          query: {
            classIds: this.classIds,
          },
        })
      } else if (title === 'Students attendance report') {
        this.$router.push({
          name: 'statistics-student-attendance',
          query: {
            classIds: this.classIds,
          },
        })
      } else if (title === 'Teacher changes by class') {
        this.$router.push({
          name: 'statistics-teacher-changes-by-class',
          query: {
            classIds: this.classIds,
          },
        })
      }
    },
    columnValueList(val) {
      return this.classList.map(d => d[val]).filter(y => y)
    },
    updateFromDate(event) {
      this.fromDate = event
    },
    updateToDate(event) {
      this.toDate = event
    },
    checkTime(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss">
.menu-title-active {
  color: #ffffff !important;
  font-weight: 600;
  cursor: pointer;
}

.menu-title {
  color: #ffffff !important;
  opacity: 0.75;
  cursor: pointer;
}

.dashboard {
  opacity: 1;
}

nav {
  &.v-navigation-drawer {
    .v-navigation-drawer__content {
      .v-icon,
      .v-list-item__icon,
      .v-list-item__title {
        color: #fff;
      }
    }

    .v-navigation-drawer__border {
      width: 2px;
      background-color: #ececf6 !important;
    }
  }
}

.v-application .v-list-group--no-action > .v-list-group__items > .v-list-item {
  padding-left: 55px !important;
}

.v-application--is-ltr .v-list-item__icon:last-of-type:not(:only-child) {
  margin-left: 0;
}
</style>
