// src/generos/generos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genero } from './genero.entity';
import { GenerosService } from './genero.services';
import { GenerosController } from './genero.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Genero])],
  providers: [GenerosService],
  controllers: [GenerosController],
})
export class GenerosModule {}
