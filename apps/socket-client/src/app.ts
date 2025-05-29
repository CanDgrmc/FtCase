import { io } from "socket.io-client";
import { config } from "dotenv";
import { handlePriceUpdate } from "./handlers/SymbolPrice";
config();

const run = async () => {
  const socket = io(
    `ws://${process.env.SOCKET_HOST}:${process.env.SOCKET_PORT}`
  );
  socket.on("connect", () => {
    console.log("[CLIENT]: connected");
  });
  socket.on("disconnect", () => {
    console.log("[CLIENT]: disconnected");
  });

  socket.on("error", (err) => {
    console.log(err);
  });

  socket.on("symbol:price:update", handlePriceUpdate);

  socket.connect();
  console.log("[CLIENT]: socket client is up");
};

run().catch((err) => console.error(err));
