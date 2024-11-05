import { UserEntity } from '../schemas/user.schema';
export type UserResponseType = Omit<UserEntity, 'password'> & {
    token: string;
};
