import {getLyrics} from "../../api/song.js"
import {ERR_OK} from "../../api/config"
import {Base64} from "js-base64"

export class Song {
    constructor({id, mid, singer, name, album, duration, image, url}) {
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
        if (this.lyric) {
            return Promise.resolve(this.lyric)
        }
        return new Promise((resolve, reject) => {
            getLyrics(this.mid).then((res) => {
                if (res.retcode === ERR_OK) {
                    this.lyric = Base64.decode(res.lyric);
                    resolve(this.lyric)
                } else {
                    reject('no lyric')
                }
            })
        })
      }
}

export function createSong(musicData, key='', prefix='', subfix='') {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url: prefix + musicData[key] + subfix
      })
}

export function filterSinger(singers) {
    let ret = []
    if (!singers) {
        return ''
    }
    singers.forEach((s) => {
        ret.push(s.name)
    })
    return ret.join('/')
}
