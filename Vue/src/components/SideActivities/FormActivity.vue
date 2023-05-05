<template>
  <div id="create-activity" :style="{ position: 'relative' }">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5 d-flex justify-space-between">
          <h2 class="d-flex">
            <v-icon @click="back()">arrow_back_ios</v-icon>
            <div class="d-flex align-center">Create new side activity</div>
          </h2>
        </div>
      </v-col>
    </v-row>
    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="primary"
      class="my-10"
    ></v-progress-linear>
    <v-form ref="formActivity" v-model="form">
      <v-row no-gutters class="pb-10" v-if="!isLoading">
        <v-col md="12">
          <div class="pa-6 pt-0 pl-10">
            <p class="mb-2" style="color: #000">Upload news cover</p>
            <div class="">
              <v-card
                height="280"
                :class="!image ? 'pt-5' : ''"
                elevation="0"
                :style="{ border: `1px dashed ${errorImg ? 'red' : '#dadbe6'}` }"
              >
                <v-card-title :class="'add-img'" class="justify-center mb-2" v-if="image">
                  <img :src="image" />
                </v-card-title>
                <v-card-title class="justify-center" v-if="!image">
                  <img src="@/assets/images/Vector.png" class="imageContent" />
                </v-card-title>
                <v-card-title class="justify-center pt-0" v-if="!image">
                  <p>Upload news cover</p>
                </v-card-title>
                <v-card-subtitle class="text-center" style="color: black">
                  <div>
                    <p>
                      <span>
                        <input
                          type="file"
                          @change="
                            fileInput = $event
                            onFileChange($event)
                          "
                          accept="image/*"
                          id="file-input2"
                        />
                      </span>
                      <span v-if="checkImage == true" style="color: red">
                        Image more than 10 Mb
                      </span>
                    </p>
                    <p style="color: #c0c0c0" v-if="!image">
                      Supported formats: JPEG, JPG, PNG. Maximum size 10 Mb
                    </p>
                  </div>
                </v-card-subtitle>
              </v-card>
              <p v-if="errorImg">This filed is require</p>
              <div>
                <v-row class="align-center mt-3">
                  <v-col cols="12">
                    <v-text-field
                      v-model="title"
                      :rules="[v => !!v || 'Item is required']"
                      label="Activity title *"
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4" class="pt-2 pb-2">
                    <v-autocomplete
                      v-model="activityTypeID"
                      :rules="[v => !!v || 'Item is required']"
                      :items="activitiesListType"
                      item-text="nameWithCode"
                      item-value="id"
                      outlined
                      label="Activity type *"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="7" clas2s="pt-2 pb-2">
                    <template>
                      <div class="text-center edit-type-activity">
                        <div
                          @click="openEditReward"
                          v-if="permission.cFull"
                          class="d-flex align-center"
                        >
                          <img
                            :style="{
                              color: '#246AFF',
                            }"
                            src="../../assets/images/icon-edit-underline-link.svg"
                            alt=""
                          />
                          <h4 class="link ml-2">Edit activity type</h4>
                        </div>
                      </div>
                    </template>
                  </v-col>
                  <v-col class="pt-2 pb-2" cols="4">
                    <v-text-field
                      label="Start date *"
                      v-model="startDate"
                      ref="startDate"
                      @input="$refs.endDate.validate()"
                      :rules="[
                        v => !!v || 'Item is required',
                        v => dayjs(v).isBefore(dayjs(endDate)),
                      ]"
                      outlined
                      type="date"
                    ></v-text-field>
                  </v-col>
                  <v-col class="pt-2 pb-2" cols="4">
                    <v-text-field
                      label="End date *"
                      v-model="endDate"
                      ref="endDate"
                      @input="$refs.startDate.validate()"
                      :rules="[
                        v => !!v || 'Item is required',
                        v => dayjs(v).isAfter(dayjs(startDate)),
                      ]"
                      outlined
                      type="date"
                    ></v-text-field>
                  </v-col>
                  <v-col class="pt-2 pb-2" cols="4">
                    <v-text-field
                      v-model="duration"
                      label="Duration *"
                      :rules="[v => !!v || 'Item is required']"
                      outlined
                    ></v-text-field>
                  </v-col>

                  <v-col class="pt-2 pb-2" cols="12">
                    <v-autocomplete
                      v-model="locationIDsSelect"
                      :rules="[v => v.length !== 0 || 'Item is required']"
                      outlined
                      :items="locationIDList"
                      item-text="location"
                      item-value="locationID"
                      label="Center *"
                      multiple
                    >
                      <template v-slot:prepend-item>
                        <v-list-item ripple @mousedown.prevent @click="toggle()">
                          <v-list-item-action>
                            <v-icon v-if="locationIDList.length == locationIDsSelect.length">
                              mdi-close-box
                            </v-icon>
                            <v-icon v-else> mdi-checkbox-blank-outline </v-icon>
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-title> Select All </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-autocomplete>
                  </v-col>
                </v-row>

                <div class="editor">
                  <span :style="{ color: errorEdittor ? 'red' : '' }">Content</span>
                  <vue-editor
                    useCustomImageHandler
                    @image-added="imgAdd"
                    @change="onChangeEdit"
                    :class="'mt-4'"
                    :style="{ border: errorEdittor ? '2px solid red' : '' }"
                    id="editor"
                    v-model="editor"
                  >
                  </vue-editor>
                  <p :style="{ color: 'red' }" v-if="errorEdittor">This field is require</p>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-form>
    <v-footer
      :style="{ position: 'sticky !important' }"
      height="60"
      style="width: 100%"
      color="#fff"
      class="pl-10 pr-10"
      v-if="!isLoading"
    >
      <div class="d-flex justify-end" style="width: 100%">
        <div class="d-flex align-center justify-space-between" style="width: 100%">
          <v-btn class="mr-3" @click="back()">Cancel</v-btn>
          <div>
            <v-btn
              class="mr-3"
              @click="
                dialog = true
                saveType = 'DRAFT'
                createNew()
              "
              :disabled="image && form && editor ? false : true"
              >Save as Draft</v-btn
            >
            <v-btn
              color="primary"
              @click="
                dialog = true
                saveType = 'PUBLIC'
                createNew()
              "
              :disabled="image && form && editor ? false : true"
              >Send public</v-btn
            >
          </div>
        </div>
      </div>
    </v-footer>
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
              <h3>Activity type</h3>
              <img
                @click="closeDialogType()"
                src="../../assets/images/icon-close.svg"
                alt=""
                srcset=""
              />
            </div>
            <v-divider></v-divider>
          </div>
          <v-divider></v-divider>
        </v-card-title>

        <v-card-text>
          <div class="d-flex" :style="{ width: '100%', flexWrap: 'wrap' }">
            <v-form
              class="d-flex justify-space-between"
              :style="{ width: '100%' }"
              ref="formType"
              v-model="formType"
            >
              <v-text-field
                dense
                v-model="codeType"
                label="Activity type code"
                outlined
                @input="errType = ''"
                @blur="$refs.formType.resetValidation()"
                :rules="[validateRequire]"
                :class="'hidden-detail-err pr-2'"
              ></v-text-field>
              <v-text-field
                dense
                v-model="nameType"
                label="Activity type name"
                outlined
                @blur="$refs.formType.resetValidation()"
                :rules="[validateRequire]"
                :class="'hidden-detail-err '"
              ></v-text-field>
              <v-btn
                :disabled="!formType"
                @click="saveActivitiesType()"
                class="ml-2"
                dense
                outlined
                color="primary"
              >
                <img src="../../assets/images/icon-plus-round2.svg" alt="" srcset="" class="mr-2" />
                <p>Add new</p>
              </v-btn>
            </v-form>
          </div>
          <p :style="{ color: 'red', width: '100%' }">{{ errType }}</p>
          <div
            :style="{
              maxHeight: '250px',
              overflowY: 'scroll',
              paddingTop: '3px',
            }"
          >
            <v-form ref="formTypeUpdate" v-model="formTypeUpdate">
              <template>
                <div
                  class="d-flex align-center"
                  v-for="(item, index) in activitiesListTypeUpdate"
                  :key="index"
                >
                  <v-text-field
                    :key="index"
                    dense
                    v-model="item.code"
                    :style="{ width: '10px' }"
                    outlined
                    label="Code"
                    :rules="[validateRequire]"
                    :class="'hidden-detail-input mr-1'"
                  ></v-text-field>
                  <v-text-field
                    :key="index"
                    dense
                    v-model="item.name"
                    outlined
                    label="Name"
                    :rules="[validateRequire]"
                    :class="'hidden-detail-input'"
                  ></v-text-field>
                </div>
              </template>
            </v-form>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="mr-2">
          <v-spacer></v-spacer>
          <v-btn outlined class="mb-2" @click="closeDialogType()"> Cancel </v-btn>
          <v-btn
            :disabled="!formTypeUpdate"
            color="primary"
            class="mb-2"
            @click="saveEditActivitiesType()"
          >
            Save for edit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent width="350">
        <v-card class="mx-auto pa-10">
          <div class="text-center">
            <v-btn
              elevation="0"
              height="36"
              class="pl-4 pr-4 mr-3 mb-5"
              :loading="dialog"
              style="background: white"
            >
            </v-btn>
          </div>
          <div class="text-center">
            <b style="font-size: 1.5rem">Creating!</b><br />
            <span>Please wait...</span>
          </div>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
