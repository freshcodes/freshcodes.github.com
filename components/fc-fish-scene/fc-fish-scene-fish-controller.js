// Helper to give us a random number
function randomBetween(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

// Helper to give absolute value of the distance between two points
function distanceBetween(start, end) {
  return start > end ? start - end : end - start
}

export class FCFishSceneFishController {
  constructor (sceneController) {
    this.sceneController = sceneController
    this.fish = document.createElement('fc-fish')
    this.minSize = 25
    this.maxSize = 100
    this.scareMinDuration = 500
    this.scareMaxDuration = 800

    this.initializeFeatures()
    this.placeRandomlyInView()
    setTimeout(() => { this.endPathOutOfView() }, 1)

    this.fish.addEventListener('mouseenter', _ => { this.scare() }, supportsPassive && { passive: true })
  }

  initializeFeatures () {
    this.fish.size = randomBetween(this.minSize, this.maxSize)
    this.fish.color = this.fish.randomColor
    this.fish.speed = this.fish.randomSpeed
    this.fish.direction = this.fish.randomDirection
    this.fish.scale = 0
    this.scareDuration = randomBetween(this.scareMinDuration, this.scareMaxDuration)
    this.randomOffset = randomBetween(this.fish.size * 1, this.fish.size * 1.5)
  }

  pause () {
    if (this.resetTimeout) clearTimeout(this.resetTimeout)
    const { top, left } = this.fish.getBoundingClientRect()
    this.fish.style.transitionDuration = '0ms'
    this.fish.style.top = `${top + window.scrollY}px`
    this.fish.style.left = `${left}px`
    this.fish.paused = true
  }

  resume () {
    this.fish.paused = false
    this.reset()
  }

  reset () {
    if (this.resetTimeout) clearTimeout(this.resetTimeout)
    if (this.isOutOfBounds()) {
      this.initializeFeatures()
      this.placeRandomlyOutOfView()
    }
    this.endPathOutOfView()
  }

  resetFromScare () {
    if (/east/.test(this.fish.direction)) this.fish.direction = 'east'
    else if (/west/.test(this.fish.direction)) this.fish.direction = 'west'
    else if (/north|south/.test(this.fish.direction)) this.fish.direction = this.fish.randomDirection
    this.fish.style.transitionTimingFunction = ''
    if (!this.fish.paused) this.reset()
  }

  isOutOfBounds () {
    const { width, height } = this.sceneController.boundingClientRect
    const { top, left } = this.fish.getBoundingClientRect()
    const size = this.fish.size
    return left < -(size) || left > width || (top + window.scrollY) < -(size) || (top + window.scrollY) > height
  }

  placeRandomlyInView () {
    const {width, height} = this.sceneController.boundingClientRect

    let startTop = randomBetween(0, height - this.fish.size)
    let startLeft = randomBetween(0, width - this.fish.size)

    this.fish.style.transitionDuration = '0ms'
    this.fish.style.top = `${startTop}px`
    this.fish.style.left = `${startLeft}px`
  }

  placeRandomlyOutOfView () {
    const {width, height} = this.sceneController.boundingClientRect

    // Start Position
    let startTop, startLeft
    if (this.fish.direction === 'east') {
      startTop = randomBetween(0, height - this.fish.size)
      startLeft = -(this.randomOffset)
    }
    if (this.fish.direction === 'west') {
      startTop = randomBetween(0, height - this.fish.size)
      startLeft = width + this.randomOffset
    }

    this.fish.style.transitionDuration = '0ms'
    this.fish.style.top = `${startTop}px`
    this.fish.style.left = `${startLeft}px`
  }

  endPathOutOfView () {
    const { width, height } = this.sceneController.boundingClientRect
    const { top, left } = this.fish.getBoundingClientRect()
    let endLeft = left

    if (this.fish.direction === 'east') endLeft = width + this.randomOffset
    if (this.fish.direction === 'west') endLeft = -(this.randomOffset)

    let distance = distanceBetween(endLeft, left)
    let duration = (distance / (20 * this.fish.speed)) * 1000

    this.fish.style.transitionDuration = `${duration}ms`
    this.fish.style.left = `${endLeft}px`
    this.fish.style.top = `${top + window.scrollY}px`

    // Reset animation after the duration time
    this.resetTimeout = setTimeout(() => {
      this.reset()
    }, duration)
  }

  scare () {
    // Don't scare the fish if we're paused
    if (this.fish.paused === true) return

    // Don't worry about scaring fish that are out of bounds
    if (this.isOutOfBounds()) return

    // Wipe out reset timeout, it'll get reset after the scare is over
    if (this.resetTimeout) clearTimeout(this.resetTimeout)

    if (this.scareSlowDownTimeout) clearTimeout(this.scareSlowDownTimeout)
    if (this.scaredTimeout) clearTimeout(this.scaredTimeout)

    // Get distance to travel based on size
    const distance = this.fish.size * 1.5 // pixels

    this.fish.style.transitionDuration = `${this.scareDuration}ms`
    this.fish.style.transitionTimingFunction = 'cubic-bezier(.02,.49,.18,.43)'

    this.fish.direction = this.fish.randomScaredDirection
    this.fish.speed = 4
    this.fish.scale = this.fish.randomScale

    // Starting from the current location
    let { top, left } = this.fish.getBoundingClientRect()
    top += window.scrollY

    // Adjust based on direction
    if (/north/.test(this.fish.direction)) top -= distance
    if (/east/.test(this.fish.direction)) left += distance
    if (/south/.test(this.fish.direction)) top += distance
    if (/west/.test(this.fish.direction)) left -= distance

    // Set the new location
    this.fish.style.top = `${top}px`
    this.fish.style.left = `${left}px`

    // Slow down twist motion before ending at the new location
    this.scareSlowDownTimeout = setTimeout(() => { this.fish.speed = this.fish.randomSpeed }, this.scareDuration * 0.75)
    this.scaredTimeout = setTimeout(() => { this.resetFromScare() }, this.scareDuration)
  }
}
