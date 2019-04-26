export const singer = state => state.singer;

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
    return state.playlist[state.currentIndex] || {}
}

export const topList = (state) => {
    return state.topList;
}

export const searchHistory = state => state.history

export const playHistory = state => state.playHistory;

export const favoriteList = state => state.favoriteList;

export const desc = state => state.desc;
export const songKey = state => state.songKey;
export const prefix = state => state.prefix;
export const subfix = state => state.subfix;
