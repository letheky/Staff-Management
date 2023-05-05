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
          <div v-if="message == 'Update Successfull'" class="success">
            <v-alert
              :value="checkSuccess"
              transition="scale-transition"
              type="success"
              style="font-size: 14px; padding: 12px"
            >
              Update account successfully!
            </v-alert>
          </div>
          <div v-else class="failed">
            <v-alert
              :value="checkFailed"
              transition="scale-transition"
              type="error"
              style="font-size: 14px; padding: 12px"
            >
              Update account failed!
            </v-alert>
          </div>
          <div>
            <v-btn color="secondary" outlined @click="resetPassword()">Reset password</v-btn>
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
              <v-col md="3">
                <div class="pt-6">
                  <v-avatar class="d-flex" style="margin: auto" size="125">
                    <img v-if="!image" src="@/assets/images/ImageProfile.jpg" />
                    <img
                      v-else
                      :src="
                        image.indexOf('data:image/jpeg') === -1
                          ? 'data:image/jpeg;base64,' + image
                          : image
                      "
                    />
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
              <v-col md="9">
                <v-row no-gutters>
                  <v-col md="4">
                    <v-text-field
                      class="pt-2 pr-5"
                      label="User name"
                      v-model="userDetailInfo.details.userName"
                      outlined
                      dense
                      readonly
                    ></v-text-field>
                    <v-text-field
                      class="pt-2 pr-5"
                      label="Last name"
                      v-model="lastName"
                      outlined
                      dense
                    ></v-text-field>
                    <v-text-field
                      class="pt-2 pr-5"
                      label="Mid name"
                      v-model="middleName"
                      outlined
                      dense
                    ></v-text-field>
                    <v-text-field
                      class="pt-2 pr-5"
                      label="First name"
                      v-model="firstName"
                      outlined
                      dense
                    ></v-text-field>
                    <v-text-field
                      class="pt-2 pr-5"
                      label="Full name"
                      v-model="fullName"
                      readonly
                      outlined
                      dense
                    ></v-text-field>
                    <div>Gender</div>
                    <v-radio-group v-model="userDetailInfo.details.gender" row class="pr-6">
                      <v-radio label="Male" value="M"></v-radio>
                      <v-radio label="Female" value="F"></v-radio>
                    </v-radio-group>
                    <div class="border-vertical"></div>
                  </v-col>

                  <v-col md="4">
                    <v-text-field
                      class="pt-2 pr-5"
                      label="Mobile"
                      :class="'input-number-no-arrows'"
                      type="number"
                      v-model="userDetailInfo.details.mobilePhone"
                      outlined
                      dense
                    ></v-text-field>
                    <v-text-field
                      class="pt-2 pr-5"
                      label="Home phone"
                      :class="'input-number-no-arrows'"
                      type="number"
                      v-model="userDetailInfo.details.homePhone"
                      outlined
                      dense
                    ></v-text-field>
                    <v-text-field
                      class="pt-2 pr-5"
                      label="Email"
                      v-model="userDetailInfo.details.email"
                      outlined
                      dense
                    ></v-text-field>
                    <div style="min-height: 56px !important">
                      <date-picker
                        class="pt-2 pb-2 pr-5"
                        :model="userDetailInfo.details.dob"
                        @update:model="updateFromDate"
                        title="Date of birth"
                      ></date-picker>
                    </div>
                    <div class="border-vertical"></div>
                  </v-col>
                  <v-col md="4">
                    <v-autocomplete
                      class="pt-2 pr-2"
                      label="Country"
                      :items="countries"
                      item-text="nationality"
                      item-value="nationalityID"
                      v-model="userDetailInfo.details.nationality"
                      outlined
                      dense
                    ></v-autocomplete>
                    <v-autocomplete
                      class="pt-2 pr-2"
                      label="Living city"
                      :items="cities"
                      item-text="city"
                      item-value="cityID"
                      v-model="userDetailInfo.details.city"
                      @change="filterDistrictByCity()"
                      outlined
                      dense
                    ></v-autocomplete>
                    <v-autocomplete
                      class="pt-2 pr-2"
                      label="Living district"
                      :items="districts"
                      item-text="district"
                      item-value="districtID"
                      v-model="userDetailInfo.details.district"
                      outlined
                      dense
                    ></v-autocomplete>
                    <v-text-field
                      class="pt-2 pr-2"
                      label="Living address"
                      v-model="userDetailInfo.details.address"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
      <div v-for="(typeId, index) in userRoleInfo" :key="index">
        <!-- Student -->
        <v-row
          no-gutters
          v-if="typeId.accountTypeName == 'Student' && typeId.locationID == currentCenter"
        >
          <v-col md="12">
            <!-- <div class="d-flex align-center">
              <div>
                <v-tabs>
                  <v-tab v-for="(item, index) in userRoleInfo" :key="index">
                    {{ item.location }}
                  </v-tab>
                </v-tabs>
              </div>
              <v-btn @click="$refs.confirmAdd.open()" class="add-action pa-5"
                ><i class="isax isax-add"></i> Add new center</v-btn
              >
            </div> -->
            <div class="d-flex align-center justify-space-between pl-5 pb-3">
              <h2>Account type: Student</h2>
            </div>
            <div class="user-info pl-5 pr-5">
              <v-row>
                <v-col md="3" class="pb-0">
                  <!-- <v-autocomplete
                    :items="schools"
                    item-text="school"
                    item-value="schoolID"
                    v-model="school"
                    outlined
                    dense
                  ></v-autocomplete> -->
                  <v-text-field
                    label="English School"
                    v-model="englishSchool"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col md="3" class="pb-0">
                  <v-autocomplete
                    :items="counselors"
                    label="Counselor"
                    item-text="counselorName"
                    item-value="counselorID"
                    v-model="counselor"
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>
                <v-col md="3" class="pb-0">
                  <v-autocomplete
                    :items="customerGroups"
                    label="Record type"
                    item-text="customerGroupName"
                    item-value="customerGroupID"
                    v-model="customerGroup"
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>
                <v-col md="3" class="pb-0">
                  <v-autocomplete
                    :items="referralIDs"
                    label="Referral by"
                    item-text="userName"
                    item-value="userID"
                    v-model="referralID"
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col md="3" class="pb-0"
                  ><v-autocomplete
                    :items="sources"
                    label="Source reference"
                    item-text="source"
                    item-value="sourceID"
                    v-model="source"
                    outlined
                    dense
                  ></v-autocomplete
                ></v-col>
                <v-col md="3" class="pb-0"
                  ><v-text-field
                    label="Source reference note"
                    v-model="sourceReferenceNote"
                    outlined
                    dense
                  ></v-text-field
                ></v-col>
                <v-col md="3" class="pb-0">
                  <date-picker
                    :model="entryDate"
                    @update:model="updateEntryDate"
                    title="Date of Joining"
                    style="background: white"
                  ></date-picker>
                </v-col>
                <v-col md="3" class="pb-0"
                  ><v-text-field
                    label="Remark"
                    type="number"
                    v-model="remarks"
                    outlined
                    dense
                  ></v-text-field
                ></v-col>
              </v-row>
              <v-row>
                <v-col md="3" class="pb-0"
                  ><v-autocomplete
                    :items="studyPurposes"
                    label="Study Purpose"
                    item-text="studyPurposeName"
                    item-value="studyPurposeID"
                    v-model="studyPurpose"
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>
                <v-col md="3" class="pb-0"
                  ><v-text-field
                    label="IELTS Band Score"
                    type="number"
                    v-model="ieltsBandScore"
                    outlined
                    dense
                  ></v-text-field
                ></v-col>
                <v-col md="6" class="pb-0">
                  <v-autocomplete
                    :items="guardianUserNames"
                    label="Guardian information"
                    item-text="guardianName"
                    item-value="guardianID"
                    v-model="guardianAccount"
                    @change="viewGuardianName"
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </div>
            <div class="pl-5 pr-5">
              <h2 class="pt-3">Relative</h2>
              <div class="list-info">
                <div class="item">
                  <v-row>
                    <v-col md="3">
                      <v-autocomplete
                        v-if="relative"
                        class="pr-2"
                        :items="referralIDs"
                        item-text="userName"
                        item-value="userID"
                        v-model="relative"
                      ></v-autocomplete>
                      <v-autocomplete
                        v-else
                        label="Other student code - name"
                        class="pr-2"
                        :items="referralIDs"
                        item-text="userName"
                        item-value="userID"
                        v-model="relative"
                      ></v-autocomplete>
                    </v-col>
                    <v-col md="2">
                      <v-autocomplete
                        v-if="relativeTypeID"
                        class="pr-2"
                        :items="relativeTypes"
                        item-text="relativeType"
                        item-value="relativeTypeID"
                        v-model="relativeType"
                      ></v-autocomplete>
                      <v-autocomplete
                        v-else
                        label="Relative type"
                        class="pr-2"
                        :items="relativeTypes"
                        item-text="relativeType"
                        item-value="relativeTypeID"
                        v-model="relativeType"
                      ></v-autocomplete>
                    </v-col>
                    <v-col md="1" style="display: contents"
                      ><v-icon color="secondary">mdi-account</v-icon></v-col
                    >
                  </v-row>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
        <!-- Teacher -->
        <v-row
          no-gutters
          v-if="typeId.accountTypeName == 'Teacher' && typeId.locationID == currentCenter"
        >
          <v-col md="12">
            <!-- <div class="d-flex align-center">
              <div>
                <v-tabs>
                  <v-tab v-for="(item, index) in userRoleInfo" :key="index">
                    {{ item.location }}
                  </v-tab>
                </v-tabs>
              </div>
              <v-btn @click="$refs.confirmAdd.open()" class="add-action pa-5"
                ><i class="isax isax-add"></i> Add new center</v-btn
              >
            </div> -->
            <div class="d-flex align-center justify-space-between pl-5 pb-3">
              <h2>Account type: Teacher</h2>
            </div>
            <div class="user-info pl-5 pr-5">
              <v-row>
                <v-col md="3" class="pb-0">
                  <v-autocomplete
                    label="Teacher group"
                    :items="teacherGroups"
                    item-text="teacherGroup"
                    item-value="teacherGroupID"
                    v-model="teacherGroup"
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>
                <v-col md="3" class="pb-0">
                  <v-autocomplete
                    label="Teacher type"
                    :items="teacherTypes"
                    item-text="teacherType"
                    item-value="teacherTypeID"
                    v-model="teacherType"
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>
                <v-col md="3" class="pb-0">
                  <date-picker
                    :model="startDate"
                    @update:model="updateStartDate"
                    title="Start date"
                    style="background: white"
                  ></date-picker>
                </v-col>
                <v-col md="3" class="pb-0">
                  <date-picker
                    :model="endDate"
                    @update:model="updateEndDate"
                    title="End date"
                    style="background: white"
                  ></date-picker>
                </v-col>
              </v-row>
              <v-row>
                <v-col md="3" class="pb-0">
                  <v-autocomplete
                    label="Teacher rate"
                    :items="teacherRates"
                    item-text="scaleName"
                    item-value="scaleID"
                    v-model="teacherRate"
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>
                <v-col md="3" class="pb-0">
                  <v-text-field
                    label="Contract labour No."
                    type="number"
                    v-model="labourNo"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col md="3" class="pb-0">
                  <v-autocomplete
                    label="Salary type"
                    :items="salaryTypes"
                    item-text="teacherSalaryType"
                    item-value="teacherSalaryTypeID"
                    v-model="salaryType"
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>
                <v-col md="3" class="pb-0">
                  <v-text-field
                    label="Salary per hour"
                    type="number"
                    v-model="salaryPerHours"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col md="3" class="pb-0">
                  <v-text-field
                    label="Salary per month"
                    type="number"
                    v-model="salaryPerMonth"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col md="3" class="pb-0">
                  <v-autocomplete
                    label="Currency"
                    :items="currencies"
                    item-text="currencyID"
                    item-value="currencyID"
                    v-model="currency"
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col md="3" class="pb-0">
                  <v-text-field
                    label="Passport No."
                    type="number"
                    v-model="passportNo"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col md="3" class="pb-0">
                  <date-picker
                    :model="passportExpiredDate"
                    @update:model="updatePassportExpiredDate"
                    title="Passport Expires Date"
                    style="background: white"
                  ></date-picker>
                </v-col>
                <v-col md="3" class="pb-0">
                  <v-text-field
                    label="Visa No."
                    type="number"
                    v-model="visaNo"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col md="3" class="pb-0">
                  <date-picker
                    :model="visaExpriedDate"
                    @update:model="updateVisaExpriedDate"
                    title="Visa Expire Date"
                    style="background: white"
                  ></date-picker>
                </v-col>
              </v-row>
              <v-row>
                <v-col md="3" class="pb-0">
                  <v-text-field
                    label="Work Permit No."
                    type="number"
                    v-model="workPermitNo"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col md="3" class="pb-0">
                  <date-picker
                    :model="workPermitExpiredDate"
                    @update:model="updateWorkPermitExpiredDate"
                    title="Work Permit Expires Date"
                    style="background: white"
                  ></date-picker>
                </v-col>
                <v-col md="3" class="pb-0">
                  <v-text-field
                    label="Remark"
                    type="number"
                    v-model="remark"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </div>
      <div class="d-flex justify-end pr-5 pt-3 pb-3">
        <v-btn
          color="secondary"
          outlined
          @click="
            dialog = true
            save()
          "
          >Save</v-btn
        >
      </div>
    </template>
    <popup-confirm @confirm="confirmAdd" @cancel="cancelAdd" :width="1000" ref="confirmAdd">
      <v-card-title style="display: flex; flex-direction: column" slot="icon"
        ><i class="isax isax-card-add"></i
      ></v-card-title>
      <v-card-title style="display: flex; flex-direction: column" slot="title"
        ><h2 class="text-center">Add new center</h2></v-card-title
      >
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
            <v-btn
              elevation="0"
              height="36"
              class="pl-4 pr-4 mr-3 mb-5"
              :loading="dialog"
              style="background: white"
            >
            </v-btn>
          </div>
          <div class="text-center">
            <b style="font-size: 1.5rem">Updating account!</b><br />
            <span>Please wait...</span>
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
import { nationalities } from '@/api/nationalities.js'
import { account_managerment } from '@/api/account-management.js'
import { teacher_information } from '@/api/teacher-information.js'
import DatePicker from '@/components/Utils/DatePicker.vue'

