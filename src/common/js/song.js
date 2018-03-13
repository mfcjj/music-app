import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'

function unescapeHTML(lrc) {
  let t = document.createElement('div')
  t.innerHTML = lrc + ''
  return t.innerHTML
}
/* eslint-disable */
export default class Song {
  constructor(id, mid, singer, name, album, duration, image, url) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric() {
    // 已经有了歌词就不再请求
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.id).then((res) => {
        res = JSON.parse(res.slice(7, -1))
        if (res.retcode === ERR_OK) {
          this.lyric = unescapeHTML(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
}

export function createSong(musicData) {
  return new Song(
    musicData.songid,
    musicData.songmid,
    filterSinger(musicData.singer),
    musicData.songname, musicData.albumname,
    musicData.interval,
    `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    `http://ws.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=38`)
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((item) => {
    ret.push(item.name)
  })
  return ret.join('/')
}
