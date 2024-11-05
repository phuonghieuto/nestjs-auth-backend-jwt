"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
class BadRequestError extends common_1.HttpException {
    constructor(messages) {
        if (typeof messages === 'string') {
            messages = [messages];
        }
        super({
            title: 'Bad Request',
            status: common_1.HttpStatus.BAD_REQUEST,
            detail: 'Request could not be processed due to semantic errors. Please check your input and try again.',
            errors: messages.map((message) => ({ message }))
        }, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.default = BadRequestError;
//# sourceMappingURL=bad-request.exception.js.map