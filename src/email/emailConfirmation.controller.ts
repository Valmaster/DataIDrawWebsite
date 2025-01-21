import {
    Controller,
    Post,
    Body, Req, NotFoundException, BadRequestException,
} from '@nestjs/common';
import {EmailConfirmationService} from './emailConfirmation.service';
import EmailConfirmDto from './dto/emailConfirm.dto';
import RequestWithUser from "../user/requestWithUser.interface";
import {UserService} from "../user/user.service";
import SendConfirmDto from "./dto/sendConfirm.dto";

@Controller('email-confirmation')
export class EmailConfirmationController {
    constructor(
        private readonly emailConfirmationService: EmailConfirmationService,
        private readonly userService: UserService,
    ) {
    }

    @Post('confirm')
    async confirm(@Body() confirmationData: EmailConfirmDto) {
        const email = await this.emailConfirmationService.decodeConfirmationToken(confirmationData.token);
        await this.emailConfirmationService.confirmEmail(email);
        const user = await this.userService.getOneUser(email);
        if (!user) throw new NotFoundException('User logged not found');
        delete user.password;
        return user;
    }

    @Post('resend-confirmation-link')
    async resendConfirmationLink(@Req() request: RequestWithUser) {
        const user = await this.userService.getOneUser(request.user.email);
        if (!user) throw new NotFoundException('User with this email not found !');
        if (user.email_confirmed_at) {
            throw new BadRequestException('Email already confirmed');
        }
        await this.emailConfirmationService.resendConfirmationLink(user.email);
    }

    @Post('resend-confirmation-link-with-email')
    async resendConfirmationLinkWithEmail(@Body() confirmationDto: SendConfirmDto) {
        const user = await this.userService.getOneUser(confirmationDto.email);
        if (!user) throw new NotFoundException('User with this email not found !');
        if (user.email_confirmed_at) {
            throw new BadRequestException('Email already confirmed');
        }
        await this.emailConfirmationService.resendConfirmationLinkWithEmail(confirmationDto.email);
    }
}
