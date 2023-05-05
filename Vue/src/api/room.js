import { GET_NO_ROOM, GET_ROOM_CALENDAR, GET_ROOM_FREE, ROOT, SET_ROOM } from './constant'
import { handleResponse } from './handle-response'
import { requestOptions } from './request-options'

function getListRoomCalendar(locationID, date) {
  return fetch(
    ROOT + GET_ROOM_CALENDAR + `locationID=${locationID}&&checkDate=${date}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getNoRoom(locationID, date) {
  return fetch(
    ROOT + GET_NO_ROOM + `locationID=${locationID}&&checkDate=${date}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getListRoom(locationID, date) {
  return fetch(
    ROOT + GET_ROOM_FREE + `locationId=${locationID}&&fromTime=${date}&&toTime=${date}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function updateRoom(data) {
  return fetch(ROOT + SET_ROOM, requestOptions.put(data))
    .then(handleResponse)
    .then(data2 => {
      return data2
    })
}
export const room = {
  getListRoomCalendar,
  getListRoom,
  getNoRoom,
  updateRoom,
}
