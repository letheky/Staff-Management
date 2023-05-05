<template>
  <div>
    <h3>Total: {{ filtered.listStudent.length }} records</h3>

    <v-data-table
      v-if="!isLoading"
      :headers="logHeaders"
      :items-per-page="20000000000000000000000"
      :items="filtered.dataReturn"
      hide-default-footer
      hide-default-header
      id="attendTable"
      ref="tableMonthstu"
      :class="'elevation-0 mb-5 mt-4 table-monthstu'"
      fixed-header
      height="60vh"
      :scroll-left.camel="1000"
    >
      <template v-slot:header="{ props }">
        <thead class="v-data-table-header">
          <tr class="header-commnent">
            <th
              v-for="(header, index) in props.headers"
              :key="header.text + '' + index"
              role="columnheader"
              scope="col"
              class="text-center font-weight-light headTitle"
            >
              <span style="color: white">{{ header.text }}</span>
            </th>
          </tr>
        </thead>
        <tr class="f">
          <td
            v-for="header in props.headers"
            :key="header.value"
            :style="{
              position: 'sticky',
              top: '50px',
              background: '#ffff',
              borderBottom: '1px solid  #d1d4d4',
            }"
          >
            <div :class="'d-flex justify-center'" v-if="filters[header.value]">
              <Autocomplete
                v-if="filters.hasOwnProperty(header.value)"
                @setFilter="setFilter"
                :styleBorder="''"
                placeholder="select"
                :keyFilter="header.value"
                :selectedInit="filters[header.value]"
                :listItem="
                  !isNaN(new Date(header.value)) && type === 'evaluate'
                    ? ['Good', 'Needs support', 'Excellent', 'No Comment']
                    : !isNaN(new Date(header.value)) && type === 'guardianEvaluate'
                    ? ['Happy', 'Unhappy', 'No Comment']
                    : groupColumnValueList(header.value)
                "
              />
            </div>
            <div v-else>
              <td></td>
            </div>
          </td>
        </tr>
      </template>
      <template v-slot:body="{ items }">
        <tbody v-if="filtered.listStudent.length === 0" style="text-align: center">
          <div class="pt-3" style="position: absolute; left: 50%; transform: translate(-50%, 0)">
            No data available
          </div>
        </tbody>
        <tbody v-else>
          <tr v-for="(item, index) in filtered.listStudent" :key="index">
            <template
              v-if="itemsPerPage1 * page1 - itemsPerPage1 <= index && index < itemsPerPage1 * page1"
            >
              <td>
                <p>{{ index + 1 }}</p>
              </td>
              <td>
                <p @click="viewDetailProfile(item.stu_userID)" class="link">
                  {{ item.studentCode }}
                </p>
              </td>
              <td>
                <p @click="viewDetailProfile(item.stu_userID)" class="link">
                  {{ item.studentName }}
                </p>
              </td>
              <td>
                <p :style="{ textAlign: 'center' }">{{ item.dob }}</p>
              </td>
              <td :style="{ textAlign: 'center' }">{{ item.startDate }}</td>
              <td
                :style="{ textAlign: 'center' }"
                class="link"
                @click="viewDetailClass(item.classID)"
              >
                {{ item.classCode }}
              </td>
              <td @click="viewDetailProfile(item.qc_userID)" class="link">{{ item.qcName }}</td>
              <td @click="viewDetailProfile(item.ec_userID)" class="link">{{ item.ecName }}</td>
              <td
                v-for="(item2, index) in items"
                :key="index"
                @mouseover="
                  hoverID = item2.comments.find(
                    element => element.stu_userID === item.stu_userID
                  ).idForHover
                "
                :set="
                  (comment = item2.comments.find(
                    element =>
                      element.stu_userID === item.stu_userID && element.classID === item.classID
                  ))
                "
                @mouseleave="hoverID = ''"
              >
                <div v-if="type === 'evaluate'">
                  <div
                    @click="openCommentDetail(item2.comments, item.stu_userID, item.classID)"
                    class="d-flex justify-center"
                    :style="{ cursor: 'pointer' }"
                    v-if="comment"
                  >
                    <div class="d-flex align-center justify-center status-list">
                      <img
                        v-if="type === 'evaluate' && comment.statusSolved === 'done'"
                        src="../../../assets/images/icon-star.svg"
                        alt=""
                      />
                      <img
                        v-if="type === 'evaluate' && comment.statusSolved === 'notComment'"
                        src="../../../assets/images/icon-write.svg"
                        alt=""
                      />
                      <img
                        v-if="type === 'evaluate' && comment.statusSolved === 'solved'"
                        src="../../../assets/images/icon-done.svg"
                        alt=""
                      />
                      <img
                        v-if="type === 'evaluate' && comment.statusSolved === 'process'"
                        src="../../../assets/images/icon-pendding.svg"
                        alt=""
                      />
                      <p
                        :style="{
                          width: '130px',
                          textAlign: 'center',
                          color: comment[type] == '' && type === 'evaluateParents' && '#949494',
                        }"
                        :class="
                          comment[type] !== '' && comment[type]
                            ? comment[type] + ' ml-1 status'
                            : 'Comment ml-1 status'
                        "
                      >
                        {{
                          comment[type]
                            ? titleCase(
                                comment[type] === 'ATTENTIVE' ? 'Needs support' : comment[type]
                              )
                            : 'Comment'
                        }}
                      </p>
                    </div>
                    <img
                      :style="{
                        opacity: hoverID === comment.idForHover && comment[type] !== '' ? 1 : 0,
                      }"
                      class="ml-1"
                      src="../../../assets/images/icon-eye.svg"
                      alt=""
                    />
                  </div>
                  <div v-else>
                    <p class="notattend">-</p>
                  </div>
                </div>
                <div v-else>
                  <div
                    @click="openCommentDetail(item2.comments, item.stu_userID, item.classID)"
                    class="d-flex justify-center"
                    :style="{ cursor: 'pointer' }"
                    v-if="comment"
                  >
                    <div class="d-flex align-center justify-center status-list">
                      <div v-if="comment[type]" :class="comment[type]">
                        <p>
                          {{ titleCase(comment[type]) }}
                        </p>
                      </div>
                      <div v-else>No comment</div>
                    </div>
                    <img
                      v-if="comment[type]"
                      @click="openCommentDetail(item2.comments, item.stu_userID, item.classID)"
                      :style="{
                        opacity: hoverID === comment.idForHover && comment[type] !== '' ? 1 : 0,
                      }"
                      class="ml-1"
                      src="../../../assets/images/icon-eye.svg"
                      alt=""
                    />
                  </div>
                  <div v-else>
                    <p class="notattend">Not enrolled</p>
                  </div>
                </div>
              </td>
            </template>
          </tr>
          <!-- <tr>
                 
                  <td class="data-fixed-columns" style="text-align: left">
                    {{ item.studentCode }}
                  </td>
                  <td style="text-align: left">{{ item.fullname }}</td>
                  <td style="text-align: left">{{ item.mobilePhone }}</td>
                  <td class="attendDay">{{ item.absentDays }}</td>
                  <td class="attendDay">{{ item.attendDays }}</td>
                  <td v-for="(date, index) in item.schedules" :key="'date' + index">
                    <div v-if="date.attendanceStatus == 'Attended'" class="spanBox attendSpan">
                      <span>ATTEND</span>
                    </div>
                    <div v-else-if="date.attendanceStatus == 'Absent'" class="spanBox absentSpan">
                      <span>ABSENT</span>
                    </div>
                    <div v-else class="spanBox noSpan">
                      <span>{{ null }}</span>
                    </div>
                  </td>
                </tr> -->
        </tbody>
      </template>
    </v-data-table>
    <div :style="{ zIndex: '120' }" class="d-flex align-center justify-space-between">
      <div
        :style="{
          width: '150px',
        }"
      >
        <v-select
          outlined
          hide-details
          dense
          :value="itemsPerPage1"
          :items="[20, 50, 100, 200]"
          @change="itemsPerPage1 = parseInt($event, 10)"
          style="height: 32px"
        ></v-select>
      </div>

      <v-pagination
        v-model="page1"
        :length="
          Math.ceil(
            filtered.listStudent
              .length.toFixed() / itemsPerPage1
          )
        "
        :total-visible="7"
        elevation="0"
      ></v-pagination>
    </div>

    <div></div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import Autocomplete from '@/components/Utils/Autocomplete.vue'
