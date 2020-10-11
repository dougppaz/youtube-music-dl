import Vue from 'vue'

export default Vue.component(
  'HasVideoInfo',
  {
    mounted () {
      this.requestVideoInfo()
    },
    computed: {
      videoInfo () {
        if (!this.$videoInfos.infos[this.videoId]) return {}
        return this.$videoInfos.infos[this.videoId].result || {}
      }
    },
    methods: {
      requestVideoInfo () {
        chrome.runtime.sendMessage({
          action: 'requestVideoInfo',
          videoId: this.videoId
        })
      }
    }
  }
)
