import {
	HttpException, HttpStatus,
	Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, getManager } from 'typeorm';
import { User } from "../customers/entities/user.entity";
import * as bcrypt from 'bcrypt';
import { RegisterDto } from "./dto/auth.dto";
const jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
	constructor(
		private connection: Connection,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async findById(id: number): Promise<any> {
		return await this.userRepository.findOne({
			where : {
				id : id
			}
		});
	}

	async findByEmail(email: string): Promise<any> {
		return  await this.userRepository.findOne({
			where : {
				email : email
			}
		});
	}

	async validateUser(email: string, password: string): Promise<any> {
		const user = await this.connection.query("select id, first_name, last_name, email, phone_number, password from users where email = '" + email + "' and status = 1");

		if (user?.length > 0) {
			const validPassword = await bcrypt.compare(password, user[0]?.password);

			if (validPassword) {
				const payload = { user_id: user[0].id };

				delete user[0].password;
				user[0].access_token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

				return user[0];
			}
		}

		return null;
	}

	async register(registerDto : RegisterDto): Promise<any> {
		const queryRunner = this.connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			registerDto.password = bcrypt.hashSync(registerDto.password, 8);
			await this.userRepository.save({...registerDto, status : 0});
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		} finally {
			await queryRunner.release();
		}
	}
}
