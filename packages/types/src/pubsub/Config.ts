import { Channel, ConsumeMessage, ChannelModel } from "amqplib";

export interface IPubSubConfig {
  user: string;
  password: string;
  host: string;
  port: number;
}

export interface IPubSub {
  channel: Channel;
  connection: ChannelModel;
  config: IPubSubConfig;
  connect(): Promise<void>;
  publish(queue: string, message: any): Promise<void>;
  subscribe(queue: string, callback: (message: any) => void): Promise<void>;
}
