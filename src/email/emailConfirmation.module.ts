
import {UserService} from "../user/user.service";
import {Module} from "@nestjs/common";
import {EmailConfirmationController} from "./emailConfirmation.controller";
import {EmailConfirmationService} from "./emailConfirmation.service";
import {ConfigService} from "@nestjs/config";
import {JwtModule, JwtService} from "@nestjs/jwt";
import EmailService from "./email.service";

@Module({
    imports: [
        JwtModule,
    ],
    controllers: [EmailConfirmationController],
    providers: [EmailConfirmationService, UserService, ConfigService, JwtService, EmailService]
})
export class EmailConfirmationModule {
}
