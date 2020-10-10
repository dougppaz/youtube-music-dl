import Vue from 'vue'
import MusicInfo from './music-info'

export default Vue.component(
  'MusicDownload',
  {
    components: {
      MusicInfo
    },
    template: `
      <div>
        <music-info v-bind:videoId="videoId" />
        <div>
          <p><button v-on:click="download">Download</button</p>
          <p><small>Youtube Video ID <a v-bind:href="ytVideoURL" target="_blank">{{ videoId }}</a></small></p>
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
      ytVideoURL () {
        return `https://youtu.be/${this.videoId}`
      }
    },
    methods: {
      download () {
        alert('not available...')
      }
    }
  }
)
