import { Inject, Injectable } from '@nestjs/common';
import { OrderRepository } from './orders.repository';
import { CreateOrderRequest } from './dto/create-order.request';
import { BILLING_SERVICE } from './constants/service';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrderRepository,
    @Inject(BILLING_SERVICE) private readonly billingService: ClientProxy
  ) { }

  createOrder(request: CreateOrderRequest) {
    return this.ordersRepository.create(request);
  }

  getOrders() {
    return this.ordersRepository.find({});
  }
}
