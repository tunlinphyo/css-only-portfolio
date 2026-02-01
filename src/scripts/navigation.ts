
export class Navigation {
  private navButton: HTMLButtonElement
  private navMenu: HTMLDialogElement

  constructor(navButtonId: string, navMenuId: string) {
    this.navButton = this.resolveElement(navButtonId) as HTMLButtonElement
    this.navMenu = this.resolveElement(navMenuId) as HTMLDialogElement

    this.openDialog = this.openDialog.bind(this)
    this.onSelfClick = this.onSelfClick.bind(this)

    this.onInit()
  }

  private onInit() {
    this.navButton.addEventListener("click", this.openDialog)
    this.navMenu.addEventListener("click", this.onSelfClick)
  }

  private openDialog() {
    this.navMenu.showModal()
  }

  private onSelfClick(event: Event) {
    const targetEl = event.target as HTMLElement
    if (targetEl.classList.contains("navigation")) {
      this.navMenu.close()
    }
  }

  private resolveElement(id: string) {
    try {
      return document.getElementById(id)
    } catch(error) {
      console.error(error)
    }
  }
}