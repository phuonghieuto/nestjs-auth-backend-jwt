import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './schemas/user.schema';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { UserResponseDto } from './dto/user-response.dto';
export declare class UserService {
    private userModel;
    private configService;
    private readonly logger;
    constructor(userModel: Model<UserEntity>, configService: ConfigService);
    createUser(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    loginUser(loginDto: LoginDto): Promise<UserResponseDto>;
    logoutUser(email: string): Promise<void>;
    buildUserResponse(userEntity: UserEntity): UserResponseDto;
    generateJwt(userEntity: UserEntity, type: 'access' | 'refresh'): string;
    findByEmail(email: string): Promise<UserEntity>;
    refreshToken(token: string): Promise<UserEntity>;
}
