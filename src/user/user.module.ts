import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {JwtModule} from "@nestjs/jwt";
import {TokenService} from "./token.service";
import {Token} from "./token.entity";
import {EmailConfirmationService} from "../email/emailConfirmation.service";
import {ConfigModule, ConfigService} from "@nestjs/config";
import EmailService from "../email/email.service";
import {EmailConfirmationController} from "../email/emailConfirmation.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Token]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}`,
                },
            }),
        }),
    ],
    controllers: [UserController, EmailConfirmationController],
    providers: [UserService, TokenService, EmailConfirmationService, EmailService]
})
export class UserModule {
}
