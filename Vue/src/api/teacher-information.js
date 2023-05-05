import {
  ROOT,
  GET_LIST_TEACHER_GROUP,
  GET_LIST_TEACHER_TYPE,
  GET_LIST_TEACHER_RATE,
  GET_LIST_TEACHER_SALARYTYPES,
  GET_LIST_TEACHER_CURRENCY,
  GET_TEACHER_CALENDAR,
  REGISTER_FREE_TIME,
  LIST_TEACHER_FREE_TIME,
  VIEW_LESSON_CONTENT,
  UPDATE_FREE_TIME,
  DELETE_FREE_TIME,
} from "@/api/constant.js";
import { handleResponse } from "@/api/handle-response";
import { requestOptions } from "@/api/request-options";

function getListTeacherGroup() {
  return fetch(ROOT + GET_LIST_TEACHER_GROUP, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getListTeacherType() {
  return fetch(ROOT + GET_LIST_TEACHER_TYPE, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getListTeacherRate() {
  return fetch(ROOT + GET_LIST_TEACHER_RATE, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getListTeacherSalaryTypes() {
  return fetch(ROOT + GET_LIST_TEACHER_SALARYTYPES, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getListTeacherCurrency() {
  return fetch(ROOT + GET_LIST_TEACHER_CURRENCY, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getTeacherCalendar(data) {
  return fetch(ROOT + GET_TEACHER_CALENDAR + "?" + data, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}
function registerFreeTime(data) {
  return fetch(ROOT + REGISTER_FREE_TIME + "?" + data, requestOptions.post())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}
function listTeacherFreeTime(data) {
  return fetch(ROOT + LIST_TEACHER_FREE_TIME + "?" + data, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}
function viewLessonContent(data) {
  return fetch(ROOT + VIEW_LESSON_CONTENT + "?" + data, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function updateFreeTime(data) {
  return fetch(ROOT + UPDATE_FREE_TIME + "?" + data, requestOptions.put())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function deleteFreeTime(recordID) {
  return fetch(
    ROOT + DELETE_FREE_TIME + "recordID=" + recordID,
    requestOptions.delete()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

export const teacher_information = {
  getListTeacherGroup,
  getListTeacherType,
  getListTeacherRate,
  getListTeacherSalaryTypes,
  getListTeacherCurrency,
  getTeacherCalendar,
  registerFreeTime,
  listTeacherFreeTime,
  viewLessonContent,
  updateFreeTime,
  deleteFreeTime,
};
