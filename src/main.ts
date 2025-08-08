// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1) Construye la configuración de tu API
  const config = new DocumentBuilder()
    .setTitle('Mi API E-Commerce')
    .setDescription(
      'Documentación de endpoints para clientes, productos, pedidos, etc.',
    )
    .setVersion('1.0')
    // .addTag('clientes')  // puedes agregar tags globales
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
