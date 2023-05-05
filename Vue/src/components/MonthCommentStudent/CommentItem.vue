<template>
  <div v-if="comment" :class="`comment-item ${comment.evaluate} mb-5`">
    <div class="comment-header d-flex align-center">
      <div class="d-flex align-center mr-4">
        <img src="../../assets/images/icon-cal-comment.svg" alt="" />
        <p class="ml-1">Tháng {{ dayjs(comment.month + '-01').format('MM/YYYY') }}</p>
      </div>
      <div class="d-flex align-center">
        <img src="../../assets/images/icon-hat.svg" alt="" />
        <p class="ml-1">{{ comment.classCode }}</p>
      </div>
    </div>
    <div class="comment-teacher">
      <div class="d-flex align-center mt-2">
        <h3>Nhận xét của giáo viên</h3>
        <p :class="`ml-2 rate ${comment.evaluate}-btn`">
          {{ translateEvaluate(comment.evaluate) }}
        </p>
      </div>
      <p v-html="comment.comment" class="mt-2"></p>
    </div>
    <div v-if="comment.guardianComment" class="comment-parent">
      <div class="d-flex align-center mt-2">
        <h3>Phản hồi của phụ huynh</h3>
        <p :class="`ml-2 rate ${comment.guardianEvaluate}-btn`">
          {{ translateEvaluate(comment.guardianEvaluate) }}
        </p>
      </div>
      <p class="mt-2">
        {{ comment.guardianComment }}
      </p>
    </div>
    <div @click="openCommentDetail" class="d-flex align-center link mt-1">
      <img src="../../assets/images/icon-pen.svg" alt="" />

      <h3 v-if="!comment.guardianComment || comment.guardianComment.trim() === ''">
        Phụ huynh phản hồi
      </h3>
      <h3 v-else>Sửa phản hồi</h3>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  setup() {
    return {
      dayjs: dayjs,
    }
  },
  methods: {
    translateEvaluate(evaluate) {
      let returnValue = ''
      switch (evaluate) {
        case 'GOOD':
          returnValue = 'Khá'
          break
        case '':
          returnValue = 'Không hài lòng'
          break
        case 'EXCELLENT':
          returnValue = 'Giỏi'
          break
        case 'ATTENTIVE':
          returnValue = 'Cần quan tâm'
          break
        case 'HAPPY':
          returnValue = 'Hài lòng'
          break
        case 'UNHAPPY':
          returnValue = 'Không hài lòng'
          break
        default:
          returnValue = evaluate
          break
      }
      return returnValue
    },
    changeRateToVietNam(rate) {
      return rate
    },
    openCommentDetail() {
      this.$emit('setLog', {
        dialog: true,
        comment: this.comment,
      })
    },
  },
  props: {
    comment: {
      type: Object,
    },
  },
  watch: {
    comment: function (cm) {
      this.comment = cm
    },
  },
}
</script>

<style lang="scss" scoped>
.link {
  cursor: pointer;
  width: fit-content;
  h3 {
    color: #246aff;
    margin-left: 6px;
    font-size: 14px;
  }
}
.comment-item {
  padding: 12px;
  border-radius: 4px;
  border: 1px solid;
  border-left-width: 0.5rem;
}
.rate {
  background: rgb(11, 252, 31);
  color: #ffff;
  width: 102px;
  height: 25px;
  text-align: center;
  line-height: 25px;
  border-radius: 4px;
}
.ATTENTIVE {
  border-color: #f7ac1a;
  background-color: rgba(247, 172, 26, 0.03);
}
.EXCELLENT {
  border-color: #27ae60;
  background-color: rgba(39, 174, 96, 0.1);
}
.EXCELLENT-btn {
  background-color: #27ae60;
}
.link {
  cursor: pointer;

  color: #427df2 !important;
}
.link:hover {
  text-decoration: underline;
  font-weight: 700;
}
.GOOD {
  border-color: #246aff;
  background-color: rgba(36, 106, 255, 0.02);
}
.GOOD-btn {
  background-color: #246aff;
}
.ATTENTIVE-btn,
.UNHAPPY-btn {
  background-color: #f7ac1a;
}

.HAPPY-btn {
  background-color: #27ae60;
}
</style>
