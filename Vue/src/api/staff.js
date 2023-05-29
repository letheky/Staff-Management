import {
  ROOT,
  STAFF_CREATE,
  STAFF_EDIT,
  STAFF_DELETE,
  STAFF_GETALL,
  STAFF_GET_BY_ID,
  // Staff_GET_BY_USERID,
} from '@/api/constant.js'
import { handleResponse } from '@/api/handle-response'
import { requestOptions } from '@/api/request-options'

function createStaff(data) {
  return fetch(ROOT + STAFF_CREATE, requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function updateStaff(data) {
  return fetch(ROOT + STAFF_EDIT, requestOptions.put(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function deleteStaff(data) {
  return fetch(ROOT + STAFF_DELETE + '?staffID=' + data, requestOptions.delete())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getStaffByID(data) {
  return fetch(ROOT + STAFF_GET_BY_ID + '?staffID=' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
// function getStaffByUserID(data) {
//   return fetch(ROOT + Staff_GET_BY_USERID + '?Staff_userID=' + data, requestOptions.get())
//     .then(handleResponse)
//     .then(data => {
//       return data
//     })
// }
function getAllStaff() {
  return fetch(ROOT + STAFF_GETALL, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

export const staff = {
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffByID,
  // getStaffByUserID,
  getAllStaff,
}
