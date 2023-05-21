<template>
  <v-app-bar app flat color="#fff" height="80" class="px-4" ref="appCEC">
    <v-app-bar-nav-icon @click="changeStatusSidebar()"></v-app-bar-nav-icon>
    <v-spacer></v-spacer>
    <div class="user-info d-flex">
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
          <v-list-item @click="goVersionList()">
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
      userFullName: '',
      userPhoto: '',
      currentUser: JSON.parse(localStorage.getItem('currentUser')),
      locationPermissions: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
      functionRole: 0,
      accountTypeName: JSON.parse(localStorage.getItem('currentUser')).user.accountTypeName,
      language: localStorage.getItem('systemLanguage'),
      windowWidth: window.innerWidth,
    }
  },
  computed: {},
  created() {
    this.userFullName = JSON.parse(localStorage.getItem('currentUser')).user.username
    this.functionRole = JSON.parse(localStorage.getItem('currentUser'))?.user?.roleid
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
