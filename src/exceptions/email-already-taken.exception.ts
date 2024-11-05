import { HttpException, HttpStatus } from '@nestjs/common';

export default class EmailAlreadyTakenException extends HttpException {
  constructor(email: string) {
    super({
      title: 'Conflict',
      status: HttpStatus.CONFLICT,
      detail: `Email ${email} is already taken.`,
      errors: [{
        message: `Email ${email} is already taken`
      }]
    }, HttpStatus.CONFLICT);
  }
}