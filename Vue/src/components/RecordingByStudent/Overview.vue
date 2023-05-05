<template>
  <div class="pt-5 pl-10 pr-10">
    <h2>Recording</h2>
    <v-row>
      <v-col :class="'list-record'" cols="4">
        <div></div>
        <div v-for="classStudy in classList" :key="classStudy.classID">
          <div>
            <div
              @click="toggleClass(classStudy.classID)"
              :class="'record-class d-flex justify-space-between aign-center mt-3'"
            >
              <div :class="' icon-record d-flex justify-start aign-center'">
                <img class="mr-3" src="../../assets/images/icon-record.svg" alt="" />
                <div>
                  <h3>{{ classStudy.programme }}</h3>
                  <p>{{ classStudy.classCode }}</p>
                </div>
              </div>
              <v-icon large
                >{{
                  listOpen.includes(classStudy.classID) ? 'mdi-chevron-down' : 'mdi-chevron-right'
                }}
              </v-icon>
            </div>

            <div v-if="listOpen.includes(classStudy.classID)" :class="'list-catogory'">
              <v-progress-linear indeterminate v-if="loading" color="primary"></v-progress-linear>
              <div v-else>
                <div v-if="listRecord.length > 1">
                  <div
                    @click="openRecordDetail(record)"
                    v-for="record in listRecord"
                    :key="record.recordID"
                    class="mt-2 record-class-item d-flex align-center justify-space-between"
                  >
                    <div class="d-flex align-center">
                      <div class="d-flex align-center">
                        <h4>{{ record.recordCategory }}</h4>
                        - {{ formatDate(record.recordDate) }}
                      </div>
                      <div>
                        <span
                          v-if="checkRecordingStatus(record) === 'commented'"
                          class="ml-2 catogory"
                          >Commented</span
                        >
                        <span
                          :style="{ color: '#636363', background: '#E8E8E8' }"
                          v-if="checkRecordingStatus(record) === 'inComing'"
                          class="ml-2 catogory"
                          >In Coming</span
                        >
                        <span
                          :style="{ color: '#EC1C24', background: '#FFE7E8' }"
                          v-if="checkRecordingStatus(record) === 'warning'"
                          class="ml-2 catogory"
                          >Warning</span
                        >
                        <span
                          :style="{ color: '#FF8A00', background: '#FFF3D5' }"
                          v-if="checkRecordingStatus(record) === 'inProcess'"
                          class="ml-2 catogory"
                          >In Progress</span
                        >
                        <span
                          :style="{ color: '#28C76F', background: '#E5F8EE' }"
                          v-if="checkRecordingStatus(record) === 'summitted'"
                          class="ml-2 catogory"
                          >Submitted</span
                        >
                      </div>
                    </div>

                    <h4 v-if="record.total != 0">{{ record.total }}</h4>
                  </div>
                </div>

                <div v-else>
                  <p
                    :style="{
                      color: '#616161',
                    }"
                  >
                    No recording found!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="8">
        <v-form ref="form" v-model="valid" lazy-validation>
          <div v-if="Object.keys(recordSelect).length !== 0">
            <h1 class="d-flex align-center">
              <p>{{ recordSelect.recordCategory }}</p>
              <span v-if="checkRecordingStatus(recordSelect) === 'commented'" class="ml-2 catogory"
                >Commented</span
              >
              <span
                :style="{ color: '#636363', background: '#E8E8E8' }"
                v-if="checkRecordingStatus(recordSelect) === 'inComing'"
                class="ml-2 catogory"
                >In Coming</span
              >
              <span
                :style="{ color: '#EC1C24', background: '#FFE7E8' }"
                v-if="checkRecordingStatus(recordSelect) === 'warning'"
                class="ml-2 catogory"
                >Warning</span
              >
              <span
                :style="{ color: '#FF8A00', background: '#FFF3D5' }"
                v-if="checkRecordingStatus(recordSelect) === 'inProcess'"
                class="ml-2 catogory"
                >In Progress</span
              >
              <span
                :style="{ color: '#28C76F', background: '#E5F8EE' }"
                v-if="checkRecordingStatus(recordSelect) === 'summitted'"
                class="ml-2 catogory"
                >Submitted</span
              >
            </h1>
            <div class="d-flex align-center mt-4 mb-4">
              <div class="d-flex align-center mr-5">
                <img class="mr-2" src="../../assets/images/icon-calendar.svg" alt="" />
                <h4 class="mr-3">Assignment date:</h4>
                <p>{{ formatDate(recordSelect.recordDate) }}</p>
              </div>
              <div class="d-flex align-center">
                <img class="mr-2" src="../../assets/images/icon-calendar.svg" alt="" />
                <h4 class="mr-3">Deadline:</h4>
                <p>{{ formatDate(recordSelect.deadline) }}</p>
              </div>
              <div></div>
            </div>
            <div class="record-content">
              <div
                @click="openRecordContent"
                class="record-content d-flex justify-space-between mr-2"
              >
                <h3>Recording content</h3>
                <v-icon>
                  {{ isOpenRecordContent ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                </v-icon>
              </div>
              <div class="ml-4 mr-4" v-if="isOpenRecordContent">
                <div v-for="(item, index) in recordSelect.listContent" :key="index">
                  <div v-if="item.includes('https://')">
                    <span>{{ item.split('https://')[0] }}</span
                    ><a :href="'https://' + item.split('https://')[1]" :target="'_blank'">{{
                      item.replace(item.split('https://')[0], '')
                    }}</a>
                  </div>
                  <div v-else>
                    <span>{{ item }}</span>
                  </div>
                </div>
              </div>
              <div v-if="isOpenRecordContent" class="mt-2 ml-2">
                <div class="d-flex align-space-between">
                  <div class="d-flex align-center">
                    <h4>Your recording</h4>
                    <div v-if="isOpenRecordContent" class="d-flex align-center mr-4">
                      <div
                        class="d-flex align-center text-record-sub"
                        v-if="recordSelect.validate.isSubmit === true"
                      >
                        <img width="15" :src="iconDone" alt="" />
                        <p>
                          Your recording was submitted on
                          {{ formatTime(recordSelect.studentSubmitDate) }}
                        </p>
                      </div>
                      <div class="d-flex align-center text-record-sub" v-else>
                        <img :src="iconWarn" alt="" />
                        <p>Submit your recording right now</p>
                      </div>
                    </div>
                  </div>
                  <v-menu
                    v-model="showMenu"
                    :close-on-content-click="false"
                    v-if="checkRecordingStatus(recordSelect) === 'summitted'"
                    absolute
                    offset-y
                    style="width: 500px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn :class="'ml-auto mr-4'" v-bind="attrs" v-on="on" outlined>
                        Edit my recording
                      </v-btn>
                    </template>

                    <v-list>
                      <v-list-item>
                        <v-list-item-title>
                          <v-row>
                            <v-col>
                              <v-text-field
                                :class="'mt-2'"
                                label="Enter link to record"
                                outlined
                                style="width: 500px"
                                :rules="req"
                                v-model="link"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <div>
                            <div :style="{ width: 'fit-content', marginLeft: 'auto' }">
                              <v-btn @click="updateLink" color="primary">Submit</v-btn>
                            </div>
                          </div>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
                <div v-if="isOpenRecordContent" class="btn-edit-record">
                  <div
                    v-if="
                      checkRecordingStatus(recordSelect) === 'inComing' ||
                      checkRecordingStatus(recordSelect) === 'warning' ||
                      checkRecordingStatus(recordSelect) === 'inProcess'
                    "
                  >
                    <v-row class="mt-1 d-flex align-center">
                      <v-col cols="3">
                        <v-text-field
                          label="Enter title of recording link"
                          outlined
                          :rules="req"
                          v-model="rootLinkTitle"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="8">
                        <v-text-field
                          label="Enter link to record"
                          outlined
                          :rules="req"
                          v-model="rootLink"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="1">
                        <v-icon
                          :style="{ marginTop: '-10px' }"
                          color="blue darken-2"
                          large
                          @click="addNewLink"
                          >mdi-plus-circle-outline</v-icon
                        >
                      </v-col>
                    </v-row>
                    <template v-if="listUrl.length > 0">
                      <div v-for="(url, index) in listUrl" :key="index">
                        <v-row class="mt-1 d-flex align-center">
                          <v-col cols="3">
                            <v-text-field
                              label="Enter title of recording link"
                              outlined
                              :rules="req"
                              v-model="titleList[index]"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="8">
                            <v-text-field
                              label="Enter link to record"
                              outlined
                              :rules="req"
                              v-model="linkList[index]"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="1">
                            <v-icon
                              :style="{ marginTop: '-10px' }"
                              color="red light-2"
                              large
                              @click="removeLink(index)"
                              >mdi-trash-can-outline</v-icon
                            >
                          </v-col>
                        </v-row>
                      </div>
                    </template>
                    <v-row>
                      <v-col cols="10"></v-col>
                      <v-col cols="2">
                        <v-btn @click="updateLink" large color="primary" min-width="100%">Submit</v-btn>
                      </v-col>
                    </v-row>
                  </div>
                </div>
              </div>

              <iframe
                v-if="recordSelect.validate.isSubmit === true && isOpenRecordContent"
                class="record-video mt-4"
                :src="urlChange(recordSelect.url)"
                allowfullscreen
              ></iframe>
            </div>

            <div class="mt-3">
              <div
                @click="isOpenComment = !isOpenComment"
                v-if="recordSelect.validate.isDone === true"
                class="d-flex record-comment-title justify-space-between"
              >
                <h3>Comment & Score</h3>
                <v-icon>
                  {{ isOpenComment ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                </v-icon>
              </div>
              <v-row v-if="isOpenComment">
                <v-col
                  v-if="recordSelect.validate.isDone === true"
                  :class="'mt-2 comment-item'"
                  cols="6"
                >
                  <h3 :class="'title-comment'">General comment</h3>
                  <div v-html="recordSelect.generalComment"></div>
                </v-col>
                <v-col
                  v-if="recordSelect.validate.isDone === true"
                  :class="'mt-2 comment-item'"
                  cols="6"
                >
                  <h3 :class="'title-comment'">Pronunciation</h3>
                  <h4>Score : {{ recordSelect.scorePronunciation }}</h4>
                  <div v-html="recordSelect.pronunciation"></div>
                </v-col>
                <v-col
                  v-if="recordSelect.validate.isDone === true"
                  :class="'mt-2 comment-item'"
                  cols="6"
                >
                  <h3 :class="'title-comment'">Fluency in Speaking</h3>
                  <h4>Score :{{ recordSelect.scoreFluencyInSpeaking }}</h4>
                  <div v-html="recordSelect.fluencyInSpeaking"></div>
                </v-col>
                <v-col
                  v-if="recordSelect.validate.isDone === true"
                  :class="'mt-2 comment-item'"
                  cols="6"
                >
                  <h3 :class="'title-comment'">Vocabulary & Grammar</h3>
                  <h4>Score : {{ recordSelect.scoreVocabularyAndGrammar }}</h4>
                  <div v-html="recordSelect.vocabularyAndGrammar"></div>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { class_managerment } from '@/api/class-management.js'
import iconDone from '../../assets/images/icon-done.svg'
import iconWarn from '../../assets/images/icon-warning.svg'
import dayjs from 'dayjs'
export default {
  setup() {},
  data() {
    return {
      classList: [],
      showMenu: false,
      iconDone: iconDone,
      iconWarn: iconWarn,
      isOpenRecordContent: true,
      listOpen: [],
      listUrl: [],
      rootLink:'',
      rootLinkTitle:'',
      listItem: [],
      linkList: [],
      titleList: [],
      valid: false,
      loading: false,
      isOpenComment: true,
      req: [
        v => !!v || 'Link is required',
        v => v?.indexOf('http') !== -1 || 'Must be link',
        v =>
          v?.indexOf('youtube.com') !== -1 ||
          v?.indexOf('youtu.be') !== -1 ||
          v?.indexOf('drive.google.com') !== -1 ||
          v?.indexOf('canva') !== -1 ||
          "Must be youtube's link, driver's link or canva's link",
      ],
      recordSelect: {},
      classID: '',
      isUpdate: false,
      listHideDetail: {
        isSubmit: false,
        isComming: false,
        isDone: false,
        isComment: false,
      },
      listRecord: [],
      studentID: JSON.parse(localStorage.getItem('currentUser')).userInfo.studentID,

      studentInfor: JSON.parse(localStorage.getItem('currentUser')).userInfo,
    }
  },
  created() {
    this.getClassList()
  },
  watch: {
    recordSelect: function () {},
    listRecord: function () {},
  },
  methods: {
    openRecordContent() {
      if (this.isOpenRecordContent) {
        this.isOpenRecordContent = false
        this.showMenu = false
      } else {
        this.isOpenRecordContent = true
      }
    },
    addNewLink() {
      const data = {
      }
      this.listUrl.push(data)
      console.log(this.listUrl)
    },
    removeLink(index) {
      this.listUrl.splice(index, 1)
    },
    changeAddedTitle(){
      console.log(this.listUrl) 
    },
    changeAddedLink(){
      console.log(this.listUrl)
    },
    formatTime(date) {
      if (new Date(date) !== 'Invalid Date') {
        const fbTimeArr = date.split('T')
        return (
          fbTimeArr[1].split(':')[0] +
          ':' +
          fbTimeArr[1].split(':')[1] +
          ' ' +
          dayjs(date).format('DD/MM/YYYY')
        )
      } else {
        return ''
      }
    },
    checkRecordingStatus(record) {
      const date1 = new Date()

      const date2 = new Date(record.recordDate.split('T'))
      const deadline = new Date(date2.getTime() + 86400000 * 14)
      // const diffTime = Math.abs(date2 - date1)

      //      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (
        !this.isNull(record.fluencyInSpeaking) ||
        !this.isNull(record.pronunciation) ||
        !this.isNull(record.generalComment) ||
        !this.isNull(record.vocabularyAndGrammar) ||
        !this.isNullNumber(record.scoreFluencyInSpeaking) ||
        !this.isNullNumber(record.scoreGeneralComment) ||
        !this.isNullNumber(record.scorePronunciation) ||
        !this.isNullNumber(record.scorePronunciation)
      ) {
        return 'commented'
      } else if (record.url) {
        return 'summitted'
      } else if (date1 >= date2 && date1 <= deadline) {
        return 'inProcess'
      } else if (date1 > deadline) {
        return 'warning'
      } else {
        return 'inComing'
      }
    },
    async updateLink() {
      if (this.$refs.form.validate()) {
        const newRecord = {
          ...this.recordSelect,
          url: this.link,
        }

        if (newRecord.recordID) {
          this.isUpdate = false
          await class_managerment.updateRecordComment(newRecord, newRecord.recordID).then(() => {
            this.$forceUpdate()
            this.getListRecording(this.classID)
            this.showMenu = false
            this.recordSelect = {
              ...this.recordSelect,
              url: this.urlChange(this.link),
              validate: this.validateRecord(newRecord),
            }
          })
        } else {
          this.isUpdate = true
          const dataPost = {
            studentID: newRecord.studentID,

            classID: newRecord.classID,

            url: newRecord.url,
            recordCategoryID: newRecord.recordCategoryID,
          }
          await class_managerment.createRecord(dataPost).then(() => {
            this.getListRecording(this.classID)
            this.showMenu = false

            this.recordSelect = {
              ...this.listRecord.find(record => {
                return record.recordCategoryID === this.recordSelect.recordCategoryID
              }),
              url: this.urlChange(this.link),
              validate: {
                isWarning: false,
                isSubmit: true,
                isComming: false,
                isDone: false,
                isComment: false,
              },
              studentSubmitDate: new Date().toISOString(),
            }

            this.$forceUpdate()
          })
        }
      }
      
    },
    validateRecord(record) {
      let listHideDetail = {
        isWarning: false,
        isSubmit: false,
        isComming: false,
        isDone: false,
        isComment: false,
      }
      if (record === null) return listHideDetail
      if (record.url.trim() === '') {
        listHideDetail = {
          ...listHideDetail,
          isSubmit: false,
        }
      } else {
        listHideDetail = {
          ...listHideDetail,
          isSubmit: true,
        }
      }

      if (new Date().getTime() < new Date(record.recordDate.split('T')[0]).getTime()) {
        listHideDetail = {
          ...listHideDetail,
          isComming: true,
        }
      }
      if (
        new Date().getTime() > new Date(record.deadline.split('T')[0]).getTime() &&
        record.url.trim() === ''
      ) {
        listHideDetail = {
          ...listHideDetail,
          isWarning: true,
        }
      } else {
        listHideDetail = {
          ...listHideDetail,
          isWarning: false,
        }
      }

      if (
        this.isNull(record.fluencyInSpeaking) &&
        this.isNull(record.pronunciation) &&
        this.isNull(record.generalComment) &&
        this.isNull(record.vocabularyAndGrammar) &&
        this.isNullNumber(record.scoreFluencyInSpeaking) &&
        this.isNullNumber(record.scoreGeneralComment) &&
        this.isNullNumber(record.scorePronunciation) &&
        this.isNullNumber(record.scorePronunciation)
      ) {
        listHideDetail = {
          ...listHideDetail,
          isDone: false,
        }
      } else {
        listHideDetail = {
          ...listHideDetail,
          isDone: true,
        }
      }
      return listHideDetail
    },
    isNull(str) {
      return str === null || str.trim() === ''
    },
    isNullNumber(str) {
      return str === null || str === 0
    },
    urlChange(url) {
      let url2 = url
      if (url2.indexOf('/drive.google.com/file') !== -1) {
        const listLinkArr = url2.split('/')
        listLinkArr.pop()
        url2 = listLinkArr.join('/') + '/preview'
      }
      if (url2.indexOf('youtu') !== -1) {
        if (url2.indexOf('embed') === -1) {
          url2 = 'https://www.youtube.com' + '/embed/' + this.youtube_parser(url2)
        }
      }
      return url2
    },
    youtube_parser(url) {
      var r,
        rx =
          /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/

      r = url.match(rx)
      return r[1]
    },
    openRecordDetail(record) {
      let newRecord = record
      this.link = newRecord.url
      if (newRecord.url.indexOf('/drive.google.com/file') !== -1) {
        const listLinkArr = newRecord.url.split('/')
        listLinkArr.pop()
        newRecord.url = listLinkArr.join('/') + '/preview'
      }
      if (newRecord.url.indexOf('youtu') !== -1) {
        if (newRecord.url.indexOf('embed') === -1) {
          const listLinkArr = newRecord.url.split('/')
          if (newRecord.url.indexOf('watch') !== -1) {
            let code = listLinkArr[3].split('v=')[1]
            newRecord.url = 'https://www.youtube.com' + '/embed/' + code
          } else {
            newRecord.url = 'https://www.youtube.com' + '/embed/' + listLinkArr[3]
          }
        }
        if (this.checkRecordingStatus(record) === 'commented') {
          this.isOpenRecordContent = false
        } else {
          this.isOpenRecordContent = true
        }
      }
      this.recordSelect = newRecord
    },
    formatDate(date) {
      let stringToDate = new Date(date)
      const yyyy = stringToDate.getFullYear()
      let mm = stringToDate.getMonth() + 1 // Months start at 0!
      let dd = stringToDate.getDate()

      if (dd < 10) dd = '0' + dd
      if (mm < 10) mm = '0' + mm

      const formattedToday = dd + '/' + mm + '/' + yyyy
      return formattedToday
    },
    async getClassList() {
      this.loading = true
      await class_managerment.getClassRe(this.studentInfor.userID).then(res => {
        this.classList = res
        this.loading = false
      })
    },

    async getListRecording(classID) {
      this.loading = true
      await class_managerment.getRecordCategoryByClassID(classID).then(res => {
        if (res === []) {
          this.cateraryRecordList = []
        } else {
          this.cateraryRecordList = res
        }
      })

      await class_managerment.getStudentRecordingByClassID(classID).then(res => {
        let listRecord = res
          .filter(element => element.studentID === this.studentID)
          .map(item => {
            return {
              ...item,
              total:
                item.scoreFluencyInSpeaking +
                item.scoreGeneralComment +
                item.scorePronunciation +
                item.scoreVocabularyAndGrammar,
              listContent: item.recording ? item.recording.split('\n') : '',
            }
          })
        const s = this.cateraryRecordList.reduce((arrRecord, category) => {
          const record = listRecord.find(
            element => element.recordCategoryID === category.recordCategoryID
          )
          if (record) {
            const newRecord = {
              ...record,
              recordDate: category.date,
              deadline: new Date(
                new Date(category.date.split('T')[0]).getTime() + 86400000 * 14
              ).toISOString(),
              listContent: category.recording ? category.recording.split('\n') : '',
            }
            arrRecord.push({
              ...newRecord,
              validate: this.validateRecord(newRecord),
              listContent: category.recording ? category.recording.split('\n') : '',
            })
          } else {
            const newRecord = {
              studentID: this.studentID,
              registrationID: 0,
              classID: classID,
              recordDate: category.date,
              url: '',
              recordCategoryID: category.recordCategoryID,
              recordCategory: category.recordCategory,
              categoryDate: category.date,
              total: 0,
              deadline: new Date(
                new Date(category.date.split('T')[0]).getTime() + 86400000 * 7
              ).toISOString(),
              generalComment: '',
              pronunciation: '',
              fluencyInSpeaking: '',
              vocabularyAndGrammar: '',
              scoreFluencyInSpeaking: 0,
              scoreGeneralComment: 0,
              scorePronunciation: 0,
              scoreVocabularyAndGrammar: 0,
              listContent: category.recording ? category.recording.split('\n') : '',
            }
            arrRecord.push({
              ...newRecord,
              validate: this.validateRecord(newRecord),
              listContent: category.recording ? category.recording.split('\n') : '',
            })
          }
          return arrRecord
        }, [])
        this.listRecord = s
        this.loading = false
        return s
        // console.log(
        //   res.map(item => {
        //     return {
        //       ...item,
        //       validate: this.validateRecord(item),
        //       listContent: item.recordContent.split('\n'),
        //     }
        //   })
        // )
      })
    },
    toggleClass(classID) {
      const classFind = this.listOpen.find(element => element === classID)
      if (classFind !== undefined) {
        this.listOpen = this.listOpen.filter(item => {
          return item != classID
        })
      } else {
        this.listOpen = [classID]
        this.classID = classID
        this.getListRecording(classID)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.comment-item .title-comment {
  background: #0b2585;
  color: #ffff;
  padding: 0.4rem 0.4rem;
}
.catogory {
  padding: 4px 6px;
  background: #d9e5ff;
  border-radius: 8px;
  font-size: 1rem;
}
.link {
  cursor: pointer;
  color: #427df2 !important;
}

.link:hover {
  text-decoration: underline;
  font-weight: 700;
}
.record-class-item {
  background: #f9f9f9;
  padding: 7px 16px;
  margin: 4px 0;
  border-radius: 3px;
  cursor: pointer;
}
.record-content {
  background: #f8f8f8;
}
.record-comment-title {
  padding: 0.6rem;
  background: #f8f8f8;
}
.record-content h3 {
  padding: 0.6rem;
}
.list-record {
  max-height: 75vh;
  padding-top: 0 !important;
  overflow-y: scroll;
  margin-top: 16px;
}
.list-record::-webkit-scrollbar {
  display: none;
}
.record-class {
  border: 1px solid #eaeaea;
  border-radius: 6px;
  padding: 8px;
}
.text-record-sub {
  margin-left: 9px;
  margin-top: 3px;
}
.btn-edit-record {
  width: 100%;

  margin: 0 auto;
  padding-right: 8px;
  padding-bottom: 8px;
}
</style>
