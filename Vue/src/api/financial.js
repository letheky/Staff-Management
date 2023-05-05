import {
  ROOT,
  TEACHER_SALARY_LIST,
  TEACHER_SALARY_DETAIL,
  GET_QC_LIST,
} from "@/api/constant.js";
import { handleResponse } from "@/api/handle-response";
import { requestOptions } from "@/api/request-options";
import { GET_QC_SALARY_DETAIL_WITH_ID_AND_LOCATION } from "./constant";

function getTeacherSalary(
  teacherKey,
  teacherGroupID,
  teacherTypeID,
  fromDate,
  toDate
) {
  return fetch(
    ROOT +
      TEACHER_SALARY_LIST +
      "?teacherKey=" +
      teacherKey +
      "&teacherGroupID=" +
      teacherGroupID +
      "&teacherTypeID=" +
      teacherTypeID +
      "&fromDate=" +
      fromDate +
      "&toDate=" +
      toDate,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getQCList(searchKey, fromDate, toDate) {
  return fetch(
    ROOT +
      GET_QC_LIST +
      "?searchKey=" +
      searchKey +
      "&fromDate=" +
      fromDate +
      "&toDate=" +
      toDate,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getDetailTeacherSalary(teacherID, fromDate, toDate) {
  return fetch(
    ROOT +
      TEACHER_SALARY_DETAIL +
      "?teacherID=" +
      teacherID +
      "&fromDate=" +
      fromDate +
      "&toDate=" +
      toDate,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}
function getQcSalaryDetail({ qcId, month, year }) {
  return fetch(
    ROOT +
      GET_QC_SALARY_DETAIL_WITH_ID_AND_LOCATION +
      `TeacherID=${qcId}&&Month=${month}&&Year=${year}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

export const financial = {
  getTeacherSalary,
  getDetailTeacherSalary,
  getQCList,
  getQcSalaryDetail,
};
