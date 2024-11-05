import { HttpException } from '@nestjs/common';
export default class UserNotFoundException extends HttpException {
    constructor(email: string);
}
