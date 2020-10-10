import Vue from 'vue'
import MusicDownload from './components/music-download'

const background = chrome.extension.getBackgroundPage();

(() => {
  return new Vue({
    el: '#app',
    components: {
      MusicDownload
    },
    data () {
      return {
        videoId: background.videoId
      }
    }
  })
})()
