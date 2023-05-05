import {
  ROOT,
  SEARCH_CLASS,
  GET_CLASS_PROGRAMME,
  GET_CLASS_GROUP,
  GET_CLASS_SHIFT,
  GET_CLASS_STATUS,
  GET_CLASS_TYPE,
  GET_CLASS_BY_PROGRAMME,
  GET_CLASS_INFO,
  GET_CLASS_OVERVIEW,
  GET_CLASS_ROOM,
  GET_LIST_STUDENT_ATTENDANCE,
  UPDATE_ATTENDANCE_STUDENT,
  LIST_SCHEDULE_OF_CLASS,
  GET_CLASS_SCHEDULE_DETAIL,
  ADMIN_GET_LIST_CLASSES_OF_TEACHER,
  STAFF_GET_LIST_CLASSES_OF_TEACHER,
  GET_HUMAN_OF_ONE_CLASS,
  GET_CHAT_INFO,
  ADMIN_CHAT,
  DELETE_MESSAGE,
  UPDATE_MESSAGE,
  GET_SCHEDULE_IN_DAYS,
  GET_TEACHER_SCHEDULE_IN_DAYS,
  VIEW_LIST_STUDENT_ATTENDANCE,
  CREATE_LESSON_REPORT,
  VIEW_LESSON_REPORT,
  GET_CLASS_BY_LOCATION,
  CHANGE_STATUS_LESSON_REPORT,
  GET_QCEC_CALENDAR,
  Qc_DAILY_CLASS,
  GET_StudentReportOverView,
} from '@/api/constant.js'
import { handleResponse } from '@/api/handle-response'
import { requestOptions } from '@/api/request-options'
import {
  CLASS_REG,
  CREATE_RECORD,
  GET_LIST_CLASS_STUDENT_STUDING,
  RECORD_CATEGORY_BY_CLASS_ID,
  RECORD_UPDATE_COMMENT,
  RECORD_UPDATE_LINK,
  SCHEDULE_UPDATE_NOTE,
  STUDENT_RECORDING_BY_ClASSID,
  STUDENT_RECORDING_UPDATE,
} from './constant'
import axios from 'axios'

