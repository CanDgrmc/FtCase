import {
  IApplication,
  IApplicationConfig,
  IApplicationFactory,
  IApplicationTypes,
} from "@ftcase-sdk/types";
import { Socket } from "./Socket";
import { Job } from "./Job";
import { Api } from "./Api";

const applicationFactory: IApplicationFactory = <T extends IApplicationTypes>(
  type: T,
  config: IApplicationConfig<T>
): IApplication[T] => {
  switch (type) {
    case "socket":
      return new Socket(
        config as IApplicationConfig<"socket">
      ) as unknown as IApplication[T];
    case "job":
      return new Job(
        config as IApplicationConfig<"job">
      ) as unknown as IApplication[T];
    case "api":
      return new Api(
        config as IApplicationConfig<"api">
      ) as unknown as IApplication[T];
    default:
      throw new Error("Invalid application type");
  }
};

export { applicationFactory };
