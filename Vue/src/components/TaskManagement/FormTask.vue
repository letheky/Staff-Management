<template>
  <v-form
    :disabled="isLoading ? true : false"
    ref="entryForm"
    @submit.prevent="saveTask"
    class="create-task"
  >
    <v-row :class="'header-create-task'">
      <v-icon @click="back()">arrow_back_ios</v-icon>
      <v-col>
        <h2>
          Task Management >
          {{ Object.keys($route.params).length !== 0 ? 'Edit Task' : 'Create Task' }}
        </h2>
      </v-col>
      <v-col>
        <v-btn color="primary" depressed type="submit">Save</v-btn>
        <v-btn depressed @click="back()">Cancel</v-btn>
      </v-col>
    </v-row>
    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="primary"
      class="my-10"
    ></v-progress-linear>
    <v-row class="d-flex justify-between">
      <v-col cols="7" class="task-detail task-infor">
        <span>
          <h3>Task infor</h3>
        </span>

        <v-row :class="'justify-space-around align-center'">
          <v-col cols="1"><img src="../../assets/images/icon-task.svg" alt="" /></v-col>
          <v-col>
            <v-text-field
              v-model="taskObject.subject"
              :rules="[rules.required]"
              label="Task name"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row :class="'justify-space-around align-center'">
          <v-col cols="1"><img src="../../assets/images/icon-time.svg" alt="" /></v-col>
          <v-col cols="11" class="d-flex align-center justify-starts select-time">
            <date-picker
              :format="'D/M/Y'"
              placeholder="Pick Day"
              v-model="taskObject.startDate"
              valueType="format"
              :style="errorDate.date === true && { borderRadius: '5px', border: '1px solid red' }"
              @change="dateChange"
              :class="'pick-time'"
            ></date-picker>
            <date-picker
              :style="errorDate.time === true && { borderRadius: '5px', border: '1px solid red' }"
              type="time"
              :class="'pick-time time'"
              :format="'HH:mm:ss'"
              v-model="taskObject.startTime"
              placeholder="Select time"
              @change="dateChange"
            ></date-picker>
            <p class="text-in-pick">to</p>
            <date-picker
              :format="'D/M/Y'"
              placeholder="Pick Day"
              :style="errorDate.date === true && { borderRadius: '5px', border: '1px solid red' }"
              @change="dateChange"
              v-model="taskObject.endDate"
              valueType="format"
              :class="'pick-time'"
            ></date-picker>
            <date-picker
              :style="errorDate.time === true && { borderRadius: '5px', border: '1px solid red' }"
              type="time"
              :class="'pick-time time'"
              :format="'HH:mm:ss'"
              @change="dateChange"
              v-model="taskObject.endTime"
              placeholder="Select time"
            ></date-picker>
          </v-col>
        </v-row>
        <v-row v-if="!this.$route.params.taskID" :class="'justify-space-around align-center'">
          <v-col cols="1" class="task-repeat"
            ><img src="../../assets/images/icon-repeat.svg" alt=""
          /></v-col>
          <v-col class="task-repeat">
            <v-row>
              <v-col cols="6">
                <v-select
                  v-model="taskObject.frequencyOccurID"
                  filled
                  item-text="frequencyOccur"
                  item-value="frequencyOccurID"
                  :class="'select-repeat'"
                  :items="listRepeatType"
                  dense
                  @change="showUntilDate"
                  outlined
                >
                </v-select>
              </v-col>
              <template v-if="showUntilDay">
                <v-col cols="6">
                  <span class="mr-1 text-in-pick">Until Date</span>
                  <date-picker
                    :format="'D/M/Y'"
                    placeholder="Pick Day"
                    :style="
                      errorDate.date === true && { borderRadius: '5px', border: '1px solid red' }
                    "
                    @change="dateChange"
                    v-model="untilDate"
                    valueType="format"
                    :class="'pick-time'"
                  ></date-picker>
                </v-col>
              </template>
            </v-row>
          </v-col>
        </v-row>

        <table>
          <tr>
            <td><img :class="'mb-5'" src="../../assets/images/icon-type-events.svg" alt="" /></td>
            <td>
              <v-row>
                <v-col cols="6">
                  <v-select
                    item-text="categoryName"
                    v-model="taskObject.appointmentCategoryID"
                    item-value="appointmentCategoryID"
                    :items="listCategories"
                    filled
                    dense
                    outlined
                  >
                    <template v-slot:item="{ item }">
                      <p>
                        <span
                          :style="{
                            background: `${
                              item.colorCode[0] !== '#' ? '#' + item.colorCode : item.colorCode
                            }`,
                          }"
                          :class="`cycle `"
                        ></span
                        >{{ item.categoryName }}
                      </p>
                    </template>
                    <template v-slot:selection="{ item }">
                      <span :class="'d-flex align-center'">
                        <span
                          :style="{
                            background: `${
                              item.colorCode[0] !== '#' ? '#' + item.colorCode : item.colorCode
                            }`,
                          }"
                          :class="`cycle `"
                        ></span
                        >{{ item.categoryName }}
                      </span>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="6">
                  <div class="d-flex align-center">
                    <img
                      :style="{ marginBottom: '20px', marginRight: '5px' }"
                      src="../../assets/images/icon-location.svg"
                      alt=""
                    />
                    <v-select
                      item-text="location"
                      item-value="locationID"
                      v-model="taskObject.locationID"
                      :items="listLocation"
                      :style="{ width: '150px' }"
                      filled
                      dense
                      label="Choose Center"
                      outlined
                    >
                    </v-select>
                  </div>
                </v-col>
              </v-row>
            </td>
          </tr>

          <tr>
            <td><img src="../../assets/images/icon-clock.svg" alt="" /></td>
            <td>
              <v-row>
                <v-col cols="6">
                  <v-select
                    item-text="taskPriority"
                    item-value="taskPriorityID"
                    v-model="taskObject.taskPriorityID"
                    :items="listTypeUrgent"
                    filled
                    dense
                    outlined
                  >
                  </v-select>
                </v-col>
                <v-col cols="6">
                  <div class="d-flex align-center">
                    <img
                      :style="{ marginBottom: '20px', marginRight: '5px' }"
                      src="../../assets/images/icon-lock.svg"
                      alt=""
                    />
                    <v-select
                      item-text="visibility"
                      item-value="visibilityID"
                      v-model="taskObject.visibilityID"
                      :items="visibilityList"
                      :style="{ width: '130px', display: 'inline-block' }"
                      filled
                      dense
                      outlined
                    >
                    </v-select>
                  </div>
                </v-col>
              </v-row>
            </td>
          </tr>
          <tr>
            <td class="task-detail-texta">
              <img src="../../assets/images/icon-list-task.svg" alt="" />
            </td>
            <td>
              <v-textarea
                v-model="taskObject.description"
                outlined
                :rules="[rules.required]"
                name="input-7-4"
                label="Description"
                height="232"
              >
              </v-textarea>
            </td>
          </tr>
        </table>
      </v-col>
      <v-col cols="5" class="task-assign">
        <span>
          <h3>Assigned to</h3>
        </span>
        <Autocomplete
          @setFilter="setFilterCenter"
          :keyFilter="'none'"
          :selectedInit="selectLocation"
          :styleBorder="''"
          :listItem="listLocation.map(element => element.location)"
        />
        <Autocomplete
          v-if="!isLoading"
          @setFilter="setFilter"
          :keyFilter="'none'"
          :labelSelect="'staff'"
          :selectedInit="listStaffSelected"
          :styleBorder="''"
          :listItem="
            listSelect
              .filter(e => selectLocation.includes(e.location))
              .map(element => element.fullName)
          "
        />

        <div class="task-assign-list">
          <div
            v-for="(staffId, index) in listStaffSelected"
            :key="index"
            class="task-assign-list-item d-flex justify-space-between"
          >
            <p>
              {{ staffId }}
            </p>
            <img
              @click="removeItemAssign(staffId)"
              src="../../assets/images/icon-close.svg"
              alt=""
            />
          </div>
        </div>
      </v-col>
    </v-row>

    <div v-if="checkError" class="error">
      <v-alert
        :value="checkError"
        transition="scale-transition"
        type="error"
        style="font-size: 14px; padding: 12px"
      >
        Error enter {{ errorDate.date === true ? 'Date' : errorDate.time === true ? 'Time' : '' }}
      </v-alert>
    </div>
  </v-form>
