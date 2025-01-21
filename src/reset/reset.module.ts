
import EmailService from '../email/email.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reset } from './reset.entity';
import { User } from '../user/user.entity';
import { ResetController } from './reset.controller';
import { ResetService } from './reset.service';
import { UserService } from '../user/user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Reset, User]),
    ],
    controllers: [ResetController],
    providers: [ResetService, UserService, EmailService]
})
export class ResetModule {
}
