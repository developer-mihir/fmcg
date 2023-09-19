import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class LoginStrategy extends PassportStrategy(Strategy, 'login') {
    constructor(private authService: AuthService) {
        super({ usernameField: 'email' });
    }

    async validate(email: string, password: string): Promise<any> {
        // Validate user credentials for login
        const user = await this.authService.validateUser(email, password);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
