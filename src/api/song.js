import {commonParams} from './config'
import axios from 'axios'

export function getLyric(id) {
  const url = '/api/lyric'
  const data = Object.assign({}, commonParams, {
    nobase64: 1,
    musicid: id,
    callback: 'jsonp1',
    jsonpCallback: 'jsonp1',
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
