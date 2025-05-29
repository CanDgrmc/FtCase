import { IPubSub, IPubSubConfig } from "@ftcase-sdk/types";
import { createLogger, process as utilProcess } from "@ftcase-sdk/utils";
import client, {
  Channel,
  ChannelModel,
  ConsumeMessage
} from "amqplib";

const logger = createLogger("package:pubsub");

export default class PubSubService implements IPubSub {
  connection: ChannelModel;
  channel!: Channel;
  config: IPubSubConfig;
  private isConnected: boolean = false;
  constructor(config: IPubSubConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }
    await utilProcess.executeWithTimeoutAndRetry(
      (async () => {
        this.connection = await client.connect(
          `amqp://${this.config.user}:${this.config.password}@${this.config.host}:${this.config.port}`
        );
      })(),
      15000,
      10
    );

    this.channel = await this.connection.createChannel();
    this.isConnected = true;

    logger.debug("Amqp connection established..");
  }

  async publish(queue: string, message: any) {
    try {
      if (!this.isConnected || !this.channel) {
        await this.connect();
      }
      const result = this.channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message))
      );
      if (!result) {
        logger.debug(`Message not published to ${queue} queue`);
      }
    } catch (error) {
      logger.error("Error sending message to queue:", error);
      throw error;
    }
  }

  async subscribe(queue: string, callback: (message: any) => void) {
    try {
      if (!this.isConnected || !this.channel) {
        await this.connect();
      }

      await this.channel.assertQueue(queue, { durable: false });

      this.channel.consume(queue, (msg: ConsumeMessage | null) => {
        if (msg) {
          const message = JSON.parse(msg.content.toString());
          callback(message);
          this.channel.ack(msg);
        }
      });
    } catch (error) {
      logger.error("Error subscribing to queue:", error);
      throw error;
    }
  }
}
