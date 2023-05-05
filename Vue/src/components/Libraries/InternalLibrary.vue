<template>
  <div class="absent" :style="{ maxHeight: '100vh' }">
    <div class="d-flex justify-space-between align-center mb-2">
      <h2>Internal Library</h2>
      <div v-if="permission.cFull && !hasSubFolder">
        <v-btn
          :disabled="isSelected()"
          @click="
            $router.push({
              name: 'add-reference',
              query: {
                libraryFolderID: libraryFolderID,
                path: pathToTarget,
              },
            })
          "
          color="#E3F2FD"
          :style="{ color: '#246AFF' }"
        >
          <img src="../../assets/images/icon-add-library.svg" alt="" srcset="" class="mr-1" />Add
          Reference</v-btn
        >
      </div>
    </div>
    <template>
      <div class="pb-3" :style="{ opacity: loading ? '1' : '0' }">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </div>
    </template>
    <template>
      <div class="d-flex">
        <div
          :style="{
            width: '30%',
            height: 'calc(100vh - 200px)',
          }"
        >
          <div
            v-if="permission.cFull"
            class="d-flex"
            :style="{
              //   position: 'fixed',
            }"
          >
            <h2 class="mr-3">Folders</h2>
            <v-btn depressed @click="addNode" color="#E3F2FD" class="mr-auto tree-btn">
              <img
                src="../../assets/images/icon-add-library.svg"
                alt=""
                srcset=""
                class="mr-1"
              />New Folder</v-btn
            >
          </div>
          <div :style="{ overflow: 'scroll', height: '100%' }">
            <vue-tree-list
              @click="onClick"
              @change-name="onChangeName"
              @delete-node="onDel"
              @add-node="onAddNode"
              @drop="onDrop"
              :model="treeList"
              :default-expanded="false"
            >
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
              <template v-slot:addTreeNodeIcon="slotProps">
                <span v-if="permission.cFull && !slotProps.model.hasReference" class="icon"
                  ><img src="../../assets/images/icon-add-folder.svg" alt=""
                /></span>
                <span v-else class="icon"></span>
              </template>
              <span class="icon" slot="addLeafNodeIcon"></span>
              <span v-if="permission.cFull" class="icon" slot="editNodeIcon"
                ><img src="../../assets/images/Vector.svg" alt=""
              /></span>
              <span v-else class="icon" slot="editNodeIcon"></span>
              <span v-if="permission.cFull" class="icon" slot="delNodeIcon"
                ><img src="../../assets/images/Delete.svg" alt=""
              /></span>
              <span v-else class="icon" slot="delNodeIcon"></span>
            </vue-tree-list>
          </div>
        </div>
        <div :style="{ width: '70%' }">
          <v-breadcrumbs
            :items="breadcrumb"
            :style="{
              color: '#FFCA28',
              padding: '8px',
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
            }"
          >
            <template v-slot:divider>
              <v-icon>mdi-chevron-right</v-icon>
            </template>
          </v-breadcrumbs>
          <v-data-table
            :headers="headers"
            :items="filtered"
            :items-per-page="1000000000000000"
            hide-default-footer
            class="elevation-0 absent-table"
            :id="'absent-table'"
            fixed-header
            height="69vh"
          >
            <!-- <template -->
            <template v-slot:header="{ props }">
              <tr class="fixed-row-filter">
                <th
                  v-for="header in props.headers"
                  :key="header.text"
                  :style="'width:' + header.width + '; min-width:' + header.width + ';'"
                >
                  <div v-if="filters.hasOwnProperty(header.value)">
                    <Autocomplete
                      v-if="filters.hasOwnProperty(header.value)"
                      @setFilter="setFilter"
                      :styleBorder="'border-bottom'"
                      :keyFilter="header.value"
                      :selectedInit="filters[header.value]"
                      :listItem="groupColumnValueList(header.value)"
                    />
                  </div>
                </th>
              </tr>
            </template>
            <template v-slot:[`item.referenceType`]="{ item }">
              <img
                :style="{ width: '17px', height: '17px' }"
                :src="getIconType(item.referenceType)"
                alt=""
                srcset=""
              />
            </template>
            <template v-slot:[`item.referenceName`]="{ item }">
              <a class="link" :href="item.referenceURL" target="_blank">{{ item.referenceName }}</a>
            </template>
            <template v-slot:[`item.action`]="{ item }">
              <div class="d-flex align-center">
                <v-tooltip v-if="permission.cFull || permission.cModify" top>
                  <template v-slot:activator="{ on, attrs }">
                    <img
                      v-bind="attrs"
                      v-on="on"
                      @click="editReference(item.referenceID)"
                      src="../../assets/images/icon-edit-pen.svg"
                      alt=""
                      srcset=""
                      class="btn-pointer"
                    />
                  </template>
                  <span>Edit</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <img
                      v-bind="attrs"
                      v-on="on"
                      class="ml-2 mr-2 btn-pointer"
                      @click=";(referenceID = item.referenceID), $refs.viewDetailReference.open()"
                      src="../../assets/images/icon-eye.svg"
                      alt=""
                      srcset=""
                    />
                  </template>
                  <span>View Reference</span>
                </v-tooltip>
                <v-tooltip v-if="permission.cFull" top>
                  <template v-slot:activator="{ on, attrs }">
                    <img
                      v-bind="attrs"
                      v-on="on"
                      @click="
                        $refs.confirmDeleteReference.open(), (deleteReferenceID = item.referenceID)
                      "
                      src="../../assets/images/icon-delete.svg"
                      alt=""
                      srcset=""
                      class="btn-pointer"
                    />
                  </template>
                  <span>Delete</span>
                </v-tooltip>
              </div>
            </template>
          </v-data-table>
        </div>
      </div>
    </template>
    <popup-confirm
      @confirm="confirmDeleteReference"
      :maxWidth="550"
      confirmText="Yes, delete it!"
      ref="confirmDeleteReference"
    >
      <v-card-title :class="'pt-0'" slot="icon">
        <div :style="{ margin: '0 auto' }">
          <img src="../../assets/images/icon-close-red.svg" alt="" srcset="" /></div
      ></v-card-title>
      <v-card-title :class="'pt-0 pb-0'" slot="title">
        <h2 :style="{ width: '100%' }" class="text-center">Confirm delete</h2>
      </v-card-title>
      <v-card-title :class="'pt-0'" slot="content">
        <p :style="{ width: '100%' }" class="text-center">
          Are you sure to delete this Reference? <br />
          You can not undo this action.
        </p>
      </v-card-title>
    </popup-confirm>
    <popup-confirm
      @confirm="confirmDeleteFolder"
      :maxWidth="580"
      confirmText="Yes, delete it!"
      ref="confirmDeleteFolder"
    >
      <v-card-title :class="'pt-0'" slot="icon">
        <div :style="{ margin: '0 auto' }">
          <img src="../../assets/images/icon-close-red.svg" alt="" srcset="" /></div
      ></v-card-title>
      <v-card-title :class="'pt-0 pb-0'" slot="title">
        <h2 :style="{ width: '100%' }" class="text-center">Confirm delete</h2>
      </v-card-title>
      <v-card-title :class="'pt-0'" slot="content">
        <p :style="{ width: '100%' }" class="text-center">
          Are you sure to delete this Folder and referencies in this folder?
        </p>
        <p :style="{ width: '100%' }" class="text-center">You can not undo this action.</p>
      </v-card-title>
    </popup-confirm>
    <PopupReference
      maxWidth="70vw"
      height="800"
      :referenceID="referenceID"
      ref="viewDetailReference"
    />
  </div>
