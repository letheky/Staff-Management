<template>
  <v-dialog v-model="dialog" persistent width="600">
    <v-card>
      <v-card-title :style="{ width: '100%' }"
        ><h3 :style="{ width: '100%' }" class="text-center">
          {{ type === 'student' ? 'Buổi học bù' : 'Register make-up lesson' }}
        </h3>
      </v-card-title>

      <v-card-text>
        <v-row class="mt-3 mb-2">
          <v-col class="pt-2 pb-2" cols="12">
            <h3 :style="{ fontSize: '1.2rem', color: ' #0C2E68' }">
              {{ type === 'student' ? 'Thông tin buổi học đã nghỉ' : '' }}
            </h3></v-col
          >
          <v-col v-if="!(type === 'student')" class="pt-2 pb-2" cols="6">
            <v-row>
              <v-col cols="6"><h3 :style="{ color: ' #0C2E68' }">Student:</h3></v-col>
              <v-col cols="6"
                ><p :style="{ fontSize: '1rem', color: '#000' }">
                  {{
                    makeupInforConvert.fullname
                      ? makeupInforConvert.fullname
                      : makeupInforConvert.studentName
                  }}
                </p></v-col
              >
            </v-row>
          </v-col>

          <v-col v-if="!(type === 'student')" class="pt-2 pb-2" cols="6">
            <v-row>
              <v-col cols="6"><h3 :style="{ color: ' #0C2E68' }">Student code:</h3></v-col>
              <v-col cols="6"
                ><p :style="{ fontSize: '1rem', color: '#000' }">
                  {{ makeupInforConvert.studentCode }}
                </p></v-col
              >
            </v-row>
          </v-col>
          <v-col class="pt-2 pb-2" cols="6">
            <v-row>
              <v-col cols="6"
                ><h3 :style="{ color: ' #0C2E68' }">
                  {{ type === 'student' ? 'Lớp:' : 'Absent class:' }}
                </h3></v-col
              >
              <v-col cols="6"
                ><p :style="{ fontSize: '1rem', color: '#000' }">
                  {{
                    makeupInforConvert.classcode
                      ? makeupInforConvert.classcode
                      : makeupInforConvert.classCode
                  }}
                </p></v-col
              >
            </v-row>
          </v-col>
          <v-col class="pt-2 pb-2" cols="6"> </v-col>
          <v-col cols="6">
            <v-row>
              <v-col class="pt-2" cols="6"
                ><h3 :style="{ color: '#0C2E68' }">
                  {{ type === 'student' ? 'Ngày:' : 'Absent date:' }}
                </h3></v-col
              >
              <v-col class="pt-2" cols="6"
                ><p :style="{ fontSize: '1rem', color: '#000' }">
                  {{
                    dayjs(
                      makeupInforConvert.classDate
                        ? makeupInforConvert.classDate
                        : makeupInforConvert.fromTime
                    ).format('DD/MM/YYYY')
                  }}
                </p></v-col
              >
            </v-row>
          </v-col>
          <v-col class="pt-2 pb-2" cols="6">
            <v-row>
              <v-col class="pt-2" cols="6"
                ><h3 :style="{ color: '#0C2E68' }">
                  {{ type === 'student' ? 'Ca học:' : 'Absent shift:' }}
                </h3></v-col
              >
              <v-col class="pt-2" cols="6"
                ><p :style="{ fontSize: '1rem', color: '#000' }">
                  {{
                    makeupInforConvert.classTime
                      ? makeupInforConvert.classTime
                      : makeupInforConvert.makeUpShift
                  }}
                </p></v-col
              >
            </v-row>
          </v-col>
        </v-row>
        <v-row v-if="justView">
          <v-col class="pt-2 pb-2" cols="12">
            <h3 :style="{ fontSize: '1.2rem', color: ' #0C2E68' }">Thông tin buổi học bù</h3>
          </v-col>
          <v-col class="pt-2 pb-2" cols="6">
            <v-row>
              <v-col cols="6"><h3 :style="{ color: ' #0C2E68' }">Lớp:</h3></v-col>
              <v-col cols="6"
                ><p :style="{ fontSize: '1rem', color: '#000' }">
                  {{ makeupInforConvert.makeUpClassCode }}
                </p></v-col
              >
            </v-row>
          </v-col>
          <v-col class="pt-2 pb-2" cols="6">
            <v-row>
              <v-col cols="6"><h3 :style="{ color: ' #0C2E68' }">Khóa học:</h3></v-col>
              <v-col cols="6"
                ><p :style="{ fontSize: '1rem', color: '#000' }">
                  {{ makeupInforConvert.makeUpProgram }}
                </p></v-col
              >
            </v-row>
          </v-col>
          <v-col class="pt-2 pb-2" cols="6">
            <v-row>
              <v-col cols="6"><h3 :style="{ color: ' #0C2E68' }">Ngày:</h3></v-col>
              <v-col cols="6"
                ><p :style="{ fontSize: '1rem', color: '#000' }">
                  {{ dayjs(makeupInforConvert.makeUpDate).format('DD/MM/YYYY') }}
                </p></v-col
              >
            </v-row>
          </v-col>
          <v-col class="pt-2 pb-2" cols="6">
            <v-row>
              <v-col cols="6"><h3 :style="{ color: ' #0C2E68' }">Ca học:</h3></v-col>
              <v-col cols="6"
                ><p :style="{ fontSize: '1rem', color: '#000' }">
                  {{ makeupInforConvert.makeUpShift }}
                </p></v-col
              >
            </v-row>
          </v-col>
        </v-row>
        <v-form v-if="!justView" v-model="valid" ref="form">
          <v-autocomplete
            v-model="program"
            :items="listProgram"
            outlined
            :loading="loading"
            :disabled="loading"
            :rules="[v => !!v || 'This field is required']"
            item-value="id"
            item-text="name"
            :label="type === 'student' ? 'Chương trình' : 'Program'"
          ></v-autocomplete>
          <v-autocomplete
            v-model="makeupClass"
            :items="makeupClassList"
            outlined
            :loading="loading"
            :disabled="loading"
            :rules="[v => !!v || 'This field is required']"
            item-value="itemValue"
            item-text="combineText"
            :label="type === 'student' ? 'Buổi học bù' : 'Make-up lesson'"
          >
            <template v-slot:item="{ item }">
              <div class="d-flex align-center">
                <span><h4>Class:&nbsp;</h4></span>
                <span>{{ item.makeUpClassCode }}&nbsp; </span>
                <span><h4>Shift:&nbsp;</h4></span>
                <span>{{ item.makeUpShift }}&nbsp; </span>

                <span><h4>Date:&nbsp;</h4></span>
                <span>{{ dayjs(item.makeUpDate).format('DD/MM/YYYY') }} &nbsp;</span>
              </div>
            </template>
            <template v-slot:selection="{ item }">
              <div class="d-flex align-center">
                <span><h4>Class:&nbsp;</h4></span>
                <span>{{ item.makeUpClassCode }}&nbsp; </span>
                <span><h4>Shift:&nbsp;</h4></span>
                <span>{{ item.makeUpShift }}&nbsp; </span>

                <span><h4>Date:&nbsp;</h4></span>
                <span>{{ dayjs(item.makeUpDate).format('DD/MM/YYYY') }} &nbsp;</span>
              </div>
            </template>
          </v-autocomplete>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="mb-2"
          color="red"
          outlined
          v-if="makeupInforConvert.makeUpID && type !== 'student'"
          @click="deleteMakeup(makeupInforConvert.makeUpID)"
          >Cancel register
        </v-btn>
        <v-btn class="mb-2" color="primary" outlined @click="closeLog">
          {{ type === 'student' ? 'Hủy bỏ' : 'Cancel' }}
        </v-btn>
        <template v-if="type === 'student' && !justView">
          <v-btn class="mb-2" color="primary" @click="saveMakeupLesson"
            >{{ makeupInforConvert.makeUpID ? 'Lưu' : 'Đăng kí' }}
          </v-btn>
        </template>
        <template v-else>
          <v-btn v-if="!justView" class="mb-2" color="primary" @click="saveMakeupLesson"
            >{{ makeupInforConvert.makeUpID ? 'Save' : 'Register' }}
          </v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { makeuplesson } from '@/api/makeuplesson.js'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      program: '',
      makeupClass: '',
      listProgram: [],
      loading: false,
      makeupClassList: [],
      makeupInforConvert: [],
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
    program: function () {
      this.getListClassMakeup()
    },
  },
  methods: {
    async deleteMakeup(id) {
      console.log(id)
      await makeuplesson
        .deleteMakeup(id)
        .then(() => {
          this.$emit('callData')
          this.closeLog()
        })
        .catch(() => {})
    },
    async saveMakeupLesson() {
      this.$refs.form.validate()
      if (this.valid) {
        const dataMakeup = {
          studentID: this.makeupInforConvert.studentID,
          absentRecordID: this.makeupInforConvert.absentRecordID,
          classID: this.makeupInforConvert.classID,
          lessonNo: this.makeupInforConvert.lessonNo,
          makeUpClassID: this.makeupClass.makeUpClassID,
          makeUpLessonNo: this.makeupClass.makeUpLessonNo,
          makeUpTypeID: 1,
        }
        console.log(dataMakeup)
        if (this.makeupInforConvert.makeUpID) {
          const dataUpdate = {
            makeUpID: this.makeupInforConvert.makeUpID,
            makeUpClassID: this.makeupClass.makeUpClassID,
            makeUpLessonNo: this.makeupClass.makeUpLessonNo,
          }
          await makeuplesson.updateMakeupLesson(dataUpdate).then(res => {
            if (res) {
              this.$emit('callData')
              this.closeLog()
            }
          })
        } else {
          await makeuplesson.createMakeupLesson(dataMakeup).then(res => {
            if (res) {
              this.$emit('callData')
              this.closeLog()
            }
          })
        }
      }
    },
    async getProgramList() {
      this.loading = true
      await makeuplesson.getProgramList().then(res => {
        this.listProgram = res
        this.program = this.makeupInfor.makeUpProgramID
          ? this.makeupInfor.makeUpProgramID
          : res.length > 0
          ? this.listProgram[0].id
          : ''
        this.loading = false
      })
    },
    async getListClassMakeup() {
      this.loading = true
      await makeuplesson
        .getListMakeupClass(this.program, this.makeupInforConvert.studentID, this.makeupInforConvert.classID)
        .then(res => {
          if (this.makeupInfor.makeUpID && this.makeupInfor.makeUpProgramID === this.program) {
            res.push({
              makeUpClassID: this.makeupInfor.makeUpClassID,
              makeUpClassCode: this.makeupInfor.makeUpClassCode,
              makeUpDate: this.makeupInfor.makeUpDate.split('/').reverse().join('-'),
              makeUpShift: this.makeupInfor.makeUpShift,
              makeUpLessonNo: this.makeupInfor.makeUpLessonNo,
              programmeID: this.makeupInfor.makeUpProgramID,
              programme: this.makeupInfor.makeUpProgram,
            })
          }

          const dataFix = res.map(item => {
            return {
              ...item,
              itemValue: {
                makeUpClassID: item.makeUpClassID,
                makeUpLessonNo: item.makeUpLessonNo,
              },
              combineText:
                'Class: ' +
                item.makeUpClassCode +
                ' Shift: ' +
                item.makeUpShift +
                ' Date: ' +
                item.makeUpDate,
            }
          })
          this.makeupClassList = dataFix

          if (this.makeupInfor.makeUpID && this.makeupInfor.makeUpProgramID === this.program) {
            console.log(
              dataFix,
              (this.makeupClass = dataFix?.find(
                e =>
                  e.makeUpClassID === this.makeupInfor.makeUpClassID &&
                  this.makeupInfor.makeUpLessonNo === e.makeUpLessonNo
              ))
            )
            this.makeupClass = dataFix?.find(
              e =>
                e.makeUpClassID === this.makeupInfor.makeUpClassID &&
                this.makeupInfor.makeUpLessonNo === e.makeUpLessonNo
            ).itemValue
          } else {
            this.makeupClass = dataFix.length > 0 ? dataFix[0].itemValue : ''
          }
          this.loading = false
        })
        .catch(() => {
          this.makeupClassList = []
        })
    },
    closeLog() {
      this.$emit('setLog', {
        openDialog: false,
        makeup: this.makeupInfor,
      })
    },
  },
  created() {
    const userInfor = JSON.parse(localStorage.getItem('currentUser')).userInfo
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
    this.getProgramList()
  },
  props: ['dialog', 'makeupInfor', 'type', 'justView'],
}
</script>

<style lang="scss" scoped></style>
