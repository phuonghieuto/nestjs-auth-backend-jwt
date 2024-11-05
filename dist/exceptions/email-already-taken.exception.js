"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
class EmailAlreadyTakenException extends common_1.HttpException {
    constructor(email) {
        super({
            title: 'Conflict',
            status: common_1.HttpStatus.CONFLICT,
            detail: `Email ${email} is already taken.`,
            errors: [{
                    message: `Email ${email} is already taken`
                }]
        }, common_1.HttpStatus.CONFLICT);
    }
}
exports.default = EmailAlreadyTakenException;
//# sourceMappingURL=email-already-taken.exception.js.map