import {
	HttpException, HttpStatus,
	Injectable, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository, Connection, Brackets} from 'typeorm';
import { Product } from "./entities/product.entity";
import { ProductCreateDto, ProductUpdateDto } from "./dto/product.dto";
import Constants from "../../helpers/constants";
import {User} from "../customers/entities/user.entity";

@Injectable()
export class ProductService {
	constructor(
		private connection: Connection,
		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,
	) {}

	async findAll(query : any = {}) {
		const limit = query?.limit ?? 10;
		const page = query?.page ?? 1;
		const search = query?.search ?? '';
		const filterBy = query?.filterBy ?? 'id';
		const filterOrder = query?.filterOrder ?? 'DESC';

		let productsObj = await this.productRepository.createQueryBuilder('product')
			.where('product.status = :status', {status : 1});

		if (search) {
			productsObj = productsObj.andWhere(
				new Brackets((qb) => {
					qb.where('product.title LIKE :search', { search: '%' + search + '%' });
				})
			);
		}

		return productsObj.skip((page - 1) * limit)
			.take(limit)
			.orderBy(`product.${filterBy}`, filterOrder)
			.getManyAndCount();
	}

	async findOne(id : number, user? : User) {
		let productObj =  await this.productRepository.createQueryBuilder('product')
			.where('product.id = :productId', { productId : id });

		if (user.role_id == Constants.roles.customers) {
			productObj = productObj.andWhere('product.status = :status', { status: 1 });
		}

		return productObj.getOne();
	}

	async create(product : ProductCreateDto) {
		const queryRunner = this.connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			return await this.productRepository.save(product);
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		} finally {
			await queryRunner.release();
		}
	}

	async update(id : number, product : ProductUpdateDto) {
		const queryRunner = this.connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			let productObj = await this.productRepository.findOne({
				where : {
					id : id,
				}
			});

			if (!productObj) {
				throw new NotFoundException(Constants.Messages.product.notFound);
			}

			productObj = Object.assign(productObj, product);

			return await this.productRepository.save(productObj);
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		} finally {
			await queryRunner.release();
		}
	}

	async delete(id : number) {
		try {
			const productObj = await this.productRepository.findOne({
				where : {
					id : id,
				}
			});

			if (productObj) {
				return await this.productRepository.softDelete(id);
			}

			throw new NotFoundException(Constants.Messages.product.notFound);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}
}