</template>

<script>
import { center_managerment } from '@/api/center-management'
import { account_managerment } from '@/api/account-management'
import { task_management } from '@/api/task-management'
import DatePicker from 'vue2-datepicker'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'

import 'vue2-datepicker/index.css'
import Autocomplete from '@/components/Utils/Autocomplete.vue'
// import { task_management } from 'src/api/task-management'

export default {
  components: { DatePicker, Autocomplete },
  setup() {
    return {}
  },
  computed: {
    listSelect: function () {
      const listStaffFilterd = this.listStaff

      return listStaffFilterd
    },
  },
  data() {
    return {
      isSubmit: false,
      checkError: false,
      messageError: 'Ok',
      dayjs: dayjs,
      filters: [],
      rules: {
        required: value => !!value || 'Required.',
        select: arr => arr.length > 0 || 'Required',
      },
      isLoading: false,
      showUntilDay: false,
      listStaff: [],
      untilDate: dayjs(new Date()).format('DD/MM/YYYY'),
      keySearch: '',
      listStaffSelected: [],
      listTaskDayOpen: false,
      listCategories: [],
      selectTimeElementStart: null,
      selectMonthYearElementStart: '',
      selectTimeOpenStart: '',
      selectMonthYearOpenStart: '',

      selectTimeElementEnd: null,
      selectMonthYearElementEnd: '',
      selectTimeOpenEnd: '',
      selectMonthYearOpenEnd: '',
      listLocation: [],
      visibilityList: ['Private', 'Public', 'Default visibility'],
      location: '',
      listRepeatType: [
        'Does not repeat',
        'Daily',
        'Weekly',
        'Monthly',
        'Every weekday (Monday to Friday)',
      ],
      listTypeUrgent: ['Urgent', 'Not taskPriorityID'],
      errorDate: {
        date: false,
        time: false,
      },
      taskObject: {
        teacherID: 0,
        visibilityID: 1,
        allDay: true,
        percentComplete: 0,
        dueDate: '2022-10-05T14:30:24.476Z',
        frequencyOccurID: 1,
        taskPriorityID: 1,
        visibility: 'Default visibility',
        subject: '',
        lengthLocation: 0,
        description: '',

        startDate:
          new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear(),
        endDate:
          new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear(),
        startTime: new Date(),
        endTime: new Date(),
        locationID: 0,
        idUpdate: this.$route.params === {} ? this.$route.params.taskID : '',
        appointmentCategoryID: 1,
        taskCategoryID: 0,
        selectLocation: [],
        // "frequencyOccurID: 0,
        // "appointmentLayout: "string",
        //  "recurrencePattern: "string",
        // "allDay: true,
        //"percentComplete: 0,
        //"dueDate: "2022-10-13T10:10:54.094Z",
      },
      selectLocation: [],
      typePick: '',
    }
  },
  created() {
    dayjs.locale('vi')
    this.selectLocation = [
      JSON.parse(localStorage.getItem('currentUser')).locationPermissions.find(
        el => el.locationID === JSON.parse(localStorage.getItem('currentCenter'))
      ).location,
    ]

    this.listLocation = [
      JSON.parse(localStorage.getItem('currentUser')).locationPermissions.find(
        el => el.locationID === JSON.parse(localStorage.getItem('currentCenter'))
      ).location,
    ].length
    this.init()
  },
  watch: {
    listStaff: () => {},
    selectLocation: function () {},
  },
  methods: {
    showUntilDate() {
      this.dateChange()
      this.showUntilDay = this.taskObject.frequencyOccurID === 1 ? false : true
    },
    async getInforTask() {
      if (Object.keys(this.$route.params).length !== 0) {
        await task_management.appointmentByID(this.$route.params.taskID).then(res => {
          if (res.isDone) {
            this.back()
          } else {
            const endTimeArr = res.endDate.split('T')[1].split('.')[0].split(':')
            const startTimeArr = res.startDate.split('T')[1].split('.')[0].split(':')

            const startTime = new Date(res.startDate)
            const endTime = new Date(res.endDate)
            startTime.setHours(startTimeArr[0], startTimeArr[1], startTimeArr[2])
            endTime.setHours(endTimeArr[0], endTimeArr[1], endTimeArr[2])
            const dataRes = {
              ...res,
              endTime: endTime,
              startTime: startTime,

              startDate:
                new Date(res.startDate).getDate() +
                '/' +
                (new Date(res.startDate).getMonth() + 1) +
                '/' +
                new Date(res.startDate).getFullYear(),

              endDate:
                new Date(res.endDate).getDate() +
                '/' +
                (new Date(res.endDate).getMonth() + 1) +
                '/' +
                new Date(res.endDate).getFullYear(),
            }
            this.taskObject = dataRes
            this.listStaffSelected = this.listStaff
              .filter(e => res.listAssigned.map(item => item.teacherID).includes(e.teacherID))
              .map(e => e.fullName)
          }
        })
      } else {
        console.log('creaate')
      }
    },
    async setFilterCenter(objectFilterChange) {
      this.selectLocation = objectFilterChange.filter
      // if (objectFilterChange.filter.length >= 1) {
      //   if (!(objectFilterChange.filter.length < this.lengthLocation)) {
      //     this.init()
      //   } else {
      //     if (this.listLocation.length !== 0) {
      //       const locationString = this.listLocation
      //         .filter(item => this.selectLocation.includes(item.location))
      //         .map(item => item.locationID)
      //         .join()
      //       this.listStaff = []

      //       await account_managerment.getUserList(locationString).then(res => {
      //         const listUser = res.salary
      //           .filter(element => element.accountTypeID === 4 || element.accountTypeID === 5)

      //           .reduce((arr, item) => {
      //             if (arr.find(element => element.userID === item.userID) !== undefined) {
      //               arr[arr.map(el => el.userID).indexOf(item.userID)] = {
      //                 ...arr.find(element => element.userID === item.userID),

      //                 locationt: [
      //                   ...arr.find(element => element.userID === item.userID).locationt,

      //                   item.location,
      //                 ],
      //               }
      //             } else {
      //               arr.push({
      //                 ...item,
      //                 locationt: [item.location],

      //                 statusActive: item.isActive ? 'Inactive' : 'Active',
      //               })
      //             }
      //             return arr
      //           }, [])
      //         this.listStaff = listUser
      //           .filter(element => element.isActive === false)
      //           .map(item => {
      //             return {
      //               ...item,
      //               fullName: `${item.fullName} (${item.accountTypeName} , ${item.location})`,
      //             }
      //           })
      //         this.isLoading = false
      //       })
      //     }
      //   }
      // } else {
      //   this.listStaff = []
      // }
      this.lengthLocation = objectFilterChange.filter.length
    },
    setFilter(objectFilterChange) {
      this.listStaffSelected = objectFilterChange.filter
    },

    mouseUpSelect() {
      this.keySearch = ''
    },
    changeInputFilter(searchText, header) {
      this.objectSearch[header] = searchText
      // if (
      //   this.objectSearch[header] !== null ||
      //   this.objectSearch[header] !== '' ||
      //   searchText !== null
      // ) {
      //   this.filters[header] = this.listRender
      //     .filter(
      //       item =>
      //         item[header].toLowerCase().indexOf(this.objectSearch[header].toLowerCase()) !== -1
      //     )
      //     .map(d => d[header])
      //     .reduce(function (accumulator, element) {
      //       if (accumulator.indexOf(element) === -1) {
      //         accumulator.push(element)
      //       }
      //       return accumulator
      //     }, []).length
      // }
    },
    toggleWithSearch() {
      this.$nextTick(() => {
        if (
          this.listStaffSelected.length ==
          this.listStaff.filter(
            item => item.fullName.toLowerCase().indexOf(this.keySearch.toLowerCase()) !== -1
          ).length
        ) {
          this.listStaffSelected = []
          this.keySearch = ''
        } else {
          this.listStaffSelected = this.listStaff
            .filter(
              item => item.fullName.toLowerCase().indexOf(this.keySearch.toLowerCase()) !== -1
            )
            .map(item => item.teacherID)
            .slice()
        }
      })
    },
    back() {
      this.$router.push({
        name: 'task-management-calendar',
      })
    },
    groupColumnValueList() {
      // console.log(this.listStaff);
      return this.listStaff.map(item => item.fullName)
    },
    getDate(date) {
      if (typeof date === 'string') {
        return date.split('T')[0]
      } else {
        return date
      }
    },
    findNameStaff(id) {
      return this.listStaff.find(item => item.teacherID === id)
    },
    toggle() {
      this.$nextTick(() => {
        if (this.listStaffSelected.length === this.listStaff.length) {
          this.listStaffSelected = []
        } else {
          this.listStaffSelected = this.listStaff.map(item => item.teacherID)
        }
      })
    },
    removeAccents(str) {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
    },
    dateChange() {
      this.errorDate = this.checkDate()
      if (this.checkDate().date === false && this.checkDate().time === false) {
        return
      } else {
        this.checkError = true
        setTimeout(() => {
          this.checkError = false
        }, 3000)
      }
    },
    setTime() {},
    setMonthYear() {},
    async init() {
      await center_managerment.getAllCenter().then(res => {
        this.listLocation = res
      })
      if (this.listLocation.length !== 0) {
        const locationString = this.listLocation.map(item => item.locationID).join()
        this.listStaff = []
        this.isLoading = true
        await account_managerment.getUserList(locationString).then(res => {
          const listUser = res.salary
            .filter(element => element.accountTypeID === 4 || element.accountTypeID === 5)

            .reduce((arr, item) => {
              if (arr.find(element => element.userID === item.userID) !== undefined) {
                arr[arr.map(el => el.userID).indexOf(item.userID)] = {
                  ...arr.find(element => element.userID === item.userID),

                  locationt: [
                    ...arr.find(element => element.userID === item.userID).locationt,

                    item.location,
                  ],
                }
              } else {
                arr.push({
                  ...item,
                  locationt: [item.location],

                  statusActive: item.isActive ? 'Inactive' : 'Active',
                })
              }
              return arr
            }, [])
          this.listStaff = listUser
            .filter(element => element.isActive === false)
            .map(item => {
              return {
                ...item,
                fullName: `${item.fullName} (${item.accountTypeName} , ${item.location})`,
              }
            })
          setTimeout(() => {
            this.isLoading = false
          }, 1000)
        })
      }
      this.getInforTask()
      await task_management.getappointmentCatelories_List().then(res => {
        if (res) {
          this.listCategories = res
        }
      })
      await task_management.getappointmentVisibilities_List().then(res => {
        if (res) {
          this.visibilityList = res
        }
      })
      await task_management.getAppointmentFrequencyoccurs_List().then(res => {
        if (res) {
          this.listRepeatType = res
        }
      })
      await task_management.getAppointmentTaskPriorities_List().then(res => {
        if (res) {
          this.listTypeUrgent = res
        }
      })
    },

    checkDate() {
      const arrStartDate = this.taskObject.startDate.split('/')
      const arrEndDate = this.taskObject.endDate.split('/')
      const stringDateStart =
        arrStartDate[2] +
        '-' +
        this.checkNumber(arrStartDate[1]) +
        '-' +
        this.checkNumber(arrStartDate[0])

      const stringDateEnd =
        arrEndDate[2] +
        '-' +
        this.checkNumber(arrEndDate[1]) +
        '-' +
        this.checkNumber(arrEndDate[0])
      // const dateEnd = new Date(
      const stringDateStartWithTime =
        stringDateStart +
        'T' +
        this.checkNumber(this.taskObject.startTime.getHours()) +
        ':' +
        this.checkNumber(this.taskObject.startTime.getMinutes())
      const stringDateEndWithTime =
        stringDateEnd +
        'T' +
        this.checkNumber(this.taskObject.endTime.getHours()) +
        ':' +
        this.checkNumber(this.taskObject.endTime.getMinutes())
      // )

      if (!this.$route.params.taskID) {
        if (this.taskObject.frequencyOccurID === 1) {
          if (new Date(stringDateStart) > new Date(stringDateEnd)) {
            return {
              date: true,
              time: true,
            }
          } else if (
            new Date(stringDateStart).getTime() == new Date(stringDateEnd).getTime() &&
            this.checkWithDayjs()
          ) {
            if (
              new Date(stringDateStartWithTime).getTime() >
                new Date(stringDateEndWithTime).getTime() &&
              this.checkWithDayjs()
            ) {
              return {
                date: false,
                time: true,
              }
            } else {
              return {
                date: false,
                time: false,
              }
            }
          }
          return {
            date: false,
            time: false,
          }
        } else if (this.checkWithDayjs()) {
          return {
            date: false,
            time: false,
          }
        }
        return {
          date: true,
          time: false,
        }
      } else {
        if (new Date(stringDateStart) > new Date(stringDateEnd)) {
          return {
            date: true,
            time: true,
          }
        } else if (new Date(stringDateStart).getTime() == new Date(stringDateEnd).getTime()) {
          if (
            new Date(stringDateStartWithTime).getTime() > new Date(stringDateEndWithTime).getTime()
          ) {
            return {
              date: false,
              time: true,
            }
          } else {
            return {
              date: false,
              time: false,
            }
          }
        }
        return {
          date: false,
          time: false,
        }
      }
      // if(dateStart.getDate() > dateEnd.getDate() && dateStart.getMonth() >  dateEnd.getMonth() && dateStart.getFullYear() > dateEnd.getFullYear()){
      //   if (dateStart.getTime() <= dateEnd.getTime()) {
      //  this.errorDate = {
      //   date : false ,
      //   time : true
      //  }
      // } else {

      //   this.errorDate ={
      //   date : false ,
      //   time : false
      //  }
      // }
      //   }
    },

    //Convert day to month and month to day in oder to using dayjs
    getCorrectMonth(date) {
      const arr = date.split('/')
      arr.push(arr[1])
      arr.push(arr[0])
      arr.shift()
      arr.shift()
      return arr.join('/')
    },

    checkWithDayjs() {
      // const date1 = dayjs(this.taskObject.startDate).format('M/D/YYYY')
      // const date2 = dayjs(this.taskObject.endDate).format('M/D/YYYY')
      // const date3 = dayjs(this.taskObject.untilDate).format('M/D/YYYY')
      const date1 = this.getCorrectMonth(this.taskObject.startDate)
      const date2 = this.getCorrectMonth(this.taskObject.endDate)
      const date3 = this.getCorrectMonth(this.untilDate)
      switch (this.taskObject.frequencyOccurID) {
        case 2:
          return this.isSameDay(date1, date2) && this.isDayBefore(date2, date3)
        case 3:
          return this.isWeekly(date1, date2) && this.isDayBefore(date2, date3)
        case 4:
          return this.isMonthly(date1, date2) && this.isDayBefore(date2, date3)
        case 5:
        return this.isSameDay(date1, date2) && this.isDayBefore(date2, date3)
        default:
          break
      }
    },
    isDayBefore(date1, date2) {
      return dayjs(date1).isBefore(dayjs(date2))
    },
    isSameDay(date1, date2) {
      return dayjs(date1).isSame(date2, 'day')
    },
    isWeekly(date1, date2) {
      return (dayjs(date2).diff(dayjs(date1), 'day')<7 && dayjs(date2).diff(dayjs(date1), 'day')>=0) ? true : false
    },
    isMonthly(date1, date2) {
      return (dayjs(date2).diff(dayjs(date1), 'day')<28  && dayjs(date2).diff(dayjs(date1), 'day')>=0)? true : false
    },
    isWeekDay(date1, date2) {
      return (
        dayjs(date1).isSame(date2, 'week') &&
        dayjs(date1).day() > 0 &&
        dayjs(date2).day() > 0 &&
        dayjs(date1).day() < 6 &&
        dayjs(date2).day() < 6
      )
    },
    checkNumber(i) {
      if (i < 10) {
        return '0' + i
      }
      return i
    },

    saveTask() {
      this.isSubmit = true

      function returnDate(date, time) {
        function checkNumber(i) {
          if (i < 10) {
            return '0' + i
          }
          return i
        }

        const arrDate = date.split('/')
        const newDate = `${arrDate[2]}-${checkNumber(arrDate[1])}-${checkNumber(arrDate[0])}`
        if (!isNaN(new Date(time))) {
          return (
            newDate +
            'T' +
            (checkNumber(new Date(time).getHours()) +
              ':' +
              checkNumber(new Date(time).getMinutes()) +
              ':00')
          )
        } else {
          return newDate + 'T' + time
        }
      }
      if (this.$refs.entryForm.validate()) {
        const teacherID = JSON.parse(localStorage.getItem('currentUser')).userInfo.teacherID
        if (this.errorDate.time === false && this.errorDate.date === false) {
          const dataDate = {
            ...this.taskObject,
            teacherID,
            appointmentLayout: 'string',
            recurrencePattern: 'string',
            isDone: false,
            startDate: returnDate(this.taskObject.startDate, this.taskObject.startTime),
            listAssigned: this.listStaffSelected.reduce((arr, item) => {
              const dataSelect = this.listStaff.find(element => element.fullName === item)
              if (dataSelect) {
                arr.push({
                  teacherID: dataSelect.teacherID,
                  isDone: false,
                })
              }
              return arr
            }, []),
            endDate: returnDate(this.taskObject.endDate, this.taskObject.endTime),
            untilDate: dayjs(this.getCorrectMonth(this.untilDate), 'DD/MM/YYYY').add(1, 'day').toDate().toISOString(),
          }
          const dataDateUpdate = {
            ...this.taskObject,
            teacherID,
            appointmentLayout: 'string',
            recurrencePattern: 'string',
            isDone: false,
            startDate: returnDate(this.taskObject.startDate, this.taskObject.startTime),
            listAssigned: this.listStaffSelected.reduce((arr, item) => {
              const dataSelect = this.listStaff.find(element => element.fullName === item)
              if (dataSelect) {
                arr.push({
                  teacherID: dataSelect.teacherID,
                  isDone: false,
                })
              }
              return arr
            }, []),
            endDate: returnDate(this.taskObject.endDate, this.taskObject.endTime),
          }
          if (this.$route.params.taskID) this.callAPITaskPostGet(dataDateUpdate)
          else this.callAPITaskPostGet(dataDate)
        }
      } else {
        console.log('validate error')
      }
    },
    formatDate(date) {
      if (date < 10) {
        return '0' + date
      } else {
        return date
      }
    },
    async callAPITaskPostGet(dataDate) {
      if (Object.keys(this.$route.params).length !== 0) {
        await task_management
          .appointment_Update({
            ...dataDate,
            appointmentID: this.$route.params.taskID,
          })
          .then(() => {
            this.back()
          })
      } else {
        await task_management.appointment_Add(dataDate).then(() => {
          this.back()
        })
      }
    },
    removeItemAssign(id) {
      var index = this.listStaffSelected.indexOf(id)
      if (index !== -1) {
        this.listStaffSelected.splice(index, 1)
      }
    },
    getTimeNow(time) {
      const now = new Date(time)
      var current = isNaN(now)
        ? time
        : (now.getHours() < 10 ? '0' + now.getHours() : now.getHours()) +
          ':' +
          (now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes())
      return current
    },
    opendPickDate(type, e) {
      if (type === 'FROM') {
        this.selectMonthYearElementStart = e.target
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectMonthYearOpenStart = true))
        )
      } else {
        this.selectMonthYearElementEnd = e.target
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectMonthYearOpenEnd = true))
        )
      }
    },
    opendPickTime(type, e) {
      if (type === 'FROM') {
        this.selectTimeElementStart = e.target
        requestAnimationFrame(() => requestAnimationFrame(() => (this.selectTimeOpenStart = true)))
      } else {
        this.selectTimeElementEnd = e.target
        requestAnimationFrame(() => requestAnimationFrame(() => (this.selectTimeOpenEnd = true)))
      }
    },
  },
}
</script>

