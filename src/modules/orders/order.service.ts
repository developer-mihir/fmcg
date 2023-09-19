import {
	HttpException, HttpStatus,
	Injectable, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { OrderCreateDto } from "./dto/order.dto";
import Constants from "../../helpers/constants";
import { Order } from "./entities/order.entity";
import { ProductService } from "../products/product.service";
import { User } from "../customers/entities/user.entity";

@Injectable()
export class OrderService {
	constructor(
		private connection: Connection,
		@InjectRepository(Order)
		private readonly orderRepository: Repository<Order>,
		private readonly productService : ProductService,
	) {}

	async findAll(query : any = {}, user : User) {
		const limit = query?.limit ?? 10;
		const page = query?.page ?? 1;
		const search = query?.search ?? '';

		let ordersObj = await this.orderRepository.createQueryBuilder('order')
			.leftJoin('order.product', 'product')
			.where('1 = 1');

		// Search order by product title
		if (search) {
			ordersObj = ordersObj.andWhere('product.title LIKE :search', { search: '%' + search + '%' });
		}

		if (user.role_id == Constants.roles.customers) {
			ordersObj = ordersObj.andWhere('order.customer_id = :userId', { userId: user.id });
		}

		return ordersObj.skip((page - 1) * limit)
			.take(limit)
			.orderBy('order.id','DESC')
			.getManyAndCount();
	}

	async findOne(id : number, user : User) {
		let orderObj = await this.orderRepository.createQueryBuilder('order')
			.where('order.id = :orderId', {orderId : id});

		if (user.role_id == Constants.roles.customers) {
			orderObj = orderObj.andWhere('order.customer_id = :userId', { userId: user.id });
		}

		return orderObj.getOne();
	}

	async create(order : OrderCreateDto, user) {
		const queryRunner = this.connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const product = await this.productService.findOne(order?.product?.id ?? 0);

			// Check for product
			if (!product) {
				throw new NotFoundException(Constants.Messages.product.notFound);
			}

			// Check for quantity
			if (product.quantity < order.quantity) {
				throw new NotFoundException(Constants.Messages.order.errorQuantity);
			}

			// Remove ordered quantity from product
			product.quantity = (product.quantity - order.quantity);
			await this.productService.update(product.id, product);

			// Create order for logged-in customer
			let orderObj = new Order();
			orderObj = Object.assign(orderObj, order);
			orderObj.customer = user;
			orderObj.price = product.price;
			orderObj.status = Constants.orderStatuses.ordered;

			return await this.orderRepository.save(orderObj);
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		} finally {
			await queryRunner.release();
		}
	}
}
