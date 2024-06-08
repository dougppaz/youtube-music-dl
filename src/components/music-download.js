import Vue from 'vue'
import HasVideoInfo from './has-video-info'
import MusicInfo from './music-info'

export default Vue.component(
  'MusicDownload',
  {
    extends: HasVideoInfo,
    components: {
      MusicInfo
    },
    template: `
      <div>
        <music-info v-bind:videoId="videoId" />
        <div>
          <form>
            <select v-model="itag">
              <option
                v-for="format in formats"
                v-bind:key="format.itag"
                v-bind:value="format.itag">{{ format.codecs }} {{ format.audioBitrate }}K</option>
            </select>
            <button v-on:click="download">Download</button>
          </form>
          <p><small>YouTube Video ID <a v-bind:href="ytVideoURL" target="_blank">{{ videoId }}</a></small></p>
        </div>
      </div>
    `,
    props: {
      videoId: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        itag: '140'
      }
    },
    computed: {
      ytVideoURL () {
        return `https://youtu.be/${this.videoId}`
      },
      formats () {
        if (!this.videoInfo.ytVideoInfo) return []
        return this.videoInfo.ytVideoInfo.formats
          .filter(({ hasAudio, hasVideo }) => (hasAudio && !hasVideo))
          .sort((a, b) => {
            return b.audioBitrate - a.audioBitrate
          })
      }
    },
    methods: {
      download () {
        chrome.runtime.sendMessage({
          action: 'downloadYTMusic',
          videoId: this.videoId,
          itag: this.itag,
          tabId: this.$videoInfos.tab.id
        })
      }
    }
  }
)
