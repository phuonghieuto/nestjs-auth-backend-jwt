"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const config_1 = require("@nestjs/config");
const user_service_1 = require("../user/user.service");
const common_1 = require("@nestjs/common");
const jsonwebtoken_1 = require("jsonwebtoken");
let AuthMiddleware = AuthMiddleware_1 = class AuthMiddleware {
    constructor(userService, configService) {
        this.userService = userService;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthMiddleware_1.name);
    }
    async use(req, res, next) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            this.logger.warn('No authorization header provided');
            req.user = null;
            next();
            return;
        }
        const token = authHeader.split(' ')[1];
        try {
            const decoded = (0, jsonwebtoken_1.verify)(token, this.configService.get('JWT_SECRET'));
            const user = await this.userService.findByEmail(decoded.email);
            req.user = user;
            this.logger.log(`User authenticated: ${user.email}`);
            next();
        }
        catch (err) {
            this.logger.error('Invalid or expired access token', err.message);
            req.user = null;
            next();
        }
    }
};
exports.AuthMiddleware = AuthMiddleware;
exports.AuthMiddleware = AuthMiddleware = AuthMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        config_1.ConfigService])
], AuthMiddleware);
//# sourceMappingURL=auth.middleware.js.map