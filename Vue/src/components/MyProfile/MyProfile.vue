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
              >Dổi mật khẩu</v-btn
            >
            <v-btn color="secondary" outlined @click="edit()">Sửa profile</v-btn>
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
                      v-if="userDetailInfo.image === null"
                      src="@/assets/images/ImageProfile.jpg"
                    />
                    <img v-else :src="'data:image/jpeg;base64,' + userDetailInfo.image" />
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
              <v-col md="10" v-if="currentUser.user.accountTypeName === 'admin'">
                <v-row no-gutters>
                  <v-col md="6">
                    <div class="pa-6 list-info">
                      <div class="item">
                        <div>Họ và tên</div>
                        <div v-if="userDetailInfo[0] && userDetailInfo[0].adminName">
                          {{ userDetailInfo[0].adminName }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Kiểu tài khoản</div>
                        <div>
                          {{ currentUser.user.accountTypeName }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Giới tính</div>
                        <div v-if="userDetailInfo[0] && userDetailInfo[0].gender">
                          {{ userDetailInfo[0].gender ? 'Nam' : 'Nữ' }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Ngày sinh</div>
                        <div v-if="userDetailInfo[0] && userDetailInfo[0].dob">
                          {{ _dayjs(userDetailInfo[0].dob).format('DD/MM/YYYY') }}
                        </div>
                      </div>
                      <div class="border-vertical"></div>
                    </div>
                  </v-col>

                  <v-col md="6">
                    <div class="pa-6 list-info">
                      <div class="item">
                        <div>Địa chỉ</div>
                        <div v-if="userDetailInfo[0] && userDetailInfo[0].address">
                          {{ userDetailInfo[0].address }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Số điện thoại</div>
                        <div v-if="userDetailInfo[0] && userDetailInfo[0].phoneNum">
                          {{ userDetailInfo[0].phoneNum }}
                        </div>
                      </div>
                      <div class="border-vertical"></div>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col md="10" v-else-if="currentUser.user.accountTypeName === 'teacher'">
                <v-row no-gutters>
                  <v-col md="4">
                    <div class="pa-6 list-info">
                      <div class="item">
                        <div>Họ và tên</div>
                        <div v-if="userDetailInfo[0] && userDetailInfo[0].instructorName">
                          {{ userDetailInfo[0].instructorName }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Kiểu tài khoản</div>
                        <div v-if="userDetailInfo[0]">
                          {{ currentUser.user.accountTypeName }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Giới tính</div>
                        <div v-if="userDetailInfo[0]">
                          {{ userDetailInfo[0].gender ? 'Nam' : 'Nữ' }}
                        </div>
                      </div>

                      <div class="border-vertical"></div>
                    </div>
                  </v-col>
                  <v-col md="4">
                    <div class="pa-6 list-info">
                      <div class="item">
                        <div>Ngày sinh</div>
                        <div v-if="userDetailInfo[0] && userDetailInfo[0].dob">
                          {{ _dayjs(userDetailInfo[0].dob).format('DD/MM/YYYY') }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Địa chỉ</div>
                        <div v-if="userDetailInfo[0] && userDetailInfo[0].address">
                          {{ userDetailInfo[0].address }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Số điện thoại</div>
                        <div v-if="userDetailInfo[0] && userDetailInfo[0].phoneNum">
                          {{ userDetailInfo[0].phoneNum }}
                        </div>
                      </div>
                      <div class="border-vertical"></div>
                    </div>
                  </v-col>
                  <v-col md="4">
                    <div class="pa-6 list-info">
                      <div class="item" v-if="userDetailInfo[0] && userDetailInfo[0].major">
                        <div>Khoa</div>
                        <div>
                          {{ userDetailInfo[0].major }}
                        </div>
                      </div>
                      <div class="item" v-if="userDetailInfo[0] && userDetailInfo[0].academicDegree">
                        <div>Học vị</div>
                        <div>
                          {{ userDetailInfo[0].academicDegree }}
                        </div>
                      </div>
                      <div class="item" v-if="userDetailInfo[0] && userDetailInfo[0].moralEducation">
                        <div>Học hàm</div>
                        <div>
                          {{ userDetailInfo[0].moralEducation }}
                        </div>
                      </div>
                      <div class="border-vertical"></div>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col md="10" v-else>
                <v-row no-gutters>
                  <v-col md="4">
                    <div class="pa-6 list-info">
                      <div class="item">
                        <div>Họ và tên</div>
                        <div v-if="userDetailInfo[0] && userDetailInfo[0].studentName">
                          {{ userDetailInfo[0].studentName }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Kiểu tài khoản</div>
                        <div>
                          {{ currentUser.user.accountTypeName }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Giới tính</div>
                        <div v-if="userDetailInfo[0] && userDetailInfo[0].gender">
                          {{ userDetailInfo[0].gender ? 'Nam' : 'Nữ' }}
                        </div>
                      </div>

                      <div class="border-vertical"></div>
                    </div>
                  </v-col>
                  <v-col md="4">
                    <div class="pa-6 list-info">
                      <div class="item">
                        <div>Ngày sinh</div>
                        <div v-if="userDetailInfo[0] && userDetailInfo[0].dob">
                          {{ _dayjs(userDetailInfo[0].dob).format('DD/MM/YYYY') }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Địa chỉ</div>
                        <div v-if="userDetailInfo[0] && userDetailInfo[0].address">
                          {{ userDetailInfo[0].address }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Số điện thoại</div>
                        <div v-if="userDetailInfo[0] && userDetailInfo[0].phoneNum">
                          {{ userDetailInfo[0].phoneNum }}
                        </div>
                      </div>
                      <div class="border-vertical"></div>
                    </div>
                  </v-col>
                  <v-col md="4">
                    <div class="pa-6 list-info">
                      <div class="item" v-if="userDetailInfo[0] && userDetailInfo[0].major">
                        <div>Khoa</div>
                        <div>
                          {{ userDetailInfo[0].major }}
                        </div>
                      </div>
                      <div class="item" v-if="userDetailInfo[0] && userDetailInfo[0].academicDegree">
                        <div>Học vị</div>
                        <div>
                          {{ userDetailInfo[0].academicDegree }}
                        </div>
                      </div>
                      <div class="item" v-if="userDetailInfo[0] && userDetailInfo[0].classCode">
                        <div>Lớp</div>
                        <div>
                          {{ userDetailInfo[0].classCode }}
                        </div>
                      </div>
                      <div class="border-vertical"></div>
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
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      this.isLoading = true
      if (this.currentUser.user.roleid === 1) {
        await my_profile
          .getDetailAdminInfo(this.currentUser.user.userID) //this.currentUser.userID
          .then(res => {
            if (res) {
              this.userDetailInfo = res
            }
          })
          .finally(() => {
            this.isLoading = false
          })
      }
      else if (this.currentUser.user.roleid === 2) {
        await my_profile
          .getDetailInstructorInfo(this.currentUser.user.userID) //this.currentUser.userID
          .then(res => {
            if (res) {
              this.userDetailInfo = res
            }
          })
          .finally(() => {
            this.isLoading = false
          })
      } else {
        await my_profile
          .getDetailStudentInfo(this.currentUser.user.userID) //this.currentUser.userID
          .then(res => {
            if (res) {
              this.userDetailInfo = res
            }
          })
          .finally(() => {
            this.isLoading = false
          })
      }
    },
    edit() {
      this.$router.push({
        name: 'my-profile-edit',
        params: { userId: this.currentUser.user.userID }, //this.currentUser.userID
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
      // account_managerment.updateAvatar(formData).then(res => {
      //   if (res) {
      //     console.log(res)
      //   }
      // })
      setTimeout(() => {
        this.init()
      }, 600)
    },
    createImage(file) {
      var reader = new FileReader()
      var vm = this

      reader.onload = e => {
        vm.userDetailInfo.image = e.target.result
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
