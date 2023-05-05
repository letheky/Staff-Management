<template>
  <div id="create-activity" :style="{ position: 'relative' }">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5 d-flex justify-space-between">
          <h2 class="d-flex">
            <v-icon @click="back()">arrow_back_ios</v-icon>
            <div class="d-flex align-center">Edit Reference</div>
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
                      label="Location in library *"
                      disabled="true"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <a :style="{ textDecoration: 'underline' }" @click="treeFolder = true"
                      >Chọn đường dẫn mới để lưu thư mục</a
                    >
                  </v-col>
                  <v-col cols="8">
                    <v-text-field
                      v-model="TitleOfReference"
                      outlined
                      :rules="[v => !!v || 'This field is required']"
                      label="Title of reference *"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field
                      v-model="referenceUrl"
                      outlined
                      :rules="[requiredRule]"
                      label="Reference url *"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <span
                      ><h4 color="#949494" class="d-inline mr-1">Type:</h4>
                      <p class="d-inline">Video, PDF, Word, Image, Audio, PowerPoint, Excel</p>
                      <br />
                      <h4 color="#949494" class="d-inline mr-1">Source:</h4>
                      <p class="d-inline">link google drive, youtube</p></span
                    >
                  </v-col>
                  <v-col cols="8">
                    <v-combobox
                      v-model="typeOfReference"
                      :items="listOfType"
                      :rules="[rules.required]"
                      outlined
                      clearable
                      item-text="listItem"
                      item-value="listItemValue"
                      label="Type of reference *"
                    ></v-combobox>
                    <v-text-field
                      v-model="authorNames"
                      outlined
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
                  <vue-editor :class="'mt-4'" id="editor" v-model="editor"> </vue-editor>
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
          <v-btn class="mr-3" color="primary" @click="saveEdit()" :disabled="form ? false : true"
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
    <v-dialog v-model="treeFolder" width="400" height="400" ref="viewTreeFolder">
      <v-card class="pa-5">
        <div class="header d-flex">
          <div class="header-left mr-auto">
            <h3 class="d-inline-block">Chọn đường dẫn mới</h3>
          </div>
          <v-btn color="primary" dark icon @click="treeFolder = false"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </div>
        <hr />
        <vue-tree-list @click="onClick" :model="treeList" :default-expanded="false">
          <template v-slot:leafNameDisplay="slotProps">
            <span :class="{ 'active-node': slotProps.model.id === nodeID }">
              {{ slotProps.model.name }}
            </span>
          </template>
          <template v-slot:treeNodeIcon="slotProps">
            <span class="icon"
              ><svg
                width="16"
                height="13"
                viewBox="0 0 16 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  :class="{ 'active-path': slotProps.model.id === nodeID }"
                  d="M14.5882 1.97694H8.09098L6.79686 0.438115C6.75824 0.391684 6.70035 0.365645 6.64 0.367527H1.41177C0.629177 0.375292 -0.000900994 1.01235 9.67162e-07 1.79498V11.2067C-3.82485e-05 11.9887 0.629805 12.6249 1.41177 12.6326H14.5882C15.3702 12.6249 16 11.9887 16 11.2067V3.40282C16 2.62082 15.3702 1.9847 14.5882 1.97694Z"
                  fill="#C5C5C5"
                />
              </svg>
            </span>
          </template>
          <span class="icon" slot="addTreeNodeIcon"> </span>
          <span class="icon" slot="addLeafNodeIcon"></span>
          <span class="icon" slot="editNodeIcon"></span>
          <span class="icon" slot="delNodeIcon"></span>
        </vue-tree-list>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
