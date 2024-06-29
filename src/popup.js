import Vue from 'vue'
import MusicDownload from './components/music-download.js'
import VideoInfos from './plugins/video-infos.js'

(() => {
  let videoId = null;
  const videoInfos = {}

  chrome.runtime.onMessage.addListener(async (message, sender) => {
    console.log('message', message)
  })

  Vue.use(VideoInfos, { videoInfos })

  return new Vue({
    el: '#app',
    components: {
      MusicDownload
    },
    data () {
      return {
        videoId
      }
    },
    template: `
      <div>
        <h1>YouTube Music DL</h1>
        <div v-if="videoId">
          <music-download v-bind:video-id="videoId" />
        </div>
        <div v-else>
          <h2>Source not found! :(</h2>
          <p>Play a music in YouTube Music app.</p>
        </div>
      </div>
    `
  })
})()
