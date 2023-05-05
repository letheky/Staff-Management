import {
  ROOT,
  GET_DETAIL_USER_INFO,
  UPDATE_DETAIL_USER_INFO,
  CHANGE_PASSWORD,
} from '@/api/constant.js'
import { handleResponse } from '@/api/handle-response'
import { requestOptions } from '@/api/request-options'

function getDetailUserInfo(data) {
  return fetch(ROOT + GET_DETAIL_USER_INFO + '?userID=' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function updateDetailUserInfo(data) {
  return fetch(ROOT + UPDATE_DETAIL_USER_INFO, requestOptions.put(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function changePassword(data) {
  return fetch(ROOT + CHANGE_PASSWORD + data, requestOptions.post())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

export const my_profile = {
  getDetailUserInfo,
  updateDetailUserInfo,
  changePassword,
}
