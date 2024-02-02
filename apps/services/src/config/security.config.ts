import { registerAs } from '@nestjs/config';

export const SecurityConfig = registerAs('security', () => ({
  cors: process.env.CORS && process.env.CORS.split(','),
  rateLimit: process.env.RATE_LIMIT,
}));
