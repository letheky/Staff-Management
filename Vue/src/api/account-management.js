import {
  ROOT,
  GET_ACCOUNT_TYPES,
  GET_USER_LIST,
  GET_LIST_SCHOOL,
  GET_LIST_COUNSELOR,
  GET_LIST_RECORD_TYPE,
  GET_LIST_SOURCE_REFERENCE,
  GET_LIST_GUARDIANS,
  GET_LIST_STUDY_PURPOSE,
  CREATE_ACCOUNT,
  GET_LIST_REFERRAL_BY,
  GET_LIST_GROUP_ADMIN,
  GET_LIST_ACCOUNT_TYPE,
  GET_USER_SEARCH,
  UPDATE_ROLE,
  GET_LIST_RELATIVE_TYPES,
  GET_LIST_CENTER,
  EXPORT_EXCEL_TEACHER_DETAIL_SALARY,
  EXPORT_EXCEL_TEACHER_SALARY,
  DEACTIVE_USER,
  UPDATE_AVATAR,
  RESET_PASSWORD,
  GET_USER_ABSENCE,
} from "@/api/constant.js";
import { handleResponse } from "@/api/handle-response";
import { requestOptions } from "@/api/request-options";
import store from "@/store/index";

function getAccountTypes() {
  return fetch(ROOT + GET_ACCOUNT_TYPES, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getUserList(locationId) {
  return fetch(
    ROOT + GET_USER_LIST + "?locationIds=" + locationId,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function resetPassword(data) {
  return fetch(ROOT + RESET_PASSWORD + data, requestOptions.post())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getListSchool(data) {
  return fetch(ROOT + GET_LIST_SCHOOL + "cityID=" + data, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getListCounselor() {
  return fetch(ROOT + GET_LIST_COUNSELOR, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getListRecordType() {
  return fetch(ROOT + GET_LIST_RECORD_TYPE, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getListSourceReference() {
  return fetch(ROOT + GET_LIST_SOURCE_REFERENCE, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getListGuardians() {
  return fetch(ROOT + GET_LIST_GUARDIANS, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getListStudyPurpose() {
  return fetch(ROOT + GET_LIST_STUDY_PURPOSE, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getListRelativeTypes() {
  return fetch(ROOT + GET_LIST_RELATIVE_TYPES, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function createAccount(data) {
  return fetch(ROOT + CREATE_ACCOUNT, requestOptions.postBody(data))
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getListReferralBy(locationId) {
  return fetch(
    ROOT + GET_LIST_REFERRAL_BY + "?locationIds=" + locationId,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getListGroupAdmin() {
  return fetch(ROOT + GET_LIST_GROUP_ADMIN, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getListAccountType() {
  return fetch(ROOT + GET_LIST_ACCOUNT_TYPE, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getListCenter() {
  return fetch(ROOT + GET_LIST_CENTER, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getUserSearch(data) {
  return fetch(ROOT + GET_USER_SEARCH + data, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function updateRole(data, params) {
  return fetch(ROOT + UPDATE_ROLE + data, requestOptions.put(params))
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}
function deactiveUser(userID, inactive) {
  return fetch(
    ROOT + DEACTIVE_USER + "userID=" + userID + "&inactive=" + inactive,
    requestOptions.putNoBody()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getUserAbsence(data) {
  return fetch(ROOT + GET_USER_ABSENCE + data, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function updateAvatar(image) {
  return fetch(ROOT + UPDATE_AVATAR, requestOptions.putImage(image))
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function exportExcelTeacherDetailSalary(data) {
  return fetch(
    ROOT + EXPORT_EXCEL_TEACHER_DETAIL_SALARY + data,
    requestOptions.get()
  ).then((handleResponse) => {
    if ([200].indexOf(handleResponse.status) !== -1) {
      var content = handleResponse.blob();
      if (!content) {
        store.commit("alert/display", {
          message: "Cannot export excel file!",
          error: true,
          success: false,
        });
        return Promise.reject();
      } else {
        return content;
      }
    } else {
      return Promise.reject();
    }
  });
}

function exportExcelTeacherSalary(param, data) {
  return fetch(
    ROOT + EXPORT_EXCEL_TEACHER_SALARY + "teacherID=" + param + "&" + data,
    requestOptions.get()
  ).then((handleResponse) => {
    if ([200].indexOf(handleResponse.status) !== -1) {
      var content = handleResponse.blob();
      if (!content) {
        store.commit("alert/display", {
          message: "Cannot export excel file!",
          error: true,
          success: false,
        });
        return Promise.reject();
      } else {
        return content;
      }
    } else {
      return Promise.reject();
    }
  });
}

export const account_managerment = {
  getAccountTypes,
  getUserList,
  getListSchool,
  getListCounselor,
  getListRecordType,
  getListSourceReference,
  getListGuardians,
  getListStudyPurpose,
  createAccount,
  getListReferralBy,
  getListGroupAdmin,
  getListAccountType,
  getUserSearch,
  updateRole,
  getListRelativeTypes,
  getListCenter,
  exportExcelTeacherDetailSalary,
  exportExcelTeacherSalary,
  deactiveUser,
  updateAvatar,
  resetPassword,
  getUserAbsence,
};
