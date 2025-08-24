import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { Tipo } from '../catalogs/tipo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Tipo])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
