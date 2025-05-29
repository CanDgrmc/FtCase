import { ICacheConfig, ICache } from "@ftcase-sdk/types";
import { createClient, type RedisClientType } from "redis";
import { createLogger } from "@ftcase-sdk/utils";

const logger = createLogger("package:data:cache");
export default class Cache implements ICache {
  client: RedisClientType;

  constructor(config: ICacheConfig) {
    this.client = createClient({
      socket: {
        host: config.host,
        port: config.port,
      },
      password: config.password || undefined,
    });
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      logger.debug("Redis connection has been established successfully.");
    } catch (error) {
      logger.error("Unable to connect to the cache:", error);
      throw error;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    await this.client.set(
      key,
      value,
      ttl
        ? {
            expiration: {
              type: "EX",
              value: ttl,
            },
          }
        : {}
    );
  }

  async get(key: string): Promise<string | null> {
    const data = await this.client.get(key);
    return data as string;
  }

  async getAllPrefix(prefix: string): Promise<string[]> {
    const keys = await this.client.keys(`${prefix}*`);

    const data = await Promise.all(keys.map(async (key) => this.get(key)));

    return data;
  }

  async deleteAllPrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}*`);

    await Promise.all(keys.map(async (key) => this.del(key)));
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
