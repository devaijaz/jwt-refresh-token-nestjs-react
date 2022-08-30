import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { getHttpLogger } from '../logger/winston-logger';
import winston from 'winston';

@Injectable()
export class HttpLogMiddleware implements NestMiddleware {
  private logger: winston.Logger;

  constructor() {
    this.logger = getHttpLogger();
  }
  use(request: Request, response: Response, next: NextFunction) {
    const { url, ip, method } = request;
    const ua = request.get('user-agent') || 'ua';
    response.on('close', () => {
      const user = (request.user as { id: string })?.id ?? 'user';
      const { statusCode } = response;
      const contentLength = response.get('content-length') ?? 0;
      const logMessage = `[${method}] ${url} ${statusCode} ${contentLength} ${user} ${ip} ${ua}`;
      this.logger.info(logMessage);
    });
    next();
  }
}
