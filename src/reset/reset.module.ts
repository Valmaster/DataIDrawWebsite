import {Module} from '@nestjs/common';
import {ResetService} from './reset.service';
import {ResetController} from './reset.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Reset} from "./reset.entity";
import {UserModule} from "../user/user.module";
import {UserService} from "../user/user.service";
import {User} from "../user/user.entity";
import EmailService from '../email/email.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Reset, User]),
    ],
    controllers: [ResetController],
    providers: [ResetService, UserService, EmailService]
})
export class ResetModule {
}
