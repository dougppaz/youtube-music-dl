export default {
  async install (Vue, { videoInfos, tab }) {
    const getVideoInfos = videoInfos => (videoInfos[tab.id])

    Vue.prototype.$videoInfos = Vue.observable({
      current: getVideoInfos(videoInfos),
      tab
    })

    chrome.runtime.onMessage.addListener(async (message) => {
      switch (message.action) {
        case 'videoInfosUpdated':
          console.log('video infos updated')
          Vue.set(
            Vue.prototype.$videoInfos,
            'current',
            getVideoInfos(message.videoInfos)
          )
          break

        default:
          console.log('[video-infos plugin] new message', message)
      }
    })
  }
}
