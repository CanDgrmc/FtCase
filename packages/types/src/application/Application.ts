import { Server } from "socket.io";
import { ICache, IDB } from "../data/Data";
import { IPubSub } from "../pubsub/Config";
import {
  IApiConfig,
  IApplicationConfig,
  IApplicationTypes,
  IJobAppConfig,
  ISocketAppConfig,
} from "./Config";

interface IApi {
  config: IApiConfig;
  cache: ICache;
  db: IDB;
  build: () => Promise<IApi>;
  buildModules: () => Promise<void>;
  run: () => Promise<void>;
}

interface ISocket {
  cache: ICache;
  config: ISocketAppConfig;
  pubsub: IPubSub;
  io: Server;
  build: () => Promise<ISocket>;
  run: () => Promise<void>;
}

interface IJob {
  config: IJobAppConfig;
  cache: ICache;
  db: IDB;
  pubsub: IPubSub;
  build: () => Promise<IJob>;
  run: () => Promise<void>;
}
interface IApplication {
  api: IApi;
  socket: ISocket;
  job: IJob;
}
type IApplicationFactory = <T extends IApplicationTypes>(
  type: T,
  config: IApplicationConfig<T>
) => IApplication[T];

export { IApplication, IApplicationFactory, IApi, ISocket, IJob };
