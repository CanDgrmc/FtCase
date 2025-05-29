import { ISocket, ISocketAppConfig } from "@ftcase-sdk/types";
import { createLogger } from "@ftcase-sdk/utils";

import AppBase from "./AppBase";
import { Server } from "socket.io";

const logger = createLogger("package:core:socket");
export class Socket extends AppBase implements ISocket {
  config: ISocketAppConfig;
  io: Server;
  constructor(config: ISocketAppConfig) {
    super();
    this.config = config;
  }

  async build(): Promise<ISocket> {
    await this.buildCacheInstance(this.config.cache);
    await this.buildPubSubInstance(this.config.queue);
    this.io = new Server();
    this.io.on("connection", (socket) => {
      logger.debug("a client connected");
    });

    logger.debug("Application built");
    return this;
  }

  async run(): Promise<void> {
    logger.debug("Application running on " + this.config.port);

    this.io.listen(this.config.port);
  }
}
