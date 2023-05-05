<template>
  <div>
    <div :style="{ marginLeft: 'auto', marginBottom: '5px', width: 'fit-content' }">
      <v-btn
        @click="
          $router.push({
            name: 'test-result-form',
            query: {
              classID: classID,
            },
          })
        "
        color="primary"
        ><img src="../../assets/images/icon-plus.svg" alt="" class="mr-2" srcset="" />Add new
        exam</v-btn
      >
    </div>
    <v-data-table
      v-if="!isLoading"
      :headers="testHeader"
      :items="testData"
      :page.sync="page"
      :items-per-page="1000000000000000"
      hide-default-footer
      hide-default-header
      @page-count="pageCount = $event"
      class="elevation-0 test-table"
      fixed-header
      height="60vh"
    >
      <template v-slot:header="{ props }">
        <thead :class="'test-header'">
          <tr>
            <th
              :style="{
                position: 'sticky',
                left: header.left,
                top: header.left && 0,
                color: '#ffff !important',
                zIndex: header.left && 11,
              }"
              v-for="(header, index) in props.headers"
              :key="index"
            >
              <p
                :class="header.value === 'studentCode' && 'w-100'"
                :style="{ textAlign: 'left !important' }"
              >
                {{ header.text }}
              </p>
            </th>
            <th
              :class="'test-header-item'"
              :style="{ color: '#ffff !important' }"
              v-for="(header, index) in cateraryTestList"
              :key="index"
            >
              <div class="d-flex align-center">
                <div class="text-center mr-2">
                  <p>{{ header.testName }}</p>
                  <p :style="{ fontWeight: 500 }">
                    {{ dayjs(header.testDate).format('DD/MM/YYYY') }}
                  </p>
                </div>
                <img
                  @click="
                    $router.push({
                      name: 'test-result-form',
                      query: {
                        classID: classID,
                        testID: header.testId,
                      },
                    })
                  "
                  src="../../assets/images/icon-edit-yellow.svg"
                  alt=""
                  srcset=""
                />
              </div>
            </th>
          </tr>
        </thead>
      </template>
      <template v-slot:body="{ items }">
        <tbody :class="'test-body'">
          <tr v-for="(item, index) in items" :key="index">
            <td
              :class="'stickyttt'"
              :style="{
                width: '20px',
                position: 'sticky',
                left: 0,
                zIndex: 10,
                background: '#ffff',
              }"
            >
              <p :style="{ width: '20px', textAlign: 'center' }">
                {{ index + 1 }}
              </p>
            </td>
            <td
              :style="{ position: 'sticky', left: '40px', zIndex: 9, background: '#ffff' }"
              :class="'link'"
              @click="viewDetailProfile(item.userID)"
            >
              <p :style="{ width: '100%', textAlign: 'left' }">{{ item.studentCode }}</p>
            </td>
            <td
              :style="{ position: 'sticky', left: '120px', zIndex: 9, background: '#ffff' }"
              :class="'link'"
              @click="viewDetailProfile(item.userID)"
            >
              <p :style="{ minWidth: '170px', textAlign: 'left' }">
                {{ item.studentName }}
              </p>
            </td>

            <td
              :class="'w-150'"
              v-for="(test, index) in cateraryTestList"
              :set="(data = item.listResult.find(element => element.testId === test.testId))"
              :key="index"
            >
              <div :class="'w-150'" v-if="data && (data.score || data.score === 0)">
                <div :class="'d-flex align-center w-150'">
                  <div
                    class="d-flex align-center justify-space-between link"
                    :style="{ width: '50px' }"
                    @click="
                      editSc({
                        ...item.listResult.find(element => element.testId === test.testId),
                        ...item,
                      })
                    "
                    target="_blank"
                  >
                    <p :class="'link ml-1 mr-0'">{{ data.score }}</p>
                    <img
                      class="ml-2 link"
                      src="../../assets/images/icon-doneAndMark.svg"
                      alt=""
                      srcset=""
                    />
                  </div>
                </div>
              </div>
              <div v-else>
                <div :class="'d-flex align-center w-150'">
                  <div
                    class="d-flex align-center justify-space-between link"
                    :style="{ width: '50px' }"
                    @click="
                      editSc({
                        ...item.listResult.find(element => element.testId === test.testId),
                        ...item,
                      })
                    "
                    target="_blank"
                  >
                    <p :class="'link ml-1 mr-0'">-</p>
                    <img
                      class="ml-2 link"
                      src="../../assets/images/icon-comment.svg"
                      alt=""
                      srcset=""
                    />
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
    <v-form v-model="formTestOne" ref="formTestOne">
      <v-dialog v-if="dialog" style="z-index: 1000" v-model="dialog" persistent width="600">
        <v-card :class="'px-2 pb-5 pt-3'">
          <v-card-title class="text-h5 text-center mb-3">
            <div :style="{ position: 'relative', width: '100%' }">
              <p class="text-center">Exam result detail</p>
              <img
                @click="dialog = false"
                :style="{ position: 'absolute', right: 0, top: '5px' }"
                src="../../assets/images/icon-close.svg"
                alt=""
                srcset=""
              />
            </div>
          </v-card-title>
          <v-card-text :class="'py-1'">
            <v-row>
              <v-col cols="6">
                <v-row>
                  <v-col cols="6"><h4 :style="{ color: '#0C2E68' }">Exam name</h4></v-col>
                  <v-col cols="6" :style="{ color: '#333333' }">{{ selectStudent.testName }}</v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row>
                  <v-col cols="6"><h4 :style="{ color: '#0C2E68' }">Exam date</h4></v-col>
                  <v-col cols="6" :style="{ color: '#333333' }">{{
                    dayjs(selectStudent.testDate).format('DD/MM/YYYY')
                  }}</v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row>
                  <v-col cols="6"><h4 :style="{ color: '#0C2E68' }">Student name</h4></v-col>
                  <v-col cols="6" :style="{ color: '#333333' }">{{
                    selectStudent.studentName
                  }}</v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row>
                  <v-col cols="6"><h4 :style="{ color: '#0C2E68' }">Student code</h4></v-col>
                  <v-col cols="6" :style="{ color: '#333333' }">{{
                    selectStudent.studentCode
                  }}</v-col>
                </v-row>
              </v-col>
              <v-col :class="'py-1'" cols="12">
                <v-text-field
                  :class="'py-0'"
                  type="number"
                  label="Score"
                  :rules="[
                    v => !!v || 'This filed is required',
                    v => !isNaN(v) || 'Must be number',
                  ]"
                  v-model="scoreSelect"
                  outlined
                />
              </v-col>
              <v-col :class="'py-1'" cols="12">
                <!-- <v-textarea
                  :class="'py-0'"
                  v-model="commentSelect"
                  label="Comment"
                  outlined
                ></v-textarea> -->
                <div class="editor">
                  <span>Comment</span>
                  <vue-editor v-model="commentSelect" :editor-toolbar="customToolbar" id="editor1">
                  </vue-editor>
                  <p v-if="!isValidEditor1" class="error--text">This field is required</p>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" outlined @click="dialog = false">Cancel </v-btn>
            <v-btn color="primary" @click="editOne" :disabled="!isValidEditor1 || !validScore">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-form>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { test_result } from '@/api/test_result'
