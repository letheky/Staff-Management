import {
  ROOT,
  REPORT_STUDENT_CLASS_LIST,
  REPORT_STUDENT_ATTENDANCE,
  REPORT_TEACHER_ON_LEAVE,
  REPORT_STAFF_ON_LEAVE,
  REPORT_TEACHER_CHANGES_BY_CLASS,
  REPORT_TAKE_OVER_TEACHER_CHANGES_BY_CLASS_DETAIL,
  REPORT_COVER_TEACHER_CHANGES_BY_CLASS_DETAIL,
} from '@/api/constant.js'
import { handleResponse } from '@/api/handle-response'
import { requestOptions } from '@/api/request-options'
import { ABSENT_STUDENTS_REPORT } from './constant'

function getStudentList(params) {
  return fetch(ROOT + REPORT_STUDENT_CLASS_LIST + 'classIds=' + params, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getStudentAttendanceReport(params) {
  return fetch(ROOT + REPORT_STUDENT_ATTENDANCE + 'classIds=' + params, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getStudentAbsentReport(locationID, date) {
  return fetch(
    ROOT + ABSENT_STUDENTS_REPORT + `locationID=${locationID}&pdate=${date}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getTeacherOnLeave(data) {
  return fetch(ROOT + REPORT_TEACHER_ON_LEAVE + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getStaffOnLeave(data) {
  return fetch(ROOT + REPORT_STAFF_ON_LEAVE + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getTeacherChangesByClass(data) {
  return fetch(ROOT + REPORT_TEACHER_CHANGES_BY_CLASS, requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getTakeOverTeacherChangesByClassDetail(params) {
  return fetch(
    ROOT + REPORT_TAKE_OVER_TEACHER_CHANGES_BY_CLASS_DETAIL + 'classId=' + params,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getCoverTeacherChangesByClassDetail(params) {
  return fetch(
    ROOT + REPORT_COVER_TEACHER_CHANGES_BY_CLASS_DETAIL + 'classId=' + params,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}

export const statistic_management = {
  getStudentList,
  getStudentAttendanceReport,
  getTeacherOnLeave,
  getStaffOnLeave,
  getStudentAbsentReport,
  getTeacherChangesByClass,
  getTakeOverTeacherChangesByClassDetail,
  getCoverTeacherChangesByClassDetail,
}
