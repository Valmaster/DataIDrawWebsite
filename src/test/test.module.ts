import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { Test } from './test.entity';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('SECRET'),
                signOptions: { expiresIn: '1h' },
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([Test]),
    ],
    providers: [TestService],
    controllers: [TestController],
})
export class TestModule {}
