import { DELETE_RESULT, GET_LIST_RESULT_BY_TEST } from './constant'
import { EDIT_RESULT } from './constant'
import {
  CREATE_TEST_RESULT,
  EDIT_RESULT_TO_ONE,
  GET_LIST_RESULT,
  GET_LIST_TEST,
  ROOT,
} from './constant'
import { handleResponse } from './handle-response'
import { requestOptions } from './request-options'

function getListTest(classID) {
  return fetch(ROOT + GET_LIST_TEST + `classId=${classID}`, requestOptions.get())
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function getListResultByTestId(testID) {
  return fetch(ROOT + GET_LIST_RESULT_BY_TEST + `testId=${testID}`, requestOptions.get())
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function getListResult(classID) {
  return fetch(ROOT + GET_LIST_RESULT + `classId=${classID}`, requestOptions.get())
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function createListResult(data) {
  return fetch(ROOT + CREATE_TEST_RESULT, requestOptions.postBody(data))
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function editListResult(data) {
  return fetch(ROOT + EDIT_RESULT, requestOptions.put(data))
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function editAResult(data) {
  return fetch(ROOT + EDIT_RESULT_TO_ONE, requestOptions.put(data))
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function deleteResult(testId) {
  return fetch(ROOT + DELETE_RESULT + `testId=${testId}`, requestOptions.putNoBody())
    .then(handleResponse)
    .then(res => {
      return res
    })
}
export const test_result = {
  getListTest,
  getListResult,
  deleteResult,
  getListResultByTestId,
  createListResult,
  editListResult,
  editAResult,
}
