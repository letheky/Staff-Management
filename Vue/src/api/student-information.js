import { ROOT, GET_STUDENT_CALENDAR } from '@/api/constant.js'
import { handleResponse } from '@/api/handle-response'
import { requestOptions } from '@/api/request-options'
import {
  GET_STUDENT_INFOR,
  OUT_STANDING_PAYMENT_BY_DUEDATE,
  OVER_VIEW_BY_PROGRAM,
  OVER_VIEW_BY_QC_WITH_LOCATION,
  PLACEMENT_TEST,
  VISIT_AND_REGISTER,
} from './constant'

function getStudentCalendar(data) {
  return fetch(ROOT + GET_STUDENT_CALENDAR + '?' + data, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getStudentInfor(userID) {
  return fetch(ROOT + GET_STUDENT_INFOR + `userID=${userID}`, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getStudentOverView() {
  // let data = "dsd";
  // return fetch(ROOT + GET_STUDENT_CALENDAR + "?" + data, requestOptions.get())
  //   .then(handleResponse)
  //   .then((data) => {
  //     return data;
  //   });

  return fetch(ROOT + OVER_VIEW_BY_PROGRAM, requestOptions.get())
}

function getVisitAndRegister({ locationID, date }) {
  return fetch(
    ROOT + VISIT_AND_REGISTER + `Date=${date}&LocationID=${locationID}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getPlacementTest({ locationID, date }) {
  return fetch(
    ROOT + PLACEMENT_TEST + `Date=${date}&LocationID=${locationID}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(data => {
      return data; 
    })
    // .then(     () => {let xx = [];
    //   xx.push({"studentID":33363,"studentCode":"33363HN","studentName":"Nguyễn Hoàng Bách","testDate":"2022-09-06T00:00:00","testTime":"16:30-16:55","ec":"Nguyễn Thị Vân"});
    //   return xx;}
}
function getOutstandingPaymentbyDueDate({ locationID, date }) {
  return fetch(
    ROOT + OUT_STANDING_PAYMENT_BY_DUEDATE + `LocationID=${locationID}&&Date=${date}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getOverviewByQCWithLocation(location) {
  return fetch(
    ROOT + OVER_VIEW_BY_QC_WITH_LOCATION + 'LocationID=' + location,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}
export const student_information = {
  getStudentCalendar,
  getStudentOverView,
  getOverviewByQCWithLocation,
  getOutstandingPaymentbyDueDate,
  getVisitAndRegister,
  getPlacementTest,
  getStudentInfor

}
