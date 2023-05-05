<template>
  <div id="create-account">
    <v-row>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <h2 class="d-flex mb-10">
            <v-icon @click="back()">arrow_back_ios</v-icon>
            <div class="d-flex align-center">Create new user</div>
          </h2>
          <div class="success" v-if="message == 'Ok'">
            <v-alert
              :value="checkSuccess"
              transition="scale-transition"
              type="success"
              style="font-size: 14px; padding: 12px"
            >
              Create account successfully
            </v-alert>
          </div>
          <div>
            <v-row class="pt-2">
              <v-col class="col-md-3">
                <div>
                  <v-avatar size="125">
                    <img v-if="!image" src="@/assets/images/ImageProfile.jpg" />
                    <img v-else :src="image" />
                  </v-avatar>
                  <input
                    type="file"
                    @change="
                      fileInput = $event
                      onFileChange($event)
                    "
                    accept="image/*"
                    id="file-input"
                  />
                </div>
              </v-col>
              <v-col class="col-md-3">
                <!-- <v-text-field
                  label="User account *"
                  v-model="user_account"
                  :rules="[rules.required]"
                  outlined
                  dense
                ></v-text-field>
                <v-text-field
                  label="Password *"
                  v-model="password"
                  :rules="[rules.required]"
                  outlined
                  dense
                ></v-text-field> -->
                <v-text-field
                  label="Last name"
                  outlined
                  v-model="lastname"
                  :rules="[rules.required]"
                  dense
                ></v-text-field>
                <v-text-field
                  label="Mid name"
                  outlined
                  v-model="midname"
                  :rules="[rules.required]"
                  dense
                ></v-text-field>
                <v-text-field
                  label="First name"
                  outlined
                  v-model="firstname"
                  :rules="[rules.required]"
                  dense
                ></v-text-field>
                <v-text-field
                  label="Full name"
                  v-model="fullName"
                  :disabled="true"
                  outlined
                  dense
                ></v-text-field>
                <b style="font-size: 17px">Gender</b>
                <v-radio-group v-model="gender" row class="mb-3">
                  <v-radio label="Male" value="M"></v-radio>
                  <v-radio label="Female" value="F"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col class="col-md-3">
                <v-text-field
                  label="Mobile *"
                  v-model="mobile"
                  :rules="[rules.required]"
                  type="number"
                  outlined
                  dense
                ></v-text-field>
                <v-text-field
                  label="Home phone"
                  v-model="homephone"
                  type="number"
                  outlined
                  dense
                ></v-text-field>
                <v-text-field
                  label="Email *"
                  v-model="email"
                  :rules="[rules.required, rules.email]"
                  outlined
                  dense
                ></v-text-field>
                <date-picker
                  :model="dob"
                  @update:model="updateDob"
                  title="Date of birth *"
                ></date-picker>
              </v-col>
              <v-col class="col-md-3">
                <v-autocomplete
                  label="Country"
                  v-model="country"
                  :items="countries"
                  item-text="nationality"
                  item-value="nationality"
                  outlined
                  dense
                ></v-autocomplete>
                <v-autocomplete
                  label="Living City"
                  v-model="livingCity"
                  :items="cities"
                  item-text="city"
                  item-value="city"
                  @change="selectCity"
                  outlined
                  dense
                ></v-autocomplete>
                <v-autocomplete
                  label="Living district"
                  v-model="livingDistrict"
                  :items="districts"
                  item-text="district"
                  item-value="district"
                  outlined
                  dense
                ></v-autocomplete>
                <v-text-field
                  label="Living address"
                  v-model="address"
                  outlined
                  dense
                  class="mb-5"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
          <div>
            <div>
              <h2 style="color: #393a5c !important" class="mb-5">Select account type</h2>
              <v-row>
                <v-col class="col-md-3">
                  <v-select
                    label="Account type"
                    v-model="accountType"
                    :items="accountTypes"
                    item-text="accountTypeName"
                    item-value="accountTypeID"
                    outlined
                    dense
                  ></v-select>
                </v-col>
              </v-row>
            </div>
            <div v-if="accountType === 1">
              <v-row>
                <v-col class="col-md-3 pb-0">
                  <v-text-field
                    label="English school"
                    v-model="englishSchool"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col class="col-md-3 pb-0">
                  <v-autocomplete
                    label="Counselor"
                    v-model="counselor"
                    :items="counselors"
                    item-text="counselorName"
                    item-value="counselorName"
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>
                <v-col class="col-md-3 pb-0">
                  <v-autocomplete
                    label="Record type"
                    v-model="recordType"
                    :items="recordTypes"
                    item-text="customerGroupName"
                    item-value="customerGroupName"
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>
                <v-col class="col-md-3 pb-0">
                  <v-autocomplete
                    label="Referral by"
                    v-model="referralBy"
                    :items="referralBys"
                    item-text="userName"
                    item-value="userName"
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="col-md-3 pb-0">
                  <v-autocomplete
                    label="Source reference"
                    v-model="sourceReference"
                    :items="sourceReferences"
                    item-text="source"
                    item-value="source"
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>
                <v-col class="col-md-3 pb-0">
                  <v-text-field
                    label="Source reference note"
                    v-model="sourceReferenceNote"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col class="col-md-3 pb-0">
                  <date-picker
                    class="pb-4"
                    :model="dateOfJoining"
                    title="Date of Joining"
                    @update:model="updateDateOfJoining"
                  ></date-picker>
                </v-col>
                <v-col class="col-md-3 pb-0">
                  <v-text-field
                    label="Remark"
                    v-model="remarkStudent"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="col-md-3 pb-0">
                  <v-autocomplete
                    label="Study Purpose"
                    v-model="studyPurpose"
                    :items="studyPurposes"
                    item-text="studyPurposeName"
                    item-value="studyPurposeName"
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>
                <v-col class="col-md-3 pb-0">
                  <v-text-field
                    label="IELTS Band Score"
                    v-model="bandScore"
                    type="number"
                    outlined
                    dense
                    class="mb-5"
                  ></v-text-field>
                </v-col>
                <v-col class="col-md-6 pb-0">
                  <v-select
                    label="Guardian information"
                    v-model="guardianAccount"
                    :items="guardianAccounts"
                    item-value="guardianName"
                    item-text="guardianName"
                    outlined
                    dense
                  ></v-select>
                </v-col>
              </v-row>
              <h3 class="pb-2">Relatives</h3>
              <div v-for="(relative, index) in relatives" :key="index">
                <v-row>
                  <v-col class="col-md-3 pb-0">
                    <v-autocomplete
                      label="Student"
                      v-model="relative.student"
                      :items="students.filter(x => x.accountTypeID == 1)"
                      item-text="userAndFullName"
                      item-value="userID"
                      outlined
                      dense
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="col-md-3 pb-0">
                    <v-autocomplete
                      label="Relative type"
                      v-model="relative.relativeType"
                      :items="relativeTypes"
                      item-text="relativeType"
                      item-value="relativeTypeID"
                      outlined
                      dense
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="col-md-2">
                    <v-icon class="pt-1" @click="removeRelative(index)">mdi-delete</v-icon>
                  </v-col>
                </v-row>
              </div>
              <div>
                <v-btn @click="addMoreRelative()">Add</v-btn>
              </div>
            </div>
          </div>
          <div v-if="accountType === 5">
            <v-row>
              <v-col class="col-md-3">
                <v-select
                  label="Select group"
                  v-model="group"
                  :items="groups"
                  item-text="groupName"
                  item-value="groupID"
                  outlined
                  dense
                ></v-select>
              </v-col>
              <v-col class="col-md-3">
                <v-text-field label="Remark" v-model="remarkStaff" outlined dense></v-text-field>
              </v-col>
            </v-row>
          </div>
          <div v-if="accountType === 4">
            <v-row>
              <v-col class="col-md-3 pb-0">
                <v-autocomplete
                  label="Teacher group"
                  v-model="teacherGroup"
                  :items="teacherGroups"
                  item-value="teacherGroup"
                  item-text="teacherGroup"
                  outlined
                  dense
                ></v-autocomplete>
              </v-col>
              <v-col class="col-md-3 pb-0">
                <v-autocomplete
                  label="Teacher type"
                  v-model="teacherType"
                  :items="teacherTypes"
                  item-text="teacherType"
                  item-value="teacherType"
                  outlined
                  dense
                ></v-autocomplete>
              </v-col>
              <v-col class="col-md-3 pb-0">
                <date-picker
                  class="pb-4"
                  :model="startDate"
                  title="Start date"
                  @update:model="updateStartDate"
                ></date-picker>
              </v-col>
              <v-col class="col-md-3 pb-0">
                <date-picker
                  class="pb-4"
                  :model="endDate"
                  title="End date"
                  @update:model="updateEndDate"
                ></date-picker>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="col-md-3 pb-0">
                <v-autocomplete
                  label="Teacher Rate"
                  v-model="teacherRate"
                  :items="teacherRates"
                  item-value="scaleName"
                  item-text="scaleName"
                  outlined
                  dense
                ></v-autocomplete>
              </v-col>
              <v-col class="col-md-3 pb-0">
                <v-text-field
                  label="Contract labour No."
                  v-model="contractLabourNo"
                  type="text"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col class="col-md-3 pb-0">
                <v-autocomplete
                  label="Salary type"
                  v-model="salaryType"
                  :items="salaryTypes"
                  item-text="teacherSalaryType"
                  item-value="teacherSalaryType"
                  outlined
                  dense
                ></v-autocomplete>
              </v-col>
              <v-col class="col-md-3 pb-0">
                <v-text-field
                  label="Salary per hours"
                  v-model="salaryPerHours"
                  type="number"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="col-md-3 pb-0">
                <v-text-field
                  label="Salary per month"
                  v-model="salaryPerMonth"
                  type="number"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col class="col-md-3 pb-0">
                <v-select
                  label="Currency"
                  v-model="currency"
                  :items="currencies"
                  item-value="currencyID"
                  item-text="currencyID"
                  outlined
                  dense
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="col-md-3 pb-0">
                <v-text-field
                  label="Passport No."
                  v-model="passPortNo"
                  type="text"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col class="col-md-3 pb-0">
                <date-picker
                  class="pb-4"
                  :model="expriresDatePassPort"
                  title="Passport Exprires Date"
                  @update:model="updateExpriresDatePassPort"
                ></date-picker>
              </v-col>
              <v-col class="col-md-3 pb-0">
                <v-text-field
                  label="Visa No."
                  v-model="visaNo"
                  type="text"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col class="col-md-3 pb-0">
                <date-picker
                  class="pb-4"
                  :model="expriresDateVisa"
                  title="Visa Exprires Date"
                  @update:model="updateExpriresDateVisa"
                ></date-picker>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="col-md-3">
                <v-text-field
                  label="Work Permit No."
                  v-model="workPermitNo"
                  type="text"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col class="col-md-3">
                <date-picker
                  class="pb-4"
                  :model="expriresDateWorkPermit"
                  title="Work Permit Exprires Date"
                  @update:model="updateExpriresDateWorkPermit"
                ></date-picker>
              </v-col>
              <v-col class="col-md-3">
                <v-text-field
                  label="Remark"
                  v-model="remarkTeacher"
                  type="text"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
          <div v-if="accountType == 2">
            <v-row>
              <v-col class="col-md-3">
                <v-text-field
                  label="Remark"
                  v-model="remarkGuardian"
                  type="text"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
            <v-checkbox
              label="Accept receive Email"
              v-model="acceptEmail"
              value="acceptEmail"
            ></v-checkbox>
            <v-checkbox
              label="Accept receive SMS"
              v-model="acceptSMS"
              value="acceptSMS"
            ></v-checkbox>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-footer height="60" color="#fff" class="pl-10 pr-10">
      <v-row>
        <v-col class="d-flex justify-end">
          <v-btn
            elevation="0"
            height="36"
            class="pl-4 pr-4"
            color="primary"
            @click="
              dialog = true
              createAccount()
            "
          >
            Create account
          </v-btn>
        </v-col>
      </v-row>
    </v-footer>
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
            <b style="font-size: 1.5rem">Creating account!</b><br />
            <span>Please wait...</span>
          </div>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { nationalities } from '@/api/nationalities.js'
