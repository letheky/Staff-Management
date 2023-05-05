<template v-if="dialog">
  <div id="comment-form">
    <v-dialog :class="'dialog'" persistent v-model="dialog" width="700">
      <v-card :class="'comment-detail'">
        <v-card-title :class="'header-commentdetail'">
          <h2 class="text-center">Comment detail</h2>
          <div @click="closeComment" :style="{ display: 'inherit' }" class="icon">
            <v-icon> mdi-close </v-icon>
          </div>
        </v-card-title>

        <v-card-text>
          <v-row class="mt-2">
            <v-col cols="6">
              <v-row>
                <v-col cols="3"> <h3 class="text--primary">Month:</h3> </v-col>
                <v-col cols="9">
                  <h3 class="text--primary text-normal">
                    {{ dayjs(comment.month).format('MM/YYYY') }}
                  </h3>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col cols="3"> <h3 class="text--primary">Class:</h3> </v-col>
                <v-col cols="9">
                  <h3 class="text--primary text-normal">{{ comment.classCode }}</h3>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-row>
                <v-col cols="3"> <h3 class="text--primary">Student:</h3> </v-col>
                <v-col cols="9">
                  <h3 class="text--primary text-normal">{{ comment.studentName }}</h3>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col cols="3"> <h3 class="text--primary">DOB:</h3> </v-col>
                <v-col cols="9">
                  <h3 class="text--primary text-normal">{{ comment.dob }}</h3>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row class="align-center">
            <v-col cols="3"> <h3 class="text--primary">Classification</h3> </v-col>
            <v-col cols="9">
              <div v-if="comment.statusSolved === 'solved' || comment.statusSolved === 'done'">
                <div>
                  <h3 :class="comment.evaluate + '-btn btn-rate'">
                    {{ comment.evaluate === 'ATTENTIVE' ? 'Needs support' : comment.evaluate }}
                  </h3>
                </div>
              </div>
              <div v-else :class="'classification-pick d-flex justify-space-around' + ' ' + rate">
                <p @click="rate = 'EXCELLENT'">Excellent</p>
                <p @click="rate = 'GOOD'">Good</p>
                <p class="pr-3" @click="rate = 'ATTENTIVE'">Needs support</p>
              </div>
            </v-col>
          </v-row>
          <div class="mt-3">
            <div class="d-flex justify-space-between">
              <h3 class="text--primary mb-2">Teacher’s comment</h3>
              <div class="d-flex align-center">
                <p style="font-size: 1rem">Character count:</p>

                <h3>{{ commentText.length !== 0 ? commentText.length - 7 : 0 }}</h3>
              </div>
            </div>
            <v-form ref="form" v-model="valid">
              <p
                v-html="comment.comment"
                :class="`comment-text `"
                v-if="comment.statusSolved === 'done' || comment.statusSolved === 'solved'"
              ></p>
              <vue-editor v-else :editor-toolbar="toolbar" :id="'editor'" v-model="commentText">
              </vue-editor>
              <!-- <v-textarea
                v-else
                v-model="commentText"
                :rules="[validateComment]"
                outlined
                autocomplete="Comment "
                label="Comment"
              ></v-textarea> -->
            </v-form>
            <div v-if="comment.updateBy" class="d-flex justify-end align-center">
              <h3 class="text--primary">{{ comment.updateBy }}</h3>
              <p class="text-normal ml-2">
                modified at {{ dayjs(comment.updateAt).format(' HH:mm, DD/MM/YYYY') }}
              </p>
            </div>
          </div>
          <div class="mt-3" v-if="comment.guardianComment">
            <div class="comment-guardian mb-2 d-flex align-center">
              <h3 class="text--primary mr-2">Guardian’s comment</h3>
              <h3 :class="`'guardianEvaluate btn-rate' ${comment.guardianEvaluate}-btn `">
                {{ titleCase(comment.guardianEvaluate) }}
              </h3>
            </div>
            <p class="text--primary text-normal mb-3 comment-text">
              {{ comment.guardianComment }}
            </p>
            <div class="d-flex justify-end align-center">
              <h3 class="text--primary">{{ comment.guardianName }}</h3>
              <p class="text-normal ml-2">
                modified at {{ dayjs(comment.guardianTime).format(' HH:mm, DD/MM/YYYY') }}
              </p>
            </div>
          </div>
        </v-card-text>

        <v-card-actions :class="'d-flex flex-column'">
          <v-spacer></v-spacer>
          <div :class="'d-flex justify-end'" :style="{ width: '100%' }">
            <v-btn color="primary" :class="'mb-3  mr-2'" outlined @click="closeComment">
              Cancel
            </v-btn>

            <v-btn
              color="primary"
              v-if="comment.statusSolved === 'solved' && accountTypeID !== 4"
              :class="'mb-3  '"
              outlined
              :disabled="!valid"
              @click="addAComment('DRAFT')"
            >
              Unsend
            </v-btn>
            <v-btn
              color="primary"
              v-if="comment.statusSolved === 'process' && accountTypeID !== 4"
              :class="'mb-3  mr-2'"
              outlined
              :disabled="!valid"
              @click="addAComment('PUBLIC')"
            >
              Send
            </v-btn>
            <v-btn
              color="primary"
              v-if="comment.statusSolved === 'notComment' || comment.statusSolved === 'process'"
              :disabled="!valid"
              @click="addAComment('DRAFT')"
              :class="'mb-3  '"
            >
              Save
            </v-btn>
          </div>
          <div v-if="checkError" class="error">
            <v-alert
              :value="checkError"
              transition="scale-transition"
              type="error"
              style="font-size: 14px; padding: 12px"
            >
              Error add comment
            </v-alert>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { monthly_comment } from '@/api/monthly.js'
