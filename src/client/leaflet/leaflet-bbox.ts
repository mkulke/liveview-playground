class LeafletBBox extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
  }
}

window.customElements.define("leaflet-bbox", LeafletBBox);
