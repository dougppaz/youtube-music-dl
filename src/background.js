const videoIds = {}

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

chrome.runtime.onMessage.addListener((message, sender) => {
  switch (message.action) {
    case 'newVideoId':
      console.log('new video id', message.videoId, 'from', sender.tab.id)
      window.videoIds[sender.tab.id] = message.videoId
      break

    case 'downloadYTMusic':
      console.log('download video id', message.videoId)
      break

    default:
      console.log('new message', message)
  }
})

window.videoIds = videoIds