import { VueEditor } from 'vue2-editor'
import dayjs from 'dayjs'
export default {
  components: { 'vue-editor': VueEditor },
  setup() {
    return {
      dayjs: dayjs,
    }
  },
  data() {
    return {
      toolbar: [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        ['link'],
        ['clean'], // remove formatting button
      ],
      checkError: false,
      checkSuccess: false,
      commentText: '',
      isSubmit: false,
      valid: false,
      accountTypeID: JSON.parse(localStorage.getItem('currentUser')).userInfo.accountTypeID,
      rate: 'EXCELLENT',
    }
  },
  methods: {
    titleCase(str) {
      var splitStr = str.toLowerCase().split(' ')
      for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
      }
      // Directly return the joined string
      return splitStr.join(' ')
    },
    async addAComment(type) {
      if (this.valid) {
        const dataComment = {
          month: this.comment.month,
          studentID: this.comment.stu_userID,
          classID: this.comment.classID,
          evaluate: this.rate,
          comment: this.commentText,
        }
        if (this.comment.commentID) {
          const dataEdit = {
            commentID: this.comment.commentID,
            evaluate: this.rate,
            comment: this.commentText,
            status: type,
          }
          await monthly_comment
            .editComment(dataEdit)
            .then(() => {
              this.$emit('callData')
              this.$refs.form.reset()
              this.$emit('setLog', {
                openLog: false,
                comment: this.comment,
              })
            })
            .catch(() => {
              this.checkError = true
              setTimeout(() => {
                this.checkError = false
              }, 2000)
            })
        }
        await monthly_comment
          .addAcomment(dataComment)
          .then(() => {
            this.$emit('callData')
            this.$refs.form.reset()
            this.$emit('setLog', {
              openLog: false,
              comment: this.comment,
            })
          })
          .catch(() => {
            this.checkError = true
            setTimeout(() => {
              this.checkError = false
            }, 2000)
          })
      }
    },

    validateComment(v) {
      if (v.length <= 1000 && v.length > 0) {
        this.isSubmit = true
        return true
      } else if (v.length === 0) {
        return 'Comment is require'
      } else {
        this.isSubmit = false
        return 'Comments cannot exceed 100 characters'
      }
    },
    closeComment() {
      this.$emit('setLog', {
        openLog: false,
        comment: this.comment,
      })
      this.$refs.form.resetValidation()
    },
    resetForm() {
      this.rate = 'EXCELLENT'

      this.$refs.form.resetValidation()
    },
  },

  created() {
    if (this.comment.comment) {
      this.commentText = this.comment.comment
      this.rate = this.comment.evaluate
    }
  },
  props: ['dialog', 'comment'],
  watch: {
    comment: function () {
      if (this.comment.comment) {
        this.commentText = this.comment.comment
        this.rate = this.comment.evaluate
      } else {
        this.commentText = ''
      }
    },
    dialog: function (value) {
      this.$emit('setLog', {
        openLog: value,
        comment: this.comment,
      })
      if (value === false) {
        this.resetForm()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.GOOD-btn {
  background: #def1ff;
  color: #007cd7;
}
.btn-rate {
  width: 130px;
  text-align: center;
  border-radius: 4px;
}

.EXCELLENT-btn,
.HAPPY-btn {
  padding: 4px;

  background: #deffec;
  color: #0ab452 !important;
}
.HAPPY-btn,
.UNHAPPY-btn {
  text-align: center;
}
.ATTENTIVE-btn,
.UNHAPPY-btn {
  padding: 4px;
  background: #fff6dd;
  color: #fa8c06 !important;
}
.text-center {
  width: 100%;
  text-align: center;
}
.dialog {
  overflow: hidden;
}
.comment-text {
  line-height: 25px;
  color: #000;
  font-size: 1rem;
}

.header-commentdetail {
  position: relative;
  display: flex;
  justify-content: end;
  align-items: center;
  i {
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
  width: 75%;
  border: 1px solid rgb(218, 217, 217);
  position: relative;
  border-radius: 4px;
  p {
    cursor: pointer;
    text-align: center;
    width: calc(100% / 3);
  }
  &::before {
    content: '';
    height: 85%;
    background: rgb(233, 179, 179);
    width: calc(100% / 3);
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
  &.EXCELLENT {
    p:nth-of-type(1) {
      color: #fff;
    }
    &::before {
      background: #27ae60;
      transform: translateX(0%);
    }
  }
  .icon {
    display: inherit;
  }
  &.ATTENTIVE {
    p:nth-of-type(3) {
      color: #fff;
    }
    &::before {
      background: #f7ac1a;
      transform: translateX(193%);
    }
  }
  &.GOOD {
    p:nth-of-type(2) {
      color: #fff;
    }
    &::before {
      background: #246aff;
      transform: translateX(100%);
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
  .guardianEvaluate.HAPPY:nth-of-type(2) {
    background: #deffec;
    color: #039f45;
    padding: 2px 10px;
  }
  .guardianEvaluate.HAPPY:nth-of-type(2) {
    background: #deffec;
    color: #039f45;
    padding: 2px 10px;
  }
}
.error {
  height: 50px;
  width: 100%;
}
</style>
