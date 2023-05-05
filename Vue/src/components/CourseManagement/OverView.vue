<template>
  <div id="course-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <h2 class="mb-10">Course management</h2>
          <!-- <div class="d-flex justify-space-between">
            <div> -->
          <!-- <v-row>
            <v-col cols="3">
              <v-autocomplete
                label="Filter by Department"
                outlined
                :items="departments"
                item-text="department"
                item-value="departmentID"
                v-model="departmentID"
                @change="filter()"
                dense
              ></v-autocomplete>
            </v-col>
            <v-col cols="3">
              <v-autocomplete
                label="Filter by Programme"
                outlined
                :items="programmes"
                item-text="programme"
                item-value="programmeID"
                v-model="programmeID"
                @change="filter()"
                dense
              ></v-autocomplete>
            </v-col>
          </v-row> -->
          <v-progress-linear
            v-if="isLoading"
            indeterminate
            color="primary"
            class="my-10"
          ></v-progress-linear>
          <v-data-table
            v-if="!isLoading"
            :headers="headers"
            :items="filtered"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            hide-default-header
            hide-default-footer
            @page-count="pageCount = $event"
            class="elevation-0"
            fixed-header
            height="65vh"
          >
            <template v-slot:header="{ props }">
              <thead class="v-data-table-header">
                <tr>
                  <th
                    v-for="header in props.headers"
                    :key="header.text"
                    role="columnheader"
                    scope="col"
                    aria-label="No"
                    class="text-start font-weight-bold"
                    :style="'width:' + header.width + '; min-width:' + header.width + ';'"
                  >
                    <span>{{ header.text }}</span>
                  </th>
                </tr>
              </thead>
              <tr class="fixed-row-filter">
                <th v-for="header in props.headers" :key="header.text">
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
              {{ index + 1 }}
            </template>

            <template v-slot:[`item.photo`]="{ item }">
              <img
                class="d-flex align-center"
                v-if="item.photo"
                :src="'data:image/jpeg;base64,' + item.photo"
                height="60"
                width="100%"
                style="object-fit: contain"
              />
              <v-icon size="40" v-else> image </v-icon>
            </template>

            <template v-slot:[`item.inactive`]="{ item }">
              <v-chip small v-if="item.inactive == 'Inactive'" color="rgba(247, 119, 26, 0.1)">{{
                item.inactive
              }}</v-chip>
              <v-chip small v-else color="rgba(36, 106, 255, 0.1)">{{ item.inactive }}</v-chip>
            </template>

            <template v-slot:[`item.action`]="{ item }">
              <v-icon size="18" @click="viewDetail(item.levelID, item.inactive)" color="primary"
                >visibility</v-icon
              >
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
    <div v-if="!isLoading" color="#fff" class="w-100 pl-10 pr-10">
      <v-row>
        <v-col md="2">
          <v-select
            outlined
            hide-details
            dense
            :value="itemsPerPage"
            :items="[20, 50, 100, 200]"
            @change="itemsPerPage = parseInt($event, 10)"
            style="height: 32px"
          ></v-select>
        </v-col>
        <v-col md="4" class="d-flex align-center justify-end">
          <h3 v-if="filtered.length != 1">Total: {{ filtered.length }} courses</h3>
          <h3 v-else>Total: {{ filtered.length }} course</h3>
        </v-col>
        <v-col md="6" class="d-flex justify-end">
          <v-pagination
            v-model="page"
            :length="pageCount"
            elevation="0"
            :total-visible="7"
          ></v-pagination>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { course_managerment } from '@/api/course-management.js'
import Autocomplete from '@/components/Utils/Autocomplete.vue'
export default {
  components: { Autocomplete },
  data() {
    return {
      isLoading: false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      headers: [
        {
          text: 'No',
          value: 'no',
          sortable: false,
        },
        { text: 'Course code', value: 'levelCode', sortable: false },
        { text: 'Cover', value: 'photo', sortable: false },
        {
          text: 'Course name EN',
          value: 'courseNameEN',
          sortable: false,
        },
        {
          text: 'Course name VN',
          value: 'levelVN',
          sortable: false,
        },
        {
          text: 'Department',
          value: 'departmentVN',
          sortable: false,
        },
        {
          text: 'Program',
          value: 'programmeVN',
          sortable: false,
        },
        { text: 'Status', value: 'inactive', sortable: false },
        { text: 'Action', value: 'action', sortable: false },
      ],
      courseList: [],
      departments: [
        {
          department: 'All',
          departmentID: 'all',
        },
      ],
      departmentID: 'all',
      programmes: [
        {
          programme: 'All',
          programmeID: 'all',
        },
      ],
      programmeID: 'all',
      filters: {
        levelCode: [],
        courseNameEN: [],
        levelVN: [],
        departmentVN: [],
        programmeVN: [],
        inactive: [],
      },
    }
  },
  created() {
    this.init()
  },
  watch: {
    departmentID(value) {
      this.getProgramme(value)
    },
  },
  computed: {
    filtered() {
      return this.courseList.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
    },
  },
  methods: {
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
    },

    async init() {
      this.isLoading = true
      await course_managerment.getCourseAll().then(res => {
        if (res) {
          // this.courseList = res;
          res.forEach(x => {
            this.courseList.push({
              commitment: x.commitment,
              levelCode: x.levelCode,
              courseNameEN: x.courseNameEN,
              courseNameVN: x.courseNameVN,
              department: x.department,
              departmentID: x.departmentID,
              departmentVN: x.departmentVN,
              inactive: x.inactive == true ? 'Inactive' : 'Active',
              levelID: x.levelID,
              levelVN: x.levelVN,
              photo: x.photo,
              programme: x.programme,
              programmeID: x.programmeID,
              programmeVN: x.programmeVN,
            })
          })
        }
      })

      // await course_managerment.getDepartment().then((res) => {
      //   if (res) {
      //     this.departments = this.departments.concat(res);
      //   }
      // });
      this.isLoading = false
    },
    async getProgramme(departmentID) {
      await course_managerment.getProgramme(departmentID).then(res => {
        if (res) {
          this.programmes = this.programmes.concat(res)
        }
      })
    },
    async filter() {
      this.isLoading = true
      if (this.departmentID != 'all') {
        if (this.programmeID != 'all') {
          await course_managerment.getCourseByProgramme(this.programmeID).then(res => {
            if (res) {
              this.courseList = res
            }
          })
        } else {
          await course_managerment.getCourseByDepartment(this.departmentID).then(res => {
            if (res) {
              this.courseList = res
            }
          })
        }
      } else {
        await course_managerment.getCourseAll().then(res => {
          if (res) {
            this.courseList = res
          }
        })
      }
      this.isLoading = false
    },
    groupColumnValueList(val) {
      return this.courseList.map(d => d[val])
    },
    toggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.courseList
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, []).length
        ) {
          this.filters[value] = []
        } else {
          this.filters[value] = this.courseList
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, [])
            .slice()
        }
      })
    },
    viewDetail(levelID, status) {
      this.$router.push({
        name: 'course-management-detail',
        query: { levelID: levelID, status: status },
      })
    },
  },
}
</script>
<style lang="scss" scoped></style>
