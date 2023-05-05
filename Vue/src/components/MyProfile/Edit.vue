<template>
  <div id="center-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-6 pt-5 d-flex">
          <h2>
            <v-icon @click="back()">arrow_back_ios</v-icon>
          </h2>
          <h2 class="pt-1">Edit my information</h2>
          <div v-if="message == 'Update Successfull'" class="success">
            <v-alert
              :value="checkSuccess"
              transition="scale-transition"
              type="success"
              style="font-size: 14px; padding: 12px"
            >
              Update profile successfully!
            </v-alert>
          </div>
          <div v-else class="failed">
            <v-alert
              :value="checkFailed"
              transition="scale-transition"
              type="error"
              style="font-size: 14px; padding: 12px"
            >
              Update profile failed!
            </v-alert>
          </div>
        </div>
      </v-col>
    </v-row>
    <template v-if="isLoading">
      <div class="pa-6">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </div>
    </template>
    <template v-else>
      <v-row no-gutters>
        <v-col md="12">
          <div class="px-6">
            <v-form>
              <v-row>
                <v-col>
                  <!-- <template v-if="1 == 'admin'"> -->
                  <v-row>
                    <v-col>
                      <v-text-field
                        label="First name"
                        outlined
                        dense
                        v-model="firstName"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        label="Mid name"
                        outlined
                        dense
                        v-model="middleName"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        label="Last name"
                        outlined
                        dense
                        v-model="lastName"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-text-field
                    label="Full name"
                    outlined
                    dense
                    v-model="fullName"
                    disabled
                  ></v-text-field>
                  <!-- </template> -->
                  <label>Gender *</label>
                  <v-radio-group v-model="gender" required row class="mt-0">
                    <v-radio label="Male" value="M"> </v-radio>
                    <v-radio label="Female" value="F"> </v-radio>
                  </v-radio-group>
                  <date-picker
                    class="pb-4"
                    :model="dob"
                    @update:model="updateDob"
                    title="Date of birth"
                  ></date-picker>
                  <v-autocomplete
                    label="Country"
                    outlined
                    dense
                    :items="countries"
                    item-text="nationality"
                    item-value="nationalityID"
                    v-model="nationality"
                  ></v-autocomplete>
                  <v-row>
                    <v-col>
                      <v-autocomplete
                        label="Living City"
                        outlined
                        dense
                        :items="cities"
                        item-text="city"
                        item-value="cityID"
                        v-model="city"
                      ></v-autocomplete>
                    </v-col>
                    <v-col>
                      <v-autocomplete
                        label="Living district"
                        outlined
                        dense
                        :items="districts"
                        item-text="district"
                        item-value="districtID"
                        v-model="district"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>

                  <v-text-field
                    label="Living address"
                    maxlength="300"
                    outlined
                    dense
                    v-model="address"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    label="Home phone"
                    type="number"
                    outlined
                    dense
                    v-model="homePhone"
                  ></v-text-field>
                  <v-text-field
                    label="Mobile phone"
                    type="number"
                    outlined
                    dense
                    v-model="mobilePhone"
                  ></v-text-field>
                  <template>
                    <v-text-field
                      label="Email *"
                      :rules="emailRules"
                      outlined
                      dense
                      v-model="email"
                    ></v-text-field>
                  </template>
                </v-col>
              </v-row>
            </v-form>
          </div>
        </v-col>
      </v-row>
      <v-footer fixed absolute height="60" color="#fff" class="pl-10 pr-10">
        <v-row>
          <v-col>
            <v-btn
              outlined
              small
              elevation="0"
              color="error"
              height="36"
              class="pl-16 pr-16 mr-5"
              @click="back()"
              >Cancel</v-btn
            >
            <v-btn
              small
              elevation="0"
              color="secondary"
              height="36"
              class="pl-16 pr-16"
              @click="
                dialog = true
                save()
              "
              :disabled="!gender || !mobilePhone || !email"
              >Save</v-btn
            >
          </v-col>
        </v-row>
      </v-footer>
    </template>
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
            <b style="font-size: 1.5rem">Updating profile!</b><br />
            <span>Please wait...</span>
          </div>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { nationalities } from '@/api/nationalities.js'
import { my_profile } from '@/api/my-profile.js'
import dayjs from 'dayjs'
import DatePicker from '@/components/Utils/DatePicker.vue'

