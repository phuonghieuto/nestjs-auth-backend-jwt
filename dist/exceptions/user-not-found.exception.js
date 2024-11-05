"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
class UserNotFoundException extends common_1.HttpException {
    constructor(email) {
        super({
            title: 'Not Found',
            status: common_1.HttpStatus.NOT_FOUND,
            detail: `User with email ${email} was not found.`,
            errors: [{
                    message: `User with email ${email} was not found`
                }]
        }, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.default = UserNotFoundException;
//# sourceMappingURL=user-not-found.exception.js.map