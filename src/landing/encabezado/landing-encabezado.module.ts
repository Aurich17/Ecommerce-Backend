import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandingEncabezado } from './landing-encabezado.entity';
import { LandingEncabezadoService } from './landing-encabezado.service';
import { LandingEncabezadoController } from './landing-encabezado.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LandingEncabezado])],
  controllers: [LandingEncabezadoController],
  providers: [LandingEncabezadoService],
  exports: [LandingEncabezadoService],
})
export class LandingEncabezadoModule {}
