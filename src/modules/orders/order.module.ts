import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { Order } from "./entities/order.entity";
import { ProductModule } from "../products/product.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([Order]),
		ProductModule
	],
	controllers: [OrderController],
	providers: [OrderService],
})
export class OrderModule {}
