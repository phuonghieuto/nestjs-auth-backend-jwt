"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
class UnauthorizedException extends common_1.HttpException {
    constructor() {
        super({
            title: 'Unauthorized',
            status: common_1.HttpStatus.UNAUTHORIZED,
            detail: 'Unauthorized access',
            errors: [{ message: 'Unauthorized' }],
        }, common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.default = UnauthorizedException;
//# sourceMappingURL=unauthorized.exception.js.map