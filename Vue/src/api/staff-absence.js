import {
  ROOT,
  LEAVE_STAFF_ABSENCE,
  DELETE_STAFF_ABSENCE,
  VIEW_STAFF_ABSENCE,
  CREATE_STAFF_ABSENCE,
  UPDATE_STAFF_ABSENCE,
  APPROVE_OR_REJECT_ABSENCE,
} from '@/api/constant.js'
import { handleResponse } from '@/api/handle-response'
import { requestOptions } from '@/api/request-options'
import { GET_STAFF_BRITHDAY } from './constant'

function listStaffAbsence(userID) {
  return fetch(ROOT + LEAVE_STAFF_ABSENCE + 'userID=' + userID, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getUserBirthDay({ locationID, nextDay }) {
  return fetch(
    ROOT + GET_STAFF_BRITHDAY + `LocationID=${locationID}&&nextDays=${nextDay}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function viewStaffAbsence(leaveOfAbsenceID) {
  return fetch(
    ROOT + VIEW_STAFF_ABSENCE + 'leaveOfAbsenceID=' + leaveOfAbsenceID,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function approveOrRejectAbsence(data) {
  return fetch(ROOT + APPROVE_OR_REJECT_ABSENCE + data, requestOptions.putNoBody())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function createStaffAbsence(data) {
  return fetch(ROOT + CREATE_STAFF_ABSENCE, requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function updateStaffAbsence(data) {
  return fetch(ROOT + UPDATE_STAFF_ABSENCE, requestOptions.put(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function deleteStaffAbsence(leaveID) {
  return fetch(ROOT + DELETE_STAFF_ABSENCE + 'leaveOfAbsenceID=' + leaveID, requestOptions.delete())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

export const staff_absence = {
  listStaffAbsence,
  deleteStaffAbsence,
  getUserBirthDay,
  viewStaffAbsence,
  createStaffAbsence,
  updateStaffAbsence,
  approveOrRejectAbsence,
}
