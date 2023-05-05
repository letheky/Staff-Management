import {
  ADD_REWARD,
  ADD_REWARDTYPE,
  DELETE_REWARD,
  GET_REWARDTYPE,
  GET_REWARD_BY_ADDMIN,
  GET_REWARD_BY_STUDENT,
  ROOT,
  UPDATE_REWARD,
  UPDATE_REWARDTYPE,
} from './constant'
import { handleResponse } from './handle-response'
import { requestOptions } from './request-options'

function getRewardTypeList() {
  return fetch(ROOT + GET_REWARDTYPE, requestOptions.get())
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function getRewardByStudent(studentID) {
  return fetch(ROOT + GET_REWARD_BY_STUDENT + `studentID=${studentID}`, requestOptions.get())
    .then(handleResponse)
    .then(res => {
      return res
    })
}

function getRewardList(locationID, fromMonth, toMonth) {
  return fetch(
    ROOT +
      GET_REWARD_BY_ADDMIN +
      `locationId=${locationID}&fromMonth=${fromMonth}&toMonth=${toMonth}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function addReward(data) {
  return fetch(ROOT + ADD_REWARD, requestOptions.postBody(data))
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function addRewardType(data) {
  return fetch(ROOT + ADD_REWARDTYPE, requestOptions.postBody(data))
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function updateReward(data) {
  return fetch(ROOT + UPDATE_REWARD, requestOptions.put(data))
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function updateRewardType(data) {
  return fetch(ROOT + UPDATE_REWARDTYPE, requestOptions.put(data))
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function deleteReward(rewardID) {
  return fetch(ROOT + DELETE_REWARD + `rewardID=${rewardID}`, requestOptions.delete())
    .then(handleResponse)
    .then(res => {
      return res
    })
}
export const rewardApi = {
  getRewardTypeList,
  addReward,
  getRewardList,
  deleteReward,
  getRewardByStudent,
  updateReward,
  addRewardType,
  updateRewardType,
}
