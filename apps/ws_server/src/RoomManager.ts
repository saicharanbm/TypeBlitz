import { WebSocket } from "ws";

export class User {
  public id: string;
  public roomId: string;
  public name: string;
  public isAdmin: boolean;
  public ws: WebSocket;

  constructor(ws: WebSocket) {
    this.ws = ws;
    this.isAdmin = false;
    this.handleRequests();
  }

  handleRequests() {
    this.ws.on("message", (request) => {
      const data = JSON.parse(request.toString());

      switch (data.type) {
        case "Join":
          //do something
          break;
        case "Create":
          //do something
          break;
      }
    });
  }
  destroy() {
    // do some thing
  }
  sendMessage(message: any) {
    this.ws.send(JSON.stringify(message));
  }
}
