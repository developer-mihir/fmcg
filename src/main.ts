import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');

    // Validate request inputs from DTO files
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Swagger integration for api document
    const config = new DocumentBuilder()
        .setTitle('FMCG')
        .setDescription('The FMCG API')
        .setVersion('1.0')
        .addBearerAuth(
            {
                description: 'JWT Authorization',
                type: 'http',
                in: 'header',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
            'bearerAuth',
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/', app, document, {
        swaggerOptions: {
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
        },
    });

    app.enableCors();

    await app.listen(process.env.PORT);
}
bootstrap();
