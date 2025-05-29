import { IApiConfig, IApi } from "@ftcase-sdk/types";
import { createLogger } from "@ftcase-sdk/utils";
import express from "express";
import { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import AppBase from "./AppBase";
import { rateLimit } from "express-rate-limit";

const logger = createLogger("package:core");
export class Api extends AppBase implements IApi {
  config: IApiConfig;
  app: Application;
  constructor(config: IApiConfig) {
    super();
    this.config = config;
    this.app = express();
  }

  async buildModules() {
    this.config.modules.forEach((module) => {
      const { prefix, router } = module(express.Router());
      logger.debug(`Module ${prefix} loaded`);
      this.app.use(prefix, router);
    });
  }

  async build(): Promise<Api> {
    this.app.use(bodyParser.json());
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: this.config.cors.origin,
      })
    );
    this.app.use(
      rateLimit({
        windowMs: this.config.rateLimit.rateLimitWindowMs,
        limit: this.config.rateLimit.rateLimit,
        standardHeaders: "draft-8",
        legacyHeaders: false,
      })
    );
    await this.buildDatabaseInstance(this.config.db);
    await this.buildCacheInstance(this.config.cache);
    await this.buildModules();

    this.app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    this.app.use((err, req, res, next) => {
      logger.error(err.stack);
      res.status(500).send("Internal Server Error");
    });

    logger.debug("Application built");
    return this;
  }

  async run(): Promise<void> {
    logger.debug("Application running");
    this.app.listen(this.config.port, () => {
      logger.debug(`Server is running on port ${this.config.port}`);
    });
  }
}
