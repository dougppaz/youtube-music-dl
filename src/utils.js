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
    const blob = BlobStream()
    download.pipe(blob)
    download.on('end', () => {
      const format = YTDL.chooseFormat(ytInfo.formats, ytDownloadOpts)
      chrome.downloads.download({
        url: blob.toBlobURL(),
        filename: `${ytInfo.videoDetails.title}.${mime.extension(format.mimeType)}`
      })
    })
  }
}
