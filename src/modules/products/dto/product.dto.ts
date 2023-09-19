import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {
	IsIn,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';

export class ProductDto {
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

	@IsOptional()
	@IsString()
	@IsIn(['price', 'title'])
	@ApiPropertyOptional()
	readonly filterBy: string;

	@IsOptional()
	@IsString()
	@IsIn(['ASC', 'DESC'])
	@ApiPropertyOptional()
	readonly filterOrder: string;
}

export class ProductCreateDto {
	readonly id: number;

	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	readonly title: string;

	@IsNumber()
	@IsNotEmpty()
	@ApiProperty()
	readonly status: number;

	@IsOptional()
	@IsString()
	@ApiProperty()
	readonly description: string;

	@IsNumber()
	@ApiProperty()
	readonly quantity: number;

	@IsNumber()
	@ApiProperty()
	readonly price: number;
}

export class ProductUpdateDto {
	readonly id: number;

	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	readonly title: string;

	@IsNumber()
	@IsNotEmpty()
	@ApiProperty()
	readonly status: number;

	@IsOptional()
	@IsString()
	@ApiProperty()
	readonly description: string;

	@IsNumber()
	@ApiProperty()
	readonly quantity: number;

	@IsNumber()
	@ApiProperty()
	readonly price: number;
}
