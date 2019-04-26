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
    songKey: '',
    prefix: '',
    subfix: ''
}

export default state;
