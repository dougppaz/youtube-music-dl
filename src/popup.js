import Vue from 'vue'
import MusicDownload from './components/music-download.js'
import VideoInfos from './plugins/video-infos.js'

(() => {
  const background = chrome.extension.getBackgroundPage()

  chrome.tabs.getSelected(null, tab => {
    Vue.use(VideoInfos, { videoInfos: background.videoInfos, tab })

    return new Vue({
      el: '#app',
      components: {
        MusicDownload
      },
      data () {
        return {
          videoId: background.videoIds[tab.id]
        }
      }
    })
  })
})()
