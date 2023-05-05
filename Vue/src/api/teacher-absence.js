import {
  ROOT,
  REGISTER_TEACHER_ABSENCE,
  UPDATE_TEACHER_ABSENCE,
  DELETE_TEACHER_ABSENCE,
  LEAVE_TEACHER_ABSENCE,
} from "@/api/constant.js";
import { handleResponse } from "@/api/handle-response";
import { requestOptions } from "@/api/request-options";

function registerAbsence(data, params, reason) {
  return fetch(
    ROOT +
      REGISTER_TEACHER_ABSENCE +
      "fromTime=" +
      data +
      "&toTime=" +
      params +
      "&reason=" +
      reason,
    requestOptions.post()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function updateAbsence(leaveID, fromTime, toTime, reason) {
  return fetch(
    ROOT +
      UPDATE_TEACHER_ABSENCE +
      "leaveOfAbsenceID=" +
      leaveID +
      "&fromTime=" +
      fromTime +
      "&toTime=" +
      toTime +
      "&reason=" +
      reason,
    requestOptions.putNoBody()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function deleteAbsence(leaveID) {
  return fetch(
    ROOT + DELETE_TEACHER_ABSENCE + "leaveOfAbsenceID=" + leaveID,
    requestOptions.delete()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function leaveAbsence(teacherID) {
  return fetch(
    ROOT + LEAVE_TEACHER_ABSENCE + "teacherID=" + teacherID,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

export const teacher_absence = {
  registerAbsence,
  updateAbsence,
  deleteAbsence,
  leaveAbsence,
};
