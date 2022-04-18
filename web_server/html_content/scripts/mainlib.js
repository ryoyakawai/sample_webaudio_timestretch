"use strict";

const getGetParams = (getConf={}) => {
  const keys = Object.keys(getConf)
  if (keys.length<1) return {}
  const url = new URL(window.location.href)
  const raw_params = url.searchParams
  let result = {}
  for (let i=0; i<keys.length; i+=1) {
    switch (getConf[keys[i]]) {
      case 'Number':
        result[keys[i]] = Number(raw_params.get(keys[i]))
        break
      case 'String':
        result[keys[i]] = raw_params.get(keys[i])==null ? '' : String(raw_params.get(keys[i])).split(' ')
        break
    }
  }
  return result
}

export {
  getGetParams
}

