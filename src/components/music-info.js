import Vue from 'vue'
import HasVideoInfo from './has-video-info'
import utils from '../utils'

export default Vue.component(
  'MusicInfo',
  {
    extends: HasVideoInfo,
    template: `
      <div>
        <div v-if="musicInfo">
          <p>{{ musicInfo.title }}</p>
          <p>by <strong>{{ musicInfo.artist }}</strong></p>
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
      musicInfo () {
        return utils.getMusicTagsFromYTMusicAppState(this.$videoStates.states[this.videoId])
      }
    }
  }
)
