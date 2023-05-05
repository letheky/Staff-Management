import {
    ROOT,
  } from "@/api/constant.js";
  import { handleResponse } from "@/api/handle-response";
  import { requestOptions } from "@/api/request-options";
import { COURSE_OVERVIEW_INTER } from "./constant";
  
  
  
  function getCourseInter(locationID , classStatusID) {
    return fetch(ROOT + COURSE_OVERVIEW_INTER + `locationID=${locationID}&classStatusID=${classStatusID}`, requestOptions.get())
      .then(handleResponse)
      .then((data) => {
        return data;
      });
  }
  
  export const course_inter = {
    getCourseInter
  };
  