//import { center_managerment } from '@/api/center-management.js'
import { VueTreeList, Tree } from 'vue-tree-list'
import { referencies } from '@/api/referencies'
import { VueEditor } from 'vue2-editor'
import dayjs from 'dayjs'
// const querystring = require("querystring");
import { getObjectPermission } from '../../common/index'
export default {
  components: {
    'vue-editor': VueEditor,
    VueTreeList,
  },
  data() {
    return {
      form: false,
      dayjs: dayjs,
      treeFolder: false,
      formCategoryList: false,
      errCatName: '',
      isLoading: false,
      formCategory: false,
      libraryFolderID: '',
      referenceID: this.$route.query.referenceID,
      libraryType: this.$route.query.libraryType,
      pathLink: this.$route.query.path,
      permission: getObjectPermission(408),
      catID: null,
      catName: '',
      catList: [],
      editor: '',
      catListUpdate: [],
      treeData: [],
      treeList: new Tree([]),
      dialogH: false,
      dialog: false,
      TitleOfReference: '',
      referenceUrl: '',
      listOfType: ['video', 'image', 'pdf', 'word', 'audio', 'powerpoint', 'excel'],
      typeOfReference: '',
      authorNames: '',
      categoryIDs: [],
      referenceData: [],
      rules: {
        required: value => !!value || 'This field is required.',
      },
    }
  },
  created() {
    this.getCategoryList()
    this.callFolderWithNoLoading()
    this.getReference()
    console.log(this.treeData)
  },
  mounted() {
    this.$refs.formReference.validate()
  },
  methods: {
    validateRequire(v) {
      return !!v || 'Required'
    },
    onClick(params) {
      this.libraryFolderID = params.id
      this.setPathLink(params)
      this.treeFolder = false
      // console.log(this.breadcrumb)
    },
    setPathLink(params) {
      this.pathToTarget = [params.name]
      let parent = params.parent
      while (parent.name !== 'root') {
        this.pathToTarget.unshift(parent.name)
        parent = parent.parent
      }
      this.pathLink = this.pathToTarget.join('/')
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
          ;(async function () {
            await referencies.updateTag(e)
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

    async getReference() {
      await referencies.getReferenceByID(this.referenceID).then(res => {
        this.libraryFolderID = res.libraryFolderID
        this.TitleOfReference = res.referenceName
        this.referenceUrl = res.referenceURL
        this.typeOfReference = res.referenceType
        this.authorNames = res.authorNames
        this.categoryIDs = res.referenceTagIDs
        this.editor = res.referenceDescription
      })
    },
    closeDialogCategory() {
      this.dialogH = false
    },
    openEditReward() {
      this.catListUpdate = this.catList
      this.dialogH = true
    },
    async saveEdit() {
      this.$refs.formReference.validate()

      if (this.form && !this.errorImg) {
        const dataReference = {
          referenceID: this.referenceID,
          referenceName: this.TitleOfReference,
          libraryFolderID: this.libraryFolderID,
          referenceURL: this.referenceUrl,
          referenceType: this.typeOfReference,
          referenceTagIDs: this.categoryIDs,
          authorNames: this.authorNames,
          referenceDescription: this.editor,
        }
        // console.log(dataActivity)
        await referencies.updateReference(dataReference).then(() => {
          this.back()
        })
      }
    },
    back() {
      window.history.back()
    },

    async callFolderWithNoLoading() {
      await referencies.getFolderByLibType(this.libraryType).then(res => {
        this.modifyKeyNames(
          res,
          ['libraryFolderID', 'folderName', 'childrens', 'parentFolderID'],
          ['id', 'name', 'children', 'pid']
        )
        for (const treeNode of res) {
          this.assignParentId(treeNode, null)
        }
        this.addType(res)
        this.treeData = res
        this.treeList = new Tree(res)
      })
    },
    // eslint-disable-next-line no-unused-vars
    assignParentId(node, parentId) {
      if (node.children) {
        for (const child of node.children) {
          child.pid = node.id
          this.assignParentId(child, node.id)
        }
      }
    },
    addType(data) {
      data.forEach(node => {
        this.addKeyValue(node)
      })
    },
    modifyKeyNames(node, oldKeys, newKeys) {
      for (const oldKey in node) {
        const value = node[oldKey]
        const index = oldKeys.indexOf(oldKey)
        if (index !== -1) {
          const newKey = newKeys[index]
          node[newKey] = value
          delete node[oldKey]
        }
        if (typeof value === 'object') {
          this.modifyKeyNames(value, oldKeys, newKeys)
        }
      }
    },
    addKeyValue(node) {
      node.libraryType = this.libraryType

      if (node.children) {
        for (const child of node.children) {
          this.addKeyValue(child)
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.icon {
  margin-right: 4px;
  &:hover {
    cursor: pointer;
  }
}
.active-node {
  color: #0b2585;
  font-weight: 700;
}

.active-path {
  fill: #0b2585;
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
