import { FCDrawBrushSize } from '/components/fc-draw/fc-draw-brush-size.js'
import { FCDrawBrushColor } from '/components/fc-draw/fc-draw-brush-color.js'
import { FCDrawCursor } from '/components/fc-draw/fc-draw-cursor.js'

export class FCDraw extends HTMLElement {
  connectedCallback () {
    this.drawing = false

    this.injectTemplate()

    this.canvas = this.querySelector('canvas')
    this.canvasContext = this.canvas.getContext('2d')
    this.brushSizeTool = this.querySelector('fc-draw-brush-size')
    this.brushColorTool = this.querySelector('fc-draw-brush-color')

    this.resetCanvas()

    this.canvas.addEventListener('mouseenter', this.handleMouseEnter.bind(this), false)

    // Handle mouse events
    this.canvas.addEventListener('mousedown', this.handleStartDraw.bind(this), false)
    this.canvas.addEventListener('mousemove', this.handleDraw.bind(this), false)
    document.addEventListener('mouseup', this.handleEndDraw.bind(this), false)

    // Handle touch events, we're just going to end up proxying to our mouse events
    this.canvas.addEventListener('touchstart', this.handleStartDraw.bind(this), supportsPassive && { passive: true })
    this.canvas.addEventListener('touchmove', this.handleDraw.bind(this), supportsPassive && { passive: true })
    this.canvas.addEventListener('touchend', this.handleEndDraw.bind(this), supportsPassive && { passive: true })

    // Prevents scrolling when drawing, these cannot be passive since they will prevent the scroll event
    document.body.addEventListener('touchstart', this.handleBodyTouchScrolling.bind(this), supportsPassive && { passive: false })
    document.body.addEventListener('touchmove', this.handleBodyTouchScrolling.bind(this), supportsPassive && { passive: false })
    document.body.addEventListener('touchend', this.handleBodyTouchScrolling.bind(this), supportsPassive && { passive: false })
  }

  injectTemplate () {
    this.innerHTML = this.template
  }

  resetCanvas () {
    this.canvas.width = this.canvas.width
    this.canvasContext.fillStyle = '#ffffff'
    this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.hasDrawn = false
  }

  handleMouseEnter () {
    const cursor = FCDrawCursor.forSize(this.brushSize)
    this.canvas.style.cursor = cursor
  }

  handleBodyTouchScrolling (event) {
    if (event.target == this.canvas) event.preventDefault()
  }

  handleStartDraw (event) {
    if (this.drawing) return

    this.hasDrawn = true
    this.drawing = true

    // Starting a new path
    this.canvasContext.beginPath()

    // Ensure we're using the latest settings
    this.canvasContext.lineCap = 'round'
    this.canvasContext.lineJoin = 'round'
    this.canvasContext.strokeStyle = this.color
    this.canvasContext.lineWidth = this.brushSize

    // Grab current offset of the canvas
    this.canvasOffset = this.canvas.getBoundingClientRect()

    // Setup the last cursor position
    this.lastCursorPosition = this.getCursorPosition(event)
    this.currentCursorPosition = this.lastCursorPosition

    this.drawLoop()
  }

  handleDraw (event) {
    if (!this.drawing) return

    this.currentCursorPosition = this.getCursorPosition(event)
  }

  handleEndDraw (event) {
    if (!this.drawing) return

    this.drawing = false

    // We're done with this path
    this.canvasContext.closePath()
  }

  drawLoop () {
    if (this.drawing) {
      this.canvasContext.moveTo(this.lastCursorPosition.left, this.lastCursorPosition.top)
      this.canvasContext.lineTo(this.currentCursorPosition.left, this.currentCursorPosition.top)
      this.canvasContext.stroke()
      this.lastCursorPosition = this.currentCursorPosition

      // Using requestAnimationFrame here as it provides a much smooother experience
      requestAnimationFrame(this.drawLoop.bind(this))
    }
  }

  toPNG () {
    return this.canvas.toDataURL('image/png')
  }

  getCursorPosition (event) {
    // Handle both touch and mouse events
    const coords = event.touches ? event.touches[0] : event

    return {
      left: coords.clientX - this.canvasOffset.left,
      top: coords.clientY - this.canvasOffset.top
    }
  }

  get color () {
    return this.brushColorTool.color
  }

  get brushSize () {
    return this.brushSizeTool.brushSize
  }

  get template () {
    const datalistOptions = []
    for (let i = this.brushSizeMin; i <= this.brushSizeMax; i++) {
      datalistOptions.push(`<option value='${i}'></option>`)
    }
    return `
      <canvas width='300' height='300'></canvas>
      <div class='tools'>
        <fc-draw-brush-size></fc-draw-brush-size>
        <fc-draw-brush-color></fc-draw-brush-color>
      </div>
    `
  }
}
customElements.define('fc-draw', FCDraw)
