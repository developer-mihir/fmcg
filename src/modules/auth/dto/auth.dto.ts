import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsNotEmpty,
	IsNumber, IsPhoneNumber,
	IsString,
} from 'class-validator';

export class LoginDto {
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	@ApiProperty()
	readonly email: string;

	@IsNotEmpty()
	@ApiProperty()
	readonly password: string;
}

export class RegisterDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	readonly first_name: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	readonly last_name: string;

	@IsPhoneNumber('IN')
	@IsNotEmpty()
	@ApiProperty()
	readonly phone_number : string

	@IsEmail()
	@IsNotEmpty()
	@ApiProperty()
	readonly email: string;

	@IsNotEmpty()
	@ApiProperty()
	password: string;
}