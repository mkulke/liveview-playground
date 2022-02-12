import L, { IconOptions } from "leaflet";

const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
    integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
    crossorigin=""/>
    <div style="height: 360px">
        <slot />
    </div>
`;

class LeafletMap extends HTMLElement {
  map: L.Map;
  shadowRoot: ShadowRoot;
  mapElement: HTMLDivElement;
  defaultIcon: L.Icon<IconOptions>;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.mapElement = this.shadowRoot.querySelector("div");

    this.map = L.map(this.mapElement).setView(
      [
        parseInt(this.getAttribute("lat"), 10),
        parseInt(this.getAttribute("lng"), 10),
      ],
      13
    );
    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: process.env.MAPBOX_ACCESS_TOKEN,
      }
    ).addTo(this.map);

    this.defaultIcon = L.icon({
      iconUrl: "/images/elixir-icon.png",
      iconSize: [64, 64],
    });
  }

  connectedCallback() {
    const markerElements = this.querySelectorAll("leaflet-marker");
    markerElements.forEach((markerEl: HTMLElement) => {
      const lat = parseInt(markerEl.getAttribute("lat"), 10);
      const lng = parseInt(markerEl.getAttribute("lng"), 10);
      const leafletMarker = L.marker([lat, lng], {
        icon: this.defaultIcon,
      }).addTo(this.map);
      leafletMarker.addEventListener("click", (_event) => {
        markerEl.click();
      });

      const iconEl = markerEl.querySelector("leaflet-icon")!;
      const iconSize: [number, number] = [
        parseInt(iconEl.getAttribute("width"), 10),
        parseInt(iconEl.getAttribute("height"), 10),
      ];

      iconEl.addEventListener("url-updated", (e: CustomEvent) => {
        leafletMarker.setIcon(
          L.icon({
            iconUrl: e.detail,
            iconSize: iconSize,
            iconAnchor: iconSize,
          })
        );
      });
    });
  }
}

window.customElements.define("leaflet-map", LeafletMap);
