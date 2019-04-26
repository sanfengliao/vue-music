const puppeteer = require('puppeteer')
const rp = require('request-promise-native')
const URL = 'https://y.qq.com/portal/singer_list.html'
const PLAYER_URL = 'https://y.qq.com/portal/player.html'

const SINGER_LIST_URL = 'https://u.y.qq.com/cgi-bin/musicu.fcg?-=getUCGI6869879122642524&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&data=%7B%22comm%22%3A%7B%22ct%22%3A24%2C%22cv%22%3A0%7D%2C%22singerList%22%3A%7B%22module%22%3A%22Music.SingerListServer%22%2C%22method%22%3A%22get_singer_list%22%2C%22param%22%3A%7B%22area%22%3A-100%2C%22sex%22%3A-100%2C%22genre%22%3A-100%2C%22index%22%3A-100%2C%22sin%22%3A0%2C%22cur_page%22%3A1%7D%7D%7D'
const SINGER_SONG_LIST_URL = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&hostUin=0&needNewCode=0&platform=yqq&order=listen&begin=0&num=80&songstatus=1&singermid='


const crawler = async () =>{
    console.log('start crawl data')
    let singerBody = await rp.get(SINGER_LIST_URL)
    let singer = JSON.parse(singerBody).singerList.data.singerlist[1]
    let songBody = await rp.get(SINGER_SONG_LIST_URL+singer.singer_mid)
    let musicData = JSON.parse(songBody).data.list[0].musicData
    const brower = await puppeteer.launch()
    let page = await brower.newPage()
    await page.goto(URL, {
        waitUntil: 'networkidle2'
    })
    const result = await page.evaluate(() => {
        return document.querySelectorAll('.singer_list__title a')[1].href;
    })
    let url = ''
    if (result) {
        await page.goto(result, {
            waitUntil: 'networkidle2'
        })
        await page.click('.list_menu__icon_play')
        await page.goto(PLAYER_URL, {
            waitUntil: 'networkidle2'
        })
        console.log(page.url())
        let s = await page.evaluate(() => {
            return document.querySelector('audio').src
        })
        console.log(s)
        let k, fix
        for (let key in musicData) {
            if (typeof musicData[key] === 'string' && musicData[key]) {
                if (s.indexOf(musicData[key]) !== -1) {
                    k = key
                    fix = s.split(musicData[key])
                    break
                }
            }
        }
        console.log(k, fix)
        process.send({k, fix})
    }
    brower.close()
}
crawler()
setInterval(crawler, 86400000);
