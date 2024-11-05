import { HttpException } from '@nestjs/common';
export default class EmailAlreadyTakenException extends HttpException {
    constructor(email: string);
}
