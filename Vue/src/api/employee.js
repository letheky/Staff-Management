import {
  ROOT,
  EMPLOYEE_CREATE,
  EMPLOYEE_EDIT,
  EMPLOYEE_DELETE,
  EMPLOYEE_GETALL,
  EMPLOYEE_GET_BY_ID,
  EMPLOYEE_GET_ACTIVE,
  EMPLOYEE_DEACTIVE,
} from '@/api/constant.js'
import { handleResponse } from '@/api/handle-response'
import { requestOptions } from '@/api/request-options'

function createEmployee(data) {
  return fetch(ROOT + EMPLOYEE_CREATE, requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function updateEmployee(data) {
  return fetch(ROOT + EMPLOYEE_EDIT, requestOptions.put(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function deactiveEmployee(data) {
  return fetch(ROOT + EMPLOYEE_DEACTIVE, requestOptions.put(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function deleteEmployee(data) {
  return fetch(ROOT + EMPLOYEE_DELETE + '?employeeID=' + data, requestOptions.delete())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getEmployeeByID(data) {
  return fetch(ROOT + EMPLOYEE_GET_BY_ID + '?employeeID=' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getAllEmployee() {
  return fetch(ROOT + EMPLOYEE_GETALL, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getAllActive() {
  return fetch(ROOT + EMPLOYEE_GET_ACTIVE, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

export const employee = {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeByID,
  getAllEmployee,
  deactiveEmployee,
  getAllActive,
}
