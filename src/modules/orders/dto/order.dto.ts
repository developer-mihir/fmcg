import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import {User} from "../../customers/entities/user.entity";
import {Product} from "../../products/entities/product.entity";

export class OrderDto {
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

export class OrderCreateDto {
	@IsNotEmpty()
	@ApiProperty({ type: Product })
	product: Product;

	@IsNotEmpty()
	@IsNumber()
	@ApiProperty()
	readonly quantity: number;
}