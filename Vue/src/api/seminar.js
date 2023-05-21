import {
    ROOT,
    SEMINAR_CREATE,
    SEMINAR_EDIT,
    SEMINAR_DELETE,
    SEMINAR_GETALL,
    SEMINAR_GET_BY_ID,
    SEMINAR_GET_BY_USERID,
  } from '@/api/constant.js'
  import { handleResponse } from '@/api/handle-response'
  import { requestOptions } from '@/api/request-options'
  
  function createSeminar(data) {
    return fetch(ROOT + SEMINAR_CREATE, requestOptions.postBody(data))
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function updateSeminar(data) {
    return fetch(ROOT + SEMINAR_EDIT, requestOptions.put(data))
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function deleteSeminar(data) {
    return fetch(ROOT + SEMINAR_DELETE + '?seminarID=' + data, requestOptions.delete())
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function getSeminarByID(data) {
    return fetch(ROOT + SEMINAR_GET_BY_ID + '?seminarID=' + data, requestOptions.get())
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function getSeminarByUserID(data) {
    return fetch(ROOT + SEMINAR_GET_BY_USERID + '?seminar_userID=' + data, requestOptions.get())
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function getAllSeminar() {
    return fetch(ROOT + SEMINAR_GETALL , requestOptions.get())
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  
  export const seminar = {
      createSeminar,
      updateSeminar,
      deleteSeminar,
      getSeminarByID,
      getSeminarByUserID,
      getAllSeminar,
  }
  