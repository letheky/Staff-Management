<template>
  <div id="center-management">
    <v-row no-gutters v-if="!isLoading">
      <v-col md="7">
        <div class="pa-10 pt-5 d-flex justify-space-between">
          <h2 class="d-flex">
            <v-icon @click="back()">arrow_back_ios</v-icon>
            <div class="d-flex align-center">View news</div>
          </h2>
        </div>
      </v-col>
      <v-divider vertical style="color: #e5e5e5" />
      <v-col md="5" class="text-right">
        <div class="pt-5 pr-10">
          <v-btn color="primary" outlined @click="editNew()">Edit News</v-btn>
        </div>
      </v-col>
    </v-row>
    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="primary"
      class="my-10"
    ></v-progress-linear>
    <v-row no-gutters class="pb-10" v-if="!isLoading">
      <v-col md="7" class="pr-5">
        <div class="pl-10">
          <div class="">
            <img :src="image" />
            <p class="font-weight-bold" style="font-size: 18px">
              {{ newEdit.title }}
            </p>
            <v-divider />
            <div class="mt-5">
              <div v-html="newEdit.contentText"></div>
            </div>
          </div>
        </div>
      </v-col>
      <v-divider vertical />
      <v-col md="5" class="pa-5 pt-0">
        <h2>News information</h2>
        <v-card
          style="background-color: rgba(250, 249, 255, 1)"
          class="pa-5 pl-0 pt-0"
          elevation="0"
        >
          <v-card-title
            class="justify-space-between item"
            style="font-size: 14px"
          >
            <span>Created date</span>
            <span>{{
              _dayjs(newEdit.crtdDate).format("DD/MM/YYYY HH:mm:ss")
            }}</span>
          </v-card-title>
          <v-card-title
            class="justify-space-between item"
            style="font-size: 14px"
          >
            <span>Created by</span>
            <span>{{ newEdit.crtdUser }}</span>
          </v-card-title>
        </v-card>
        <v-card
          style="background-color: rgba(250, 249, 255, 1)"
          class="pa-5 pl-0 pt-0 mt-4"
          elevation="0"
        >
          <v-card-title
            class="justify-space-between item"
            style="font-size: 14px"
          >
            <span>Updated date</span>
            <span>{{
              _dayjs(newEdit.lUpdDate).format("DD/MM/YYYY HH:mm:ss")
            }}</span>
          </v-card-title>
          <v-card-title
            class="justify-space-between item"
            style="font-size: 14px"
          >
            <span>Updated by</span>
            <span>{{ newEdit.lUpdUser }}</span>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { center_managerment } from "@/api/center-management.js";
import dayjs from "dayjs";

const querystring = require("querystring");
export default {
  components: {},
  data() {
    return {
      isLoading: false,
      centerList: JSON.parse(localStorage.getItem("currentUser"))
        .locationPermissions,
      centerId: this.$route.params.centerId,
      page: this.$route.params.pageIndex,
      itemsPerPage: this.$route.params.pageSize,
      newID: this.$route.params.newsID,
      titleNew: "",
      status: "",
      image: "",
      newEdit: "",
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.isLoading = true;
      let body = {
        pageIndex: this.page,
        pageSize: this.itemsPerPage,
      };
      await center_managerment
        .NewsOverview(querystring.stringify(body))
        .then((res) => {
          if (res) {
            res.news.forEach((x) => {
              if (x.newsID == this.newID) {
                this.newEdit = x;
              }
            });
            this.titleNew = this.newEdit.title;
            this.editor = this.newEdit.contentText;
            this.image = this.newEdit.contentImage
              ? "data:image/jpeg;base64," + this.newEdit.contentImage
              : "";
            this.status = this.newEdit.status;
          }
        });
      this.isLoading = false;
    },
    editNew() {
      if (this.status == "PUBLIC") {
        this.$router.push({
          name: "center-management-edit-news-public",
          params: {
            newsID: this.newID,
            pageIndex: this.page,
            pageSize: this.itemsPerPage,
          },
        });
      } else {
        this.$router.push({
          name: "center-management-edit-news-draft",
          params: {
            newsID: this.newID,
            pageIndex: this.page,
            pageSize: this.itemsPerPage,
          },
        });
      }
    },
    back() {
      window.history.back();
    },
    _dayjs: dayjs,
  },
};
</script>
<style lang="scss" scoped>
#center-management {
  img {
    max-width: 60%;
    max-height: 60%;
  }
  .item {
    border-bottom: 1px dashed #dadbe6;
  }
  footer {
    box-shadow: 0px -2px 9px rgba(184, 184, 184, 0.1);
  }
}
</style>
