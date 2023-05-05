export function getObjectPermission(id) {
  const arrListPer = JSON.parse(localStorage.getItem('functionRole'))

  return arrListPer
    ? arrListPer.find(per => {
        return per.functionID === id
      })
    : {}
}
