<template>
  <v-app-bar app flat color="#fff" height="80" class="px-4" ref="appCEC">
    <v-app-bar-nav-icon @click="changeStatusSidebar()"></v-app-bar-nav-icon>
    <div v-if="$route.path == '/chat'">
      <router-link :to="{ name: 'home' }">
        <img src="@/assets/images/logoCEC.jpg" class="pa-4 pb-0" />
      </router-link>
    </div>
    <v-spacer></v-spacer>
    <div class="user-info d-flex">
      <v-icon class="pr-3">notifications</v-icon>
      <v-icon
        v-if="
          (functionRole.filter(
            x =>
              (x.functionID == chatPermission && x.cModify == true) ||
              (x.functionID == chatPermission && x.cFull == true) ||
              (x.functionID == chatManagementPermission && x.cModify == true) ||
              (x.functionID == chatManagementPermission && x.cFull == true)
          ).length == 2 ||
            functionRole.filter(
              x =>
                (x.functionID == chatPermission && x.cModify == true) ||
                (x.functionID == chatPermission && x.cFull == true)
            ).length == 1 ||
            functionRole.filter(
              x =>
                (x.functionID == chatManagementPermission && x.cModify == true) ||
                (x.functionID == chatManagementPermission && x.cFull == true)
            ).length == 1) &&
          (accountTypeName == 'Admin' || accountTypeName == 'Staff')
        "
        class="pl-4"
        style="max-width: 32px"
        @click="chat()"
        >messages</v-icon
      >
      <div class="fs-18 font-weight-bold pl-2 pr-3">Hi, {{ userFullName }}</div>
      <!-- <div class="fs-18 font-weight-bold pr-3"></div> -->
      <v-avatar class="pl-2 pr-2" size="24">
        <!-- <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" /> -->
        <router-link :to="{ name: 'my-profile' }">
          <img v-if="userPhoto" :src="'data:image/jpeg;base64,' + userPhoto" />
          <i v-else class="isax isax-profile-circle fs-24"></i>
        </router-link>
      </v-avatar>
      <v-menu offset-y min-width="177" :close-on-content-click="false">
        <template v-slot:activator="{ on, attrs }">
          <v-icon color="#000" v-bind="attrs" v-on="on">arrow_drop_down</v-icon>
        </template>
        <v-list>
          <v-list-item @click="goMyProfile()">
            <v-list-item-icon>
              <i class="isax isax-profile-circle fs-24"></i>
            </v-list-item-icon>
            <v-list-item-title>My profile</v-list-item-title>
          </v-list-item>
          <!-- <v-list-group :value="false" prepend-icon="isax-language-circle">
            <template v-slot:activator>
              <v-list-item-content class="pa-0">
                <v-list-item-title>Language</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item @click="changeLanguage('en')">
              <v-list-item-title :style="language === 'vi' ? 'padding-left: 21px !important' : ''"><v-icon v-if="language === 'en'" style="color: green !important;font-size: 17px !important;padding-bottom: 4px;">mdi-check</v-icon> English </v-list-item-title>
            </v-list-item>
            <v-list-item @click="changeLanguage('vi')">
              <v-list-item-title :style="language === 'en' ? 'padding-left: 21px !important' : ''"><v-icon v-if="language === 'vi'" style="color: green !important;font-size: 17px !important;padding-bottom: 4px;">mdi-check</v-icon> Vietnamese</v-list-item-title>
            </v-list-item>
          </v-list-group> -->
          <v-list-group
            v-if="
              centerList.length > 0 &&
              currentUser.locationPermissions &&
              currentUser.locationPermissions.length > 0 &&
              currentUser.locationPermissions[0].accountTypeName !== 'Teacher'
            "
            :value="false"
            prepend-icon="domain"
          >
            <template v-slot:activator>
              <v-list-item-content class="pa-0">
                <v-list-item-title>Choose center</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-select
              class="pl-4 pr-1"
              :items="centerList"
              item-text="location"
              item-value="locationID"
              append-icon="keyboard_arrow_down"
              prepend-icon="domain"
              dense
              outlined
              hide-details
              style="max-width: 220px"
              v-model="currentCenter"
              @change="changeCenter()"
            ></v-select>
          </v-list-group>
          <v-list-item
            v-if="
              centerList.length > 0 &&
              currentUser.locationPermissions &&
              currentUser.locationPermissions.length > 0 &&
              currentUser.locationPermissions[0].accountTypeName !== 'Teacher'
            "
            @click="goVersionList()"
          >
            <v-list-item-icon>
              <i class="isax isax-note-1 fs-24"></i>
            </v-list-item-icon>
            <v-list-item-title> Release Note </v-list-item-title>
          </v-list-item>
          <v-divider class="my-1" />
          <v-list-item @click="logout()">
            <v-list-item-icon>
              <i class="isax isax-export fs-24"></i>
            </v-list-item-icon>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script>
