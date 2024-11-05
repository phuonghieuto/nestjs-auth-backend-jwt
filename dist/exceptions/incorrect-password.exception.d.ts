import { HttpException } from '@nestjs/common';
export default class IncorrectPasswordException extends HttpException {
    constructor();
}
