<template>
  <div id="recording-management" class="d-flex flex-column">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <div class="d-flex">
            <h2 class="pt-1">Student Recording</h2>
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
                  @input="changefilAPI"
                  label="Center"
                  outlined
                  :class="'mr-2'"
                  dense
                >
                </v-autocomplete>
                <v-autocomplete
                  label="Class status"
                  v-model="classStatusID"
                  append-icon="keyboard_arrow_down"
                  :items="statusList"
                  @input="changefilAPI"
                  item-text="classStatus"
                  item-value="classStatusID"
                  outlined
                  dense
                  hide-details
                  class="mr-2"
                ></v-autocomplete>
                <v-autocomplete
                  label="Class code"
                  v-model="classID"
                  append-icon="keyboard_arrow_down"
                  :items="classList"
                  @input="changefilAPI"
                  item-text="classCode"
                  item-value="classID"
                  outlined
                  dense
                  hide-details
                  class="mr-2"
                ></v-autocomplete>
              </div>
            </div>
          </div>
          <v-progress-linear
            v-if="isLoading"
            indeterminate
            color="primary"
            class="my-10"
          ></v-progress-linear>
          <v-data-table
            v-if="!isLoading"
            :headers="recordHeader"
            :items="recordData"
            :page.sync="page"
            :items-per-page="1000000000000000"
            hide-default-footer
            hide-default-header
            @page-count="pageCount = $event"
            class="elevation-0 record-table"
            fixed-header
            height="60vh"
          >
            <template v-slot:header="{ props }">
              <thead :class="'record-header'">
                <tr>
                  <th
                    :style="{ color: '#ffff !important' }"
                    v-for="(header, index) in props.headers"
                    :key="index"
                  >
                    <p :style="{ textAlign: 'center !important' }">
                      {{ header.text }}
                    </p>
                  </th>
                  <th
                    :class="'record-header-item'"
                    :style="{ color: '#ffff !important' }"
                    v-for="(header, index) in cateraryRecordList"
                    :key="'2' + index"
                  >
                    <h3>{{ header.recordCategory }}</h3>
                    <p>{{ _dayjs(header.date).format('DD/MM/YYYY') }}</p>
                  </th>
                </tr>
              </thead>
            </template>
            <template v-slot:body="{ items }">
              <tbody v-if="classList.length === 0" style="text-align: center">
                <div
                  class="pt-3"
                  style="position: absolute; left: 50%; transform: translate(-50%, 0)"
                >
                  No data available
                </div>
              </tbody>
              <tbody v-else :class="'record-body'">
                <tr v-for="(item, index) in items" :key="item.student_userID">
                  <td :class="'stickyttt'" :style="{ width: '20px' }">
                    <p :style="{ width: '20px', textAlign: 'center' }">
                      {{ index + 1 }}
                    </p>
                  </td>
                  <td :class="'link'">
                    <p
                      :style="{ width: '100px', textAlign: 'center' }"
                      @click="viewDetailProfile(item.student_userID)"
                    >
                      {{ item.studentCode }}
                    </p>
                  </td>
                  <td :class="'link'">
                    <p :style="{ width: '170px' }" @click="viewDetailProfile(item.student_userID)">
                      {{ item.studentName }}
                    </p>
                  </td>
                  <td>
                    <p :style="{ width: '100px', textAlign: 'center' }">
                      {{ item.dob }}
                    </p>
                  </td>
                  <td>
                    <p :style="{ width: '100px', textAlign: 'center' }">
                      {{ item.startDate }}
                    </p>
                  </td>
                  <td :class="'link'">
                    <p
                      :style="{ width: '120px', textAlign: 'center' }"
                      @click="viewDetailClass(item.classID)"
                    >
                      {{ item.classCode }}
                    </p>
                  </td>
                  <td :class="'link'">
                    <p
                      :style="{ width: '170px', textAlign: 'center' }"
                      @click="viewDetailProfile(item.qcid)"
                    >
                      {{ item.qcName }}
                    </p>
                  </td>
                  <td :class="'link'">
                    <p
                      :style="{ width: '170px', textAlign: 'center' }"
                      @click="viewDetailProfile(item.ecid)"
                    >
                      {{ item.ecName }}
                    </p>
                  </td>

                  <td
                    :class="'w-150'"
                    v-for="recordCategory in cateraryRecordList"
                    :key="recordCategory.recordCategoryID"
                  >
                    <div
                      :class="'w-150'"
                      v-if="
                        item.listRecord.find(
                          element =>
                            element.recordCategoryID === recordCategory.recordCategoryID &&
                            item.listRecord.find(
                              element =>
                                element.recordCategoryID === recordCategory.recordCategoryID
                            ).urLs.length !== 0
                        )
                      "
                    >
                      <div :class="'d-flex align-center w-150'">
                        <img
                          @click="
                            openRecordMark(
                              item.listRecord.find(
                                element =>
                                  element.recordCategoryID === recordCategory.recordCategoryID
                              )
                            )
                          "
                          :src="
                            item.listRecord.find(
                              element =>
                                element.recordCategoryID === recordCategory.recordCategoryID
                            ).isCommentOrMark === true
                              ? iconDoneAndMark
                              : iconDone
                          "
                          alt=""
                          srcset=""
                        />

                        <div
                          class="d-flex align-center link"
                          @click="
                            viewVideo(
                              item.listRecord.find(
                                element =>
                                  element.recordCategoryID === recordCategory.recordCategoryID
                              )
                            )
                          "
                          target="_blank"
                        >
                          <img
                            class="ml-2 link"
                            src="../../../assets/images/icon-play.svg"
                            alt=""
                            srcset=""
                          />
                          <p :class="'link ml-1 mr-0'">View</p>
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <div :class="'d-flex align-center'">
                        <h4 :style="{ color: 'red' }" :class="'ml-3'">-</h4>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
    <div class="text-center">
      <v-dialog v-if="dialogRecordMark" v-model="dialogRecordMark" width="900">
        <v-card>
          <v-form
            @submit.prevent="markRecord"
            ref="formRecord"
            :class="'record-form'"
            v-model="valid"
          >
            <v-card-title class="text-h5">
              <div :class="' fz-1 header-comment d-flex justify-space-between align-center'">
                <h4>Comment on recording</h4>
                <div>
                  <v-btn
                    :class="'btn-comment-record mr-3'"
                    @click="closeRecordMark"
                    outlined
                    height="30px"
                    >Close</v-btn
                  >
                  <v-btn
                    :class="'btn-comment-record'"
                    filled
                    height="30px"
                    color="primary"
                    type="submit"
                    :disabled="
                      !valid ||
                      !isValidEditor1 ||
                      !isValidEditor2 ||
                      !isValidEditor3 ||
                      !isValidEditor4
                    "
                    >Send feedback</v-btn
                  >
                </div>
              </div>
              <div
                :style="{ width: '100%' }"
                class="d-flex align-center justify-space-between mt-4"
              >
                <div class="d-flex align-center">
                  <h4 class="mr-6 fz-1">
                    {{ recordSelect.recordCategory }} - {{ recordSelect.studentName }}
                  </h4>
                  <span class="mt-1 fz-1">Total score: {{ totalMarkRecord }}</span>
                </div>
                <p class="fz-1">
                  Send by {{ recordSelect.sentByUser }} -
                  {{ formatTime(recordSelect.sentByDate) }}
                </p>
              </div>
            </v-card-title>

            <v-divider></v-divider>
            <v-card-text>
              <v-row>
                <v-col cols="12" :class="'pt-1 pb-1'">
                  <div class="editor">
                    <span>General comment</span>
                    <vue-editor
                      v-model="generalComment"
                      :editor-toolbar="customToolbar"
                      id="editor1"
                      placeholder="Add your comments..."
                    >
                    </vue-editor>
                    <p v-if="!isValidEditor1" class="error--text">This field is required</p>
                  </div>
                </v-col>

                <v-col cols="10" :class="'pt-1 pb-1'">
                  <div class="editor">
                    <span>Pronunciation</span>
                    <vue-editor
                      :editor-toolbar="customToolbar"
                      v-model="pronunciation"
                      id="editor2"
                      placeholder="Add your comments..."
                    >
                    </vue-editor>
                    <p v-if="!isValidEditor2" class="error--text">This field is required</p>
                  </div>
                </v-col>
                <v-col cols="2" :class="'pt-1 pb-1 mt-5'">
                  <v-text-field
                    v-model="scorePronunciation"
                    name="input-7-1"
                    outlined
                    @input="changeMark"
                    height="80px"
                    :type="'number'"
                    :rules="numberRules"
                    placeholder="Scoring..."
                    label="Score"
                    auto-grow
                  ></v-text-field>
                </v-col>
                <v-col cols="10" :class="'pt-1 pb-1'">
                  <div class="editor">
                    <span>Fluency in speaking</span>
                    <vue-editor
                      :editor-toolbar="customToolbar"
                      id="editor3"
                      v-model="fluencyInSpeaking"
                      placeholder="Add your comments..."
                    >
                    </vue-editor>
                    <p v-if="!isValidEditor3" class="error--text">This field is required</p>
                  </div>
                </v-col>
                <v-col cols="2" :class="'pt-1 pb-1'">
                  <v-text-field
                    v-model="scoreFluencyInSpeaking"
                    name="input-7-1"
                    outlined
                    @input="changeMark"
                    :class="'textAria pb-1 pt-1 mt-4'"
                    :rules="numberRules"
                    placeholder="Scoring..."
                    label="Score"
                    auto-grow
                    height="80px"
                    :type="'number'"
                  ></v-text-field>
                </v-col>
                <v-col cols="10" :class="'pt-1 pb-1'">
                  <div class="editor">
                    <span>Vocabulary and grammar</span>
                    <vue-editor
                      :editor-toolbar="customToolbar"
                      v-model="vocabularyAndGrammar"
                      id="editor4"
                      placeholder="Add your comments..."
                    >
                    </vue-editor>
                    <p v-if="!isValidEditor4" class="error--text">This field is required</p>
                  </div>
                </v-col>
                <v-col cols="2" :class="'pt-1 pb-1 mt-5'">
                  <v-text-field
                    v-model="scoreVocabularyAndGrammar"
                    name="input-7-1"
                    outlined
                    @input="changeMark"
                    :type="'number'"
                    :rules="numberRules"
                    placeholder="Scoring..."
                    label="Score"
                    auto-grow
                    height="80px"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
      <div v-if="dialogVideo" :class="'dig-video'">
        <v-dialog content-class="elevation-0" width="700px" v-model="dialogVideo">
          <div :style="{ width: 'fit-content', marginLeft: 'auto' }">
            <img
              @click="dialogVideo = false"
              :style="{ width: '30px', height: '30px', cursor: 'pointer ' }"
              src="../../../assets/images/icon-close2.svg"
              alt=""
            />
          </div>
          <v-card
            class="pt-5 pl-5 pr-7 pb-4"
            width="800px"
            :style="{ overflowY: 'scroll', height: '600px' }"
          >
            <div class="d-flex align-center link-toNewTab mb-3">
              <img src="../../../assets/images/icon-link.svg" alt="" />
            </div>
            <div v-for="(url, index) in recordSelect.urLs" :key="index">
              <h3>url.urlTitle</h3>
              <iframe
                :style="{ width: '101%', height: '400px', margin: '0 auto' }"
                :src="urlChange(url.urlLink)"
                allowfullscreen
              ></iframe>
            </div>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { class_managerment } from '@/api/class-management.js'
