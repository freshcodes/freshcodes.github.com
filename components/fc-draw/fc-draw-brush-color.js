export class FCDrawBrushColor extends HTMLElement {
  connectedCallback () {
    this.injectTemplate()

    this.input = this.querySelector('input[type="color"]')
  }

  injectTemplate () {
    this.innerHTML = this.template
  }

  get template () {
    return `
      <label for='colorInput'>Brush Color:</label>
      <input type='color' id='colorInput' value='${this.defaultColor}'>
    `
  }

  get defaultColor () {
    return '#000000'
  }

  get color () {
    return this.input.value
  }
}
customElements.define('fc-draw-brush-color', FCDrawBrushColor)
