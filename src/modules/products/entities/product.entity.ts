import {
	BaseEntity,
	Column,
	CreateDateColumn, DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column()
	description: string;

	@Column('tinyint', {
		default: 0,
	})
	status: number;

	@Column('double', {
		default: 0,
	})
	price: number;

	@Column('int', {
		default: 0,
	})
	quantity: number;

	@CreateDateColumn({ type: 'timestamp' })
	created_at: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updated_at: Date;

	@DeleteDateColumn()
	deleted_at: Date;
}
