<template>
  <div class="pl-4 pr-4" id="feelback-mess">
    <div>
      <div class="d-flex justify-space-between mt-4">
        <h2 class="d-flex">
          <v-icon @click="back()">arrow_back_ios</v-icon>
          <div class="d-flex align-center">Feedback</div>
        </h2>
        <v-btn v-show="!$route.query.generalID" @click="createFeedback" color="primary"
          ><img class="mr-3" src="../../../assets/images/icon-createFeedBack.svg" alt="" />Create
          feedback</v-btn
        >
      </div>
      <v-row :class="'mt-4'">
        <v-col
          v-show="!$route.query.generalID"
          :style="{ border: '1px solid rgb(246 240 240) ', height: '84vh' }"
          cols="3"
        >
          <v-text-field
            outlined
            dense
            v-model="keySearchFeedback"
            prepend-inner-icon="mdi-magnify"
            placeholder="Find feedback"
          ></v-text-field>
          <div>
            <div class="d-flex justify-space-between">
              <v-tabs v-model="modelTab" left>
                <v-tab class="text-normal mb-0">All </v-tab>
                <v-tab class="text-normal mb-0"> Unresolved </v-tab>
              </v-tabs>
              <v-select
                :class="'select-noneOutLine mb-1'"
                item-text="text"
                :style="{ marginTop: '2px' }"
                item-value="ID"
                :items="listCategory"
                multiple
                v-model="category"
                label="Category"
              >
                <template v-slot:prepend-item>
                  <v-list-item ripple @mousedown.prevent @click="toggle()">
                    <v-list-item-action>
                      <v-icon
                        v-if="
                          category.length ==
                          listCategory
                            .map(d => d.ID)
                            .reduce(function (accumulator, element) {
                              if (accumulator.indexOf(element) === -1) {
                                accumulator.push(element)
                              }
                              return accumulator
                            }, []).length
                        "
                      >
                        mdi-close-box
                      </v-icon>
                      <v-icon v-else> mdi-checkbox-blank-outline </v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title> Select All </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <template v-slot:selection="{ index }">
                  <span v-if="index == 0"> {{ category.length }} selected </span>
                </template>
              </v-select>
            </div>
            <v-tabs-items v-model="modelTab">
              <v-tab-item>
                <v-card :class="'list-feedback'" flat>
                  <div
                    class="mb-5"
                    v-for="feedbackByClass in dataInsearch"
                    :key="feedbackByClass.classID"
                  >
                    <div
                      :style="{ cursor: 'pointer' }"
                      @click="changeOpen(feedbackByClass.classID)"
                      class="d-flex mb-3 feedback-class-item justify-space-between"
                    >
                      <h3>
                        {{ feedbackByClass.classCode }}
                      </h3>
                      <v-icon>
                        {{
                          listOpen.includes(feedbackByClass.classID)
                            ? 'mdi-chevron-down'
                            : 'mdi-chevron-right'
                        }}
                      </v-icon>
                    </div>
                    <v-row
                      v-show="listOpen.includes(feedbackByClass.classID)"
                      :class="`${
                        feedback.generalID === generalID && 'pick'
                      } align-center feedback-student-item`"
                      @click="openFeedbackDetail(feedback)"
                      v-for="feedback in feedbackByClass.fbGenerals"
                      :key="feedback.generalID"
                    >
                      <v-col :class="'reduce-padding'" cols="10">
                        <div class="d-flex align-center">
                          <h3
                            class="limit-text"
                            :style="{ fontWeight: feedback.isReaded === true ? 500 : 800 }"
                          >
                            {{ feedback.generalName }}
                          </h3>
                          <p :class="'btn-catelory text-normal2'">{{ feedback.category }}</p>
                        </div>
                        <div class="d-flex align-center">
                          <p class="limit-text">
                            {{ feedback.lastFbContent }}
                          </p>
                          <p class="date-text">{{ feedback.lastFbTime }}</p>
                        </div>
                      </v-col>
                      <v-col cols="2">
                        <div>
                          <img
                            v-if="feedback.status === 'OPEN'"
                            src="../../../assets/images/icon-pendding.svg"
                            alt=""
                          />
                          <img v-else src="../../../assets/images/icon-done.svg" alt="" />
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card :class="'list-feedback'" flat>
                  <div
                    class="mb-5"
                    v-for="feedbackByClass in getFeedbackByUnDone(dataInsearch)"
                    :key="feedbackByClass.classID"
                  >
                    <div
                      :style="{ cursor: 'pointer' }"
                      @click="changeOpen(feedbackByClass.classID)"
                      class="d-flex mb-3 feedback-class-item justify-space-between"
                    >
                      <h3 :style="{ fontWeight: feedbackByClass.isReaded ? 600 : 800 }">
                        {{ feedbackByClass.classCode }}
                      </h3>
                      <v-icon>
                        {{
                          listOpen.includes(feedbackByClass.classID)
                            ? 'mdi-chevron-down'
                            : 'mdi-chevron-right'
                        }}
                      </v-icon>
                    </div>
                    <v-row
                      v-show="listOpen.includes(feedbackByClass.classID)"
                      :class="`${
                        feedback.generalID === generalID && 'pick'
                      } align-center feedback-student-item`"
                      @click="openFeedbackDetail(feedback)"
                      v-for="feedback in feedbackByClass.fbGenerals"
                      :key="feedback.generalID"
                    >
                      <v-col :class="'reduce-padding'" cols="10">
                        <div class="d-flex align-center">
                          <h3 class="limit-text">{{ feedback.generalName }}</h3>
                          <p :class="'btn-catelory text-normal2'">{{ feedback.category }}</p>
                        </div>
                        <div class="d-flex align-center">
                          <p class="limit-text">
                            {{ feedback.lastFbContent }}
                          </p>
                          <p class="date-text">{{ feedback.lastFbTime }}</p>
                        </div>
                      </v-col>
                      <v-col cols="2">
                        <div>
                          <img
                            v-if="feedback.status === 'OPEN'"
                            src="../../../assets/images/icon-pendding.svg"
                            alt=""
                          />
                          <img v-else src="../../../assets/images/icon-done.svg" alt="" />
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </v-col>
        <v-col
          :class="'list-feedback-text'"
          :style="{ border: '1px solid rgb(246 240 240)', height: '84vh' }"
          :cols="$route.query.generalID ? 9 : 6"
        >
          <v-form v-on:submit.prevent ref="fbcontent" v-model="valid">
            <div class="d-flex align-center text-field-feelback">
              <v-text-field
                v-model="fbContent"
                :rules="reqRules"
                outlined
                v-on:keydown.enter.prevent="sendDetailFeedBack"
                v-if="feedbackSelected.status === 'OPEN'"
                dense
                placeholder="Write a message..."
              >
              </v-text-field>

              <img
                v-if="feedbackSelected.status === 'OPEN'"
                @click="sendDetailFeedBack"
                src="../../../assets/images/icon-send.svg"
                alt=""
                srcset=""
              />
            </div>
          </v-form>
          <div class="list-text">
            <h2>{{ feedbackSelected.generalName }}</h2>
          </div>
          <div id="listMess" ref="listMess2" @scroll="scrollFeedback" class="list-mess">
            <div ref="listMess">
              <div
                v-for="feedback in fbDetailList"
                :key="feedback.detailID"
                :class="
                  feedback.senderID === userID
                    ? 'fb-belong feedback-text-item'
                    : ' fb-not-belong feedback-text-item'
                "
              >
                <p
                  v-if="feedback.fbType === 'TEXT'"
                  :style="{ visibility: feedback.fBcontent === '' ? 'hidden' : '' }"
                >
                  {{ feedback.fBcontent === '' ? 'g' : feedback.fBcontent }}
                </p>
                <img :src="feedback.fBcontent" v-else />

                <p class="text-date">
                  {{ feedback.fbTime
                  }}{{ feedback.senderID != userID ? ' by ' + feedback.senderName : '' }}
                </p>
              </div>
            </div>
          </div>
        </v-col>
        <v-col :style="{ border: '1px solid rgb(246 240 240)', height: '84vh' }" cols="3">
          <div v-if="feedbackSelected.status === 'OPEN'" class="d-flex align-center">
            <img src="../../../assets/images/icon-pendding.svg" alt="" />
            <p class="resolved-text ml-1">Unresolved</p>
          </div>
          <div v-else class="d-flex align-center">
            <img src="../../../assets/images/icon-done.svg" alt="" />
            <p class="resolved-text ml-1">Resolved</p>
          </div>
          <p v-if="accountTypeID !== -1" class="mt-4 mb-4">
            This feedback hasn't still resolved yet. If done, click “Resolved”
          </p>
          <v-btn
            v-if="accountTypeID !== 1 && feedbackSelected.status !== 'OPEN'"
            class="mb-4"
            @click="changeStatusFeedback()"
            :class="'btn-resolved'"
            outlined
            >Unresolved</v-btn
          >
          <v-btn
            v-if="accountTypeID !== 1 && feedbackSelected.status === 'OPEN'"
            class="mb-4"
            @click="changeStatusFeedback()"
            :class="'btn-resolved'"
            color="primary"
            >Resolved</v-btn
          >
          <h2 class="mb-4">Feedback information</h2>
          <v-row :class="'infor-item'">
            <v-col cols="4">Center</v-col>
            <v-col cols="8">{{ classSelectdInfor.location }}</v-col>
          </v-row>
          <v-row :class="'infor-item'">
            <v-col cols="4">Category</v-col>
            <v-col cols="8" class="text-normal2">{{ feedbackSelected.category }}</v-col>
          </v-row>
          <v-row :class="'infor-item'">
            <v-col cols="4">Class</v-col>
            <v-col cols="8">
              {{ classSelectdInfor.classCode }}
            </v-col>
          </v-row>
          <v-row :class="'infor-item'">
            <v-col cols="4">Class admin</v-col>
            <v-col cols="8">{{ classSelectdInfor.classAdmin }}</v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { center_managerment } from '@/api/center-management.js'
import { class_managerment } from '@/api/class-management.js'

//import PopupConfirm from '@/components/Utils/PopupConfirm.vue'
import dayjs from 'dayjs'
//import PopupFilter from '@/components/CenterManagement/FeedBackManagement/PopupFilter.vue'

export default {
  components: {
    // 'popup-confirm': PopupConfirm,
    // 'popup-filter': PopupFilter,
  },
  data() {
    return {
      fbContent: '',
      keySearchFeedback: '',
      modelTab: '',
      category: [],
      listOpen: [],
      fbCount: 10,
      valid: false,
      classID: '',
      classSelectdInfor: {},
      reqRules: [v => !!v || 'Feedback is required'],
      accountTypeID: JSON.parse(localStorage.getItem('currentUser')).userInfo.accountTypeID,
      userID: JSON.parse(localStorage.getItem('currentUser')).userInfo.userID,
      positionScroll: 0,
      listFeedback: [],
      fbDetailList: [],
      generalID: 0,
      feedbackSelected: {},
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
      // isLoading: false,
      // feedbackID: this.$route.params.feedBackID,
      // detailFeedBack: '',
      // error: 'error',
      // maxWidth: 1000,
      // width: 420,
      // fromDate: this.$route.params.fromDate,
      // toDate: this.$route.params.toDate,
      // functionRole: JSON.parse(localStorage.getItem('functionRole')),
      // feedbackPermission: process.env.VUE_APP_ENV_FUNCTION_FEEDBACK,
      // note: '',
      // classID: '',
      // classAdmin: '',
      // customerCareStaff: '',
    }
  },
  created() {
    const generalID = this.$route.query.generalID
    if (generalID !== undefined) {
      this.generalID = parseInt(generalID)
      this.getDetailFeedback(generalID)
      this.getGeneralDetailByID(generalID)
      this.classID = this.$route.query.classID
    } else {
      this.init()
    }

    this.scrollBottom()
    // const el = this.$refs.listMess
    //   const el2 = this.$refs.listMess2
    //   // if (el) {
    //   // Use el.scrollIntoView() to instantly scroll to the element
    //   console.log(this.$refs.listMess)
    //   el2.scrollTop = el.scrollHeight
    // }
    // setTimeout(() => {
    //   this.scrollToElement()
    // }, 200)
  },
  mounted() {
    // const el = this.$refs.listMess
    // const el2 = this.$refs.listMess2
    // if (el) {
    //   // Use el.scrollIntoView() to instantly scroll to the element
    //   console.log(this.$refs.listMess)
    //   el2.scrollTop = el.scrollHeight
    // }
  },
  updated() {
    if (localStorage.getItem('generalID')) {
      localStorage.removeItem('generalID')
      this.$forceUpdate()
    }
  },
  watch: {
    fbCount: function () {
      this.getDetailFeedback(this.feedbackSelected.generalID)
    },
    feedbackSelected: function () {
      this.getClassInfo(this.classID)
    },
    classSelectdInfor: function () {},
    category: function (c) {
      console.log(c)
    },
    classID: function () {},
  },
  computed: {
    dataInsearch: function () {
      if (this.keySearchFeedback.trim() === '') {
        let feedbackInOneArr = []
        this.listFeedback.forEach(element => {
          element.fbGenerals.forEach(item => {
            feedbackInOneArr.push({
              ...item,
              classID: element.classID,
              classCode: element.classCode,
            })
          })
        })
        feedbackInOneArr = feedbackInOneArr.filter(data => {
          if (this.category.length === 0) {
            return true
          } else {
            return this.category.some(cate => cate === data.category)
          }
        })
        return this.groupByclass(feedbackInOneArr)
      } else {
        let feedbackInOneArr = []
        this.listFeedback.forEach(element => {
          element.fbGenerals.forEach(item => {
            feedbackInOneArr.push({
              ...item,
              classID: element.classID,
              classCode: element.classCode,
            })
          })
        })
        let dataFind = feedbackInOneArr.filter(item => {
          return item.generalName.indexOf(this.keySearchFeedback) !== -1
        })
        dataFind = dataFind.filter(data => {
          if (this.category.length === 0) {
            return true
          } else {
            return this.category.some(cate => cate === data.category)
          }
        })
        if (this.modelTab === 1) {
          dataFind = dataFind.filter(re => {
            return re.status !== 'DONE'
          })
        }
        return this.groupByclass(dataFind)
      }
    },
  },

  methods: {
    // searchFeedBackByName(keySearch){

    // } ,
    getFeedbackByUnDone(listFb) {
      let feedbackInOneArr = []
      listFb.forEach(element => {
        element.fbGenerals.forEach(item => {
          feedbackInOneArr.push({
            ...item,
            classID: element.classID,
            classCode: element.classCode,
          })
        })
      })
      feedbackInOneArr = feedbackInOneArr.filter(re => {
        return re.status !== 'DONE'
      })
      return this.groupByclass(feedbackInOneArr)
    },
    async changeStatusFeedback() {
      const status = this.feedbackSelected.status === 'DONE' ? 'OPEN' : 'DONE'
      const feedbackSelected = this.feedbackSelected
      await center_managerment
        .changeStatusFeedback(status, this.feedbackSelected.generalID)
        .then(() => {
          this.feedbackSelected = { ...feedbackSelected, status: status }
          this.generalID = feedbackSelected.generalID
          this.getFeedbackByTeacherNotFirst()
        })
    },
    toggle() {
      this.$nextTick(() => {
        if (
          this.category.length ==
          this.listCategory
            .map(d => d.ID)
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, []).length
        ) {
          this.category = []
        } else {
          this.category = this.listCategory
            .map(d => d.ID)
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, [])
            .slice()
        }
      })
    },
    scrollBottom() {
      setTimeout(() => {
        document.getElementById('listMess').scrollTop =
          document.getElementById('listMess').scrollHeight
      }, 600)
    },
    scrollTop() {
      setTimeout(() => {
        document.getElementById('listMess').scrollTop = 10
      }, 600)
    },

    async getClassInfo(id) {
      await class_managerment.getClassInfo(id).then(res => {
        if (res) {
          this.classAdmin = res.classInfo.classAdmin
          this.customerCareStaff = res.classInfo.customerCareStaff
          this.classInfo = res.classInfo
          this.classSelectdInfor = res.classInfo
        }
      })
    },
    changeOpen(classID) {
      if (this.listOpen.includes(classID)) {
        this.listOpen = this.listOpen.filter(item => {
          return item !== classID
        })
      } else {
        this.listOpen.push(classID)
      }
    },
    async getGeneralDetailByID(id) {
      await center_managerment.getDetailGeneralByID(id).then(res => {
        this.feedbackSelected = res
      })
      await class_managerment.getClassInfo(this.classID).then(res => {
        if (res) {
          this.classAdmin = res.classInfo.classAdmin
          this.customerCareStaff = res.classInfo.customerCareStaff
        }
      })
    },
    openFeedbackDetail(feedback) {
      this.fbCount = 10
      this.scrollBottom()
      this.generalID = feedback.generalID
      this.feedbackSelected = feedback
      setTimeout(() => {
        this.getFeedbackByTeacherNotFirst()
      }, 500)

      this.getDetailFeedback(feedback.generalID)

      this.$refs.fbcontent.resetValidation()
    },
    scrollFeedback() {
      if (this.$refs.listMess2.scrollTop === 0) {
        this.fbCount = this.fbCount + 6
        this.scrollTop()
      }
    },

    groupByclass(data) {
      let newData = []
      data.forEach(element => {
        if (newData.find(item => element.classID === item.classID)) {
          newData = newData.map(item =>
            item.classID === element.classID
              ? {
                  ...item,
                  fbGenerals: [
                    ...item.fbGenerals,
                    {
                      ...element,
                      lastFbTime: this.formatTime(element.lastFbTime),
                    },
                  ],
                }
              : item
          )
        } else {
          newData.push({
            classID: element.classID,
            classCode: element.classCode,
            fbGenerals: [
              {
                ...element,
                lastFbTime: this.formatTime(element.lastFbTime),
              },
            ],
          })
        }
      })
      return newData
    },
    formatTime(date) {
      if (!isNaN(new Date(date.split(date.split('T')))) && date) {
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
    async getDetailFeedback(generalID) {
      await center_managerment.getFeedbackByID(generalID, this.fbCount).then(res => {
        if (this.fbCount !== 8) {
          this.scrollToElement()
        }
        this.fbDetailList = res.reverse().map(fb => {
          return {
            ...fb,
            fbTime: this.formatTime(fb.fbTime),
          }
        })
      })
    },
    async getFeedbackByTeacherNotFirst() {
      if (this.accountTypeID === 1) {
        await center_managerment.getFeedbackByStudent().then(res => {
          if (res.length !== 0) {
            const resFormat = res.map(e => {
              return {
                ...e,
                generalID: e.generalId,
                isReaded: e.newUserFBCount !== 0 ? false : true,
              }
            })

            this.listFeedback = this.groupByclass(resFormat)
          }
        })
      } else {
        await center_managerment.getFeedbackByTeacher().then(res => {
          if (res.length !== 0) {
            const dataWithIsReaded = res.map(e => {
              return {
                ...e,
                fbGenerals: e.fbGenerals.reduce((arr, item) => {
                  arr.push({
                    ...item,
                    isReaded: item.newClassFBCount !== 0 ? false : true,
                  })
                  return arr
                }, []),
              }
            })

            this.listFeedback = dataWithIsReaded
          }
        })
      }
    },
    updated() {},
    async init() {
      if (this.accountTypeID === 1) {
        await center_managerment.getFeedbackByStudent().then(res => {
          if (res.length !== 0) {
            const resFormat = res.map(e => {
              return {
                ...e,
                generalID: e.generalId,
                isReaded: e.newUserFBCount !== 0 ? false : true,
              }
            })
            this.feedbackSelected = resFormat[0]
            this.generalID = resFormat[0].generalID
            this.openFeedbackDetail(resFormat[0])
            this.getDetailFeedback(resFormat[0].generalID)
            this.listFeedback = this.groupByclass(resFormat)
            this.classID = this.groupByclass(resFormat)[0].classID

            this.getClassInfo(this.groupByclass(resFormat)[0].classID)
          }
        })
      } else {
        await center_managerment.getFeedbackByTeacher().then(res => {
          if (res.length !== 0) {
            const dataWithIsReaded = res.map(e => {
              return {
                ...e,
                fbGenerals: e.fbGenerals.reduce((arr, item) => {
                  arr.push({
                    ...item,
                    isReaded: item.newClassFBCount !== 0 ? false : true,
                  })
                  return arr
                }, []),
              }
            })
            this.feedbackSelected = dataWithIsReaded[0].fbGenerals[0]
            this.generalID = dataWithIsReaded[0].fbGenerals[0].generalID
            this.getClassInfo(dataWithIsReaded[0].classID)
            this.getDetailFeedback(dataWithIsReaded[0].fbGenerals[0].generalID)

            this.listFeedback = dataWithIsReaded
            this.openFeedbackDetail(dataWithIsReaded[0].fbGenerals[0])
            this.classID = dataWithIsReaded[0].classID
          }
        })
      }
    },
    checkIsImg(url) {
      return url.match(/\.(jpeg|jpg|svg|gif|png)$/) != null
    },
    async sendDetailFeedBack() {
      if (this.$refs.fbcontent.validate() && this.fbContent.trim().length !== 0) {
        let dataFeedBackDetail = {
          generalID: this.feedbackSelected.generalID,
          fbContent: this.fbContent,
          fbType: this.checkIsImg(this.fbContent) === true ? 'IMAGE' : 'TEXT',
        }

        this.scrollBottom()
        // if (this.accountTypeID === 1) {
        //   dataFeedBackDetail.classID  = this.feedbackSelected.classID
        //   dataFeedBackDetail.generalName  = this.feedbackSelected.classID
        //   console.log(dataFeedBackDetail , this.feedbackSelected)
        //   await center_managerment.sendFeedBackToClass(dataFeedBackDetail).then(()=>{
        //     this.fbContent = ''
        //   this.fbCount = this.fbCount + 1
        //    this.getDetailFeedback(this.feedbackSelected.generalID)
        //   this.$refs.fbcontent.resetValidation()
        //   setTimeout(() => {
        //     this.scrollToElement()
        //   }, 200)
        //   })
        // }else{
        await center_managerment.sendFeedBackDetail(dataFeedBackDetail).then(() => {
          this.fbContent = ''
          this.fbCount = this.fbCount + 1

          this.getDetailFeedback(dataFeedBackDetail.generalID)
          this.$refs.fbcontent.resetValidation()
          setTimeout(() => {
            this.scrollToElement()
          }, 200)
        })
        // }
      }
    },
    scrollToElement() {
      // const el = this.$refs.listMess
      // const el2 = this.$refs.listMess2
      // if (el) {
      //   // Use el.scrollIntoView() to instantly scroll to the element
      //   console.log(this.$refs.listMess)
      //   el2.scrollTop = 10
      // }
    },
    createFeedback() {
      this.$router.push({
        name: 'create-feedback',
      })
    },
    async getFeedback() {
      this.isLoading = true
      await center_managerment.feedBackDetail(this.feedbackID).then(res => {
        if (res) {
          this.isLoading = false
          this.detailFeedBack = res
        }
      })
      await class_managerment.getClassInfo(this.classID).then(res => {
        if (res) {
          this.classAdmin = res.classInfo.classAdmin
          this.customerCareStaff = res.classInfo.customerCareStaff
        }
      })
    },
    updateStatusFeedback() {
      const statusFeedback = this.detailFeedBack.isResolved ? 'OPEN' : 'DONE'
      let body = {
        feedbackId: this.feedbackID,
        status: statusFeedback,
        note: this.note,
      }
      center_managerment.updateStatusFeedBack(body).then(res => {
        if (res.status === 200) {
          this.getFeedback()
        }
      })
    },
    cancelDelete() {},
    cancelUpdateStatus() {},
    confirmDelete() {
      center_managerment.feedBackDelete(this.detailFeedBack.recordID).then(res => {
        if (res.status === 200) {
          this.init()
        }
      })
      this.$router.push({
        name: 'center-management-feedback',
        params: {
          fromDate: this.fromDate,
          toDate: this.toDate,
        },
      })
    },
    back() {
      window.history.back()
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped>
.btn-catelory {
  padding: 4px 10px;
  border-radius: 20px;
  margin-left: 4px;
  background: #e2f1ff;
}
.text-field-feelback {
  position: absolute;
  bottom: 0;
  margin-right: 4px;
  width: 100%;
}
.list-feedback-text {
  position: relative;

  padding: 0 !important;
}
.feedback-text-item {
  width: 50%;
}
.feedback-text-item img {
  width: 100%;
}
.feedback-text-item p {
  z-index: 1000;
}
.feedback-text-item p:nth-of-type(2) {
  position: absolute;
  bottom: -27px;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  color: #393a5c;
}
.text-normal2 {
  text-transform: lowercase;
}
.text-normal2 {
  text-transform: lowercase;
}
.text-normal2::first-letter {
  text-transform: uppercase;
}
.feedback-text-item {
  border-radius: 12px;
  padding: 1rem;
  margin-top: 2rem;
}
.fb-belong .text-date {
  text-align: right;
  width: 100%;
  padding-right: 1rem;
}
.fb-not-belong .text-date {
  text-align: left;
  width: 100%;
  margin-left: -1rem;
}
.fb-belong {
  margin-left: auto;
  background: #0d87ff;
  color: #fff;
  position: relative;
  margin-right: 1.5rem;
  z-index: 10;
}
.fb-belong::before {
  content: '';
  position: absolute;
  bottom: 0;
  width: 0;
  height: 0;
  border-bottom: 50px solid #0d87ff;
  border-right: 100px solid transparent;
  z-index: -1;
  right: -20px;
}
.fb-not-belong {
  margin-right: auto;
  background: #f4f4f4;
  margin-left: 1.5rem;
  position: relative;
  z-index: 10;
}
.fb-not-belong::before {
  content: '';
  position: absolute;
  bottom: 0;
  width: 0;
  height: 0;
  border-bottom: 50px solid #f4f4f4;
  border-left: 100px solid transparent;
  z-index: -1;
  left: -20px;
}

.feedback-student-item {
  // border: 1px solid;
  cursor: pointer;
  padding: 1rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  border-radius: 10px;
}
.list-mess {
  height: calc(100% - 10rem);
  margin-bottom: 1rem;
  // padding: 0 3rem;
  overflow-y: scroll;
  scroll-behavior: smooth;
  position: relative;
}
.list-text h2 {
  padding: 2rem 0;
  width: 100%;
  text-align: center;
  box-shadow: 0px 2px 8px #e5e5e5;
}
.pick {
  background: #e0ecff;
}
.title-infor {
  width: 100%;
}
.resolved-text {
  padding: 0.2rem 0.4rem;
  background: #dbffee;
  border-radius: 4px;
  color: #009b4a;
}
.btn-resolved {
  width: 100%;
  margin: 0.4rem 0;
}
.infor-item {
  border-bottom: 1px dotted rgb(211, 211, 211);
}
.infor-item > div:nth-child(1) {
  font-weight: 900;
}
.limit-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 150px;
}
.date-text {
  margin-right: 3px;
  color: #9e9898;
}
.list-feedback {
  max-height: 65vh;
  overflow-y: scroll;
}
.list-feedback::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
}

.list-mess::-webkit-scrollbar {
  display: none;
}
.list-feedback::-webkit-scrollbar {
  display: none;
}
.list-feedback::-webkit-scrollbar-thumb {
  background-color: #756e6e;
}
.reduce-padding {
  padding: 0px;
}
#lesson-management {
  .list-info {
    position: relative;
    .item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed #dadbe6;
      padding: 11px 0;
    }
    .border-vertical {
      position: absolute;
      bottom: 24px;
      right: 0;
      width: 1px;
      height: 100%;
      background: url(~@/assets/images/line-vertical.png) no-repeat bottom center;
    }
  }
  .feedback-class-item {
    margin: 1rem;
  }
  .slot-infor {
    max-width: 500px;
    .item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed #dadbe6;
      padding: 11px 0;
    }
  }
  .imageVector {
    width: 19px;
    height: 18px;
  }
}
.select-noneOutLine {
  z-index: 10000;
  border: none !important;
  width: 100px;
}
.text-normal {
  margin-top: 16px;
  text-transform: initial;
}
</style>
