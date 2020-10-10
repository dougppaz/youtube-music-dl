import Vue from 'vue'
import MusicDownload from './components/music-download'

(() => {
  const background = chrome.extension.getBackgroundPage()

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
