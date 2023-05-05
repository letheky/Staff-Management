import { ROOT, GET_ALL_NEWS, GET_DETAIL_NEWS } from '@/api/constant.js'
import { handleResponse } from '@/api/handle-response'
import { requestOptions } from '@/api/request-options'
import { UPLOAD_IMAGE } from './constant'
import { handleResponseLink } from './handle-response'

function getAllNews(data) {
  return fetch(ROOT + GET_ALL_NEWS + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getDetailNews(data) {
  return fetch(ROOT + GET_DETAIL_NEWS + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function addAImage(data) {
  return fetch(ROOT + UPLOAD_IMAGE, requestOptions.postImage(data))
    .then(handleResponseLink)
    .then(data => {
      return data
    })
}

export const news = {
  getAllNews,
  getDetailNews,
  addAImage,
}
