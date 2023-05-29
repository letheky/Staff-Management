import {
  ROOT,
  PLAN_CREATE,
  PLAN_EDIT,
  PLAN_DELETE,
  PLAN_GETALL,
  PLAN_GET_BY_ID,
  // Plan_GET_BY_USERID,
  // GET_INSTRUCTOR_IN_Plan,
} from '@/api/constant.js'
import { handleResponse } from '@/api/handle-response'
import { requestOptions } from '@/api/request-options'

function createPlan(data) {
  return fetch(ROOT + PLAN_CREATE, requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function updatePlan(data) {
  return fetch(ROOT + PLAN_EDIT, requestOptions.put(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function deletePlan(data) {
  return fetch(ROOT + PLAN_DELETE + '?planID=' + data, requestOptions.delete())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getPlanByID(data) {
  return fetch(ROOT + PLAN_GET_BY_ID + '?planID=' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
// function getPlanByUserID(data) {
//   return fetch(ROOT + Plan_GET_BY_USERID + '?PlanID_userID=' + data, requestOptions.get())
//     .then(handleResponse)
//     .then(data => {
//       return data
//     })
// }
function getAllPlan() {
  return fetch(ROOT + PLAN_GETALL, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

export const plan = {
  createPlan,
  updatePlan,
  deletePlan,
  getPlanByID,
  // getPlanByUserID,
  getAllPlan,
}
