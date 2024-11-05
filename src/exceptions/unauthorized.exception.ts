import { HttpException, HttpStatus } from '@nestjs/common';

export default class UnauthorizedException extends HttpException {
  constructor() {
    super({
      title: 'Unauthorized',
      status: HttpStatus.UNAUTHORIZED,
      detail: 'Unauthorized access',
      errors: [{ message: 'Unauthorized' }],
    }, HttpStatus.UNAUTHORIZED);
  }
}