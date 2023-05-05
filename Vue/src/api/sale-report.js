import {
  ROOT,

  // GET_COUNSELOR,
} from '@/api/constant.js'
import { handleResponse } from '@/api/handle-response'
import { requestOptions } from '@/api/request-options'
import { SALES_REPORT_BY_EQC, SALES_REPORT_DETAIL } from './constant'

function getSaleReportDetail(locationID, month, year) {
  return fetch(
    ROOT + SALES_REPORT_DETAIL + `locationID=${locationID}&month=${month}&year=${year}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(res => {
      return res
    })
}
function getSaleReportByEQC(locationID, month, year) {
  return fetch(
    ROOT + SALES_REPORT_BY_EQC + `locationID=${locationID}&month=${month}&year=${year}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(res => {
      return res
    })
}

export const sale_report = {
  getSaleReportDetail,
  getSaleReportByEQC,
}
