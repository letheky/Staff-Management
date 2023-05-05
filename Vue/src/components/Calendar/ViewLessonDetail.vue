<template>
  <div id="lesson-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <h2 class="d-flex">
            <v-icon @click="back()">arrow_back_ios</v-icon>
            <div class="d-flex align-center">Class code: {{ classCode }}</div>
          </h2>
          <div class="pl-8 pb-10">
            <span style="color: #0c2e68" class="fs-14"
              >Product name: {{ departmentName }}</span
            >
            <h3>Course name: {{ lessonName }} ({{ lessonStatus }})</h3>
          </div>
          <v-divider style="border: 1px solid #e5e5e5"></v-divider>
          <v-progress-linear
            v-if="isLoading"
            indeterminate
            color="primary"
            class="my-10"
          ></v-progress-linear>
          <div class="pt-3">
            <v-row>
              <v-col md="8" class="pt-7">
                <div>
                  <div class="d-flex justify-space-between">
                    <h2>Lesson {{ lessonNo }}</h2>
                    <v-btn
                      color="secondary"
                      @click="takeAttendance(classID, scheduleID)"
                      outlined
                      >Student attendance</v-btn
                    >
                  </div>
                  <p>Date {{ date }}, Time: {{ time }}</p>
                </div>
                <div class="pt-5">
                  <h3>Detail</h3>
                  <v-row>
                    <v-col md="6">
                      <div class="list-info">
                        <div class="item">
                          <v-row>
                            <v-col md="4">Page</v-col>
                            <v-col md="8">
                              <div
                                v-if="!page.includes('https://')"
                                v-html="page"
                              ></div>
                              <div
                                v-else
                                v-for="(item, index) in pageListReplaced"
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
                            </v-col>
                          </v-row>
                        </div>
                        <div class="item">
                          <v-row>
                            <v-col md="4">Unit</v-col>
                            <v-col md="8">
                              <div
                                v-if="!unitLink.includes('https://')"
                                v-html="unitLink"
                              ></div>
                              <div
                                v-else
                                v-for="(item, index) in unitLinkListReplaced"
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
                            </v-col>
                          </v-row>
                        </div>
                        <div class="item">
                          <v-row>
                            <v-col md="4">Topic</v-col>
                            <v-col md="8">
                              <div
                                v-if="!topic.includes('https://')"
                                v-html="topic"
                              ></div>
                              <div
                                v-else
                                v-for="(item, index) in topicListReplaced"
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
                            </v-col>
                          </v-row>
                        </div>
                        <div class="item">
                          <v-row>
                            <v-col md="4">Content</v-col>
                            <v-col md="8">
                              <div
                                v-if="!content.includes('https://')"
                                v-html="content"
                              ></div>
                              <div
                                v-else
                                v-for="(item, index) in contentListReplaced"
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
                            </v-col>
                          </v-row>
                        </div>
                      </div>
                    </v-col>
                    <v-col md="6">
                      <div class="list-info">
                        <div class="item">
                          <v-row>
                            <v-col md="4">Skills focused</v-col>
                            <v-col md="8">
                              <div
                                v-if="!skillsFocused.includes('https://')"
                                v-html="skillsFocused"
                              ></div>
                              <div
                                v-else
                                v-for="(
                                  item, index
                                ) in skillsFocusedListReplaced"
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
                            </v-col>
                          </v-row>
                        </div>
                        <div class="item">
                          <v-row>
                            <v-col md="4">Objective</v-col>
                            <v-col md="8">
                              <div
                                v-if="!objective.includes('https://')"
                                v-html="objective"
                              ></div>
                              <div
                                v-else
                                v-for="(item, index) in objectiveListReplaced"
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
                            </v-col>
                          </v-row>
                        </div>
                        <div class="item">
                          <v-row>
                            <v-col md="4">Homework</v-col>
                            <v-col md="8">
                              <div
                                v-if="!homeWork.includes('https://')"
                                v-html="homeWork"
                              ></div>
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
                            </v-col>
                          </v-row>
                        </div>
                        <div class="item">
                          <v-row>
                            <v-col md="4">Supplementary</v-col>
                            <v-col md="8">
                              <div
                                v-if="!supplementary.includes('https://')"
                                v-html="supplementary"
                              ></div>
                              <div
                                v-else
                                v-for="(
                                  item, index
                                ) in supplementaryListReplaced"
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
                            </v-col>
                          </v-row>
                        </div>
                        <div class="item">
                          <v-row>
                            <v-col md="4">Recording</v-col>
                            <v-col md="8">
                              <div
                                v-if="!recording.includes('https://')"
                                v-html="recording"
                              ></div>
                              <div
                                v-else
                                v-for="(item, index) in recordingListReplaced"
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
                            </v-col>
                          </v-row>
                        </div>
                        <div class="item">
                          <v-row>
                            <v-col md="4">Note</v-col>
                            <v-col md="8">
                              <div
                                v-if="!note.includes('https://')"
                                v-html="note"
                              ></div>
                              <div
                                v-else
                                v-for="(item, index) in noteListReplaced"
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
                            </v-col>
                          </v-row>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-divider vertical />
              <!-- <v-col md="4"> </v-col> -->
            </v-row>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent width="350">
        <v-card class="mx-auto pa-10">
          <div class="text-center">
            <h1>Error!</h1>
            <p>{{ message.messages.UNKNOWN_ERROR }}</p>
          </div>
          <div class="text-center">
            <v-btn color="error" elevation="0" @click="back()" outlined>
              Back
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
import message from "@/components/Utils/message";

