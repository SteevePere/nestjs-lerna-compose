import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import 'reflect-metadata';
import { AppModule } from './app.module';
import { TypeOrmConflictErrorInterceptor } from './core/interceptors/typeorm-conflict-error.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  app.setGlobalPrefix('/api');

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Perspective Test')
    .setDescription('Documentation for the Perspective Test REST API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    ignoreGlobalPrefix: false,
  });
  SwaggerModule.setup('swagger', app, document, {
    customSiteTitle: 'Swagger - Perspective',
  });

  // Global validation pipes setup
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  // Global interceptors setup
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new TypeOrmConflictErrorInterceptor(),
  );

  // Boilerplate stuff
  const rawBodyBuffer = (req, res, buffer, encoding) => {
    if (buffer && buffer.length) {
      req.rawBody = buffer.toString(encoding || 'utf8');
    }
  };

  app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
  app.use(bodyParser.json({ verify: rawBodyBuffer }));

  app.use(cookieParser());

  // CORS setup
  const configService = app.get(ConfigService);

  if (configService.get('security.cors')) {
    app.enableCors({
      origin: configService.get('security.cors'),
      credentials: true,
    });
  } else {
    app.enableCors();
  }

  // Rate limiter setup
  const rateLimitValue = configService.get('security.rateLimit');
  if (rateLimitValue && rateLimitValue != '-1') {
    app.use(
      rateLimit({
        windowMs: 1 * 60 * 1000,
        max: parseInt(rateLimitValue, 10),
      }),
    );
  }

  // Proxy setup
  const useProxy = (configService.get('security.proxy') || '').toLowerCase();

  if (useProxy === 'true' || useProxy === '1') {
    app.set('trust proxy', 1);
  }

  // Server setup
  const { host, port } = configService.get('server');

  await app.listen(port, host);
}

bootstrap();
