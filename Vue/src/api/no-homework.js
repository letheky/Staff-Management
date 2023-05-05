import { handleResponse } from './handle-response'

const { ROOT, GET_NO_HOMEWORK} = require('./constant')
const { requestOptions } = require('./request-options')

  function getNoHomeWork(locationID , date){
    return fetch(ROOT + GET_NO_HOMEWORK + `centerID=${locationID}&date=${date}` , requestOptions.get())
    .then(handleResponse)
    .then((data)=>{
        return data
    })
  }
export const no_homework = {
    getNoHomeWork
}
