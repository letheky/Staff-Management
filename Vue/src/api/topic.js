import {
  ROOT,
  TOPIC_CREATE,
  TOPIC_EDIT,
  TOPIC_DELETE,
  TOPIC_GETALL,
  TOPIC_GET_BY_ID,
  GET_STUDENT_IN_TOPIC,
} from '@/api/constant.js'
import { handleResponse } from '@/api/handle-response'
import { requestOptions } from '@/api/request-options'

function createTopic(data) {
  return fetch(ROOT + TOPIC_CREATE, requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function updateTopic(data) {
  return fetch(ROOT + TOPIC_EDIT, requestOptions.put(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function deleteTopic(data) {
  return fetch(ROOT + TOPIC_DELETE + '?topicID=' + data, requestOptions.delete())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getTopicByID(data) {
  return fetch(ROOT + TOPIC_GET_BY_ID + '?topicID=' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getAllTopic() {
  return fetch(ROOT + TOPIC_GETALL, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getStudentInTopic() {
  return fetch(ROOT + GET_STUDENT_IN_TOPIC, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

export const topic = {
  createTopic,
  updateTopic,
  deleteTopic,
  getTopicByID,
  getAllTopic,
  getStudentInTopic,
}
