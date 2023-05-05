import {
  ROOT,
  GET_STUDY_PATHWAYS,
  ADD_STUDY_PATHWAYS,
  UPDATE_STUDY_PATHWAYS,
  DELETE_STUDY_PATHWAYS,
  // GET_COUNSELOR,
} from '@/api/constant.js'
import { handleResponse } from '@/api/handle-response'
import { requestOptions } from '@/api/request-options'

function getStudyPathways(id) {
  return fetch(ROOT + GET_STUDY_PATHWAYS + '?StudentID=' + id, requestOptions.get())
    .then(handleResponse)
    .then(id => {
      return id
    })
}

function addStudyPathways(id, data) {
  return fetch(ROOT + ADD_STUDY_PATHWAYS + '?StudentID=' + id, requestOptions.postBody(data))
    .then(handleResponse)
    .then(id => {
      return id
    })
}

function updateStudyPathways(id, data) {
  return fetch(ROOT + UPDATE_STUDY_PATHWAYS + '?StudentID=' + id, requestOptions.put(data))
    .then(handleResponse)
    .then(id => {
      return id
    })
}

function deleteStudyPathways(id) {
  return fetch(ROOT + DELETE_STUDY_PATHWAYS + '?StudentID=' + id, requestOptions.delete())
    .then(handleResponse)
    .then(id => {
      return id
    })
}

export const roadmap = {
  getStudyPathways,
  addStudyPathways,
  updateStudyPathways,
  deleteStudyPathways,
}
