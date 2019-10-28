export class FCFish extends HTMLElement {
  static get observedAttributes () {
    return [
      'color',     // see Fish.colors for acceptable values
      'direction', // see Fish.directions for acceptable values
      'scale',     // see Fish.scales for acceptable values
      'size',      // a number representing the pixel width and height
      'speed'      // see Fish.speeds for acceptable values
    ]
  }

  static get template () {
    return `
      <div class="scale-container">
        <div class="direction-container">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 55 50">
            <path class="fish-column-3 fin-top" fill="#1893c7" d="M 34.5 5 l -10 10 l -10 -10 c 10 -10 20 0 20 0" />
            <path class="fish-column-2 scale-12-o-clock" fill="#225b8d" d="M 34.5 5 l 10 10 l -10 10 l -10 -10 l 10 -10" />
            <path class="fish-column-1 scale-3-o-clock" fill="#223870" d="M 44.5 15 l 10 10 l -10 10 l -10 -10 l 10 -10" />
            <path class="fish-column-2 scale-6-o-clock" fill="#214a7e" d="M 34.5 25 l 10 10 l -10 10 l -10 -10 l 10 -10" />
            <path class="fish-column-3 scale-9-o-clock" fill="#1f7eb1" d="M 24.5 15 l 10 10 l -10 10 l -10 -10 l 10 -10" />
            <path class="fish-column-3 fin-bottom" fill="#226c9e" d="M 34.5 45 l -10 -10 l -10 10 c 0 0 10 10 20 0" />
            <path class="fish-column-4 fin-tail" fill="#00abe3" d="M 4.5 15 l 10 10 l -10 10 c 0 0 -10 -10 0 -20" />
          </svg>
        </div>
      </div>
    `
  }

  connectedCallback () {
    this.injectTemplate()
    this.initializeAttributes()
  }

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (oldValue !== newValue) this[attribute] = newValue
  }

  injectTemplate () {
    this.innerHTML = this.constructor.template
  }

  initializeAttributes () {
    if (!this.color)     this.color     = this.randomColor
    if (!this.direction) this.direction = this.randomDirection
    if (!this.speed)     this.speed     = this.randomSpeed
    if (!this.size)      this.size      = 25
  }

  // get/set colors
  get colors () {
    return ['blue', 'green', 'orange', 'white']
  }
  get color () {
    return this.getAttribute('color')
  }
  set color (value) {
    if (this.colors.indexOf(value) !== -1) {
      this.setAttribute('color', value)
    }
  }
  get randomColor () {
    return this.colors[(Math.floor(Math.random() * this.colors.length))]
  }

  // get/set direction
  get scaredDirections () {
    return ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest']
  }
  get directions () {
    return ['east', 'west']
  }
  get direction () {
    return this.getAttribute('direction')
  }
  set direction (value) {
    if (this.directions.indexOf(value) !== -1 || this.scaredDirections.indexOf(value) !== -1) {
      this.setAttribute('direction', value)
    }
  }
  get randomDirection () {
    return this.directions[(Math.floor(Math.random() * this.directions.length))]
  }
  get randomScaredDirection () {
    // Excludes the current direction
    let directions = Array.from(this.scaredDirections)
    directions.splice(this.scaredDirections.indexOf(this.direction), 1)
    return directions[(Math.floor(Math.random() * directions.length))]
  }

  // get/set paused
  get paused () {
    return this.hasAttribute('paused')
  }
  set paused (value) {
    if (value === true) {
      this.setAttribute('paused', true)
    } else {
      this.removeAttribute('paused')
    }
  }

  // get/set scale
  get scales () {
    return [1, 2, 3]
  }
  get scale () {
    return parseInt(this.getAttribute('scale'), 10)
  }
  set scale (value) {
    if (this.scales.indexOf(value) !== -1) this.setAttribute('scale', value)
  }
  get randomScale () {
    return this.scales[(Math.floor(Math.random() * this.scales.length))]
  }

  // get/set scale
  get size () {
    return parseFloat(this.getAttribute('size'))
  }
  set size (value) {
    if (isNaN(value)) return
    this.setAttribute('size', value)
    this.style.width = `${value}px`
    this.style.height = `${value}px`
  }

  // get/set speeds
  get speeds () {
    return [1, 2, 3]
  }
  get speed () {
    return parseInt(this.getAttribute('speed'), 10)
  }
  set speed (value) {
    if (value === 4 || this.speeds.indexOf(value) !== -1) this.setAttribute('speed', value)
  }
  get randomSpeed () {
    return this.speeds[(Math.floor(Math.random() * this.speeds.length))]
  }
}
customElements.define('fc-fish', FCFish)