<style lang="scss" scoped>
// .header-create-task {
//   padding-top: 2rem;
// }

.header-create-task button {
  float: right;
  margin-left: 1rem;
}

.task-detail td {
  position: relative;
}
.task-detail table:nth-of-type(2) {
  margin-top: 0;
}
.task-detail-texta img {
  position: absolute;
  top: 0;
}
.cycle {
  width: 16px;
  display: inline-block;
  font-size: 8px;
  height: 16px;
  border-radius: 50%;
  padding: 0 5px;
  margin-right: 3px;
  margin-bottom: -1.6px;
}
.task-infor-common table {
  margin-top: 16px;
}

img {
  width: 22px;
}

.create-task {
  padding: 0 2rem;
  padding-top: 2rem;
}

.select-time button,
p {
  margin-right: 16px;
}

.task-infor-common table {
  width: 100%;
}

.task-detail table {
  //   width: 55vw;
  margin-top: 10px;
  width: 100%;
}
.pick-time {
  margin-right: 6px;
}
.pick-time.time {
  width: 100px;
}
.task-assign-list {
  height: 525px;
  overflow-y: scroll;
}
.task-assign-list-item {
  margin: 10px 0;
}
// .task-detail span {
// width: 100%;
// display: flex;
// margin-bottom: 10px;
// border-bottom: 1px solid #a8a8a8;
// }

h3 {
  border-bottom: 3px solid #0b2585;
}

.task-repeat {
  padding-top: 1rem;
}

.task-assign span,
.task-infor > span {
  width: 100%;
  display: flex;
  margin-bottom: 10px;
  border-bottom: 1px solid #a8a8a8;
}
.text-in-pick {
  margin: 0;
  margin-right: 6px;
}
table > tr > td:nth-of-type(1) {
  width: 8.7% !important;
}
table > tr > td img {
  width: 22px !important;
}
.error {
  width: 300px;
  position: absolute;
  right: 0;
  bottom: 5%;
  z-index: 999;
}
</style>
