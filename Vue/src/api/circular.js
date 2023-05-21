import {
    ROOT,
    CIRCULAR_CREATE,
    CIRCULAR_EDIT,
    CIRCULAR_DELETE,
    CIRCULAR_GETALL,
    CIRCULAR_GET_BY_ID,
  } from '@/api/constant.js'
  import { handleResponse } from '@/api/handle-response'
  import { requestOptions } from '@/api/request-options'
  
  function createCircular(data) {
    return fetch(ROOT + CIRCULAR_CREATE, requestOptions.postBody(data))
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function updateCircular(data) {
    return fetch(ROOT + CIRCULAR_EDIT, requestOptions.put(data))
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function deleteCircular(data) {
    return fetch(ROOT + CIRCULAR_DELETE + '?circularID=' + data, requestOptions.delete())
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function getCircularByID(data) {
    return fetch(ROOT + CIRCULAR_GET_BY_ID + '?circularID=' + data, requestOptions.get())
      .then(handleResponse)
      .then(data => {
        return data
      })
  }

  function getAllCircular() {
    return fetch(ROOT + CIRCULAR_GETALL , requestOptions.get())
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  
  export const circular = {
      createCircular,
      updateCircular,
      deleteCircular,
      getCircularByID,
      getAllCircular,
  }
  