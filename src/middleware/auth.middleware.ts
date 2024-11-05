import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { verify } from 'jsonwebtoken';

export interface ExpressRequest extends Request {
  user?: any;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async use(req: ExpressRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      this.logger.warn('No authorization header provided');
      req.user = null;
      next();
      return;
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = verify(token, this.configService.get<string>('JWT_SECRET')) as { email: string };
      const user = await this.userService.findByEmail(decoded.email);
      req.user = user;
      this.logger.log(`User authenticated: ${user.email}`);
      next();
    } catch (err) {
      this.logger.error('Invalid or expired access token', err.message);
      req.user = null;
      next();
    }
  }
}