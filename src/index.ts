// import package
import path from "path";
import { LiveViewServer } from "liveviewjs";
import {
  LightLiveViewComponent,
  MapLiveViewComponent,
} from "./LiveViewComponent";

// create new LiveViewServer
const lvServer = new LiveViewServer({
  signingSecret: "MY_VERY_SECRET_KEY",
  // port: 3002,
  viewsPath: path.join(__dirname, "views"),
  rootView: "index.html.ejs",
  publicPath: path.join(__dirname, "..", "dist", "client"),
});

lvServer.registerLiveViewRoute("/light", new LightLiveViewComponent());
lvServer.registerLiveViewRoute("/map", new MapLiveViewComponent());

// then start the server
lvServer.start();
