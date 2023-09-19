import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {
	IsEmail,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional, IsPhoneNumber,
	IsString, Validate,
} from 'class-validator';

export class CustomerDto {
	@IsOptional()
	@ApiPropertyOptional()
	@IsNumber()
	readonly limit: number;

	@IsNumber()
	@IsOptional()
	@ApiPropertyOptional()
	readonly page: number;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional()
	readonly search: string;
}

export class CustomerCreateDto {
	readonly id: number;

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

export class CustomerUpdateDto {
	readonly id: number;

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
	readonly phone_number : string;

	@IsEmail()
	@IsNotEmpty()
	@ApiProperty()
	readonly email: string;

	@IsNotEmpty()
	@ApiProperty()
	password: string;
}
