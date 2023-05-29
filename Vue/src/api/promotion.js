import {
  ROOT,
  PROMOTION_CREATE,
  PROMOTION_EDIT,
  PROMOTION_DELETE,
  PROMOTION_GETALL,
  PROMOTION_GET_BY_ID,
} from '@/api/constant.js'
import { handleResponse } from '@/api/handle-response'
import { requestOptions } from '@/api/request-options'

function createPromotion(data) {
  return fetch(ROOT + PROMOTION_CREATE, requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function updatePromotion(data) {
  return fetch(ROOT + PROMOTION_EDIT, requestOptions.put(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function deletePromotion(data) {
  return fetch(ROOT + PROMOTION_DELETE + '?promotionID=' + data, requestOptions.delete())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getPromotionByID(data) {
  return fetch(ROOT + PROMOTION_GET_BY_ID + '?promotionID=' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getAllPromotion() {
  return fetch(ROOT + PROMOTION_GETALL, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

export const Promotion = {
  createPromotion,
  updatePromotion,
  deletePromotion,
  getPromotionByID,
  getAllPromotion,
}
