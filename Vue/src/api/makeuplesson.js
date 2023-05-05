import { handleResponse } from './handle-response'

const {
  ROOT,
  GET_LIST_PROGRAM,
  GET_LIST_MAKEUP_LESSON,
  ADD_MAKEUP_ITEM,
  UPDATE_MAKEUP_ITEM,
  GET_LIST_MAKEUP,
  DELETE_RE_MAKEUP,
} = require('./constant')
const { requestOptions } = require('./request-options')

function getProgramList() {
  return fetch(ROOT + GET_LIST_PROGRAM, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function deleteMakeup(makeUpID) {
  return fetch(ROOT + DELETE_RE_MAKEUP + `makeUpID=${makeUpID}`, requestOptions.delete())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getListMakeupClass(programID, studentID, classID) {
  return fetch(
    ROOT + GET_LIST_MAKEUP_LESSON + `program=${programID}&&studentID=${studentID}&&classID=${classID}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function createMakeupLesson(data) {
  return fetch(ROOT + ADD_MAKEUP_ITEM, requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function updateMakeupLesson(data) {
  return fetch(ROOT + UPDATE_MAKEUP_ITEM, requestOptions.put(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getMakeupList(locationID, fromDate, toDate) {
  return fetch(
    ROOT + GET_LIST_MAKEUP + `locationId=${locationID}&fromDate=${fromDate}&toDate=${toDate}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getMakeupLesson(makeUpID) {
  return fetch(ROOT + GET_LIST_MAKEUP + `makeUpID=${makeUpID}`, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data 
    })
}

export const makeuplesson = {
  getProgramList,
  getMakeupList,
  deleteMakeup,
  createMakeupLesson,
  getListMakeupClass,
  updateMakeupLesson,
  getMakeupLesson,
}
