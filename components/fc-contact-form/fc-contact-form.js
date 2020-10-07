export class FCContactForm extends HTMLElement {
  static get template() {
    return `
      <fieldset class='canvas'>
        <fc-draw></fc-draw>
      </fieldset>
      <fieldset class='message'>
        <label for="message">Include a message if you'd like:</label>
        <textarea id="message" placeholder="Don't forget to include your contact information if you'd like a reply."></textarea>
        <button type="button">Send</button>
      </fieldset>
    `
  }

  connectedCallback () {
    this.injectTemplate()
    this.fcDraw = this.querySelector('fc-draw')
    this.messageInput = this.querySelector('textarea')
    this.button = this.querySelector('button')

    this.button.addEventListener('click', this.handleSubmission.bind(this))
  }

  injectTemplate () {
    this.innerHTML = this.constructor.template
  }

  handleSubmission (event) {
    if (this.submitting) return
    if (!this.hasContent()) return alert('Include a drawing and/or a message.')

    this.submitting = true

    const body = {
      drawing: this.fcDraw.toPNG(),
      message: this.messageInput.value
    }

    // We submit to a cloudflare worker that saves the drawing and send to slack channel
    fetch('https://fresh.codes/cf-workers/leave-a-drawing/leave-it', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(response => {
      return response.json()
    }).then(json => {
      if (json.ok) {
        alert('Thank you!')
        this.reset()
      } else {
        alert('Sorry! Something went wrong and this was not able to be sent to slack.')
      }
    }).catch(_ => {
      alert('Sorry! Something went wrong and we were not able to submit this.')
    }).finally(_ => {
      this.submitting = false
    })
  }

  hasContent () {
    return (this.fcDraw.hasDrawn || this.messageInput.value)
  }

  reset () {
    this.fcDraw.resetCanvas()
    this.messageInput.value = ''
  }
}
customElements.define('fc-contact-form', FCContactForm)
