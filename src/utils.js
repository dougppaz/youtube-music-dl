import YTDL from 'ytdl-core'
import blobStream from 'blob-stream'

export default {
  async getVideoInfo (videoId) {
    console.log('getting video info', videoId)
    const ytInfo = await YTDL.getInfo(videoId)
    return { ytInfo }
  }
}
