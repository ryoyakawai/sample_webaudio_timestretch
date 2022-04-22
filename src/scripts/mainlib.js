"use strict";

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec))

const toggle_button_disable = (elem = null) => {
  if (Array.isArray(elem)) {
    elem.forEach( item => {
      item.disabled = !item.disabled
    })
  } else {
    elem.disabled = !elem.disabled
  }
}

const getGetParams = (getConf = {}) => {
  const keys = Object.keys(getConf)
  if (keys.length < 1) return {}
  const url = new URL(window.location.href)
  const raw_params = url.searchParams
  let result = {}
  for (let i = 0; i < keys.length; i += 1) {
    switch (getConf[keys[i]]) {
      case 'Number':
        result[keys[i]] = Number(raw_params.get(keys[i]))
        break
      case 'String':
        result[keys[i]] = raw_params.get(keys[i]) == null ? '' : String(raw_params.get(keys[i])).split(' ')
        break
    }
  }
  return result
}

const convTimeFormatFromSec = (current_position = 0) => {
  const hour = ('00' + parseInt(current_position / 3600)).substr(-2)
  const min = ('00' + parseInt((current_position / 60) % 60)).substr(-2)
  const sec = ('00' + parseInt(current_position % 60)).substr(-2)
  const msec = (String(current_position).split('.').pop()).substr(0, 2)
  return [hour, min, sec, msec]
}


export {
  sleep,
  toggle_button_disable,
  getGetParams,
  convTimeFormatFromSec
}

