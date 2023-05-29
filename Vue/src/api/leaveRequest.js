import {
  ROOT,
  LEAVE_REQUEST_CREATE,
  LEAVE_REQUEST_EDIT,
  LEAVE_REQUEST_DELETE,
  LEAVE_REQUEST_GETALL,
  LEAVE_REQUEST_GET_BY_ID,
} from '@/api/constant.js'
import { handleResponse } from '@/api/handle-response'
import { requestOptions } from '@/api/request-options'

function createLeaveRequest(data) {
  return fetch(ROOT + LEAVE_REQUEST_CREATE, requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function updateLeaveRequest(data) {
  return fetch(ROOT + LEAVE_REQUEST_EDIT, requestOptions.put(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function deleteLeaveRequest(data) {
  return fetch(ROOT + LEAVE_REQUEST_DELETE + '?leaveRequestID=' + data, requestOptions.delete())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getLeaveRequestByID(data) {
  return fetch(ROOT + LEAVE_REQUEST_GET_BY_ID + '?leaveRequestID=' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getAllLeaveRequest() {
  return fetch(ROOT + LEAVE_REQUEST_GETALL, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

export const leaveRequest = {
  createLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
  getLeaveRequestByID,
  getAllLeaveRequest,
}