export default {
  components: { Autocomplete },
  setup() {
    return {}
  },
  data() {
    return {
      dayjs: dayjs,
      hoverID: '',
      page1: 1,
      commentListConvert: [],
      itemsPerPage1: 20,
      commentListCover: [],
      stu: [],
      comL: [],
      filters: {
        studentName: [],
        studentCode: [],
        dob: [],
        startDate: [],
        classCode: [],
        qcName: [],
        ecName: [],
      },
    }
  },
  created() {
    if (localStorage.getItem(this.filtersName)) {
      this.filters = JSON.parse(localStorage.getItem(this.filtersName))
    } 

    this.init()
  },
  mounted() {
    setTimeout(() => {
      document
        .getElementsByClassName('table-monthstu')[0]
        .getElementsByTagName('table')[0]
        .scrollIntoView({
          inline: 'end',
          behavior: 'smooth',
        })
    }, 1000)
    console.log()
  },
  watch: {
    commentList: function () {
      this.init()
    },
    filters: function () {},
    // commentListConver: function (s) {
    //   this.commentListCover = s
    //   this.init()
    // },
    students: function (s) {
      this.stu = s

      this.init()
    },
  },
  computed: {
    logHeaders() {
      let headers = []
      headers.push(
        { text: 'No', value: 'no' },
        { text: 'Student code', value: 'studentCode' },
        { text: 'Student name', value: 'studentName' },
        { text: 'DOB', value: 'dob' },
        { text: 'Start date', value: 'startDate' },
        { text: 'Class code', value: 'classCode' },
        { text: 'QC', value: 'qcName' },
        { text: 'EC', value: 'ecName' }
      )
      this.students.forEach(element => {
        headers.push({
          text: dayjs(element.month).format('MM/YYYY'),
          value: [element.month + '-01'],
        })
      })
      return headers
    },
    filtered() {
      //  data comment filter

      let dataReturn = this.commentListCover.reduce((arr, commentMonth) => {
        console.log(arr)
        let comments = commentMonth.comments.filter(comment => {
          return Object.keys(this.filters).every(key => {
            if (!isNaN(new Date(key))) {
              if (key === comment.month + '-01') {
                return (
                  this.filters[key].length < 1 ||
                  (this.filters[key].includes('NO COMMENT')
                    ? !comment[this.type]
                    : this.filters[key].includes(comment[this.type]))
                )
              } else {
                let d1 = this.commentListCover.find(element => element.month + '-01' === key)

                if (d1?.comments) {
                  let d4 = d1?.comments
                    .filter(el => this.filters[key].includes(el[this.type]))
                    .map(el2 => el2[this.type])
                  let d3 = d1?.comments
                    .filter(el => this.filters[key].includes(el[this.type]))
                    .map(el2 => el2.stu_userID)
                  let d2 = d1?.comments
                    .filter(el => this.filters[key].includes(el[this.type]))
                    .map(el2 => el2.classID)
                  return (
                    this.filters[key].length < 1 ||
                    (this.type === 'evaluate' && this.filters[key].length < 4
                      ? d3.includes(comment.stu_userID) &&
                        d2.includes(comment.classID) &&
                        d4.includes(comment[this.type])
                      : d3.includes(comment.stu_userID) && d2.includes(comment.classID))
                  )
                } else {
                  return true
                }
              }
            } else {
              return this.filters[key].length < 1 || this.filters[key].includes(comment[key])
            }
          })
        })

        arr.push({
          ...commentMonth,
          comments: comments,
        })
        return arr
      }, [])
      // get list student from data comment
      let students = dataReturn.reduce((arr, item) => {
        item.comments.forEach(element => {
          if (
            !arr.find(
              comment =>
                comment.stu_userID === element.stu_userID && comment.classID === element.classID
            )
          ) {
            arr.push(element)
          }
        })
        return arr
      }, [])

      return {
        dataReturn: this.commentListCover.map(element => {
          const datafilter = element.comments.reduce((arr, comment) => {
            students.some(student => student.stu_userID === comment.stu_userID) && arr.push(comment)
            return arr
          }, [])
          return {
            ...element,
            comments: datafilter,
          }
        }),
        listStudent: students,
      }
    },
  },
  methods: {
    right() {},
    titleCase(str) {
      var splitStr = str.toLowerCase().split()
      for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
      }
      // Directly return the joined string
      return splitStr.join(' ')
    },
    viewDetailProfile(userId) {
      this.$router.push({
        name: 'account-management-view-account',
        params: {
          userId: userId,
        },
      })
    },
    resetFilter() {
      const filterAdd = []
      this.commentList.length
      this.students.forEach(element => {
        filterAdd[element.month + '-01'] = []
      })

      this.filters = {
        studentName: [],
        studentCode: [],
        dob: [],
        startDate: [],
        classCode: [],
        qcName: [],
        ecName: [],
        ...filterAdd,
      }
    },
    viewDetailClass(classID) {
      localStorage.setItem('dateOfDailyClasses', this.date)
      localStorage.removeItem('isBackFromDetailDailyClasses')
      this.$router.push({
        name: 'class-management-detail',
        query: { classID: classID },
      })
    },
    openCommentDetail(comment, userID, classID) {
      this.$emit('setLog', {
        openLog: true,
        comment: comment.find(item => item.stu_userID === userID && item.classID === classID),
      })
    },
    async init() {
      if (this.students.length >= 1) {
        let count = 0
        console.log(this.students)
        let commentList = this.students.map(element => {
          const dateList = this.commentList.find(item => item.month === element.month)
          let comments = []
          if (dateList) {
            comments = element.students.reduce((arr, item) => {
              const findItem = dateList.comments.find(comment => {
                return comment.stu_userID === item.stu_userID && comment.classID === item.classID
              })

              if (findItem) {
                arr.push({
                  ...findItem,
                  idForHover: count,
                  month: element.month,
                  qcName: findItem.qcName ? findItem.qcName : findItem.qc,
                  ecName: findItem.ecName ? findItem.ecName : findItem.ec,
                  dob: findItem.dob ? dayjs(findItem.dob).format('DD/MM/YYYY') : '',
                  startDate: findItem.startDate
                    ? dayjs(findItem.startDate).format('DD/MM/YYYY')
                    : '',
                  studentCode: findItem.studentCode ? findItem.studentCode : findItem.stuCode,
                  fullName: findItem.studentName,
                })
                count++
              } else {
                arr.push({
                  ...item,
                  idForHover: count,
                  dob: dayjs(item.dob).format('DD/MM/YYYY'),
                  startDate: dayjs(item.startDate).format('DD/MM/YYYY'),
                  month: element.month,
                })
                count++
              }
              return arr
            }, [])
          } else {
            comments = element.students.map(item => {
              count++
              return {
                ...item,
                idForHover: count,
                dob: dayjs(item.dob).format('DD/MM/YYYY'),
                startDate: dayjs(item.startDate).format('DD/MM/YYYY'),
                month: element.month,
              }
            })
          }

          return { ...element, comments: comments }
        })

        //  add status
        let dataReturn = commentList.reduce((arr, item) => {
          const comments = item.comments.map(element => {
            let statusComment = ''
            if (element.status === 'RESPONDED') {
              statusComment = 'done'
            } else if (element.status === 'PUBLIC') {
              statusComment = 'solved'
            } else if (element.status === 'DRAFT') {
              statusComment = 'process'
            } else {
              statusComment = 'notComment'
            }
            return {
              ...element,
              statusSolved: statusComment,
            }
          })
          arr.push({
            ...item,
            comments: comments,
          })
          return arr
        }, [])

        this.commentListCover = dataReturn

        let filterAdd = []
        this.commentList.length
        this.students.forEach(element => {
          filterAdd[element.month + '-01'] = []
        })

        this.filters = {
          ...this.filters,
          ...filterAdd,
        }
      }
    },

    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter.map(filter => {
          if (dayjs(objectFilterChange.name).isValid()) {
            if (filter === 'Needs support') {
              return 'ATTENTIVE'
            } else {
              return filter.toUpperCase()
            }
          } else {
            return filter
          }
        }),
      }
      localStorage.setItem(this.filtersName, JSON.stringify(this.filters))
      this.page1 = 1
    },

    groupColumnValueList(val) {
      return this.commentListCover
        .reduce((arr, element) => {
          arr.push(...element.comments)
          return arr
        }, [])
        .map(item => item[val])
    },
  },
  props: {
    filtersName: {
      type: String,
    },
    commentList: {
      type: Array,
    },
    type: {
      type: String,
    },
    students: {
      type: Array,
    },
  },
}
</script>

