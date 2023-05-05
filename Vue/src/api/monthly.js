import {
  ADD_COMMENT,
  COMMENT_BY_CLASS,
  COMMENT_BY_STUDENT,
  COMMENT_DETAIL,
  EDIT_COMMENT,
  GET_LIST_STUDENT_BY_CENTER_AND_MORE,
  GET_LIST_STUDENT_IN_CLASS,
  GET_LIST__COMMENT_BY_CENTER_AND_MORE,
  ROOT,
  STUDENT_COMMENT,
} from './constant'
import { handleResponse } from './handle-response'

const { requestOptions } = require('./request-options')

function getCommentByStudent(studentID, classCode) {
  return fetch(
    ROOT + COMMENT_BY_STUDENT + `StudentID=${studentID}&ClassIDs=${classCode}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getCommentByDetail(commentID) {
  return fetch(ROOT + COMMENT_DETAIL + `CommentID=${commentID}`, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function editComment(dataEdit) {
  return fetch(ROOT + EDIT_COMMENT, requestOptions.put(dataEdit))
    .then(handleResponse)
    .then(data => data)
}
function addAcomment(data) {
  return fetch(ROOT + ADD_COMMENT, requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getCommentByClass(classID) {
  return fetch(ROOT + COMMENT_BY_CLASS + `ClassID=${classID}`, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function studentComment(data) {
  return fetch(ROOT + STUDENT_COMMENT, requestOptions.put(data)).then(data => {
    return data
  })
}
function getListStudentByClassID(classID) {
  return fetch(ROOT + GET_LIST_STUDENT_IN_CLASS + `classIDs=${classID}`, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getListStudentByCenterAndMore({
  locationIDs,
  classStatusID,
  fromMonth,
  toMonth,
  classID,
}) {
  return fetch(
    ROOT +
      GET_LIST_STUDENT_BY_CENTER_AND_MORE +
      `locationIDs=${locationIDs}&classStatusID=${classStatusID}&fromMonth=${fromMonth}&toMonth=${toMonth}&classIDs=${classID}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getListCommentByCenterAndMore({
  locationIDs,
  classStatusID,
  fromMonth,
  toMonth,
  classID,
}) {
  return fetch(
    ROOT +
      GET_LIST__COMMENT_BY_CENTER_AND_MORE +
      `locationIDs=${locationIDs}&classStatusID=${classStatusID}&fromMonth=${fromMonth}&toMonth=${toMonth}&classIDs=${classID}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}
export const monthly_comment = {
  getCommentByStudent,
  getCommentByDetail,
  studentComment,
  getCommentByClass,
  addAcomment,
  editComment,
  getListCommentByCenterAndMore,
  getListStudentByClassID,
  getListStudentByCenterAndMore,
}
