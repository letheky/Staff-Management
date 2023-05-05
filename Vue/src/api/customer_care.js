import {
    ROOT,
  } from "@/api/constant.js";
  import { handleResponse } from "@/api/handle-response";
  import { requestOptions } from "@/api/request-options";
import {  GET_CUSTOMERCARE_REPORT } from "./constant";
  
  
  
  function getCustomerCare(locationID , fromDate , toDate) {
    return fetch(ROOT + GET_CUSTOMERCARE_REPORT + `locationID=${locationID}&fromDate=${fromDate}&toDate=${toDate}`, requestOptions.get())
      .then(handleResponse)
      .then((data) => {
        return data;
      });
  }
  
  export const customer_care = {
    getCustomerCare
  };
  