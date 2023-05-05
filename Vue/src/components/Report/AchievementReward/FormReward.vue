<template>
  <div class="text-center">
    <v-dialog v-model="dialog" persistent width="600">
      <v-card>
        <v-card-title
          :class="'mb-3'"
          :style="{
            width: '100%',
          }"
        >
          <div
            :style="{
              width: '100%',
            }"
          >
            <div class="d-flex justify-space-between mb-2">
              <h3>{{ type === 'create' ? 'Add new reward' : 'Edit Student Reward' }}</h3>
              <img
                @click="closeDialog()"
                src="../../../assets/images/icon-close-round.svg"
                alt=""
                srcset=""
              />
            </div>
            <v-divider></v-divider>
          </div>
          <v-divider></v-divider>
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="isval">
            <v-row>
              <v-col cols="6" class="pb-0 pt-1">
                <v-text-field
                  v-model="studentCode"
                  label="Student code"
                  outlined
                  dense
                  :class="'hidden-detail-input disabled'"
                  :disabled="true"
                  filled
                  :rules="[validateRequire]"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="pb-0 pt-1">
                <v-text-field
                  v-model="studentName"
                  label="Student name"
                  outlined
                  dense
                  :class="'hidden-detail-input disabled'"
                  :disabled="true"
                  filled
                  :rules="[validateRequire]"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="pb-0 pt-1">
                <v-text-field
                  v-model="classCode"
                  label="Class code"
                  dense
                  outlined
                  :rules="[validateRequire]"
                  :class="'hidden-detail-input disabled'"
                  :disabled="true"
                  filled
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="pb-0 pt-1"> </v-col>
              <v-col cols="6" class="pb-0 pt-1">
                <v-autocomplete
                  v-model="rewardTypeID"
                  :items="rewardListType"
                  item-text="name"
                  item-value="id"
                  dense
                  label="Reward type *"
                  outlined
                  :rules="[validateRequire]"
                  :class="'hidden-detail-input '"
                ></v-autocomplete>
              </v-col>
              <v-col v-if="enableEditType" cols="6" class="pb-0 pt-1 d-flex align-center">
                <template>
                  <div class="text-center">
                    <div class="d-flex align-center" @click="openEditReward">
                      <img
                        :style="{
                          color: '#246AFF',
                        }"
                        src="../../../assets/images/icon-edit-underline-link.svg"
                        alt=""
                      />
                      <h4 class="link ml-2">Edit reward type</h4>
                    </div>
                  </div>
                </template>
              </v-col>
              <v-col cols="6" class="pb-0 pt-1"
                ><v-text-field
                  v-model="rewardDate"
                  label="Reward date *"
                  dense
                  outlined
                  :rules="[validateRequire]"
                  type="date"
                  :class="'hidden-detail-input'"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pb-1 pt-1">
                <v-text-field
                  dense
                  v-model="description"
                  label="Description *"
                  outlined
                  :rules="[validateRequire]"
                  :class="'hidden-detail-input'"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pb-1 pt-1">
                <v-text-field
                  dense
                  v-model="referLink"
                  label="Reference Link"
                  outlined
                  :rules="[validateIsLink]"
                  :class="'hidden-detail-input'"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pb-1 pt-1">
                <v-text-field
                  v-model="certiLink"
                  label="Certificate Image Link"
                  outlined
                  dense
                  @input="checkImg"
                  :error-messages="errImg"
                  :class="'hidden-detathis.il-input'"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="mr-2">
          <v-spacer></v-spacer>
          <v-btn outlined class="mb-2" @click="closeDialog()"> Cancel </v-btn>
          <v-btn color="primary" class="mb-2" @click="saveReward()">
            {{ type === 'create' ? 'Add new' : 'Update' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-if="dialogH" v-model="dialogH" width="500" persistent>
      <v-card>
        <v-card-title
          :class="'mb-3'"
          :style="{
            width: '100%',
          }"
        >
          <div
            :style="{
              width: '100%',
            }"
          >
            <div class="d-flex justify-space-between mb-2">
              <h3>Reward type</h3>
              <img
                @click="closeDialogType()"
                src="../../../assets/images/icon-close.svg"
                alt=""
                srcset=""
              />
            </div>
            <v-divider></v-divider>
          </div>
          <v-divider></v-divider>
        </v-card-title>

        <v-card-text>
          <div class="d-flex" :style="{ width: '100%' }">
            <v-form
              class="d-flex justify-space-between"
              :style="{ width: '100%' }"
              ref="formType"
              v-model="formType"
            >
              <v-text-field
                dense
                v-model="nameType"
                label="Reward type"
                outlined
                @blur="$refs.formType.resetValidation()"
                :rules="[validateRequire]"
                :class="'hidden-detail-input'"
              ></v-text-field>

              <v-btn @click="saveRewardType()" class="ml-2" dense outlined color="primary">
                <img
                  src="../../../assets/images/icon-plus-round2.svg"
                  alt=""
                  srcset=""
                  class="mr-2"
                />
                <p>Add new</p>
              </v-btn>
            </v-form>
          </div>
          <div
            :style="{
              maxHeight: '250px',
              overflowY: 'scroll',
              paddingTop: '3px',
            }"
          >
            <v-form ref="formTypeUpdate" v-model="formTypeUpdate">
              <v-text-field
                v-for="(item, index) in Object.keys(rewardListTypeUpdate)"
                :key="index"
                dense
                v-model="rewardListTypeUpdate[item]"
                outlined
                :rules="[validateRequire]"
                :class="'hidden-detail-input'"
              ></v-text-field>
            </v-form>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="mr-2">
          <v-spacer></v-spacer>
          <v-btn outlined class="mb-2" @click="closeDialogType()"> Cancel </v-btn>
          <v-btn color="primary" class="mb-2" @click="saveEditRewardType()"> Save for edit </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { rewardApi } from '@/api/reward.js'
