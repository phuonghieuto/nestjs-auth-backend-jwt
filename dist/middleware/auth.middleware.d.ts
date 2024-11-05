import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { NestMiddleware } from '@nestjs/common';
export interface ExpressRequest extends Request {
    user?: any;
}
export declare class AuthMiddleware implements NestMiddleware {
    private userService;
    private configService;
    private readonly logger;
    constructor(userService: UserService, configService: ConfigService);
    use(req: ExpressRequest, res: Response, next: NextFunction): Promise<void>;
}
