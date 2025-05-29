import { applicationFactory } from "@ftcase-sdk/core";
import { env } from "@ftcase-sdk/utils";
import { config } from "dotenv";
import { init as customerModuleInit } from "./modules/customer/init";
config();

const run = async () => {
  let app = applicationFactory("api", {
    port: Number.parseInt(env.withDefault(process.env.PORT, "3000")),
    env: "development",
    jwtExpiresIn: env.withDefault(process.env.JWT_EXPIRES_IN, "1d"),
    jwtSecret: env.withDefault(process.env.JWT_SECRET, "secret"),
    db: {
      host: env.withDefault(process.env.DB_HOST, "127.0.0.1"),
      port: Number.parseInt(env.withDefault(process.env.DB_PORT, "3306")),
      user: env.withDefault(process.env.DB_USER, "root"),
      password: process.env.DB_PASSWORD,
      database: env.withDefault(process.env.DB_TABLE, "ftcase"),
      logQueries: ["true", "TRUE", "1"].includes(
        env.withDefault(process.env.LOG_QUERIES, "false")
      ),
      connectionTimeout: Number.parseInt(
        env.withDefault(process.env.CONNECTION_TIMEOUT, "10000")
      ),
    },
    cache: {
      host: env.withDefault(process.env.CACHE_HOST, "127.0.0.1"),
      port: Number.parseInt(env.withDefault(process.env.CACHE_PORT, "6379")),
      password: process.env.CACHE_PASSWORD,
    },
    modules: [customerModuleInit],
    cors: {
      origin: ["*"],
    },
    rateLimit: {
      rateLimitWindowMs: Number.parseInt(
        env.withDefault(process.env.RATE_LIMIT_WINDOW_MS, "" + 15 * 60 * 1000)
      ),
      rateLimit: Number.parseInt(
        env.withDefault(process.env.RATE_LIMIT, "100")
      ),
    },
  });

  await app.build();
  await app.run();
};

run().catch((err) => console.error(err));
