<template>
  <v-dialog v-if="comment" :class="'dialog'" v-model="dialog" width="700">
    <v-card :class="'comment-student'">
      <v-card-title :class="'header-commentdetail'">
        <h2 class="text-center">Phản hồi</h2>
        <div @click="closeComment" class="icon"><v-icon> mdi-close </v-icon></div>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-row>
              <v-col cols="3"> <h3 class="text--primary">Tháng</h3> </v-col>
              <v-col cols="9">
                <h3 class="text--primary text-normal">
                  {{ dayjs(comment.month + '-01').format('MM/YYYY') }}
                </h3>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-row>
              <v-col cols="3"> <h3 class="text--primary">Học sinh</h3> </v-col>
              <v-col cols="9">
                <h3 class="text--primary text-normal">{{ comment.studentName }}</h3>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6">
            <v-row>
              <v-col cols="3"> <h3 class="text--primary">Lớp</h3> </v-col>
              <v-col cols="9">
                <h3 class="text--primary text-normal">{{ comment.classCode }}</h3>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <div class="mt-3">
          <div class="comment-guardian mb-2 d-flex align-center">
            <h3 class="text--primary mr-2">Nhận xét của giáo viên</h3>
            <h3>{{ translateEvaluate(comment.evaluate) }}</h3>
          </div>
          <p
            v-html="comment.comment"
            class="text--primary text-normal mb-3 comment-guardian-text"
          ></p>
        </div>
        <div class="align-center d-flex">
          <div><h3 class="text--primary mr-3">Phản hồi của phụ huynh</h3></div>
          <div>
            <div
              :class="'classification-pick d-flex justify-space-around' + ' ' + guardianEvaluate"
            >
              <p :style="{ width: '100px', cursor: 'pointer' }" @click="guardianEvaluate = 'HAPPY'">
                Hài lòng
              </p>
              <p
                :style="{ width: '100px', cursor: 'pointer' }"
                @click="guardianEvaluate = 'UNHAPPY'"
              >
                Không hài lòng
              </p>
            </div>
          </div>
        </div>
        <div class="mt-3">
          <v-form ref="form" v-model="valid">
            <v-textarea
              v-model="guardianComment"
              :rules="[validateComment]"
              outlined
              autocomplete="Phản hồi "
              label="Phản hồi"
            ></v-textarea>
          </v-form>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          :style="{ width: '100px' }"
          :class="'mb-3'"
          outlined
          @click="closeComment"
        >
          Hủy
        </v-btn>
        <v-btn color="primary" :style="{ width: '100px' }" @click="sendResponse" :class="'mb-3'">
          Gửi phản hồi
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import dayjs from 'dayjs'
import { monthly_comment } from '@/api/monthly.js'

export default {
  setup() {
    return { dayjs: dayjs }
  },
  data() {
    return {
      isSubmit: false,
      valid: false,
      guardianComment: '',
      guardianEvaluate: '',
    }
  },
  created() {},
  methods: {
    translateEvaluate(evaluate) {
      let returnValue = ''
      switch (evaluate) {
        case 'GOOD':
          returnValue = 'Tốt'
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
    closeComment() {
      this.dialog = false
      this.$refs.form.resetValidation()
    },
    async sendResponse() {
      if (this.isSubmit && this.valid) {
        const dataComment = {
          commentID: this.comment.commentID,
          guardianEvaluate: this.guardianEvaluate,
          guardianComment: this.guardianComment,
        }
        console.log(dataComment)
        await monthly_comment.studentComment(dataComment).then(() => {
          this.$emit('setLog', {
            dialog: false,
            comment: this.comment,
          })
          window.scroll({
            top: this.scroll,
            left: 0,
            behavior: 'smooth',
          })
          this.$emit('getListComment')
        })
      }
    },
    validateComment(v) {
      if (v.length <= 1000 && v.length > 0) {
        this.isSubmit = true
        return true
      } else if (v.length === 0) {
        return 'Phản hồi không được bổ trống'
      } else {
        this.isSubmit = false
        return 'Số lượng kí tự của phản hổi phải nhỏ hơn 250'
      }
    },
  },
  props: ['dialog', 'comment'],
  watch: {
    comment: function (cm) {
      console.log(cm)
      this.guardianComment = cm.guardianComment
      this.guardianEvaluate = cm.guardianEvaluate ? cm.guardianEvaluate : 'HAPPY'
    },
    dialog: function (value) {
      this.$emit('setLog', {
        dialog: value,
        comment: this.comment,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.text-center {
  width: 100%;
  text-align: center;
}
.dialog {
  overflow: hidden;
}
.comment-guardian-text {
  line-height: 25px;
}

.header-commentdetail {
  position: relative;
  display: flex;
  justify-content: end;
  align-items: center;
  .icon {
    display: inline;
    margin-top: -35px;
    cursor: pointer;
  }
}
.text-normal {
  font-size: 1.1rem;
  font-weight: normal;
}
.classification-pick {
  border: 1px solid rgb(218, 217, 217);
  position: relative;
  border-radius: 4px;

  &::before {
    content: '';
    height: 85%;
    background: rgb(233, 179, 179);
    width: calc(100% / 2);
    position: absolute;
    top: -7.5px;
    left: 0;
    border-radius: 4px;
    z-index: 2;
    color: #000;
    margin: 10px 4px;
    margin-right: 8px;
    transition: all 0.2s ease-in-out;
  }
  &.HAPPY {
    text-align: center;
    p:nth-of-type(1) {
      color: #fff;
    }
    &::before {
      background: #27ae60;
      transform: translateX(0%);
    }
  }
  &.UNHAPPY {
    text-align: center;
    p:nth-of-type(2) {
      color: #fff;
    }
    &::before {
      background: #f7ac1a;
      transform: translateX(104px);
    }
  }
  p {
    z-index: 10;
    margin: 6px;
    padding: 2px 5px;
    color: #000;
  }
}
.comment-guardian {
  h3:nth-of-type(2) {
    background: #deffec;
    color: #039f45;
    padding: 2px 10px;
  }
}
</style>
