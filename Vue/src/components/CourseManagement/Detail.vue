<template>
  <div id="add-new-course">
    <v-row no-gutters>
      <v-col md="7">
        <div class="px-10 pt-5">
          <h2 class="d-flex mb-5">
            <v-icon @click="back()">arrow_back_ios</v-icon>
            <div class="d-flex align-center">Detail Course</div>
          </h2>
          <div class="d-flex align-start mb-5">
            <img
              v-if="!photo"
              src="@/assets/images/course-logo.svg"
              alt="John"
            />
            <img
              v-else
              :src="'data:image/jpeg;base64,' + photo"
              class="image-action"
            />
            <div class="pl-2">
              <span>{{ departmentName }} > {{ program }}</span>
              <h3 class="font-weight-bold">{{ courseCode }}</h3>
              <h1 class="font-weight-light">{{ courseNameEN }}</h1>
              <h1 class="font-weight-light">{{ courseNameVN }}</h1>
            </div>
          </div>
          <div class="description">
            <h4>Information about the course</h4>
            {{ description }}
          </div>
          <div class="description">
            <h4>Our commitment to you</h4>
            {{ outputTarget }}
          </div>
        </div>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col md="5">
        <div class="d-flex justify-end px-10 pt-5">
          <!-- <v-btn
            outlined
            elevation="0"
            height="36"
            class="mr-4"
            color="secondary"
          >
            Syllabus
          </v-btn>
          <v-btn outlined elevation="0" height="36" color="secondary">
            Edit Course
          </v-btn> -->
        </div>
        <div class="px-10 pt-5">
          <h3 class="mb-2">Course setting</h3>
          <div class="course-info">
            <div class="item">
              <div>Duration (hrs)</div>
              <div>{{ duration }}</div>
            </div>
            <div class="item">
              <div>Fee per hours (VND)</div>
              <div>
                {{ fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
              </div>
            </div>
            <div class="item">
              <div>School fee (VND)</div>
              <div>
                {{ schoolFee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
              </div>
            </div>
          </div>
          <div class="course-info">
            <div class="item">
              <div>Course tmpl.</div>
              <div>{{ courseTemplate }}</div>
            </div>
            <div class="item">
              <div>Book</div>
              <div>{{ book }}</div>
            </div>
            <div class="item">
              <div>Status</div>
              <div>
                <v-chip
                  small
                  v-if="status == 'Inactive'"
                  color="rgba(247, 119, 26, 0.1)"
                  >Inactive</v-chip
                >
                <v-chip small v-else color="rgba(39, 174, 96, 0.1)"
                  >Active</v-chip
                >
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { course_managerment } from "@/api/course-management.js";
export default {
  components: {},
  data() {
    return {
      status: this.$route.query.status,
      levelID: this.$route.query.levelID,
      courseCode: "",
      courseNameVN: "",
      courseNameEN: "",
      duration: "",
      fee: "",
      schoolFee: "",
      courseTemplate: "",
      book: "",
      photo: "",
      description: "",
      outputTarget: "",
      program: "",
      departmentName: "",
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await course_managerment.getDetailCourse(this.levelID).then((res) => {
        if (res) {
          this.photo = res.photo;
          this.courseCode = res.levelCode;
          this.courseNameVN = res.levelVN;
          this.courseNameEN = res.level;
          this.duration = res.duration;
          this.fee = res.fee / res.duration;
          this.schoolFee = res.fee;
          this.courseTemplate = res.certificateLevelTitle;
          this.book = res.programme;
          this.program = res.programme;
          this.departmentName = res.departmentName;
          this.description = res.description;
          this.outputTarget = res.outputTarget;
        }
      });
    },
    back() {
      window.history.back();
    },
  },
};
</script>
<style lang="scss" scoped>
.image-action {
  max-width: 100%;
  height: 150px;
  object-fit: contain;
}
.description {
  background: #faf9ff;
  border-radius: 4px;
  padding: 8px 16px 14px 16px;
  margin-bottom: 14px;
  small {
    font-size: 12px;
    line-height: 14px;
  }
}
.course-info {
  background: #faf9ff;
  border-radius: 6px;
  padding: 10px 24px 24px 24px;
  margin-bottom: 20px;
  .item {
    display: flex;
    border-bottom: 1px dashed #dadbe6;
    line-height: 40px;
    div:first-child {
      width: 170px;
    }
  }
}
</style>
