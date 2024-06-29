export default {
  async install (Vue, { videoInfos }) {
    Vue.prototype.$videoInfos = Vue.observable({ current: videoInfos })

    chrome.runtime.onMessage.addListener(async (message) => {
      switch (message.action) {
        case 'videoInfosUpdated':
          console.log('video infos updated')
          Vue.set(
            Vue.prototype.$videoInfos,
            'current',
            message.videoInfos
          )
          break

        default:
          console.log('[video-infos plugin] new message', message)
      }
    })
  }
}
