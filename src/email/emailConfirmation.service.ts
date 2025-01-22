import { JwtService } from '@nestjs/jwt';
import { BadRequestException, Injectable } from '@nestjs/common';
import VerificationTokenPayload from './verificationTokenPayload.interface';
import { ConfigService } from '@nestjs/config';
import EmailService from './email.service';
import { UserService } from '../user/user.service';
import Email from './template';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly usersService: UserService,
  ) {}

  public sendVerificationLink(email: string) {
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME')}s`,
    });

    const url = `${this.configService.get('APP_URL')}/register/confirmation/${token}`;

    //const text = `Welcome to the application. To confirm the email address, click here: <a href='${url}'>${url}</a>`;

    return this.emailService.sendMail({
      email: email,
      subject: 'Email confirmation',
      template: Email({ url: url }),
    });
  }

  public async confirmEmail(email: string) {
    const user = await this.usersService.getOneUser(email);
    if (user.email_confirmed_at) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.usersService.update(user.id, { email_confirmed_at: new Date() });
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });
      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  public async resendConfirmationLink(email: string) {
    await this.sendVerificationLink(email);
  }

  public async resendConfirmationLinkWithEmail(email: string) {
    await this.sendVerificationLink(email);
  }
}
