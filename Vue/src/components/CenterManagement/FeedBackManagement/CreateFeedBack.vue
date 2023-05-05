<template>
  <div class="mt-4 mr-4 ml-4">
    <v-form ref="form" v-model="valid">
      <div class="d-flex justify-space-between mt-4">
        <h2 class="d-flex">
          <v-icon @click="backToFeedback()">arrow_back_ios</v-icon>
          <div class="d-flex align-center">Create feedback</div>
        </h2>
        <div>
          <v-btn :class="'mr-3'" @click="backToFeedback" outlined>Cancel</v-btn>
          <v-btn @click="sendFeedBack" color="primary"
            ><img class="mr-3" src="../../../assets/images/icon-createFeedBack.svg" alt="" />Send
            feedback</v-btn
          >
        </div>
      </div>

      <div class="feed-create">
        <v-row>
          <v-col cols="6">
            <v-select
              class="mb-4 mt-4"
              item-text="text"
              item-value="ID"
              :items="listCategory"
              v-model="category"
              outlined
              label="Feedback category"
            ></v-select
          ></v-col>
          <v-col v-if="accountTypeID === 1" cols="6"
            ><v-select
              v-model="classID"
              class="mt-4"
              item-value="classID"
              item-text="classCode"
              :items="classList"
              :rules="ruleReq"
              outlined
              label="Class code"
            ></v-select
          ></v-col>
        </v-row>

        <v-textarea
          outlined
          v-model="fbContent"
          label="Feedback content"
          :rules="ruleReq"
          placeholder="Write your feedback..."
        />
        <p v-if="accountTypeID !== 1" class="mb-4">Send feedback to students in:</p>
        <v-row v-if="accountTypeID !== 1">
          <v-col v-if="accountTypeID !== 1" cols="6">
            <v-select
              v-model="locationID"
              :items="listLocation"
              item-value="locationID"
              item-text="location"
              outlined
              label="Center"
            ></v-select
          ></v-col>
          <v-col cols="6"
            ><v-select
              v-model="classID"
              item-value="classID"
              item-text="classCode"
              :items="classList"
              :rules="ruleReq"
              outlined
              label="Class code"
            ></v-select
          ></v-col>
        </v-row>
        <v-row v-if="accountTypeID !== 1" :class="'student-select'">
          <v-col cols="6">
            <v-text-field
              outlined
              label="Students"
              :class="'input-student'"
              :rules="ruleListStudent"
              v-model="searchStudent"
              placeholder="Type code or name of students to search"
            ></v-text-field>

            <div class="list-check">
              <div class="list-check-select">
                <div class="d-flex mb-3 align-center list-check-select-text">
                  <p @click="selectAllStudent" class="mr-4">Select all</p>
                  <p @click="clearAllStudent">Clear</p>
                </div>
                <v-divider></v-divider>
              </div>

              <div class="mt-2">
                <div v-for="(student, index) in listStudentInsearch" :key="index">
                  <div
                    class="mt-2 list-check-item d-flex align-center"
                    v-if="student.userID !== null"
                  >
                    <v-icon
                      @click="changeSelectStudent(student.userID)"
                      v-if="studentSelected.includes(student.userID)"
                    >
                      mdi-close-box
                    </v-icon>
                    <v-icon @click="changeSelectStudent(student.userID)" v-else>
                      mdi-checkbox-blank-outline
                    </v-icon>

                    <p class="ml-1">{{ student.studentCode + ' - ' }}{{ student.fullName }}</p>
                  </div>
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="6">
            <div class="list-pick">
              <h4>Selected students</h4>

              <div v-for="(userID, index) in studentSelected" :key="index" class="list-pick-item">
                <p>
                  {{ getStudentById(userID).studentCode + ' - '
                  }}{{ getStudentById(userID).fullName }}
                </p>
                <img @click="unSelect(userID)" src="../../../assets/images/icon-close.svg" alt="" />
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-form>
  </div>
</template>

