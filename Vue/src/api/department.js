import {
  ROOT,
  DEPARTMENT_CREATE,
  DEPARTMENT_EDIT,
  DEPARTMENT_DELETE,
  DEPARTMENT_GETALL,
  DEPARTMENT_GET_BY_ID,
} from '@/api/constant.js'
import { handleResponse } from '@/api/handle-response'
import { requestOptions } from '@/api/request-options'

function createDepartment(data) {
  return fetch(ROOT + DEPARTMENT_CREATE, requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function updateDepartment(data) {
  return fetch(ROOT + DEPARTMENT_EDIT, requestOptions.put(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function deleteDepartment(data) {
  return fetch(ROOT + DEPARTMENT_DELETE + '?departmentID=' + data, requestOptions.delete())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getDepartmentByID(data) {
  return fetch(ROOT + DEPARTMENT_GET_BY_ID + '?departmentID=' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getAllDepartment() {
  return fetch(ROOT + DEPARTMENT_GETALL, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

export const department = {
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentByID,
  getAllDepartment,
}