<style lang="scss" scoped>
.filter-action {
  cursor: pointer;
  color: #2196f3;
  text-decoration: underline;
}
.total-div {
  color: #0c2e68;
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 16px;
}

::v-deep .headTitle {
  background-color: #0b2585 !important;
  height: 30px !important;
  font-size: 14px !important;
  border: 0 !important;
  color: white !important;
}

.v-text-field {
  width: 200px;
}
tbody tr:nth-of-type(odd) {
  // background: rgb(235, 229, 229) !important;
  color: #000 !important;
}
tbody tr:nth-of-type(even) {
  // background: rgb(235, 229, 229) !important;
  background: #000 !important;
}
#attendTable {
  display: block;
  white-space: nowrap;
}
.f td:nth-of-type(1) {
  z-index: 102 !important;
  left: 0;
}
.f td:nth-of-type(2) {
  z-index: 102 !important;
  left: 40px;
}
.f td:nth-of-type(3) {
  z-index: 102 !important;
  left: 140px;
}
#attendTable th {
  padding: 16px 7px;
  text-align: center;
  font-weight: 400;
}
#attendTable td {
  border-bottom: 1px solid #d1d4d4;
}

#attendTable tbody tr:nth-of-type(even) td {
  background-color: #f3faff !important;
}
#attendTable tbody tr:nth-of-type(even):hover td {
  background-color: #dbecf8 !important;
}
#attendTable tbody tr:nth-of-type(odd):hover td {
  background-color: #d7dbdd !important;
}
#attendTable tbody tr:nth-of-type(even) td {
  background-color: #f3faff !important;
}
#attendTable tbody tr:nth-of-type(even) {
  background-color: #eeeeee !important;
}