import { account_managerment } from '@/api/account-management.js'
import { teacher_information } from '@/api/teacher-information.js'
import DatePicker from '@/components/Utils/DatePicker.vue'
import dayjs from 'dayjs'
export default {
  components: {
    'date-picker': DatePicker,
  },
  data() {
    return {
      currentStep: 1,
      accountTypes: [],
      accountType: 1,
      countries: [],
      cities: [],
      districts: [],
      priSchools: [],
      counselors: [],
      recordTypes: [],
      sourceReferences: [],
      guardianAccounts: [],
      studyPurposes: [],
      referralBys: [],
      teacherGroups: [],
      teacherTypes: [],
      teacherRates: [],
      salaryTypes: [],
      currencies: [],
      groups: [],
      referralBy: '',
      studyPurpose: '',
      guardianAccount: '',
      sourceReference: '',
      recordType: '',
      counselor: '',
      priSchool: '',
      livingCity: '',
      livingCityID: '',
      user_account: '',
      firstname: '',
      midname: '',
      lastname: '',
      gender: '',
      dob: '',
      mobile: '',
      homephone: '',
      officePhone: '',
      email: '',
      country: '',
      livingDistrict: '',
      address: '',
      cityID: '',
      countryID: '',
      currentUser: JSON.parse(localStorage.getItem('currentUser')),
      currentCenter: JSON.parse(localStorage.getItem('currentCenter')),
      dialog: false,
      password: 'CEC@123',
      bandScore: '',
      teacherGroup: '',
      teacherType: '',
      teacherRate: '',
      salaryType: '',
      currency: '',
      group: '',
      orderStudentCodeName: '',
      guardianEmail: '',
      guardianPhone: '',
      guardianName: '',
      guardian: '',
      remarkStudent: '',
      remarkTeacher: '',
      dateOfJoining: '',
      sourceReferenceNote: '',
      fullName: '',
      englishSchool: '',
      counselorID: '',
      priSchoolID: '',
      recordTypesID: '',
      referralID: '',
      sourceReferenceID: '',
      studyPurposeID: '',
      expriresDatePassPort: '',
      expriresDateVisa: '',
      expriresDateWorkPermit: '',
      passPortNo: '',
      visaNo: '',
      workPermitNo: '',
      teacherGroupID: '',
      teacherTypeID: '',
      teacherRateID: '',
      salaryTypeID: '',
      districtID: '',
      guardianAccountID: '',
      contractLabourNo: '',
      startDate: '',
      endDate: '',
      salaryPerHours: '',
      salaryPerMonth: '',
      checkSuccess: false,
      acceptEmail: '',
      acceptSMS: '',
      remarkGuardian: '',
      remarkStaff: '',
      rules: {
        required: value => !!value || 'The field is required',
        email: value => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail'
        },
      },
      locationPermission: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
      currentCenterName: '',
      checkImage: false,
      MAX_SIZE_IMAGE: 500,
      fileInput: '',
      image: '',
      relatives: [],
      student: '',
      students: [],
      relativeType: '',
      relativeTypes: [],
      locationIds: JSON.parse(localStorage.getItem('currentCenter')),
      params: [],
      message: '',
    }
  },
  watch: {
    firstname: function (value) {
      this.fullName = value + ' ' + this.midname + ' ' + this.lastname
    },
    midname: function (value) {
      this.fullName = this.firstname + ' ' + value + ' ' + this.lastname
    },
    lastname: function (value) {
      this.fullName = this.firstname + ' ' + this.midname + ' ' + value
    },
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      // this.isLoading = true;
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
      await account_managerment.getListCounselor().then(res => {
        if (res) {
          this.counselors = res
        }
      })
      await account_managerment.getListRecordType().then(res => {
        if (res) {
          this.recordTypes = res
        }
      })
      await account_managerment.getListSourceReference().then(res => {
        if (res) {
          this.sourceReferences = res
        }
      })
      await account_managerment.getListGuardians().then(res => {
        if (res) {
          this.guardianAccounts = res
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
      await account_managerment.getUserList(this.locationIds).then(res => {
        if (res) {
          // this.students = res.salary;
          res.salary.forEach(x => {
            this.students.push({
              accountTypeID: x.accountTypeID,
              accountTypeName: x.accountTypeName,
              dob: x.dob,
              fullName: x.fullName,
              groupID: x.groupID,
              groupName: x.groupName,
              isActive: x.isActive,
              isWindowAuthenticate: x.isWindowAuthenticate,
              location: x.location,
              locationID: x.locationID,
              mobilePhone: x.mobilePhone,
              remarks: x.remarks,
              smsPassword: x.smsPassword,
              smsUsername: x.smsUsername,
              status: x.status,
              studentID: x.studentID,
              teacherID: x.teacherID,
              userID: x.userID,
              userName: x.userName,
              userAndFullName: x.userName + ' ' + '-' + ' ' + x.fullName,
            })
          })
        }
      })
      await account_managerment.getListReferralBy(this.currentCenter).then(res => {
        if (res) {
          this.referralBys = res.salary
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
      this.locationPermission.forEach(x => {
        if (x.locationID === this.currentCenter) {
          this.currentCenterName = x.location
        }
      })
      await teacher_information.getListTeacherSalaryTypes().then(res => {
        if (res) {
          this.salaryTypes = res
        }
      })
      await teacher_information.getListTeacherRate().then(res => {
        if (res) {
          this.teacherRates = res
        }
      })
    },
    addMoreRelative() {
      this.relatives.push({
        student: this.student,
        relativeType: this.relativeType,
      })
    },
    removeRelative(relative) {
      this.relatives.splice(relative, 1)
    },
    selectCity() {
      this.cities.forEach(x => {
        if (x.city == this.livingCity) {
          this.cityID = x.cityID
        }
      })
      nationalities.getDistrictsByCity(this.cityID).then(res => {
        this.districts = res
      })
      account_managerment.getListSchool(this.cityID).then(res => {
        if (res) {
          this.priSchools = res
        }
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
    },
    createImage(file) {
      var reader = new FileReader()
      var vm = this

      reader.onload = e => {
        vm.image = e.target.result
      }
      reader.readAsDataURL(file)
    },
    createAccount() {
      this.counselors.forEach(x => {
        x.counselorName == this.counselor ? (this.counselorID = x.counselorID) : ''
      })
      this.priSchools.forEach(x => {
        x.school == this.priSchool ? (this.priSchoolID = x.schoolID) : ''
      })
      this.recordTypes.forEach(x => {
        x.customerGroupName == this.recordType ? (this.recordTypesID = x.customerGroupID) : ''
      })
      this.referralBys.forEach(x => {
        x.userName == this.referralBy ? (this.referralID = x.userID) : ''
      })
      this.sourceReferences.forEach(x => {
        x.source == this.sourceReference ? (this.sourceReferenceID = x.sourceID) : ''
      })
      this.studyPurposes.forEach(x => {
        x.studyPurposeName == this.studyPurpose ? (this.studyPurposeID = x.studyPurposeID) : ''
      })
      this.teacherGroups.forEach(x => {
        x.teacherGroup == this.teacherGroup ? (this.teacherGroupID = x.teacherGroupID) : ''
      })
      this.teacherTypes.forEach(x => {
        x.teacherType == this.teacherType ? (this.teacherTypeID = x.teacherTypeID) : ''
      })
      this.countries.forEach(x => {
        x.nationality == this.country ? (this.countryID = x.nationalityID) : ''
      })
      this.guardianAccounts.forEach(x => {
        x.guardianName == this.guardianAccount ? (this.guardianAccountID = x.guardianID) : ''
      })
      this.districts.forEach(x => {
        if (x.district == this.livingDistrict) {
          this.districtID = x.districtID
        }
      })
      this.params = []
      this.relatives.forEach(x => {
        this.params.push({
          foreignStudentID: x.student,
          relativeTypeID: x.relativeType,
        })
      })
      let body = {
        user: {
          userName: this.user_account,
          password: this.password,
          isWindowAuthenticate: false,
          fullName: this.fullName,
          remarks: '',
          teacherID: this.accountType == 4 ? this.accountType : 0,
          studentID: this.accountType == 1 ? this.accountType : 0,
          isActive: false,
          smsUsername: '',
          smsPassword: '',
        },
        detail: {
          firstName: this.firstname,
          middleName: this.midname,
          lastName: this.lastname,
          fullName: this.firstname + this.midname + this.lastname,
          dob: this.dob,
          gender: this.gender,
          nationalityID: this.countryID,
          address: this.address,
          districtID: this.districtID,
          cityID: this.cityID,
          email: this.email,
          homePhone: this.homephone,
          mobilePhone: this.mobile,
          officePhone: this.officePhone,
        },
        role: {
          locationID: this.currentCenter,
          groupID: this.group ? this.group : 0,
          accountTypeID: this.accountType,
        },
        student: {
          hobbies: '',
          contactName: '',
          motherName: '',
          motherPhone: '',
          fatherName: '',
          fatherPhone: '',
          counselorID: this.counselorID,
          entryDate: '2021-12-14T04:15:58.109Z',
          occupationID: 0,
          schoolID: this.priSchoolID,
          companyID: 0,
          contractID: 0,
          taxCode: 'xxxxxxxxxx',
          sourceID: this.sourceReferenceID,
          remarks: this.remarkStudent,
          locationID: 1,
          isDeleted: true,
          crtdUser: 'string',
          crtdDate: this.dateOfJoining ? this.dateOfJoining : '2021-12-14T04:15:58.109Z',
          lUpdUser: 'string',
          lUpdDate: '2021-12-14T04:15:58.109Z',
          studentBalAmount: 0,
          companyName: '',
          customerTypeID: 0,
          customerGroupID: this.recordTypesID,
          searchName: '',
          studentARBalance: 0,
          prospectID: 0,
          prospectCode: '',
          englishSchool: this.englishSchool,
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
          guardianID: this.guardianAccountID ? this.guardianAccountID : 0,
          sourceReferenceNote: this.sourceReferenceNote,
          ieltsBandScore: this.bandScore,
          studyPurposeID: this.studyPurposeID,
          relav: this.params,
        },
        teacher: {
          teacherGroupID: this.teacherGroupID ? this.teacherGroupID : 0,
          departmentID: 0,
          locationID: this.currentCenter,
          startDate: this.startDate ? this.startDate : null,
          endDate: this.endDate ? this.endDate : null,
          teacherSalaryTypeID: 0,
          currencyID: this.currency ? this.currency : '',
          salaryPerHours: this.salaryPerHours,
          salaryPerMonth: this.salaryPerMonth,
          passportNo: this.passPortNo,
          passportExpiredDate: this.expriresDatePassPort ? this.expriresDatePassPort : null,
          visaNo: this.visaNo,
          visaExpriedDate: this.expriresDateVisa ? this.expriresDateVisa : null,
          notes: '',
          inactive: true,
          crtdUser: 'string',
          crtdDate: '2021-12-14T04:15:58.109Z',
          lUpdUser: 'string',
          lUpdDate: '2021-12-14T04:15:58.109Z',
          teacherTypeID: this.teacherTypeID,
          searchName: '',
          scaleID: 0,
        },
      }
      account_managerment.createAccount(body).then(res => {
        if (res) {
          this.message = res.mess.message
          this.dialog = true
          this.checkSuccess = true
          setTimeout(() => {
            this.checkSuccess = false
            this.$router.push({ name: 'account-management-overview' })
          }, 3000)
          this.dialog = false
        }
      })
    },
    updateDob(event) {
      this.dob = event
    },
    updateDateOfJoining(event) {
      this.dateOfJoining = event
    },
    updateStartDate(event) {
      this.startDate = event
    },
    updateEndDate(event) {
      this.endDate = event
    },
    updateExpriresDatePassPort(event) {
      this.expriresDatePassPort = event
    },
    updateExpriresDateVisa(event) {
      this.expriresDateVisa = event
    },
    updateExpriresDateWorkPermit(event) {
      this.expriresDateWorkPermit = event
    },
    back() {
      window.history.back()
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped>
#create-account {
  .v-stepper__header {
    box-shadow: none;
  }
  .success {
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
  footer {
    box-shadow: 0px -2px 9px rgba(184, 184, 184, 0.1);
  }
}
</style>