<script>
import { class_managerment } from '@/api/class-management'
import QueryString from 'qs'
import { statistic_management } from '@/api/statistic-management'
import { center_managerment } from '@/api/center-management'
import dayjs from 'dayjs'
export default {
  setup() {
    return {}
  },
  computed: {
    listStudentInsearch: function () {
      if (this.searchStudent === '') return this.studentList
      else {
        const dataFind = this.studentList.filter(item => {
          return item.studentCode.indexOf(this.searchStudent) !== -1
        })

        return dataFind
      }
    },
  },
  data() {
    return {
      locationID: 1,
      searchStudent: '',
      category: 'OTHER',
      listCategory:
        JSON.parse(localStorage.getItem('currentUser')).userInfo.accountTypeID === 1
          ? [
              { text: 'Khác', ID: 'OTHER' },
              { text: 'Chất lượng', ID: 'QUALITY' },
              { text: 'Nhân viên ', ID: 'STAFF' },
              { ID: 'SERVICES', text: 'Dịch vụ' },
              { ID: 'TUTOR', text: 'Trợ giảng' },
              { ID: 'TEACHER', text: 'Giáo viên ' },
            ]
          : [
              { text: 'Other', ID: 'OTHER' },
              { text: 'Quanlity', ID: 'QUALITY' },
              { text: 'Staff', ID: 'STAFF' },
              { ID: 'SERVICES', text: 'Services' },
              { ID: 'TUTOR', text: 'Tutor' },
              { ID: 'TEACHER', text: 'Teacher' },
            ],
      classList: [],
      classID: '',
      valid: false,
      accountTypeID: JSON.parse(localStorage.getItem('currentUser')).userInfo.accountTypeID,
      accountType: JSON.parse(localStorage.getItem('currentUser')).userInfo.accountType,
      userID: JSON.parse(localStorage.getItem('currentUser')).userInfo.userID,
      studentID: JSON.parse(localStorage.getItem('currentUser')).userInfo.studentID,
      teacherID: JSON.parse(localStorage.getItem('currentUser')).userInfo.teacherID,
      fullName: JSON.parse(localStorage.getItem('currentUser')).userInfo.fullName,
      studentCode: JSON.parse(localStorage.getItem('currentUser')).userInfo.userName.slice(
        0,
        JSON.parse(localStorage.getItem('currentUser')).userInfo.userName.length - 2
      ),
      ruleReq: [v => !!v || 'Name is required'],
      ruleListStudent: [() => this.studentSelected.length !== 0 || 'Name is required'],
      studentList: [],
      studentSelected: [],
      fbContent: '',
      listLocation: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
    }
  },
  created() {
    if (this.listLocation.length > 0) {
      this.locationID = this.listLocation[0].locationID
    }

    this.init()
  },
  updated() {},
  methods: {
    changeSelectStudent(userID) {
      const findStudent = this.studentSelected.find(element => element === userID)
      if (findStudent) {
        this.studentSelected = this.studentSelected.filter(e => {
          return e !== userID
        })
      } else {
        this.studentSelected = [...this.studentSelected, userID]
      }
      this.$refs.form.validate()
    },
    async sendFeedBack() {
      if (this.$refs.form.validate()) {
        const data = {
          classID: this.classID,
          fbContent: this.fbContent,
          fbType: this.checkIsImg(this.fbContent) === true ? 'IMAGE' : 'TEXT',
        }
        if (this.accountTypeID === 1) {
          const classInfor = this.classList.find(element => element.classID === this.classID)
          data.category = this.category
          data.generalName =
            classInfor.classCode +
            '-' +
            this.fullName +
            '-' +
            this.studentCode +
            '-' +
            dayjs(new Date().toISOString().split('T')[0]).format('DD/MM/YYYY')
          await center_managerment.sendFeedBackToClass(data).then(() => {})
        } else {
          data.category = this.category
          data.toUserIDs = this.studentSelected.join(',')
          await center_managerment.createFeedBackToStudent(data).then(() => {})
        }

        //}
        this.backToFeedback()
      }
    },
    async getListClassByQc() {
      const obj = {
        findKey: '',
        locationID: [this.locationID],
        fromDate: '1990-11-20T08:22:14.819Z',
        toDate: '3000-11-20T08:22:14.819Z',
      }

      await class_managerment.searchClass(obj).then(res => {
        if (res && !res.errors) {
          this.classList = res.filter(item => {
            return item.qcid === this.teacherID
          })
        }
      })
    },
    changeStudentListSelected() {
      this.$refs.form.validate()
    },
    checkIsImg(url) {
      return url.match(/\.(jpeg|jpg|svg|gif|png)$/) != null
    },
    getStudentById(id) {
      return this.studentList.find(element => element.userID === id)
    },
    backToFeedback() {
      window.history.back()
    },

    selectAllStudent() {
      this.studentSelected = this.studentList.map(item => item.userID)
      this.$refs.form.validate()
    },
    unSelect(id) {
      console.log(id)
      this.studentSelected = this.studentSelected.filter(res => id !== res)
    },
    clearAllStudent() {
      this.studentSelected = []
      this.$refs.form.validate()
    },
    addStudent(userID) {
      const finduserID = this.studentSelected.find(element => element.userID === userID)
      if (finduserID) {
        this.studentSelected = this.studentSelected.slice(
          this.studentSelected.indexOf(finduserID),
          0
        )
      } else {
        this.studentSelected.push(userID)
      }
    },
    formatTime(date) {
      if (new Date(date) !== 'Invalid Date') {
        const fbTimeArr = date.split('T')
        return (
          new Date(fbTimeArr[0]).toLocaleDateString() +
          ' , ' +
          fbTimeArr[1].split(':')[0] +
          ':' +
          fbTimeArr[1].split(':')[1]
        )
      } else {
        return ''
      }
    },
    async init() {
      //   await center_managerment.getAllCenter().then(res => {
      //     this.listLocation = res
      //   })

      const body = {
        pLocationid: this.locationID,
        pStatus: '',
      }

      if (this.accountTypeID === 1) {
        await class_managerment.getListClassStudying(this.studentID).then(res => {
          if (res) {
            this.classList = res.classes
            if (res.classes.length === 1) {
              this.classID = res.classes[0].classID
            }
            this.studentSelected = []
          }
        })
      } else {
        if (this.accountType === 'Staff' && this.fullName === 'Admin') {
          await class_managerment.getClassByLocation(QueryString.stringify(body)).then(res => {
            if (res) {
              this.classList = res
              this.studentSelected = []
            }
          })
        } else {
          this.getListClassByQc()
        }

        await statistic_management
          .getStudentList(this.classID)
          .then(res => {
            if (res.errors) {
              this.studentSelected = []
              this.studentList = []
            } else {
              this.studentSelected = []
              this.studentList = res.filter(item => item.userID != null)
            }
          })
          .catch(er => {
            if (er) {
              this.studentSelected = []
              this.studentList = []
            }
          })
      }
    },
  },
  watch: {
    locationID: function () {
      this.studentList = []
      this.studentSelected = []
      this.classID = ''
      this.init()
    },
    classID: function () {
      this.init()
    },
    studentSelected: function () {},
  },
}
</script>