export default {
  components: {
    'popup-confirm': PopupConfirm,
    'date-picker': DatePicker,
  },
  data() {
    return {
      isLoading: false,
      currentUser: JSON.parse(localStorage.getItem('currentUser')),
      currentCenter: JSON.parse(localStorage.getItem('currentCenter')),
      userID: this.$route.params.userId,
      successMessage: false,
      countries: [],
      cities: [],
      districts: [],
      schools: [],
      school: '',
      schoolID: '',
      englishSchool: '',
      counselors: [],
      counselor: '',
      counselorID: '',
      customerGroups: [],
      customerGroup: '',
      customerGroupID: '',
      referralIDs: [],
      referralID: '',
      userId: '',
      sources: [],
      source: '',
      sourceID: '',
      sourceReferenceNote: '',
      entryDate: '',
      remarks: '',
      studyPurposes: [],
      studyPurpose: '',
      studyPurposeID: '',
      ieltsBandScore: '',
      guardianUserNames: [],
      guardianUserName: '',
      guardianAccount: '',
      mobiPhone: '',
      guardianEmail: '',
      userGuardianID: '',
      relative: '',
      relativeTypes: [],
      relativeType: '',
      relativeTypeID: '',
      centers: [],
      center: '',
      accountTypes: [],
      accountType: '',
      groups: [],
      group: '',
      guardianName: '',
      mobilePhone: '',
      email: '',
      teacherGroup: '',
      teacherGroups: [],
      teacherType: '',
      teacherTypes: [],
      startDate: '',
      endDate: '',
      teacherRate: '',
      teacherRates: [],
      labourNo: '',
      salaryType: '',
      salaryTypes: [],
      salaryPerHours: '',
      salaryPerMonth: '',
      currency: '',
      currencies: [],
      passportNo: '',
      passportExpiredDate: '',
      visaNo: '',
      visaExpriedDate: '',
      workPermitNo: '',
      workPermitExpiredDate: '',
      remark: '',
      userRoleInfo: null,
      checkGuardian: '',
      userDetailInfo: {
        details: {},
      },
      checkSuccess: false,
      checkFailed: false,
      message: '',
      image: '',
      checkImage: false,
      MAX_SIZE_IMAGE: 500,
      middleName: '',
      lastName: '',
      firstName: '',
      fullName: '',
      userName: '',
      fileInput: '',
      dialog: false,
    }
  },
  created() {
    this.init()
  },
  watch: {
    firstName: function (value) {
      this.fullName = value + ' ' + this.middleName + ' ' + this.lastName
    },
    middleName: function (value) {
      this.fullName = this.firstName + ' ' + value + ' ' + this.lastName
    },
    lastName: function (value) {
      this.fullName = this.firstName + ' ' + this.middleName + ' ' + value
    },
  },
  methods: {
    filterDistrictByCity() {
      this.userDetailInfo.details.district = []
      nationalities.getDistrictsByCity(this.userDetailInfo.details.city).then(res => {
        this.districts = []
        this.districts = res.map(x => {
          return {
            district: x.district,
            districtID: x.districtID,
          }
        })
      })
      this.userDetailInfo.details.school = []
      account_managerment.getListSchool(this.userDetailInfo.details.city).then(res => {
        this.schools = []
        this.schools = res.map(x => {
          return {
            school: x.school,
            schoolID: x.schoolID,
          }
        })
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
    viewGuardianName() {
      account_managerment.getListGuardians().then(res => {
        if (res) {
          this.guardianUserNames = res
          res.forEach(x => {
            if (this.guardianAccount == x.guardianID) {
              this.guardianUserName = x.guardianName
              this.mobiPhone = x.mobiPhone
              this.guardianEmail = x.email
              this.userGuardianID = x.userID
            }
          })
        }
      })
    },
    async init() {
      this.isLoading = true
      await nationalities.getCountries().then(res => {
        if (res) {
          this.countries = res
        }
      })
      await nationalities.getCities().then(res => {
        if (res) {
          this.cities = res
        }
      })
      account_managerment.getListCounselor().then(res => {
        if (res) {
          this.counselors = res
        }
      })
      await account_managerment.getListRecordType().then(res => {
        if (res) {
          this.customerGroups = res
        }
      })
      await account_managerment.getListReferralBy(this.currentCenter).then(res => {
        if (res) {
          this.referralIDs = res
        }
      })
      await account_managerment.getListSourceReference().then(res => {
        if (res) {
          this.sources = res
        }
      })
      await account_managerment.getListStudyPurpose().then(res => {
        if (res) {
          this.studyPurposes = res
        }
      })
      await account_managerment.getListRelativeTypes().then(res => {
        if (res) {
          this.relativeTypes = res
        }
      })
      await account_managerment.getListCenter().then(res => {
        if (res) {
          this.centers = res
        }
      })
      await account_managerment.getListGuardians().then(res => {
        if (res) {
          this.guardianUserNames = res
        }
      })
      await teacher_information.getListTeacherGroup().then(res => {
        if (res) {
          this.teacherGroups = res
        }
      })
      await teacher_information.getListTeacherType().then(res => {
        if (res) {
          this.teacherTypes = res
        }
      })
      await teacher_information.getListTeacherRate().then(res => {
        if (res) {
          this.teacherRates = res
        }
      })
      await teacher_information.getListTeacherSalaryTypes().then(res => {
        if (res) {
          this.salaryTypes = res
        }
      })
      await teacher_information.getListTeacherCurrency().then(res => {
        if (res) {
          this.currencies = res
        }
      })
      await account_managerment.getListGroupAdmin().then(res => {
        if (res) {
          this.groups = res
        }
      })
      await account_managerment.getListAccountType().then(res => {
        if (res) {
          this.accountTypes = res
        }
      })
      await my_profile
        .getDetailUserInfo(this.userID) //this.currentUser.userInfo.userID
        .then(res => {
          if (res) {
            this.userDetailInfo.details.userName = res.details.userName
            this.userName = res.details.userName
            this.userDetailInfo.details.gender = res.details.gender
            this.userDetailInfo.details.dob = this._dayjs(res.details.dob).format('YYYY-MM-DD')
            this.userDetailInfo.details.homePhone = res.details.homePhone
            this.userDetailInfo.details.mobilePhone = res.details.mobilePhone
            this.userDetailInfo.details.email = res.details.email
            this.userDetailInfo.details.nationality = res.details.nationalityID
            this.userDetailInfo.details.address = res.details.address
            this.userDetailInfo.details.city = res.details.cityID
            this.lastName = res.details.lastName
            this.firstName = res.details.firstName
            this.middleName = res.details.middleName
            nationalities.getDistrictsByCity(res.details.cityID).then(res => {
              if (res) {
                this.districts = res
              }
            })
            account_managerment.getListSchool(res.details.cityID).then(res => {
              if (res) {
                this.schools = res
              }
            })
            this.userDetailInfo.details.district = res.details.districtID
            this.counselor = res.studentInfo.counselorID
            this.school = res.studentInfo.schoolID
            this.englishSchool = res.studentInfo.englishSchool
            this.customerGroup = res.studentInfo.customerGroupID
            this.referralID = res.studentInfo.referralID
            this.source = res.studentInfo.sourceID
            this.sourceReferenceNote = res.studentInfo.sourceReferenceNote
            if (res.studentInfo.entryDate != null) {
              this.entryDate = this._dayjs(res.studentInfo.entryDate).format('YYYY-MM-DD')
            }
            this.remarks = res.studentInfo.remarks
            this.studyPurpose = res.studentInfo.studyPurposeID
            this.ieltsBandScore = res.studentInfo.ieltsBandScore
            this.guardianAccount = res.studentInfo.guardians
            this.teacherGroup = res.teacherInfo.teacherGroupID
            this.teacherType = res.teacherInfo.teacherTypeID
            if (res.teacherInfo.startDate != null) {
              this.startDate = this._dayjs(res.teacherInfo.startDate).format('YYYY-MM-DD')
            }
            if (res.teacherInfo.endDate != null) {
              this.endDate = this._dayjs(res.teacherInfo.endDate).format('YYYY-MM-DD')
            }
            this.teacherRate = res.teacherInfo.scaleID
            this.labourNo = ''
            this.salaryType = res.teacherInfo.teacherSalaryTypeID
            this.salaryPerHours = res.teacherInfo.salaryPerHours
            this.salaryPerMonth = res.teacherInfo.salaryPerMonth
            this.currency = res.teacherInfo.currencyID
            this.passportNo = res.teacherInfo.passportNo
            if (res.teacherInfo.passportExpiredDate != null) {
              this.passportExpiredDate = this._dayjs(res.teacherInfo.passportExpiredDate).format(
                'YYYY-MM-DD'
              )
            }
            this.visaNo = res.teacherInfo.visaNo
            if (res.teacherInfo.visaExpriedDate != null) {
              this.visaExpriedDate = this._dayjs(res.teacherInfo.visaExpriedDate).format(
                'YYYY-MM-DD'
              )
            }
            this.workPermitNo = ''
            if (res.teacherInfo.workPermitExpireDate != null) {
              this.workPermitExpiredDate = this._dayjs(res.teacherInfo.workPermitExpireDate).format(
                'YYYY-MM-DD'
              )
            }
            this.remark = res.teacherInfo.notes
            this.userRoleInfo = res.role
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
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    back() {
      window.history.back()
    },
    cancel() {
      this.$router.push({ name: 'account-management-overview' })
    },
    save() {
      let body = {
        userID: this.$route.params.userId,
        detail: {
          firstName: this.firstName,
          middleName: this.middleName,
          lastName: this.lastName,
          fullName: this.fullName,
          dob: this.userDetailInfo.details.dob,
          gender: this.userDetailInfo.details.gender,
          nationalityID: this.userDetailInfo.details.nationality,
          address: this.userDetailInfo.details.address,
          districtID: this.userDetailInfo.details.district,
          cityID: this.userDetailInfo.details.city,
          email: this.userDetailInfo.details.email,
          homePhone: this.userDetailInfo.details.homePhone,
          mobilePhone: this.userDetailInfo.details.mobilePhone,
          officePhone: this.userDetailInfo.details.officePhone
            ? this.userDetailInfo.details.officePhone
            : '',
        },
        student: {
          hobbies: '',
          contactName: '',
          motherName: '',
          motherPhone: '',
          fatherName: '',
          fatherPhone: '',
          counselorID: this.counselor,
          entryDate: this.entryDate ? this.entryDate : '',
          occupationID: 0,
          schoolID: this.school,
          companyID: 0,
          contractID: 0,
          taxCode: 'xxxxxxxxxx',
          sourceID: this.source,
          remarks: this.remarks ? this.remarks : '',
          locationID: 0,
          isDeleted: true,
          lUpdUser: 'string',
          lUpdDate: '2021-12-17T03:49:21.785Z',
          studentBalAmount: 0,
          companyName: '',
          customerTypeID: 0,
          customerGroupID: this.customerGroup,
          searchName: '',
          studentARBalance: 0,
          prospectID: 0,
          prospectCode: '',
          englishSchool: this.englishSchool ? this.englishSchool : '',
          englishBook: '',
          psClass: '',
          agencyID: 0,
          acceptReceiveEmail: true,
          acceptReceiveSMS: true,
          identification: '',
          passport: '',
          channelID: 0,
          oldStudentCode: '',
          oldStudentID: 0,
          isFirstSteps: true,
          referralID: this.referralID,
          englishSchoolTemp: '',
          schoolTemp: '',
          guardians: [
            {
              guardianID: this.guardianAccount ? this.guardianAccount : 0,
              guardianName: this.guardianName ? this.guardianName : '',
              homePhone: '',
              mobiPhone: this.mobiPhone ? this.mobiPhone : '',
              email: this.email ? this.email : '',
              userID: this.userGuardianID ? this.userGuardianID : 0,
            },
          ],
          sourceReferenceNote: this.sourceReferenceNote ? this.sourceReferenceNote : '',
          ieltsBandScore: this.ieltsBandScore,
          studyPurposeID: this.studyPurpose,
          relatives: [
            {
              relativeID: this.relative ? this.relative : 0,
              keyStudentID: 0,
              foreignStudentID: 0,
              relativeTypeID: this.relativeType ? this.relativeType : 0,
            },
          ],
        },
        teacher: {
          teacherGroupID: this.teacherGroup,
          departmentID: 0,
          locationID: 0,
          startDate: this.startDate ? this.startDate : '',
          endDate: this.endDate ? this.endDate : '',
          teacherSalaryTypeID: this.salaryType,
          currencyID: this.currency ? this.currency : 0,
          salaryPerHours: this.salaryPerHours,
          salaryPerMonth: this.salaryPerMonth,
          passportNo: this.passportNo ? this.passportNo : 0,
          passportExpiredDate: this.passportExpiredDate ? this.passportExpiredDate : '',
          visaNo: this.visaNo ? this.visaNo : 0,
          visaExpriedDate: this.visaExpriedDate ? this.visaExpriedDate : '',
          notes: this.remark ? this.remark : 0,
          inactive: true,
          lUpdUser: 'string',
          lUpdDate: '2021-12-17T03:49:21.785Z',
          teacherTypeID: this.teacherType,
          searchName: '',
          scaleID: this.teacherRate,
        },
      }
      my_profile.updateDetailUserInfo(body).then(res => {
        this.message = res.message
        if (res.message == 'Update Successfull') {
          this.dialog = true
          this.checkSuccess = true
          setTimeout(() => {
            this.checkSuccess = false
            this.$router.push({ name: 'account-management-overview' })
          }, 2000)
          this.dialog = false
        } else {
          this.dialog = true
          this.checkFailed = true
          setTimeout(() => {
            this.checkFailed = false
          }, 2000)
          this.dialog = false
        }
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
    updateFromDate(event) {
      this.userDetailInfo.details.dob = event
    },
    updateEntryDate(event) {
      this.entryDate = event
    },
    updateStartDate(event) {
      this.startDate = event
    },
    updateEndDate(event) {
      this.endDate = event
    },
    updatePassportExpiredDate(event) {
      this.passportExpiredDate = event
    },
    updateVisaExpriedDate(event) {
      this.visaExpriedDate = event
    },
    updateWorkPermitExpiredDate(event) {
      this.workPermitExpiredDate = event
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped>
#my-profile {
  .success {
    width: 300px;
    position: absolute;
    right: 0;
    bottom: 5%;
    z-index: 999;
  }
  .failed {
    width: 300px;
    position: absolute;
    right: 0;
    bottom: 5%;
    z-index: 999;
  }
  .user-info {
    background: linear-gradient(180deg, #ffffff 0%, #f9f8ff 100%);
    .list-info {
      position: relative;
      .item {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px dashed #dadbe6;
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
  .title-action {
    display: flex;
    flex-direction: column;
  }
}
</style>
