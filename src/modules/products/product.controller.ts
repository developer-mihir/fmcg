import {
	Body,
	Controller, Delete,
	Get, HttpStatus, Param, Post, Put, Query,
	Request, UseGuards,
} from '@nestjs/common';
import { Res } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { ProductCreateDto, ProductDto, ProductUpdateDto } from './dto/product.dto';
import { commonResponse } from "../../helpers/helper";
import Constants from "../../helpers/constants";
import { JwtAuthGuard } from "../../authorization/jwt-auth.guard";
import { Authorization } from "../../authorization/authorization.guard";

@ApiTags('Products')
@UseGuards(new JwtAuthGuard('jwt'))
@Controller('products')
export class ProductController {
	constructor(
		private readonly productService: ProductService,
	) {}

	// Get all products
	@Get('/')
	@ApiBearerAuth('bearerAuth')
	async findAll(
		@Request() req,
		@Res() res,
		@Query() productDto : ProductDto,
	) {
		try {
			const products = await this.productService.findAll(productDto);

			return commonResponse(res, HttpStatus.OK, Constants.Messages.product.findAll, 200, products);
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

	// Get product by id with admin and customer role
	@Get(':id')
	@ApiBearerAuth('bearerAuth')
	async findOne(@Request() req, @Res() res, @Param('id') id: number) {
		try {
			const product = await this.productService.findOne(id, req.user);

			if (!product) {
				return commonResponse(res, HttpStatus.BAD_REQUEST, Constants.Messages.product.notFound, HttpStatus.BAD_REQUEST, null);
			}

			return commonResponse(res, HttpStatus.OK, Constants.Messages.product.findOne, 200, product);
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

	// Create product with admin role
	@Post('/')
	@UseGuards(new Authorization(Constants.roles.admin))
	@UseGuards(new Authorization())
	@ApiBearerAuth('bearerAuth')
	async create(@Request() req, @Res() res, @Body() productDto : ProductCreateDto) {
		try {
			const product = await this.productService.create(productDto);

			return commonResponse(res, HttpStatus.OK, Constants.Messages.product.create, 200, product);
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

	// Update product with admin role
	@Put(':id')
	@UseGuards(new Authorization(Constants.roles.admin))
	@ApiBearerAuth('bearerAuth')
	async update(
		@Request() req,
		@Res() res,
		@Param('id') id: number,
		@Body() productUpdateDto : ProductUpdateDto
	) {
		try {
			const product = await this.productService.update(id, productUpdateDto);

			return commonResponse(res, HttpStatus.OK, Constants.Messages.product.update, 200, product);
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

	// Delete product with admin role
	@Delete(':id')
	@UseGuards(new Authorization(Constants.roles.admin))
	@ApiBearerAuth('bearerAuth')
	async delete(@Request() req, @Res() res, @Param('id') id: number) {
		try {
			await this.productService.delete(id);

			return commonResponse(res, HttpStatus.OK, Constants.Messages.product.delete, 200, null);
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
