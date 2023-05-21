import { ROOT, UPLOAD_FILE } from '@/api/constant.js'
import { handleResponse } from '@/api/handle-response'
import { requestOptions } from '@/api/request-options'

function uploadFile(data) {
  return fetch(ROOT + UPLOAD_FILE, requestOptions.postImage(data))
    .then(handleResponse)
    .then(data => {
      return data
    })
}

export const upload = {
  uploadFile,
}
