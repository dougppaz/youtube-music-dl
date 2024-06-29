import { get, set } from 'lodash-es'
import utils from './utils.js'

let videoId = null
const videoInfos = {}

const onPageChangedAddRules = () => {
  chrome.declarativeContent.onPageChanged.addRules([
    {
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {
            hostEquals: 'music.youtube.com'
          }
        })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }
  ])
}

const getVideoInfo = async (videoId) => {
  const videoInfoPath = videoId
  const getYTVideoInfoPromisePath = `${videoInfoPath}._promises.getYTVideoInfo`
  if (!get(videoInfos, getYTVideoInfoPromisePath)) set(videoInfos, getYTVideoInfoPromisePath, utils.getYTVideoInfo(videoId))
  set(videoInfos, `${videoInfoPath}.ytVideoInfo`, await get(videoInfos, getYTVideoInfoPromisePath))
  chrome.runtime.sendMessage({
    action: 'videoInfosUpdated',
    videoInfos
  })
  return get(videoInfos, videoInfoPath)
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, onPageChangedAddRules)
})

chrome.runtime.onMessage.addListener(async (message, sender) => {
  let state
  let newVideoId
  let videoInfo
  switch (message.action) {
    case 'requestVideoInfo':
      console.log('request video info', message.videoId)
      await getVideoInfo(message.videoId)
      break
    case 'downloadYTMusic':
      console.log('download video id', message.videoId, 'with itag', message.itag)
      videoInfo = await getVideoInfo(message.videoId)
      utils.download(videoInfo, message.itag)
      break
    case 'downloadFromPlayerButton':
      state = JSON.parse(message.state)
      videoId = get(state, 'player.playerResponse.videoDetails.videoId')
      console.log('download video id', videoId)
      videoInfo = await getVideoInfo(videoId)
      utils.download(videoInfo)
      break
    case 'newYtMusicAppState':
      state = JSON.parse(message.value)
      newVideoId = get(state, 'player.playerResponse.videoDetails.videoId')
      if (!videoId) return console.log('new yt music app state without videoId')
      console.log('new yt music app state for', videoId)
      if (videoId !== newVideoId) {
        console.log('new video id', videoId)
        videoId = newVideoId
        chrome.runtime.sendMessage({
          action: 'videoIdUpdated',
          videoId
        })
      }
      set(videoInfos, `${videoId}.tags`, utils.getMusicTagsFromYTMusicAppState(state))
      chrome.runtime.sendMessage({
        action: 'videoInfosUpdated',
        videoInfos
      })
      await getVideoInfo(videoId)
      break
    default:
      console.log('new message', message)
  }
})