</template>

<script>
import Autocomplete from '@/components/Utils/Autocomplete.vue'
import PopupConfirm from '@/components/Utils/PopupConfirm.vue'
import PopupReference from '@/components/Libraries/PopupReference.vue'

import dayjs from 'dayjs'
import { VueTreeList, Tree, TreeNode } from 'vue-tree-list'
import { referencies } from '@/api/referencies'
import { getObjectPermission } from '../../common/index'

export default {
  components: { Autocomplete, PopupReference, 'popup-confirm': PopupConfirm, VueTreeList },
  data() {
    return {
      listReferencies: [],
      libraryType: 'INTERNAL',
      dayjs: dayjs,
      permission: getObjectPermission(405),
      nodeID: 1,
      breadcrumb: [{ text: '' }],
      hasReference: false,
      hasSubFolder: false,
      pathLink: [],
      pathToTarget: '',
      isExpanded: true,
      folderName: '',
      referenceID: 0,
      parentFolderID: '',
      libraryFolderID: 0,
      treeData: [],
      treeList: new Tree([]),
      tagList: [],
      headers: [
        {
          text: 'Type',
          value: 'referenceType',
          sortable: false,
          width: '80px',
        },
        {
          text: 'Title of reference',
          value: 'referenceName',
          sortable: false,
          width: 'calc(100% - 80px - 60%)',
        },
        {
          text: 'Author name',
          value: 'authorNames',
          sortable: false,
          width: '15%',
        },
        {
          text: 'Category',
          value: 'referenceTagIDs',
          sortable: false,
          width: '20%',
        },
        {
          text: 'Upload date',
          value: 'updatedAt',
          sortable: false,
          width: '15%',
        },
        {
          text: 'Action',
          value: 'action',
          sortable: false,
          width: '10%',
        },
      ],
      deleteReferenceID: 0,
      deleteFolderID: 0,
      filters: {
        referenceType: [],
        referenceName: [],
        authorNames: [],
        referenceTagIDs: [],
        updatedAt: [],
      },
    }
  },

  computed: {
    filtered() {
      return this.listReferencies?.filter(d => {
        return Object.keys(this.filters).every(f => {
          return (
            this.filters[f].length < 1 ||
            (f === 'referenceTagIDs'
              ? this.filters[f].reduce((value, el) => {
                  if (d.referenceTagIDs.includes(el)) {
                    value = true
                  }
                  return value
                }, false)
              : this.filters[f].includes(d[f]))
          )
        })
      })
    },
  },
  created() {
    if (localStorage.getItem('refernence')) {
      this.filters = JSON.parse(localStorage.getItem('referenceFilter'))
    }

    this.init()
    console.log('Start fetching...')
  },

  watch: {
    treeData: () => {
      console.log(123)
    },
  },

  methods: {
    isSelected() {
      if (this.libraryFolderID === 0) return true
      else return false
    },

    onDel(node) {
      this.deleteFolderID = node.id
      this.$refs.confirmDeleteFolder.open()
    },

    onChangeName(params) {
      if (params.node) this.libraryFolderID = params.node.id
      if (params.node) {
        if (params.node.pid === 0) this.parentFolderID = null
        else this.parentFolderID = params.node.pid
      }
      const nodeData = {
        libraryFolderID: this.libraryFolderID,
        folderName: params.newName,
        libraryType: this.libraryType,
        parentFolderID: this.parentFolderID,
      }
      if (params.eventType) {
        this.updateFolder(nodeData)
      }
    },

    onAddNode(params) {
      this.hasSubFolder =  true
      const node = new TreeNode({ name: 'New folder', isLeaf: false })
      const nodeData = {
        folderName: node.name,
        libraryType: this.libraryType,
        parentFolderID: params.pid,
      }
      this.createFolder(nodeData)
    },
    onDrop(params) {
      const nodeData = {
        libraryFolderID: params.node.id,
        folderName: params.node.name,
        libraryType: this.libraryType,
        parentFolderID: params.node.pid,
      }
      this.hasSubFolder = params.children ? true : false
      this.updateFolder(nodeData)
    },

    onClick(params) {
      this.nodeID = params.id
      this.libraryFolderID = params.id
      this.setBreadcrumb(params)
      this.loading = true
      this.hasSubFolder = params.children ? true : false
      this.callDataWithLoading(this.nodeID)
      this.setPathLink(params)
    },

    addNode() {
      const node = new TreeNode({ name: 'New folder', isLeaf: false })
      const nodeData = {
        folderName: node.name,
        libraryType: this.libraryType,
        parentFolderID: null,
      }
      this.createFolder(nodeData)
    },

    async createFolder(data) {
      await referencies.createFolder(data).then(() => {
        this.callFolderWithNoLoading()
      })
    },
    async updateFolder(data) {
      await referencies.updateFolder(data).then(() => {
        this.callFolderWithNoLoading()
      })
    },

    editReference(id) {
      this.$router.push({
        name: 'edit-reference',
        query: {
          referenceID: id,
          path: this.pathToTarget,
          libraryType: this.libraryType,
        },
      })
    },
    confirmDeleteReference() {
      this.deleteReference()
    },
    async deleteReference() {
      await referencies.deleteReference(this.deleteReferenceID).then(() => {
        this.callDataWithNoLoading(this.libraryFolderID)
      })
    },
    confirmDeleteFolder() {
      this.deleteFolder()
    },

    async deleteFolder() {
      await referencies.deleteFolder(this.deleteFolderID).then(() => {
        this.callFolderWithNoLoading()
      })
    },
    viewDetailReference(referenceID) {
      this.$router.push({ name: 'Reference-detail', query: { referenceID } })
    },
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
      localStorage.setItem('referenceFilter', JSON.stringify(this.filters))
    },
    groupColumnValueList(val) {
      if (val === 'referenceTagIDs') {
        return [
          ...new Set(
            this.listReferencies
              .reduce((a, c) => [...a, c[val]], [])
              .map(c => (c.includes(',') ? c.split(',') : c))
              .flat()
              .map(c => c.trim())
          ),
        ]
      }
      return this.listReferencies.map(d => d[val]).filter(y => y)
    },

    //add new key-value to api
    addKeyValue(node) {
      node.libraryType = this.libraryType
      if (node.children) {
        for (const child of node.children) {
          this.addKeyValue(child)
        }
      }
    },

    //add libraryType to all the node
    addType(data) {
      data.forEach(node => {
        this.addKeyValue(node)
      })
    },

    //modify the oldkey to custom key vue-tree-list want
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

    //Add parentid key-value for the database
    // eslint-disable-next-line no-unused-vars
    assignParentId(node, parentId) {
      if (node.children) {
        for (const child of node.children) {
          child.pid = node.id
          this.assignParentId(child, node.id)
        }
      }
    },

    //Set breadcrumb for the table header
    setBreadcrumb(params) {
      this.breadcrumb = [params.name]
      let parent = params.parent
      while (parent.name !== 'root') {
        this.breadcrumb.unshift(parent.name)
        parent = parent.parent
      }
      this.breadcrumb = this.breadcrumb.reduce((acc, cur) => {
        return [...acc, { text: `📁 ${cur}` }]
      }, [])
    },
    setPathLink(params) {
      this.pathLink = [params.name]
      let parent = params.parent
      while (parent.name !== 'root') {
        this.pathLink.unshift(parent.name)
        parent = parent.parent
      }
      this.pathToTarget = this.pathLink.join('/')
    },
    async init() {
      this.loading = true
      this.callFolderWithLoading()
      this.getTagList()
    },


    async callFolderWithLoading() {
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
        this.loading = false
      })
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

    async callDataWithLoading(libraryFolderID) {
      await referencies.getReferenceByFolderID(libraryFolderID).then(res => {
        if (res)
          this.listReferencies = res.map(reference => {
            return {
              ...reference,
              referenceTagIDs: reference.referenceTagIDs
                ? this.tagList
                    .filter(e => reference.referenceTagIDs.includes(e.referenceTagID))
                    .map(e => e.referenceTagName)
                    .join(', ')
                : '',
              updatedAt: reference.updatedAt ? dayjs(reference.updatedAt).format('DD/MM/YYYY') : '',
            }
          })
        this.loading = false
      })
    },

    async callDataWithNoLoading(libraryFolderID) {
      await referencies.getReferenceByFolderID(libraryFolderID).then(res => {
        if (res)
          this.listReferencies = res.map(reference => {
            return {
              ...reference,
              referenceTagIDs: reference.referenceTagIDs
                ? this.tagList
                    .filter(e => reference.referenceTagIDs.includes(e.referenceTagID))
                    .map(e => e.referenceTagName)
                    .join(', ')
                : '',
              updatedAt: reference.updatedAt ? dayjs(reference.updatedAt).format('DD/MM/YYYY') : '',
            }
          })
      })
    },

    async getTagList() {
      await referencies.getTaglist().then(res => {
        if (res) this.tagList = res
      })
    },

    getIconType(type) {
      switch (type) {
        case 'video':
          return require('../../assets/images/icon-type-video.svg')
        case 'image':
          return require('../../assets/images/icon-type-image.svg')
        case 'pdf':
          return require('../../assets/images/icon-type-pdf.svg')
        case 'word':
          return require('../../assets/images/icon-type-word.svg')
        case 'audio':
          return require('../../assets/images/icon-type-audio.svg')
        case 'excel':
          return require('../../assets/images/icon-type-excel.svg')
        default:
          return require('../../assets/images/icon-type-pp.png')
      }
    },
  },
}
</script>

