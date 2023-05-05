<template>
  <div class="px-7">
    <v-form v-model="formTest" ref="formTest">
      <h2 class="d-flex">
        <v-icon @click="back()">arrow_back_ios</v-icon>
        <template v-if="!isEditForm">
          <div class="d-flex align-center">Add new exam result</div>
        </template>
        <template v-else>
          <div class="d-flex align-center">Edit exam result</div>
        </template>
      </h2>
      <v-row :class="'align-center'">
        <v-col cols="3">
          <v-row>
            <v-col cols="4">
              <h4>Class</h4>
            </v-col>
            <v-col cols="8">
              <p>{{ className ? className : 'Loading...' }}</p>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="4">
          <v-row :class="'align-center'">
            <v-col cols="4">
              <h4>Exam name</h4>
            </v-col>
            <v-col cols="8">
              <v-text-field
                v-model="dataTestResult.testName"
                class="hidden-detail-input"
                dense
                :rules="[v => !!v || 'Item is required']"
                outlined
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="4">
          <v-row :class="'align-center'">
            <v-col cols="4">
              <h4>Exam date</h4>
            </v-col>
            <v-col cols="8">
              <v-text-field
                class="hidden-detail-input"
                :rules="[v => !!v || 'Item is required']"
                v-model="dataTestResult.testDate"
                type="date"
                dense
                outlined
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-data-table
        v-if="!isloading"
        :headers="headers"
        :items="dataTestResult.dataList"
        :items-per-page="100000000000000000000000000000"
        hide-default-footer
        hide-default-header
        @page-count="pageCount = $event"
        class="elevation-0 table-test hidden-detail-input"
        fixed-header
      >
        <template v-slot:header="{ props }">
          <thead class="v-data-table-header header-test">
            <tr>
              <th
                v-for="header in props.headers"
                :style="{
                  width: header.width + 'px',
                  textAlign: header.value === 'fullName' || 'center',
                }"
                :key="header.value"
              >
                <p v-if="header.value === 'no'" :style="{ width: '20px' }">{{ header.text }}</p>
                <p v-else-if="header.value === 'score'" :style="{ width: '60px' }">
                  {{ header.text }}
                </p>
                <p v-else>{{ header.text }}</p>
              </th>
            </tr>
          </thead>
        </template>
        <template v-slot:body>
          <tbody>
            <tr v-for="(result, index) in dataTestResult.dataList" :key="result.studentId">
              <td>
                <p class="pb-2" :style="{ width: '20px' }">{{ index + 1 }}</p>
              </td>
              <td>
                <p class="pb-2">{{ result.fullName }}</p>
              </td>
              <td>
                <div class="pb-2" :style="{ width: '60px' }">
                  <v-text-field
                    height="45px"
                    :class="'center-input'"
                    type="number"
                    @change="$refs.formTest.validate()"
                    v-model="result.score"
                  ></v-text-field>
                </div>
              </td>
              <td>
                <v-textarea
                  class="pb-2"
                  rows="2"
                  height="45px"
                  no-resize
                  v-model="result.comment"
                ></v-textarea>
              </td>
            </tr></tbody
        ></template>
      </v-data-table>
      <v-footer fixed absolute height="60" color="#fff" class="pl-10 pr-10" v-if="!isLoading">
        <div class="d-flex justify-end" style="width: 100%">
          <div>
            <v-btn
              v-if="$route.query.testID"
              color="error"
              :style="{ width: '120px' }"
              @click="deleteResult"
              outlined
              >Delete this result</v-btn
            >
            <v-btn color="primary" :style="{ width: '120px' }" @click="back()" class="mx-5" outlined
              >Cancel</v-btn
            >
            <v-btn color="primary" :style="{ width: '120px' }" @click="createdList">Save</v-btn>
          </div>
        </div>
      </v-footer>
    </v-form>
    <FlashMessage></FlashMessage>
  </div>
</template>

