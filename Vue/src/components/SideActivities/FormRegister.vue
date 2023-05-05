<template>
  <v-dialog v-model="dialog" persistent width="600">
    <v-card>
      <v-card-title :style="{ width: '100%' }"
        ><h3 :style="{ width: '100%' }" class="text-center">Side activity registration</h3>
      </v-card-title>

      <v-card-text>
        <v-form v-if="!justView" v-model="valid" ref="form">
          <template v-if="type === 'create'">
            <v-text-field
              outlined
              placeholder="Type StudentID here"
              :rules="[v => !!v || 'This field is required']"
              :label="'Student'"
              v-model="studentID"
            />
            <!-- <v-autocomplete
              v-model="locationID"
              :items="locationList"
              outlined
              :disabled="loadingLocation"
              :loading="loadingLocation"
              item-value="locationID"
              item-text="location"
              :label="'Center'"
            ></v-autocomplete> -->
            <v-autocomplete
              v-model="classID"
              :items="classList"
              outlined
              :disabled="loadingClass"
              :loading="loadingClass"
              item-value="classID"
              item-text="classCode"
              label="Class *"
            ></v-autocomplete>
            <v-autocomplete
              v-model="activityID"
              :items="activityList"
              :disabled="loadingActivity"
              :loading="loadingActivity"
              outlined
              :rules="[v => !!v || 'This field is required']"
              item-value="activityID"
              item-text="activityCode"
              label="Side activity code *"
            ></v-autocomplete>
          </template>
          <template v-else>
            <v-row class="mb-3 mt-3">
              <v-col class="pt-2 pb-2" cols="3"><h3>Student</h3></v-col>
              <v-col class="pt-2 pb-2" cols="9"
                ><h3 style="font-weight: 500; color: #000">
                  {{
                    regisInfor.studentCode &&
                    regisInfor.studentName &&
                    regisInfor.studentCode + ' - ' + regisInfor.studentName
                  }}
                </h3></v-col
              >
              <v-col class="pt-2 pb-2" cols="3"><h3>Class</h3></v-col>
              <v-col class="pt-2 pb-2" cols="9"
                ><v-autocomplete
                  v-model="editClassID"
                  :items="editClassList"
                  outlined
                  clearable
                  :disabled="loadingClass"
                  :loading="loadingClass"
                  item-value="classID"
                  item-text="classCode"
                  :label="regisInfor.classCode"
                ></v-autocomplete
              ></v-col>
              <v-col class="pt-2 pb-2" cols="3"><h3>Activity code</h3></v-col>
              <v-col class="pt-2 pb-2" cols="9"
                ><h3 style="font-weight: 500; color: #000">
                  {{ regisInfor.activityCode && regisInfor.activityCode }}
                </h3></v-col
              >
            </v-row>
          </template>
          <v-autocomplete
            v-model="regisStatus"
            :items="listRegisStatus"
            outlined
            :loading="loading"
            :disabled="loading"
            :rules="[v => !!v || 'This field is required']"
            item-value="value"
            item-text="value"
            label="Registration status *"
          >
            <template v-slot:selection="{ item }">
              <p :class="'status-select'" :style="{ background: item.color }">{{ item.value }}</p>
            </template>
          </v-autocomplete>
        </v-form>
        <p v-if="err" style="color: red">{{ err }}</p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn class="mb-2" color="primary" outlined @click="closeLog"> Cancel </v-btn>
        <template>
          <v-btn class="mb-2" color="primary" @click="saveRegister"
            >{{ regisInfor.activityRegistrationID ? 'Update' : 'Add new' }}
          </v-btn>
        </template> </v-card-actions
      ><FlashMessage></FlashMessage>
    </v-card>
  </v-dialog>
</template>