import { loginadmin } from '@/api/login.js'

export default {
  components: {},
  data() {
    return {
      isAdMin: localStorage.getItem('currentUser')
        ? JSON.parse(localStorage.getItem('currentUser')).locationPermissions[0].groupName.indexOf(
            'Admin'
          )
        : -1,
      userFullName: JSON.parse(localStorage.getItem('currentUser')).userInfo.fullName,
      userPhoto: JSON.parse(localStorage.getItem('currentUser')).userInfo.photo,
      currentCenter: JSON.parse(localStorage.getItem('currentCenter')),
      currentUser: JSON.parse(localStorage.getItem('currentUser')),
      locationPermissions: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
      accountype: '',
      functionRole: [],
      accountTypeName: '',
      chatPermission: process.env.VUE_APP_ENV_FUNCTION_CHAT,
      chatManagementPermission: process.env.VUE_APP_ENV_FUNCTION_CHAT_MANAGEMENT,
      language: localStorage.getItem('systemLanguage'),
      windowWidth: window.innerWidth,
    }
  },
  computed: {
    centerList() {
      return JSON.parse(localStorage.getItem('currentUser')).locationPermissions
    },
  },
  created() {
    this.userFullName = JSON.parse(localStorage.getItem('currentUser')).userInfo.fullName
    this.functionRole =
      JSON.parse(localStorage.getItem('functionRole')) == null
        ? []
        : JSON.parse(localStorage.getItem('functionRole'))
    this.locationPermissions.forEach(x => {
      if (x.locationID == this.currentCenter) {
        this.accountTypeName = x.accountTypeName
      }
    })
    if (window.innerWidth < 1025) {
      this.$store.state.isActiveSidebar = true
    } else {
      this.$store.state.isActiveSidebar = false
    }
  },
  watch: {
    windowWidth(value) {
      if (value < 1025) {
        this.$store.state.isActiveSidebar = true
      } else {
        this.$store.state.isActiveSidebar = false
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
    })
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth
    },
    changeStatusSidebar() {
      this.$store.state.isActiveSidebar = !this.$store.state.isActiveSidebar
    },
    goMyProfile() {
      this.$router.push({
        name: 'my-profile',
      })
    },
    goVersionList() {
      this.$router.push({
        name: 'version-view',
      })
    },
    changeLanguage(lang) {
      localStorage.setItem('systemLanguage', lang)
      location.reload()
    },
    logout() {
      // if (this.currentUser.userInfo.accountTypeID == 4) {
      //   localStorage.removeItem('currentCenter')
      //   localStorage.removeItem('accountTypeID')
      // }
      localStorage.clear()
      loginadmin.logout()
      this.$router.push({ name: 'login' })
    },
    changeCenter() {
      localStorage.setItem('currentCenter', JSON.stringify(this.currentCenter))
      location.reload()
    },
    chat() {
      let routeData = this.$router.resolve({ name: 'chat' })
      window.open(routeData.href, '_blank')
    },
  },
}
</script>
<style lang="scss">
header {
  &.v-sheet {
    border-bottom: 2px solid #ececf6;
    border-color: #ececf6 !important;
  }
}
</style>
