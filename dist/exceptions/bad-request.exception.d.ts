import { HttpException } from '@nestjs/common';
export default class BadRequestError extends HttpException {
    constructor(messages: string | string[]);
}
