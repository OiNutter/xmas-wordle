export function readStorage(key:string) {
  const data = window.localStorage.getItem(key)
  return (data) ? JSON.parse(data) : data
}

export function writeStorage(key:string, item:string) {
  window.localStorage.setItem(key, item)
}