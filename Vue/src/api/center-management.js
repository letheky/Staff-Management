import {
  ROOT,
  GET_DETAIL_CENTER,
  GET_USER_BY_ROLE,
  LEAVE_ADMIN_ABSENCE,
  ADMIN_APPROVED_ABSENCE,
  GET_LIST_SHIFTS,
  LIST_TEACHER_AVAILABLE_TIME,
  LIST_FREE_TIME,
  ADD_COVER_TEACHER,
  NEW_OVERVIEW_MANAGEMENT,
  CREATE_NEW_MANAGEMENT,
  GET_LIST_DAY_OF_WEEK,
  GET_LIST_TEACHER_FREE_TIME,
  DELETE_NEW_MANAGEMENT,
  UPDATE_NEW_MANAGEMENT,
  TEACHER_SCALE,
  FUNCTION_ROLE,
  FEED_BACK_SEARCH_MANAGEMENT,
  FEED_BACK_DELETE_MANAGEMENT,
  FEED_BACK_DETAIL_MANAGEMENT,
  FEED_BACK_UPDATE_STATUS_MANAGEMENT,
} from "@/api/constant.js";
import { handleResponse } from "@/api/handle-response";
import { requestOptions } from "@/api/request-options";
import { CHANGE_STATUS_FEEDBACK, DELETE_FEEDBACK, FEEDBACK_CREATE_TO_CLASS, FEEDBACK_CREATE_TO_STUDENTS, GET_ALL_CENTER, GET_DETAIL_GENERAL_BY_ID, GET_FEEDBACK_BY_ADMIN, GET_FEEDBACK_BY_ID, GET_FEEDBACK_BY_STUDENT, GET_FEEDBACK_BY_TEACHER, SEND_FEEDBACK_DETAIL } from "./constant";

