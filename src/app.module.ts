import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TestModule } from './test/test.module';
import { Test } from './test/test.entity';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ResetModule } from './reset/reset.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { Reset } from './reset/reset.entity';
import { User } from './user/user.entity';
import { Token } from './user/token.entity';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // time to live in milliseconds
        limit: 10, // maximum number of requests within the ttl
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.number().required(),
        EMAIL_CONFIRMATION_URL: Joi.string().required(),
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        JWT_VERIFICATION_TOKEN_SECRET: Joi.string().required(),
        JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        APP_URL: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Test, User, Token, Reset],
        synchronize: true,
        ssl: {
          rejectUnauthorized: false, // You may need to set this to true in production with proper certificates
        },
      }),
      inject: [ConfigService],
    }),
    JwtModule,
    TestModule,
    UserModule,
    ResetModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
