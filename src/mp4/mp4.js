import JDataView from 'jDataView'
import atob from 'atob'
import btoa from 'btoa'
import Atom from './atom'
import {
  recursiveParse,
  recursiveBuilder,
  addDataAtom,
  concatBuffers,
  getDataAtom
} from './utils'

const BASE64_MARKER = ';base64,'
const CHUNK_SIZE = 0x8000

export default class MP4 {
  constructor (input) {
    const data = new JDataView(new Uint8Array(input))
    this.root = new Atom(true)
    recursiveParse(this.root, data)
    this.isValid = this.root.hasChild('ftyp')
  }

  build () {
    return recursiveBuilder(this.root)
  }

  giveTags (tags) {
    if (!tags || typeof tags !== 'object') throw new Error('MP4.giveTags needs to be given tags (as a js object - see docs for options)')

    const initialOffset = this.root.ensureChild('moov.udta').getByteLength()
    const hdlr = this.root.ensureChild('moov.udta.meta.hdlr')

    hdlr.data = new JDataView(new Uint8Array(25))
    hdlr.data.seek(8)
    hdlr.data.writeString('mdirappl')

    const metadata = this.root.ensureChild('moov.udta.meta.ilst')
    metadata.parent.padding = 4

    if (tags.track) addDataAtom(metadata, 'trkn', tags.track)

    if (tags.title) addDataAtom(metadata, '\xA9nam', tags.title)

    if (tags.artist) addDataAtom(metadata, '\xA9ART', tags.artist)

    if (tags.album) addDataAtom(metadata, '\xA9alb', tags.album)

    if (tags.genre) addDataAtom(metadata, '\xA9gen', tags.genre)

    if (tags.cover) {
      const cover = addDataAtom(metadata, 'covr')
      const base64Index = tags.cover.indexOf(BASE64_MARKER) + BASE64_MARKER.length
      const base64 = tags.cover.substring(base64Index)
      const raw = atob(base64)
      const rawLength = raw.length
      const array = new Uint8Array(new ArrayBuffer(rawLength))

      for (let i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i)
      }

      cover.data = new JDataView(new Uint8Array(8))
      cover.data.writeUint32(13)
      cover.data = concatBuffers(cover.data, new JDataView(array))
    }

    const offset = this.root.ensureChild('moov.udta').getByteLength() - initialOffset
    const stco = this.root.ensureChild('moov.trak.mdia.minf.stbl.stco')

    stco.data.seek(8)

    while (stco.data.tell() < stco.data.byteLength) {
      const current = offset + stco.data.getUint32()
      stco.data.skip(-4)
      stco.data.writeUint32(current)
    }

    return this
  }

  getCommonTags () {
    const metadata = this.root.ensureChild('moov.udta.meta.ilst')
    const tags = {
      title: getDataAtom(metadata, '\xA9nam').getString(),
      artist: getDataAtom(metadata, '\xA9ART').getString(),
      album: getDataAtom(metadata, '\xA9alb').getString(),
      genre: getDataAtom(metadata, '\xA9gen').getString(),
      cover: null
    }
    const cover = getDataAtom(metadata, 'covr')

    if (cover) {
      const data = cover.getBytes()
      const length = data.length
      let slice
      let result = ''
      let index = 0

      while (index < length) {
        slice = data.subarray(index, Math.min(index + CHUNK_SIZE, length))
        result += String.fromCharCode.apply(null, slice)
        index += CHUNK_SIZE
      }

      tags.cover = 'data:image/gif;base64,' + btoa(result)
    }

    return tags
  }
}
