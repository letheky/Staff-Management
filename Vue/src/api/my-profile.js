import {
  ROOT,
  STUDENT_CREATE,
  STUDENT_EDIT,
  STUDENT_GET_BY_USERID,
  ADMIN_CREATE,
  ADMIN_EDIT,
  ADMIN_GET_BY_USERID,
  INSTRUCTOR_CREATE,
  INSTRUCTOR_EDIT,
  INSTRUCTOR_GET_BY_USERID,
  USER_CHANGEPASSWORD,
} from '@/api/constant.js'
import { handleResponse } from '@/api/handle-response'
import { requestOptions } from '@/api/request-options'

function createDetailAdminInfo(data) {
  return fetch(ROOT + ADMIN_CREATE , requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function createDetailInstructorInfo(data) {
  return fetch(ROOT + INSTRUCTOR_CREATE , requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function createDetailStudentInfo(data) {
  return fetch(ROOT + STUDENT_CREATE , requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getDetailAdminInfo(data) {
  return fetch(ROOT + ADMIN_GET_BY_USERID + '?admin_userID=' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getDetailInstructorInfo(data) {
  return fetch(ROOT + INSTRUCTOR_GET_BY_USERID + '?instructor_userID=' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getDetailStudentInfo(data) {
  return fetch(ROOT + STUDENT_GET_BY_USERID + '?stu_userID=' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function updateDetailStudentInfo(data) {
  return fetch(ROOT + STUDENT_EDIT, requestOptions.put(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function updateDetailAdminInfo(data) {
  return fetch(ROOT + ADMIN_EDIT, requestOptions.put(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function updateDetailInstructorInfo(data) {
  return fetch(ROOT + INSTRUCTOR_EDIT, requestOptions.put(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function changePassword(data) {
  return fetch(ROOT + USER_CHANGEPASSWORD, requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}

export const my_profile = {
  createDetailAdminInfo,
  createDetailInstructorInfo,
  createDetailStudentInfo,

  getDetailAdminInfo,
  getDetailInstructorInfo,
  getDetailStudentInfo,

  updateDetailStudentInfo,
  updateDetailAdminInfo,
  updateDetailInstructorInfo,

  changePassword,
}
