import { get, set } from 'lodash-es'
import utils from './utils'

const videoIds = {}
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

const getVideoInfo = async (tabId, videoId) => {
  const videoInfoPath = `${tabId}.${videoId}`
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
  let tabId = (sender.tab && sender.tab.id) || message.tabId
  let state
  let videoId
  let videoInfo
  switch (message.action) {
    case 'requestVideoInfo':
      console.log('tab', tabId, 'request video info', message.videoId)
      await getVideoInfo(tabId, message.videoId)
      break
    case 'downloadYTMusic':
      console.log('tab', tabId, 'download video id', message.videoId, 'with itag', message.itag)
      videoInfo = await getVideoInfo(tabId, message.videoId)
      utils.download(videoInfo, message.itag)
      break
    case 'downloadFromPlayerButton':
      state = JSON.parse(message.state)
      videoId = get(state, 'player.playerResponse.videoDetails.videoId')
      console.log('tab', tabId, 'download video id', videoId)
      videoInfo = await getVideoInfo(tabId, videoId)
      utils.download(videoInfo)
      break
    case 'newYtMusicAppState':
      state = JSON.parse(message.value)
      videoId = get(state, 'player.playerResponse.videoDetails.videoId')
      if (!videoId) return console.log('new yt music app state without videoId')
      console.log('new yt music app state for', videoId)
      if (videoId !== videoIds[sender.tab.id]) {
        console.log('new video id', videoId, 'setted to', sender.tab.id)
        videoIds[sender.tab.id] = videoId
      }
      set(videoInfos, `${sender.tab.id}.${videoId}.tags`, utils.getMusicTagsFromYTMusicAppState(state))
      chrome.runtime.sendMessage({
        action: 'videoInfosUpdated',
        videoInfos
      })
      await getVideoInfo(sender.tab.id, videoId)
      break
    default:
      console.log('new message', message)
  }
})

window.videoIds = videoIds
window.videoInfos = videoInfos
