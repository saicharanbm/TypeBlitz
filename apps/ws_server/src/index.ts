import { WebSocketServer } from "ws";
import { User } from "./User";

// Specify your host and port
const HOST = "0.0.0.0"; // To make it accessible from other devices in the network
const PORT = 3001;

// Create WebSocket server with host and port
const wss = new WebSocketServer({ host: HOST, port: PORT }, () =>
  console.log(`WebSocket server started on ${HOST}:${PORT}`)
);

// const wss = new WebSocketServer({ port: 3001 }, () =>
//   console.log("websocket server started")
// );

wss.on("connection", function connection(ws) {
  let user = new User(ws);
  ws.on("error", console.error);

  ws.on("close", () => {
    user.destroy();
  });
});
