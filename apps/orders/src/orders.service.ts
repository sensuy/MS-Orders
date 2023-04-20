import { Inject, Injectable } from '@nestjs/common';
import { OrderRepository } from './orders.repository';
import { CreateOrderRequest } from './dto/create-order.request';
import { BILLING_SERVICE } from './constants/service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrderRepository,
    @Inject(BILLING_SERVICE) private readonly billingClient: ClientProxy
  ) { }
  async createOrder(request: CreateOrderRequest) {
    const session = await this.ordersRepository.startTransaction();
    try {
      const order = await this.ordersRepository.create(request, { session });
      await lastValueFrom(this.billingClient.send('order_created', { request }), { defaultValue: null });
      await session.commitTransaction();
      return order;
    }
    catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }

  getOrders() {
    return this.ordersRepository.find({});
  }
}
