class ExtenededListView extends SimpleListView {
  #style;

  /* inject */
  css(styles) {
    if (!this.#style) {
      const style = this.#style = document.createElement('style');
      this.shadowRoot.append(style);
    }

    this.#style.textContent = styles;
  }
}
customElements.define('extended-list-view', ExtenededListView);
