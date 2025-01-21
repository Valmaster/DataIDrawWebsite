import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './user.controller';
import { EmailConfirmationController } from '../email/emailConfirmation.controller';
import { UserService } from './user.service';
import { TokenService } from './token.service';
import { EmailConfirmationService } from '../email/emailConfirmation.service';
import EmailService from '../email/email.service';
import { User } from './user.entity';
import { Token } from './token.entity';

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
        TypeOrmModule.forFeature([User, Token]),
    ],
    controllers: [UserController, EmailConfirmationController],
    providers: [UserService, TokenService, EmailConfirmationService, EmailService]
})
export class UserModule {}
