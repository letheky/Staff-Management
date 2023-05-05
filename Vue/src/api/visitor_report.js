import {
    ROOT,
  } from "@/api/constant.js";
  import { handleResponse } from "@/api/handle-response";
  import { requestOptions } from "@/api/request-options";
import { GET_LIST_VISITOR } from "./constant";

  
  
  
  function getVisitorList(locationID , fromDate , toDate) {
    return fetch(ROOT + GET_LIST_VISITOR + `locationID=${locationID}&fromDate=${fromDate}&toDate=${toDate}`, requestOptions.get())
      .then(handleResponse)
      .then((data) => {
        return data;
      });
  }
  
  export const visitor_report= {
    getVisitorList
  };
  