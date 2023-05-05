import { ROOT, GET_LIST_OUTSTANDING } from "@/api/constant.js";
import { handleResponse } from "@/api/handle-response";
import { requestOptions } from "@/api/request-options";
import { CASH_JOURNAL_REPORT, DAILY_CASH_REPORT, STUDENT_ATTENDANCE_REPORT } from "./constant";

function getOutstandingList(params) {
  return fetch(
    ROOT + GET_LIST_OUTSTANDING + "pLocationID=" + params,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getAttendaceReport(params) {
  return fetch(
    ROOT + STUDENT_ATTENDANCE_REPORT + "pClassID=" + params,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getCashJournalReport(locationId, fromDate, toDate) {
  return fetch(
    ROOT + CASH_JOURNAL_REPORT + "LocationID=" + locationId + "&FromDate=" + fromDate + "&ToDate=" + toDate,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getDailyCash(locationId, fromDate, toDate) {
  return fetch(
    ROOT + DAILY_CASH_REPORT + "LocationID=" + locationId + "&FromDate=" + fromDate + "&ToDate=" + toDate,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

export const report_management = {
  getOutstandingList,
  getAttendaceReport,
  getCashJournalReport,
  getDailyCash
};