<style lang="scss" rel="stylesheet/scss">
// .v-breadcrumbs__item {
//   color: ;
// }
.vtl {
  .vtl-tree-margin {
    margin-left: 8px;
  }
  .vtl-node-main {
    .vtl-node-content {
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1; /* number of lines to show */
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .vtl-operation {
      margin-left: 0;
      letter-spacing: 0;
    }
  }
  .vtl-node-content {
    margin-right: auto;
  }

  .vtl-drag-disabled {
    background-color: #d0cfcf;
    &:hover {
      background-color: #d0cfcf;
    }
  }
  .vtl-disabled {
    background-color: #d0cfcf;
  }
}
</style>

<style lang="scss" scoped>
.active-node {
  color: #0b2585;
  font-weight: 700;
}

.active-path {
  fill: #0b2585;
}
.icon {
  margin-right: 4px;
  &:hover {
    cursor: pointer;
  }
}

.muted {
  color: gray;
  font-size: 80%;
}

.lesson-type {
  width: 80px;
  height: 30px;
  color: #ffff;
  line-height: 30px;
  border-radius: 4px;
  text-align: center;

  &.type-public {
    background: #27ae60;
  }
  &.type-makup {
    background: #f6b91a;
  }
}
.absent-btn-download {
  width: fit-content;
  margin-left: auto;
}
.select-input {
  max-width: 200px;
  margin-right: 20px !important;
}
h4 {
  margin-bottom: 14px;
}
h2 {
  margin-bottom: 20px;
}
.status {
  color: #fff;
  text-align: center;
  width: 80px;
  border-radius: 4px;
  padding: 3px 10px;
}
.absent {
  padding: 20px 36px;
}
.absent-table {
  border-radius: 5px;
  overflow: hidden;
}
.btn-download {
  width: fit-content;
  margin-left: auto;
}

.tree-btn {
  max-height: fit-content !important;
  padding: 0 4px !important;
  color: #246aff !important;
}
.link {
  cursor: pointer;

  color: #427df2 !important;
}

.link:hover {
  text-decoration: underline;
  font-weight: 700;
}
.btn-pointer:hover {
  cursor: pointer;
}
</style>
