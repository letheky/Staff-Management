import {
    ROOT,
    INSTRUCTOR_CREATE,
    INSTRUCTOR_EDIT,
    INSTRUCTOR_DELETE,
    INSTRUCTOR_GETALL,
    INSTRUCTOR_GET_BY_ID,
    INSTRUCTOR_GET_BY_USERID,
  } from '@/api/constant.js'
  import { handleResponse } from '@/api/handle-response'
  import { requestOptions } from '@/api/request-options'
  
  function createInstructor(data) {
    return fetch(ROOT + INSTRUCTOR_CREATE, requestOptions.postBody(data))
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function updateInstructor(data) {
    return fetch(ROOT + INSTRUCTOR_EDIT, requestOptions.put(data))
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function deleteInstructor(data) {
    return fetch(ROOT + INSTRUCTOR_DELETE + '?instructorID=' + data, requestOptions.delete())
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function getInstructorByID(data) {
    return fetch(ROOT + INSTRUCTOR_GET_BY_ID + '?instructorID=' + data, requestOptions.get())
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function getInstructorByUserID(data) {
    return fetch(ROOT + INSTRUCTOR_GET_BY_USERID + '?instructor_userID=' + data, requestOptions.get())
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function getAllInstructor() {
    return fetch(ROOT + INSTRUCTOR_GETALL , requestOptions.get())
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  
  export const instructor = {
      createInstructor,
      updateInstructor,
      deleteInstructor,
      getInstructorByID,
      getInstructorByUserID,
      getAllInstructor,
  }
  