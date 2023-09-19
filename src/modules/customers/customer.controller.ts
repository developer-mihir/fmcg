import {
	Body,
	Controller, Delete,
	Get, HttpStatus, Param, Post, Put, Query,
	Request, UseGuards,
} from '@nestjs/common';
import { Res } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomerCreateDto, CustomerDto, CustomerUpdateDto } from './dto/customer.dto';
import { commonResponse } from "../../helpers/helper";
import Constants from "../../helpers/constants";
import { JwtAuthGuard } from "../../authorization/jwt-auth.guard";
import { Authorization } from "../../authorization/authorization.guard";
import { CustomerService } from "./customer.service";

@ApiTags('Customers')
@UseGuards(new JwtAuthGuard('jwt'))
@Controller('customers')
export class CustomerController {
	constructor(
		private readonly customerService: CustomerService,
	) {}

	// Get all customers
	@Get('/')
	@UseGuards(new Authorization(Constants.roles.admin))
	@ApiBearerAuth('bearerAuth')
	async findAll(
		@Request() req,
		@Res() res,
		@Query() customerDto : CustomerDto,
	) {
		try {
			const customers = await this.customerService.findAll(customerDto);

			return commonResponse(res, HttpStatus.OK, Constants.Messages.customer.findAll, 200, customers);
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

	// Get customer by id
	@Get(':id')
	@UseGuards(new Authorization(Constants.roles.admin))
	@ApiBearerAuth('bearerAuth')
	async findOne(@Request() req, @Res() res, @Param('id') id: number) {
		try {
			const customer = await this.customerService.findOne(id);

			if (!customer) {
				return commonResponse(res, HttpStatus.BAD_REQUEST, Constants.Messages.customer.notFound, HttpStatus.BAD_REQUEST, null);
			}

			return commonResponse(res, HttpStatus.OK, Constants.Messages.customer.findOne, 200, customer);
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

	// Create customer
	@Post('/')
	@UseGuards(new Authorization(Constants.roles.admin))
	@ApiBearerAuth('bearerAuth')
	async create(@Request() req, @Res() res, @Body() customerDto : CustomerCreateDto) {
		try {
			const customerObj = await this.customerService.findByEmail(customerDto.email);

			if (customerObj) {
				return commonResponse(res, HttpStatus.BAD_REQUEST, Constants.Messages.customer.emailAlreadyExist, HttpStatus.BAD_REQUEST, null);
			}

			const customer = await this.customerService.create(customerDto);

			return commonResponse(res, HttpStatus.OK, Constants.Messages.customer.create, 200, customer);
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

	// Update customer
	@Put(':id')
	@UseGuards(new Authorization(Constants.roles.admin))
	@ApiBearerAuth('bearerAuth')
	async update(
		@Request() req,
		@Res() res,
		@Param('id') id: number,
		@Body() customerUpdateDto : CustomerUpdateDto
	) {
		try {
			const customer = await this.customerService.update(id, customerUpdateDto);

			return commonResponse(res, HttpStatus.OK, Constants.Messages.customer.update, 200, customer);
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

	// Delete customer
	@Delete(':id')
	@UseGuards(new Authorization(Constants.roles.admin))
	@ApiBearerAuth('bearerAuth')
	async delete(@Request() req, @Res() res, @Param('id') id: number) {
		try {
			await this.customerService.delete(id);

			return commonResponse(res, HttpStatus.OK, Constants.Messages.customer.delete, 200, null);
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
