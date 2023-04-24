import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';

import { AuthModule, DatabaseModule, RmqModule } from '@app/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderRepository } from './orders.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { BILLING_SERVICE } from './constants/service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/orders/.env',
    }), 
    DatabaseModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    RmqModule.register({ name: BILLING_SERVICE }),
    AuthModule

  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository],
})
export class OrdersModule { }
