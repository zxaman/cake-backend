import { createLogger, transports, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logDir = "logs";
const { combine, timestamp, printf, json, colorize } = format;

const myFormat = printf(({ timestamp, level, message, ...info }) => {
  let msg = `${timestamp} [${level}] : ${message}`;
  if (info.httpEndpoint) {
    const httpInfo = `[${info.httpStatus || "Incoming"}] ${info.httpMethod} - ${
      info.httpEndpoint
    }`;
    const userDetails = info.userId ? `[USER - ${info.userId}]` : "";
    const reqPayload = info.payload
      ? `\nPayload : ${JSON.stringify(info.payload)}`
      : "";
    const stackTrace = info.stack ? `\n${info.stack}` : "";

    msg += ` ${httpInfo} ${userDetails} ${reqPayload} ${stackTrace}\n`;
  }
  return msg;
});

const combinedFormat = combine(
  json(),
  timestamp({ format: "DD-MM-YYYY HH:mm:ss.SSSZZ" }),
  myFormat,
);

const transportsArray = [
  new DailyRotateFile({
    level: "info",
    filename: `${logDir}/info-logs/info.log`,
    datePattern: "DD-MM-YYYY",
    maxFiles: "30d",
    maxSize: "50m",
    format: combinedFormat,
  }),
  new DailyRotateFile({
    level: "error",
    filename: `${logDir}/error-logs/error.log`,
    datePattern: "DD-MM-YYYY",
    handleExceptions: true,
    maxFiles: "30d",
    maxSize: "50m",
    format: combinedFormat,
  }),
];

if (process.env.NODE_ENV === "development") {
  transportsArray.push(
    new transports.Console({
      level: "debug",
      handleExceptions: true,
      handleRejections: true,
      format: combine(colorize({ all: true }), combinedFormat),
    }),
  );
}

const logger = createLogger({
  level: "debug",
  transports: transportsArray,
  exitOnError: false,
});

export const winstonStream = {
  write: (message) => {
    try {
      const [httpMethod, httpEndpoint, userId, rawPayload] = message.split("|");
      const payload = JSON.parse(rawPayload || "{}");

      logger.log({
        level: "info",
        httpMethod,
        httpEndpoint,
        userId: userId !== "-" ? userId : "",
        payload,
        message: "",
      });
    } catch (err) {
      logger.log({ level: "error", message });
    }
  },
};

export default logger;
