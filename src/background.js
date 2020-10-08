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
