import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ciudad } from './ciudad.entity';
import { ProvinciasModule } from '../provincias/provincias.module';
import { CiudadesService } from './ciudades.service';
import { CiudadesController } from './ciudades.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ciudad]),
    ProvinciasModule, // para verificar/exponer datos de provincia si lo necesitas
  ],
  providers: [CiudadesService],
  controllers: [CiudadesController],
  exports: [CiudadesService],
})
export class CiudadesModule {}
