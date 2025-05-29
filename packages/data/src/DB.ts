import { IDB, IDBConfig } from "@ftcase-sdk/types";
import { createLogger, process as utilProcess } from "@ftcase-sdk/utils";
import { Sequelize } from "sequelize";
import { modelsInit } from "./index";

const logger = createLogger("package:data:db");
export default class DB implements IDB {
  static instance: DB;
  client: Sequelize;
  config: IDBConfig;
  isConnected: boolean = false;
  constructor(conf: IDBConfig) {
    this.config = conf;
    this.client = new Sequelize({
      host: this.config.host,
      port: this.config.port,
      username: this.config.user,
      password: this.config.password,
      database: this.config.database,
      dialect: "mysql",
      logging: this.config.logQueries,
      ssl:true,
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false
        },
      }
    });
  }

  static getInstance(conf: IDBConfig) {
    if (!DB.instance) {
      DB.instance = new DB(conf);
    }
    return DB.instance;
  }

  async connect() {
    try {
   
      await utilProcess.executeWithTimeoutAndRetry(
        this.client.authenticate(),
        this.config.connectionTimeout,
        3
      );
      await this.client.query(
        "SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))"
      );

      logger.debug("Connection has been established successfully.");
      this.isConnected = true;
    } catch (error) {
      logger.error("Unable to connect to the database:", error);
      throw error;
    }
  }

  async buildModels() {
    try {
      if (!this.isConnected) {
        throw new Error("Database not connected");
      }
      await modelsInit(this);
    } catch (error) {
      logger.error("Unable to sync models:", error);
    }
  }
}
