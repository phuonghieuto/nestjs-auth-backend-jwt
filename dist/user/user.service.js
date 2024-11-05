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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_schema_1 = require("./schemas/user.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("@nestjs/config");
const email_already_taken_exception_1 = require("../exceptions/email-already-taken.exception");
const user_not_found_exception_1 = require("../exceptions/user-not-found.exception");
const incorrect_password_exception_1 = require("../exceptions/incorrect-password.exception");
let UserService = UserService_1 = class UserService {
    constructor(userModel, configService) {
        this.userModel = userModel;
        this.configService = configService;
        this.logger = new common_1.Logger(UserService_1.name);
    }
    async createUser(createUserDto) {
        this.logger.log('Creating a new user');
        const user = await this.userModel.findOne({ email: createUserDto.email });
        if (user) {
            this.logger.warn(`Email ${createUserDto.email} is already taken`);
            throw new email_already_taken_exception_1.default(createUserDto.email);
        }
        try {
            const createdUser = new this.userModel(createUserDto);
            const savedUser = await createdUser.save();
            const userResponse = this.buildUserResponse(savedUser);
            await this.userModel.updateOne({ email: savedUser.email }, { refreshToken: userResponse.refreshToken });
            this.logger.log(`User ${createUserDto.email} created successfully`);
            return userResponse;
        }
        catch (error) {
            this.logger.error('Error creating user:', error);
            throw new Error('Internal Server Error');
        }
    }
    async loginUser(loginDto) {
        this.logger.log(`Logging in user ${loginDto.email}`);
        const user = await this.userModel
            .findOne({ email: loginDto.email })
            .select('+password');
        if (!user) {
            this.logger.warn(`User ${loginDto.email} not found`);
            throw new user_not_found_exception_1.default(loginDto.email);
        }
        const isPasswordCorrect = await (0, bcrypt_1.compare)(loginDto.password, user.password);
        if (!isPasswordCorrect) {
            this.logger.warn(`Incorrect password for user ${loginDto.email}`);
            throw new incorrect_password_exception_1.default();
        }
        const userResponse = this.buildUserResponse(user);
        await this.userModel.updateOne({ email: user.email }, { refreshToken: userResponse.refreshToken });
        this.logger.log(`User ${loginDto.email} logged in successfully`);
        return userResponse;
    }
    async logoutUser(email) {
        this.logger.log(`Logging out user ${email}`);
        await this.userModel.updateOne({ email }, { $unset: { refreshToken: 1 } });
    }
    buildUserResponse(userEntity) {
        const accessToken = this.generateJwt(userEntity, 'access');
        const refreshToken = this.generateJwt(userEntity, 'refresh');
        return {
            name: userEntity.name,
            email: userEntity.email,
            accessToken: accessToken,
            refreshToken: refreshToken,
            createdAt: userEntity.createdAt,
        };
    }
    generateJwt(userEntity, type) {
        const secret = type === 'access'
            ? this.configService.get('JWT_SECRET')
            : this.configService.get('JWT_REFRESH_SECRET');
        const expiresIn = type === 'access'
            ? this.configService.get('JWT_EXPIRATION')
            : this.configService.get('JWT_REFRESH_EXPIRATION');
        return (0, jsonwebtoken_1.sign)({ email: userEntity.email }, secret, { expiresIn });
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email });
    }
    async refreshToken(token) {
        try {
            const decoded = (0, jsonwebtoken_1.verify)(token, this.configService.get('JWT_REFRESH_SECRET'));
            const user = await this.findByEmail(decoded.email);
            if (!user) {
                throw new user_not_found_exception_1.default(decoded.email);
            }
            return user;
        }
        catch (error) {
            throw new common_1.UnauthorizedException();
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.UserEntity.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService])
], UserService);
//# sourceMappingURL=user.service.js.map