let io;

module.exports = (server) => {
  console.log(`socket...`);

  io = require("socket.io")(server, {
    cors: {
      origin: "*",
      // origin: "http://localhost:5000/",
      methods: ["GET", "POST"],
      transports: ["websocket", "polling"],
      credentials: true,
    },
    allowEIO3: true,
    pingTimeout: 10000,
    pingInterval: 5000,
  });

  io.on("connection", async (socket) => {
    console.log("socket connect...");
  });
};
