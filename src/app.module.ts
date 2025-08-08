/* eslint-disable prettier/prettier */
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClienteModule } from './clientes/cliente.module';
import { PaisesModule } from './paises/paises.module';
import { ProvinciasModule } from './provincias/provincias.module';
import { CiudadesModule } from './ciudades/ciudades.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal: true }),   // carga .env globalmente
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
            type: 'postgres',
            host: config.get<string>('DB_HOST'),
            port: config.get<number>('DB_PORT'),
            username: config.get<string>('DB_USERNAME'),
            password: config.get<string>('DB_PASSWORD'),
            database: config.get<string>('DB_DATABASE'),
            // ===> fuerza SSL/TLS
            ssl: {
              rejectUnauthorized: false,  // acepta el cert de Let's Encrypt de Render
            },
            // a veces necesario pasarlo también aquí:
            extra: {
              ssl: {
                rejectUnauthorized: false,
              },
            },
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false,
          }),
      }),
      ClienteModule,
      PaisesModule,
      ProvinciasModule,
      CiudadesModule
      // ProvinciasModule,
      // CiudadesModule,
      // OcupacionesModule,
      // GenerosModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