export default {
  components: {},
  data() {
    return {
      isLoading: false,
      scheduleID: this.$route.query.scheduleID,
      classID: this.$route.query.classID,
      lessonName: "",
      lessonStatus: "",
      lessonNo: "",
      date: "",
      time: "",
      page: "",
      pageList: [],
      pageReplace: "",
      pageListReplaced: [],
      unitLink: "",
      unitLinkList: [],
      unitLinkReplace: "",
      unitLinkListReplaced: [],
      topic: "",
      topicList: [],
      topicReplace: "",
      topicListReplaced: [],
      content: "",
      contentList: [],
      contentReplace: "",
      contentListReplaced: [],
      skillsFocused: "",
      skillsFocusedList: [],
      skillsFocusedReplace: "",
      skillsFocusedListReplaced: [],
      objective: "",
      objectiveList: [],
      objectiveReplace: "",
      objectiveListReplaced: [],
      homeWork: "",
      homeWorkList: [],
      homeWorkReplace: "",
      homeWorkListReplaced: [],
      supplementary: "",
      supplementaryList: [],
      supplementaryReplace: "",
      supplementaryListReplaced: [],
      recording: "",
      recordingList: [],
      recordingReplace: "",
      recordingListReplaced: [],
      note: "",
      noteList: [],
      noteReplace: "",
      noteListReplaced: [],
      classCode: "",
      departmentName: "",
      dialog: false,
      message: message,
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await class_managerment.getClassInfo(this.classID).then((res) => {
        if (res) {
          this.classCode = res.classInfo.classCode;
          this.lessonName = res.classInfo.level;
        }
      });
      await class_managerment
        .getClassScheduleDetail(this.scheduleID)
        .then((res) => {
          if (res.mess.message != "Not Found") {
            this.lessonStatus = res.syllabusItem.scheduleInfos.classStatus;
            this.date = this._dayjs(res.syllabusItem.scheduleInfos.date).format(
              "DD/MM/YYYY"
            );
            this.departmentName = res.syllabusItem.scheduleInfos.department;
            this.time = res.syllabusItem.scheduleInfos.classTime;
            this.lessonNo = res.syllabusItem.scheduleInfos.lessonNo;

            this.page = res.syllabusItem.syllabus.studentBookPage;
            if (this.page.includes("<br/>") || this.page.includes("<br />")) {
              this.page = this.page.replaceAll("<br/>", "<br>");
              this.page = this.page.replaceAll("<br />", "<br>");
            }
            this.pageList = this.page.split("<br>");
            this.pageList.forEach((x) => {
              this.pageReplace = x
                .replaceAll("https://", "*https://")
                .split("*");
              this.pageListReplaced.push({
                label: this.pageReplace[0],
                value: this.pageReplace[1],
              });
            });
            this.unitLink = res.syllabusItem.syllabus.unitLink;
            if (
              this.unitLink.includes("<br/>") ||
              this.unitLink.includes("<br />")
            ) {
              this.unitLink = this.unitLink.replaceAll("<br/>", "<br>");
              this.unitLink = this.unitLink.replaceAll("<br />", "<br>");
            }
            this.unitLinkList = this.unitLink.split("<br>");
            this.unitLinkList.forEach((x) => {
              this.unitLinkReplace = x
                .replaceAll("https://", "*https://")
                .split("*");
              this.unitLinkListReplaced.push({
                label: this.unitLinkReplace[0],
                value: this.unitLinkReplace[1],
              });
            });
            this.topic = res.syllabusItem.syllabus.topic;
            if (this.topic.includes("<br/>") || this.topic.includes("<br />")) {
              this.topic = this.topic.replaceAll("<br/>", "<br>");
              this.topic = this.topic.replaceAll("<br />", "<br>");
            }
            this.topicList = this.topic.split("<br>");
            this.topicList.forEach((x) => {
              this.topicReplace = x
                .replaceAll("https://", "*https://")
                .split("*");
              this.topicListReplaced.push({
                label: this.topicReplace[0],
                value: this.topicReplace[1],
              });
            });
            this.content = res.syllabusItem.syllabus.lessonContent;
            if (
              this.content.includes("<br/>") ||
              this.content.includes("<br />")
            ) {
              this.content = this.content.replaceAll("<br/>", "<br>");
              this.content = this.content.replaceAll("<br />", "<br>");
            }
            this.contentList = this.content.split("<br>");
            this.contentList.forEach((x) => {
              this.contentReplace = x
                .replaceAll("https://", "*https://")
                .split("*");
              this.contentListReplaced.push({
                label: this.contentReplace[0],
                value: this.contentReplace[1],
              });
            });
            this.skillsFocused = res.syllabusItem.syllabus.skillsFocused;
            if (
              this.skillsFocused.includes("<br/>") ||
              this.skillsFocused.includes("<br />")
            ) {
              this.skillsFocused = this.skillsFocused.replaceAll(
                "<br/>",
                "<br>"
              );
              this.skillsFocused = this.skillsFocused.replaceAll(
                "<br />",
                "<br>"
              );
            }
            this.skillsFocusedList = this.skillsFocused.split("<br>");
            this.skillsFocusedList.forEach((x) => {
              this.skillsFocusedReplace = x
                .replaceAll("https://", "*https://")
                .split("*");
              this.skillsFocusedListReplaced.push({
                label: this.skillsFocusedReplace[0],
                value: this.skillsFocusedReplace[1],
              });
            });
            this.objective = res.syllabusItem.syllabus.objective;
            if (
              this.objective.includes("<br/>") ||
              this.objective.includes("<br />")
            ) {
              this.objective = this.objective.replaceAll("<br/>", "<br>");
              this.objective = this.objective.replaceAll("<br />", "<br>");
            }
            this.objectiveList = this.objective.split("<br>");
            this.objectiveList.forEach((x) => {
              this.objectiveReplace = x
                .replaceAll("https://", "*https://")
                .split("*");
              this.objectiveListReplaced.push({
                label: this.objectiveReplace[0],
                value: this.objectiveReplace[1],
              });
            });
            this.homeWork = res.syllabusItem.syllabus.homeWork;
            if (
              this.homeWork.includes("<br/>") ||
              this.homeWork.includes("<br />")
            ) {
              this.homeWork = this.homeWork.replaceAll("<br/>", "<br>");
              this.homeWork = this.homeWork.replaceAll("<br />", "<br>");
            }
            this.homeWorkList = this.homeWork.split("<br>");
            this.homeWorkList.forEach((x) => {
              this.homeWorkReplace = x
                .replaceAll("https://", "*https://")
                .split("*");
              this.homeWorkListReplaced.push({
                label: this.homeWorkReplace[0],
                value: this.homeWorkReplace[1],
              });
            });
            this.supplementary =
              res.syllabusItem.syllabus.supplementaryMaterials;
            if (
              this.supplementary.includes("<br/>") ||
              this.supplementary.includes("<br />")
            ) {
              this.supplementary = this.supplementary.replaceAll(
                "<br/>",
                "<br>"
              );
              this.supplementary = this.supplementary.replaceAll(
                "<br />",
                "<br>"
              );
            }
            this.supplementaryList = this.supplementary.split("<br>");
            this.supplementaryList.forEach((x) => {
              this.supplementaryReplace = x
                .replaceAll("https://", "*https://")
                .split("*");
              this.supplementaryListReplaced.push({
                label: this.supplementaryReplace[0],
                value: this.supplementaryReplace[1],
              });
            });
            this.recording = res.syllabusItem.syllabus.recording;
            if (
              this.recording.includes("<br/>") ||
              this.recording.includes("<br />")
            ) {
              this.recording = this.recording.replaceAll("<br/>", "<br>");
              this.recording = this.recording.replaceAll("<br />", "<br>");
            }
            this.recordingList = this.recording.split("<br>");
            this.recordingList.forEach((x) => {
              this.recordingReplace = x
                .replaceAll("https://", "*https://")
                .split("*");
              this.recordingListReplaced.push({
                label: this.recordingReplace[0],
                value: this.recordingReplace[1],
              });
            });
            this.note = res.syllabusItem.syllabus.note;
            if (this.note.includes("<br/>") || this.note.includes("<br />")) {
              this.note = this.note.replaceAll("<br/>", "<br>");
              this.note = this.note.replaceAll("<br />", "<br>");
            }
            this.noteList = this.note.split("<br>");
            this.noteList.forEach((x) => {
              this.noteReplace = x
                .replaceAll("https://", "*https://")
                .split("*");
              this.noteListReplaced.push({
                label: this.noteReplace[0],
                value: this.noteReplace[1],
              });
            });
          } else {
            this.dialog = true;
          }
        });
    },
    // detectURLs(message) {
    //   var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    //   return message.match(urlRegex);
    // },
    // replaceURLs(message) {
    //   if (!message) return;

    //   var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    //   return message.replace(urlRegex, function (url) {
    //     var hyperlink = url;
    //     if (!hyperlink.match("^https?://")) {
    //       hyperlink = "http://" + hyperlink;
    //     }
    //     return (
    //       '<a href="' +
    //       hyperlink +
    //       '" target="_blank" rel="noopener noreferrer">' +
    //       url +
    //       "</a>"
    //     );
    //   });
    // },
    takeAttendance(classID, scheduleID) {
      this.$router.push({
        name: "class-management-take-attendance-student",
        query: { classID: classID, scheduleID: scheduleID },
      });
    },
    redirectNewTab(link) {
      console.log(link);
      // let routeData = this.$router.resolve({ name: "chat" });
      // window.open(routeData.href, "_blank");
    },
    back() {
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
      .link-action {
        text-decoration: underline;
        text-decoration-color: blue;
      }
      .text-action {
        color: #000000;
      }
    }
    .border-vertical {
      position: absolute;
      bottom: 24px;
      right: 0;
      width: 1px;
      height: 100%;
      background: url(~@/assets/images/line-vertical.png) no-repeat bottom
        center;
    }
  }
}
</style>
