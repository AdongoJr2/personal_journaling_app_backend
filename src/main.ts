import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { APIResponseBodyDTO } from './core/types/api-response-body.dto';
import { APIListResponseBodyDTO } from './core/types/api-list-response-body.dto';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;

  const app = await NestFactory.create(AppModule);

  // setting global path prefix
  app.setGlobalPrefix('api/v1');

  // enable cors
  app.enableCors();

  // OpenAPI (Swagger) configuration
  const config = new DocumentBuilder()
    .setTitle('Personal Journaling App backend REST APIs')
    .setDescription(
      'REST API documentation for Personal Journaling App backend application',
    )
    .setVersion('0.0.1')
    .addTag('Personal Journaling App REST APIs')
    .addBearerAuth({
      type: 'http',
      description: 'Bearer token authorizarion',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [APIResponseBodyDTO, APIListResponseBodyDTO],
  });
  SwaggerModule.setup('api/v1/docs', app, document);

  await app.listen(PORT, () => {
    console.log(`Server Listening on PORT: ${PORT}`);
  });
}
bootstrap();