function searchClass(data) {
  return fetch(ROOT + SEARCH_CLASS, requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getClassRe(userID) {
  return fetch(
    ROOT + CLASS_REG + `userID=${userID}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function StudentReportOverView(data) {
  return axios
    .get(ROOT + GET_StudentReportOverView + '?LocationID=' + data, requestOptions.get())
    .then(response => {
      // response.data.map(() => (this.desserts.name = "abc"));
      return response.data
    })
}
function getStudentRecordingByClassID(classID) {
  return axios
    .get(ROOT + STUDENT_RECORDING_BY_ClASSID + 'ClassID=' + classID, requestOptions.get())
    .then(response => {
      // response.data.map(() => (this.desserts.name = "abc"));
      return response.data
    })
}
function getRecordCategoryByClassID(classID) {
  return axios
    .get(ROOT + RECORD_CATEGORY_BY_CLASS_ID + 'ClassID=' + classID, requestOptions.get())
    .then(response => {
      // response.data.map(() => (this.desserts.name = "abc"));
      return response.data
    })
}
//function getQcDailyClass(data) {
//  return fetch(
//    ROOT +
//      Qc_DAILY_CLASS +
//      `locationIDs=${data.locationIDs}&classAdmin=${data.classAdmin}`,
//    requestOptions.get()
//  )
//    .then(handleResponse)
//    .then((data) => {
//      return data;
//    });
//}
function getQcDailyClass(locationID, scheduleDate, qcId) {
  return fetch(
    ROOT +
      Qc_DAILY_CLASS +
      '?locationIDs=' +
      locationID +
      '&scheduleDate=' +
      scheduleDate +
      '&classAdmin=' +
      qcId,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getScheduleInDays(locationID, scheduleDate) {
  return fetch(
    ROOT + GET_SCHEDULE_IN_DAYS + '?locationIDs=' + locationID + '&scheduleDate=' + scheduleDate,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getTeacherScheduleInDays(userId, scheduleDate) {

  return fetch(
    ROOT + GET_TEACHER_SCHEDULE_IN_DAYS + '?userId=' + userId + '&scheduleDate=' + scheduleDate,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getClassOverview(data) {
  return fetch(ROOT + GET_CLASS_OVERVIEW + '/' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getClassInfo(data) {
  return fetch(ROOT + GET_CLASS_INFO + '?classID=' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}


function getListClassStudying(studentID) {
  return fetch(ROOT +  GET_LIST_CLASS_STUDENT_STUDING + 'studentID=' + studentID, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getClassProgramme() {
  return fetch(ROOT + GET_CLASS_PROGRAMME, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getClassGroup() {
  return fetch(ROOT + GET_CLASS_GROUP, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getClassShift() {
  return fetch(ROOT + GET_CLASS_SHIFT, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getClassStatus() {
  return fetch(ROOT + GET_CLASS_STATUS, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getClassType() {
  return fetch(ROOT + GET_CLASS_TYPE, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getClassRoom() {
  return fetch(ROOT + GET_CLASS_ROOM, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getStudentAttendance(data) {
  return fetch(ROOT + GET_LIST_STUDENT_ATTENDANCE + '?scheduleID=' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getListStudentAttendance(data) {
  return fetch(ROOT + VIEW_LIST_STUDENT_ATTENDANCE + '?scheduleID=' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getClassByProgramme(data) {
  return fetch(ROOT + GET_CLASS_BY_PROGRAMME + '/' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getScheduleOfClass(data) {
  return fetch(ROOT + LIST_SCHEDULE_OF_CLASS + '?classID=' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getClassScheduleDetail(data) {
  return fetch(ROOT + GET_CLASS_SCHEDULE_DETAIL + '?scheduleID=' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function updateAttendanceStudent(classID, scheduleID, data) {
  return fetch(
    ROOT + UPDATE_ATTENDANCE_STUDENT + '?classdID=' + classID + '&scheduleID=' + scheduleID,
    requestOptions.put(data)
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function updateRecordLink( data) {
  return fetch(
    ROOT + RECORD_UPDATE_LINK ,
    requestOptions.put(data)
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function adminGetAllClassesOfTeacher() {
  return fetch(ROOT + ADMIN_GET_LIST_CLASSES_OF_TEACHER, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function staffGetAllClassesOfTeacher() {
  return fetch(ROOT + STAFF_GET_LIST_CLASSES_OF_TEACHER, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getHumanFromClass(data) {
  return fetch(ROOT + GET_HUMAN_OF_ONE_CLASS + '?classID=' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getChatInfo(data) {
  return fetch(ROOT + GET_CHAT_INFO, requestOptions.put(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function updateNote(note, scheduleId) {
  let requestBody = { scheduleID: scheduleId, note: note }
  return fetch(ROOT + SCHEDULE_UPDATE_NOTE, requestOptions.put(requestBody))
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function adminChat(data) {
  return fetch(ROOT + ADMIN_CHAT, requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function createRecord(data) {
  return fetch(ROOT + CREATE_RECORD, requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function deleteMessage(msgID) {
  return fetch(ROOT + DELETE_MESSAGE + 'msgID=' + msgID, requestOptions.delete())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function updateMessage(data) {
  return fetch(ROOT + UPDATE_MESSAGE, requestOptions.put(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function updateComment(data) {
  return fetch(ROOT + RECORD_UPDATE_COMMENT, requestOptions.put(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}


function createLessonReport(data) {
  return fetch(ROOT + CREATE_LESSON_REPORT, requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function viewLessonReport(data) {
  return fetch(ROOT + VIEW_LESSON_REPORT + '?scheduleID=' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getClassByLocation(data) {
  return fetch(ROOT + GET_CLASS_BY_LOCATION + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function changeStatusLessonReport(data) {
  return fetch(ROOT + CHANGE_STATUS_LESSON_REPORT + data, requestOptions.putNoBody())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getQCECCalendar(data) {
  return fetch(ROOT + GET_QCEC_CALENDAR + '?' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function updateRecordComment(data, recordID) {
  return fetch(ROOT + STUDENT_RECORDING_UPDATE + 'RecordId=' + recordID, requestOptions.put(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
export const class_managerment = {
  getQcDailyClass,
  updateRecordComment,
  searchClass,
  getClassProgramme,
  getClassGroup,
  getClassShift,
  getClassStatus,
  getClassType,
  getClassByProgramme,
  getClassOverview,
  getClassInfo,
  getClassRoom,
  getClassRe,
  getStudentAttendance,
  updateAttendanceStudent,
  getScheduleOfClass,
  getClassScheduleDetail,
  adminGetAllClassesOfTeacher,
  staffGetAllClassesOfTeacher,
  getHumanFromClass,
  getChatInfo,
  updateComment,
  updateRecordLink , 
  createRecord , 
  getListClassStudying , 
  adminChat,
  deleteMessage,
  updateMessage,
  getScheduleInDays,
  getTeacherScheduleInDays,
  getListStudentAttendance,
  createLessonReport,
  viewLessonReport,
  getClassByLocation,
  changeStatusLessonReport,
  getQCECCalendar,
  updateNote,
  StudentReportOverView,
  getStudentRecordingByClassID,
  getRecordCategoryByClassID,
}
