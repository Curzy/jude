import UUID from 'node-uuid'
import { APP_MODES } from './appReducer'

export const actions = {
  PLAYLIST_SONG_ADDED: 'PLAYLIST_SONG_ADDED',
  PLAYLIST_SONG_REMOVED: 'PLAYLIST_SONG_REMOVED',
  PLAYLIST_DATA_REPLACED: 'PLAYLIST_DATA_REPLACED',
  PLAYLIST_ACTIVE_SONG_UPDATED: 'PLAYLIST_ACTIVE_SONG_UPDATED',
  PLAYLIST_SHUFFLE_ENABLED: 'PLAYLIST_SHUFFLE_ENABLED',
  PLAYLIST_SHUFFLE_DISABLED: 'PLAYLIST_SHUFFLE_DISABLED',
  PLAYLIST_REPEAT_ONE_ENABLED: 'PLAYLIST_REPEAT_ONE_ENABLED',
  PLAYLIST_REPEAT_ALL_ENABLED: 'PLAYLIST_REPEAT_ALL_ENABLED',
  PLAYLIST_REPEAT_DISABLED: 'PLAYLIST_REPEAT_DISABLED',
}

export function getItemIndex(playlist, target) {
  return target ? playlist.songs.findIndex(item => item.uuid === target.uuid) : null
}

export function getActiveItemIndex(playlist) {
  return playlist.songs.findIndex(item => item.uuid === playlist.activeSong.uuid)
}

export function getNextItem(playlist) {
  return playlist.activeSong ? playlist.songs[getActiveItemIndex(playlist) + 1] : null
}

export function getPrevItem(playlist) {
  return playlist.activeSong ? playlist.songs[getActiveItemIndex(playlist) - 1] : null
}

export function addSong(id, title) {
  return (dispatch, getState) => {
    const { playlist } = getState()
    const { activeSong, songs } = playlist
    const uuid = UUID.v4()
    const index = activeSong ? songs[songs.length - 1].index + 1 : 0

    const song = { id, title, uuid, index }

    dispatch({
      type: actions.PLAYLIST_SONG_ADDED,
      song,
    })
  }
}

export function removeItemFromPlaylist(item) {
  return (dispatch, getState) => {
    const { playlist, player } = getState()
    const { activeSong } = playlist

    const itemIndex = getItemIndex(playlist, item)
    const nextItem = playlist.songs[itemIndex + 1]

    dispatch({
      type: actions.PLAYLIST_SONG_REMOVED,
      songs: playlist.songs.filter(v => v.uuid !== item.uuid),
      doesNextItemExist: !!nextItem,
    })

    if (activeSong.uuid === item.uuid) {
      dispatch(updateActiveSong(nextItem))
    }
  }
}

export function updateActiveSong(activeSong) {
  return (dispatch, getState) => {
    const { playlist, player } = getState()
    const { youtubePlayer, updatePercentage } = player
    const { songs } = playlist

    dispatch({
      type: actions.PLAYLIST_ACTIVE_SONG_UPDATED,
      activeSong,
      nextSong: activeSong
        ? songs[songs.findIndex(song => song.uuid === activeSong.uuid) + 1] || null
        : null,
    })

    // if (!song) {
    //   youtubePlayer.stopVideo()
    // } else if (activeSong && (song.id === activeSong.id)) {
    //   youtubePlayer.seekTo(0)
    // }
  }
}

export function replacePlaylistData(payload) {
  return {
    type: actions.PLAYLIST_DATA_REPLACED,
    ...payload,
  }
}

export function enableShuffle() {
  return (dispatch, getState) => {
    dispatch({ type: actions.PLAYLIST_SHUFFLE_ENABLED })
    dispatch(enableRepeatAll())
  }
}

export function disableShuffle() {
  return { type: actions.PLAYLIST_SHUFFLE_DISABLED }
}

export function enableRepeatOne() {
  return { type: actions.PLAYLIST_REPEAT_ONE_ENABLED }
}

export function enableRepeatAll() {
  return { type: actions.PLAYLIST_REPEAT_ALL_ENABLED }
}

export function disableRepeat() {
  return { type: actions.PLAYLIST_REPEAT_DISABLED }
}

export const initialState = {
  songs: [],
  shuffle: false,
  repeat: false,
  activeSong: null,
  nextItem: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.PLAYLIST_SONG_ADDED:
      return { ...state,
        songs: [...state.songs, action.song],
      }

    case actions.PLAYLIST_SONG_REMOVED:
      return { ...state,
        songs: action.songs,
        doesNextItemExist: action.doesNextItemExist,
      }

    case actions.PLAYLIST_DATA_REPLACED:
      const activeSongIndex = action.activeSong ? action.songs.findIndex(v => v.uuid === action.activeSong.uuid) : -1

      return {
        songs: action.songs,
        activeSong: action.activeSong,
        doesNextItemExist: activeSongIndex !== -1 ? !!action.songs[activeSongIndex + 1] : false,
        shuffle: action.isShuffleOn,
        repeat: action.repeatingMode === 'none' ? false : action.repeatingMode,
      }

    case actions.PLAYLIST_ACTIVE_SONG_UPDATED:
      return { ...state,
        activeSong: action.activeSong,
        nextSong: action.nextSong,
      }

    case actions.PLAYLIST_SHUFFLE_ENABLED:
      return { ...state,
        shuffle: true,
      }

    case actions.PLAYLIST_SHUFFLE_DISABLED:
      return { ...state,
        shuffle: false,
      }

    case actions.PLAYLIST_REPEAT_ONE_ENABLED:
      return { ...state,
        repeat: 'one',
      }

    case actions.PLAYLIST_REPEAT_ALL_ENABLED:
      return { ...state,
        repeat: 'all',
      }

    case actions.PLAYLIST_REPEAT_DISABLED:
      return { ...state,
        repeat: false,
      }

    default:
      return state
  }
}
