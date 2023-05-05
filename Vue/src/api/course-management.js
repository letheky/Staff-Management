import {
  ROOT,
  GET_COURSE_ALL,
  GET_DEPARTMENT,
  GET_PROGRAMME,
  GET_COURSE_BY_DEPARTMENT,
  GET_COURSE_BY_PROGRAMME,
  GET_COURSE_DETAIL,
  GET_DETAIL_COURSE,
} from "@/api/constant.js";
import { handleResponse } from "@/api/handle-response";
import { requestOptions } from "@/api/request-options";

function getDetailCourse(data) {
  return fetch(
    ROOT + GET_DETAIL_COURSE + "?levelID=" + data,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getDepartment() {
  return fetch(ROOT + GET_DEPARTMENT, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getProgramme(data) {
  return fetch(
    ROOT + GET_PROGRAMME + "?departmentID=" + data,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getCourseByDepartment(data) {
  return fetch(
    ROOT + GET_COURSE_BY_DEPARTMENT + "/" + data,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getCourseByProgramme(data) {
  return fetch(
    ROOT + GET_COURSE_BY_PROGRAMME + "?programmeID=" + data,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getCourseAll() {
  return fetch(ROOT + GET_COURSE_ALL, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getCourseDetail(data) {
  return fetch(ROOT + GET_COURSE_DETAIL + "/" + data, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

export const course_managerment = {
  getCourseAll,
  getDepartment,
  getProgramme,
  getCourseByDepartment,
  getCourseByProgramme,
  getCourseDetail,
  getDetailCourse,
};
