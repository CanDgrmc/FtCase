import { applicationFactory } from "@ftcase-sdk/core";
import { HSymbolChart } from "@ftcase-sdk/data";
import { ICache, IDB, IPubSub } from "@ftcase-sdk/types";
import { createLogger, env, num, Timer } from "@ftcase-sdk/utils";
import { config } from "dotenv";
import moment from "moment-timezone";

config();

enum QUEUE_KEYS {
  SYMBOLS = "symbols",
}

const logger = createLogger("data-provider");

const job = async (context: { db: IDB; cache: ICache; pubSub: IPubSub }) => {
  const timer = new Timer();
  timer.start();
  const cachedSymbols = await context.cache.getAllPrefix("symbol-");
  const mappedSymbols = {};

  for (let s of cachedSymbols) {
    const parsed = JSON.parse(s);
    mappedSymbols[parsed.symbol] = parsed;
  }

  let promises = [];
  const symbols = await HSymbolChart.findAll({
    group: ["symbol"],
    order: [["dataTimestamp", "DESC"]],
  });

  for (let symbolItem of symbols) {
    let {
      high: highestPrice,
      low: lowestPrice,
      open: openPrice,
      close: closePrice,
      dataTimestamp,
    } = symbolItem;

    let lastPrice: number = closePrice;
    let dailyChangePercentage = 0;

    const latestRecord = mappedSymbols[symbolItem.symbol];

    if (latestRecord) {
      lastPrice = latestRecord.close;
      dataTimestamp = latestRecord.dataTimestamp;
      openPrice = latestRecord.open;
      highestPrice = latestRecord.high;
      lowestPrice = latestRecord.low;
      dailyChangePercentage = latestRecord.dailyChangePercentage;
    }

    if (moment().tz("Europe/Istanbul").startOf("day").isAfter(dataTimestamp)) {
      // set new day open
      const { newPrice, direction, percentage } = num.generateRandomPrice(
        lastPrice,
        1
      );

      highestPrice = direction === "up" ? newPrice : openPrice;
      lowestPrice = direction === "down" ? newPrice : openPrice;

      dailyChangePercentage =
        direction === "up"
          ? dailyChangePercentage + percentage
          : dailyChangePercentage - percentage;

      const newData = {
        symbol: symbolItem.symbol,
        percentage,
        open: lastPrice,
        high: highestPrice,
        low: lowestPrice,
        close: newPrice,
        direction,
        dataTimestamp: moment().tz("Europe/Istanbul").toISOString(true),
        dailyChangePercentage,
      };

      promises.push(
        context.pubSub.publish(QUEUE_KEYS.SYMBOLS, JSON.stringify(newData))
      );
    } else {
      const { newPrice, direction, percentage } = num.generateRandomPrice(
        lastPrice,
        1
      );

      dailyChangePercentage =
        direction === "up"
          ? dailyChangePercentage + percentage
          : dailyChangePercentage - percentage;
      const newData = {
        symbol: symbolItem.symbol,
        percentage,
        open: lastPrice,
        high: highestPrice > newPrice ? highestPrice : newPrice,
        low: lowestPrice < newPrice ? lowestPrice : newPrice,
        close: newPrice,
        direction,
        dataTimestamp: moment().tz("Europe/Istanbul").toISOString(true),
        dailyChangePercentage,
      };

      promises.push(
        context.pubSub.publish(QUEUE_KEYS.SYMBOLS, JSON.stringify(newData))
      );
    }
  }

  await Promise.all(promises);

  logger.debug(`Execution time: ${timer.end()}ms`);
};

const run = async () => {
  const app = applicationFactory("job", {
    env: "development",
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
    queue: {
      host: env.withDefault(process.env.QUEUE_HOST, "127.0.0.1"),
      user: env.withDefault(process.env.QUEUE_USER, "guest"),
      password: env.withDefault(process.env.QUEUE_PASSWORD, "guest"),
      port: Number.parseInt(env.withDefault(process.env.QUEUE_PORT, "5672")),
    },
    exec: job,
    execInterval: Number.parseInt(
      env.withDefault(process.env.JOB_INTERVAL, "1000")
    ),
  });

  await app.build();
  await app.run();
};

run().catch((err) => logger.error(err));
