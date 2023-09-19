import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class Authorization implements CanActivate {
    public permission: number;

    constructor(permission?: number) {
        this.permission = permission;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        try {
            if (request.user) {
                // Check user role if user is authorized or not
                if (this.permission) {
                    if (request?.user?.role_id == this.permission) {
                        return request.isAuthenticated();
                    }
                } else {
                    return request.isAuthenticated();
                }
            }

            return request.isUnauthenticated();
        } catch (error) {
            throw new UnauthorizedException(error);
        }
    }
}
