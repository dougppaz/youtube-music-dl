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

chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, onPageChangedAddRules)
})

chrome.runtime.onMessage.addListener(async (message, sender) => {
  switch (message.action) {
    case 'newVideoId':
      console.log('new video id', message.videoId, 'from', sender.tab.id)
      window.videoIds[sender.tab.id] = message.videoId
      break

    case 'requestVideoInfo':
      console.log('request video info', message.videoId)
      if (videoInfos[message.videoId]) break
      videoInfos[message.videoId] = {
        _promise: utils.getVideoInfo(message.videoId)
      }
      videoInfos[message.videoId].result = await videoInfos[message.videoId]._promise
      chrome.runtime.sendMessage({
        action: 'videosInfosUpdated',
        videoInfos
      })
      break

    case 'downloadYTMusic':
      console.log('download video id', message.videoId)
      break

    default:
      console.log('new message', message)
  }
})

window.videoIds = videoIds
window.videoInfos = videoInfos
