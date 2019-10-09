import { FCFishSceneController } from '/components/fc-fish-scene/fc-fish-scene-controller.js'

export class FCFishScene extends HTMLElement {
  connectedCallback () {
    this.controller = new FCFishSceneController(this)
  }
}
customElements.define('fc-fish-scene', FCFishScene)
