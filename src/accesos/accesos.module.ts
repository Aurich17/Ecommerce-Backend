// src/accesos/accesos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccesosController } from './accesos.controller';
import { AccesosService } from './accesos.service';
import { Acceso } from './entities/acceso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Acceso])],
  controllers: [AccesosController],
  providers: [AccesosService],
})
export class AccesosModule {}
