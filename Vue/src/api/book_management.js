import { handleResponse } from './handle-response'

const { ROOT, BOOK_INVENTORY, INVTORDERBYCENTER } = require('./constant')
const { requestOptions } = require('./request-options')

function getBookInventory(locationID, month, year) {
  return fetch(
    ROOT + BOOK_INVENTORY + `LocationID=${locationID}&Month=${month}&Year=${year}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getInvtOrderByCenter(locationID, fromDate, toDate) {
  return fetch(
    ROOT + INVTORDERBYCENTER + `LocationID=${locationID}&fromDate=${fromDate}&toDate=${toDate}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}
export const book_management = {
  getBookInventory,
  getInvtOrderByCenter,
}
