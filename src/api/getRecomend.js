import jsonp from "../common/js/jsonp.js"
import {commonParams, options} from "./config.js"
import Axios from "axios"
export function getRecommend() {
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
    let data = Object.assign({}, commonParams, {
        platform: "h5",
        uin:0,
        needNewCode:1
    });
    return jsonp(url, data, options);
}

export function getDesc(disstid) {
   const url = "/api/desc"
   let data = Object.assign({}, commonParams, {
    format:"json",
    uin:0,
    platform:'h5',
    needNewCode:1,
    new_format:1,
    pic:500,
    disstid:disstid,
    type:1,
    json:1,
    utf8:1,
    onlysong:0,
    picmid:1,
    nosign:1,
    song_begin:0,
    song_num:15,
    _:1529248735895
   })
   return Axios.get(url, {
       params: data
   }).then((res) => {
       return res.data;
   })
   
}