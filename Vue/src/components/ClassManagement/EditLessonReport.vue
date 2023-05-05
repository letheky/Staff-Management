<template>
  <div id="lesson-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <v-row>
            <v-col md="8">
              <div class="d-flex justify-space-between">
                <h2 class="d-flex">
                  <v-icon @click="back()">arrow_back_ios</v-icon>
                  <div class="d-flex align-center">Edit lesson report</div>
                </h2>
                <v-btn color="secondary" @click="updateLessonReport()">
                  Save
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <div v-if="message == 'Ok'" class="success">
            <v-alert
              :value="checkSuccess"
              transition="scale-transition"
              type="success"
              style="font-size: 14px; padding: 12px"
            >
              Update lesson report successfully!
            </v-alert>
          </div>
          <div class="pt-5">
            <v-row>
              <v-col md="8">
                <!-- <v-progress-linear
                  v-if="isLoading"
                  indeterminate
                  color="primary"
                  class="my-10"
                ></v-progress-linear> -->
                <v-row>
                  <v-col md="1">
                    <h4 class="mr-2">Link</h4>
                  </v-col>
                  <v-col md="11">
                    <v-textarea
                      v-model="linkEditor"
                      outlined
                      dense
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-col>
              <v-divider style="height: 70vh" vertical />
              <v-col md="4">
                <h2>Class information</h2>
                <div class="list-info">
                  <div class="item">
                    <v-row>
                      <v-col md="6">Course</v-col>
                      <v-col md="6">{{ course }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="6">Class code</v-col>
                      <v-col md="6">{{ classCode }}</v-col>
                    </v-row>
                  </div>
                  <div class="item">
                    <v-row>
                      <v-col md="6">Class name</v-col>
                      <v-col md="6">{{ className }}</v-col>
                    </v-row>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-col>
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
      customToolbar: [["link"]],
      classID: this.$route.query.classID,
      scheduleID: this.$route.query.scheduleID,
      linkEditor: "",
      checkSuccess: false,
      isLoading: false,
      message: "",
      course: "",
      classCode: "",
      className: "",
      route: localStorage.getItem("lessonReportRoute"),
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await class_managerment.getClassInfo(this.classID).then((res) => {
        if (res) {
          this.course = res.classInfo.programme;
          this.classCode = res.classInfo.classCode;
          this.className = res.classInfo.className;
        }
      });
      this.isLoading = true;
      await class_managerment.viewLessonReport(this.scheduleID).then((res) => {
        if (res) {
          this.linkEditor = res.learningObjectives;
          this.warmUpEditor = res.warmUp;
          this.runningContentEditor = res.runningContent;
          this.homeworkEditor = res.homework;
          this.commentEditor = res.comments;
        }
      });
      this.isLoading = false;
    },
    updateLessonReport() {
      const body = {
        scheduleID: this.scheduleID,
        learningObjectives: this.linkEditor,
        warmUp: "",
        runningContent: "",
        homework: "",
        comments: "",
        status: "INPROGRESS",
      };
      class_managerment.createLessonReport(body).then((res) => {
        if (res.message.messages == "Ok") {
          this.message = res.message.messages;
          this.checkSuccess = true;
          setTimeout(() => {
            this.checkSuccess = false;
            if (this.route == "/class-management/class-list") {
              localStorage.setItem("isBackFromDetailDailyClasses", true);
              this.$router.push({ name: "class-management-class-list" });
            } else if (this.route == "/class-management/detail") {
              this.$router.push({
                name: "class-management-detail",
                query: { classID: this.classID },
              });
            } else if (this.route == "/my-calendar/view-class-detail") {
              this.$router.push({
                name: "my-calendar-class-detail",
                query: { classID: this.classID },
              });
            } else if (
              this.route == "/my-calendar/overview" ||
              this.route == "/my-calendar/daily-classes"
            ) {
              this.$router.push({
                name: "class-management-view-lesson-report",
                query: { classID: this.classID, scheduleID: this.scheduleID },
              });
            } else if (this.route == "/class-management/calendar") {
              this.$router.push({
                name: "class-management-calendar",
              });
            }
          }, 2000);
        }
      });
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
  .success {
    width: 300px;
    position: absolute;
    right: 0;
    bottom: 5%;
    z-index: 999;
  }
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
