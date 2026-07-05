import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import * as fs from 'fs';
import { join } from 'path';

const server = express();
let isAppInitialized = false;

export const bootstrap = async (expressInstance: express.Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
    { bufferLogs: true },
  );

  // Use Pino Logger
  app.useLogger(app.get(Logger));

  // Serve static assets from uploads directory (fallback)
  const uploadsDir = join(process.cwd(), 'uploads');
  if (fs.existsSync(uploadsDir)) {
    app.use('/uploads', express.static(uploadsDir));
  }

  // Prefix /api/v1
  app.setGlobalPrefix('api/v1');

  // Enable CORS
  const frontendUrl = process.env.FRONTEND_URL;
  const allowedOrigins = frontendUrl
    ? frontendUrl.split(',').map((url) =>
        url
          .trim()
          .replace(/^['"]|['"]$/g, '')
          .replace(/\/$/, ''),
      )
    : [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://jagobisnis.vercel.app',
        'https://www.jago-bisnis.my.id',
        'https://jago-bisnis.my.id',
      ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      const isAllowed = allowedOrigins.includes(origin);
      if (isAllowed || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders:
      'Content-Type,Accept,Authorization,X-Requested-With,bypass-tunnel-reminder,Bypass-Tunnel-Reminder',
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('JagoBisnis API')
    .setDescription('The JagoBisnis MVP API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui-standalone-preset.min.js',
    ],
  });

  await app.init();
};

export default async (req: any, res: any) => {
  if (!isAppInitialized) {
    await bootstrap(server);
    isAppInitialized = true;
  }
  server(req, res);
};