<script>
import { class_managerment } from '@/api/class-management'
import { statistic_management } from '@/api/statistic-management'
import dayjs from 'dayjs'
import { test_result } from '@/api/test_result'

export default {
  setup() {
    return {}
  },
  created() {
    this.getClassName()
    this.getListStudent()
  },
  mounted() {
    if (this.$route.query.testID) {
      this.isEditForm = true
      this.getInforTest()
    }
  },
  methods: {
    async deleteResult() {
      await test_result
        .deleteResult(this.$route.query.testID && this.$route.query.testID)
        .then(() => {
          this.back()
        })
        .catch(() => {
          this.flashMessage.show({
            status: 'error',
            title: 'Error delete ',
            message: '',
          })
        })
    },
    async createdList() {
      console.log('first')
      this.$refs.formTest.validate()
      if (this.formTest) {
        const dataCreate = {
          ...this.dataTestResult,
          classID: this.$route.query.classID,
          students: this.dataTestResult.dataList.map(res => {
            return {
              ...res,
              score: res.score && res.score === '' ? null : parseFloat(res.score),
            }
          }),
        }
        if (this.$route.query.testID) {
          await test_result
            .editListResult(dataCreate)
            .then(res => {
              console.log(res)
              this.back()
            })
            .catch(() => {
              this.flashMessage.show({
                status: 'error',
                title: 'Error edit ',
                message: '',
              })
            })
        } else {
          await test_result
            .createListResult(dataCreate)
            .then(res => {
              console.log(res)
              this.back()
            })
            .catch(() => {
              this.flashMessage.show({
                status: 'error',
                title: 'Error create ',
                message: '',
              })
            })
        }
      }
    },
    back() {
      window.history.back()
    },
    async getInforTest() {
      await test_result.getListResultByTestId(this.$route.query.testID).then(res => {
        this.dataTestResult = {
          ...res,
          testDate: dayjs(res.testDate).format('YYYY-MM-DD'),
          dataList: this.dataTestResult?.dataList.reduce((arr, item) => {
            let s = res?.students?.find(e => e.studentId === item.studentID)
            if (s) {
              arr.push({ ...s, fullName: s.fullname })
            } else {
              arr.push({
                ...item,
                score: '',
                comment: '',
              })
            }
            return arr
          }, []),
        }
      })
    },
    async getClassName() {
      await class_managerment.getClassInfo(this.$route.query.classID).then(res => {
        if (res.classInfo.classCode) this.className = res.classInfo.classCode
      })
    },
    async getListStudent() {
      await statistic_management.getStudentList(this.$route.query.classID).then(res => {
        if (res && !res.errors) {
          this.dataTestResult = {
            testDate: dayjs(new Date()).format('YYYY-MM-DD'),
            testName: '',
            dataList: res.map(item => {
              return {
                ...item,
                score: '',
                comment: '',
              }
            }),
          }
        }
      })
    },
  },
  data() {
    return {
      students: [],
      isEditForm: false,
      className: '',
      dataTestResult: {
        testId: 1,
        testDate: '2023-02-20',
        testName: 'Summative 1',
        classId: 2,
        classCode: 'VQ1-abc',
        dataList: [],
      },
      headers: [
        {
          text: 'No',
          value: 'no',
          width: '30',
        },
        {
          text: 'Student name',
          value: 'fullName',
          width: '150',
        },
        {
          text: 'Score',
          value: 'score',
          width: '60',
        },
        {
          text: 'Comment',
          value: 'comment',
        },
      ],
    }
  },
  watch: {
    dataTestResult: function () {},
    date: function () {},
  },
}
</script>

<style lang="scss" scoped>
.center-input input {
  text-align: center !important;
}
.header-test {
  position: sticky;
  top: 0;
}
.table-test {
  max-height: 70vh;
  overflow-y: scroll;
}
input {
  text-align: center;
}
.table-test {
  border: 1px solid #dae3e8;
}
</style>