//import { center_managerment } from '@/api/center-management.js'
import { news } from '@/api/news.js'
import { activities } from '@/api/activities'
import { VueEditor } from 'vue2-editor'
import dayjs from 'dayjs'
// const querystring = require("querystring");
import { getObjectPermission } from '../../common/index'
export default {
  components: {
    'vue-editor': VueEditor,
  },
  data() {
    return {
      errorImg: false,
      form: false,
      dayjs: dayjs,
      errType: '',
      formTypeUpdate: false,
      isLoading: false,
      idUpdate: this.$route.query.activityID ? this.$route.query.activityID : null,
      codeType: '',
      formType: false,
      locationIDsSelect: [],
      permission: getObjectPermission(408),
      dialogH: false,
      activitiesListType: [],
      activitiesListTypeUpdate: [],
      locationIDList: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
      centerId: this.$route.params.centerId,
      centerDetail: null,
      page: 1,
      nameType: '',
      items: [1, 2],
      pageCount: 0,
      itemsPerPage: 20,
      startDate: '',
      endDate: '',
      saveType: 'Draff',
      activityTypeID: null,
      duration: '',
      locationIDs: [],
      title: '',
      editor: '',
      status: '',
      fileInput: '',
      image: '',
      uploadFieldName: 'file',
      fileUpload: '',
      MAX_SIZE_IMAGE: 100,
      checkImage: false,
      dialog: false,
      errorEdittor: false,
      activityInfor: {},
    }
  },
  created() {
    if (this.idUpdate) {
      this.getActivityInfor()
    }

    this.getListTypeActivities()
  },
  mounted() {
    if (this.idUpdate) {
      this.$refs.formActivity.validate()
      this.$refs.startDate.validate()
      this.$refs.endDate.validate()
    }
  },
  methods: {
    toggle() {
      if (this.locationIDList.length === this.locationIDsSelect.length) {
        this.locationIDsSelect = []
      } else {
        this.locationIDsSelect = this.locationIDList.map(it => it.locationID)
      }
    },

    validateRequire(v) {
      return !!v || 'Required'
    },
    async getActivityInfor() {
      activities
        .getActivityByID(this.idUpdate)
        .then(res => {
          // coverImg: this.image,
          // startDate: this.startDate,
          // title: this.title,
          // endDate: this.endDate,
          // saveType: this.saveType,
          // activityTypeCode: this.activityTypeCode,
          // duration: this.duration,
          // locationIDs: this.locationIDsSelect.join(','),
          // content: this.editor,
          this.startDate = dayjs(res?.startDate).format('YYYY-MM-DD')
          this.endDate = dayjs(res?.endDate).format('YYYY-MM-DD')
          this.duration = res.duration
          this.locationIDsSelect = res.locationIDs.map(i => i.locationID)
          this.editor = res?.content
          this.saveType = res?.saveType
          this.image = res?.imgCover
          this.title = res?.title
          this.activityTypeID = res?.activityTypeID
        })
        .catch(() => {
          this.activityInfor = {}
        })
    },
    async saveActivitiesType() {
      this.$refs.formType.validate()
      if (this.formType) {
        await activities
          .createType({ name: this.nameType, code: this.codeType })
          .then(() => {
            this.getListTypeActivities()
          })
          .catch(() => {
            this.errType = 'This activity code type  is exists'
          })
          .finally(e => {
            console.log(e)
          })
      }
    },
    async saveEditActivitiesType() {
      this.$refs.formTypeUpdate.validate()
      if (this.$refs.formTypeUpdate.validate()) {
        this.activitiesListTypeUpdate.forEach(e => {
          ;(async function () {
            await activities.updateActivityType(e).then(() => {})
          })()
        })
        this.getListTypeActivities()
        this.dialogH = false
      }
    },
    async getListTypeActivities() {
      await activities
        .getListType()
        .then(res => {
          this.activitiesListType = res.map(res => {
            return {
              ...res,
              nameWithCode: res.name + ' - ' + res.code,
            }
          })
          this.activitiesListTypeUpdate = res.map(res => {
            return {
              ...res,
              nameWithCode: res.name + ' - ' + res.code,
            }
          })
        })
        .catch(() => {
          this.activitiesListType = []
        })
    },
    closeDialogType() {
      this.dialogH = false
    },
    openEditReward() {
      this.activitiesListTypeUpdate = this.activitiesListType
      this.dialogH = true
    },
    async imgAdd(file, Editor, cursorLocation, resetUploader) {
      var formData = new FormData()

      formData.append('objFile', file)

      await news
        .addAImage(formData)
        .then(result => {
          Editor.insertEmbed(cursorLocation, 'image', result)
          resetUploader()
        })
        .catch(err => {
          console.log(err)
        })
    },
    async createNew() {
      this.$refs.formActivity.validate()

      if (this.form && !this.errorEdittor && !this.errorImg) {
        const dataActivity = {
          coverImg: this.image,
          startDate: this.startDate,
          title: this.title,
          endDate: this.endDate,
          saveType: this.saveType,
          activityTypeID: this.activityTypeID,
          duration: this.duration,
          locationIDs: this.locationIDsSelect.join(','),
          content: this.editor,
        }
        if (this.idUpdate) {
          await activities
            .updateActivity({ ...dataActivity, activityID: this.idUpdate })
            .then(() => {
              this.back()
            })
        } else {
          await activities.createActivity(dataActivity).then(() => {
            this.back()
          })
        }
      }
      // var imagefile = document.querySelector('#file-input2')

      // var formData = new FormData()
      // console.log(this.imagefile)
      // formData.append('files', imagefile.files[0] ? imagefile.files[0] : null)
      // formData.append('Status', this.status)
      // formData.append('ContentText', this.editor)
      // formData.append('Title', this.title)

      // let formData = new FormData();
      // let file = this.fileInput.target.files[0];
      // formData.append("files", file);

      // let body = {
      //   Title: this.title,
      //   Status: this.status,
      //   ContentText: this.editor,
      // };
      // 2
      // center_managerment.CreateNew(formData).then(res => {
      //   if (res.mess.message == 'Success') {
      //     this.dialog = true
      //     setTimeout(() => {
      //       this.$router.push({ name: 'center-management-view-news' })
      //     }, 1000)
      //     this.dialog = false
      //   }
      // })
    },
    async onFileChange(e) {
      var size_image = e.target.files[0].size / 1024
      if (size_image > this.MAX_SIZE_IMAGE) {
        this.checkImage = true
      } else {
        this.checkImage = false
      }
      this.errorImg = false
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) return

      let formData = new FormData()

      formData.append('objFile', e.target.files[0] ? e.target.files[0] : null)
      await news.addAImage(formData).then(res => {
        console.log(res)
        this.image = res
      })
    },
    createImage(file) {
      var reader = new FileReader()
      var vm = this

      reader.onload = e => {
        vm.image = e.target.result
      }
      reader.readAsDataURL(file)
    },

    back() {
      window.history.back()
    },
  },
  watch: {
    image: function () {
      if (!this.image) {
        this.errorImg = true
      } else {
        this.errorImg = false
      }
    },
    editor: function () {
      if (!this.editor || this.editor.trim() === '') {
        this.errorEdittor = true
      } else {
        this.errorEdittor = false
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.add-img {
  height: 90%;
  img {
    height: 100%;
  }
}

.edit-type-activity {
  width: 200px;
  height: auto;
  img {
  }
}
.editor {
  position: relative;
  span {
    position: absolute;
    left: 0;
    top: 0;
    transform: translate(10px, -50%);
    background-color: #ffff;
    color: '#5E6368';
  }
}
</style>
