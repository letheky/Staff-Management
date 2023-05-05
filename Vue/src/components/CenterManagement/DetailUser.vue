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
            <v-btn color="secondary" outlined class="mr-5">Reset password</v-btn>
            <v-btn color="secondary" outlined @click="edit()">Edit profile</v-btn>
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
                <div class="d-flex align-center justify-center fill-height">
                  <v-avatar class="" size="125">
                    <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
                  </v-avatar>
                </div>
              </v-col>
              <v-col md="10">
                <v-row no-gutters>
                  <v-col md="4">
                    <div class="pa-6 list-info">
                      <div class="item">
                        <div>User name</div>
                        <div>API thiếu</div>
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
                          {{ userDetailInfo.details.gender }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Date of birth</div>
                        <div v-if="userDetailInfo.details.dob">
                          {{ userDetailInfo.details.dob }}
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
      <!-- Student -->

      <v-row no-gutters>
        <v-col md="12">
          <div class="pa-6 pt-0">
            <div class="d-flex justify-space-between align-end">
              <div>
                <v-tabs v-model="tab" left height="40">
                  <v-tab v-for="item in userDetailInfo.role" :key="item.locationID">
                    {{ item.location }}
                  </v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab">
                  <v-tab-item
                    v-for="item in userDetailInfo.role"
                    :key="item.locationID + 'content'"
                  >
                    <v-card flat>
                      <v-card-text class="px-0 pb-0">
                        Role
                        <v-chip small class="mr-5">{{ item.accountTypeName }}</v-chip>
                        Status
                        <v-chip small class="mr-5">{{ item.accountTypeName }}</v-chip>
                        Register status
                        <v-chip small>{{ item.accountTypeName }}</v-chip>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                </v-tabs-items>
              </div>
              <div>
                <v-btn color="#DC322D" outlined class="mr-5">Remove role</v-btn>
                <v-btn color="secondary" outlined @click="edit()">Edit role</v-btn>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
      <div class="pa-6 pt-0">
        <v-divider></v-divider>
      </div>
      <v-row no-gutters class="mb-6">
        <v-col md="6">
          <div class="pa-6 list-info">
            <h3 class="mb-2">Student information</h3>
            <div class="item">
              <div>Pri./ Sec. School</div>
              <div v-if="userDetailInfo.studentInfo.homePhone">
                {{ userDetailInfo.studentInfo.homePhone }}
              </div>
            </div>
            <div class="item">
              <div>English School</div>
              <div v-if="userDetailInfo.studentInfo.englishSchool">
                {{ userDetailInfo.studentInfo.englishSchool }}
              </div>
            </div>
            <div class="item">
              <div>Counselor</div>
              <div v-if="userDetailInfo.studentInfo.counselor">
                {{ userDetailInfo.studentInfo.counselor }}
              </div>
            </div>
            <div class="item">
              <div>Record type</div>
              <div>API</div>
            </div>
            <div class="item">
              <div>Referral by</div>
              <div v-if="userDetailInfo.studentInfo.referralID">
                {{ userDetailInfo.studentInfo.referralID }}
              </div>
            </div>
            <div class="item">
              <div>Source reference</div>
              <div v-if="userDetailInfo.studentInfo.source">
                {{ userDetailInfo.studentInfo.source }}
              </div>
            </div>
            <div class="item">
              <div>Source reference note</div>
              <div>API</div>
            </div>
            <div class="item">
              <div>Date of Joining</div>
              <div v-if="userDetailInfo.studentInfo.entryDate">
                {{ userDetailInfo.studentInfo.entryDate }}
              </div>
            </div>
            <div class="item">
              <div>Remark</div>
              <div v-if="userDetailInfo.studentInfo.remarks">
                {{ userDetailInfo.studentInfo.remarks }}
              </div>
            </div>
            <div class="item">
              <div>Study Purpose</div>
              <div>API</div>
            </div>
            <div class="item">
              <div>IELTS Band Score</div>
              <div>API</div>
            </div>
          </div>
        </v-col>
        <v-divider inset vertical></v-divider>
        <v-col md="6">
          <div class="pa-6 list-info">
            <h3 class="mb-2">Guardian information</h3>
            <div class="item">
              <div>Guardian account</div>
              <div>API</div>
            </div>
            <div class="item">
              <div>Guardian name</div>
              <div v-if="userDetailInfo.studentInfo.guardians.guardianName">
                {{ userDetailInfo.studentInfo.guardians.guardianName }}
              </div>
            </div>
            <div class="item">
              <div>Guardian phone</div>
              <div v-if="userDetailInfo.studentInfo.guardians.mobiPhone">
                {{ userDetailInfo.studentInfo.guardians.mobiPhone }}
              </div>
            </div>
            <div class="item">
              <div>Guardian email</div>
              <div v-if="userDetailInfo.studentInfo.guardians.email">
                {{ userDetailInfo.studentInfo.guardians.email }}
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script>
import { my_profile } from '@/api/my-profile.js'
export default {
  components: {},
  data() {
    return {
      isLoading: false,
      currentUser: JSON.parse(localStorage.getItem('currentUser')),
      userDetailInfo: null,
      userId: this.$route.params.userId,
      tab: null,
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      this.isLoading = true
      await my_profile
        .getDetailUserInfo(this.userId) //this.currentUser.userInfo.userID
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
        params: { userId: 655 }, //this.currentUser.userInfo.userID
      })
    },
    back() {
      window.history.back()
    },
  },
}
</script>
<style lang="scss" scoped>
#my-profile {
  .user-info {
    background: linear-gradient(180deg, #ffffff 0%, #f9f8ff 100%);
  }
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
</style>
