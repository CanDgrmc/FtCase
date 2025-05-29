import { ICache, ICacheConfig, IDB, IDBConfig } from "../data/Data";
import { IPubSub, IPubSubConfig } from "../pubsub/Config";
import { IModuleInit } from "./Module";

interface IApiCorsConfig {
  origin: string[];
}

interface IApiRateLimitConfig {
  rateLimitWindowMs: number;
  rateLimit: number;
}

interface IApiConfig {
  port: number;
  env: string;
  db: IDBConfig;
  cache: ICacheConfig;
  jwtSecret: string;
  jwtExpiresIn: string;
  modules: IModuleInit[];
  cors: IApiCorsConfig;
  rateLimit: IApiRateLimitConfig;
}
interface ISocketAppConfig {
  port: number;
  env: string;
  cache: ICacheConfig;
  queue: IPubSubConfig;
}
type IJobExecution = (context: {
  db: IDB;
  cache: ICache;
  pubSub: IPubSub;
}) => Promise<void>;
interface IJobAppConfig {
  db: IDBConfig;
  cache: ICacheConfig;
  env: string;
  exec: IJobExecution | IJobExecution[];
  execInterval: number;
  queue: IPubSubConfig;
}
type IAppConfigMap = {
  api: IApiConfig;
  socket: ISocketAppConfig;
  job: IJobAppConfig;
};
type IApplicationTypes = "socket" | "job" | "api";
type IApplicationConfig<T extends IApplicationTypes> = IAppConfigMap[T];

export {
  IApplicationConfig,
  IApplicationTypes,
  IAppConfigMap,
  ISocketAppConfig,
  IJobAppConfig,
  IApiConfig,
};
