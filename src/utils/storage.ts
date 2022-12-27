export function readStorage(key:string) {
  const data = window.localStorage.getItem(key)
  console.log("data", data)
  return (data) ? JSON.parse(data) : data
}

export function writeStorage(key:string, item:string) {
  window.localStorage.setItem(key, item)
}