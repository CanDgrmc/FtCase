import { DB, Cache } from "@ftcase-sdk/data";
import {
  ICacheConfig,
  IDBConfig,
  IPubSub,
  IPubSubConfig,
  ICache,
  IDB,
} from "@ftcase-sdk/types";
import PubSub from "@ftcase-sdk/pubsub";

export default class AppBase {
  db: IDB;
  cache: ICache;
  pubsub: IPubSub;
  async buildDatabaseInstance(config: IDBConfig): Promise<IDB> {
    const databaseInstance = new DB(config);
    await databaseInstance.connect();

    await databaseInstance.buildModels();

    this.db = databaseInstance;

    return databaseInstance;
  }

  async buildCacheInstance(config: ICacheConfig): Promise<ICache> {
    const cacheInstance = new Cache(config);
    await cacheInstance.connect();
    this.cache = cacheInstance;
    return cacheInstance;
  }

  async buildPubSubInstance(config: IPubSubConfig): Promise<IPubSub> {
    const pubSubInstance = new PubSub(config);
    await pubSubInstance.connect();
    this.pubsub = pubSubInstance;
    return pubSubInstance;
  }
}
