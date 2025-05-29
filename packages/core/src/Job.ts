import { IJob, IJobAppConfig } from "@ftcase-sdk/types";
import { createLogger } from "@ftcase-sdk/utils";
import AppBase from "./AppBase";

const logger = createLogger("package:core:job");

export class Job extends AppBase implements IJob {
  config: IJobAppConfig;
  constructor(config: IJobAppConfig) {
    super();
    this.config = config;
  }
  async build(): Promise<Job> {
    await this.buildDatabaseInstance(this.config.db);
    await this.buildCacheInstance(this.config.cache);
    await this.buildPubSubInstance(this.config.queue);
    logger.debug("Application built");
    return this;
  }

  async run(): Promise<void> {
    const processTask = async () => {
      try {
        if (Array.isArray(this.config.exec)) {
          await Promise.all(
            this.config.exec.map(async (exec) => {
              await exec({ db: this.db, cache: this.cache, pubSub: this.pubsub });
            })
          );
  
          return;
        }
        await this.config.exec({
          db: this.db,
          cache: this.cache,
          pubSub: this.pubsub,
        });
      } catch(err) {

        logger.error('Job failed..',err);
      }
      
    };

    setInterval(() => {
      processTask();
    }, this.config.execInterval);
  }
}