#attendTable tbody tr td:nth-of-type(1) {
  z-index: 10;
  p {
    width: 20px;
  }
  position: sticky;
  left: 0px;
  z-index: 100;
  background: #fff;
}
#attendTable tbody tr td:nth-of-type(2) {
  z-index: 10;
  p {
    width: 70px;
  }
  position: sticky;
  left: 40px;
  z-index: 10;
  background: #fff;
}
#attendTable tr:nth-of-type(1) td {
  z-index: 100;
}
#attendTable tbody tr td:nth-of-type(3) {
  p {
    width: 170px;
  }
  position: sticky;
  left: 140px;
  z-index: 10;
  background: #fff;
}
#attendTable tr:nth-child(2) {
  left: 140px;
  z-index: 10;
  background: #fff;
}
#attendTable tbody tr td:nth-child(1) {
  width: 20px;
}
.header-commnent {
  background: #0b2585;
}
.header-commnent th:nth-child(1) {
  z-index: 101;
  span {
    width: 20px;
  }
  position: sticky;
  left: 0px;
}
.header-commnent th:nth-child(2) {
  z-index: 100;
  span {
    width: 70px;
  }
  position: sticky;
  left: 45px;
}
.header-commnent th:nth-child(3) {
  z-index: 100;
  span {
    width: 250px;
  }
  position: sticky;
  left: 140px;
}
// #attendTable th:nth-child(2),
// #attendTable td:nth-child(2) {
//   position: sticky;
//   left: 0;
// }

