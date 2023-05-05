<template>
  <div class="container-fluid">
    <v-row>
      <v-col md="9">
        <div class="pa-10 pt-5 pb-0">
          <div class="d-flex">
            <h2 class="mb-2">
              <v-icon @click="back()">arrow_back_ios</v-icon>
            </h2>
            <h2 style="color: black" class="text-uppercase pt-1">
              {{ title }}
            </h2>
          </div>
          <div class="mb-2 ml-6">
            <h3>
              {{ _dayjs(createdDate).format('YYYY/MM/DD, HH:mm') }} by
              {{ createdUser }}
            </h3>
          </div>
          <v-progress-linear
            v-if="isLoading"
            indeterminate
            color="primary"
            class="my-10"
          ></v-progress-linear>
          <v-divider color="black"></v-divider>
          <div class="pt-5" v-if="!isLoading">
            <img :src="'data:image/jpeg;base64,' + contentImage" class="image-action" />
            <div class="content-action pt-3" v-html="contentText"></div>
          </div>
        </div>
      </v-col>
      <v-divider vertical></v-divider>
      <!-- <v-col md="4">
        <div class="pa-5">
          <h2>Explore available courses</h2>
        </div>
        <div class="pl-5 pt-5">
          <v-row>
            <v-col md="4">
              <img src="@/assets/images/Photo6.png" height="100" />
            </v-col>
            <v-col>
              <p class="mb-2">Tiếng Anh chuyên sâu (07-15 tuổi)</p>
            </v-col>
          </v-row>
        </div>
        <div class="pl-5 pt-5">
          <v-row>
            <v-col md="4">
              <img src="@/assets/images/Photo6.png" height="100" />
            </v-col>
            <v-col>
              <p class="mb-2">Tiếng Anh chuyên sâu (07-15 tuổi)</p>
            </v-col>
          </v-row>
        </div>
        <div class="pl-5 pt-5">
          <v-row>
            <v-col md="4">
              <img src="@/assets/images/Photo6.png" height="100" />
            </v-col>
            <v-col>
              <p class="mb-2">Tiếng Anh chuyên sâu (07-15 tuổi)</p>
            </v-col>
          </v-row>
        </div>
        <div class="pl-5 pt-5">
          <v-row>
            <v-col md="4">
              <img src="@/assets/images/Photo6.png" height="100" />
            </v-col>
            <v-col>
              <p class="mb-2">Tiếng Anh chuyên sâu (07-15 tuổi)</p>
            </v-col>
          </v-row>
        </div>
        <div class="pl-5 pt-5">
          <v-row>
            <v-col md="4">
              <img src="@/assets/images/Photo6.png" height="100" />
            </v-col>
            <v-col>
              <p class="mb-2">Tiếng Anh chuyên sâu (07-15 tuổi)</p>
            </v-col>
          </v-row>
        </div>
      </v-col> -->
    </v-row>
  </div>
</template>

<script>
import { news } from '@/api/news.js'
const querystring = require('querystring')
import dayjs from 'dayjs'

export default {
  components: {},
  data() {
    return {
      isLoading: false,
      contentText: '',
      contentImage: '',
      createdDate: '',
      createdUser: '',
      title: '',
      newsID: this.$route.params.newsID,
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      this.isLoading = true
      if (this.page == 1) {
        this.pageSize = 9
      } else {
        this.pageSize = 9
      }
      const body = {
        newsID: this.newsID,
      }
      await news.getDetailNews(querystring.stringify(body)).then(res => {
        if (res) {
          this.contentImage = res.news.contentImage
          this.contentText = res.news.contentText
          this.createdDate = res.news.crtdDate
          this.createdUser = res.news.crtdUser
          this.title = res.news.title
        }
      })
      this.isLoading = false
    },
    back() {
      window.history.back()
    },
    changePage() {
      this.init()
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped>
.container-fluid {
  img {
    border-radius: 0.5rem;
  }
  h2 {
    color: #0c2e68;
  }
  .courses-action {
    border: 1px ridge;
    // border-radius: 0.25rem;
  }
  .image-action {
    max-width: 100%;
    height: 450px;
    object-fit: contain;
  }
  .content-action {
    word-wrap: break-word;
  }
}
</style>
