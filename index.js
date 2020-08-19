const app = require("./app/app");
const database = require("./database");
const config = require("./config");
const chat = require("./app/chat");
const { profile } = require("console");
const http = require("http").createServer(app);
const profiledb = require("./models/profile");
var io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("connection");
  socket.on("disconect", () => {
    console.log("disconect");
  });
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

database()
  .then((info) => {
    console.log(`connected to ${info.host}:${info.port}/${info.name}`);
    http.listen(config.PORT, () => {
      console.log(`Server start on ${config.PORT}`);
    });
  })
  .catch(() => {
    console.error("unable to connect");
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });

module.exports = http;
