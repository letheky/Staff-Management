import { handleResponse } from './handle-response'

const {
  ROOT,
  KPI_REPORT_OVERVIEW,
  KPI_STOPPED_STUDENT,
  KPI_REVENUE,
  KPI_SALES,
} = require('./constant')
const { requestOptions } = require('./request-options')

function getOverview(month, year) {
  return fetch(ROOT + KPI_REPORT_OVERVIEW + `Month=${month}&Year=${year}`, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getKPIStoppedStudent(month, year) {
  return fetch(ROOT + KPI_STOPPED_STUDENT + `Month=${month}&Year=${year}`, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getKPIRevenue(month, year) {
  return fetch(ROOT + KPI_REVENUE + `Month=${month}&Year=${year}`, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getKPISales(month, year) {
  return fetch(ROOT + KPI_SALES + `Month=${month}&Year=${year}`, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
export const kpi_report = {
  getOverview,
  getKPIStoppedStudent,
  getKPIRevenue,
  getKPISales,
}
