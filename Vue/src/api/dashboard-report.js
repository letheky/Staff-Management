import { ROOT, GET_PTSTUDENTS, UPDATE_PTSTUDENTS, GET_REGISTRATIONSTATE, UPDATE_REGISTRATIONSTATE} from "@/api/constant.js";
import { handleResponse } from "@/api/handle-response";
import { requestOptions } from "@/api/request-options";



function getPTReport(locationId, fromDate, toDate) {
  return fetch(
    ROOT + GET_PTSTUDENTS + `locationID=${locationId}&startDate=${fromDate}&endDate=${toDate}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getRSReport(locationId, fromDate, toDate, regisStatusID) {
  return fetch(
    ROOT + GET_REGISTRATIONSTATE + `locationID=${locationId}&startDate=${fromDate}&endDate=${toDate}&regisStatusID=${regisStatusID}`,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function updatePTRemark(id,remark) {
    return fetch(ROOT + UPDATE_PTSTUDENTS+ `PlacementTestID=${id}&note=${remark}`, requestOptions.put())
      .then(handleResponse)
      .then(res => {
        return res
      })
  }
function updateRSNote(id,remark) {
    return fetch(ROOT + UPDATE_REGISTRATIONSTATE+ `RegistrationID=${id}&note=${remark}`, requestOptions.put())
      .then(handleResponse)
      .then(res => {
        return res
      })
  }

export const dashboard_report = {
    getPTReport,
    updateRSNote,
    updatePTRemark,
    getRSReport
};
