//const server = require("http");
const http = require("../index");
const app = require("./app");
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("hello world");
});
