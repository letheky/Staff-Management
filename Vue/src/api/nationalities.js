import {
  ROOT,
  GET_COUNTRIES,
  GET_CITIES,
  GET_DISTRICTS,
  GET_DISTRICTS_BY_CITY,
} from "@/api/constant.js";
import { handleResponse } from "@/api/handle-response";
import { requestOptions } from "@/api/request-options";
function getCountries() {
  return fetch(ROOT + GET_COUNTRIES, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getCities() {
  return fetch(ROOT + GET_CITIES, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getDistricts() {
  return fetch(ROOT + GET_DISTRICTS, requestOptions.get())
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function getDistrictsByCity(data) {
  return fetch(
    ROOT + GET_DISTRICTS_BY_CITY + "?cityID=" + data,
    requestOptions.get()
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

export const nationalities = {
  getCountries,
  getCities,
  getDistricts,
  getDistrictsByCity,
};
