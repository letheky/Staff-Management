import {
  ROOT,
  TEACHER_CREATE,
  TEACHER_EDIT,
  TEACHER_DELETE,
  TEACHER_GETALL,
  TEACHER_GET_BY_ID,
  // Teacher_GET_BY_USERID,
} from '@/api/constant.js'
import { handleResponse } from '@/api/handle-response'
import { requestOptions } from '@/api/request-options'

function createTeacher(data) {
  return fetch(ROOT + TEACHER_CREATE, requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function updateTeacher(data) {
  return fetch(ROOT + TEACHER_EDIT, requestOptions.put(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function deleteTeacher(data) {
  return fetch(ROOT + TEACHER_DELETE + '?teacherID=' + data, requestOptions.delete())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getTeacherByID(data) {
  return fetch(ROOT + TEACHER_GET_BY_ID + '?teacherID=' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
// function getTeacherByUserID(data) {
//   return fetch(ROOT + Teacher_GET_BY_USERID + '?Teacher_userID=' + data, requestOptions.get())
//     .then(handleResponse)
//     .then(data => {
//       return data
//     })
// }
function getAllTeacher() {
  return fetch(ROOT + TEACHER_GETALL, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

export const teacher = {
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherByID,
  // getTeacherByUserID,
  getAllTeacher,
}
