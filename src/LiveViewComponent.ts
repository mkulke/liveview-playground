import { SessionData } from "express-session";
import {
  html,
  BaseLiveViewComponent,
  LiveViewComponent,
  LiveViewExternalEventListener,
  LiveViewMountParams,
  LiveViewSocket,
} from "liveviewjs";

// define your component's data shape
export interface LightContext {
  brightness: number;
}

// define the component events
export type LightEvent = "on" | "off" | "up" | "down" | "key_update";

type KeyEvent = "arrow_up" | "arrow_down";

// implement your component
export class LightLiveViewComponent
  extends BaseLiveViewComponent<LightContext, never>
  implements
    LiveViewComponent<LightContext, never>,
    LiveViewExternalEventListener<LightContext, LightEvent, { key: KeyEvent }>
{
  // mount is called before html render on HTTP requests and
  // when the socket is connected on the phx-join event
  mount(
    _params: LiveViewMountParams,
    _session: Partial<SessionData>,
    _socket: LiveViewSocket<LightContext>
  ) {
    // set the default value(s) for the component data
    return { brightness: 10 };
  }

  // Define and render the HTML for your LiveViewComponent
  // This function is called after any context change and
  // only diffs are sent back to the page to re-render
  render(context: LightContext) {
    const { brightness } = context;
    return html`
      <div id="light">
        <h1>Front Porch Light</h1>
        <div class="meter">
          <div>${brightness}%</div>
          <progress id="light_level" value="${brightness}" max="100"></progress>
        </div>

        <button phx-click="off">Off</button>

        <button
          phx-click="down"
          phx-window-keydown="key_update"
          phx-key="ArrowDown"
        >
          Down
        </button>

        <button
          phx-click="up"
          phx-window-keydown="key_update"
          phx-key="ArrowUp"
        >
          Up
        </button>

        <button phx-click="on">On</button>
      </div>
    `;
  }

  // Handle events sent back from the client...  Events
  // may update the state (context) of the component and
  // cause a re-render
  handleEvent(
    event: LightEvent,
    params: { key: KeyEvent },
    socket: LiveViewSocket<LightContext>
  ) {
    const ctx: LightContext = { brightness: socket.context.brightness };
    const lightEvent = event === "key_update" ? params.key : event;
    switch (lightEvent) {
      case "off":
        ctx.brightness = 0;
        break;
      case "on":
        ctx.brightness = 100;
        break;
      case "up":
      case "arrow_up":
        ctx.brightness = Math.min(ctx.brightness + 10, 100);
        break;
      case "down":
      case "arrow_down":
        ctx.brightness = Math.max(ctx.brightness - 10, 0);
        break;
    }
    return ctx;
  }
}

export class MapLiveViewComponent
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
