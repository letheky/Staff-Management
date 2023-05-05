import {
  ROOT,
  CREATE_FOLDER,
  CREATE_TAG,
  CREATE_REFERENCE,
  UPDATE_FOLDER,
  UPDATE_TAG,
  UPDATE_REFERENCE,
  DELETE_TAG,
  DELETE_REFERENCE,
  DELETE_FOLDER,
  GET_FOLDER_BY_LIBTYPE,
  GET_REFERENCE_BY_ID,
  GET_REFERENCE_BY_FID,
  GET_TAGLIST,
  GET_SUBFOLDER,
  GET_ALL,
} from './constant'
import { handleResponse } from './handle-response'
import { requestOptions } from './request-options'

function getAllByLibType(libType) {
  return fetch(ROOT + GET_ALL + `libraryType=${libType}`, requestOptions.get())
    .then(handleResponse)
    .then(res => {
      return res
    })
}

function getFolderByLibType(libType) {
  return fetch(ROOT + GET_FOLDER_BY_LIBTYPE + `libraryType=${libType}`, requestOptions.get())
    .then(handleResponse)
    .then(res => {
      return res
    })
}

function getSubFolderByFolderID(id) {
  return fetch(ROOT + GET_SUBFOLDER + `libraryFolderID=${id}`, requestOptions.get())
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function getReferenceByFolderID(id) {
  return fetch(ROOT + GET_REFERENCE_BY_FID + `libraryFolderID=${id}`, requestOptions.get())
    .then(handleResponse)
    .then(res => {
      return res
    })
}

function getReferenceByID(id) {
  return fetch(ROOT + GET_REFERENCE_BY_ID + `referenceID=${id}`, requestOptions.get())
    .then(handleResponse)
    .then(res => {
      return res
    })
}

function getTaglist() {
  return fetch(ROOT + GET_TAGLIST, requestOptions.get())
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function updateReference(data) {
  return fetch(ROOT + UPDATE_REFERENCE, requestOptions.put(data))
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function updateTag(data) {
  return fetch(ROOT + UPDATE_TAG, requestOptions.put(data))
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function updateFolder(data) {
  return fetch(ROOT + UPDATE_FOLDER, requestOptions.put(data))
    .then(handleResponse)
    .then(res => {
      return res
    })
}

function createTag(data) {
  return fetch(ROOT + CREATE_TAG, requestOptions.postBody(data))
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function createReference(data) {
  return fetch(ROOT + CREATE_REFERENCE, requestOptions.postBody(data))
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function createFolder(data) {
  return fetch(ROOT + CREATE_FOLDER, requestOptions.postBody(data))
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function deleteReference(id) {
  return fetch(ROOT + DELETE_REFERENCE + `referenceID=${id}`, requestOptions.delete())
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function deleteTag(id) {
  return fetch(ROOT + DELETE_TAG + `referenceTagID=${id}`, requestOptions.delete())
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function deleteFolder(id) {
  return fetch(ROOT + DELETE_FOLDER + `libraryFolderID=${id}`, requestOptions.delete())
    .then(handleResponse)
    .then(res => {
      return res
    })
}

export const referencies = {
  getAllByLibType,
  getSubFolderByFolderID,
  getFolderByLibType,
  getReferenceByFolderID,
  getReferenceByID,
  getTaglist,
  updateReference,
  updateTag,
  updateFolder,
  createTag,
  createReference,
  createFolder,
  deleteReference,
  deleteTag,
  deleteFolder,
}
