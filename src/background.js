window.videoId = null

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

chrome.runtime.onMessage.addListener((message) => {
  switch (message.action) {
    case 'newVideoId':
      window.videoId = message.videoId
      console.log('new video id', window.videoId)
      break

    default:
      console.log('new message', message)
  }
})
