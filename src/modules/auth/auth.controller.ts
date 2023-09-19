import {
	Body,
	Controller,
	Post,
	Request, UseGuards, HttpStatus
} from '@nestjs/common';
import { Res } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { LoginAuthGuard } from '../../authorization/login-auth.guard';
import Constants from '../../helpers/constants';
import { commonResponse } from "../../helpers/helper";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
	) {}

	// User Login
	@UseGuards(LoginAuthGuard)
	@Post('login')
	public async login(@Request() req, @Res() res, @Body() authDto : LoginDto) : Promise<any> {
		try {
			return commonResponse(res, HttpStatus.OK, Constants.Messages.auth.loginSuccess, 200, req.user);
		} catch (err) {
			return commonResponse(
				res,
				err?.status && err?.status != 500 ? err?.status : HttpStatus.INTERNAL_SERVER_ERROR,
				err.message,
				Constants.code.error,
				null,
			);
		}
	}

	// User Register
	@Post('register')
	async register(@Request() req, @Res() res, @Body() registerDto : RegisterDto) {
		try {
			const user = await this.authService.findByEmail(registerDto.email);

			if (user) {
				return commonResponse(res, HttpStatus.BAD_REQUEST, Constants.Messages.auth.registerError, HttpStatus.BAD_REQUEST, null);
			}

			await this.authService.register(registerDto);

			return commonResponse(res, HttpStatus.OK, Constants.Messages.auth.registerSuccess, 200, req.user);
		} catch (err) {
			return commonResponse(
				res,
				err?.status && err?.status != 500 ? err?.status : HttpStatus.INTERNAL_SERVER_ERROR,
				err.message,
				Constants.code.error,
				null,
			);
		}
	}
}