<style lang="scss" scoped>
.multiple-checkbox {
}
.input-student {
  background: #fff;
}
.list-check-select {
  position: sticky;
  top: 0;
  padding-top: 1rem;
  z-index: 2;
  background: #fafafa;
}
.list-pick h4 {
  margin-top: 2.5rem;
  margin-bottom: 0.5rem;
  border-bottom: 3px solid #0c2e68;
  position: sticky;
  background: #000;
  top: 0;
  background: #f0f5ff;
}
.list-pick-item {
  display: flex;
  background: #fafafa;
  padding: 0.4rem 0.3rem;
  border-radius: 4px;
  margin-top: 5px;
  justify-content: space-between;
}
.student-select {
  background: #f0f5ff;
}
.list-check {
  padding: 1rem;
  padding-top: 0;
  background: #fafafa;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  height: 300px;
  overflow-y: scroll;
}
.list-pick {
  //   padding: 1rem;
  //   padding-top: 0;

  height: 350px;
  overflow-y: scroll;
}
.list-pick::-webkit-scrollbar {
  width: 12px;
  background-color: #f5f5f5;
}
.list-pick::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #e0e0e0;
  background-clip: padding-box;
}

.list-pick::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(255, 255, 255);
  border-radius: 10px;
  background-color: #ffffff;
}
.list-check::-webkit-scrollbar {
  width: 12px;
  background-color: #f5f5f5;
}
.list-check::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #e0e0e0;
  background-clip: padding-box;
}

.list-check::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(255, 255, 255);
  border-radius: 10px;
  background-color: #ffffff;
}
.list-check-select-text p {
  color: #246aff;
  cursor: pointer;
}
.feed-create {
  width: 70vw;
}
</style>
