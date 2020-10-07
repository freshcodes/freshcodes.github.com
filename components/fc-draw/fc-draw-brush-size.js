export class FCDrawBrushSize extends HTMLElement {
  connectedCallback () {
    this.injectTemplate()

    this.input = this.querySelector('input[type="range"]')
    this.output = this.querySelector('output[for="brushSizeInput"]')

    this.input.addEventListener('input', this.handleInput.bind(this), false)
  }

  handleInput (event) {
    this.output.value = this.brushSize
  }

  injectTemplate () {
    this.innerHTML = this.template
  }

  get template () {
    const options = []
    for (let i = this.min; i <= this.max; i++) {
      options.push(`<option value='${i}'></option>`)
    }

    return `
      <label for='brushSizeInput'>Brush Size:</label>
      <input type='range' id='brushSizeInput' list='brushSizeInputList' min='${this.min}' max='${this.max}' step='1' value='${this.defaultSize}'>
      <datalist id='brushSizeInputList'>${options.join('')}</datalist>
      <output for='brushSizeInput'>${this.defaultSize}</output>
    `
  }

  get defaultSize () {
    return 5
  }

  get min () {
    return 1
  }

  get max () {
    return 20
  }

  get brushSize () {
    return parseInt(this.input.value, 10)
  }
}
customElements.define('fc-draw-brush-size', FCDrawBrushSize)
