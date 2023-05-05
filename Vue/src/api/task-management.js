import { ROOT } from '@/api/constant.js'
import {
  APPOINTMENTBYTEACHER_ID,
  APPOINTMENTCATEGORIES_LIST,
  APPOINTMENTFREQUENCYOCCURS_LIST,
  APPOINTMENTID,
  APPOINTMENTTASKPRIORITIES_LIST,
  APPOINTMENTVISIBILITES_LIST,
  APPOINTMENT_ADD,
  APPOINTMENT_UPDATE,
  APPONTMENT_DELETE,
} from './constant'
import { handleResponse } from './handle-response'
import { requestOptions } from './request-options'
function appointmentByID(appointmentByID) {
  return fetch(ROOT + APPOINTMENTID + `AppointmentID=${appointmentByID}`, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function appointment_Update(data) {
  return fetch(ROOT + APPOINTMENT_UPDATE, requestOptions.put(data)).then(data => {
    return data
  })
}
function appointmentByTeacherID(teacherID) {
  return fetch(ROOT + APPOINTMENTBYTEACHER_ID + `pTeacherID=${teacherID}`, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getAppointmentTaskPriorities_List() {
  return fetch(ROOT + APPOINTMENTTASKPRIORITIES_LIST, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getAppointmentFrequencyoccurs_List() {
  return fetch(ROOT + APPOINTMENTFREQUENCYOCCURS_LIST, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function appointment_Delete(appointmentID,isDeleteMaster=false) {
  return fetch(ROOT + APPONTMENT_DELETE + `AppointmentID=${appointmentID}&isDeleteMaster=${isDeleteMaster}`, requestOptions.delete())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getappointmentCatelories_List() {
  return fetch(ROOT + APPOINTMENTCATEGORIES_LIST, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function getappointmentVisibilities_List() {
  return fetch(ROOT + APPOINTMENTVISIBILITES_LIST, requestOptions.get())
    .then(handleResponse)
    .then(data => {
      return data
    })
}
function appointment_Add(data) {
  return fetch(ROOT + APPOINTMENT_ADD, requestOptions.postBody(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}
export const task_management = {
  getAppointmentFrequencyoccurs_List,
  appointmentByID,
  appointmentByTeacherID,
  getAppointmentTaskPriorities_List,
  appointment_Add,
  appointment_Update,
  appointment_Delete,
  getappointmentCatelories_List,
  getappointmentVisibilities_List,
}
