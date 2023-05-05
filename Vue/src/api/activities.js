import {
  CREATE_ACTIVITY,
  CREATE_REGISTER_ACTIVITY,
  CREATE_TYPE_ACTIVITY,
  DELETE_ACTIVITY,
  GET_ACTIVITY_BY_ID,
  GET_LIST_ACTIVITY_TYPE,
  GET_LIST_CLASS,
  GET_LIST_REGISTER,
  GET_LIST_STUDENT_BY_CENTER,
  GET_TARGET_ACTIVITY,
  GET_ACTIVITY_BY_STUDENT,
  GET_ACTIVITY_BY_REGISTRATION,
  ROOT,
  SEARCH_LIST_ACTICITY,
  UPDATE_ACTIVITY,
  UPDATE_ACTYVITY_TYPE,
  UPDATE_REGISTER_ACTIVITY,
  UPDATE_TARGET_ACTIVIY,
  UPDATE_REGISTER_STATUS,
  UPDATE_STUDENT_REMARK
} from './constant'
import { handleResponse, handleResponseText } from './handle-response'
import { requestOptions } from './request-options'

function getListType() {
  return fetch(ROOT + GET_LIST_ACTIVITY_TYPE, requestOptions.get())
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function getActivityByID(id) {
  return fetch(ROOT + GET_ACTIVITY_BY_ID + `activityID=${id}`, requestOptions.get())
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function updateActivity(data) {
  return fetch(ROOT + UPDATE_ACTIVITY, requestOptions.put(data))
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function updateStudentRemark(id,remark) {
  return fetch(ROOT + UPDATE_STUDENT_REMARK+ `activityRegistrationID=${id}&note=${remark}`, requestOptions.put())
    .then(handleResponse)
    .then(res => {
      return res
    })
}

function updateRegisterStatus(data) {
  return fetch(ROOT + UPDATE_REGISTER_STATUS, requestOptions.put(data))
    .then(handleResponse)
    .then(res => {
      return res
    })
}

function createType(data) {
  return fetch(ROOT + CREATE_TYPE_ACTIVITY, requestOptions.postBody(data))
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function createActivity(data) {
  return fetch(ROOT + CREATE_ACTIVITY, requestOptions.postBody(data))
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function updateActivityType(data) {
  return fetch(ROOT + UPDATE_ACTYVITY_TYPE, requestOptions.put(data))
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function getListActivitiesSearch(locationIDs) {
  return fetch(ROOT + SEARCH_LIST_ACTICITY + `locationIds=${locationIDs}`, requestOptions.get())
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function deleteActivity(id) {
  return fetch(ROOT + DELETE_ACTIVITY + `activityId=${id}`, requestOptions.delete())
    .then(handleResponse)
    .then(res => {
      return res
    })
}

function createRegister(data) {
  return fetch(ROOT + CREATE_REGISTER_ACTIVITY, requestOptions.postBody(data))
    .then(handleResponseText)
    .then(res => {
      return res
    })
}
function getListStudentByCenter(locationID) {
  return fetch(
    ROOT + GET_LIST_STUDENT_BY_CENTER + `locationIds=${locationID}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function getListRegis(locationIDs, activityType) {
  return fetch(
    ROOT + GET_LIST_REGISTER + `locationIds=${locationIDs}&activityTypeID=${activityType}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function getListClass(studentID) {
  return fetch(ROOT + GET_LIST_CLASS + `studentID=${studentID}`, requestOptions.get())
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function getListTarget(activityID) {
  return fetch(ROOT + GET_TARGET_ACTIVITY + `activityID=${activityID}`, requestOptions.get())
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function getActivityByStudent(studentID, registrationStatus) {
  return fetch(
    ROOT +
      GET_ACTIVITY_BY_STUDENT +
      `studentID=${studentID}&registrationStatus=${registrationStatus}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function getActivityByRegistrationID(activityRegistrationID) {
  return fetch(
    ROOT + GET_ACTIVITY_BY_REGISTRATION + `activityRegistrationID=${activityRegistrationID}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function updateRegister(data) {
  return fetch(ROOT + UPDATE_REGISTER_ACTIVITY, requestOptions.put(data))
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function updateTarget(data) {
  return fetch(ROOT + UPDATE_TARGET_ACTIVIY, requestOptions.put(data))
    .then(handleResponse)
    .then(res => {
      return res
    })
}
export const activities = {
  getListType,
  updateRegister,
  createType,
  getActivityByID,
  getListClass,
  updateTarget,
  getListTarget,
  deleteActivity,
  getListRegis,
  getListStudentByCenter,
  updateActivity,
  createRegister,
  createActivity,
  updateActivityType,
  getListActivitiesSearch,
  updateRegisterStatus,
  getActivityByStudent,
  getActivityByRegistrationID,
  updateStudentRemark,
}
