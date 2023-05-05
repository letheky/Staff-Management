<template>
  <div id="lesson-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <h2 class="d-flex">
            <v-icon @click="back()">arrow_back_ios</v-icon>
            <div class="d-flex align-center">{{ classCode }}</div>
          </h2>
          <div class="pt-6 pl-8 pb-10">
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
                      <v-col md="6">{{ classAdmin }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="6">Customer care staff</v-col>
                      <v-col md="6">{{ customerCareStaff }}</v-col>
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
                      <v-col md="8">{{ level }}</v-col>
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
          <v-divider style="border: 1px solid #e5e5e5"></v-divider>
          <v-tabs>
            <v-tab> Schedule </v-tab>
          </v-tabs>
          <div>
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
                  :items-per-page="itemsPerPage"
                  hide-default-footer
                  @page-count="pageCount = $event"
                  :calculate-widths="calWidth"
                  class="elevation-0"
                  fixed-header
                >
                  <template v-slot:[`item.date`]="{ item }">
                    {{ _dayjs(item.date).format("DD/MM/YYYY") }}
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
                    <div class="d-flex">
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <i
                            v-bind="attrs"
                            v-on="on"
                            @click="
                              viewHomework(
                                item.scheduleID,
                                item.startTime,
                                item.endTime
                              )
                            "
                            class="
                              cursor
                              isax isax-book-square
                              fs-18
                              font-weight-bold
                              mr-4
                            "
                          ></i>
                        </template>
                        <span>View homework</span>
                      </v-tooltip>
                      <v-tooltip
                        top
                        v-if="item.statusLessonReport == 'APPROVED'"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <i
                            v-bind="attrs"
                            v-on="on"
                            @click="viewLessonReport(item.scheduleID)"
                            class="
                              cursor
                              isax isax-card-edit
                              fs-18
                              font-weight-bold
                              mr-4
                            "
                          ></i>
                        </template>
                        <span>View lesson report</span>
                      </v-tooltip>
                    </div>
                  </template>
                </v-data-table>
              </v-col>
              <div v-if="!isLoading" color="#fff" class="w-100">
                <v-row>
                  <v-col md="3">
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
                  <v-col md="9" class="d-flex justify-end">
                    <v-pagination
                      v-model="page"
                      :length="pageCount"
                      elevation="0"
                    ></v-pagination>
                  </v-col>
                </v-row>
              </div>
            </v-row>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="homeworkDialog" persistent width="350">
        <v-card class="mx-auto">
          <v-toolbar flat color="blue" height="40">
            <v-toolbar-title style="font-size: 14px" class="font-weight-bold">
              Homework: {{ classCode }},
              {{ _dayjs(startTime).format("HH:mm") }} -
              {{ _dayjs(endTime).format("HH:mm") }}
            </v-toolbar-title>
          </v-toolbar>
          <div v-if="homework" class="pa-4">
            <div v-if="!homework.includes('https://')" v-html="homework"></div>
            <div
              v-else
              v-for="(item, index) in homeWorkListReplaced"
              :key="index"
            >
              <a
                v-if="item.value"
                target="_blank"
                :href="item.value"
                class="link-action"
              >
                {{ item.label.replaceAll(":", "") }}
              </a>
              <div class="text-action" v-else>
                {{ item.label }}
              </div>
            </div>
          </div>
          <p v-else class="text-center pt-2">This lesson has no homework</p>
          <div class="text-center pt-5">
            <v-btn
              class="mb-2"
              color="error"
              elevation="0"
              @click="
                homeworkDialog = false;
                homeWorkListReplaced = [];
              "
              outlined
            >
              Cancel
            </v-btn>
          </div>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { class_managerment } from "@/api/class-management.js";
import dayjs from "dayjs";

export default {
  components: {},
  data() {
    return {
      isLoading: false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      calWidth: true,
      classID: this.$route.query.classID,
      studentID: JSON.parse(localStorage.getItem("currentUser")).userInfo
        .studentID,
      classCode: "",
      startTime: "",
      endTime: "",
      level: "",
      hour: "",
      book: "",
      note: "",
      center: "",
      precedingClass: "",
      classAdmin: "",
      customer: "",
      classType: "",
      classGroup: "",
      startDate: "",
      endDate: "",
      scheduleHeaders: [
        {
          text: "Date",
          value: "date",
          sortable: false,
        },
        {
          text: "Time",
          value: "classTime",
          sortable: false,
        },
        { text: "Room", value: "room", sortable: false },
        { text: "Lesson", value: "lessonNo", sortable: false },
        { text: "Action", value: "action", sortable: false },
      ],
      schedules: [],
      homeworkDialog: false,
      homework: "",
      homeWorkList: [],
      homeWorkReplace: "",
      homeWorkListReplaced: [],
    };
  },
  created() {
    this.getCalendar();
  },
  methods: {
    async getCalendar() {
      await class_managerment.getClassInfo(this.classID).then((res) => {
        if (res) {
          this.classCode = res.classInfo.classCode;
          this.level = res.classInfo.level;
          this.hour = res.classInfo.hoursPerLesson;
          this.book = res.classInfo.book;
          this.note = res.classInfo.note;
          this.center = res.classInfo.location;
          this.precedingClass = res.classInfo.preceeding;
          this.classAdmin = res.classInfo.classAdmin;
          this.customer = res.classInfo.customerCareStaff;
          this.classType = res.classInfo.classType;
          this.classGroup = res.classInfo.classGroup;
          this.startDate = this._dayjs(res.classInfo.startDate).format(
            "DD/MM/YYYY"
          );
          this.endDate = this._dayjs(res.classInfo.endDate).format(
            "DD/MM/YYYY"
          );
          this.schedules = res.schedules;
        }
      });
    },
    async viewLessonReport(scheduleID) {
      await class_managerment.viewLessonReport(scheduleID).then((res) => {
        if (res) {
          let routeData = res.learningObjectives;
          window.open(routeData, "_blank");
        }
      });
    },
    async viewHomework(scheduleID, startTime, endTime) {
      this.homeworkDialog = true;
      this.startTime = startTime;
      this.endTime = endTime;
      await class_managerment.getClassScheduleDetail(scheduleID).then((res) => {
        if (res.mess.message == "Ok") {
          this.homework = res.syllabusItem.syllabus.homeWork;
          if (
            this.homework.includes("<br/>") ||
            this.homework.includes("<br />")
          ) {
            this.homework = this.homework.replaceAll("<br/>", "<br>");
            this.homework = this.homework.replaceAll("<br />", "<br>");
          }
          this.homeWorkList = this.homework.split("<br>");
          this.homeWorkList.forEach((x) => {
            this.homeWorkReplace = x
              .replaceAll("https://", "*https://")
              .split("*");
            this.homeWorkListReplaced.push({
              label: this.homeWorkReplace[0],
              value: this.homeWorkReplace[1],
            });
          });
        }
      });
    },
    back() {
      //   localStorage.setItem("isBackFromDetailDailyClasses", true);
      window.history.back();
    },
    _dayjs: dayjs,
  },
};
</script>
<style lang="scss" scoped>
#lesson-management {
  .list-info {
    position: relative;
    .item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed #dadbe6;
      padding: 11px 0;
    }
  }
}
</style>