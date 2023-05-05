import { loginadmin } from '@/api/login.js'

export function handleResponse(response) {
  return response.text().then(text => {
    if ([401, 403].indexOf(response.status) !== -1) {
      loginadmin.logout()
      window.location.href = '/login'
    }

    return text && JSON.parse(text)
  })
}
export function handleResponseText(response) {
  if ([401, 403].indexOf(response.status) !== -1) {
    loginadmin.logout()
    window.location.href = '/login'
  }
  return response.text().then(text => {
    if (text !== 'true') {
      return { error: text }
    } else {
      return JSON?.parse(text)
    }
  })
}
export function handleResponseLink(response) {
  if ([401, 403].indexOf(response.status) !== -1) {
    loginadmin.logout()
    window.location.href = '/login'
  }
  return response.text().then(text => text)
}
