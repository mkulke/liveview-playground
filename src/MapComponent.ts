import { SessionData } from "express-session";
import {
  html,
  BaseLiveViewComponent,
  LiveViewComponent,
  LiveViewMountParams,
  LiveViewSocket,
} from "liveviewjs";

export class MapComponent
  extends BaseLiveViewComponent<void, never>
  implements LiveViewComponent<void, never>
{
  mount(
    _params: LiveViewMountParams,
    _session: Partial<SessionData>,
    _socket: LiveViewSocket<never>
  ) {}

  render() {
    return html`
      <div id="leafletmap">
        <leaflet-map lat="51.505" lng="8.1" />
      </div>
    `;
  }
}
