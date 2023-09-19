import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from "./auth.service";
import { User } from "../customers/entities/user.entity";
import { AuthController } from "./auth.controller";
import { LoginStrategy } from "../../authorization/login.strategy";
import { PassportModule } from '@nestjs/passport';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		PassportModule.register({
			session: true,
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, LoginStrategy],
	exports: [AuthService],
})
export class AuthModule {}
