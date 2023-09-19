import { Injectable, ExecutionContext} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LoginAuthGuard extends AuthGuard('login') {}