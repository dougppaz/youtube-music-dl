export default {
  install (Vue, { videoInfos: infos }) {
    Vue.prototype.$videoInfos = Vue.observable({ infos })

    chrome.runtime.onMessage.addListener(async (message) => {
      switch (message.action) {
        case 'videosInfosUpdated':
          console.log('video infos updated')
          Vue.set(Vue.prototype.$videoInfos, 'infos', message.videoInfos)
          break

        default:
          console.log('new message', message)
      }
    })
  }
}
