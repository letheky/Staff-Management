<template>
  <div id="my-profile">
    <!-- Breadcrumb -->
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-6 pt-5 d-flex justify-space-between">
          <h2 class="d-flex">
            <v-icon @click="back()">arrow_back_ios</v-icon>
            <div class="d-flex align-center">Account profile</div>
          </h2>
          <div>
            <v-btn color="secondary" outlined @click="changePassword()" class="mr-5"
              >Change password</v-btn
            >
            <v-btn
              color="secondary"
              v-if="userDetailInfo && currentUser.userInfo.accountTypeID !== 1"
              outlined
              @click="edit()"
              >Edit profile</v-btn
            >
          </div>
        </div>
      </v-col>
    </v-row>
    <!-- Thông tin -->
    <template v-if="isLoading">
      <div class="pa-6">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </div>
    </template>
    <template v-else>
      <v-row no-gutters>
        <v-col md="12">
          <div class="pa-6">
            <v-row no-gutters class="user-info">
              <v-col md="2">
                <div class="pt-6">
                  <v-avatar class="d-flex" style="margin: auto" size="125">
                    <img
                      v-if="!userDetailInfo.details.photo"
                      src="@/assets/images/ImageProfile.jpg"
                    />
                    <img v-else :src="'data:image/jpeg;base64,' + userDetailInfo.details.photo" />
                  </v-avatar>
                  <label>
                    <input
                      type="file"
                      @change="
                        fileInput = $event
                        onFileChange($event)
                      "
                      accept="image/*"
                      id="file-input"
                      style="display: none"
                    />
                    <a class="d-flex justify-center text-decoration-underline"> Browse file </a>
                  </label>
                </div>
              </v-col>
              <v-col md="10">
                <v-row no-gutters>
                  <v-col md="4">
                    <div class="pa-6 list-info">
                      <div class="item">
                        <div>User name</div>
                        <div v-if="userDetailInfo.details.userName !== null">
                          {{ userDetailInfo.details.userName }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Full name</div>
                        <div v-if="userDetailInfo.details.fullName !== null">
                          {{ userDetailInfo.details.fullName }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Gender</div>
                        <div v-if="userDetailInfo.details.gender">
                          {{ userDetailInfo.details.gender == 'M' ? 'Male' : 'Female' }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Date of birth</div>
                        <div v-if="userDetailInfo.details.dob">
                          {{ _dayjs(userDetailInfo.details.dob).format('DD/MM/YYYY') }}
                        </div>
                      </div>
                      <div class="border-vertical"></div>
                    </div>
                  </v-col>

                  <v-col md="4">
                    <div class="pa-6 list-info">
                      <div class="item">
                        <div>Home phone</div>
                        <div v-if="userDetailInfo.details.homePhone">
                          {{ userDetailInfo.details.homePhone }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Mobile</div>
                        <div v-if="userDetailInfo.details.mobilePhone">
                          {{ userDetailInfo.details.mobilePhone }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Email</div>
                        <div v-if="userDetailInfo.details.email">
                          {{ userDetailInfo.details.email }}
                        </div>
                      </div>
                      <div class="border-vertical"></div>
                    </div>
                  </v-col>
                  <v-col md="4">
                    <div class="pa-6 list-info">
                      <div class="item">
                        <div>Country</div>
                        <div v-if="userDetailInfo.details.nationality">
                          {{ userDetailInfo.details.nationality }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Living address</div>
                        <div v-if="userDetailInfo.details.address">
                          {{ userDetailInfo.details.address }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Living city</div>
                        <div v-if="userDetailInfo.details.city">
                          {{ userDetailInfo.details.city }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Living district</div>
                        <div v-if="userDetailInfo.details.district">
                          {{ userDetailInfo.details.district }}
                        </div>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { my_profile } from '@/api/my-profile.js'
import { account_managerment } from '@/api/account-management.js'

export default {
  components: {},
  data() {
    return {
      isLoading: false,
      currentUser: JSON.parse(localStorage.getItem('currentUser')),
      userDetailInfo: null,
      fileInput: '',
      checkImage: false,
      MAX_SIZE_IMAGE: 500,
      currentCenter: JSON.parse(localStorage.getItem('currentCenter')),
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      this.isLoading = true
      await my_profile
        .getDetailUserInfo(this.currentUser.userInfo.userID) //this.currentUser.userInfo.userID
        .then(res => {
          if (res) {
            this.userDetailInfo = res
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    edit() {
      this.$router.push({
        name: 'my-profile-edit',
        params: { userId: this.currentUser.userInfo.userID }, //this.currentUser.userInfo.userID
      })
    },
    changePassword() {
      this.$router.push({
        name: 'my-profile-change-password',
      })
    },
    onFileChange(e) {
      var size_image = e.target.files[0].size / 1024
      if (size_image > this.MAX_SIZE_IMAGE) {
        this.checkImage = true
      } else {
        this.checkImage = false
      }
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.createImage(files[0])
      var imagefile = document.querySelector('#file-input')
      if (imagefile) {
        var formData = new FormData()
        formData.append('files', imagefile.files[0] ? imagefile.files[0] : null)
      }
      account_managerment.updateAvatar(formData).then(res => {
        if (res) {
          console.log(res)
        }
      })
      setTimeout(() => {
        this.init()
      }, 600)
    },
    createImage(file) {
      var reader = new FileReader()
      var vm = this

      reader.onload = e => {
        vm.userDetailInfo.details.photo = e.target.result
      }
      reader.readAsDataURL(file)
    },
    back() {
      window.history.back()
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped>
#my-profile {
  .user-info {
    background: linear-gradient(180deg, #ffffff 0%, #f9f8ff 100%);
    // input[type="file"] {
    //   color: rgb(133, 130, 130);
    //   opacity: 1;
    // }
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
  }
  .add-action {
    display: flex;
    justify-content: center;
    align-items: center;
    color: blue;
    background: none;
  }
  .type-info {
    border-radius: 1rem;
    background-color: lightblue;
    width: 80px;
  }
}
</style>
