import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Request,
  Res,
  UseFilters,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { ExpressRequest } from '../middleware/auth.middleware';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import UnauthorizedException from '../exceptions/unauthorized.exception';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('user')
@Controller()
@UseFilters(HttpExceptionFilter)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get('')
  @ApiOperation({ summary: 'Check if the service is working' })
  @ApiResponse({ status: 200, description: 'Service is working' })
  async home(@Res() res: Response): Promise<any> {
    return res.status(HttpStatus.OK).json("It's working!");
  }

  @Post('user/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 200,
    description: 'User registered successfully',
    type: UserResponseDto,
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
  })
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<any> {
    this.logger.log('Registering a new user');
    try {
      const userResponse = await this.userService.createUser(createUserDto);
      const { accessToken, refreshToken, ...userWithoutTokens } = userResponse;
      return res.status(HttpStatus.OK).json(userWithoutTokens);
    } catch (error) {
      return res.status(error.getStatus()).json(error.getResponse());
    }
  }

  @Post('users/login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: UserResponseDto,
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
  })
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<any> {
    this.logger.log('User login attempt');
    try {
      const userResponse = await this.userService.loginUser(loginDto);
      return res.status(HttpStatus.OK).json(userResponse);
    } catch (error) {
      return res.status(error.getStatus()).json(error.getResponse());
    }
  }

  @Post('users/refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
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
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refreshToken(@Body('refreshToken') refreshToken: string, @Res() res: Response): Promise<any> {
    this.logger.log('Refreshing access token');
    try {
      const user = await this.userService.refreshToken(refreshToken);
      const { accessToken } = this.userService.buildUserResponse(user);
      return res.status(HttpStatus.OK).json({ accessToken: accessToken });
    } catch (error) {
      return res.status(error.getStatus()).json(error.getResponse());
    }
  }

  @Get('user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    description: 'Current user fetched successfully',
    type: UserResponseDto,
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
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async currentUser(
    @Request() request: ExpressRequest,
    @Res() res: Response,
  ): Promise<any> {
    this.logger.log('Fetching current user');
    if (!request.user) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.findByEmail(request.user.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const { accessToken, refreshToken, ...userWithoutTokens } = this.userService.buildUserResponse(user);
    return res.status(HttpStatus.OK).json(userWithoutTokens);
  }

  @Post('users/logout')
  @ApiOperation({ summary: 'Logout a user' })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully',
  })
  async logout(@Body('email') email: string, @Res() res: Response): Promise<any> {
    this.logger.log('User logout attempt');
    try {
      await this.userService.logoutUser(email);
      return res.status(HttpStatus.OK).json({ message: 'User logged out successfully' });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error logging out user' });
    }
  }
}