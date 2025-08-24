// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Deshabilitamos el body parser por defecto
  });
  // Configurar límite de tamaño del body parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://ecommerce-frontend-5vjm98vwq-devaurichs-projects.vercel.app',
      'https://ecommerce-frontend-kohl-gamma.vercel.app',
      // agrega tu dominio si lo usas, p. ej. 'https://api.midominio.com'
    ], // o `true` para permitir todos
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // 1) Construye la configuración de tu API
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth() // esquema por defecto "bearer"
    .build();

  // 2) Crea el documento y expón la UI
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 Server running on http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `📚 Swagger UI available at http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}
bootstrap();
