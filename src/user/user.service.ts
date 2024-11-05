import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserResponseDto } from './dto/user-response.dto';
import EmailAlreadyTakenException from '../exceptions/email-already-taken.exception';
import UserNotFoundException from '../exceptions/user-not-found.exception';
import IncorrectPasswordException from '../exceptions/incorrect-password.exception';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
    private configService: ConfigService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.log('Creating a new user');
    const user = await this.userModel.findOne({ email: createUserDto.email });

    if (user) {
      this.logger.warn(`Email ${createUserDto.email} is already taken`);
      throw new EmailAlreadyTakenException(createUserDto.email);
    }

    try {
      const createdUser = new this.userModel(createUserDto);
      const savedUser = await createdUser.save();
      const userResponse = this.buildUserResponse(savedUser);
      await this.userModel.updateOne({ email: savedUser.email }, { refreshToken: userResponse.refreshToken });
      this.logger.log(`User ${createUserDto.email} created successfully`);
      return userResponse;
    } catch (error) {
      this.logger.error('Error creating user:', error);
      throw new Error('Internal Server Error');
    }
  }

  async loginUser(loginDto: LoginDto): Promise<UserResponseDto> {
    this.logger.log(`Logging in user ${loginDto.email}`);
    const user = await this.userModel
      .findOne({ email: loginDto.email })
      .select('+password');
    if (!user) {
      this.logger.warn(`User ${loginDto.email} not found`);
      throw new UserNotFoundException(loginDto.email);
    }


    const isPasswordCorrect = await compare(loginDto.password, user.password);

    if (!isPasswordCorrect) {
      this.logger.warn(`Incorrect password for user ${loginDto.email}`);
      throw new IncorrectPasswordException();
    }

    const userResponse = this.buildUserResponse(user);
    await this.userModel.updateOne({ email: user.email }, { refreshToken: userResponse.refreshToken });
    this.logger.log(`User ${loginDto.email} logged in successfully`);
    return userResponse;
  }

  async logoutUser(email: string): Promise<void> {
    this.logger.log(`Logging out user ${email}`);
    await this.userModel.updateOne({ email }, { $unset: { refreshToken: 1 } });
  }

  buildUserResponse(userEntity: UserEntity): UserResponseDto {
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

  generateJwt(userEntity: UserEntity, type: 'access' | 'refresh'): string {
    const secret = type === 'access'
      ? this.configService.get<string>('JWT_SECRET')
      : this.configService.get<string>('JWT_REFRESH_SECRET');
    const expiresIn = type === 'access'
      ? this.configService.get<string>('JWT_EXPIRATION')
      : this.configService.get<string>('JWT_REFRESH_EXPIRATION');
    return sign(
      { email: userEntity.email },
      secret,
      { expiresIn },
    );
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userModel.findOne({ email });
  }

  async refreshToken(token: string): Promise<UserEntity> {
    try {
      const decoded = verify(token, this.configService.get<string>('JWT_REFRESH_SECRET')) as { email: string };
      const user = await this.findByEmail(decoded.email);
      if (!user) {
        throw new UserNotFoundException(decoded.email);
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}