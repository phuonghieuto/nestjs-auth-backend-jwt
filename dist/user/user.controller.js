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
var UserController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const create_user_dto_1 = require("./dto/create-user.dto");
const user_service_1 = require("./user.service");
const login_dto_1 = require("./dto/login.dto");
const swagger_1 = require("@nestjs/swagger");
const http_exception_filter_1 = require("../filters/http-exception.filter");
const unauthorized_exception_1 = require("../exceptions/unauthorized.exception");
const user_response_dto_1 = require("./dto/user-response.dto");
let UserController = UserController_1 = class UserController {
    constructor(userService) {
        this.userService = userService;
        this.logger = new common_1.Logger(UserController_1.name);
    }
    async home(res) {
        return res.status(common_1.HttpStatus.OK).json("It's working!");
    }
    async createUser(createUserDto, res) {
        this.logger.log('Registering a new user');
        try {
            const userResponse = await this.userService.createUser(createUserDto);
            const { accessToken, refreshToken, ...userWithoutTokens } = userResponse;
            return res.status(common_1.HttpStatus.OK).json(userWithoutTokens);
        }
        catch (error) {
            return res.status(error.getStatus()).json(error.getResponse());
        }
    }
    async login(loginDto, res) {
        this.logger.log('User login attempt');
        try {
            const userResponse = await this.userService.loginUser(loginDto);
            return res.status(common_1.HttpStatus.OK).json(userResponse);
        }
        catch (error) {
            return res.status(error.getStatus()).json(error.getResponse());
        }
    }
    async refreshToken(refreshToken, res) {
        this.logger.log('Refreshing access token');
        try {
            const user = await this.userService.refreshToken(refreshToken);
            const { accessToken } = this.userService.buildUserResponse(user);
            return res.status(common_1.HttpStatus.OK).json({ accessToken: accessToken });
        }
        catch (error) {
            return res.status(error.getStatus()).json(error.getResponse());
        }
    }
    async currentUser(request, res) {
        this.logger.log('Fetching current user');
        if (!request.user) {
            throw new unauthorized_exception_1.default();
        }
        const user = await this.userService.findByEmail(request.user.email);
        if (!user) {
            throw new unauthorized_exception_1.default();
        }
        const { accessToken, refreshToken, ...userWithoutTokens } = this.userService.buildUserResponse(user);
        return res.status(common_1.HttpStatus.OK).json(userWithoutTokens);
    }
    async logout(email, res) {
        this.logger.log('User logout attempt');
        try {
            await this.userService.logoutUser(email);
            return res.status(common_1.HttpStatus.OK).json({ message: 'User logged out successfully' });
        }
        catch (error) {
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error logging out user' });
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(''),
    (0, swagger_1.ApiOperation)({ summary: 'Check if the service is working' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is working' }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "home", null);
__decorate([
    (0, common_1.Post)('user/register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User registered successfully',
        type: user_response_dto_1.UserResponseDto,
        examples: {
            success: {
                summary: 'Success Response',
                value: {
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    createdAt: '2023-10-01T00:00:00.000Z',
                },
            },
            error: {
                summary: 'Error Response',
                value: {
                    title: 'Bad Request',
                    status: 400,
                    detail: 'The request could not be processed due to semantic errors. Please check your input and try again.',
                    errors: [
                        { message: 'Email must be a valid email address' },
                        { message: 'Password is required' },
                    ],
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, common_1.Post)('users/login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login a user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User logged in successfully',
        type: user_response_dto_1.UserResponseDto,
        examples: {
            success: {
                summary: 'Success Response',
                value: {
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    accessToken: 'new-jwt-token',
                    refreshToken: 'new-refresh-token',
                    createdAt: '2023-10-01T00:00:00.000Z',
                },
            },
            error: {
                summary: 'Error Response',
                value: {
                    title: 'Bad Request',
                    status: 400,
                    detail: 'The request could not be processed due to semantic errors. Please check your input and try again.',
                    errors: [
                        { message: 'Email must be a valid email address' },
                        { message: 'Password is required' },
                    ],
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('users/refresh-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token refreshed successfully',
        examples: {
            success: {
                summary: 'Success Response',
                value: {
                    accessToken: 'new-jwt-token',
                },
            },
            error: {
                summary: 'Error Response',
                value: {
                    title: 'Unauthorized',
                    status: 401,
                    detail: 'Invalid refresh token',
                    errors: [{ message: 'Invalid refresh token' }],
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)('refreshToken')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Get)('user'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Current user fetched successfully',
        type: user_response_dto_1.UserResponseDto,
        headers: {
            Authorization: {
                description: 'Bearer token',
                required: true,
            },
        },
        examples: {
            success: {
                summary: 'Success Response',
                value: {
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    createdAt: '2023-10-01T00:00:00.000Z',
                },
            },
            unauthorized: {
                summary: 'Unauthorized Response',
                value: {
                    title: 'Unauthorized',
                    status: 401,
                    detail: 'Unauthorized access',
                    errors: [{ message: 'Unauthorized' }],
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "currentUser", null);
__decorate([
    (0, common_1.Post)('users/logout'),
    (0, swagger_1.ApiOperation)({ summary: 'Logout a user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User logged out successfully',
    }),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logout", null);
exports.UserController = UserController = UserController_1 = __decorate([
    (0, swagger_1.ApiTags)('user'),
    (0, common_1.Controller)(),
    (0, common_1.UseFilters)(http_exception_filter_1.HttpExceptionFilter),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map