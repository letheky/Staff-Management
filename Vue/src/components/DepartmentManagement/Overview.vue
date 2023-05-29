<template>
  <div class="absent" :style="{ maxHeight: '100vh' }">
    <div class="d-flex justify-space-between align-center mb-2">
      <h2>Danh sách phòng ban</h2>
      <div v-if="roleid === 1">
        <v-btn
          @click="
            $router.push({
              name: 'department-add-new',
            })
          "
          color="#E3F2FD"
          :style="{ color: '#246AFF' }"
        >
          <img src="../../assets/images/icon-add-library.svg" alt="" srcset="" class="mr-1" />Thêm
          phòng ban</v-btn
        >
      </div>
    </div>
    <div>
      <h3>Tổng số {{ filtered.length }} phòng ban</h3>
    </div>
    <template>
      <div class="pb-3" :style="{ opacity: loading ? '1' : '0' }">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </div>
    </template>

    <template>
      <v-data-table
        :headers="headers"
        :items="filtered"
        :page.sync="page1"
        :items-per-page="itemsPerPage1"
        @page-count="pageCount = $event"
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
        <template v-slot:[`item.no`]="{ index }">
           <p>{{ index + 20 * (page1 - 1) + 1 }}</p>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <div class="d-flex align-center">
            <v-tooltip v-if="roleid === 1 || roleid === 2" top>
              <template v-slot:activator="{ on, attrs }">
                <img
                  v-bind="attrs"
                  v-on="on"
                  @click="editReference(item.departmentID)"
                  src="../../assets/images/icon-edit-pen.svg"
                  alt=""
                  srcset=""
                  class="btn-pointer"
                />
              </template>
              <span>Edit</span>
            </v-tooltip>
            <v-tooltip v-if="roleid === 1" top>
              <template v-slot:activator="{ on, attrs }">
                <img
                  v-bind="attrs"
                  v-on="on"
                  @click="$refs.confirmDeleteTopic.open(), (deleteResearchID = item.departmentID)"
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
      <div v-if="!isLoading" color="#fff" class="pl-10 mt-3 pr-10">
        <div :style="{ zIndex: '120' }" class="d-flex align-center justify-space-between">
          <div
            :style="{
              width: '150px',
            }"
          >
            <v-select
              outlined
              hide-details
              dense
              :value="itemsPerPage1"
              :items="[20, 50, 100, 200]"
              @change="itemsPerPage1 = parseInt($event, 10)"
              style="height: 32px"
            ></v-select>
          </div>

          <v-pagination
            v-model="page1"
            :length="Math.ceil(filtered.length.toFixed() / itemsPerPage1)"
            :total-visible="7"
            elevation="0"
          ></v-pagination>
        </div>
      </div>
    </template>
    <popup-confirm
      @confirm="confirmDeleteTopic"
      :maxWidth="550"
      confirmText="Yes, delete it!"
      ref="confirmDeleteTopic"
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
          Bạn có muốn xóa phòng ban này không? <br />
          Dữ liệu không thể khôi phục.
        </p>
      </v-card-title>
    </popup-confirm>
  </div>
</template>

<script>
import Autocomplete from '@/components/Utils/Autocomplete.vue'
import PopupConfirm from '@/components/Utils/PopupConfirm.vue'
// import PopupReference from '@/components/Libraries/PopupReference.vue'

import dayjs from 'dayjs'
import { department } from '@/api/department'
// import { instructor } from '@/api/instructor'
// import { circular } from '@/api/circular'

