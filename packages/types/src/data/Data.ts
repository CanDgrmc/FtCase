import { RedisClientType } from "redis";

interface IDBConfig {
  host: string;
  database: string;
  user: string;
  password?: string;
  port: number;
  logQueries?: boolean;
  connectionTimeout: number;
}
interface ICacheConfig {
  host: string;
  port: number;
  user?: string;
  password?: string;
}

interface IDB {
  connect(): Promise<void>;
  buildModels(): Promise<void>;
  isConnected: boolean;
  config: IDBConfig;
}

interface ICache {
  connect(): Promise<void>;
  client: RedisClientType;
  set(key: string, value: string, ttl?: number): Promise<void>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<void>;
  getAllPrefix(prefix: string): Promise<string[]>;
  deleteAllPrefix(prefix: string): Promise<void>;
}

export { IDBConfig, ICacheConfig, IDB, ICache };
