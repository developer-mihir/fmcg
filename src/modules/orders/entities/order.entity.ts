import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity, JoinColumn, ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import {User} from "../../customers/entities/user.entity";
import {Product} from "../../products/entities/product.entity";

@Entity('orders')
export class Order extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('varchar', {
		nullable: true,
	})
	status: string;

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

	@ManyToOne(() => User, { nullable: true })
	@JoinColumn({ name: 'customer_id' })
	customer: User;

	@ManyToOne(() => Product, { nullable: true })
	@JoinColumn({ name: 'product_id' })
	product: Product;
}
