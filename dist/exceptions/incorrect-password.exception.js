"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
class IncorrectPasswordException extends common_1.HttpException {
    constructor() {
        super({
            title: 'Unauthorized',
            status: common_1.HttpStatus.UNAUTHORIZED,
            detail: 'The password provided is incorrect.',
            errors: [{
                    message: 'Incorrect password'
                }]
        }, common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.default = IncorrectPasswordException;
//# sourceMappingURL=incorrect-password.exception.js.map