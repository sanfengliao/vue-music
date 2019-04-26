import Axios from "axios";

import {commonParams} from "./config"

export function getLyrics(mid) {
    const data = Object.assign({},commonParams, {
        pcachetime:new Date(),
        songmid: mid,
        needNewCode: 0,
        platform:"yqq",
        hostUin:0,
        loginUin:0,
        format: 'json'
    });
    let res = Axios.get("api/lyric",{
        params:data,
    }).then((res) => {
        return Promise.resolve(res.data);
    })
    return res;
}
