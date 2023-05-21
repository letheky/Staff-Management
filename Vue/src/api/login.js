import { ROOT, USER_REGISTER, USER_LOGIN, USER_CHANGEPASSWORD } from '@/api/constant.js'
import { handleResponse } from '@/api/handle-response'
import { requestOptions } from '@/api/request-options'
import { BehaviorSubject } from 'rxjs'

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')))

function login(data) {
  return fetch(ROOT + USER_LOGIN, requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function register(data) {
  return fetch(ROOT + USER_REGISTER, requestOptions.postImage(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function changePassword(data) {
  return fetch(ROOT + USER_CHANGEPASSWORD, requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function logout() {
  // remove user from local storage to log user out
  localStorage.clear()
  currentUserSubject.next(null)
}

export const loginadmin = {
  login,
  logout,
  register,
  changePassword,
}