<script>
import dayjs from 'dayjs'
import { activities } from '@/api/activities'
import { center_managerment } from '@/api/center-management'
import { class_managerment } from '@/api/class-management'
export default {
  data() {
    return {
      locationList: JSON.parse(localStorage.getItem('currentUser')).locationPermissions
        ? JSON.parse(localStorage.getItem('currentUser')).locationPermissions
        : [],
      locationListAll: [],
      locationID: JSON.parse(localStorage.getItem('currentCenter')),
      valid: false,
      userID: null,
      err: '',
      errStudent: false,
      loadingClass: false,
      loadingLocation: false,
      loadingActivity: false,
      loadingStudent: false,
      studentID: [],
      // studentList: [],
      type: 'create',
      classID: '',
      classList: [],
      editClassList: [],
      activityList: [],
      editClassID: this.regisInfor.classID,
      activityID: null,
      regisStatus: 'Registered',
      listRegisStatus: [
        { color: '#27AE60', value: 'Registered' },
        { color: '#246AFF', value: 'Potential' },
        { color: ' #DC322D', value: 'No response' },
        { color: ' #DC322D', value: 'Rejected' },
        { color: '#F6B91A', value: 'Waiting' },
        { color: '#848484', value: 'Cancel' },
      ],
    }
  },

  setup() {
    return {
      dayjs: dayjs,
    }
  },
  //created() {
  //     let makeupInforCOnvert = {
  //       absentRecordID:null ,
  // classCode:"VQ1-D3-2203" ,
  // classID:5054 ,
  // hasRecording:false ,
  // hasReported:false ,
  // homework:null ,
  // location:"CEC Văn quán 1" ,
  // locationID:1 ,
  // makeUpClassCode:null ,
  // makeUpClassID:null ,
  // makeUpDate:null ,
  // makeUpID:null ,
  // makeUpLessonNo:null ,
  // makeUpProgram:null ,
  // makeUpProgramID:null ,
  //     }
  // },
  watch: {
    locationListAll: function () {
      this.getListActivity()
    },
    studentID: function () {
      console.log(this.studentID, this.studentList)
      this.getListClassStuding()
      this.getListClassEditStuding()
    },
    // locationID: function () {
    //   this.studentID = []
    //   this.getListStudent()
    // },
    program: function () {
      this.getListClassMakeup()
    },
  },
  methods: {
    // async getListStudent() {
    //   await activities
    //     .getListStudentByCenter(this.locationID)
    //     .then(res => {
    //       if (res) {
    //         this.studentList = res.map(e => {
    //           return {
    //             ...e,
    //             studentText: e.studentCode + ' - ' + e.studentName,
    //           }
    //         })
    //       }
    //     })
    //     .catch(() => {
    //       this.studentList = []
    //     })
    // },
    setFilter(objectFilterChange) {
      if (objectFilterChange.filter?.length !== 0) {
        this.errStudent = false
      } else {
        this.errStudent = true
      }
      this.studentID = objectFilterChange.filter
    },
    async getListClassStuding() {
      const stuID = this.studentID
      if (stuID.length > 4) {
        this.loadingClass = true
        await class_managerment
          .getListClassStudying(stuID)
          .then(res => {
            const result = res.classes.reduce(
              (a, c) => [
                ...a,
                {
                  classID: c.classID,
                  classCode: c.classCode,
                },
              ],
              []
            )
            this.classList = result
            this.classID = result[0].classID
            this.loadingClass = false
          })

          .catch(() => {
            this.classList = []
            this.classID = 0
            this.loadingClass = false
          })
      }
    },
    async getListClassEditStuding() {
      if (this.regisInfor) {
        const stuUserID = this.regisInfor.stuUserID
        if (stuUserID) {
          this.loadingClass = true
          await class_managerment
            .getClassRe(stuUserID)
            .then(res => {
              const result = res.reduce(
                (a, c) => [
                  ...a,
                  {
                    classID: c.classID,
                    classCode: c.classCode,
                  },
                ],
                []
              )
              this.editClassList = result
              result.forEach((e, i) => {
                if (this.editClassID === e.classID) this.editClassID = result[i].classID
              })
              this.loadingClass = false
            })

            .catch(() => {
              this.editClassList = []
              this.editClassID = 0
              this.loadingClass = false
            })
        }
      }
    },
    async getAllLotation() {
      this.loadingLocation = true

      await center_managerment
        .getAllCenter()
        .then(res => {
          this.locationListAll = res
          this.loadingLocation = false
        })
        .catch(() => {
          this.locationListAll = []
          this.loadingLocation = false
        })
    },
    async getListActivity() {
      this.loadingActivity = true
      if (this.locationListAll.length !== 0) {
        const stringSearch = this.locationListAll.map(e => e.locationID)?.join(',')
        await activities
          .getListActivitiesSearch(stringSearch)
          .then(res => {
            const dataFilter = res.filter(e => {
              return dayjs().isBefore(dayjs(e?.startDate))
            })
            this.activityList = dataFilter
            this.activityID = dataFilter.length !== 0 ? dataFilter[0].activityID : null
            this.loadingActivity = false
          })
          .catch(() => {
            // this.activityList = []
            this.activityID = 0
            this.loadingActivity = false
          })
      }
    },
    async saveRegister() {
      this.$refs.form.validate()

      if (!this.studentID || this.studentID?.length === 0) {
        this.errStudent = true
      } else {
        this.errStudent = false
      }
      if (this.valid && (!this.studentID || !this.studentID?.length !== 0)) {
        // const dataRegister = {
        //   activityID: this.activityID,
        //   studentID: this.studentID,
        //   classID: this.classID,
        //   registrationStatus: 'string',
        // }
        // await activities.createRegister(dataRegister)
        const dataRegister = {
          activityID: this.activityID,
          studentID: this.studentID,
          classID: this.classID,
          registrationStatus: this.regisStatus,
        }
        if (this.regisInfor?.activityRegistrationID) {
          const dataUpdate = {
            activityRegisterID: this.regisInfor?.activityRegistrationID,
            classID: this.editClassID,
            status: this.regisStatus,
          }
          await activities
            .updateRegister(dataUpdate)
            .then(() => {
              this.$emit('callData')
              this.closeLog()
            })
            .catch(() => {
              this.flashMessage.show({
                status: 'error',
                title: 'Error edit registered ',
                message: 'Please try again',
              })
            })
        } else {
          await activities
            .createRegister(dataRegister)
            .then(res => {
              if (res.error) {
                this.flashMessage.show({
                  status: 'error',
                  title: 'Error registered ',
                  message:
                    res.error.indexOf('Registered') !== -1 ? 'Student was registered' : res.error,
                })
              } else {
                this.$emit('callData')
                this.closeLog()
              }
            })
            .catch(() => {})
        }
      }
    },
    // async getProgramList() {
    //   this.loading = true
    //   await makeuplesson.getProgramList().then(res => {
    //     this.listProgram = res
    //     this.program = this.makeupInfor.makeUpProgramID
    //       ? this.makeupInfor.makeUpProgramID
    //       : res.length > 0
    //       ? this.listProgram[0].id
    //       : ''
    //     this.loading = false
    //   })
    // },

    closeLog() {
      this.$emit('setLog', {
        openDialog: false,
        register: this.regisInfor,
      })
    },
  },
  created() {
    if (this.regisInfor?.activityRegistrationID) {
      this.regisStatus = this.regisInfor?.registrationStatus
    }
    this.type = this.regisInfor.activityRegistrationID ? 'update' : 'create'
    const userInfor = JSON.parse(localStorage.getItem('currentUser')).userInfo
    this.getAllLotation()
    // this.getListStudent()
    if (this.type === 'student') {
      this.makeupInforConvert = {
        ...this.makeupInfor,
        ...userInfor,
        classcode: this.makeupInfor.classCode,
        classTime:
          dayjs(this.makeupInfor.fromTime).format('HH:mm') +
          '-' +
          dayjs(this.makeupInfor.toTime).format('HH:mm'),
        fullname: userInfor.fullName,
        studentCode: userInfor.userName,
      }
    } else {
      this.makeupInforConvert = this.makeupInfor
    }
    this.locationList.unshift({
      locationID: 0,
      location: 'No center',
    })
    this.getListClassStuding()
    this.getListClassEditStuding()

    this.getListActivity()
    // this.getProgramList()
  },
  props: ['dialog', 'regisInfor'],
}
</script>

<style lang="scss" scoped>
.status-select {
  color: #ffff;
  text-align: center;
  width: 100px;
  border-radius: 4px;
  padding: 5px 2px;
}
</style>
