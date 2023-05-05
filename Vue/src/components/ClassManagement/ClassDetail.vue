<template>
  <div id="lesson-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <h2 class="d-flex">
            <v-icon @click="back()">arrow_back_ios</v-icon>
            <div class="d-flex align-center">{{ classCode }}</div>
          </h2>
          <div class="pl-8 pb-10">
            <v-row>
              <v-col md="4">
                <div class="list-info">
                  <div class="item">
                    <v-row>
                      <v-col md="6">Center</v-col>
                      <v-col md="6">{{ center }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="6">Preceding class</v-col>
                      <v-col md="6">{{ precedingClass }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="6">Class admin</v-col>
                      <v-col :class="'link'" md="6" @click="viewDetailProfile(classAdmin_userID)">{{
                        classAdmin
                      }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="6">Customer care staff</v-col>
                      <v-col md="6" @click="viewDetailProfile(customerCareStaffID)">{{
                        customerCareStaff
                      }}</v-col>
                    </v-row>
                  </div>
                </div>
              </v-col>
              <v-col md="3">
                <div class="list-info">
                  <div class="item">
                    <v-row>
                      <v-col md="6">Class type</v-col>
                      <v-col md="6">{{ classType }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="6">Class group</v-col>
                      <v-col md="6">{{ classGroup }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="6">Start date</v-col>
                      <v-col md="6">{{ startDate }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="6">End date</v-col>
                      <v-col md="6">{{ endDate }}</v-col>
                    </v-row>
                  </div>
                </div>
              </v-col>
              <v-col md="5">
                <div class="list-info">
                  <div class="item">
                    <v-row>
                      <v-col md="4">Course name</v-col>
                      <v-col md="8">{{ courseName }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="4">Hours/Lesson</v-col>
                      <v-col md="8">{{ hour }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="4">Book</v-col>
                      <v-col md="8">{{ book }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="4">Note</v-col>
                      <v-col md="8">{{ note }}</v-col>
                    </v-row>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>

          <v-tabs class="tab-sadown mb-2" v-model="model">
            <v-tab :href="'#tab1'"> Schedule </v-tab>
            <v-tab :href="'#tab2'"> Test and exam schedule </v-tab>
            <v-tab :href="'#tab3'"> Student </v-tab>
            <v-tab :href="'#tab4'"> RECORDING </v-tab>
            <v-tab @click="getListComment" :href="'#tab5'"> MONTHLY COMMENT </v-tab>
            <v-tab :href="'#tab6'">TEST RESULT</v-tab>
          </v-tabs>

          <div class="pt-3">
            <v-row>
              <v-col lg="12" md="12" sm="12" xl="12" class="justify-space-between mb-2">
                <div>
                  <v-tabs-items v-model="model">
                    <v-tab-item :value="'tab1'">
                      <v-row no-gutters>
                        <v-col md="12" sm="12" class="pb-5 pt-5">
                          <v-progress-linear
                            v-if="isLoading"
                            indeterminate
                            color="primary"
                          ></v-progress-linear>
                          <v-data-table
                            v-if="!isLoading"
                            :headers="scheduleHeaders"
                            :items="schedules"
                            :page.sync="page"
                            :items-per-page="1000000000000000"
                            hide-default-footer
                            @page-count="pageCount = $event"
                            class="elevation-0"
                            fixed-header
                            height="60vh"
                          >
                            <template v-slot:[`item.date`]="{ item }">
                              {{ _dayjs(item.date).format('DD/MM/YYYY') }}
                            </template>

                            <template v-slot:[`item.statusLessonReport`]="{ item }">
                              <div
                                v-if="item.statusLessonReport == 'APPROVED'"
                                class="d-flex justify-center"
                              >
                                <v-icon color="#0FA958"> mdi-checkbox-marked-circle </v-icon>
                              </div>
                              <div
                                v-else-if="item.statusLessonReport == 'INPROGRESS'"
                                class="d-flex justify-center"
                              >
                                <v-icon color="#EB9516"> mdi-dots-horizontal-circle </v-icon>
                              </div>
                              <div
                                v-else-if="item.statusLessonReport == 'REJECTED'"
                                class="d-flex justify-center"
                              >
                                <v-icon color="#EC1C24"> mdi-close-circle </v-icon>
                              </div>
                              <div
                                v-else-if="!item.statusLessonReport"
                                class="d-flex justify-center"
                              >
                                <v-icon color="#C4C4C4">mdi-checkbox-blank-circle</v-icon>
                              </div>
                            </template>

                            <template v-slot:[`item.teacherAssistant`]="{ item }">
                              <div v-if="item.ta1.teacherName">
                                {{ item.ta1.teacherName }}
                              </div>
                              <div v-else>
                                {{ item.ta2.teacherName }}
                              </div>
                            </template>

                            <template v-slot:[`item.action`]="{ item }">
                              <div class="d-flex actionIcon">
                                <v-tooltip top>
                                  <template v-slot:activator="{ on, attrs }">
                                    <img
                                      v-bind="attrs"
                                      v-on="on"
                                      :style="{ width: '18px' }"
                                      @click="viewLessonDetail(item.classID, item.scheduleID)"
                                      src="../../assets/images/carbon_view.svg"
                                      alt=""
                                    />
                                  </template>
                                  <span>View lesson detail</span>
                                </v-tooltip>

                                <v-tooltip top v-if="item.hasLesssonReport">
                                  <template v-slot:activator="{ on, attrs }">
                                    <img
                                      v-bind="attrs"
                                      v-on="on"
                                      :style="{ width: '18px' }"
                                      @click="viewLessonReport(item.classID, item.scheduleID)"
                                      src="../../assets/images/icon-viewLession.svg"
                                      alt=""
                                    />
                                  </template>
                                  <span>View lesson report</span>
                                </v-tooltip>
                                <v-tooltip top v-else>
                                  <template v-slot:activator="{ on, attrs }">
                                    <img
                                      v-bind="attrs"
                                      v-on="on"
                                      :style="{ width: '18px' }"
                                      @click="createLessonReport(item.classID, item.scheduleID)"
                                      src="../../assets/images/CalendarCheck.svg"
                                      alt=""
                                    />
                                    <!-- <i
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="createLessonReport(item.classID, item.scheduleID)"
                                  class="cursor isax isax-card-edit fs-18 font-weight-bold mr-4"
                                ></i> -->
                                  </template>
                                  <span>Create lesson report</span>
                                </v-tooltip>
                                <v-tooltip top>
                                  <template v-slot:activator="{ on, attrs }">
                                    <img
                                      v-bind="attrs"
                                      v-on="on"
                                      :style="{ width: '18px' }"
                                      @click="takeAttendance(item.classID, item.scheduleID)"
                                      src="../../assets/images/Group.svg"
                                      alt=""
                                    />
                                    <!-- <i
                                  v-bind="attrs"
                                  v-on="on"
                                  v-if="haveAttendancePermission"
                                  @click="takeAttendance(item.classID, item.scheduleID)"
                                  class="cursor isax isax-calendar-tick fs-18 font-weight-bold mr-4"
                                ></i> -->
                                  </template>
                                  <span>Take attendance</span>
                                </v-tooltip>
                                <v-tooltip top>
                                  <template v-slot:activator="{ on, attrs }">
                                    <img
                                      v-bind="attrs"
                                      v-on="on"
                                      v-if="item.note === '' || item.note === null"
                                      :style="{ width: '18px' }"
                                      @click="openEditNote(item)"
                                      src="../../assets/images/notes (1).svg"
                                      alt=""
                                    />
                                    <img
                                      v-bind="attrs"
                                      v-on="on"
                                      v-else
                                      :style="{ width: '18px' }"
                                      @click="openEditNote(item)"
                                      src="../../assets/images/notes.svg"
                                      alt=""
                                    />
                                  </template>
                                  <span v-if="item.note === '' || item.note === null"
                                    >Create note</span
                                  >
                                  <span v-else>View note</span>
                                </v-tooltip>
                              </div>
                              <div v-show="overlay" :class="'h'">
                                <div class="card-i">
                                  <v-card
                                    :style="{ boxShadow: 'none' }"
                                    light
                                    :min-width="screen < 700 ? '500' : '600'"
                                  >
                                    <v-card-title class="text-h5" :style="{ fontWeight: 700 }">
                                      Lesson notes
                                    </v-card-title>
                                    <v-divider></v-divider>
                                    <v-textarea
                                      :v-model="noteText"
                                      name="input-7-1"
                                      label="Add lesson notes"
                                      :disabled="!isEdit"
                                      @change="noteOnChange"
                                      :value="noteText"
                                      outlined
                                      dense
                                      height="30vh"
                                      class="abc mt-3 ml-5 mr-5"
                                      id="abcd"
                                    ></v-textarea>
                                    <v-divider></v-divider>

                                    <v-card-actions>
                                      <v-spacer></v-spacer>
                                      <div :class="'mb-4'" class="btnNote">
                                        <v-btn elevation="2" large @click="overlay = false"
                                          >Cancel</v-btn
                                        >
                                        <v-btn
                                          elevation="2"
                                          large
                                          color="primary"
                                          @click="saveNote"
                                          v-if="isEdit === true"
                                          >Save</v-btn
                                        >
                                        <v-btn
                                          elevation="2"
                                          large
                                          color="primary"
                                          @click="btn_Edit"
                                          v-else
                                          >Edit</v-btn
                                        >
                                      </div>
                                    </v-card-actions>
                                  </v-card>
                                </div>
                              </div>
                            </template>
                          </v-data-table>
                        </v-col>
                        <div v-if="!isLoading" color="#fff" class="w-100"></div>
                      </v-row>
                    </v-tab-item>
                    <v-tab-item :value="'tab2'">
                      <v-row no-gutters>
                        <v-col md="12">
                          <div class="pt-5">
                            <div class="pb-5">
                              <v-progress-linear
                                v-if="isLoading"
                                indeterminate
                                color="primary"
                                class="my-10"
                              >
                              </v-progress-linear>
                              <v-data-table
                                v-if="!isLoading"
                                :headers="testAndExamHeaders"
                                :items="testAndExamList"
                                :page.sync="page"
                                :items-per-page="1000000000000000"
                                hide-default-footer
                                @page-count="pageCount = $event"
                                class="elevation-0"
                                fixed-header
                                height="60vh"
                              >
                                <template v-slot:[`item.no`]="{ index }">
                                  {{ index + 1 }}
                                </template>

                                <template v-slot:[`item.testDate`]="{ item }">
                                  {{ _dayjs(item.testDate).format('DD/MM/YYYY') }}
                                </template>
                              </v-data-table>
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-tab-item>
                    <v-tab-item :value="'tab3'">
                      <v-row no-gutters>
                        <v-col md="12">
                          <div class="pt-5">
                            <div class="pb-5">
                              <v-progress-linear
                                v-if="isLoading"
                                indeterminate
                                color="primary"
                              ></v-progress-linear>
                              <v-data-table
                                v-if="!isLoading"
                                :headers="studentHeaders"
                                :items="filterStudents"
                                :page.sync="page"
                                :items-per-page="1000000000000000"
                                hide-default-footer
                                hide-default-header
                                @page-count="pageCount = $event"
                                class="elevation-0"
                                fixed-header
                                height="60vh"
                              >
                                <template v-slot:header="{ props }">
                                  <thead style="border-radius: 20px" class="v-data-table-header">
                                    <tr>
                                      <th
                                        v-for="header in props.headers"
                                        :key="header.text"
                                        style="background: #0b2585; color: #fff"
                                      >
                                        {{ header.text }}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tr class="fixed-row-filter">
                                    <th
                                      v-for="header in props.headers"
                                      class="select-table"
                                      :key="header.text"
                                    >
                                      <div v-if="filtersStu.hasOwnProperty(header.value)">
                                        <Autocomplete
                                          v-if="filtersStu.hasOwnProperty(header.value)"
                                          @setFilter="setFilter"
                                          :styleBorder="'border-bottom'"
                                          :keyFilter="header.value"
                                          :selectedInit="filtersStu[header.value]"
                                          :listItem="groupColumnValueList(header.value)"
                                        />
                                      </div>
                                    </th>
                                  </tr>
                                </template>
                                <template v-slot:[`item.no`]="{ index }">
                                  {{ index + 1 }}
                                </template>
                                <template v-slot:[`item.fullName`]="{ item }">
                                  <p
                                    :style="{ width: '170px' }"
                                    :class="'link'"
                                    @click="viewDetailProfile(item.userID)"
                                  >
                                    {{ item.fullName }}
                                  </p>
                                </template>
                                <template v-slot:[`item.qc`]="{ item }">
                                  <p
                                    :style="{ width: '170px' }"
                                    :class="'link'"
                                    @click="viewDetailProfile(item.qcid)"
                                  >
                                    {{ item.qc }}
                                  </p>
                                </template>
                                <template v-slot:[`item.ec`]="{ item }">
                                  <p
                                    :style="{ width: '170px' }"
                                    :class="'link'"
                                    @click="viewDetailProfile(item.ecid)"
                                  >
                                    {{ item.ec }}
                                  </p>
                                </template>
                                <template v-slot:[`item.studentAccountBalance`]="{ item }">
                                  <p :class="'text-right'">
                                    {{ item.studentAccountBalance }}
                                  </p>
                                </template>
                                <template v-slot:[`item.outStanding`]="{ item }">
                                  <p :class="'text-right'">
                                    {{ item.outStanding }}
                                  </p>
                                </template>
                                <template v-slot:[`item.school`]="{ item }">
                                  <p :style="{ width: '120px' }" :class="'text-left'">
                                    {{ item.school }}
                                  </p>
                                </template>
                                <template v-slot:[`item.hasRoadmap`]="{ item }">
                                  <div :style="{ width: '120px' }" class="d-flex justify-center">
                                    <img
                                      :class="'link'"
                                      :style="{ marginRight: '10px' }"
                                      :src="item.hasRoadmap === 'Yes' ? iconAc : iconUnAc"
                                    />
                                    <p
                                      @click="
                                        item.hasRoadmap === 'Yes' &&
                                          viewRoadMap(item.studentID, item.userID)
                                      "
                                      :class="`link ${item.hasRoadmap === 'Yes' ? '' : 'disible'}`"
                                    >
                                      View detail
                                    </p>
                                  </div>
                                </template>
                                <template v-slot:[`item.reward`]="{ item }">
                                  <div :style="{ width: '80px' }" class="d-flex justify-center">
                                    <v-tooltip top>
                                      <template
                                        v-if="permision.cFull || permision.cRead"
                                        v-slot:activator="{ on, attrs }"
                                      >
                                        <img
                                          v-bind="attrs"
                                          v-on="on"
                                          :class="'link'"
                                          :style="{ marginRight: '10px' }"
                                          src="../../assets/images/icon-eye.svg"
                                          @click="viewDetailProfile(item.userID, 1)"
                                        />
                                      </template>
                                      <span>View all reward</span>
                                    </v-tooltip>
                                    <v-tooltip top>
                                      <template
                                        v-if="permision.cFull"
                                        v-slot:activator="{ on, attrs }"
                                      >
                                        <img
                                          v-bind="attrs"
                                          v-on="on"
                                          @click="() => openRewardLog(item)"
                                          :class="'link'"
                                          :style="{ marginRight: '10px' }"
                                          src="../../assets/images/icon-plus-round.svg"
                                        />
                                      </template>
                                      <span>Add new reward</span>
                                    </v-tooltip>
                                  </div>
                                </template>
                              </v-data-table>
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                      <FormReward
                        :dialog="dialogReward"
                        :reward="rewardSelect"
                        :type="'create'"
                        @callData="getRewardList()"
                        @setLog="setLogReward"
                      />
                    </v-tab-item>
                    <v-tab-item :value="'tab4'">
                      <v-row no-gutters>
                        <v-col md="12">
                          <div class="pt-5">
                            <div class="pb-5">
                              <v-progress-linear
                                v-if="isLoading"
                                indeterminate
                                color="primary"
                                class="my-10"
                              >
                              </v-progress-linear>
                              <v-data-table
                                v-if="!isLoading"
                                :headers="recordHeader"
                                :items="recordData"
                                :page.sync="page"
                                :items-per-page="1000000000000000"
                                hide-default-footer
                                hide-default-header
                                @page-count="pageCount = $event"
                                class="elevation-0 record-table"
                                fixed-header
                                height="60vh"
                              >
                                <template v-slot:header="{ props }">
                                  <thead :class="'record-header'">
                                    <tr>
                                      <th
                                        :style="{ color: '#ffff !important' }"
                                        v-for="(header, index) in props.headers"
                                        :key="index"
                                      >
                                        <p :style="{ textAlign: 'center !important' }">
                                          {{ header.text }}
                                        </p>
                                      </th>
                                      <th
                                        :class="'record-header-item'"
                                        :style="{ color: '#ffff !important' }"
                                        v-for="(header, index) in cateraryRecordList"
                                        :key="index"
                                      >
                                        <h3>{{ header.recordCategory }}</h3>
                                        <p>{{ _dayjs(header.date).format('DD/MM/YYYY') }}</p>
                                      </th>
                                    </tr>
                                  </thead>
                                </template>
                                <template v-slot:body="{ items }">
                                  <tbody :class="'record-body'">
                                    <tr v-for="(item, index) in items" :key="index">
                                      <td :class="'stickyttt'" :style="{ width: '20px' }">
                                        <p :style="{ width: '20px', textAlign: 'center' }">
                                          {{ index + 1 }}
                                        </p>
                                      </td>
                                      <td
                                        :class="'link'"
                                        @click="viewDetailProfile(item.student_userID)"
                                      >
                                        <p :style="{ width: '100px', textAlign: 'center' }"></p>
                                        {{ item.studentCode }}
                                      </td>
                                      <td
                                        :class="'link'"
                                        @click="viewDetailProfile(item.student_userID)"
                                      >
                                        <p :style="{ width: '170px' }">
                                          {{ item.studentName }}
                                        </p>
                                      </td>

                                      <td
                                        :class="'w-150'"
                                        v-for="(recordCategory, index) in cateraryRecordList"
                                        :key="index"
                                      >
                                        <div
                                          :class="'w-150'"
                                          v-if="
                                            item.listRecord.find(
                                              element =>
                                                element.recordCategoryID ===
                                                  recordCategory.recordCategoryID &&
                                                item.listRecord.find(
                                                  element =>
                                                    element.recordCategoryID ===
                                                    recordCategory.recordCategoryID
                                                ).url.length !== 0
                                            )
                                          "
                                        >
                                          <div :class="'d-flex align-center w-150'">
                                            <img
                                              @click="
                                                openRecordMark(
                                                  item.listRecord.find(
                                                    element =>
                                                      element.recordCategoryID ===
                                                      recordCategory.recordCategoryID
                                                  )
                                                )
                                              "
                                              :src="
                                                item.listRecord.find(
                                                  element =>
                                                    element.recordCategoryID ===
                                                    recordCategory.recordCategoryID
                                                ).isCommentOrMark === true
                                                  ? iconDoneAndMark
                                                  : iconDone
                                              "
                                              alt=""
                                              srcset=""
                                            />

                                            <div
                                              class="d-flex align-center link"
                                              @click="
                                                viewVideo(
                                                  item.listRecord.find(
                                                    element =>
                                                      element.recordCategoryID ===
                                                      recordCategory.recordCategoryID
                                                  )
                                                )
                                              "
                                              target="_blank"
                                            >
                                              <img
                                                class="ml-2 link"
                                                src="../../assets/images/icon-play.svg"
                                                alt=""
                                                srcset=""
                                              />
                                              <p :class="'link ml-1 mr-0'">View</p>
                                            </div>
                                          </div>
                                        </div>
                                        <div v-else>
                                          <div :class="'d-flex align-center'">
                                            <h4 :style="{ color: 'red' }" :class="'ml-3'">-</h4>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </template>
                              </v-data-table>
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-tab-item>
                    <v-tab-item :value="'tab5'">
                      <v-row no-gutters>
                        <v-col md="12">
                          <div class="pt-5">
                            <div class="pb-5">
                              <v-progress-linear
                                v-if="isLoading"
                                indeterminate
                                color="primary"
                                class="my-10"
                              >
                              </v-progress-linear>
                              <CommentTable
                                v-if="model === 'tab5' && !isLoading"
                                :commentList="commentList"
                                @setLog="setLog"
                                :filtersName="'fclassDetailM'"
                                :students="listStudentInClassFollowDate"
                                :type="'evaluate'"
                                @callData="getListComment"
                              />

                              <DigCommentDetail
                                v-if="dialogComment"
                                :dialog="dialogComment"
                                :comment="commentSelect"
                                @setLog="setLog"
                                @callData="getListCommentNoLoading"
                              />
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-tab-item>
                    <v-tab-item :value="'tab6'">
                      <TestResult :classID="classID" :students="students" />
                    </v-tab-item>
                  </v-tabs-items>
                </div>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-col> </v-row
    ><template>
      <div class="text-center">
        <v-dialog v-if="dialogRecordMark" v-model="dialogRecordMark" width="900">
          <v-card>
            <v-form
              @submit.prevent="markRecord"
              ref="formRecord"
              :class="'record-form'"
              v-model="valid"
            >
              <v-card-title class="text-h5">
                <div :class="' fz-1 header-comment d-flex justify-space-between align-center'">
                  <h3>Comment on recording</h3>
                  <div>
                    <v-btn
                      :class="'btn-comment-record mr-3'"
                      @click="closeRecordMark"
                      outlined
                      height="30px"
                      >Close</v-btn
                    >
                    <v-btn
                      :class="'btn-comment-record'"
                      filled
                      height="30px"
                      color="primary"
                      type="submit"
                      :disabled="
                        !valid ||
                        !isValidEditor1 ||
                        !isValidEditor2 ||
                        !isValidEditor3 ||
                        !isValidEditor4
                      "
                      >Send feedback</v-btn
                    >
                  </div>
                </div>
                <div
                  :style="{ width: '100%' }"
                  class="d-flex align-center justify-space-between mt-4"
                >
                  <div class="d-flex align-center">
                    <h4 class="mr-6 fz-1">
                      {{ recordSelect.recordCategory }} - {{ recordSelect.studentName }}
                    </h4>
                    <span class="mt-1 fz-1">Total score: {{ totalMarkRecord }}</span>
                  </div>
                  <p class="fz-1">
                    Send by {{ recordSelect.sentByUser }} -
                    {{ formatTime(recordSelect.sentByDate) }}
                  </p>
                </div>
              </v-card-title>

              <v-divider></v-divider>
              <v-card-text>
                <v-row>
                  <v-col cols="12" :class="'pt-1 pb-1'">
                    <!-- <v-textarea
                      height="80px"
                      name="input-7-1"
                      :class="'textAria pb-1 pt-1'"
                      placeholder="Add your comments..."
                      v-model="generalComment"
                      outlined
                      :rules="textRules"
                      label="General comment"
                      auto-grow
                    ></v-textarea> -->
                    <div class="editor">
                      <span>General comment</span>
                      <vue-editor
                        v-model="generalComment"
                        :editor-toolbar="customToolbar"
                        id="editor1"
                        placeholder="Add your comments..."
                      >
                      </vue-editor>
                      <p v-if="!isValidEditor1" class="error--text">This field is required</p>
                    </div>
                  </v-col>

                  <v-col cols="10" :class="'pt-1 pb-1'">
                    <!-- <v-textarea
                      height="80px"
                      v-model="pronunciation"
                      :class="'textAria pb-1 pt-1'"
                      name="input-7-1"
                      outlined
                      :rules="textRules"
                      placeholder="Add your comments..."
                      label="Pronunciation "
                      auto-grow
                    ></v-textarea> -->
                    <div class="editor">
                      <span>Pronunciation</span>
                      <vue-editor
                        :editor-toolbar="customToolbar"
                        v-model="pronunciation"
                        id="editor2"
                        placeholder="Add your comments..."
                      >
                      </vue-editor>
                      <p v-if="!isValidEditor2" class="error--text">This field is required</p>
                    </div>
                  </v-col>
                  <v-col cols="2" :class="'pt-1 pb-1 mt-5'">
                    <v-text-field
                      v-model="scorePronunciation"
                      name="input-7-1"
                      outlined
                      @input="changeMark"
                      height="80px"
                      :type="'number'"
                      :rules="numberRules"
                      placeholder="Scoring..."
                      label="Score"
                      auto-grow
                    ></v-text-field>
                  </v-col>
                  <v-col cols="10" :class="'pt-1 pb-1'">
                    <!-- <v-textarea
                      v-model="fluencyInSpeaking"
                      name="input-7-1"
                      height="80px"
                      :class="'textAria pb-1 pt-1'"
                      outlined
                      :rules="textRules"
                      placeholder="Add your comments..."
                      label="Fluency in speaking "
                      auto-grow
                    ></v-textarea> -->
                    <div class="editor">
                      <span>Fluency in speaking</span>
                      <vue-editor
                        :editor-toolbar="customToolbar"
                        id="editor3"
                        v-model="fluencyInSpeaking"
                        placeholder="Add your comments..."
                      >
                      </vue-editor>
                      <p v-if="!isValidEditor3" class="error--text">This field is required</p>
                    </div>
                  </v-col>
                  <v-col cols="2" :class="'pt-1 pb-1'">
                    <v-text-field
                      v-model="scoreFluencyInSpeaking"
                      name="input-7-1"
                      outlined
                      @input="changeMark"
                      :class="'textAria pb-1 pt-1 mt-4'"
                      :rules="numberRules"
                      placeholder="Scoring..."
                      label="Score"
                      auto-grow
                      height="80px"
                      :type="'number'"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="10" :class="'pt-1 pb-1'">
                    <!-- <v-textarea
                      v-model="vocabularyAndGrammar"
                      name="input-7-1"
                      height="80px"
                      :rules="textRules"
                      :class="'textAria pb-1 pt-1'"
                      outlined
                      placeholder="Add your comments..."
                      label="Vocabulary and grammar "
                      auto-grow
                    ></v-textarea> -->
                    <div class="editor">
                      <span>Vocabulary and grammar</span>
                      <vue-editor
                        :editor-toolbar="customToolbar"
                        v-model="vocabularyAndGrammar"
                        id="editor4"
                        placeholder="Add your comments..."
                      >
                      </vue-editor>
                      <p v-if="!isValidEditor4" class="error--text">This field is required</p>
                    </div>
                  </v-col>
                  <v-col cols="2" :class="'pt-1 pb-1 mt-5'">
                    <v-text-field
                      v-model="scoreVocabularyAndGrammar"
                      name="input-7-1"
                      outlined
                      @input="changeMark"
                      :type="'number'"
                      :rules="numberRules"
                      placeholder="Scoring..."
                      label="Score"
                      auto-grow
                      height="80px"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-form>
          </v-card>
        </v-dialog>
        <div v-if="dialogVideo" :class="'dig-video'">
          <v-dialog content-class="elevation-0" width="700px" v-model="dialogVideo">
            <div :style="{ width: 'fit-content', marginLeft: 'auto' }">
              <img
                @click="dialogVideo = false"
                :style="{ width: '30px', height: '30px', cursor: 'pointer ' }"
                src="../../assets/images/icon-close2.svg"
                alt=""
              />
            </div>
            <v-card class="pt-5 pl-5 pr-7 pb-4" width="800px">
              <div class="d-flex align-center link-toNewTab mb-3">
                <img src="../../assets/images/icon-link.svg" alt="" />
                <!-- <a class="link ml-3" :href="recordSelect.url" target="_blank"
                  >Open link in new tab</a
                > -->
              </div>
              <div>
                <iframe
                  :style="{ width: '101%', height: '400px', margin: '0 auto' }"
                  :src="urlChange(recordSelect.url)"
                  allowfullscreen
                ></iframe>
              </div>
            </v-card>
          </v-dialog>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { class_managerment } from '@/api/class-management.js'
import { statistic_management } from '@/api/statistic-management.js'
import iconAc from '../../assets/images/icon-accept.svg'
import iconUnAc from '../../assets/images/icon-unaccept.svg'
import dayjs from 'dayjs'
import Autocomplete from '@/components/Utils/Autocomplete.vue'
import iconDoneAndMark from '../../assets/images/icon-doneAndMark.svg'
import iconDone from '../../assets/images/icon-comment.svg'
import DigCommentDetail from '@/components/StatisticManagement/MonthlyStudentComment/DigCommentDetail.vue'
import { monthly_comment } from '@/api/monthly.js'
import { defineAsyncComponent } from 'vue'
import FormReward from '@/components/Report/AchievementReward/FormReward.vue'
import { getObjectPermission } from '../../common/index'
import TestResult from './TestResult.vue'
import { VueEditor } from 'vue2-editor'
export default {
  components: {
    Autocomplete,
    FormReward,
    VueEditor,
    CommentTable: defineAsyncComponent(() =>
      import('@/components/StatisticManagement/MonthlyStudentComment/CommentTable.vue')
    ),
    DigCommentDetail,
    TestResult,
  },
  data() {
    return {
      customToolbar: [
        ['bold', 'italic', 'underline'],
        ['align', { align: 'center' }, { align: 'right' }, { align: 'justify' }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ color: [] }, { background: [] }],
        ['link', 'image', 'video'],
      ],
      valid: false,
      dialogComment: false,
      dialogReward: false,
      dialogVideo: false,
      rewardSelect: {},
      numberRules: [v => !!v || 'This filed is required', v => !isNaN(v) || 'Must be number'],
      textRules: [v => !!v || 'This filed is required'],
      model: 'tab1',
      permision: getObjectPermission(401),
      iconDone: iconDone,
      commentSelect: null,
      iconDoneAndMark: iconDoneAndMark,
      categoryList: [],
      generalComment: '',
      pronunciation: '',
      fluencyInSpeaking: '',
      vocabularyAndGrammar: '',
      scoreGeneralComment: 0,
      scorePronunciation: 0,
      scoreFluencyInSpeaking: 0,
      scoreVocabularyAndGrammar: 0,
      recordSelect: {
        recordID: 41,
        studentID: 10528,
        registrationID: 0,
        classID: 4093,
        url: 'string',
        recordCategoryID: 2,
        recordDate: '2022-11-02T03:22:50.907',
        generalComment: '',
        totalMarkRecord: 0,
        pronunciation: '',
        fluencyInSpeaking: '',
        vocabularyAndGrammar: '',
        scoreGeneralComment: 7,
        scorePronunciation: 7.5,
        scoreFluencyInSpeaking: 0,
        scoreVocabularyAndGrammar: 0,
        crtdUser: 'admin1',
        crtdDate: '2022-11-03T14:27:51.367',
        lUpdUser: 'admin1',
        lUpdDate: '2022-11-03T14:27:51.367',
        studentCode: '10528HN',
        studentName: 'Lê Quỳnh Hương',
        classCode: 'VQ1-D2-2102',
        recordCategory: null,
        hasDone: 'Yes',
        sentByUser: 'd',
        sentByDate: '2022-11-02T03:22:50.907',
      },
      iconAc: iconAc,
      iconUnAc: iconUnAc,
      recordHeader: [
        {
          text: 'No',
          value: 'no',
          sortable: false,
          width: '60px',
        },
        {
          text: 'Student code',
          value: 'studentCode',
          sortable: false,
          width: '140px',
        },
        {
          text: 'Student name',
          value: 'studentName',
          sortable: false,
          width: '140px',
        },
      ],
      recordCategory: [],
      recordData: [],
      isLoading: false,
      page: 1,
      overlay: false,
      pageCount: 0,
      noteText: '',
      screen: window.innerWidth,
      scheduleIDEdit: '',
      itemsPerPage: 20,
      dialogRecordMark: false,
      scheduleHeaders: [
        {
          text: 'Date',
          value: 'date',
          sortable: false,
        },
        {
          text: 'Time',
          value: 'classTime',
          sortable: false,
        },
        { text: 'Room', value: 'room', sortable: false },
        { text: 'Lesson', value: 'lessonNo', sortable: false },
        {
          text: 'Teacher',
          value: 'teachers.teacherName',
          sortable: false,
        },
        {
          text: 'TA',
          value: 'teacherAssistant',
          sortable: false,
        },
        {
          text: 'Lesson report',
          value: 'statusLessonReport',
          sortable: false,
        },
        { text: 'Action', value: 'action', sortable: false },
      ],
      schedules: [],
      testAndExamHeaders: [
        {
          text: 'No',
          value: 'no',
          sortable: false,
          width: '60px',
        },
        {
          text: 'Date',
          value: 'testDate',
          sortable: false,
          width: '140px',
        },
        { text: 'Lesson', value: 'lessonNo', sortable: false, width: '100px' },
        {
          text: 'Test category',
          value: 'testName',
          sortable: false,
          width: '150px',
        },
        {
          text: 'Test type',
          value: 'testType',
          sortable: false,
          width: '150px',
        },
      ],

      recordHeaders: [],
      cateraryRecordList: [],
      testAndExamList: [],
      objectSearchStudent: {
        studentCode: '',
        fullName: '',
        dob: '',
        dueDate: '',
        outStanding: '',
        studentAccountBalance: '',
        qc: '',
        ec: '',
        startDate: '',
        school: '',
        hasRoadmap: '',
      },
      filtersStu: {
        studentCode: [],
        fullName: [],
        dob: [],
        dueDate: [],
        outStanding: [],
        studentAccountBalance: [],
        qc: [],
        ec: [],
        startDate: [],
        school: [],
        hasRoadmap: [],
      },
      studentHeaders: [
        {
          text: 'No',
          value: 'no',
          sortable: false,
        },
        {
          text: 'Stu Code',
          value: 'studentCode',
          sortable: false,
        },
        {
          text: 'Student Name',
          value: 'fullName',
          sortable: false,
        },
        {
          text: 'DOB',
          value: 'dob',
          sortable: false,
        },
        {
          text: 'Due date',
          value: 'dueDate',
          sortable: false,
        },
        {
          text: 'Outstanding',
          value: 'outStanding',
          sortable: false,
        },
        {
          text: 'Account balance',
          value: 'studentAccountBalance',
          sortable: false,
        },
        {
          text: 'QC',
          value: 'qc',
          sortable: false,
        },
        {
          text: 'EC',
          value: 'ec',
          sortable: false,
        },
        {
          text: 'Start date',
          value: 'startDate',
          sortable: false,
        },
        {
          text: 'School',
          value: 'school',
          sortable: false,
        },
        {
          text: 'Roadmap',
          value: 'hasRoadmap',
          sortable: false,
        },
        {
          text: 'Reward',
          value: 'reward',
          sortable: false,
        },
      ],
      totalMarkRecord: 0,
      students: [],
      scheduleID: this.$route.query.scheduleID,
      classID: this.$route.query.classID,
      date: null,
      teacherID: JSON.parse(localStorage.getItem('currentUser')).userInfo.teacherID,
      courseName: '',
      classCode: '',
      classStatus: '',
      hour: '',
      customerCareStaffID: '',
      book: '',
      note: '',
      center: '',
      precedingClass: '',
      classAdmin: '',
      classAdmin_userID: '',
      customerCareStaff: '',
      classType: '',
      classGroup: '',
      startDate: '',
      endDate: '',
      teacherIDClass: '',
      classToEditNote: '',
      isSchedule: true,
      isTestAndExam: false,
      isStudent: false,
      isRecording: false,
      studentAttendancePermission: process.env.VUE_APP_ENV_FUNCTION_STUDENT_ATTENDANCE,
      functionRole: JSON.parse(localStorage.getItem('functionRole')),
      haveAttendancePermission: false,
      calWidth: true,
      isEdit: false,
      commentList: [],
      // commentList: [
      //   {
      //     date: '2023-07-21T09:35:31.820Z',
      //     comments: [
      //       {
      //         commentID: 1,
      //         stuCode: '10255HN',
      //         stuID: 10255,
      //         stuName: 'Minh1',
      //         classCode: 'VQ1',
      //         stu_userID: 10255,
      //         dob: '2023-07-21T09:35:31.820Z',
      //         startDate: '2023-07-21T09:35:31.820Z',
      //         qc: 'Diệu Linh',
      //         qc_userID: 1022,
      //         ec: 'Diệu Linh',
      //         ec_userID: 1022,
      //         evaluateTeacher: 'Good',
      //         isSolved: false,
      //         evaluateParents: '',
      //         commentTeachers: 'Học sinh học tốt',
      //         commentParents: '',
      //       },
      //       {
      //         commentID: 2,
      //         stuCode: '10255HN',
      //         stuID: 10258,
      //         stuName: 'Minh1',
      //         classCode: 'VQ1',
      //         stu_userID: 10255,
      //         dob: '2023-07-21T09:35:31.820Z',
      //         startDate: '2023-07-21T09:35:31.820Z',
      //         qc: 'Diệu Linh',
      //         qc_userID: 1022,
      //         ec: 'Diệu Linh',
      //         ec_userID: 1022,
      //         evaluateTeacher: 'Good',
      //         isSolved: false,
      //         evaluateParents: '',
      //         commentTeachers: 'Học sinh học tốt',
      //         commentParents: '',
      //       },
      //       {
      //         commentID: 3,
      //         stuCode: '10255HN',
      //         stuID: 10259,
      //         stuName: 'Minh1',
      //         classCode: 'VQ1',
      //         stu_userID: 10255,
      //         dob: '2023-07-21T09:35:31.820Z',
      //         startDate: '2023-07-21T09:35:31.820Z',
      //         qc: 'Diệu Linh',
      //         qc_userID: 1022,
      //         ec: 'Diệu Linh',
      //         ec_userID: 1022,
      //         evaluateTeacher: 'Good',
      //         isSolved: false,
      //         evaluateParents: '',
      //         commentTeachers: 'Học sinh học tốt',
      //         commentParents: '',
      //       },
      //       {
      //         commentID: 4,
      //         stuCode: '10255HN',
      //         stuID: 10260,
      //         stuName: 'Minh1',
      //         classCode: 'VQ1',
      //         stu_userID: 10255,
      //         dob: '2023-07-21T09:35:31.820Z',
      //         startDate: '2023-07-21T09:35:31.820Z',
      //         qc: 'Diệu Linh',
      //         qc_userID: 1022,
      //         ec: 'Diệu Linh',
      //         ec_userID: 1022,
      //         evaluateTeacher: 'Good',
      //         isSolved: false,
      //         evaluateParents: '',
      //         commentTeachers: 'Học sinh học tốt',
      //         commentParents: '',
      //       },
      //       {
      //         commentID: 5,
      //         stuCode: '10255HN',
      //         stuID: 10261,
      //         stuName: 'Minh1',
      //         classCode: 'VQ1',
      //         stu_userID: 10255,
      //         dob: '2023-07-21T09:35:31.820Z',
      //         startDate: '2023-07-21T09:35:31.820Z',
      //         qc: 'Diệu Linh',
      //         qc_userID: 1022,
      //         ec: 'Diệu Linh',
      //         ec_userID: 1022,
      //         evaluateTeacher: 'Good',
      //         isSolved: false,
      //         evaluateParents: '',
      //         commentTeachers: 'Học sinh học tốt',
      //         commentParents: '',
      //       },
      //       {
      //         commentID: 6,
      //         stuCode: '10255HN',
      //         stuID: 10262,
      //         stuName: 'Minh1',
      //         classCode: 'VQ1',
      //         stu_userID: 10255,
      //         dob: '2023-07-21T09:35:31.820Z',
      //         startDate: '2023-07-21T09:35:31.820Z',
      //         qc: 'Diệu Linh',
      //         qc_userID: 1022,
      //         ec: 'Diệu Linh',
      //         ec_userID: 1022,
      //         evaluateTeacher: 'Good',
      //         isSolved: false,
      //         evaluateParents: '',
      //         commentTeachers: 'Học sinh học tốt',
      //         commentParents: '',
      //       },
      //       {
      //         commentID: 7,
      //         stuCode: '10255HN',
      //         stuID: 10263,
      //         stuName: 'Minh1',
      //         classCode: 'VQ1',
      //         stu_userID: 10255,
      //         dob: '2023-07-21T09:35:31.820Z',
      //         startDate: '2023-07-21T09:35:31.820Z',
      //         qc: 'Diệu Linh',
      //         qc_userID: 1022,
      //         ec: 'Diệu Linh',
      //         ec_userID: 1022,
      //         evaluateTeacher: 'Good',
      //         isSolved: false,
      //         evaluateParents: '',
      //         commentTeachers: 'Học sinh học tốt',
      //         commentParents: '',
      //       },
      //       {
      //         commentID: 8,
      //         stuCode: '10255HN',
      //         stuID: 10264,
      //         stuName: 'Minh1',
      //         classCode: 'VQ1',
      //         stu_userID: 10255,
      //         dob: '2023-07-21T09:35:31.820Z',
      //         startDate: '2023-07-21T09:35:31.820Z',
      //         qc: 'Diệu Linh',
      //         qc_userID: 1022,
      //         ec: 'Diệu Linh',
      //         ec_userID: 1022,
      //         evaluateTeacher: 'Good',
      //         isSolved: false,
      //         evaluateParents: '',
      //         commentTeachers: 'Học sinh học tốt',
      //         commentParents: '',
      //       },
      //       {
      //         commentID: 9,
      //         stuCode: '10255HN',
      //         stuID: 10265,
      //         stuName: 'Minh1',
      //         classCode: 'VQ1',
      //         stu_userID: 10255,
      //         dob: '2023-07-21T09:35:31.820Z',
      //         startDate: '2023-07-21T09:35:31.820Z',
      //         qc: 'Diệu Linh',
      //         qc_userID: 1022,
      //         ec: 'Diệu Linh',
      //         ec_userID: 1022,
      //         evaluateTeacher: 'Good',
      //         isSolved: false,
      //         evaluateParents: '',
      //         commentTeachers: 'Học sinh học tốt',
      //         commentParents: '',
      //       },
      //       {
      //         commentID: 10,
      //         stuCode: '10257HN',
      //         stuID: 10257,
      //         stuName: 'Minh3',
      //         classCode: 'VQ1',
      //         stu_userID: 10255,
      //         dob: '2023-07-21T09:35:31.820Z',
      //         startDate: '2023-07-21T09:35:31.820Z',
      //         qc: 'Diệu Linh',
      //         qc_userID: 1022,
      //         ec: 'Diệu Linh',
      //         ec_userID: 1022,
      //         evaluateTeacher: 'Excellent',
      //         evaluateParents: 'Happy',
      //         isSolved: true,
      //         commentTeachers: 'Học sinh học tốt',
      //         commentParents: 'Cảm ơn',
      //       },
      //       {
      //         commentID: 11,
      //         stuCode: '10265HN',
      //         stuID: 10265,
      //         stuName: 'Minh2',
      //         classCode: 'VQ1',
      //         stu_userID: 10255,
      //         dob: '2023-07-21T09:35:31.820Z',
      //         startDate: '2023-07-21T09:35:31.820Z',
      //         qc: 'Diệu Linh',
      //         qc_userID: 1022,
      //         ec: 'Diệu Linh',
      //         ec_userID: 1022,
      //         evaluateTeacher: 'Good',
      //         evaluateParents: 'Unsatisfied',
      //         isSolved: true,
      //         commentTeachers: 'Học sinh học tốt',
      //         commentParents: 'cảm ơn',
      //       },
      //     ],
      //   },
      //   {
      //     date: '2023-08-21T09:35:31.820Z',
      //     comments: [
      //       {
      //         commentID: 12,
      //         stuCode: '10257HN',
      //         stuID: 10257,
      //         stuName: 'Minh3',
      //         classCode: 'VQ1',
      //         stu_userID: 10255,
      //         dob: '2023-07-21T09:35:31.820Z',
      //         startDate: '2023-07-21T09:35:31.820Z',
      //         qc: 'Diệu Linh',
      //         qc_userID: 1022,
      //         ec: 'Diệu Linh',
      //         ec_userID: 1022,
      //         evaluateTeacher: 'Excellent',
      //         isSolved: true,
      //         evaluateParents: '',
      //         commentTeachers: 'Học sinh học tốt',
      //         commentParents: '',
      //       },
      //       {
      //         commentID: 13,
      //         stuCode: '10255HN',
      //         stuID: 10255,
      //         stuName: 'Minh1',
      //         classCode: 'VQ1',
      //         stu_userID: 10255,
      //         dob: '2023-07-21T09:35:31.820Z',
      //         startDate: '2023-07-21T09:35:31.820Z',
      //         qc: 'Diệu Linh',
      //         qc_userID: 1022,
      //         ec: 'Diệu Linh',
      //         ec_userID: 1022,
      //         evaluateTeacher: '',
      //         evaluateParents: '',
      //         isSolved: false,
      //         commentTeachers: '',
      //         commentParents: '',
      //       },
      //     ],
      //   },
      // ],
      listStudentInClassFollowDate: [],
      loginAccountTypeId: JSON.parse(localStorage.getItem('currentUser')).locationPermissions[0]
        .accountTypeID,
    }
  },
  computed: {
    isValidEditor1() {
      return this.generalComment.length > 0
    },
    isValidEditor2() {
      return this.pronunciation.length > 0
    },
    isValidEditor3() {
      return this.fluencyInSpeaking.length > 0
    },
    isValidEditor4() {
      return this.vocabularyAndGrammar.length > 0
    },
    filterStudents() {
      console.log(this.students)
      const listStudent = this.students.filter(d => {
        return Object.keys(this.filtersStu).every(f => {
          return this.filtersStu[f].length < 1 || this.filtersStu[f].includes(d[f])
        })
      })

      return listStudent
    },
    logHeaders() {
      let headers = []

      return headers
    },
  },
  created() {
    const query = this.$route.query
    this.classID = this.$route.query.classID
    if (query.tabPage === '3' || query.tabPage === 3) {
      this.model = 'tab3'
    } else if (query.tabPage === '4' || query.tabPage === 4) {
      this.model = 'tab4'
    }

    window.addEventListener('resize', () => {
      this.screen = window.innerWidth
    })
    this.getRecordCategoryByClassID()
    this.getStudentRecordingByClassID()
    this.getClassInfo()

    this.getStudentList()
    this.getListComment()
    setTimeout(() => {
      this.getListComment()
    }, 1000)

    // this.getListStudentInComment()

    if (
      this.loginAccountTypeId === 4 ||
      this.functionRole.filter(
        x =>
          (x.functionID == this.studentAttendancePermission && x.cModify == true) ||
          (x.functionID == this.studentAttendancePermission && x.cFull == true)
      ).length == 1
    ) {
      this.haveAttendancePermission = true
    }
  },

  methods: {
    onChangeInput() {
      // this.valid = this.generalComment.length > 0
      //  &&
      // this.pronunciation.length > 0 &&
      // this.fluencyInSpeaking.length > 0 &&
      // this.vocabularyAndGrammar.length > 0
      console.log(this.valid)
    },
    openRewardLog(item) {
      this.setLogReward({
        openLog: true,
        reward: item,
      })
      this.rewardSelect = item
    },
    async getListCommentNoLoading() {
      await monthly_comment.getListStudentByClassID(this.$route.query.classID).then(res => {
        this.listStudentInClassFollowDate = res
      })

      await monthly_comment.getCommentByClass(this.$route.query.classID).then(res => {
        this.commentList = res
      })
    },
    async getListComment() {
      this.isLoading = true
      console.log()
      await monthly_comment.getListStudentByClassID(this.$route.query.classID).then(res => {
        this.listStudentInClassFollowDate = res
        this.isLoading = false
      })
      this.isLoading = true
      await monthly_comment.getCommentByClass(this.$route.query.classID).then(res => {
        this.commentList = res
        this.isLoading = false
      })
    },
    changeMark() {
      console.log()
      this.totalMarkRecord =
        parseFloat(this.scorePronunciation) +
        parseFloat(this.scoreFluencyInSpeaking) +
        parseFloat(this.scoreVocabularyAndGrammar)
    },

    setLog(data) {
      console.log(data)
      this.dialogComment = data.openLog
      this.commentSelect = data.comment
    },
    setLogReward(data) {
      console.log(data)
      this.dialogReward = data.openLog
      this.rewardSelect = data.reward
    },
    setFilter(objectFilterChange) {
      this.filtersStu = {
        ...this.filtersStu,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
    },
    removeAccents(str) {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
    },
    groupColumnValueList(val) {
      if (
        this.objectSearchStudent[val] !== null &&
        this.objectSearchStudent[val].trim().length !== 0
      ) {
        return this.students
          .map(d => d[val])
          .filter(y => {
            return (
              this.removeAccents(y)
                .toLowerCase()
                .indexOf(this.removeAccents(this.objectSearchStudent[val]).toLowerCase()) !== -1
            )
          })
      } else {
        return this.students.map(d => d[val])
      }
    },
    toggleWithSearch(value) {
      this.$nextTick(() => {
        if (
          this.filtersStu[value].length ==
          this.students
            .filter(
              item =>
                item[value].toLowerCase().indexOf(this.objectSearchStudent[value].toLowerCase()) !==
                -1
            )
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, []).length
        ) {
          this.filtersStu[value] = []
          this.objectSearchStudent[value] = ''
        } else {
          this.filtersStu[value] = this.students
            .filter(
              item =>
                item[value].toLowerCase().indexOf(this.objectSearchStudent[value].toLowerCase()) !==
                -1
            )
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
    toggle(value) {
      this.objectSearchStudent[value] = ''
      this.$nextTick(() => {
        if (
          this.filtersStu[value].length ==
          this.students
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1) {
                accumulator.push(element)
              }
              return accumulator
            }, []).length
        ) {
          this.filtersStu[value] = []
        } else {
          this.filtersStu[value] = this.students
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
    changeInputFilter(searchText, header) {
      this.objectSearchStudent[header] = searchText

      // if (
      //   this.objectSearch[header] !== null &&
      //   this.objectSearch[header] !== '' &&
      //   searchText !== null
      // ) {
      //   this.filters[header] = this.listRender
      //     .filter(
      //       item =>
      //         item[header].toLowerCase().indexOf(this.objectSearch[header].toLowerCase()) !== -1
      //     )
      //     .map(d => d[header])
      //     .reduce(function (accumulator, element) {
      //       if (accumulator.indexOf(element) === -1) {
      //         accumulator.push(element)
      //       }
      //       return accumulator
      //     }, []).length
      // }
    },
    formatTime(date) {
      try {
        if (new Date(date) !== 'Invalid Date' && date !== null) {
          const fbTimeArr = date.split('T')
          return (
            fbTimeArr[1].split(':')[0] +
            ':' +
            fbTimeArr[1].split(':')[1] +
            ' ' +
            dayjs(date).format('DD/MM/YYYY')
          )
        } else {
          return ''
        }
      } catch (err) {
        return ''
      }
    },
    urlChange(url) {
      let url2 = url
      if (url2.indexOf('/drive.google.com/file') !== -1) {
        const listLinkArr = url2.split('/')
        listLinkArr.pop()
        url2 = listLinkArr.join('/') + '/preview'
      }
      if (url2.indexOf('youtu') !== -1) {
        if (url2.indexOf('embed') === -1) {
          url2 = 'https://www.youtube.com' + '/embed/' + this.youtube_parser(url2)
        }
      }
      return url2
    },
    youtube_parser(url) {
      var r,
        rx =
          /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/

      r = url.match(rx)
      return r[1]
    },
    viewVideo(record) {
      ;(this.dialogVideo = true), (this.recordSelect = record)
    },
    openRecordMark(data) {
      this.resetMark()
      if (data.isCommentOrMark) {
        this.generalComment = data.generalComment
        this.pronunciation = data.pronunciation
        this.fluencyInSpeaking = data.fluencyInSpeaking
        this.vocabularyAndGrammar = data.vocabularyAndGrammar
        this.scorePronunciation = parseFloat(data.scorePronunciation)
        this.scoreFluencyInSpeaking = parseFloat(data.scoreFluencyInSpeaking)
        this.scoreVocabularyAndGrammar = parseFloat(data.scoreVocabularyAndGrammar)
        this.totalMarkRecord =
          parseFloat(data.scoreGeneralComment) +
          parseFloat(data.scorePronunciation) +
          parseFloat(data.scoreFluencyInSpeaking) +
          parseFloat(data.scoreVocabularyAndGrammar)
      }

      this.dialogRecordMark = true
      this.recordSelect = data
    },
    resetMark() {
      this.generalComment = ''
      this.totalMarkRecord = 0
      this.pronunciation = ''
      this.fluencyInSpeaking = ''
      this.vocabularyAndGrammar = ''
      this.scoreGeneralComment = ''
      this.scorePronunciation = 0
      this.scoreFluencyInSpeaking = 0
      this.scoreVocabularyAndGrammar = 0
    },
    closeRecordMark() {
      this.resetMark()
      this.dialogRecordMark = false
      this.$refs.formRecord.resetValidation()
    },
    viewRoadMap(studentID, userID) {
      this.$router.push({
        name: 'student-roadmap-overview',
        query: {
          studentID: studentID,
          classID: this.classID,
          isFromDetail: true,
          userID: userID,
        },
      })
    },

    viewDetailProfile(userId, tab) {
      this.$router.push({
        name: 'account-management-view-account',
        params: {
          userId: userId,
        },
        query: { tab: tab },
      })
    },
    noteOnChange(value) {
      this.noteText = value
    },
    async reload() {
      this.isLoading = true
      this.overlay = false
      this.getClassInfo()
      this.isLoading = false
    },
    saveNote() {
      class_managerment.updateNote(this.noteText, this.scheduleIDEdit)
      this.overlay = false
      this.reload()
    },

    btn_Edit() {
      this.isEdit = true
    },
    openEditNote(item) {
      if (item.note == null || item.note == '') this.isEdit = true
      else this.isEdit = false
      this.overlay = true
      this.scheduleIDEdit = item.scheduleID
      this.noteText = item.note
    },
    btnEdit(data) {
      if (typeof data === 'string') {
        class_managerment.updateNote(data, this.scheduleIDEdit).then(res => {
          console.log(res)
        })
      }
    },
    async getStudentRecordingByClassID() {
      await class_managerment.getStudentRecordingByClassID(this.$route.query.classID).then(res => {
        let studentGroup = []

        res.forEach(item => {
          if (
            (item.fluencyInSpeaking === '' &&
              item.pronunciation === '' &&
              item.generalComment === '' &&
              item.vocabularyAndGrammar === '' &&
              item.scoreFluencyInSpeaking === 0 &&
              item.scoreGeneralComment === 0 &&
              item.scorePronunciation === 0 &&
              item.scorePronunciation === 0) ||
            (item.fluencyInSpeaking === null &&
              item.pronunciation === null &&
              item.generalComment === null &&
              item.vocabularyAndGrammar === null &&
              item.scoreFluencyInSpeaking === null &&
              item.scoreGeneralComment === null &&
              item.scorePronunciation === null &&
              item.scorePronunciation === null)
          ) {
            item.isCommentOrMark = false
          } else {
            item.isCommentOrMark = true
          }
          if (!studentGroup.find(student => item.studentID === student.studentID)) {
            studentGroup.push({
              studentName: item.studentName,
              studentID: item.studentID,
              studentCode: item.studentCode,
              student_userID: item.student_userID,
              listRecord: [item],
            })
          } else {
            studentGroup = studentGroup.map(student => {
              return student.studentID === item.studentID
                ? { ...student, listRecord: [...student.listRecord, item] }
                : student
            })
          }
        })
        this.recordData = this.students.reduce((arr, item) => {
          if (studentGroup.find(student => student.studentID === item.studentID)) {
            arr.push(studentGroup.find(student => student.studentID === item.studentID))
          } else {
            arr.push({
              studentName: item.fullName,
              studentID: item.studentID,
              studentCode: item.studentCode,
              student_userID: item.userID,
              listRecord: [],
            })
          }
          return arr
        }, [])
      })
    },
    async getRecordCategoryByClassID() {
      const headers = []
      headers.push(
        {
          text: 'No',
          value: 'no',
          sortable: false,
          width: '60px',
        },
        {
          text: 'Student code',
          value: 'studentCode',
          sortable: false,
          width: '140px',
        },
        {
          text: 'Student name',
          value: 'studentName',
          sortable: false,
          width: '140px',
        }
      )
      await class_managerment.getRecordCategoryByClassID(this.$route.query.classID).then(res => {
        this.recordHeader = headers
        this.cateraryRecordList = res
      })
    },
    async getStudentList() {
      const headers = []
      headers.push(
        {
          text: 'No',
          value: 'no',
          sortable: false,
          width: '60px',
        },
        {
          text: 'Student code',
          value: 'studentCode',
          sortable: false,
          width: '140px',
        },
        {
          text: 'Student name',
          value: 'studentName',
          sortable: false,
          width: '140px',
        }
      )
      await statistic_management.getStudentList(this.$route.query.classID).then(res => {
        if (res && !res.errors) {
          this.students = res
          this.students.forEach(student => {
            if (student.dueDate) student.dueDate = this._dayjs(student.dueDate).format('DD/MM/YYYY')
            student.startDate = this._dayjs(student.startDate).format('DD/MM/YYYY')
            student.dob = this._dayjs(student.dob).format('DD/MM/YYYY')
            student.outStanding = student.outStanding.toLocaleString('en')
            student.studentAccountBalance = student.studentAccountBalance.toLocaleString('en')
          })
        }
      })
    },
    async markRecord() {
      let comment = {
        recordID: this.recordSelect.recordID,
        generalComment: this.generalComment,
        pronunciation: this.pronunciation,
        fluencyInSpeaking: this.fluencyInSpeaking,
        scoreGeneralComment: 0,
        vocabularyAndGrammar: this.vocabularyAndGrammar,
        scorePronunciation: parseFloat(this.scorePronunciation),
        scoreFluencyInSpeaking: parseFloat(this.scoreFluencyInSpeaking),
        scoreVocabularyAndGrammar: parseFloat(this.scoreVocabularyAndGrammar),
      }
      await class_managerment.updateComment(comment).then(res => {
        console.log(res)
        this.getRecordCategoryByClassID()
        this.getStudentRecordingByClassID()
        this.dialogRecordMark = false
      })
    },
    async getClassInfo() {
      await class_managerment.getClassInfo(this.$route.query.classID).then(res => {
        if (res) {
          this.courseName = res.classInfo.level
          this.classCode = res.classInfo.classCode
          this.classStatus = res.classInfo.classStatus
          this.hour = res.classInfo.hoursPerLesson
          this.book = res.classInfo.book
          this.note = res.classInfo.note
          this.center = res.classInfo.location
          this.precedingClass = res.classInfo.preceeding
          this.classAdmin = res.classInfo.classAdmin
          this.classAdmin_userID = res.classInfo.classAdmin_userID
          this.teacherIDClass = res.classInfo.teacherID
          this.customerCareStaff = res.classInfo.customerCareStaff
          this.classType = res.classInfo.classType
          this.customerCareStaffID = res.classInfo.customerCareStaffID
          this.classGroup = res.classInfo.classGroup
          this.startDate = this._dayjs(res.classInfo.startDate).format('DD/MM/YYYY')
          this.endDate = this._dayjs(res.classInfo.endDate).format('DD/MM/YYYY')
          this.schedules = res.schedules

          this.testAndExamList = res.testSchedule
        }
      })
    },
    viewLessonDetail(classID, scheduleID) {
      this.$router.push({
        name: 'my-calendar-class-name-view-lesson-detail',
        query: { classID: classID, scheduleID: scheduleID },
      })
    },
    takeAttendance(classID, scheduleID) {
      this.$router.push({
        name: 'class-management-take-attendance-student',
        query: { classID: classID, scheduleID: scheduleID },
      })
    },
    createLessonReport(classID, scheduleID) {
      localStorage.setItem('lessonReportRoute', this.$route.path)
      this.$router.push({
        name: 'class-management-create-lesson-report',
        query: { classID: classID, scheduleID: scheduleID },
      })
    },
    viewLessonReport(classID, scheduleID) {
      localStorage.setItem('dateOfDailyClasses', this.date)
      localStorage.removeItem('isBackFromDetailDailyClasses')
      localStorage.setItem('lessonReportRoute', this.$route.path)
      this.$router.push({
        name: 'class-management-view-lesson-report',
        params: { route: this.$route.path },
        query: { classID: classID, scheduleID: scheduleID },
      })
    },
    schedule() {
      this.isSchedule = true
      this.isTestAndExam = false
      this.isStudent = false
      this.isRecording = false
    },
    testAndExam() {
      this.isTestAndExam = true
      this.isSchedule = false
      this.isStudent = false
      this.isRecording = false
    },
    listStudent() {
      this.isStudent = true
      this.isTestAndExam = false
      this.isSchedule = false
      this.isRecording = false
    },
    recording() {
      this.isTestAndExam = false
      this.isSchedule = false
      this.isStudent = false
      this.isRecording = true
    },
    back() {
      // localStorage.setItem('isBackFromDetailDailyClasses', true)
      // if (this.$route.query.fromAvege === true) {
      //   this.$router.push({
      //     name: 'student-av-report',
      //     query: {
      //       isbackfromDetail: true,
      //     },
      //   })
      // } else if (this.$route.query.fromOutStanding === true) {
      //   this.$router.push({
      //     name: 'report-outstanding-report',
      //   })
      // } else if (this.$route.query.isbackToDailyClass === true) {
      //   this.$router.push({
      //     name: 'class-management-daily-classes',
      //   })
      // } else {
      window.history.go(-1)
      // window.history.back()
      // }
    },
    _dayjs: dayjs,
  },
  watch: {
    model: function () {},
    recordCategory: function () {},
    isTestAndExam: function () {},
    isSchedule: function () {},
    isStudent: function () {},
    isRecording: function () {},
    // commentList: function () {},
    // listStudentInClassFollowDate: function () {},
    students: function () {
      this.getStudentRecordingByClassID()
    },
  },
}
</script>
<style lang="scss" scoped>
.actionIcon img {
  margin-left: 10px;
}
.text-right {
  text-align: right;
}
.record-form {
  width: 100%;
}
#lesson-management {
  .list-info {
    position: relative;

    .item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed #dadbe6;
      padding: 11px 0;
    }

    .border-vertical {
      position: absolute;
      bottom: 24px;
      right: 0;
      width: 1px;
      height: 100%;
      background: url(~@/assets/images/line-vertical.png) no-repeat bottom center;
    }
  }
  .link {
    cursor: pointer;

    color: #427df2 !important;
  }
  .w-150 {
    width: 100px;
  }
  .record-header-item {
    width: 160px;
  }
  .link:hover {
    text-decoration: underline;
    font-weight: 700;
  }

  .slot-infor {
    max-width: 500px;

    .item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed #dadbe6;
      padding: 11px 0;
    }
  }

  .imageVector {
    width: 19px;
    height: 18px;
  }
}
.dig-video .v-dialog {
  box-shadow: none !important;
}
.h {
  background: rgba(0, 0, 0, 0.01);
  position: fixed;
  width: 100%;
  height: 100%;

  top: 0;
  z-index: 1000;
  left: 0;
}

.card-i {
  width: 500px;
  position: absolute;
  top: 50%;

  left: 50%;
  transform: translate(-50%, -50%);
}

.btnNote {
  float: right;
  margin-top: 20px;
}
.link-toNewTab {
  float: right;
}
.btnNote button {
  margin-left: 20px;
  min-width: 150px !important;
}
.iconEdit {
  opacity: 0.6;
}
.disible {
  pointer-events: none;
  color: #0c2e68;

  opacity: 0.4;
}
.record-table {
  border-top: 1px solid #dae3e8 !important;
}
.btn-comment-record {
  width: 120px;
  font-size: 10px;
}
.record-header th {
  color: #fff !important;
  background: #0c2e68 !important;
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
  text-align: center;
}
.record-header th:nth-child(1) {
  position: sticky;
  left: 0;
  z-index: 10;
}
.record-header th:nth-child(3) {
  position: sticky;
  left: 170px;
  z-index: 10;
}
.record-header th:nth-child(2) {
  position: sticky;
  left: 50px;
  z-index: 10;
}
.record-header-item p {
  font-weight: 500;
  width: 100px;
}
.record-body tr:nth-child(even) {
  background: #eaf1ff;
}
.header-comment {
  width: 100%;
}
.record-body tr td:nth-child(1) {
  position: sticky;
  left: 0;
}
.record-body tr td:nth-child(2) {
  position: sticky;
  // left: 100%;
  left: 50px;
}
.record-body tr td:nth-child(3) {
  position: sticky;
  left: 170px;
}
.record-body tr:nth-child(even) td:nth-child(3) {
  background: #eaf1ff !important;
}
.record-body tr:nth-child(odd) td:nth-child(3) {
  background: #fff !important;
}
.record-body tr:nth-child(even) td:nth-child(2) {
  background: #eaf1ff !important;
}
.record-body tr:nth-child(odd) td:nth-child(2) {
  background: #fff !important;
}
.record-body tr:nth-child(even) td:nth-child(1) {
  background: #eaf1ff !important;
}
.record-body tr:nth-child(odd) td:nth-child(1) {
  background: #fff !important;
}
.record-body tr:nth-child(even) {
  background: #eaf1ff;
}
.tab-sadown {
  position: relative;
  box-shadow: 0px 9px 2px -9px #000;
}
.fz-1 {
  font-size: 16px;
}
.editor {
  margin-top: 20px;
  position: relative;
  span {
    font-size: 14px;
    position: absolute;
    left: 0;
    top: 0;
    transform: translate(10px, -50%);
    background-color: #ffff;
    color: '#5E6368';
  }
}
.error--text {
  color: #dc322d !important;
  caret-color: #dc322d !important;
}
</style>
