import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provincia } from './provincia.entity';
import { PaisesModule } from '../paises/paises.module';
import { ProvinciasService } from './provincias.service';
import { ProvinciasController } from './provincias.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Provincia]),
    PaisesModule, // para validar/exponer datos de país si lo necesitas
  ],
  providers: [ProvinciasService],
  controllers: [ProvinciasController],
  exports: [ProvinciasService],
})
export class ProvinciasModule {}
