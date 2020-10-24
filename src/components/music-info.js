import Vue from 'vue'
import HasVideoInfo from './has-video-info'
import utils from '../utils'

export default Vue.component(
  'MusicInfo',
  {
    extends: HasVideoInfo,
    template: `
      <div>
        <div v-if="musicTags">
          <p>{{ musicTags.title }}</p>
          <p>by <strong>{{ musicTags.artist }}</strong></p>
        </div>
        <div v-else>
          <p>Loading music info...</p>
        </div>
      </div>
    `,
    props: {
      videoId: {
        type: String,
        required: true
      }
    },
    computed: {
      musicTags () {
        if (!this.videoInfo) return {}
        return this.videoInfo.tags || {}
      }
    }
  }
)
