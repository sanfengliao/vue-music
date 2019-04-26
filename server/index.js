const cp = require('child_process')
const {resolve} = require('path')
const rp = require('request-promise-native')
const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
let data = {}
const child = cp.fork(resolve(__dirname, './crawler/music-crawl.js'))
child.on('message', (msg) => {
  data = msg
})

const router = new Router()
router.get('/api/music-info', async (ctx, next) => {
  ctx.response.set('Access-Control-Allow-Origin', '*')
  ctx.body = data
})

router.get('/api/lyric', async (ctx, next) => {
  let data = await rp.get('https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg', {
    qs: ctx.request.query,
    headers:{
      Referer: 'https://y.qq.com/portal/player.html',
    }
  })
  ctx.body = data
})

router.get('/api/desc', async (ctx, next) => {
  let data = await rp.get('https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg', {
    qs: ctx.request.query,
    headers:{
      Referer:"https://y.qq.com/w/taoge.html?ADTAG=myqq&from=myqq&channel=10007100&id=" + ctx.request.query.disstid
    },
  })
  ctx.body = data
})

app.use(router.routes()).use(router.allowedMethods())
app.listen(3000, function() {
  console.log("server running at 3000")
})
