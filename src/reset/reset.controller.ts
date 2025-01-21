import {
  Controller,
  Post,
  Body,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ResetService } from './reset.service';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import EmailService from '../email/email.service';
import { ConfigService } from '@nestjs/config';

@Controller('reset')
export class ResetController {
  constructor(
    private readonly resetService: ResetService,
    private readonly userService: UserService,
    private readonly mailerService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  @Post('forget')
  async forgot(@Body('email') email: string) {
    const token = Math.random().toString(20).substring(2, 12);

    await this.resetService.save({
      email,
      token,
    });

    const url = `${this.configService.get('APP_URL')}/reset-password/${token}`;
    const text = `Welcome to the application. To confirm the email address, click here: <a href='${url}'>${url}</a>`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Réinitialisation du mot de passe',
      html: text,
    });

    return {
      message: 'success',
    };
  }

  @Post()
  async reset(
    @Body('token') token: string,
    @Body('password') password: string,
    @Body('password_confirm') password_confirm: string,
  ) {
    if (password !== password_confirm) {
      throw new BadRequestException('Password do not match');
    }

    const reset = await this.resetService.findOne({ token });

    const user = await this.userService.findOne({ email: reset.email });

    if (!user) {
      throw new NotFoundException('User not found !');
    }

    await this.userService.update(user.id, {
      password: await bcrypt.hash(password, 12),
    });

    return {
      message: 'success',
    };
  }
}
