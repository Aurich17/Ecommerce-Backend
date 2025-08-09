// src/ocupaciones/ocupaciones.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ocupaciones } from './ocupaciones.entity';
import { OcupacionesService } from './ocupaciones.services';
import { OcupacionesController } from './ocupaciones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ocupaciones])],
  providers: [OcupacionesService],
  controllers: [OcupacionesController],
})
export class OcupacionesModule {}
