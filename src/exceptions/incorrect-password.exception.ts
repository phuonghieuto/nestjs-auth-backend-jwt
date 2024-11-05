import { HttpException, HttpStatus } from '@nestjs/common';

export default class IncorrectPasswordException extends HttpException {
  constructor() {
    super({
      title: 'Unauthorized',
      status: HttpStatus.UNAUTHORIZED,
      detail: 'The password provided is incorrect.',
      errors: [{
        message: 'Incorrect password'
      }]
    }, HttpStatus.UNAUTHORIZED);
  }
}