// import jsonp from 'common/js/jsonp'
import {commonParams} from './config'
import axios from 'axios'

// export function getSingerList() {
//   const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
//   const data = Object.assign({}, commonParams, {
//     channel: 'singer',
//     page: 'list',
//     key: 'all_all_all',
//     pagesize: 100,
//     pagenum: 1,
//     g_tk: 1185241743,
//     jsonpCallback: 'GetSingerListCallback',
//     loginUin: 2047546353,
//     hostUin: 0,
//     format: 'jsonp',
//     inCharset: 'utf8',
//     outCharset: 'utf-8',
//     notice: 0,
//     platform: 'yqq',
//     needNewCode: 0
//   })
//   return jsonp(url, data, options)
// }

export function getSingerList() {
  const url = '/api/getSingerList'
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    g_tk: 1185241743,
    jsonpCallback: 'GetSingerListCallback',
    loginUin: 2047546353,
    hostUin: 0,
    format: 'jsonp',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
export function getSingerDetail(singerId) {
  const url = '/api/getSingerDetail'
  const data = Object.assign({}, commonParams, {
    uin: 0,
    format: 'json',
    notice: 0,
    platform: 'h5page',
    needNewCode: 1,
    order: 'listen',
    from: 'h5',
    num: 100,
    begin: 0,
    g_tk: 5381,
    singerid: singerId
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
