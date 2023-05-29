import {
  ROOT,
  CONTRACT_CREATE,
  CONTRACT_EDIT,
  CONTRACT_DELETE,
  CONTRACT_GETALL,
  CONTRACT_GET_BY_ID,
} from '@/api/constant.js'
import { handleResponse } from '@/api/handle-response'
import { requestOptions } from '@/api/request-options'

function createContract(data) {
  return fetch(ROOT + CONTRACT_CREATE, requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function updateContract(data) {
  return fetch(ROOT + CONTRACT_EDIT, requestOptions.put(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function deleteContract(data) {
  return fetch(ROOT + CONTRACT_DELETE + '?contractID=' + data, requestOptions.delete())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getContractByID(data) {
  return fetch(ROOT + CONTRACT_GET_BY_ID + '?contractID=' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
// function getContractByUserID(data) {
//   return fetch(ROOT + Contract_GET_BY_USERID + '?Contract_userID=' + data, requestOptions.get())
//     .then(handleResponse)
//     .then(data => {
//       return data
//     })
// }
function getAllContract() {
  return fetch(ROOT + CONTRACT_GETALL, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

export const contract = {
  createContract,
  updateContract,
  deleteContract,
  getContractByID,
  // getContractByUserID,
  getAllContract,
}
