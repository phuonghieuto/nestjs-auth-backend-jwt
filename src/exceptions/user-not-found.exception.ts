import { HttpException, HttpStatus } from '@nestjs/common';

export default class UserNotFoundException extends HttpException {
  constructor(email: string) {
    super({
      title: 'Not Found',
      status: HttpStatus.NOT_FOUND,
      detail: `User with email ${email} was not found.`,
      errors: [{
        message: `User with email ${email} was not found`
      }]
    }, HttpStatus.NOT_FOUND);
  }
}