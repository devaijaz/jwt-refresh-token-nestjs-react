import * as winston from 'winston';
const { combine, timestamp, label, prettyPrint, json, simple } = winston.format;

const customFormat = combine(timestamp(), label(), prettyPrint(), json());
const isProd = process.env.STAGE === 'prod';
const getLogger = (extra: Record<string, string>) => {
  const logger = winston.createLogger({
    level: isProd ? 'error' : 'info',
    defaultMeta: { ...extra },
    format: winston.format.simple(),
  });
  return logger;
};

export const getApplicationLogger = (extra: Record<string, string> = {}) => {
  const logger = getLogger(extra);
  if (isProd) {
    logger.add(
      new winston.transports.File({
        filename: 'error.log',
        level: 'error',
      }),
    );
    logger.add(
      new winston.transports.File({
        format: simple(),
        filename: 'app.log',
        level: 'info',
      }),
    );
  } else {
    logger.add(
      new winston.transports.Console({
        format: simple(),
      }),
    );
  }
  return logger;
};

export const getHttpLogger = (extra: Record<string, string> = {}) => {
  const logger = getLogger(extra);
  if (isProd) {
    logger.add(
      new winston.transports.File({
        filename: 'access.log',
        level: 'info',
      }),
    );
  } else {
    logger.add(
      new winston.transports.Console({
        level: 'info',
        format: customFormat,
      }),
    );
  }
  return logger;
};
