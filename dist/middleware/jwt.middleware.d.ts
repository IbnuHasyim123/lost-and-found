import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
export declare class AuthGuard implements CanActivate {
    private jwtService;
    constructor(jwtService: JwtService);
    private extractTokenFromHeader;
    canActivate(context: ExecutionContext): Promise<boolean>;
}
