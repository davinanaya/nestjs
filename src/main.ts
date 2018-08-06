import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

declare const module: any;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const hostDomain = AppModule.isDev ? `${AppModule.host}:${AppModule.port}`: AppModule.host;
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Nest learning')
    .setDescription('API Doc')
    .setVersion('1.0.0')
    .setHost(hostDomain.split('//')[1])
    .setSchemes(AppModule.isDev ? 'http' : 'https')
    .setBasePath('/api')
    .addBearerAuth('Authorization', 'header')
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerOptions);

  app.use('/api/docs/swagger.json', (req, res) => {
    res.send(swaggerDoc);
  });

  SwaggerModule.setup('/api/docs', app, null, {
    swaggerUrl: `${hostDomain}/api/docs/swagger.json`,
    explorer:true,
    swaggerOptions: {
      docExpansion: 'list',
      filter:true,
      showRequestDuration: true
    }
  })

  if(module.hot){
    module.hot.accept();
    module.hot.dispose( () => app.close());
  }

  await app.listen(AppModule.port);
}
bootstrap();