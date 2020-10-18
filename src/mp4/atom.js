export default class Atom {
  constructor (name, parent) {
    if (typeof name === 'boolean') {
      if (!name) throw new Error('First arg for atom is either a 4 letter tag name, or boolean true for the root')
      this.root = true
    } else if (name.length !== 4) {
      throw new Error('Atoms must have name length of 4')
    } else {
      this.name = name
    }

    this.padding = 0
    this.children = []
    this.data = null
    this.parent = parent
  }

  hasChild (name) {
    return this.indexOf(name) !== -1
  }

  getByteLength () {
    if (this.data) return this.data.byteLength + 8

    const childrenLength = this.children
      .map(c => (c.getByteLength()))
      .reduce((acc, v) => (acc + v), 0)
    return 8 + this.padding + childrenLength
  }

  indexOf (name) {
    return this.children.findIndex(c => (c.name === name))
  }

  getChild (name) {
    return this.children.find(c => (c.name === name)) || false
  }

  ensureChild (childName) {
    const childNames = childName.split('.')
    const firstChildName = childNames[0]
    if (!this.hasChild(firstChildName)) this.addChild(firstChildName)
    const firstChild = this.getChild(firstChildName)
    if (childNames[1]) {
      childNames.shift()
      return firstChild.ensureChild(childNames.join('.'))
    }
    return firstChild
  }

  addChild (name, index) {
    const atom = new Atom(name, this)
    if (index === undefined) {
      this.children.push(atom)
    } else {
      this.children.splice(
        Math.min(
          this.children.length,
          Math.max(index, 0)
        ),
        0,
        atom
      )
    }
    return atom
  }
}
