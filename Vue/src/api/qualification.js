import {
  ROOT,
  QUALIFICAION_CREATE,
  QUALIFICAION_EDIT,
  QUALIFICAION_DELETE,
  QUALIFICAION_GETALL,
  QUALIFICAION_GET_BY_ID,
} from '@/api/constant.js'
import { handleResponse } from '@/api/handle-response'
import { requestOptions } from '@/api/request-options'

function createQualification(data) {
  return fetch(ROOT + QUALIFICAION_CREATE, requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function updateQualification(data) {
  return fetch(ROOT + QUALIFICAION_EDIT, requestOptions.put(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function deleteQualification(data) {
  return fetch(ROOT + QUALIFICAION_DELETE + '?  qualificationID=' + data, requestOptions.delete())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getQualificationByID(data) {
  return fetch(ROOT + QUALIFICAION_GET_BY_ID + '? qualificationID=' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getAllQualification() {
  return fetch(ROOT + QUALIFICAION_GETALL, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

export const qualification = {
  createQualification,
  updateQualification,
  deleteQualification,
  getQualificationByID,
  getAllQualification,
}
