import winston from "winston";

export const createLogger = (source: string) => {
  const logger = winston.createLogger({
    level: "debug",
    format: winston.format.json(),
    defaultMeta: { source: source },
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    ],
  });

  return logger;
};
