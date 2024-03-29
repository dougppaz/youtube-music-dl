import YTDL from 'ytdl-core'
import BlobStream from 'blob-stream'
import mime from 'mime-types'
import { get } from 'lodash'
import axios from 'axios'
import { Buffer } from 'buffer'
import filenamify from 'filenamify'
import MP4 from './mp4'

const DEFAULT_ITAG = 140
const RENDERER_PROPERTY = 'playlistPanelVideoRenderer'
const WRAPPER_PROPERTY = 'playlistPanelVideoWrapperRenderer'
const COUNTERPART_PROPERTY = 'counterpart'
const COUNTERPART_RENDERER_PROPERTY = 'counterpartRenderer'

export default {
  async getYTVideoInfo (videoId) {
    // TODO: add cache
    console.log('getting video info', videoId)
    return await YTDL.getInfo(videoId)
  },
  async download (videoInfo, itag_) {
    const { ytVideoInfo, tags } = videoInfo
    const iTag = itag_ || DEFAULT_ITAG
    console.log('downloading', ytVideoInfo, 'with itag', iTag)
    const ytDownloadOpts = { quality: iTag }
    const download = YTDL.downloadFromInfo(ytVideoInfo, ytDownloadOpts)
    const blobStream = BlobStream()
    download.pipe(blobStream)
    download.on('end', async () => {
      const format = YTDL.chooseFormat(ytVideoInfo.formats, ytDownloadOpts)
      const blob = await this.setBlobTags(
        blobStream.toBlob(),
        format.mimeType,
        tags
      )
      chrome.downloads.download({
        url: URL.createObjectURL(blob),
        filename: `${filenamify(ytVideoInfo.videoDetails.title)}.${mime.extension(format.mimeType)}`
      })
    })
  },
  async setBlobTags (blob, mimeType, tags) {
    let fileBuffer
    let mp4File
    if (tags.coverUrl && !tags.cover) {
      tags.cover = await this.getCoverBase64FromUrl(tags.coverUrl)
    }
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
  getMusicTagsFromYTMusicAppState (state) {
    const items = []

    for (const item of state.queue.items) {
      if (RENDERER_PROPERTY in item) {
        items.push(item)
      } else if (WRAPPER_PROPERTY in item) {
        const wrapper = item[WRAPPER_PROPERTY]

        if (COUNTERPART_PROPERTY in wrapper) {
          for (const renderer of wrapper[COUNTERPART_PROPERTY]) {
            if (COUNTERPART_RENDERER_PROPERTY in renderer &&
                RENDERER_PROPERTY in renderer[COUNTERPART_RENDERER_PROPERTY]) {
              items.push(renderer[COUNTERPART_RENDERER_PROPERTY])
            }
          }
        }
      }
    }

    const selectedItem = items.filter(({ [RENDERER_PROPERTY]: { selected } }) => (selected))

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
      year: parseInt(firstItem.longBylineText.runs[firstItem.longBylineText.runs.length - 1].text),
      coverUrl: firstItem.thumbnail.thumbnails.sort(({ width: widthA }, { width: widthB }) => (widthB - widthA))[0].url
    }
  },
  async getCoverBase64FromUrl (url) {
    const response = await axios({
      url,
      responseType: 'arraybuffer'
    })
    const b64 = Buffer.from(response.data, 'binary').toString('base64')
    return `data:${response.headers['content-type'].toLowerCase()};base64,${b64}`
  }
}