import dayjs from 'dayjs'
import { getObjectPermission } from '../../../common/index'
export default {
  computed: {},
  setup() {
    return {}
  },

  data() {
    return {
      dialogH: false,
      permision: getObjectPermission(401),
      formTypeUpdate: false,
      nameType: '',
      formType: false,
      loading: false,
      isval: false,
      studentCode: '',
      rewardListType: [],
      studentName: '',
      classCode: '',
      studentID: 0,
      classID: 0,
      rewardListTypeUpdate: [],
      enableEditType: false,
      rewardTypeID: 2,
      rewardDate: '',
      description: '',
      referLink: '',
      certiLink: '',
      errImg: [],
      errAdd: false,
    }
  },
  created() {
    this.init()

    if (this.permision && this.permision.cFull) {
      this.enableEditType = true
    }
    this.getRewardTypeList()
  },
  methods: {
    openEditReward() {
      this.rewardListTypeUpdate = this.rewardListType.reduce((object, item) => {
        object[item.id] = item.name
        return object
      }, {})
      this.dialogH = true
    },
    async saveReward() {
      console.log(this.errImg.length, this.isval)
      this.$refs.form.validate()
      this.checkImg()
      if (this.errImg.length === 0 && this.isval) {
        console.log('fdfd')
        const dataSave = {
          studentID: this.studentID,
          classID: this.classID,
          description: this.description,
          rewardTypeID: this.rewardTypeID,
          rewardDate: dayjs(this.rewardDate).format('YYYY-MM-DD'),
          certiLink: this.certiLink,
          referLink: this.referLink,
        }
        if (this.type === 'update') {
          await rewardApi
            .updateReward({ ...dataSave, rewardID: this.reward.rewardID })
            .then(res => {
              if (res) {
                this.$emit('callData')
                this.closeDialog()
              } else {
                this.errAdd = true
              }
            })
            .catch(() => {
              this.errAdd = false
            })
        } else {
          await rewardApi
            .addReward(dataSave)
            .then(res => {
              if (res) {
                this.closeDialog()
              } else {
                this.errAdd = true
              }
            })
            .catch(() => {
              this.errAdd = false
            })
        }
      }
    },
    async saveRewardType() {
      this.$refs.formType.validate()

      if (this.formType) {
        await rewardApi
          .addRewardType({ name: this.nameType })
          .then(res => {
            if (res) {
              this.getRewardTypeList()

              this.$refs.formType.reset()
            } else {
              this.errAdd = true
            }
          })
          .catch(() => {
            this.errAdd = false
          })
      }
    },
    saveEditRewardType() {
      this.$refs.formTypeUpdate.validate()

      if (this.formTypeUpdate) {
        Object.keys(this.rewardListTypeUpdate).forEach(async key => {
          await rewardApi
            .updateRewardType({ id: key, name: this.rewardListTypeUpdate[key] })
            .then(res => {
              if (res) {
                this.getRewardTypeList()
                this.closeDialogType()
              } else {
                this.errAdd = true
              }
            })
            .catch(() => {
              this.errAdd = false
            })
        })
      }
    },
    isImgUrl(url) {
      const img = new Image()
      img.src = url
      return new Promise(resolve => {
        img.onerror = () => resolve(false)
        img.onload = () => resolve(true)
      })
    },
    async checkImgLink(url) {
      const res = await this.isImgUrl(url)
      return res
    },

    validateRequire(v) {
      return !!v || 'This filed is required'
    },
    validateIsLink(v) {
      if (v === '') {
        return true
      }
      return v.indexOf('http') !== -1 || 'Must be a link'
    },
    init() {
      if (this.reward) {
        const {
          classCode,
          classID,
          studentCode,
          fullName,
          studentID,
          studentName,
          rewardTypeID,
          rewardType,
          rewardDate,
          certiLink,
          description,
          referLink,
        } = this.reward
        this.classCode = classCode
        this.classID = classID
        this.description = description
        this.studentCode = studentCode
        this.studentName = fullName ? fullName : studentName
        this.studentID = studentID
        this.rewardTypeID = rewardTypeID
        this.rewardType = rewardType
        this.rewardDate = rewardDate
          ? dayjs(rewardDate).format('YYYY-MM-DD')
          : dayjs().format('YYYY-MM-DD')
        this.certiLink = certiLink ? certiLink : ''
        this.referLink = referLink ? referLink : ''
      }
    },
    async getRewardTypeList() {
      this.loading = true
      await rewardApi.getRewardTypeList().then(res => {
        if (res && res.length > 0) {
          this.rewardListType = res
          this.rewardListTypeUpdate = res.reduce((object, item) => {
            object[item.id] = item.name
            return object
          }, {})
          this.rewardTypeID = res[0].id
        }
        this.loading = false
      })
    },
    closeDialog() {
      console.log('object')
      this.$emit('setLog', {
        reward: this.reward,
        openLog: false,
      })
    },
    closeDialogType() {
      this.dialogH = false
    },
    checkImg() {
      if (this.certiLink === '') {
        this.errImg = []
      } else if (this.certiLink.indexOf('http') === -1) {
        this.errImg = ['Must be a link']
      } else {
        this.checkImgLink(this.certiLink).then(res => {
          if (res) {
            this.errImg = []
          } else {
            console.log('object2')
            this.errImg = ['Must be a image link']
          }
        })
      }
    },
  },
  props: ['dialog', 'reward', 'type'],
  watch: {
    dialog: function (value) {
      this.$emit('setLog', {
        reward: this.reward,
        openLog: value,
      })
      this.init()
    },
    dialogH: function () {
      this.nameType = ''
    },
    certiLink: function (value) {
      this.certiLink = value
    },
  },
}
</script>

<style lang="scss" scoped></style>
