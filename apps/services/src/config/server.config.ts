import { registerAs } from '@nestjs/config';

export const ServerConfig = registerAs('server', () => ({
  servername: process.env.SERVER_NAME,
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 8080,
}));
