import Vue from 'vue'

export default Vue.component(
  'HasVideoInfo',
  {
    mounted () {
      this.requestVideoInfo()
    },
    computed: {
      videoInfo () {
        if (!this.$videoInfos.current[this.videoId]) return {}
        return this.$videoInfos.current[this.videoId]
      }
    },
    methods: {
      requestVideoInfo () {
        chrome.runtime.sendMessage({
          action: 'requestVideoInfo',
          tabId: this.$videoInfos.tab.id,
          videoId: this.videoId
        })
      }
    }
  }
)
