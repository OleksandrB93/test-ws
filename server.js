const WebSocketServer = new require("ws");

const wss = new WebSocketServer.Server({ port: 8080 });

let subscribers = 0;

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    try {
      const { type } = JSON.parse(message);
    } catch (error) {
      console.log(error.message);
    }
    
    setInterval(() => {
      try {
        switch (type) {
          case "Subscribe":
            subscribers++;
            setTimeout(() => {
              ws.send(
                JSON.stringify({
                  type: "Subscribe",
                  status: "Subscribed",
                  updatedAt: new Date(),
                })
              );
            }, 4000);
            break;

          case "Unsubscribe":
            subscribers--;
            setTimeout(() => {
              ws.send(
                JSON.stringify({
                  type: "Unscubscribe",
                  status: "Unsubscribed",
                  updatedAt: new Date(),
                })
              );
            }, 8000);

            break;

          case "CountSubscribers":
            ws.send(
              JSON.stringify({
                type: "CountSubscribers",
                count: `${subscribers}`,
                updatedAt: new Date(),
              })
            );
            break;

          case !type:
            ws.send({
              type: "Error",
              error: "Requested method not implemented",
              updatedAt: new Date(),
            });
            break;
          default:
            console.log(`Unknown message type: ${type}`);
        }
      } catch (error) {
        console.log(error.message);
        ws.send(
          JSON.stringify({
            type: "Error",
            error: "Bad formatted payload, non JSON",
            updatedAt: new Date(),
          })
        );
      }
    }, 1000);
  });
});
