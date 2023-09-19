import {
	HttpException, HttpStatus,
	Injectable, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository, Connection, Brackets} from 'typeorm';
import Constants from "../../helpers/constants";
import { User } from "./entities/user.entity";
import { CustomerCreateDto, CustomerUpdateDto } from "./dto/customer.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomerService {
	constructor(
		private connection: Connection,
		@InjectRepository(User)
		private readonly customerRepository: Repository<User>,
	) {}

	async findAll(query : any = {}) {
		const limit = query?.limit ?? 10;
		const page = query?.page ?? 1;
		const search = query?.search ?? '';

		let customersObj = await this.customerRepository.createQueryBuilder('customer')
			.where('customer.role_id != :roleId', {roleId : Constants.roles.admin});

		if (search) {
			customersObj = customersObj.andWhere(
				new Brackets((qb) => {
					qb.where('customer.first_name LIKE :search', { search: '%' + search + '%' })
						.orWhere('customer.last_name LIKE :search', { search: '%' + search + '%' })
						.orWhere('customer.email LIKE :search', { search: '%' + search + '%' })
						.orWhere('customer.phone_number LIKE :search', { search: '%' + search + '%' });
				}),
			);
		}

		return customersObj.skip((page - 1) * limit)
			.take(limit)
			.orderBy('customer.id','DESC')
			.getManyAndCount();
	}

	async findOne(id : number) {
		return await this.customerRepository.createQueryBuilder('customer')
			.where('customer.id = :customerId', {customerId : id})
			.andWhere('customer.role_id != :roleId', {roleId : Constants.roles.admin})
			.getOne();
	}

	async findByEmail(email : string) {
		return await this.customerRepository.findOne({
			where : {
				email : email
			}
		});
	}

	async create(customer : CustomerCreateDto) {
		const queryRunner = this.connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			if (customer.password) {
				customer.password = bcrypt.hashSync(customer.password, 8);
			}

			return await this.customerRepository.save({...customer, role_id : Constants.roles.customers});
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		} finally {
			await queryRunner.release();
		}
	}

	async update(id : number, customer : CustomerUpdateDto) {
		const queryRunner = this.connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			let customerObj = await this.customerRepository.findOne({
				where : {
					id : id,
				}
			});

			if (!customerObj) {
				throw new NotFoundException(Constants.Messages.customer.notFound);
			}

			// Check duplicate email entry
			const customerEmail = await this.findByEmail(customer.email);
			if (customerObj && customerEmail && customerObj.id != customerEmail?.id) {
				throw new NotFoundException(Constants.Messages.customer.emailAlreadyExist);
			}

			if (customer.password) {
				customer.password = bcrypt.hashSync(customer.password, 8);
			}

			customerObj = Object.assign(customerObj, customer);

			return await this.customerRepository.save(customerObj);
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		} finally {
			await queryRunner.release();
		}
	}

	async delete(id : number) {
		try {
			const customerObj = await this.customerRepository.findOne({
				where : {
					id : id,
				}
			});

			if (customerObj) {
				return await this.customerRepository.softDelete(id);
			}

			throw new NotFoundException(Constants.Messages.customer.notFound);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}
}
