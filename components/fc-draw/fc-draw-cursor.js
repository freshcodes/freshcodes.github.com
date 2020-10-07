export class FCDrawCursor {
  constructor (size) {
    this.size = parseInt(size, 10)
    this.overlapSize = this.size + 2 // some padding to deal with smoothing of the circle
    this.canvas = this.buildCanvas()
    this.draw()
  }

  buildCanvas () {
    const canvas = document.createElement('canvas')
    canvas.width = this.overlapSize
    canvas.height = this.overlapSize
    canvas.style.position = 'absolute'
    canvas.style.top = `-${this.overlapSize}px`
    canvas.style.left = `-${this.overlapSize}px`
    return document.body.appendChild(canvas)
  }

  draw () {
    const context = this.canvas.getContext('2d')
    const radius = this.size / 2
    const center = this.overlapSize / 2
    context.beginPath()
    context.arc(center, center, radius, 0, 2 * Math.PI)
    context.strokeStyle = 'black'
    context.stroke()
  }

  toCSS () {
    const offset = (this.overlapSize / 2)
    return `url(${this.canvas.toDataURL()}) ${offset} ${offset}, auto`
  }

  destroy () {
    document.body.removeChild(this.canvas)
    this.canvas = null
  }

  static forSize (size) {
    if (!(size in FCDrawCursor.cursors)) {
      const cursor = new FCDrawCursor(size)
      FCDrawCursor.cursors[size] = cursor.toCSS()
      cursor.destroy()
    }
    return FCDrawCursor.cursors[size]
  }
}

// Cursor Cache
FCDrawCursor.cursors = {}