export default {
  components: { 'popup-confirm': PopupConfirm, Autocomplete: Autocomplete },
  data() {
    return {
      page1: 1,
      pageCount: 0,
      itemsPerPage1: 20,
      listTopic: [],
      instructorList: [],
      circularList: [],
      dayjs: dayjs,
      roleid: JSON.parse(localStorage.getItem('currentUser')).user.roleid,
      headers: [
        {
          text: 'STT',
          value: 'no',
          sortable: false,
          width: '40px',
        },
        {
          text: 'Tên phòng ban',
          value: 'departmentName',
          sortable: false,
          width: '150px',
        },
        {
          text: 'Địa chỉ',
          value: 'address',
          sortable: false,
          width: '100px',
        },
        {
          text: 'Số điện thoại',
          value: 'phoneNum',
          sortable: false,
          width: '100px',
        },
        {
          text: 'Ngày tạo',
          value: 'createdAt',
          sortable: false,
          width: '10%',
        },
        {
          text: 'Ngày cập nhật',
          value: 'updatedAt',
          sortable: false,
          width: '10%',
        },
        {
          text: 'Action',
          value: 'action',
          sortable: false,
          width: '5%',
        },
      ],
      deleteResearchID: 0,
      filters: {
        departmentName: [],
        phoneNum: [],
        createdAt: [],
        updatedAt: [],
      },
      researchLevelList: ['Bộ môn, Khoa, Trường, Tỉnh, Bộ, Nhà nước'],
    }
  },

  computed: {
    filtered() {
      return this.listTopic?.filter(d => {
        return Object.keys(this.filters).every(f => {
          return (
            this.filters[f].length < 1 ||
            (f === 'members'
              ? this.filters[f].reduce((value, el) => {
                  if (d.members.includes(el)) {
                    value = true
                  }
                  return value
                }, false)
              : f === 'councilMembers'
              ? this.filters[f].reduce((value, el) => {
                  if (d.councilMembers.includes(el)) {
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
    if (localStorage.getItem('research')) {
      this.filters = JSON.parse(localStorage.getItem('researchFilter'))
    }
    // this.getInstructor()
    // this.getCircular()
    this.init()
    console.log('Start fetching...')
  },

  watch: {},

  methods: {
    editReference(id) {
      this.$router.push({
        name: 'department-add-new',
        query: {
          researchID: id,
        },
      })
    },
    async getCircular() {
      this.circularList = await department.getAllDepartment()
    },
    async getInstructor() {
      this.instructorList = await department.getAllDepartment()
    },
    confirmDeleteTopic() {
      this.deleteTopic()
    },
    async deleteTopic() {
      await department.deletedepartment(this.deleteResearchID).then(() => {
        this.callDataWithNoLoading()
      })
    },
    containsNumber(string) {
      var pattern = /\d+/ // Match one or more digits
      return pattern.test(string)
    },
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
      localStorage.setItem('researchFilter', JSON.stringify(this.filters))
    },
    groupColumnValueList(val) {
      if (val === 'members' || val === 'councilMembers') {
        return [
          ...new Set(
            this.listTopic
              .reduce((a, c) => [...a, c[val]], [])
              .map(c => (c.includes(',') ? c.split(',') : c))
              .flat()
              .map(c => c.trim())
          ),
        ]
      }
      return this.listTopic.map(d => d[val]).filter(y => y)
    },

    async init() {
      this.loading = true
      this.callDataWithLoading()
    },

    async callDataWithLoading() {
      await department.getAllDepartment().then(res => {
        if (res)
          this.listTopic = res.map(topic => {
            return {
              ...topic,
              gender: topic.gender ? 'Nam' : 'Nữ',
              isActive: topic.isActive ? 'Đang làm' : 'Đã nghỉ',
              isHighLevelTeacher: topic.isHighLevelTeacher ? 'Có' : 'Không',
              salary: topic.salary + ' Triệu đồng',
              insuranceContribution: topic.insuranceContribution + ' năm',
              dob: topic.dob ? dayjs(topic.dob).format('DD/MM/YYYY') : '',
              joiningDate: topic.joiningDate ? dayjs(topic.joiningDate).format('DD/MM/YYYY') : '',
            }
          })
        this.loading = false
      })
    },

    async callDataWithNoLoading() {
      await department.getAllDepartment().then(res => {
        if (res)
          this.listTopic = res.map(topic => {
            return {
              ...topic,
              gender: topic.gender ? 'Nam' : 'Nữ',
              isActive: topic.isActive ? 'Còn làm' : 'Đã nghỉ',
              isHighLevelTeacher: topic.isHighLevelTeacher ? 'Có' : 'Không',
              salary: topic.salary + ' Triệu đồng',
              insuranceContribution: topic.insuranceContribution + ' năm',
              dob: topic.dob ? dayjs(topic.dob).format('DD/MM/YYYY') : '',
              joiningDate: topic.joiningDate ? dayjs(topic.joiningDate).format('DD/MM/YYYY') : '',
            }
          })
      })
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
