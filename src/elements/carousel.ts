class CarouselList extends HTMLElement {
  private static template = (() => {
    const template = document.createElement('template')
    template.innerHTML = `
      <style>
        :host {
          position: relative;
          display: block;
        }
      </style>
      <ul part="list" role="list">
        <slot></slot>
      </ul>
      <button class="prev" part="control prev" type="button" aria-label="Previous"></button>
      <button class="next" part="control next" type="button" aria-label="Next"></button>
    `
    return template
  })()

  private hasSetup = false
  private cleanup: Array<() => void> = []
  private currentIndex = 0
  private items: HTMLElement[] = []
  private slotEl: HTMLSlotElement | null = null

  constructor() {
    super()
    const root = this.attachShadow({ mode: 'open' })
    root.appendChild(CarouselList.template.content.cloneNode(true))
  }

  connectedCallback() {
    if (this.hasSetup) return
    this.hasSetup = true
    this.setup()
  }

  disconnectedCallback() {
    for (const dispose of this.cleanup) dispose()
    this.cleanup = []
    this.hasSetup = false
  }

  private setup() {
    this.slotEl = this.shadowRoot?.querySelector('slot') ?? null
    const prevButton = this.shadowRoot?.querySelector('button.prev') ?? null
    const nextButton = this.shadowRoot?.querySelector('button.next') ?? null

    const syncItems = () => {
      if (!this.slotEl) return
      this.items = this.slotEl.assignedElements({ flatten: true }).filter(
        (node): node is HTMLElement => node instanceof HTMLElement && node.tagName === 'LI'
      )
      if (this.currentIndex >= this.items.length) {
        this.currentIndex = Math.max(0, this.items.length - 1)
      }
      this.setCurrentIndex(this.currentIndex, false)
    }

    const updateItems = () => syncItems()

    const handlePrev = () => {
      if (!this.items.length) return
      const index = (this.currentIndex - 1 + this.items.length) % this.items.length
      this.setCurrentIndex(index, true)
    }

    const handleNext = () => {
      if (!this.items.length) return
      const index = (this.currentIndex + 1) % this.items.length
      this.setCurrentIndex(index, true)
    }

    this.setAttribute('role', 'list')
    updateItems()

    this.slotEl?.addEventListener('slotchange', updateItems)
    prevButton?.addEventListener('click', handlePrev)
    nextButton?.addEventListener('click', handleNext)

    this.cleanup.push(() => {
      this.slotEl?.removeEventListener('slotchange', updateItems)
    })
    if (prevButton) this.cleanup.push(() => prevButton.removeEventListener('click', handlePrev))
    if (nextButton) this.cleanup.push(() => nextButton.removeEventListener('click', handleNext))
  }

  private setCurrentIndex(index: number, scroll: boolean) {
    if (!this.items.length) return
    this.currentIndex = index
    const current = this.items[this.currentIndex]
    if (!current) return
    if (scroll) {
      current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }
}

if (!customElements.get('carousel-list')) {
  customElements.define('carousel-list', CarouselList)
}
