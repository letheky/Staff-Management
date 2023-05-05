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
          <div v-show="roleObject.cFull === true || roleObject.cModify === true">
            <v-btn color="secondary" outlined @click="resetPassword()" class="mr-5"
              >Reset password</v-btn
            >
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
                <div class="pt-6">
                  <v-avatar class="d-flex" style="margin: auto" size="125">
                    <img v-if="!image" src="@/assets/images/ImageProfile.jpg" />
                    <img v-else :src="image" />
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
                    </div>
                  </v-col>
                  <v-divider vertical></v-divider>
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
                    </div>
                  </v-col>
                  <v-divider vertical></v-divider>
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
      <div v-for="(typeId, index) in userDetailInfo.role" :key="index">
        <!-- Student -->
        <div v-show="index === 0">
          <v-row no-gutters v-if="typeId.accountTypeName == 'Student'">
            <v-col md="12">
              <div class="d-flex align-center">
                <div style="max-width: 85%" class="pl-4">
                  <v-tabs show-arrows>
                    <v-tab v-for="(item, index) in userDetailInfo.role" :key="index">
                      {{ item.location }}
                    </v-tab>
                  </v-tabs>
                </div>
                <v-btn @click="$refs.confirmAdd.open()" class="add-action pa-5"
                  ><i class="isax isax-add"></i> Add new center</v-btn
                >
              </div>
              <div class="pl-5 d-flex align-center justify-space-between">
                <v-row>
                  <v-col md="3">
                    <div class="d-flex">
                      <p>Account type</p>
                      <p class="type-info text-center ml-5">Student</p>
                    </div>
                  </v-col>
                  <v-col>
                    <div class="d-flex">
                      <p>Done PT</p>
                      <p class="type-info text-center ml-5">Not yet</p>
                    </div>
                  </v-col>
                </v-row>
                <div class="pa-6 pt-5">
                  <!-- <v-btn
                  class="mr-5"
                  color="error"
                  @click="$refs.confirmDelete.open(id)"
                  outlined
                  >Remove role</v-btn
                > -->
                  <v-btn color="secondary" outlined @click="edit()">Edit Role</v-btn>
                </div>
              </div>
              <div class="user-info pl-5 d-flex align-center justify-space-between">
                <v-row>
                  <v-col md="6">
                    <h2>Student Information</h2>
                    <div class="list-info">
                      <div class="item">
                        <div>Pri./Sec. School</div>
                        <div v-if="userDetailInfo.studentInfo.school">
                          {{ userDetailInfo.studentInfo.school }}
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
                        <div v-if="userDetailInfo.studentInfo.customerGroup">
                          {{ userDetailInfo.studentInfo.customerGroup }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Referral by</div>
                        <div v-if="userDetailInfo.studentInfo.referral">
                          {{ userDetailInfo.studentInfo.referral }}
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
                        <div v-if="userDetailInfo.studentInfo.sourceReferenceNote">
                          {{ userDetailInfo.studentInfo.sourceReferenceNote }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Date of Joining</div>
                        <div v-if="userDetailInfo.studentInfo.entryDate">
                          {{ _dayjs(userDetailInfo.studentInfo.entryDate).format('DD/MM/YYYY') }}
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
                        <div v-if="userDetailInfo.studentInfo.studyPurpose">
                          {{ userDetailInfo.studentInfo.studyPurpose }}
                        </div>
                      </div>
                      <div class="item">
                        <div>IELTS Band Score</div>
                        <div v-if="userDetailInfo.studentInfo.ieltsBandScore">
                          {{ userDetailInfo.studentInfo.ieltsBandScore }}
                        </div>
                      </div>
                    </div>
                  </v-col>
                  <v-divider vertical></v-divider>
                  <v-col md="6">
                    <h2>Guardian Information</h2>
                    <div class="list-info">
                      <div class="item">
                        <div>Guardian account</div>
                        <!-- <div v-if="userDetailInfo.studentInfo.guardians.remarks">
                          {{ userDetailInfo.studentInfo.guardians.remarks }}
                      </div> -->
                      </div>
                      <div class="item">
                        <div>Guardian name</div>
                        <div v-if="userDetailInfo.studentInfo.guardians">
                          {{
                            userDetailInfo.studentInfo.guardians.guardianName
                              ? userDetailInfo.studentInfo.guardians.guardianName
                              : ''
                          }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Guardian phone</div>
                        <div v-if="userDetailInfo.studentInfo.guardians">
                          {{
                            userDetailInfo.studentInfo.guardians.mobiPhone
                              ? userDetailInfo.studentInfo.guardians.mobiPhone
                              : ''
                          }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Guardian email</div>
                        <div v-if="userDetailInfo.studentInfo.guardians">
                          {{
                            userDetailInfo.studentInfo.guardians.email
                              ? userDetailInfo.studentInfo.guardians.email
                              : ''
                          }}
                        </div>
                      </div>
                    </div>
                    <h2 style="padding-top: 13px">Relative Information</h2>
                    <div class="list-info">
                      <div class="item">
                        <div>Other student code - name</div>
                        <div>Relative type</div>
                      </div>
                      <div class="item">
                        <div>Other student code - name</div>
                        <div>Relative type</div>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
          <!-- Teacher -->
          <v-row
            no-gutters
            v-if="
              typeId.accountTypeName == 'Teacher' &&
              (roleObject.cFull === true || roleObject.cModify === true)
            "
          >
            <v-col md="12">
              <div class="d-flex align-center">
                <div style="max-width: 85%" class="pl-4">
                  <v-tabs show-arrows>
                    <v-tab v-for="(item, index) in userDetailInfo.role" :key="index">
                      {{ item.location }}
                    </v-tab>
                  </v-tabs>
                </div>
                <!-- <v-btn @click="$refs.confirmAdd.open()" class="add-action pa-5"
                  ><i class="isax isax-add"></i> Add new center</v-btn
                > -->
              </div>
              <div class="pl-5 d-flex align-center justify-space-between">
                <v-row>
                  <v-col md="3">
                    <div class="d-flex">
                      <p>Account type</p>
                      <p class="type-info text-center ml-5">Teacher</p>
                    </div>
                  </v-col>
                  <v-col>
                    <div class="d-flex">
                      <p>Status</p>
                      <p class="type-info text-center ml-5">Active</p>
                    </div>
                  </v-col>
                </v-row>
                <div class="pa-6 pt-5">
                  <!-- <v-btn class="mr-5" color="error" @click="$refs.confirmDelete.open(id)" outlined
                    >Remove role</v-btn
                  >
                  <v-btn color="secondary" @click="edit()" outlined>Edit Role</v-btn> -->
                </div>
              </div>
              <div class="user-info pl-5 d-flex align-center justify-space-between">
                <v-row>
                  <v-col md="6">
                    <h2>Teacher Information</h2>
                    <div class="list-info">
                      <div class="item">
                        <div>Teacher group</div>
                        <div v-if="userDetailInfo.teacherInfo.teacherGroupID">
                          {{ userDetailInfo.studentInfo.teacherGroupID }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Teacher type</div>
                        <div v-if="userDetailInfo.teacherInfo.teacherType">
                          {{ userDetailInfo.teacherInfo.teacherType }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Start date</div>
                        <div v-if="userDetailInfo.teacherInfo.startDate">
                          {{ _dayjs(userDetailInfo.teacherInfo.startDate).format('DD/MM/YYYY') }}
                        </div>
                      </div>
                      <div class="item">
                        <div>End date</div>
                        <div v-if="userDetailInfo.teacherInfo.endDate">
                          {{ _dayjs(userDetailInfo.teacherInfo.endDate).format('DD/MM/YYYY') }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Teaching rate</div>
                        <!-- <div v-if="userDetailInfo.teacherInfo.referralID">
                        {{ userDetailInfo.teacherInfo.referralID }}
                      </div> -->
                      </div>
                      <div class="item">
                        <div>Contract labour No.</div>
                        <!-- <div v-if="userDetailInfo.teacherInfo.source">
                        {{ userDetailInfo.teacherInfo.source }}
                      </div> -->
                      </div>
                      <div class="item">
                        <div>Salary type</div>
                        <div v-if="userDetailInfo.teacherInfo.teacherSalaryTypeID">
                          {{ userDetailInfo.teacherInfo.teacherSalaryTypeID }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Salary per hours</div>
                        <div v-if="userDetailInfo.teacherInfo.salaryPerHours">
                          {{ userDetailInfo.teacherInfo.salaryPerHours }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Salary per month</div>
                        <div v-if="userDetailInfo.teacherInfo.salaryPerMonth">
                          {{ userDetailInfo.teacherInfo.salaryPerMonth }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Currency</div>
                        <div v-if="userDetailInfo.teacherInfo.currencyID">
                          {{ userDetailInfo.teacherInfo.currencyID }}
                        </div>
                      </div>
                    </div>
                  </v-col>
                  <v-divider vertical></v-divider>
                  <v-col md="6">
                    <div class="list-info pt-8">
                      <div class="item">
                        <div>Passport No.</div>
                        <div v-if="userDetailInfo.teacherInfo.passportNo">
                          {{ userDetailInfo.teacherInfo.passportNo }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Passport Expires Date</div>
                        <div v-if="userDetailInfo.teacherInfo.visaExpriedDate">
                          {{
                            _dayjs(userDetailInfo.teacherInfo.visaExpriedDate).format('DD/MM/YYYY')
                          }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Visa No.</div>
                        <div v-if="userDetailInfo.teacherInfo.visaNo">
                          {{ userDetailInfo.teacherInfo.visaNo }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Visa Expire Date</div>
                        <!-- <div v-if="userDetailInfo.teacherInfo.visaExpriedDate">
                          {{ userDetailInfo.teacherInfo.visaExpriedDate }}
                      </div> -->
                      </div>
                    </div>
                    <div class="list-info">
                      <div class="item">
                        <div>Work Permit No.</div>
                        <!-- <div v-if="userDetailInfo.teacherInfo.currencyID">
                          {{ userDetailInfo.teacherInfo.currencyID }}
                      </div> -->
                      </div>
                      <div class="item">
                        <div>Work Permit Expires Date</div>
                        <!-- <div v-if="userDetailInfo.teacherInfo.visaExpriedDate">
                          {{ userDetailInfo.teacherInfo.visaExpriedDate }}
                      </div> -->
                      </div>
                      <div class="item">
                        <div>Remark</div>
                        <!-- <div v-if="userDetailInfo.teacherInfo.currencyID">
                          {{ userDetailInfo.teacherInfo.currencyID }}
                      </div> -->
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
          <v-row
            no-gutters
            v-if="typeId.accountTypeName == 'Staff' && typeId.locationID == currentCenter"
          >
            <v-col md="12">
              <div class="d-flex align-center">
                <div>
                  <v-tabs style="max-width: 900px">
                    <v-tab v-for="(item, index) in userDetailInfo.role" :key="index">
                      {{ item.location }}
                    </v-tab>
                  </v-tabs>
                </div>
                <!-- <v-btn @click="$refs.confirmAdd.open()" class="add-action pa-5"
                  ><i class="isax isax-add"></i> Add new center</v-btn
                > -->
              </div>
              <div class="pt-5 pb-5 pl-5 d-flex align-center justify-space-between">
                <div class="d-flex">
                  <p>Account type</p>
                  <p class="type-info text-center ml-5">Staff</p>
                  <p class="ml-5">Group</p>
                  <p class="type-info text-center ml-5">Admin</p>
                  <p class="ml-5">Status</p>
                  <p class="type-info text-center ml-5">Active</p>
                </div>
              </div>
              <div class="user-info pl-5 d-flex align-center justify-space-between">
                <v-row>
                  <v-col md="6">
                    <h2>Staff information</h2>
                    <div class="list-info">
                      <div class="item">
                        <div>Remark</div>
                        <div>Lorem ipsum</div>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
      <div>
        <v-tabs v-model="tab" class="tab-sadown mb-2" v-if="userDetailInfo.role.length === 0">
          <v-tab> <h3 class="text-normal">Study Pathway</h3></v-tab>
          <v-tab> <h3 class="text-normal">Achievement & Reward</h3> </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item>
            <div>
              <road-map v-if="userDetailInfo.role.length === 0" />
            </div>
          </v-tab-item>
          <v-tab-item>
            <div>
              <RewardByStudentOrProfile
                v-if="userDetailInfo.role.length === 0"
                :class="'ml-2 mr-2'"
                :rewardList="rewardList"
                @callData="getRewardByStudent"
                :viewType="currentUser.userInfo.accountTypeID !== 1 ? 'profile' : 'student'"
              />
            </div>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </template>
    <popup-confirm
      @confirm="confirmDelete"
      @cancel="cancelDelete"
      :maxWidth="700"
      ref="confirmDelete"
    >
      <v-card-title slot="icon"><i class="isax isax-card-remove"></i></v-card-title>
      <v-card-title slot="title">
        <h2 class="text-center">Remove role?</h2>
      </v-card-title>
      <v-card-title slot="content">
        <p class="text-center">
          You won't be able to get your data back after deletion? Are you sure you want to delete?
        </p>
      </v-card-title>
    </popup-confirm>
    <popup-confirm @confirm="confirmAdd" @cancel="cancelAdd" :width="1000" ref="confirmAdd">
      <v-card-title style="display: flex; flex-direction: column" slot="icon"
        ><i class="isax isax-card-add"></i>
      </v-card-title>
      <v-card-title style="display: flex; flex-direction: column" slot="title">
        <h2 class="text-center">Add new center</h2>
      </v-card-title>
      <v-card-title slot="content">
        <p>Select center</p>
        <v-autocomplete
          style="width: 100%"
          :items="centers"
          item-text="location"
          item-value="locationID"
          v-model="center"
          outlined
          dense
        ></v-autocomplete>
        <p>Select account type</p>
        <v-autocomplete
          style="width: 100%"
          :items="accountTypes"
          item-text="accountTypeName"
          item-value="accountTypeID"
          v-model="accountType"
          outlined
          dense
        ></v-autocomplete>
        <p>Select group</p>
        <v-autocomplete
          v-if="accountType == 5"
          style="width: 100%"
          :items="groups"
          item-text="groupName"
          item-value="groupID"
          v-model="group"
          outlined
          dense
        ></v-autocomplete>
        <v-autocomplete
          v-else
          style="width: 100%"
          :items="groups"
          item-text="groupName"
          item-value="groupID"
          v-model="group"
          outlined
          dense
          disabled
        ></v-autocomplete>
      </v-card-title>
      <v-card-actions> </v-card-actions>
    </popup-confirm>

    <v-row justify="center">
      <v-dialog v-model="dialog" persistent width="350">
        <v-card class="mx-auto pa-10">
          <div class="text-center">
            <h1>Error!</h1>
            <p>{{ message.messages.UNKNOWN_ERROR }}</p>
          </div>
          <div class="text-center">
            <v-btn color="error" elevation="0" @click="back()" outlined> Back </v-btn>
          </div>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { my_profile } from '@/api/my-profile.js'
import PopupConfirm from '@/components/Utils/PopupConfirm.vue'
import { account_managerment } from '@/api/account-management.js'
import message from '@/components/Utils/message'
import Roadmap from '@/components/Roadmap/Roadmap.vue'
import { rewardApi } from '@/api/reward.js'
import { student_information } from '@/api/student-information'
import RewardByStudentOrProfile from '../RewardByStudentOrProfile/Overview.vue'
export default {
  components: {
    RewardByStudentOrProfile,
    'popup-confirm': PopupConfirm,
    'road-map': Roadmap,
  },
  data() {
    return {
      studentInfor: {},
      isLoading: false,
      currentUser: JSON.parse(localStorage.getItem('currentUser')),
      currentCenter: JSON.parse(localStorage.getItem('currentCenter')),
      userDetailInfo: null,
      centers: [],
      rewardList: [],
      isAddmin: false,
      center: '',
      accountTypes: [],
      accountType: '',
      groups: [],
      group: '',
      tab: this.$route.query.tab ? this.$route.query.tab : 0,
      userID: this.$route.params.userId,
      fileInput: '',
      roleObject: {},
      checkImage: false,
      image: '',
      MAX_SIZE_IMAGE: 500,
      userName: '',
      fullName: '',
      dialog: false,
      message: message,
    }
  },
  created() {
    this.s()
    this.init()

    this.getRewardByStudent()
  },
  watch: {},

  methods: {
    async s() {},
    async init() {
      this.isLoading = true

      await my_profile.getDetailUserInfo(this.userID).then(res => {
        if (res) {
          if (res.status === 400) {
            this.dialog = true
          } else {
            this.userDetailInfo = res
            this.setRole()
            this.userName = res.details.userName
            this.fullName = res.details.fullName
            res.role.forEach(x => {
              if (x.locationID == this.currentCenter) {
                if (x.accountTypeName == 'Student') {
                  this.image = res.studentInfo.photo
                } else if (x.accountTypeName == 'Teacher') {
                  this.image = res.teacherInfo.photo
                } else {
                  this.image = res.details.photo
                }
              }
            })
          }
        } else {
          this.dialog = true
        }
        this.isLoading = false
      })

      await account_managerment.getListCenter().then(res => {
        if (res) {
          this.centers = res
        }
      })
      await account_managerment.getListAccountType().then(res => {
        if (res) {
          this.accountTypes = res
        }
      })
      await account_managerment.getListGroupAdmin().then(res => {
        if (res) {
          this.groups = res
        }
      })
    },
    async getRewardByStudent() {
      this.loading = true
      await student_information.getStudentInfor(this.userID).then(async res => {
        await rewardApi.getRewardByStudent(res.studentID).then(res => {
          this.rewardList = res
        })
        this.loading = false
      })
    },

    setRole() {
      const functionRole = localStorage.getItem('functionRole')
      if (functionRole !== undefined) {
        let roleObject = JSON.parse(functionRole)
        let role335 = roleObject.find(element => {
          return element.functionID === 335
        })
        this.roleObject = role335 !== undefined ? role335 : {}
      }
    },

    edit() {
      console.log('edit')
      this.$router.push({
        name: 'account-management-update-account',
        params: { userId: this.userID }, //this.currentUser.userInfo.userID
      })
    },
    resetPassword() {
      localStorage.setItem('resetPasswordUserName', this.userName)
      localStorage.setItem('resetPasswordFullName', this.fullName)
      this.$router.push({
        name: 'account-management-reset-password',
      })
    },
    cancelAdd() {},
    confirmAdd() {
      let updateRole = [
        {
          locationID: this.center ? this.center : 0,
          groupID: this.group ? this.group : 0,
          accountTypeID: this.accountType ? this.accountType : 0,
        },
      ]
      account_managerment.updateRole(this.userID, updateRole).then(res => {
        console.log(res)
      })
      location.reload()
    },
    cancelDelete() {},
    confirmDelete(id) {
      console.log(id)
      //   let body = {
      //     id: id,
      //   };
      //   errorlog.deleteError(querystring.stringify(body)).then((res) => {
      //     if (res) {
      //       store.commit("alert/display", {
      //         message: "Deleted",
      //         error: false,
      //         success: true,
      //       });
      //       this.getDataFromApi();
      //     }
      //   });
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
      }, 300)
    },
    createImage(file) {
      var reader = new FileReader()
      var vm = this

      reader.onload = e => {
        vm.image = e.target.result
      }
      reader.readAsDataURL(file)
    },
    back() {
      // if (this.$route.query.classID) {
      //   this.$router.push({
      //     name: 'class-management-detail',
      //     query: {
      //       classID: this.$route.query.classID,
      //       tabPage: this.$route.query.tab,
      //     },
      //   })
      // } else {
      window.history.back()
      //}
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped>
#my-profile {
  .user-info {
    background: linear-gradient(180deg, #ffffff 0%, #f9f8ff 100%);

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
    color: blue;
    background: none;
    box-shadow: none !important;
  }

  .type-info {
    border-radius: 1rem;
    background-color: lightblue;
    width: 80px;
  }
}
.text-normal {
  text-transform: initial;
}
.tab-sadown {
  position: relative;
  box-shadow: 0px 9px 2px -9px #000;
}
</style>