function getDetailCenter(data) {
  return fetch(
    ROOT + GET_DETAIL_CENTER + "?centerID=" + data,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getListShifts() {
  return fetch(ROOT + GET_LIST_SHIFTS, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}
function getDetailGeneralByID(generalID) {
  return fetch(ROOT + GET_DETAIL_GENERAL_BY_ID +`generalID=${generalID}`, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getListDayOfWeek() {
  return fetch(ROOT + GET_LIST_DAY_OF_WEEK, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function listTeacherAvailableTime(data) {
  return fetch(
    ROOT + LIST_TEACHER_AVAILABLE_TIME + "?" + data,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function listTeacherFreeTime(data) {
  return fetch(
    ROOT + GET_LIST_TEACHER_FREE_TIME + "?" + data,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getUserByRole(centerId, role) {
  return fetch(
    ROOT + GET_USER_BY_ROLE + "/" + centerId + "," + role,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function leaveAdminAbsence(fromTime, toTime, accountTypeID) {
  return fetch(
    ROOT +
      LEAVE_ADMIN_ABSENCE +
      "fromTime=" +
      fromTime +
      "&toTime=" +
      toTime +
      "&AccountTypeID=" +
      accountTypeID,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function adminApprovedAbsence(data, param) {
  return fetch(
    ROOT +
      ADMIN_APPROVED_ABSENCE +
      "leaveOfAbsenceID=" +
      data +
      "&status=" +
      param,
    requestOptions.put()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function listFreeTime(data) {
  return fetch(ROOT + LIST_FREE_TIME + data, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function addCoverTeacher(data) {
  return fetch(ROOT + ADD_COVER_TEACHER + data, requestOptions.post())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function addCoverTeacherMulti(params, data) {
  return fetch(
    ROOT + ADD_COVER_TEACHER + "scheduleID=" + params + "&" + data,
    requestOptions.post()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function NewsOverview(data) {
  return fetch(ROOT + NEW_OVERVIEW_MANAGEMENT + data, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function CreateNew(data) {
  return fetch(ROOT + CREATE_NEW_MANAGEMENT, requestOptions.postImage(data))
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function DeleteNew(data) {
  return fetch(ROOT + DELETE_NEW_MANAGEMENT + data, requestOptions.delete())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}
function deleteFeedback(generalID) {
  return fetch(ROOT + DELETE_FEEDBACK + `GeneralID=${generalID}`, requestOptions.delete())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}
function UpdateNew(data) {
  return fetch(ROOT + UPDATE_NEW_MANAGEMENT, requestOptions.putImage(data))
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function teacherScale(data) {
  return fetch(ROOT + TEACHER_SCALE + "teacherID=" + data, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function functionRole(data) {
  return fetch(ROOT + FUNCTION_ROLE + "roleID=" + data, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function feedBackSearch(data, param) {
  return fetch(
    ROOT +
      FEED_BACK_SEARCH_MANAGEMENT +
      "fromTime=" +
      data +
      "&" +
      "toTime=" +
      param,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function feedBackDelete(data) {
  return fetch(
    ROOT + FEED_BACK_DELETE_MANAGEMENT + "feedbackId=" + data,
    requestOptions.delete()
  ).then((data) => {
    return data;
  });
}

function feedBackDetail(data) {
  return fetch(
    ROOT + FEED_BACK_DETAIL_MANAGEMENT + "feedbackId=" + data,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function updateStatusFeedBack(data) {
  return fetch(
    ROOT + FEED_BACK_UPDATE_STATUS_MANAGEMENT,
    requestOptions.put(data)
  ).then((data) => {
    return data;
  });
}
function changeStatusFeedback(status , feedbackID) {
  return fetch(
    ROOT + CHANGE_STATUS_FEEDBACK + `status=${status}&generalID=${feedbackID}`,
    requestOptions.put()
  ).then((data) => {
    return data;
  });
}
function createFeedBackToStudent(data) {
  return fetch(ROOT + FEEDBACK_CREATE_TO_STUDENTS , requestOptions.postBody(data))
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function sendFeedBackToClass(data) {
  return fetch(ROOT + FEEDBACK_CREATE_TO_CLASS , requestOptions.postBody(data))
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}
function sendFeedBackDetail(data) {
  return fetch(ROOT + SEND_FEEDBACK_DETAIL , requestOptions.postBody(data))
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}
function getAllCenter() {
  return fetch(ROOT + GET_ALL_CENTER, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}
function getFeedbackByID(GeneralID , fbCount) {
  return fetch(ROOT + GET_FEEDBACK_BY_ID+`GeneralID=${GeneralID}&fbCount=${fbCount}`, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}
function getFeedbackByStudent() {
  return fetch(ROOT + GET_FEEDBACK_BY_STUDENT, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}
function getFeedBackByAdmin(data) {
  return fetch(ROOT + GET_FEEDBACK_BY_ADMIN , requestOptions.postBody(data))
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getFeedbackByTeacher() {
  return fetch(ROOT + GET_FEEDBACK_BY_TEACHER, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}
export const center_managerment = {
  getDetailCenter,
  getFeedbackByTeacher,
  getAllCenter,
  getFeedBackByAdmin , 
  sendFeedBackDetail , 
  sendFeedBackToClass,
  createFeedBackToStudent,
  getUserByRole,
  getFeedbackByID , 
  getFeedbackByStudent,
  leaveAdminAbsence,
  adminApprovedAbsence,
  getListShifts,
  changeStatusFeedback,
  listTeacherAvailableTime,
  listFreeTime,
  addCoverTeacher,
  addCoverTeacherMulti,
  NewsOverview,
  CreateNew,
  getListDayOfWeek,
  listTeacherFreeTime,
  DeleteNew,
  UpdateNew,
  teacherScale,
  functionRole,
  deleteFeedback,
  feedBackSearch,
  feedBackDelete,
  feedBackDetail,
  updateStatusFeedBack,
  getDetailGeneralByID
};
