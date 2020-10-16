import YTDL from 'ytdl-core'
import BlobStream from 'blob-stream'
import mime from 'mime-types'

export default {
  async getVideoInfo (videoId) {
    console.log('getting video info', videoId)
    const ytInfo = await YTDL.getInfo(videoId)
    return { ytInfo }
  },
  async download (ytInfo, itag) {
    console.log('downloading', ytInfo, 'with itag', itag)
    const ytDownloadOpts = { quality: itag }
    const download = YTDL.downloadFromInfo(ytInfo, ytDownloadOpts)
    const blobStream = BlobStream()
    download.pipe(blobStream)
    download.on('end', async () => {
      const format = YTDL.chooseFormat(ytInfo.formats, ytDownloadOpts)
      const blob = await this.setTags(blobStream.toBlob(), { title: ytInfo.videoDetails.title })
      chrome.downloads.download({
        url: URL.createObjectURL(blob),
        filename: `${ytInfo.videoDetails.title}.${mime.extension(format.mimeType)}`
      })
    })
  },
  async setTags (blob, tags) {
    return blob
  }
}
