import JDataView from 'jDataView'
import Atom from './atom'

const recursiveParse = (atom, dataArg) => {
  let data = dataArg

  while (data.byteLength >= 8) {
    data.seek(0)
    const tagLength = data.getUint32(0)
    const tagName = data.getString(4, 4)

    if (tagName.match(/[\xA9\w]{4}/) && tagLength <= data.byteLength) {
      const child = new Atom(tagName, atom)

      if (tagName === 'meta') child.padding = 4
      atom.children.push(child)
      recursiveParse(child, data.slice(8 + child.padding, tagLength))
      data = data.slice(tagLength, data.byteLength)
    } else {
      atom.data = data
      return
    }
  }
}

const jDataViewToUint = buf => (new Uint8Array(buf.buffer).subarray(buf.byteOffset, (buf.byteOffset + buf.byteLength)))

const concatBuffers = (arg1, arg2) => {
  const buffer1 = jDataViewToUint(arg1)
  const buffer2 = jDataViewToUint(arg2)
  const buffer = new Uint8Array(buffer1.byteLength + buffer2.byteLength)

  buffer.set(buffer1, 0)
  buffer.set(buffer2, buffer1.byteLength)
  return new JDataView(buffer)
}

const recursiveBuilder = atom => {
  if (atom.data) return atom.data

  let output = new JDataView(new Uint8Array())

  for (let i = 0; i < atom.children.length; i++) {
    const child = atom.children[i]
    const header = new JDataView(new Uint8Array(8 + child.padding))
    const data = recursiveBuilder(child)

    header.writeUint32(data.byteLength + 8 + child.padding)
    header.seek(4)

    for (let j = 0; j < 4; j++) {
      header.writeUint8(atom.children[i].name.charCodeAt(j))
    }

    const buffer = concatBuffers(header, data)
    output = concatBuffers(output, buffer)
  }

  return output
}

const addDataAtom = (metadata, name, str) => {
  const data = metadata.ensureChild(name + '.data')

  if (!str) return data

  if (name === 'trkn') {
    data.data = new JDataView(new Uint8Array(40))
    data.data.seek(8)
    data.data.writeUint32(str)
  } else {
    data.data = new JDataView(new Uint8Array(str.length + 8))
    data.data.seek(3)
    data.data.writeUint8(1)
    data.data.seek(8)
    data.data.writeString(str)
  }

  return data
}

const getDataAtom = (metadata, name) => {
  const leaf = metadata.getChild(name)

  if (!leaf || !leaf.children[0]) return false

  const data = leaf.children[0].data
  data.seek(8)
  return data
}

export {
  recursiveParse,
  jDataViewToUint,
  concatBuffers,
  recursiveBuilder,
  addDataAtom,
  getDataAtom
}
