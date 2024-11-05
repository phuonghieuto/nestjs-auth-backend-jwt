import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import BadRequestError from './exceptions/bad-request.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://nextjs-auth-frontend-jwt.vercel.app',
      'https://nextjs-auth-frontend-jwt-git-main-to-phng-hius-projects.vercel.app',
      'https://nextjs-auth-frontend-2muhbianb-to-phng-hius-projects.vercel.app'
    ],
    allowedHeaders: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    exceptionFactory: (errors) => {
      const messages = errors.reduce((acc, error) => {
        if (error.constraints) {
          acc.push(...Object.values(error.constraints));
        }
        return acc;
      }, []);
      return new BadRequestError(messages);
    }
  }));

  const config = new DocumentBuilder()
    .setTitle('Authentication')
    .setDescription('The authentication API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
  });
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();