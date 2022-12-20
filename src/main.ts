// const path = require('path'); // eslint-disable-line
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';
import fs from 'fs';
import path from 'path';

const keyPath = 'src/common/helpers/secrets/key.pem';
const cerPath = 'src/common/helpers/secrets/cert.pem';
const options: any = {};

if (fs.existsSync(keyPath) && fs.existsSync(cerPath)) {
  options.httpsOptions = {
    cert: fs.readFileSync(keyPath),
    key: fs.readFileSync(cerPath),
  };
}

async function bootstrap() {
  const prefix: string = 'api/v1';
  const port: number = parseInt(process.env.API_PORT_DEV, 10) || 3000;
  const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(cerPath),
  };
  const corsOptions: CorsOptions | CorsOptionsDelegate<any> | any = {
    origin: '*',
    'Access-Control-Allow-Origin': '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.enableCors(corsOptions);
  app.setGlobalPrefix(prefix);
  await app.listen(port);
}
bootstrap();
