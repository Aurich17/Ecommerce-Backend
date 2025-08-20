// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClienteModule } from './clientes/cliente.module';
import { PaisesModule } from './paises/paises.module';
import { ProvinciasModule } from './provincias/provincias.module';
import { CiudadesModule } from './ciudades/ciudades.module';
import { GenerosModule } from './generos/genero.module';
import { OcupacionesModule } from './ocupaciones/ocupaciones.module';
import { AuthModule } from './auth/auth.module';
import { LandingEncabezadoModule } from './landing/encabezado/landing-encabezado.module';
import { ImagekitModule } from './imagekit/imagekit.module';
import { TiposModule } from './catalogs/tipos.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { CompaniesModule } from './companies/companies.module';
import { LandingModule } from './landing/landing.module';
import { RequestsModule } from './requests/requests.module';
import { ProductsModule } from './products/products.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // carga .env
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // parsea manualmente la var de entorno (siempre viene como string)
        const sslEnv = config.get<string>('DB_SSL', 'false');
        const sslEnabled = sslEnv.toLowerCase() === 'true';

        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST'),
          port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false,
          // si sslEnabled es true -> fuerza TLS, si no -> desactívalo
          ssl: sslEnabled ? { rejectUnauthorized: false } : false,
          extra: {
            ssl: sslEnabled ? { rejectUnauthorized: false } : false,
          },
        };
      },
    }),
    ClienteModule,
    PaisesModule,
    ProvinciasModule,
    CiudadesModule,
    GenerosModule,
    OcupacionesModule,
    AuthModule,
    LandingEncabezadoModule,
    ImagekitModule,
    TiposModule,
    UsersModule,
    ClientsModule,
    CompaniesModule,
    LandingModule,
    RequestsModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
