import {
    ROOT,
    RESEARCH_CREATE,
    RESEARCH_EDIT,
    RESEARCH_DELETE,
    RESEARCH_GETALL,
    RESEARCH_GET_BY_ID,
    // RESEARCH_GET_BY_USERID,
    GET_INSTRUCTOR_IN_RESEARCH,
  } from '@/api/constant.js'
  import { handleResponse } from '@/api/handle-response'
  import { requestOptions } from '@/api/request-options'
  
  function createResearch(data) {
    return fetch(ROOT + RESEARCH_CREATE, requestOptions.postBody(data))
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function updateResearch(data) {
    return fetch(ROOT + RESEARCH_EDIT, requestOptions.put(data))
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function deleteResearch(data) {
    return fetch(ROOT + RESEARCH_DELETE + '?researchID=' + data, requestOptions.delete())
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function getResearchByID(data) {
    return fetch(ROOT + RESEARCH_GET_BY_ID + '?researchID=' + data, requestOptions.get())
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  // function getResearchByUserID(data) {
  //   return fetch(ROOT + RESEARCH_GET_BY_USERID + '?researchID_userID=' + data, requestOptions.get())
  //     .then(handleResponse)
  //     .then(data => {
  //       return data
  //     })
  // }
  function getAllResearch() {
    return fetch(ROOT + RESEARCH_GETALL , requestOptions.get())
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  function getInstructorInResearch() {
    return fetch(ROOT + GET_INSTRUCTOR_IN_RESEARCH , requestOptions.get())
      .then(handleResponse)
      .then(data => {
        return data
      })
  }
  
  export const research = {
      createResearch,
      updateResearch,
      deleteResearch,
      getResearchByID,
      // getResearchByUserID,
      getAllResearch,
      getInstructorInResearch,
  }
  