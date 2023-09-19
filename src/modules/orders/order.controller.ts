import {
	Body,
	Controller, Delete,
	Get, HttpStatus, Param, Post, Put, Query,
	Request, UseGuards,
} from '@nestjs/common';
import { Res } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { OrderCreateDto, OrderDto } from './dto/order.dto';
import { commonResponse } from "../../helpers/helper";
import Constants from "../../helpers/constants";
import { JwtAuthGuard } from "../../authorization/jwt-auth.guard";

@ApiTags('Orders')
@UseGuards(new JwtAuthGuard('jwt'))
@Controller('orders')
export class OrderController {
	constructor(
		private readonly orderService: OrderService,
	) {}

	// Get all orders with admin and customer role
	@Get('/')
	@ApiBearerAuth('bearerAuth')
	async findAll(
		@Request() req,
		@Res() res,
		@Query() orderDto : OrderDto,
	) {
		try {
			const orders = await this.orderService.findAll(orderDto, req.user);

			return commonResponse(res, HttpStatus.OK, Constants.Messages.order.findAll, 200, orders);
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

	 // Get order detail by id with admin and customer role
	@Get(':id')
	@ApiBearerAuth('bearerAuth')
	async findOne(@Request() req, @Res() res, @Param('id') id: number) {
		try {
			const order = await this.orderService.findOne(id, req.user);

			if (!order) {
				return commonResponse(res, HttpStatus.BAD_REQUEST, Constants.Messages.order.notFound, HttpStatus.BAD_REQUEST, null);
			}

			return commonResponse(res, HttpStatus.OK, Constants.Messages.order.findOne, 200, order);
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

	 // Create order
	@Post('/')
	@ApiBearerAuth('bearerAuth')
	async create(@Request() req, @Res() res, @Body() productDto : OrderCreateDto) {
		try {
			const order = await this.orderService.create(productDto, req.user);

			return commonResponse(res, HttpStatus.OK, Constants.Messages.order.create, 200, order);
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
