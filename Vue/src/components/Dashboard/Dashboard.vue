<template>
  <div class="container-fluid">
    <v-row>
      <v-col lg="9" md="9" sm="9" xs="9" class="pr-0">
        <v-progress-linear
          v-if="isLoading"
          indeterminate
          color="primary"
          class="my-10"
        ></v-progress-linear>
        <div v-if="!isLoading" class="pa-10 pt-5 pb-0">
          <v-row v-for="(news, index) in listNews" :key="index">
            <v-col v-if="news.stt == 1" lg="8" md="8" sm="8" xs="8">
              <router-link :to="{ name: 'view-detail-news', params: { newsID: newestID } }">
                <img
                  :src="'data:image/jpeg;base64,' + newestContentImage"
                  height="300"
                  width="100%"
                  style="object-fit: cover"
                />
              </router-link>
              <p class="pt-2">
                {{ _dayjs(newestCreatedDate).format('DD/MM/YYYY') }} by
                {{ newestCreatedBy }}
              </p>
              <router-link :to="{ name: 'view-detail-news', params: { newsID: newestID } }">
                <h2 v-if="newestTitle.length < 200">
                  {{ newestTitle }}
                </h2>
                <h2 v-else>
                  {{ newestTitle.substr(0, 200) + '...' }}
                </h2>
              </router-link>
              <div v-if="newestContentText.length < 200" v-html="newestContentText"></div>
              <div v-else v-html="newestContentText.substr(0, 200) + '...'"></div>
            </v-col>
            <v-col
              v-if="
                news.stt == 1 &&
                (listNews.filter(x => x.stt == 2).length == 1 ||
                  listNews.filter(x => x.stt == 3).length == 1)
              "
              class="pr-1 pl-2"
              lg="4"
              md="4"
              sm="4"
              xs="4"
            >
              <div v-if="listNews.length > 1">
                <router-link
                  :to="{
                    name: 'view-detail-news',
                    params: { newsID: secondID },
                  }"
                >
                  <img
                    :src="'data:image/jpeg;base64,' + secondContentImage"
                    height="150"
                    width="100%"
                    style="object-fit: cover"
                  />
                </router-link>
                <p class="pt-2">
                  {{ _dayjs(secondCreatedDate).format('DD/MM/YYYY') }} by
                  {{ secondCreatedBy }}
                </p>
                <router-link
                  :to="{
                    name: 'view-detail-news',
                    params: { newsID: secondID },
                  }"
                >
                  <h2 v-if="secondTitle.length < 200">
                    {{ secondTitle }}
                  </h2>
                  <h2 v-else>{{ secondTitle.substr(0, 200) + '...' }}</h2>
                </router-link>
              </div>
              <div v-if="listNews.length > 2" class="pt-6">
                <router-link
                  :to="{
                    name: 'view-detail-news',
                    params: { newsID: thirdID },
                  }"
                >
                  <img
                    :src="'data:image/jpeg;base64,' + thirdContentImage"
                    height="150"
                    width="100%"
                    style="object-fit: cover"
                  />
                </router-link>
                <p class="pt-2">
                  {{ _dayjs(thirdCreatedDate).format('DD/MM/YYYY') }} by
                  {{ thirdCreatedBy }}
                </p>
                <router-link
                  :to="{
                    name: 'view-detail-news',
                    params: { newsID: thirdID },
                  }"
                >
                  <h2 v-if="thirdTitle.length < 200">
                    {{ thirdTitle }}
                  </h2>
                  <h2 v-else>{{ thirdTitle }}</h2>
                </router-link>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              v-for="(news, index) in listNews"
              :key="index"
              class="pr-1 pl-2"
              lg="4"
              md="4"
              sm="4"
              xs="4"
            >
              <div v-if="news.stt > 3" class="pt-6">
                <router-link
                  :to="{
                    name: 'view-detail-news',
                    params: { newsID: news.newsID },
                  }"
                >
                  <img
                    :src="'data:image/jpeg;base64,' + news.contentImage"
                    height="150"
                    width="100%"
                    style="object-fit: cover"
                  />
                </router-link>
                <p class="pt-2">
                  {{ _dayjs(news.crtdDate).format('DD/MM/YYYY') }} by
                  {{ news.crtdUser }}
                </p>
                <router-link
                  :to="{
                    name: 'view-detail-news',
                    params: { newsID: news.newsID },
                  }"
                >
                  <h2 v-if="news.title.length < 200">
                    {{ news.title }}
                  </h2>
                  <h2 v-else>
                    {{ news.title.substr(0, 200) + '...' }}
                  </h2>
                </router-link>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex">
        <v-pagination
          v-model="page"
          :length="numberOfPages"
          @input="changePage"
          elevation="0"
        ></v-pagination>
      </v-col>
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
      page: 1,
      numberOfPages: 0,
      pageSize: 0,
      listNews: [],
      newestContentImage: '',
      newestCreatedDate: '',
      newestCreatedBy: '',
      newestContentText: '',
      newestTitle: '',
      newestID: '',
      secondContentImage: '',
      secondCreatedDate: '',
      secondCreatedBy: '',
      secondTitle: '',
      secondID: '',
      thirdContentImage: '',
      thirdCreatedDate: '',
      thirdCreatedBy: '',
      thirdTitle: '',
      thirdID: '',
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
        pageIndex: this.page,
        pageSize: this.pageSize,
      }
      await news.getAllNews(querystring.stringify(body)).then(res => {
        if (res) {
          res.news.forEach(x => {
            if (x.stt == 1) {
              this.newestContentImage = x.contentImage
              this.newestCreatedDate = x.crtdDate
              this.newestCreatedBy = x.crtdUser
              this.newestContentText = x.contentText
              this.newestTitle = x.title
              this.newestID = x.newsID
            } else if (x.stt == 2) {
              this.secondContentImage = x.contentImage
              this.secondCreatedDate = x.crtdDate
              this.secondCreatedBy = x.crtdUser
              this.secondTitle = x.title
              this.secondID = x.newsID
            } else if (x.stt == 3) {
              this.thirdContentImage = x.contentImage
              this.thirdCreatedDate = x.crtdDate
              this.thirdCreatedBy = x.crtdUser
              this.thirdTitle = x.title
              this.thirdID = x.newsID
            }
          })
          this.listNews = res.news
          if (res.totalCount % 9 == 0) {
            this.numberOfPages = res.totalCount / 9
          } else {
            this.numberOfPages = Math.floor(res.totalCount / 9 + 1)
          }
        }
      })
      this.isLoading = false
    },
    viewDetail(newsID) {
      this.$router.push({
        name: 'view-detail-news',
        params: { newsID: newsID },
      })
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
}
</style>
