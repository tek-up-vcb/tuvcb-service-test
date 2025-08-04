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

  await new Promise<void>((resolve, reject) => {
    consul.agent.service.register(
      {
        name: serviceName,
        id: serviceName,
        address: serviceHost,
        port,
        check: {
          http: `http://${serviceHost}:${port}/health`,
          interval: '10s',
        },
      },
      (err: unknown) => {
        if (err) return reject(err);
        resolve();
      },
    );
  });
}
bootstrap();
