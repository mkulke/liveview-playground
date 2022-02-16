import L, { IconOptions } from "leaflet";
import { GeoJsonObject } from "geojson";

const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
    integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
    crossorigin=""/>
    <div style="height: 360px">
        <slot />
    </div>
`;

type Location = [number, number];

function createBBox(sw: Location, ne: Location): GeoJsonObject {
  const se = [ne[0], sw[1]];
  const nw = [sw[0], ne[1]];
  const data = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [[sw, se, ne, nw, sw]],
    },
  } as const;
  return data;
}

function parseLoc(loc: string): Location | null {
  const fragments = loc.split(",");
  if (fragments.length != 2) {
    return null;
  }
  const [lng, lat] = fragments.map(parseFloat);
  return [lng, lat];
}

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

    const [lng, lat] = parseLoc(this.getAttribute("center"));
    this.map = L.map(this.mapElement).setView([lat, lng], 13);

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
    const bboxElements = this.querySelectorAll("leaflet-bbox");
    bboxElements.forEach((markerEl: HTMLElement) => {
      const sw = parseLoc(markerEl.getAttribute("sw"));
      const ne = parseLoc(markerEl.getAttribute("ne"));
      L.geoJSON(createBBox(sw, ne)).addTo(this.map);
    });
  }
}

window.customElements.define("leaflet-map", LeafletMap);
