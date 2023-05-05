<template>
  <div id="create-activity" :style="{ position: 'relative' }">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5 d-flex justify-space-between">
          <h2 class="d-flex">
            <v-icon @click="back()">arrow_back_ios</v-icon>
            <div class="d-flex align-center">Add Reference</div>
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
    <v-form ref="formReference" v-model="form">
      <v-row no-gutters class="pb-10" v-if="!isLoading">
        <v-col md="12">
          <div class="pa-6 pt-0 pl-10">
            <div class="">
              <div>
                <v-row class="align-center mt-3">
                  <v-col cols="8">
                    <v-text-field
                      v-model="pathLink"
                      outlined
                      :isLoading="isLoading"
                      disabled="true"
                      label="Location in library *"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field
                      v-model="TitleOfReference"
                      outlined
                      :loading="isLoading"
                      :disabled="isLoading"
                      :rules="[v => !!v || 'This field is required']"
                      label="Title of reference *"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field
                      v-model="referenceUrl"
                      outlined
                      :loading="isLoading"
                      :disabled="isLoading"
                      :rules="[validateURL]"
                      label="Reference url *"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <span
                      ><h4 color="#949494" class="d-inline mr-1">Type:</h4>
                      <p class="d-inline">Video, pdf, word, image, audio, powerpoint, excel</p>
                      <br />
                      <h4 color="#949494" class="d-inline mr-1">Source:</h4>
                      <p class="d-inline">link google drive, youtube</p></span
                    >
                  </v-col>
                  <v-col cols="8">
                    <v-combobox
                      v-model="typeOfReference"
                      :items="listOfType"
                      :rules="[validateType]"
                      outlined
                      clearable
                      item-text="listItem"
                      item-value="listItemValue"
                      label="Type of reference *"
                    ></v-combobox>
                    <v-text-field
                      v-model="authorNames"
                      outlined
                      :loading="isLoading"
                      :disabled="isLoading"
                      label="Author's name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="5" class="pt-2 pb-2">
                    <v-autocomplete
                      v-model="categoryIDs"
                      :items="catList"
                      item-text="referenceTagName"
                      item-value="referenceTagID"
                      outlined
                      multiple
                      label="Categories"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="6" class="pt-2 pb-2">
                    <template>
                      <div class="text-center edit-reference-category">
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
                          <h4 class="link ml-2">Edit reference categories</h4>
                        </div>
                      </div>
                    </template>
                  </v-col>
                </v-row>

                <div class="editor">
                  <span>Reference description</span>
                  <vue-editor class="mt-4" id="editor" v-model="editor"> </vue-editor>
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
        <div class="d-flex flex-row-reverse align-center" style="width: 100%">
          <v-btn class="mr-3" color="primary" @click="createNew()" :disabled="form ? false : true"
            >Save</v-btn
          >
          <v-btn class="mr-3" @click="back()">Cancel</v-btn>
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
              <h3>Categories</h3>
              <img
                @click="closeDialogCategory()"
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
              class="d-flex"
              :style="{ width: '100%' }"
              ref="formCategory"
              v-model="formCategory"
            >
              <v-text-field
                dense
                v-model="catName"
                label="Category name"
                outlined
                @input="errCatName = ''"
                @blur="$refs.formCategory.resetValidation()"
                :rules="[validateRequire]"
                :class="'hidden-detail-err '"
              ></v-text-field>
              <v-btn
                :disabled="!formCategory"
                @click="saveCategory()"
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
          <p :style="{ color: 'red', width: '100%' }">{{ errCatName }}</p>
          <div
            :style="{
              maxHeight: '250px',
              overflowY: 'scroll',
              paddingTop: '3px',
            }"
          >
            <v-form ref="formCategoryList" v-model="formCategoryList">
              <template>
                <div
                  class="d-flex align-center"
                  v-for="(item, index) in catListUpdate"
                  :key="index"
                >
                  <v-text-field
                    :key="index"
                    dense
                    v-model="item.referenceTagName"
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
          <v-btn outlined class="mb-2" @click="closeDialogCategory()"> Cancel </v-btn>
          <v-btn
            :disabled="!formCategoryList"
            color="primary"
            class="mb-2"
            @click="saveEditCategoryList()"
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
import { referencies } from '@/api/referencies'
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
      form: false,
      dayjs: dayjs,
      formCategoryList: false,
      errCatName: '',
      isLoading: false,
      formCategory: false,
      libFolderID: this.$route.query.libraryFolderID,
      pathLink: this.$route.query.path,
      permission: getObjectPermission(408),
      catID: null,
      catName: '',
      catList: [],
      editor: '',
      catListUpdate: [],
      dialogH: false,
      dialog: false,
      errorEdittor: false,
      TitleOfReference: '',
      referenceUrl: '',
      listOfType: ['video', 'image', 'pdf', 'word', 'audio', 'powerpoint', 'excel'],
      typeOfReference: '',
      authorNames: '',
      categoryIDs: [],
      reference: {},
    }
  },
  created() {
    this.getCategoryList()
  },
  mounted() {
    this.$refs.formReference.validate()
  },
  methods: {
    validateRequire(v) {
      return !!v || 'Required'
    },
    validateURL(value) {
      if (!value) {
        return 'URL is required'
      } else {
        return true
      }
    },
    validateType(value) {
      const isMatch = this.listOfType.includes(value)
      if (!value) {
        return 'Reference type is required'
      } else if (!isMatch) {
        return 'Please enter a valid type'
      } else {
        return true
      }
    },
    async saveCategory() {
      this.$refs.formCategory.validate()
      if (this.formCategory) {
        await referencies
          .createTag({ referenceTagName: this.catName })
          .then(() => {
            this.getCategoryList()
          })
          .catch(() => {
            this.errCatName = 'This activity code type  is exists'
          })
        // .finally(e => {
        //   console.log(e)
        // })
      }
    },
    async saveEditCategoryList() {
      this.$refs.formCategoryList.validate()
      if (this.$refs.formCategoryList.validate()) {
        this.catListUpdate.forEach(e => {
          const object = {
            refenceTagID: e.referenceTagID,
            referenceTagName: e.referenceTagName,
          }
          ;(async function () {
            await referencies.updateTag(object)
          })()
        })
        this.getCategoryList()
        this.dialogH = false
      }
    },
    async getCategoryList() {
      await referencies
        .getTaglist()
        .then(res => {
          this.catList = res
          this.catListUpdate = res
        })
        .catch(() => {
          this.catList = []
        })
      // .finally(() => {
      //   console.log(this.catList)
      // })
    },
    closeDialogCategory() {
      this.dialogH = false
    },
    openEditReward() {
      this.catListUpdate = this.catList
      this.dialogH = true
    },
    async createNew() {
      this.$refs.formReference.validate()

      if (this.form && !this.errorEdittor && !this.errorImg) {
        const dataActivity = {
          referenceName: this.TitleOfReference,
          libraryFolderID: this.libFolderID,
          referenceURL: this.referenceUrl,
          referenceType: this.typeOfReference,
          referenceTagIDs: this.categoryIDs,
          authorNames: this.authorNames,
          referenceDescription: this.editor,
        }
        // console.log(dataActivity)
        await referencies.createReference(dataActivity).then(() => {
          this.back()
        })
      }
    },
    back() {
      window.history.back()
    },
  },
  watch: {},
}
</script>
<style lang="scss" scoped>
.message::before {
  content: '';
  position: absolute;
  margin-top: -6px;
  margin-left: -5px;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 12px solid #717ec8;
  transform: rotate(270deg);
  left: -13px;
  top: 45%;
}
.add-img {
  height: 90%;
  img {
    height: 100%;
  }
}

.edit-reference-category {
  width: 200px;
  height: auto;
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
