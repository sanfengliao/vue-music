import * as types from "./matutation-types.js";
import {playMode} from "../common/js/config.js"
import {shuffle} from "../common/js/utils.js"
import { saveSearch, deleteSearch, clearHistory, savePlay, saveFavorite, deleteFavorite } from "../common/js/cache.js";
function findIndex(list, song) {
    let index = list.findIndex((item) => {
        return item.id === song.id;
    })
    return index;
}
export const selectPlay = function({commit, state}, {list, index}){
    commit(types.SET_SEQUENCE_LIST, list);
    if (state.mode === playMode.random) {
        let randomList = shuffle(list);
        commit(types.SET_PLAYLIST, randomList);
        index = findIndex(randomList, list[index]);
    } else {
        commit(types.SET_PLAYLIST, list);
    }
    commit(types.SET_PLAY_MODE,playMode.sequence);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING_STATE, true);
    commit(types.SET_CURRENT_INDEX, index);
}

export const randomPlay = function({commit}, {list,index}) {
    commit(types.SET_PLAY_MODE, playMode.random);
    commit(types.SET_SEQUENCE_LIST, list);
    commit(types.SET_PLAYLIST,shuffle(list));
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING_STATE, true);
    commit(types.SET_CURRENT_INDEX, index);

}

export const insertSong = function({commit, state}, song) {
    let playlist = state.playlist.slice();
    let sequenceList = state.sequenceList.slice();
    let currentIndex = state.currentIndex;
    //获取当前播放的歌曲
    let currentSong = playlist[currentIndex];
    let fpIndex = findIndex(playlist, song);
    currentIndex ++;
    playlist.splice(currentIndex, 0 , song);
    if (fpIndex > -1) {
        if (currentIndex > fpIndex) {
            playlist.splice(fpIndex, 1);
            currentIndex--;
        } else {
            playlist.splice(fpIndex+1, 1);
        }
    }
    let currentSIndex = findIndex(sequenceList, currentSong) + 1

    let fsIndex = findIndex(sequenceList, song)

    sequenceList.splice(currentSIndex, 0, song)

    if (fsIndex > -1) {
      if (currentSIndex > fsIndex) {
        sequenceList.splice(fsIndex, 1)
      } else {
        sequenceList.splice(fsIndex + 1, 1)
      }
    }
    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function({commit}, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query));
}

export const deleteSearchHistory = function({commit}, query) {
    commit(types.SET_SEARCH_HISTORY, deleteSearch(query));
}

export const clearSearchHistory = function({commit}) {
    commit(types.SET_SEARCH_HISTORY, clearHistory());
}

export const deleteSong = function({commit, state}, song) {
    let playlist = state.playlist.slice();
    let sequenceList = state.sequenceList.slice();
    let currentIndex = state.currentIndex;
    let pIndex = findIndex(playlist, song)
    playlist.splice(pIndex, 1);
    let sIndex = findIndex(sequenceList, song)
    sequenceList.splice(sIndex, 1)
    if (currentIndex > pIndex || currentIndex === playlist.length) {
        currentIndex--;
    }
    commit(types.SET_PLAYLIST, playlist);
    commit(types.SET_SEQUENCE_LIST, sequenceList);
    commit(types.SET_CURRENT_INDEX, currentIndex);
    if (!playlist.length) {
        commit(types.SET_PLAYING_STATE, false);
    } else {
        commit(types.SET_PLAYING_STATE, true);
    }
}

export const deleteSongList = function({commit}) {
    commit(types.SET_PLAYLIST,[]);
    commit(types.SET_SEQUENCE_LIST,[]);
    commit(types.SET_CURRENT_INDEX, -1);
    commit(types.SET_PLAYING_STATE, false);
}

export const savePlayHistory = function({commit}, song) {
    commit(types.SET_PLAY_HISTORY, savePlay(song));
}

export const saveFavoriteList = function ({commit}, song) {
    commit(types.SET_FAVORITE_LIST, saveFavorite(song))
  }

export const deleteFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}

export const setMusicInfo = function({commit}, musicInfo) {
  commit(types.SET_SONG_KEY, musicInfo.key)
  commit(types.SET_PREFIX, musicInfo.prefix)
  commit(types.SET_SUBFIX, musicInfo.subfix)
}
