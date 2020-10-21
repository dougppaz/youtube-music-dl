import Vue from 'vue'
import MusicDownload from './components/music-download'
import VideoInfos from './plugins/video-infos'
import StatesInfo from './plugins/states-info'

(() => {
  const background = chrome.extension.getBackgroundPage()

  chrome.tabs.getSelected(null, tab => {
    Vue.use(VideoInfos, { videoInfos: background.videoInfos })
    Vue.use(StatesInfo, { videoStates: background.videoStates, tab })

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
