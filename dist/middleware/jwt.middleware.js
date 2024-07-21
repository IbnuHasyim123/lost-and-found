"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
class AuthGuard {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    extractTokenFromHeader(req) {
        const [token, type] = req.headers.authorization?.split('') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token)
            throw new common_1.UnauthorizedException('Invalid Token');
        try {
            await this.jwtService.verifyAsync(token, {
                secret: process.env.ACCESS_TOKEN_SECRET,
            });
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            if (error.name === 'TokenExpiredError') {
                throw new common_1.UnauthorizedException('Token Expire');
            }
            else {
                throw new common_1.UnauthorizedException(error.message);
            }
        }
        return true;
    }
}
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=jwt.middleware.js.map