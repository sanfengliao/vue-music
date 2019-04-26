import {playMode} from "../common/js/config.js"
import { loadSearch, loadPlay, loadFavorite } from "../common/js/cache.js";
const state = {
    singer:{},
    playing:false,
    fullScreen: false,
    playlist:[],
    sequenceList:[],
    desc:{},
    mode:playMode.sequence,
    currentIndex: -1,
    topList:{},
    history:loadSearch(),
    playHistory:loadPlay(),
    favoriteList:loadFavorite(),
    songKey: 'songmid',
    prefix: 'http://isure.stream.qqmusic.qq.com/C400',
    subfix:   '.m4a?guid=9617700196&vkey=5AC6DD68CC04B921C505C6DBD13EB12EDA96BAC13512C132AEFCFD9E63B94CAF9B5537AECFA930979AA9AD39A9B6D268CF33F1076A4D51B6&uin=0&fromtag=66'
}
export default state;
