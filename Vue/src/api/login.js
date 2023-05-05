import {
  ROOT,
  ADMIN_LOGIN,
  GET_FUNCTION_OF_ROLE,
  FORGOT_PASSWORD,
  USER_RESET_PASSWORD,
} from "@/api/constant.js";
import { handleResponse } from "@/api/handle-response";
import { requestOptions } from "@/api/request-options";
import { BehaviorSubject } from "rxjs";

const currentUserSubject = new BehaviorSubject(
  JSON.parse(localStorage.getItem("currentUser"))
);

function login(data) {
  return fetch(ROOT + ADMIN_LOGIN, requestOptions.postBody(data))
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function functionOfRole(data) {
  return fetch(ROOT + GET_FUNCTION_OF_ROLE + data, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function forgotPassword(data) {
  return fetch(
    ROOT + FORGOT_PASSWORD + "?userName=" + data,
    requestOptions.putNoBody()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function resetPassword(token, password) {
  return fetch(
    ROOT + USER_RESET_PASSWORD + "?token=" + token + "&password=" + password,
    requestOptions.putNoBody()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function logout() {
  // remove user from local storage to log user out
  localStorage.clear();
  currentUserSubject.next(null);
}

export const loginadmin = {
  login,
  functionOfRole,
  logout,
  forgotPassword,
  resetPassword,
};
