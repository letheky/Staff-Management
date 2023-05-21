import {
    ROOT,
    STUDENT_CREATE,
    STUDENT_EDIT,
    STUDENT_DELETE,
    STUDENT_GETALL,
    STUDENT_GET_BY_ID,
    STUDENT_GET_BY_USERID,
  } from '@/api/constant.js'
  import { handleResponse } from '@/api/handle-response'
  import { requestOptions } from '@/api/request-options'
  
  function createStudent(data) {
    return fetch(ROOT + STUDENT_CREATE, requestOptions.postBody(data))
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function updateStudent(data) {
    return fetch(ROOT + STUDENT_EDIT, requestOptions.put(data))
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function deleteStudent(data) {
    return fetch(ROOT + STUDENT_DELETE + '?studentID=' + data, requestOptions.delete())
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function getStudentByID(data) {
    return fetch(ROOT + STUDENT_GET_BY_ID + '?studentID=' + data, requestOptions.get())
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function getStudentByUserID(data) {
    return fetch(ROOT + STUDENT_GET_BY_USERID + '?student_userID=' + data, requestOptions.get())
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function getAllStudent() {
    return fetch(ROOT + STUDENT_GETALL , requestOptions.get())
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  
  export const student = {
      createStudent,
      updateStudent,
      deleteStudent,
      getStudentByID,
      getStudentByUserID,
      getAllStudent,
  }
  