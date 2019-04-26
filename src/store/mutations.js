import * as types from "./matutation-types.js";
//console.log(types.SET_SINGER);
const matutations = {
    [types.SET_SINGER](state, singer) {
        state.singer = singer;
    },
    [types.SET_CURRENT_INDEX](state, currentIndex) {
        state.currentIndex = currentIndex;
    },
    [types.SET_PLAYING_STATE](state, playing) {
        state.playing = playing;
    },
    [types.SET_FULL_SCREEN](state, fullScreen) {
        state.fullScreen = fullScreen;
    },
    [types.SET_PLAYLIST](state, playList) {
        state.playlist = playList;
    },
    [types.SET_SEQUENCE_LIST](state, sequenceList) {
        state.sequenceList = sequenceList;
    },
    [types.SET_PLAY_MODE](state, mode) {
        state.mode = mode;
    },
    [types.SET_TOP_LIST](state, topList) {
        state.topList = topList
    },
    [types.SET_SEARCH_HISTORY](state, history) {
        state.history = history
    },
    [types.SET_PLAY_HISTORY](state, history) {
        state.playHistory = history
    },
    [types.SET_FAVORITE_LIST](state, list) {
        state.favoriteList = list;
    },
    [types.SET_DESC](state, desc) {
        state.desc = desc;
    },
    [types.SET_SONG_KEY](state, songKey) {
      state.songKey = songKey
    },
    [types.SET_PREFIX](state, prefix) {
      state.prefix = prefix
    },
    [types.SET_SUBFIX](state, subfix) {
      state.subfix = subfix
    }
}

export default matutations;