// #attendTable th:nth-child(3),
// #attendTable td:nth-child(3) {
//   position: sticky;
//   left: 98px;
// }

// #attendTable td:nth-child(2),
// #attendTable td:nth-child(3) {
//   background: white;
// }

// #attendTable th:nth-child(2),
// #attendTable th:nth-child(3) {
//   z-index: 3;
// }
.notattend {
  text-align: center;
  color: #ec1c24;
}
.Comment {
  color: #246aff;
}
.spanBox {
  border-radius: 7px;
  padding: 3px 10px;
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.attendSpan {
  // background-color: #27ae601a;
  color: #27ae60;
}

.absentSpan {
  // background-color: #e11c1c1a;
  color: #e11c1c;
}

.noSpan {
  // background-color: #4450511a;
}

.attendDay {
  // background: #737373;
  color: white !important;
}
.link {
  cursor: pointer;

  color: #427df2 !important;
}

.link:hover {
  text-decoration: underline;
  font-weight: 700;
}
.ATTENTIVE,
.UNHAPPY {
  padding: 4px;
  background: #fff6dd;
  color: #fa8c06 !important;
}
.link:hover {
  text-decoration: underline;
  font-weight: 700;
}
.link {
  cursor: pointer;

  color: #427df2 !important;
}
.GOOD {
  background: #def1ff;
  color: #007cd7;
}
.EXCELLENT,
.HAPPY {
  padding: 4px;

  background: #deffec;
  color: #0ab452 !important;
}
.HAPPY,
.UNHAPPY {
  width: 100px;
  text-align: center;
}

.status {
  padding: 4px 10.5px;
  border-radius: 4px;
}
.status-list img {
  width: 20px;
  height: 20px;
}
</style>
