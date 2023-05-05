import { handleResponse } from './handle-response'

const { ROOT, GET_TELESALE } = require('./constant')
const { requestOptions } = require('./request-options')

function getTelesale(locationID, fromDate, toDate) {
  return fetch(
    ROOT + GET_TELESALE + `centerID=${locationID}&fromDate=${fromDate}&toDate=${toDate}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}
export const telesale = {
  getTelesale,
}
