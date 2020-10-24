import YTDL from 'ytdl-core'
import BlobStream from 'blob-stream'
import mime from 'mime-types'
import { get } from 'lodash'
import MP4 from './mp4'

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
      const blob = await this.setBlobTags(
        blobStream.toBlob(),
        format.mimeType,
        { title: ytInfo.videoDetails.title }
      )
      chrome.downloads.download({
        url: URL.createObjectURL(blob),
        filename: `${ytInfo.videoDetails.title}.${mime.extension(format.mimeType)}`
      })
    })
  },
  async setBlobTags (blob, mimeType, tags) {
    let fileBuffer
    let mp4File
    switch (mimeType) {
      case 'audio/mp4; codecs="mp4a.40.2"':
        fileBuffer = await blob.arrayBuffer()
        mp4File = new MP4(fileBuffer)
        mp4File.giveTags(tags)
        return new Blob([mp4File.build().buffer], { type: mimeType })
      default:
        console.log(`not implemented setTags to '${mimeType}' mime type`)
        return blob
    }
  },
  getFilterFnByPageType (pageType) {
    return item => (pageType === get(item, 'navigationEndpoint.browseEndpoint.browseEndpointContextSupportedConfigs.browseEndpointContextMusicConfig.pageType'))
  },
  getMusicInfoFromYTMusicAppState (state) {
    const selectedItem = state.queue.items.filter(({ playlistPanelVideoRenderer: { selected } }) => (selected))

    if (selectedItem.length === 0) return null

    const firstItem = selectedItem[0].playlistPanelVideoRenderer

    return {
      title: firstItem.title.runs
        .map(({ text }) => (text))
        .join(' '),
      artist: firstItem.longBylineText.runs
        .filter(this.getFilterFnByPageType('MUSIC_PAGE_TYPE_ARTIST'))
        .map(({ text }) => (text))
        .join(', '),
      album: firstItem.longBylineText.runs
        .filter(this.getFilterFnByPageType('MUSIC_PAGE_TYPE_ALBUM'))
        .map(({ text }) => (text))
        .join(' - '),
      track: null,
      genre: null,
      coverUrl: firstItem.thumbnail.thumbnails.sort(({ width: widthA }, { width: widthB }) => (widthB - widthA))[0].url
    }
  }
}
