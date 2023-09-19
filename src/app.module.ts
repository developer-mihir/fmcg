import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductModule } from "./modules/products/product.module";
import { AuthModule } from "./modules/auth/auth.module";
import { LoginStrategy } from "./authorization/login.strategy";
import { OrderModule } from "./modules/orders/order.module";
import { JwtStrategy } from "./authorization/jwt.strategy";
import { CustomerModule } from "./modules/customers/customer.module";
const ormConfig = require('../ormconfig');

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot(ormConfig),
        ProductModule,
        AuthModule,
        OrderModule,
        CustomerModule
    ],
    controllers: [AppController],
    providers: [AppService,LoginStrategy,JwtStrategy],
})
export class AppModule {}
