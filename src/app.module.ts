/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClienteModule } from './clientes/cliente.module';
import { PaisesModule } from './paises/paises.module';
import { ProvinciasModule } from './provincias/provincias.module';
import { CiudadesModule } from './ciudades/ciudades.module';

@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal: true }),   // carga .env globalmente
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          type: 'postgres',
          host: config.get('DB_HOST'),
          port: config.get<number>('DB_PORT'),
          username: config.get('DB_USERNAME'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false, // controla si TypeORM sincroniza el esquema automáticamente
        }),
      }),
      ClienteModule,
      PaisesModule,
      ProvinciasModule,
      CiudadesModule
      // PaisesModule,
      // ProvinciasModule,
      // CiudadesModule,
      // OcupacionesModule,
      // GenerosModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
