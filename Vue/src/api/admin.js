import {
  ROOT,
  ADMIN_CREATE,
  ADMIN_EDIT,
  ADMIN_DELETE,
  ADMIN_GETALL,
  ADMIN_GET_BY_ID,
  ADMIN_GET_BY_USERID,
} from '@/api/constant.js'
import { handleResponse } from '@/api/handle-response'
import { requestOptions } from '@/api/request-options'

function createAdmin(data) {
  return fetch(ROOT + ADMIN_CREATE, requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function updateAdmin(data) {
  return fetch(ROOT + ADMIN_EDIT, requestOptions.put(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function deleteAdmin(data) {
  return fetch(ROOT + ADMIN_DELETE + '?adminID=' + data, requestOptions.delete())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getAdminByID(data) {
  return fetch(ROOT + ADMIN_GET_BY_ID + '?adminID=' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getAdminByUserID(data) {
  return fetch(ROOT + ADMIN_GET_BY_USERID + '?admin_userID=' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getAllAdmin() {
  return fetch(ROOT + ADMIN_GETALL , requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}


export const admin = {
    createAdmin,
    updateAdmin,
    deleteAdmin,
    getAdminByID,
    getAdminByUserID,
    getAllAdmin,
}
