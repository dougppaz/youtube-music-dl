import Vue from 'vue'
import MusicDownload from './components/music-download'
import VideoInfos from './plugins/video-infos'

(() => {
  const background = chrome.extension.getBackgroundPage()

  Vue.use(VideoInfos, { videoInfos: background.videoInfos })

  chrome.tabs.getSelected(null, tab => {
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
