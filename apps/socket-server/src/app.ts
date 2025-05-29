import { applicationFactory } from "@ftcase-sdk/core";
import { config } from "dotenv";
import { env } from "@ftcase-sdk/utils";
config();
const run = async () => {
  const app = applicationFactory("socket", {
    port: Number.parseInt(env.withDefault(process.env.PORT, "3001")),
    env: "development",
    cache: {
      host: env.withDefault(process.env.CACHE_HOST, "127.0.0.1"),
      port: Number.parseInt(env.withDefault(process.env.CACHE_PORT, "6379")),
      password: process.env.CACHE_PASSWORD,
    },
    queue: {
      host: env.withDefault(process.env.QUEUE_HOST, "127.0.0.1"),
      user: env.withDefault(process.env.QUEUE_USER, "guest"),
      password: env.withDefault(process.env.QUEUE_PASSWORD, "guest"),
      port: Number.parseInt(env.withDefault(process.env.QUEUE_PORT, "5672")),
    },
  });

  await app.build();
  await app.run();

  app.pubsub.subscribe("symbols", (data) => {
    const parsed = JSON.parse(data);
    app.cache.set(`symbol-${parsed.symbol}`, data);
  });

  setInterval(async () => {
    const data = await app.cache.getAllPrefix("symbol-");
    if (data.length) {
      app.io.emit("symbol:price:update", JSON.stringify(data));
    }

    //await app.cache.deleteAllPrefix("symbol-");
  }, 500);
};

run().catch((err) => console.error(err));