import { statistic_management } from '@/api/statistic-management.js'
import dayjs from 'dayjs'
import QueryString from 'qs'
import iconDoneAndMark from '../../../assets/images/icon-doneAndMark.svg'
import iconDone from '../../../assets/images/icon-comment.svg'
import { getObjectPermission } from '../../../common/index'
import { VueEditor } from 'vue2-editor'
export default {
  components: { VueEditor },
  data() {
    return {
      classStatusID: 3,
      valid: false,
      numberRules: [v => !!v || 'This filed is required', v => !isNaN(v) || 'Must be number'],
      textRules: [v => !!v || 'This filed is required'],
      model: 'tab1',
      permision: getObjectPermission(401),
      iconDone: iconDone,
      dialogVideo: false,
      commentSelect: null,
      iconDoneAndMark: iconDoneAndMark,
      categoryList: [],
      centers: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
      generalComment: '',
      pronunciation: '',
      locationID: JSON.parse(localStorage.getItem('currentCenter')),
      fluencyInSpeaking: '',
      vocabularyAndGrammar: '',
      scoreGeneralComment: 0,
      scorePronunciation: 0,
      scoreFluencyInSpeaking: 0,
      scoreVocabularyAndGrammar: 0,
      statusList: [],
      recordSelect: {},
      classList: [],
      recordHeader: [
        {
          text: 'No',
          value: 'no',
          sortable: false,
          width: '60px',
        },
        {
          text: 'Student code',
          value: 'studentCode',
          sortable: false,
          width: '100px',
        },
        {
          text: 'Student name',
          value: 'studentName',
          sortable: false,
          width: '140px',
        },
        {
          text: 'DOB',
          value: 'dob',
          sortable: false,
          width: '100px',
        },
        {
          text: 'Start date',
          value: 'startDate',
          sortable: false,
          width: '100px',
        },
        {
          text: 'Class code',
          value: 'classCode',
          sortable: false,
          width: '100px',
        },
        {
          text: 'QC',
          value: 'qcName',
          sortable: false,
          width: '140px',
        },
        {
          text: 'EC',
          value: 'ecName',
          sortable: false,
          width: '140px',
        },
      ],
      recordCategory: [],
      recordData: [],
      isLoading: false,
      page: 1,
      overlay: false,
      pageCount: 0,
      noteText: '',
      screen: window.innerWidth,
      itemsPerPage: 20,
      dialogRecordMark: false,
      recordHeaders: [],
      cateraryRecordList: [],
      objectSearchStudent: {
        studentCode: '',
        fullName: '',
        dob: '',
        dueDate: '',
        outStanding: '',
        studentAccountBalance: '',
        qc: '',
        ec: '',
        startDate: '',
        school: '',
        hasRoadmap: '',
      },
      totalMarkRecord: 0,
      students: [],
      classID: 5054,
      date: null,
      teacherID: JSON.parse(localStorage.getItem('currentUser')).userInfo.teacherID,
      courseName: '',
      classCode: '',
      classStatus: '',
      hour: '',
      customerCareStaffID: '',
      book: '',
      note: '',
      center: '',
      precedingClass: '',
      classAdmin: '',
      classAdmin_userID: '',
      customerCareStaff: '',
      classType: '',
      classGroup: '',
      startDate: '',
      endDate: '',
      teacherIDClass: '',
    }
  },
  computed: {
    logHeaders() {
      let headers = []

      return headers
    },
    isValidEditor1() {
      return this.generalComment.length > 0
    },
    isValidEditor2() {
      return this.pronunciation.length > 0
    },
    isValidEditor3() {
      return this.fluencyInSpeaking.length > 0
    },
    isValidEditor4() {
      return this.vocabularyAndGrammar.length > 0
    },
  },
  created() {
    window.addEventListener('resize', () => {
      this.screen = window.innerWidth
    })
    this.searchClass()

    this.getRecordCategoryByClassID()
    this.getStudentRecordingByClassID()
    this.getStudentList()
  },

  methods: {
    async searchClass() {
      let body = {}
      await class_managerment.getClassStatus().then(res => {
        if (res) {
          res.unshift({
            classStatusID: 6,
            classStatus: 'All',
          })
          this.statusList = res
          this.classStatus = this.classStatusID < 6 ? res[this.classStatusID].classStatus : ''
          body = {
            pLocationid: this.locationID,
            pStatus: this.classStatus,
          }
        }
      })
      this.isLoading = true
      await class_managerment.getClassByLocation(QueryString.stringify(body)).then(res => {
        if (res) {
          this.classList = res
        }
      })
      this.isLoading = false
    },
    setFilter(objectFilterChange) {
      this.filtersStu = {
        ...this.filtersStu,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
    },
    removeAccents(str) {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
    },
    groupColumnValueList(val) {
      if (
        this.objectSearchStudent[val] !== null &&
        this.objectSearchStudent[val].trim().length !== 0
      ) {
        return this.students
          .map(d => d[val])
          .filter(y => {
            return (
              this.removeAccents(y)
                .toLowerCase()
                .indexOf(this.removeAccents(this.objectSearchStudent[val]).toLowerCase()) !== -1
            )
          })
      } else {
        return this.students.map(d => d[val])
      }
    },
    toggleWithSearch(value) {
      this.$nextTick(() => {
        if (
          this.filtersStu[value].length ==
          this.students
            .filter(
              item =>
                item[value].toLowerCase().indexOf(this.objectSearchStudent[value].toLowerCase()) !==
                -1
            )
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, []).length
        ) {
          this.filtersStu[value] = []
          this.objectSearchStudent[value] = ''
        } else {
          this.filtersStu[value] = this.students
            .filter(
              item =>
                item[value].toLowerCase().indexOf(this.objectSearchStudent[value].toLowerCase()) !==
                -1
            )
            .map(d => d[value])
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
    toggle(value) {
      this.objectSearchStudent[value] = ''
      this.$nextTick(() => {
        if (
          this.filtersStu[value].length ==
          this.students
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, []).length
        ) {
          this.filtersStu[value] = []
        } else {
          this.filtersStu[value] = this.students
            .map(d => d[value])
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
    changeInputFilter(searchText, header) {
      this.objectSearchStudent[header] = searchText
    },
    formatTime(date) {
      try {
        if (new Date(date) !== 'Invalid Date' && date !== null) {
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
      } catch (err) {
        return ''
      }
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
    viewVideo(record) {
      ;(this.dialogVideo = true), (this.recordSelect = record)
    },
    openRecordMark(data) {
      this.resetMark()
      if (data.isCommentOrMark) {
        this.generalComment = data.generalComment
        this.pronunciation = data.pronunciation
        this.fluencyInSpeaking = data.fluencyInSpeaking
        this.vocabularyAndGrammar = data.vocabularyAndGrammar
        this.scorePronunciation = parseFloat(data.scorePronunciation)
        this.scoreFluencyInSpeaking = parseFloat(data.scoreFluencyInSpeaking)
        this.scoreVocabularyAndGrammar = parseFloat(data.scoreVocabularyAndGrammar)
        this.totalMarkRecord =
          parseFloat(data.scoreGeneralComment) +
          parseFloat(data.scorePronunciation) +
          parseFloat(data.scoreFluencyInSpeaking) +
          parseFloat(data.scoreVocabularyAndGrammar)
      }

      this.dialogRecordMark = true
      this.recordSelect = data
    },
    resetMark() {
      this.generalComment = ''
      this.totalMarkRecord = 0
      this.pronunciation = ''
      this.fluencyInSpeaking = ''
      this.vocabularyAndGrammar = ''
      this.scoreGeneralComment = ''
      this.scorePronunciation = 0
      this.scoreFluencyInSpeaking = 0
      this.scoreVocabularyAndGrammar = 0
    },
    closeRecordMark() {
      this.resetMark()
      this.dialogRecordMark = false
      this.$refs.formRecord.resetValidation()
    },
    viewDetailProfile(userId) {
      this.$router.push({
        name: 'account-management-view-account',
        params: {
          userId: userId,
        },
      })
    },
    viewDetailClass(classID) {
      this.$router.push({
        name: 'class-management-detail',
        query: { classID: classID },
      })
    },
    async getStudentRecordingByClassID() {
      await class_managerment.getStudentRecordingByClassID(this.classID).then(res => {
        let studentGroup = []
        res.forEach(item => {
          if (
            (item.fluencyInSpeaking === '' &&
              item.pronunciation === '' &&
              item.generalComment === '' &&
              item.vocabularyAndGrammar === '' &&
              item.scoreFluencyInSpeaking === 0 &&
              item.scoreGeneralComment === 0 &&
              item.scorePronunciation === 0 &&
              item.scorePronunciation === 0) ||
            (item.fluencyInSpeaking === null &&
              item.pronunciation === null &&
              item.generalComment === null &&
              item.vocabularyAndGrammar === null &&
              item.scoreFluencyInSpeaking === null &&
              item.scoreGeneralComment === null &&
              item.scorePronunciation === null &&
              item.scorePronunciation === null)
          ) {
            item.isCommentOrMark = false
          } else {
            item.isCommentOrMark = true
          }
          if (!studentGroup.find(student => item.studentID === student.studentID)) {
            studentGroup.push({
              studentName: item.studentName,
              studentID: item.studentID,
              studentCode: item.studentCode,
              student_userID: item.student_userID,
              classCode: item.classCode,
              dob: item.dob,
              startDate: item.startDate,
              qcName: item.qc,
              ecName: item.ec,
              listRecord: [item],
            })
          } else {
            studentGroup = studentGroup.map(student => {
              return student.studentID === item.studentID
                ? { ...student, listRecord: [...student.listRecord, item] }
                : student
            })
          }
        })
        this.recordData = this.students.reduce((arr, item) => {
          if (studentGroup.find(student => student.studentID === item.studentID)) {
            studentGroup.map(el => {
              if (el.studentID === item.studentID) {
                el.dob = item.dob
                el.startDate = item.startDate
                el.qcName = item.qc
                el.ecName = item.ec
                el.ecid = item.ec_userID
                el.qcid = item.qc_userID
                el.classID = item.classID
              }
            })
            arr.push(studentGroup.find(student => student.studentID === item.studentID))
          } else {
            arr.push({
              studentName: item.fullName,
              studentID: item.studentID,
              studentCode: item.studentCode,
              student_userID: item.userID,
              dob: item.dob,
              startDate: item.startDate,
              qcName: item.qc,
              ecName: item.ec,
              ecid: item.ec_userID,
              qcid: item.qc_userID,
              classID: item.classID,
              classCode: item.classCode,
              listRecord: [],
            })
          }
          return arr
        }, [])
        console.log(this.recordData)
      })
    },
    async getRecordCategoryByClassID() {
      const headers = []
      headers.push(
        {
          text: 'No',
          value: 'no',
          sortable: false,
          width: '60px',
        },
        {
          text: 'Student code',
          value: 'studentCode',
          sortable: false,
          width: '120px',
        },
        {
          text: 'Student name',
          value: 'studentName',
          sortable: false,
          width: '140px',
        },
        {
          text: 'DOB',
          value: 'dob',
          sortable: false,
          width: '100px',
        },
        {
          text: 'Start date',
          value: 'startDate',
          sortable: false,
          width: '100px',
        },
        {
          text: 'Class code',
          value: 'classCode',
          sortable: false,
          width: '120px',
        },
        {
          text: 'QC',
          value: 'qcName',
          sortable: false,
          width: '140px',
        },
        {
          text: 'EC',
          value: 'ecName',
          sortable: false,
          width: '140px',
        }
      )
      await class_managerment.getRecordCategoryByClassID(this.classID).then(res => {
        this.recordHeader = headers
        this.cateraryRecordList = res
      })
    },
    changefilAPI() {
      this.searchClass()
      this.getRecordCategoryByClassID()
      this.getStudentRecordingByClassID()
      this.getStudentList()
    },
    async getStudentList() {
      const headers = []
      headers.push(
        {
          text: 'No',
          value: 'no',
          sortable: false,
          width: '60px',
        },
        {
          text: 'Student code',
          value: 'studentCode',
          sortable: false,
          width: '140px',
        },
        {
          text: 'Student name',
          value: 'studentName',
          sortable: false,
          width: '140px',
        }
      )
      await statistic_management.getStudentList(this.classID).then(res => {
        if (res && !res.errors) {
          this.students = res
          this.students.forEach(student => {
            if (student.dueDate) student.dueDate = this._dayjs(student.dueDate).format('DD/MM/YYYY')
            student.startDate = this._dayjs(student.startDate).format('DD/MM/YYYY')
            student.dob = this._dayjs(student.dob).format('DD/MM/YYYY')
          })
        }
      })
    },
    async markRecord() {
      let comment = {
        recordID: this.recordSelect.recordID,
        generalComment: this.generalComment,
        pronunciation: this.pronunciation,
        fluencyInSpeaking: this.fluencyInSpeaking,
        scoreGeneralComment: 0,
        vocabularyAndGrammar: this.vocabularyAndGrammar,
        scorePronunciation: parseFloat(this.scorePronunciation),
        scoreFluencyInSpeaking: parseFloat(this.scoreFluencyInSpeaking),
        scoreVocabularyAndGrammar: parseFloat(this.scoreVocabularyAndGrammar),
      }
      await class_managerment.updateComment(comment).then(() => {
        this.getRecordCategoryByClassID()
        this.getStudentRecordingByClassID()
        this.dialogRecordMark = false
      })
    },
    _dayjs: dayjs,
  },
  watch: {
    students: function () {
      // this.
      this.getStudentRecordingByClassID()
    },
  },
}
</script>
<style lang="scss" scoped>
.text-right {
  text-align: right;
}
.record-form {
  width: 100%;
}
#recording-management {
  .link {
    cursor: pointer;

    color: #427df2 !important;
  }
  .w-150 {
    width: 100px;
  }
  .record-header-item {
    width: 160px;
  }
  .link:hover {
    text-decoration: underline;
    font-weight: 700;
  }
}

.dig-video .v-dialog {
  box-shadow: none !important;
}
.h {
  background: rgba(0, 0, 0, 0.01);
  position: fixed;
  width: 100%;
  height: 100%;

  top: 0;
  z-index: 1000;
  left: 0;
}
.link-toNewTab {
  float: right;
}
.iconEdit {
  opacity: 0.6;
}
.record-table {
  border-top: 1px solid #dae3e8 !important;
}
.btn-comment-record {
  width: 120px;
  font-size: 10px;
}
.record-header th {
  color: #fff !important;
  background: #0c2e68 !important;
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
  text-align: center;
}
.record-header th:nth-child(1) {
  position: sticky;
  left: 0;
  z-index: 10;
}
.record-header th:nth-child(2) {
  position: sticky;
  left: 48.8px;
  z-index: 10;
}
.record-header th:nth-child(3) {
  position: sticky;
  left: 100px;
  z-index: 10;
}
.record-header-item p {
  font-weight: 500;
  width: 100px;
}
.record-body tr:nth-child(even) {
  background: #eaf1ff;
}
.header-comment {
  width: 100%;
}
.record-body tr td:nth-child(1) {
  position: sticky;
  left: 0;
}
.record-body tr td:nth-child(2) {
  position: sticky;
  // left: 100%;
  left: 50px;
}
.record-body tr td:nth-child(3) {
  position: sticky;
  left: 170px;
}
.record-body tr:nth-child(even) td:nth-child(3) {
  background: #eaf1ff !important;
}
.record-body tr:nth-child(odd) td:nth-child(3) {
  background: #fff !important;
}
.record-body tr:nth-child(even) td:nth-child(2) {
  background: #eaf1ff !important;
}
.record-body tr:nth-child(odd) td:nth-child(2) {
  background: #fff !important;
}
.record-body tr:nth-child(even) td:nth-child(1) {
  background: #eaf1ff !important;
}
.record-body tr:nth-child(odd) td:nth-child(1) {
  background: #fff !important;
}
.record-body tr:nth-child(even) {
  background: #eaf1ff !important;
}
.record-body tr:nth-child(odd) {
  background: #fff !important;
}
.fz-1 {
  font-size: 16px;
}
</style>
