import { FCFishSceneFishController } from '/components/fc-fish-scene/fc-fish-scene-fish-controller.js'

export class FCFishSceneController {
  constructor (scene) {
    this.scene = scene
    this.paused = false
    this.boundingClientRect = this.scene.getBoundingClientRect()
    this.fishControllers = []

    this.scene.addEventListener('click',      _ => { this.scareFish() }, false)
    this.scene.addEventListener('touchstart', _ => { this.scareFish() }, supportsPassive && { passive: true })
    window.addEventListener('resize',         _ => { this.handleWindowResize() }, supportsPassive && { passive: true })
    document.addEventListener("visibilitychange", _ => { this.handleVisibilityChange() }, false)

    this.intersectionObserver = new IntersectionObserver(this.handleIntersectionObserver.bind(this), { threshold: 0.25 })
    this.intersectionObserver.observe(this.scene)

    this.spawnFish()
  }

  spawnFish () {
    const numberOfFish = Math.round(this.boundingClientRect.height / 40)
    for (let i = 0; i < numberOfFish; i++) {
      this.fishControllers.push(new FCFishSceneFishController(this))
    }
    this.scene.append(...(this.fishControllers.map(controller => controller.fish)))
  }

  scareFish () {
    if (this.paused) return
    this.fishControllers.forEach(fish => fish.scare())
  }

  handleVisibilityChange () {
    if (document.hidden) this.pause()
    else this.resume()
  }

  handleWindowResize () {
    this.pause()
    if (this.resizeWindowTimeout) clearTimeout(this.resizeWindowTimeout)
    this.resizeWindowTimeout = setTimeout(() => {
      this.boundingClientRect = this.scene.getBoundingClientRect()
      this.resume()
      this.scareFish()
    }, 250)
  }

  handleIntersectionObserver (entries) {
    this.isVisible = entries[0].isIntersecting
    this[(this.isVisible ? 'resume' : 'pause')]()
  }

  pause () {
    if (this.paused) return
    this.fishControllers.forEach(fish => fish.pause())
    this.paused = true
  }

  resume () {
    // Do not resume if we're not visible (intersectionObserver)
    if (!this.isVisible) return
    // Do not resume if we're not currently paused
    if (!this.paused) return
    this.fishControllers.forEach(fish => fish.resume())
    this.paused = false
  }
}
