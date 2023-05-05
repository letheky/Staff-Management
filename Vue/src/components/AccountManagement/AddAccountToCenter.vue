<template>
  <div id="add-account-to-center">
    <!-- Breadcrumb -->
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-6 pt-5 d-flex justify-space-between">
          <h2 class="d-flex">
            <v-icon @click="back()">arrow_back_ios</v-icon>
            <div class="d-flex align-center">Add account to center</div>
          </h2>
          <div class="success">
            <v-alert
              :value="checkSuccess"
              transition="scale-transition"
              type="success"
              style="font-size: 14px; padding: 12px"
            >
              Create account successfully
            </v-alert>
          </div>
        </div>
        <h3 class="pl-12">Select account</h3>
        <v-col md="8">
          <div class="pl-10 d-flex align-center">
            <v-menu :value="clickSearch" offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  label="User account"
                  v-model="user_account"
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  @click="clickSearch = !clickSearch"
                  prepend-inner-icon="search"
                ></v-text-field>
              </template>
              <v-list>
                <div v-if="user_account && listUserAccounts.length > 0">
                  <v-list-item
                    v-for="(listUserAccount, index) in listUserAccounts"
                    :key="index"
                    link
                  >
                    <v-list-item-title
                      @click="
                        user_account = listUserAccount.userName;
                        user_accountID = listUserAccount.userID;
                        user_account === listUserAccount.userName
                          ? selectAccount()
                          : '';
                      "
                      v-if="listUserAccounts"
                      style="cursor: pointer"
                      >{{ listUserAccount.userName }}</v-list-item-title
                    >
                  </v-list-item>
                </div>
                <div v-else>
                  <v-list-item>
                    <v-list-item-title>No data available</v-list-item-title>
                  </v-list-item>
                </div>
              </v-list>
            </v-menu>
            <span class="pl-5 pb-2"
              >Want to create a new account?
              <router-link :to="{ name: 'account-management-add-new' }"
                ><a class="font-weight-bold">Create new account</a></router-link
              ></span
            >
          </div>
        </v-col>
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
          <div class="pa-6 pt-0">
            <v-row no-gutters class="user-info">
              <v-col md="2">
                <div class="d-flex align-center justify-center fill-height">
                  <v-avatar class="" size="125">
                    <i class="isax isax-profile-circle fs-125"></i>
                  </v-avatar>
                </div>
              </v-col>
              <v-col md="10">
                <v-row no-gutters>
                  <v-col md="4">
                    <div class="pa-6 list-info">
                      <div class="item">
                        <div>User name</div>
                        <div v-if="userDetailInfo.details">
                          {{ userDetailInfo.details.userName }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Full name</div>
                        <div v-if="userDetailInfo.details">
                          {{ userDetailInfo.details.fullName }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Gender</div>
                        <div v-if="userDetailInfo.details">
                          {{
                            userDetailInfo.details.gender === "M"
                              ? "Male"
                              : userDetailInfo.details.gender === "F"
                              ? "Female"
                              : ""
                          }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Date of birth</div>
                        <div v-if="userDetailInfo.details">
                          {{
                            _dayjs(userDetailInfo.details.dob).format(
                              "DD/MM/YYYY"
                            )
                          }}
                        </div>
                      </div>
                      <div class="border-vertical"></div>
                    </div>
                  </v-col>

                  <v-col md="4">
                    <div class="pa-6 list-info">
                      <div class="item">
                        <div>Home phone</div>
                        <div v-if="userDetailInfo.details">
                          {{ userDetailInfo.details.homePhone }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Mobile</div>
                        <div v-if="userDetailInfo.details">
                          {{ userDetailInfo.details.mobilePhone }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Email</div>
                        <div v-if="userDetailInfo.details">
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
                        <div v-if="userDetailInfo.details">
                          {{ userDetailInfo.details.nationality }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Living address</div>
                        <div v-if="userDetailInfo.details">
                          {{ userDetailInfo.details.address }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Living city</div>
                        <div v-if="userDetailInfo.details">
                          {{ userDetailInfo.details.city }}
                        </div>
                      </div>
                      <div class="item">
                        <div>Living district</div>
                        <div v-if="userDetailInfo.details">
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
      <div class="pa-12 pt-0 pb-3">
        <h3 style="color: #393a5c !important" class="mb-5">
          Select account type
        </h3>
        <v-row>
          <v-col class="col-md-6">
            <v-select
              label="Select account type"
              v-model="accountType"
              :items="accountTypes"
              item-text="accountTypeName"
              item-value="accountTypeID"
              :disabled="checkExistAccountType"
              outlined
            ></v-select>
          </v-col>
          <v-col class="col-md-6" v-if="accountType === 5">
            <v-select
              label="Select group"
              v-model="group"
              :items="groups"
              item-text="groupName"
              item-value="groupName"
              outlined
            ></v-select>
          </v-col>
        </v-row>
      </div>
      <h3 style="color: #393a5c !important" class="mb-3 pl-12">
        More information
      </h3>
      <v-row class="pa-12 pt-0" v-if="accountType === 1">
        <v-col class="col-md-6">
          <v-select
            label="Pri./ Sec. School"
            v-model="priSchool"
            :items="priSchools"
            item-value="school"
            item-text="school"
            outlined
          ></v-select>
          <v-text-field
            label="English school"
            v-model="englishSchool"
            outlined
          ></v-text-field>
          <v-select
            label="Counselor"
            v-model="counselor"
            :items="counselors"
            item-text="counselorName"
            item-value="counselorName"
            outlined
          ></v-select>
          <v-select
            label="Record type"
            v-model="recordType"
            :items="recordTypes"
            item-text="customerGroupName"
            item-value="customerGroupID"
            outlined
          ></v-select>
          <v-select
            label="Referral by"
            v-model="referralBy"
            :items="referralBys"
            item-text="userName"
            item-value="userName"
            outlined
          ></v-select>
          <v-select
            label="Source reference"
            v-model="sourceReference"
            :items="sourceReferences"
            item-text="source"
            item-value="sourceID"
            outlined
          ></v-select>
          <v-text-field
            label="Source reference note"
            v-model="sourceReferenceNote"
            outlined
          ></v-text-field>
          <v-text-field
            label="Date of Joining"
            v-model="dateOfJoining"
            type="date"
            outlined
          ></v-text-field>
          <v-text-field
            label="Remark"
            v-model="remarkStudent"
            outlined
          ></v-text-field>
          <v-select
            label="Study Purpose"
            v-model="studyPurpose"
            :items="studyPurposes"
            item-text="studyPurposeName"
            item-value="studyPurposeName"
            outlined
          ></v-select>
          <v-text-field
            label="IELTS Band Score"
            v-model="bandScore"
            type="number"
            outlined
            class="mb-5"
          ></v-text-field>
        </v-col>
        <v-col class="col-md-6">
          <h3 style="color: #393a5c !important">Guardian</h3>
          <v-checkbox label="Have guardian" v-model="guardian"></v-checkbox>
          <v-select
            label="Guardian account"
            v-model="guardianAccount"
            :items="guardianAccounts"
            item-value="guardianID"
            item-text="guardianName"
            outlined
          ></v-select>
          <v-text-field
            label="Guardian name"
            v-model="guardianName"
            :disabled="true"
            outlined
          ></v-text-field>
          <v-text-field
            label="Guardian phone"
            v-model="guardianPhone"
            :disabled="true"
            outlined
          ></v-text-field>
          <v-text-field
            label="Guardian email"
            v-model="guardianEmail"
            :disabled="true"
            outlined
          ></v-text-field>
          <h3 style="color: #393a5c !important" class="mb-2">Relative</h3>
          <v-row>
            <v-col>
              <v-text-field
                label="OrderStudentCode - Name"
                v-model="orderStudentCodeName"
                outlined
              ></v-text-field
            ></v-col>
            <v-col>
              <v-text-field
                label="RelativeType"
                v-model="relativeType"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-btn
            elevation="0"
            height="36"
            class="pl-4 pr-4"
            color="primary"
            width="100%"
          >
            Add relative
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="accountType === 4" class="pa-12 pt-0">
        <v-col class="col-md-6">
          <v-select
            label="Teacher group"
            v-model="teacherGroup"
            :items="teacherGroups"
            item-value="teacherGroup"
            item-text="teacherGroup"
            outlined
          ></v-select>
          <v-select
            label="Teacher type"
            v-model="teacherType"
            :items="teacherTypes"
            item-text="teacherType"
            item-value="teacherType"
            outlined
          ></v-select>
          <v-text-field
            label="Start date"
            v-model="startDate"
            type="date"
            outlined
          ></v-text-field>
          <v-text-field
            label="End date"
            v-model="endDate"
            type="date"
            outlined
          ></v-text-field>
          <v-select
            label="Teacher Rate"
            v-model="teacherRate"
            :items="teacherRates"
            item-value="scaleName"
            item-text="scaleName"
            outlined
          ></v-select>
          <v-text-field
            label="Contarct labour No."
            v-model="contractLabourNo"
            type="text"
            outlined
          ></v-text-field>
          <v-select
            label="Salary type"
            v-model="salaryType"
            :items="salaryTypes"
            item-text="teacherSalaryType"
            item-value="teacherSalaryType"
            outlined
          ></v-select>
          <v-text-field
            label="Salary per hours"
            v-model="salaryPerHours"
            type="number"
            outlined
          ></v-text-field>
          <v-text-field
            label="Salary per month"
            v-model="salaryPerMonth"
            type="number"
            outlined
          ></v-text-field>
          <v-select
            label="Currency"
            v-model="currency"
            :items="currencies"
            item-value="currencyID"
            item-text="currencyID"
            class="mb-5"
            outlined
          ></v-select>
        </v-col>
        <v-col class="col-md-6">
          <v-text-field
            label="Passport No."
            v-model="passPortNo"
            type="text"
            outlined
          ></v-text-field>
          <v-text-field
            label="Passport Exprires Date"
            v-model="expriresDatePassPort"
            type="date"
            outlined
          ></v-text-field>
          <v-text-field
            label="Visa No."
            v-model="visaNo"
            type="text"
            outlined
          ></v-text-field>
          <v-text-field
            label="Visa Exprires Date"
            v-model="expriresDateVisa"
            type="date"
            outlined
          ></v-text-field>
          <v-text-field
            label="Work Permit No."
            v-model="workPermitNo"
            type="text"
            outlined
          ></v-text-field>
          <v-text-field
            label="Work Permit Exprires Date"
            v-model="expriresDateWorkPermit"
            type="date"
            outlined
          ></v-text-field>
          <v-text-field
            label="Remark"
            v-model="remarkTeacher"
            type="text"
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="accountType === 5" class="pa-12 pt-0">
        <v-col class="col-md-6">
          <v-text-field
            label="Remark"
            v-model="remarkTeacher"
            type="text"
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="accountType === 2" class="pa-12 pt-0">
        <v-col class="col-md-6">
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
        </v-col>
      </v-row>
    </template>
    <v-footer fixed absolute height="60" color="#fff" class="pl-10 pr-10">
      <v-row>
        <v-col class="d-flex justify-end">
          <v-btn
            outlined
            small
            elevation="0"
            color="error"
            height="36"
            class="pl-6 pr-6 mr-3"
            @click="cancel()"
            >Cancel</v-btn
          >
          <v-btn
            elevation="0"
            height="36"
            class="pl-4 pr-4"
            color="primary"
            @click="addAccount()"
          >
            Add account
          </v-btn>
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script>
import { account_managerment } from "@/api/account-management.js";
import { teacher_information } from "@/api/teacher-information.js";
import { my_profile } from "@/api/my-profile.js";
import dayjs from "dayjs";
export default {
  components: {},
  data() {
    return {
      clickSearch: false,
      isLoading: false,
      countries: [],
      cities: [],
      districts: [],
      status: [
        { label: "Public", value: 1 },
        { label: "Private", value: 0 },
      ],
      accountTypes: [],
      groups: [],
      priSchools: [],
      counselors: [],
      recordTypes: [],
      referralBys: [],
      sourceReferences: [],
      studyPurposes: [],
      guardianAccounts: [],
      teacherGroups: [],
      teacherTypes: [],
      teacherRates: [],
      salaryTypes: [],
      currencies: [],
      accountType: null,
      items: [
        { title: "Click Me 1" },
        { title: "Click Me 2" },
        { title: "Click Me 3" },
        { title: "Click Me 4" },
      ],
      user_account: "",
      group: "",
      priSchool: "",
      englishSchool: "",
      counselor: "",
      recordType: "",
      referralBy: "",
      sourceReference: "",
      sourceReferenceNote: "",
      dateOfJoining: "",
      remarkStudent: "",
      studyPurpose: "",
      bandScore: "",
      guardianAccount: "",
      guardianName: "",
      guardianPhone: "",
      guardianEmail: "",
      orderStudentCodeName: "",
      relativeType: "",
      teacherGroup: "",
      teacherType: "",
      startDate: "",
      endDate: "",
      teacherRate: "",
      contractLabourNo: "",
      salaryType: "",
      salaryPerHours: "",
      salaryPerMonth: "",
      currency: "",
      passPortNo: "",
      expriresDatePassPort: "",
      visaNo: "",
      expriresDateVisa: "",
      workPermitNo: "",
      expriresDateWorkPermit: "",
      remarkTeacher: "",
      guardian: false,
      acceptEmail: "",
      acceptSMS: "",
      userDetailInfo: [],
      currentCenter: JSON.parse(localStorage.getItem("currentCenter")),
      listUserAccounts: [],
      listAccount: [],
      user_accountID: "",
      checkExistAccountType: true,
      counselorID: "",
      priSchoolID: "",
      recordTypesID: "",
      referralID: "",
      sourceReferenceID: "",
      studyPurposeID: "",
      teacherGroupID: "",
      teacherTypeID: "",
      groupID: "",
      checkSuccess: false,
      closeOnContentClick: true,
      userList: [],
      locationIds: [],
      centerList: JSON.parse(localStorage.getItem("currentUser"))
        .locationPermissions,
    };
  },
  watch: {
    user_account: function (value) {
      account_managerment.getUserSearch(value).then((res) => {
        if (res) {
          this.clickSearch = true;
          this.listUserAccounts = [];
          res.forEach((x) => {
            if (x.locationID != this.currentCenter) {
              this.listUserAccounts.push(x);
            }
          });
        }
      });
    },
    "userDetailInfo.details.cityID": function (value) {
      if (value) {
        account_managerment.getListSchool(value).then((res) => {
          if (res) {
            this.priSchools = res;
          }
        });
      }
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await account_managerment.getListAccountType().then((res) => {
        if (res) {
          this.accountTypes = res;
        }
      });
      await account_managerment.getListCounselor().then((res) => {
        if (res) {
          this.counselors = res;
        }
      });
      await account_managerment.getListRecordType().then((res) => {
        if (res) {
          this.recordTypes = res;
        }
      });
      await account_managerment.getListSourceReference().then((res) => {
        if (res) {
          this.sourceReferences = res;
        }
      });
      await account_managerment.getListGuardians().then((res) => {
        if (res) {
          this.guardianAccounts = res;
        }
      });
      await account_managerment.getListStudyPurpose().then((res) => {
        if (res) {
          this.studyPurposes = res;
        }
      });
      await account_managerment
        .getListReferralBy(this.currentCenter)
        .then((res) => {
          if (res) {
            this.referralBys = res.salary;
          }
        });
      await teacher_information.getListTeacherGroup().then((res) => {
        if (res) {
          this.teacherGroups = res;
        }
      });
      await teacher_information.getListTeacherType().then((res) => {
        if (res) {
          this.teacherTypes = res;
        }
      });
      await teacher_information.getListTeacherCurrency().then((res) => {
        if (res) {
          this.currencies = res;
        }
      });
      await account_managerment.getListGroupAdmin().then((res) => {
        if (res) {
          this.groups = res;
        }
      });
      await account_managerment.getListAccountType().then((res) => {
        if (res) {
          this.accountTypes = res;
        }
      });
      this.centerList.forEach((x) => {
        this.locationIds.push(x.locationID);
      });
      await account_managerment.getUserList(this.locationIds).then((res) => {
        if (res.mess.message == "Ok") {
          this.userList = res.salary;
        }
      });
      await teacher_information.getListTeacherRate().then((res) => {
        if (res) {
          this.teacherRates = res;
        }
      });
      await teacher_information.getListTeacherSalaryTypes().then((res) => {
        if (res) {
          this.salaryTypes = res;
        }
      });
    },
    selectAccount() {
      if (this.user_accountID) {
        this.checkExistAccountType = false;
        my_profile.getDetailUserInfo(this.user_accountID).then((res) => {
          if (res) {
            this.userDetailInfo = res;
          }
          this.userDetailInfo.role.forEach((x) => {
            if (x.locationID === this.currentCenter) {
              this.accountType = x.accountTypeID;
              this.checkExistAccountType = true;
            }
          });
        });
      }
    },
    addAccount() {
      this.counselors.forEach((x) => {
        x.counselorName == this.counselor
          ? (this.counselorID = x.counselorID)
          : "";
      });
      this.priSchools.forEach((x) => {
        x.school == this.priSchool ? (this.priSchoolID = x.schoolID) : "";
      });
      this.recordTypes.forEach((x) => {
        x.customerGroupName == this.recordType
          ? (this.recordTypesID = x.customerGroupID)
          : "";
      });
      this.referralBys.forEach((x) => {
        x.userName == this.referralBy ? (this.referralID = x.userID) : "";
      });
      this.sourceReferences.forEach((x) => {
        x.source == this.sourceReference
          ? (this.sourceReferenceID = x.sourceID)
          : "";
      });
      this.studyPurposes.forEach((x) => {
        x.studyPurposeName == this.studyPurpose
          ? (this.studyPurposeID = x.studyPurposeID)
          : "";
      });
      this.teacherGroups.forEach((x) => {
        x.teacherGroup == this.teacherGroup
          ? (this.teacherGroupID = x.teacherGroupID)
          : "";
      });
      this.teacherTypes.forEach((x) => {
        x.teacherType == this.teacherType
          ? (this.teacherTypeID = x.teacherTypeID)
          : "";
      });
      this.groups.forEach((x) => {
        x.groupName === this.group ? (this.groupID = x.groupID) : "";
      });
      let updaterole = [
        {
          locationID: this.currentCenter,
          groupID: this.groupID ? this.groupID : 0,
          accountTypeID: this.accountType ? this.accountType : 0,
        },
      ];
      account_managerment
        .updateRole(this.user_accountID, updaterole)
        .then((res) => {
          console.log(res);
        });
      let body = {
        userID: this.user_accountID,
        detail: {
          firstName: this.userDetailInfo.details.firstName,
          middleName: this.userDetailInfo.details.middleName,
          lastName: this.userDetailInfo.details.lastName,
          fullName: this.userDetailInfo.details.fullName,
          dob: this.userDetailInfo.details.dob,
          gender: this.userDetailInfo.details.gender,
          nationalityID: this.userDetailInfo.details.nationalityID,
          address: this.userDetailInfo.details.address,
          districtID: this.userDetailInfo.details.districtID,
          cityID: this.userDetailInfo.details.cityID,
          email: this.userDetailInfo.details.email,
          homePhone: this.userDetailInfo.details.homePhone,
          mobilePhone: this.userDetailInfo.details.mobilePhone,
          officePhone: this.userDetailInfo.details.officePhone
            ? this.userDetailInfo.details.officePhone
            : "",
        },
        student: {
          hobbies: "",
          contactName: "",
          motherName: "",
          motherPhone: "",
          fatherName: "",
          fatherPhone: "",
          counselorID: this.counselorID,
          entryDate: this.dateOfJoining
            ? this.dateOfJoining
            : "2021-12-17T03:49:21.785Z",
          occupationID: 0,
          schoolID: this.priSchoolID,
          companyID: 0,
          contractID: 0,
          taxCode: "xxxxxxxxxx",
          sourceID: this.sourceReference,
          remarks: this.remarkStudent,
          locationID: 0,
          isDeleted: true,
          lUpdUser: "string",
          lUpdDate: "2021-12-17T03:49:21.785Z",
          studentBalAmount: 0,
          companyName: "",
          customerTypeID: 0,
          customerGroupID: this.recordTypesID,
          searchName: "",
          studentARBalance: 0,
          prospectID: 0,
          prospectCode: "",
          englishSchool: this.englishSchool ? this.englishSchool : "",
          englishBook: "",
          psClass: "",
          agencyID: 0,
          acceptReceiveEmail: true,
          acceptReceiveSMS: true,
          identification: "",
          passport: "",
          channelID: 0,
          oldStudentCode: "",
          oldStudentID: 0,
          isFirstSteps: true,
          referralID: this.referralID,
          englishSchoolTemp: "",
          schoolTemp: "",
          guardianID: this.guardianAccount ? this.guardianAccount : 0,
          sourceReferenceNote: this.sourceReferenceNote,
          ieltsBandScore: this.bandScore,
          studyPurposeID: this.studyPurposeID,
          relatives: [
            {
              relativeID: 0,
              keyStudentID: 0,
              foreignStudentID: 0,
              relativeTypeID: 0,
            },
          ],
        },
        teacher: {
          teacherGroupID: this.teacherGroupID ? this.teacherGroupID : 0,
          departmentID: 0,
          locationID: 0,
          startDate: "2021-12-17T03:49:21.785Z",
          endDate: "2021-12-17T03:49:21.785Z",
          teacherSalaryTypeID: 0,
          currencyID: "VND",
          salaryPerHours: 0,
          salaryPerMonth: 0,
          passportNo: "",
          passportExpiredDate: "2021-12-17T03:49:21.785Z",
          visaNo: "",
          visaExpriedDate: "2021-12-17T03:49:21.785Z",
          notes: "",
          inactive: true,
          lUpdUser: "string",
          lUpdDate: "2021-12-17T03:49:21.785Z",
          teacherTypeID: this.teacherTypeID ? this.teacherTypeID : 0,
          searchName: "",
          scaleID: 0,
        },
      };
      my_profile.updateDetailUserInfo(body).then((res) => {
        if (res.message === "Update Successfull") {
          this.checkSuccess = true;
          setTimeout(() => {
            this.checkSuccess = false;
            this.$router.push({ name: "account-management-overview" });
          }, 1000);
        }
      });
    },
    back() {
      window.history.back();
    },
    cancel() {
      this.$router.push({
        name: "account-management-overview",
      });
    },
    _dayjs: dayjs,
  },
};
</script>
<style lang="scss" scoped>
#add-account-to-center {
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
        background: url(~@/assets/images/line-vertical.png) no-repeat bottom
          center;
      }
    }
  }
  footer {
    box-shadow: 0px -2px 9px rgba(184, 184, 184, 0.1);
  }
}
</style>
