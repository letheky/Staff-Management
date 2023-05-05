<template>
  <div class="pt-5 pl-10 pr-10">
    <h2 class="mb-5">Nhận xét hàng tháng</h2>
    <Autocomplete
      :style="{ width: '180px' }"
      @setFilter="setFilter"
      :styleBorder="''"
      :keyFilter="'none'"
      :labelSelect="'class'"
      :selectedInit="[]"
      :listItem="listClass.map(item => item.classCode)"
    />

    <!-- <v-autocomplete
      :class="'select-class'"
      :items="listClass"
      v-model="listClassSelect"
      item-text="classCode"
      item-value="classID"
      label="Chọn lớp"
      multiple
      outlined
    >
      <template v-slot:selection="{}"> {{ listClass.length }} class selected </template>
    </v-autocomplete> -->

    <div ref="listComment">
      <v-progress-linear indeterminate v-if="loading" color="primary"></v-progress-linear>
      <CommentItem
        v-else
        v-for="comment in dataComments"
        @setLog="setLog"
        :key="comment.commentID"
        :comment="comment"
      />
    </div>
    <h4 v-if="dataComments.length < 1" class="nodata">No data in here</h4>
    <DigCommentDetailStudent
      @getListComment="getListComment"
      :comment="commentSelect"
      :dialog="dialog"
      @setLog="setLog"
    />
  </div>
</template>

<script>
import { monthly_comment } from '@/api/monthly.js'
import { class_managerment } from '@/api/class-management'
import CommentItem from './CommentItem.vue'
import DigCommentDetailStudent from './DigCommentDetailStudent.vue'
import Autocomplete from '@/components/Utils/Autocomplete.vue'

export default {
  components: {
    CommentItem,
    DigCommentDetailStudent,
    Autocomplete,
  },
  data() {
    return {
      dialog: false,
      userInfor: JSON.parse(localStorage.getItem('currentUser')).userInfo,
      commentSelect: {
        commentID: 31,
        month: '2023-01',
        status: 'RESPONDED',
        stuCode: '10255HN',
        studentID: 10255,
        studentName: 'Đào Quang Minh',
        stu_userID: 4379,
        dob: '2011-05-25T00:00:00',
        startDate: '2022-06-25T00:00:00',
        classID: 5054,
        classCode: 'VQ1-D3-2203',
        evaluate: 'EXCELLENT',
        comment: 'dsd',
        guardianEvaluate: 'HAPPY',
        guardianComment: 'xzxzx',
        updateAt: '2023-01-11T15:29:52.67',
        updateBy: '10255HN',
      },
      dataComments: [],
      listClass: [],
      loading: false,
      listClassSelect: [],
    }
  },
  setup() {
    return {}
  },
  mounted() {},
  created() {
    this.getListClassStuding()
    this.getListComment()
  },
  methods: {
    setFilter(objectFilterChange) {
      this.listClassSelect = objectFilterChange.filter
    },
    async getListComment() {
      if (this.userInfor.studentID && this.userInfor.studentID !== 0) {
        let listCLassToString = this.listClass
          .filter(item => this.listClassSelect.includes(item.classCode))
          .map(item => item.classID)
          .join(',')
        if (this.listClassSelect.length < 1) {
          listCLassToString = this.listClass.map(item => item.classID).join(',')
        }

        this.loading = true
        await monthly_comment
          .getCommentByStudent(this.userInfor.userID, listCLassToString)
          .then(res => {
            this.dataComments = res
            this.loading = false
          })
          .catch(() => {
            this.dataComments = []
            this.loading = false
          })
      }
    },
    async getListClassStuding() {
      await class_managerment
        .getClassRe(this.userInfor.userID)
        .then(res => {
          this.listClass = res
          this.listClassSelect = [res[0].classCode]
        })

        .catch(err => {
          this.listClass = []
          this.listClassSelect = []
          console.log(err)
        })
    },
    setLog(inf) {
      console.log(inf)
      if (inf) {
        this.dialog = inf.dialog
        this.commentSelect = inf.comment
      }
    },
  },
  watch: {
    listClassSelect: function () {
      this.getListComment()
    },
  },
}
</script>

<style lang="scss" scoped>
.select-class {
  width: 200px;
}
.nodata {
  text-align: center;
}
</style>
