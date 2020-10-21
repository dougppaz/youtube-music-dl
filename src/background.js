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

const requestVideoInfo = async (videoId) => {
  if (videoInfos[videoId]) return await videoInfos[videoId]._promise
  videoInfos[videoId] = {
    _promise: utils.getVideoInfo(videoId)
  }
  videoInfos[videoId].result = await videoInfos[videoId]._promise
  chrome.runtime.sendMessage({
    action: 'videosInfosUpdated',
    videoInfos
  })
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, onPageChangedAddRules)
})

chrome.runtime.onMessage.addListener(async (message, sender) => {
  switch (message.action) {
    case 'newVideoId':
      console.log('new video id', message.videoId, 'from', sender.tab.id)
      window.videoIds[sender.tab.id] = message.value
      break

    case 'requestVideoInfo':
      console.log('request video info', message.videoId)
      await requestVideoInfo(message.videoId)
      break

    case 'downloadYTMusic':
      console.log('download video id', message.videoId, 'with itag', message.itag)
      await requestVideoInfo(message.videoId)
      utils.download(videoInfos[message.videoId].result.ytInfo, message.itag)
      break

    default:
      console.log('new message', message)
  }
})

window.videoIds = videoIds
window.videoInfos = videoInfos