import { getObjectPermission } from '../../common/index.js'
import { VueEditor } from 'vue2-editor'
export default {
  components: {
    VueEditor,
  },
  computed: {
    isValidEditor1() {
      return this.commentSelect.length > 0
    },
    validScore() {
      return this.scoreSelect.length > 0
    },
  },
  data() {
    return {
      customToolbar: [
        ['bold', 'italic', 'underline'],
        ['align', { align: 'center' }, { align: 'right' }, { align: 'justify' }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ color: [] }, { background: [] }],
        ['link', 'image', 'video'],
      ],

      dialog: false,
      permission: getObjectPermission(409),
      testData: [],
      selectStudent: {},
      scoreSelect: 0,
      commentSelect: '',
      testHeader: [
        {
          text: 'No',
          value: 'no',
          left: '0px',
        },
        {
          text: 'Stu code',
          value: 'studentCode',
          left: '40px',
        },
        {
          text: 'Student name',
          value: 'studentName',
          left: '120px',
        },
      ],
      cateraryTestList: [],
    }
  },
  methods: {
    editSc(data) {
      this.scoreSelect = data.score
      this.commentSelect = data.comment
      this.selectStudent = data
      this.dialog = true
    },
    async getListTest() {
      await test_result.getListTest(this.classID).then(res => {
        this.cateraryTestList = res
      })
    },
    async editOne() {
      const dataEdit = {
        testId: this.selectStudent.testId,
        studentId: this.selectStudent.studentID,
        userId: this.selectStudent.userID,
        score: this.scoreSelect === 0 ? '0' : parseFloat(this.scoreSelect),
        comment: this.commentSelect,
      }
      // const listEdit = this.testData.reduce((arr, item) => {
      //   const findTest = item.listResult.find(e => e.testId === this.selectStudent.testId)

      //   if (findTest) {
      //     arr.push({
      //       testId: this.selectStudent.testId,
      //       studentId: item.studentID,
      //       userId: item.userID,
      //       ...findTest,
      //     })
      //   }
      // }, [])
      await test_result
        .editAResult(dataEdit)
        .then(() => {
          this.dialog = false
          this.getListResult()
        })
        .catch(() => {})
    },
    async getListResult() {
      await test_result.getListResult(this.classID).then(res => {
        const studentAddList = this.students.reduce((arr, item) => {
          const studentFound = res.find(e => e.studentID === item.studentID)
          if (studentFound) {
            arr.push(studentFound)
          } else {
            arr.push({ ...item, studentName: item.fullName })
          }

          return arr
        }, [])
        this.testData = studentAddList.reduce((arr, item) => {
          const s = this.cateraryTestList.reduce((arr2, item2) => {
            let n = item.listResult.find(res2 => item2.testId === res2.testId)

            if (n) {
              arr2.push(n)
            } else {
              arr2.push({
                testDate: item2.testDate,
                testId: item2.testId,
                testName: item2.testName,
              })
            }
            return arr2
          }, [])
          arr.push({ ...item, listResult: s })
          return arr
        }, [])
      })
    },
  },
  watch: {
    cateraryTestList: function () {
      this.getListResult()
    },
  },
  created() {
    this.getListResult()
    this.getListTest()
  },
  props: ['classID', 'students'],
  setup() {
    return {
      dayjs: dayjs,
    }
  },
}
</script>

<style lang="scss" scoped></style>