export default {
  components: {
    'date-picker': DatePicker,
  },
  data() {
    return {
      emailRules: [
        v =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || 'Email must be valid',
      ],
      gender: '',
      dob: '',
      nationality: '',
      city: '',
      district: '',
      address: '',
      homePhone: '',
      mobilePhone: '',
      email: '',
      firstName: '',
      fullName: '',
      lastName: '',
      middleName: '',
      userID: this.$route.params.userId,
      isLoading: false,
      countries: [],
      cities: [],
      currentUser: JSON.parse(localStorage.getItem('currentUser')),
      districts: [],
      status: [
        { label: 'Public', value: 1 },
        { label: 'Private', value: 0 },
      ],
      message: '',
      checkSuccess: false,
      checkFailed: false,
      dialog: false,
    }
  },
  watch: {
    city: function (newData) {
      nationalities.getDistrictsByCity(newData).then(res => {
        if (res) {
          this.districts = res
        }
      })
    },
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
  created() {
    this.init()
    if (this.currentUser.userInfo.accountTypeID === 1) {
      this.back()
    }
  },
  methods: {
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

      await my_profile.getDetailUserInfo(this.userID).then(res => {
        if (res) {
          this.gender = res.details.gender
          if (this.dob) {
            this.dob = this._dayjs(res.details.dob).format('YYYY-MM-DD')
          }
          this.nationality = res.details.nationalityID
          this.city = res.details.cityID
          this.district = res.details.districtID
          this.address = res.details.address
          this.homePhone = res.details.homePhone
          this.mobilePhone = res.details.mobilePhone
          this.email = res.details.email
          this.firstName = res.details.firstName
          this.fullName = res.details.fullName
          this.lastName = res.details.lastName
          this.middleName = res.details.middleName
        }
      })
      this.isLoading = false
    },
    back() {
      window.history.back()
    },
    save() {
      const body = {
        userID: this.userID,
        role: {
          locationID: 0,
          groupID: 0,
          accountTypeID: 0,
        },
        detail: {
          address: this.address,
          cityID: this.city,
          districtID: this.district,
          dob: this.dob,
          email: this.email,
          gender: this.gender,
          homePhone: this.homePhone,
          mobilePhone: this.mobilePhone,
          nationalityID: this.nationality,
          officePhone: '',
          firstName: this.firstName,
          fullName: this.fullName,
          lastName: this.lastName,
          middleName: this.middleName,
        },
        student: {
          hobbies: '',
          contactName: '',
          officePhone: '',
          motherName: '',
          motherPhone: '',
          fatherName: '',
          fatherPhone: '',
          counselorID: 0,
          entryDate: '2021-12-09T17:34:56.934Z',
          occupationID: 0,
          schoolID: 0,
          companyID: 0,
          contractID: 0,
          taxCode: 'xxxxxxxxxx',
          sourceID: 0,
          remarks: '',
          locationID: 0,
          isDeleted: true,
          lUpdUser: 'string',
          lUpdDate: '2021-12-09T17:34:56.934Z',
          studentBalAmount: 0,
          companyName: '',
          customerTypeID: 0,
          customerGroupID: 0,
          searchName: '',
          studentARBalance: 0,
          prospectID: 0,
          prospectCode: '',
          englishSchool: '',
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
          referralID: 0,
          englishSchoolTemp: '',
          schoolTemp: '',
          guardianID: 0,
          sourceReferenceNote: '',
          ieltsBandScore: 0,
          studyPurposeID: 0,
          relatives: [],
        },
        teacher: {
          teacherGroupID: 0,
          departmentID: 0,
          locationID: 0,
          startDate: '2021-12-09T17:34:56.934Z',
          endDate: '2021-12-09T17:34:56.934Z',
          teacherSalaryTypeID: 0,
          currencyID: 'VND',
          salaryPerHours: 0,
          salaryPerMonth: 0,
          passportNo: '',
          passportExpiredDate: '2021-12-09T17:34:56.934Z',
          visaNo: '',
          visaExpriedDate: '2021-12-09T17:34:56.934Z',
          notes: '',
          inactive: true,
          lUpdUser: 'string',
          lUpdDate: '2021-12-09T17:34:56.934Z',
          teacherTypeID: 0,
          searchName: '',
          scaleID: 0,
        },
      }
      my_profile.updateDetailUserInfo(body).then(res => {
        this.message = res.message
        if (res.message == 'Update Successfull') {
          this.dialog = true
          this.checkSuccess = true
          setTimeout(() => {
            this.checkSuccess = false
            this.$router.push({ name: 'my-profile' })
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
    updateDob(event) {
      this.dob = event
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped>
#center-management {
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
  .center-info {
    background: #faf9ff;
    border-radius: 6px;
    padding: 10px 24px;
    .item {
      border-bottom: 1px dashed #dadbe6;
      &:last-child {
        border: none;
      }
    }
  }
  footer {
    box-shadow: 0px -2px 9px rgba(184, 184, 184, 0.1);
  }
}
</style>
