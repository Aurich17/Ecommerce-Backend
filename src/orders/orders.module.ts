import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderListView } from './entities/order.view.entity';
import { Tipo } from '../catalogs/tipo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, OrderListView, Tipo])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
