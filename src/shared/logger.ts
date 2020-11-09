/* eslint-disable new-cap */
import winston from 'winston';

// log levels
// error
// warn
// info
// http
// verbose
// debug
// silly

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.prettyPrint(),
  winston.format.printf(info => `${info.timestamp} | ${info.level} | ${info.message}`),
);
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.json(),
);
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: consoleFormat,
    }),
    new winston.transports.File({
      level: 'warn',
      filename: './.logs/app.log',
      handleExceptions: true,
      format: fileFormat,
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

export default logger;
