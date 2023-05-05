import {
  ROOT,
  GET_REPORT_REVENUE,
  GET_REPORT_STOPPED,
  GET_REPORT_Location
} from "@/api/constant.js";
// import { handleResponse } from "@/api/handle-response";
import { requestOptions } from "@/api/request-options";
import axios from "axios";

// function getDetailCourse(data) {
//   return fetch(
//     ROOT + GET_DETAIL_COURSE + "?levelID=" + data,
//     requestOptions.get()
//   )
//     .then(handleResponse)
//     .then((data) => {
//       return data;
//     });
// }

function getReportRevenue(id, Year) {
  return axios
    .get(
      // `https://cec.kuinsoft.com/cecapi/api/Reports/RevenueByLocationAndYear?pLocationID=1&pYear=2021`,
      ROOT + GET_REPORT_REVENUE + "pLocationID=" + id + "&pYear=" + Year,
      requestOptions.get()
    )
    .then((response) => {
      // response.data.map(() => (this.desserts.name = "abc"));
      return response.data;
    });
}
function getReportLocation() {
  return axios
    .get(
      // `https://cec.kuinsoft.com/cecapi/api/Reports/RevenueByLocationAndYear?pLocationID=1&pYear=2021`,
      ROOT + GET_REPORT_Location,
      requestOptions.get()
    )
    .then((response) => {
      // response.data.map(() => (this.desserts.name = "abc"));
      return response.data;
    });
}

export const report_stopped = {
  getReportStopped,
};
function getReportStopped(id, From, To) {
  return axios
    .get(
      ROOT +
      GET_REPORT_STOPPED +
      "pLocationID=" +
      id +
      "&pFromDate=" +
      From +
      "&pToDate=" +
      To,
      requestOptions.get()
    )
    .then((response) => {
      return response.data;
    });
}

export const report_revenue = {
  getReportRevenue,
  getReportStopped,
  getReportLocation,
};
