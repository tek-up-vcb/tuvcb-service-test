import { NestFactory } from '@nestjs/core';
import Consul from 'consul';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.PORT ?? '3000', 10);
  await app.listen(port);

  const consul = new Consul({
    host: process.env.CONSUL_HOST ?? 'localhost',
    port: Number(process.env.CONSUL_PORT ?? 8500),
  });

  const serviceName = process.env.SERVICE_NAME ?? 'service-test';
  const serviceHost = process.env.SERVICE_HOST ?? 'localhost';

try {
  await consul.agent.service.register({
    name: serviceName,
    id: serviceName,
    address: serviceHost,
    port,
    check: {
      name: `${serviceName}-health`,
      http: `http://${serviceHost}:${port}/health`,
      interval: '10s',
      timeout: '5s',
    },
  });
  console.log('Service registered with Consul');
} catch (err: unknown) {
  console.error('Error registering service with Consul:', err);
  process.exit(1);
}

}

bootstrap();
