import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { RequestEntity } from './entities/request.entity';
import { Tipo } from '../catalogs/tipo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequestEntity, Tipo])],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
