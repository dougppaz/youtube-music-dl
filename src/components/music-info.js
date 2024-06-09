import Vue from 'vue'
import HasVideoInfo from './has-video-info.js'

export default Vue.component(
  'MusicInfo',
  {
    extends: HasVideoInfo,
    template: `
      <div>
        <div v-if="musicTags" class="info">
          <img v-bind:src="musicTags.coverUrl" />
          <dl>
            <dd>
              {{ musicTags.title }}
              <span v-if="musicTags.explicit">[E]</span>
            </dd>
            <dd>{{ musicTags.artist }}</dd>
            <dd>{{ musicTags.album }}</dd>
            <dt v-if="musicTags.track" class="minor">Track</dt>
            <dd v-if="musicTags.track" class="minor">{{ musicTags.track }}</dd>
            <dt v-if="musicTags.genre" class="minor">Genre</dt>
            <dd v-if="musicTags.genre" class="minor">{{ musicTags.genre }}</dd>
            <dt v-if="musicTags.year" class="minor">Year</dt>
            <dd v-if="musicTags.year" class="minor">{{ musicTags.year }}</dd>
          </dl>
        </div>
        <div v-else>
          <p><i>Loading music info&hellip;</i></p>
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
