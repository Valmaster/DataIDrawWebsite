import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import {UserService} from "./user.service";
import * as bcryptjs from 'bcryptjs';
import {JwtService} from "@nestjs/jwt";
import {request, Request, Response} from "express";
import {TokenService} from "./token.service";
import {MoreThanOrEqual} from "typeorm";
import {EmailConfirmationService} from "../email/emailConfirmation.service";
import { Role } from './enums/roles.enum';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private tokenService: TokenService,
        private emailConfirmationService: EmailConfirmationService
    ) {
    }

    @Post('register')
    //@UseGuards(JwtAuthGuard, RolesGuard)
    async register(@Body() body: CreateUserDto) {
        console.log(body);
        const newUser = await this.userService.save({
            email: body.email,
            password: await bcryptjs.hash(body.password, 12),
            role: Role.USER
        })
        await this.emailConfirmationService.sendVerificationLink(body.email);

        delete newUser.password;

        return newUser
    }

    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
        @Res({passthrough: true}) response: Response
    ) {
        const user = await this.userService.findOne({email: email});

        if (!user) {
            throw new BadRequestException('invalid credentials');
        }

        if (!await bcryptjs.compare(password, user.password)) {
            throw new BadRequestException('invalid credentials');
        }

        const accessToken = await this.jwtService.signAsync({
            id: user.id,
            email: user.email,
            role: user.role,
        }, {expiresIn: '3000s'});

        /*        const refreshToken = await this.jwtService.signAsync({
                    id: user.id
                }, {expiresIn: '7d'})*/

        const refreshToken = await this.jwtService.signAsync({
            id: user.id
        },)

        const expired_at = new Date();
        expired_at.setDate(expired_at.getDate() + 7);

        await this.tokenService.save({
            user_id: user.id,
            token: refreshToken,
            expired_at
        })

        response.status(200);
        response.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 //1 Week
        });

        delete user.password;
        delete user.id;

        return {
            user: user,
            token: accessToken
        }
    }

    @Get('user')
    async user(
        @Req() request: Request
    ) {
        try {
            const accessToken = request.headers.authorization.replace('Bearer ', '');
            const {id} = await this.jwtService.verifyAsync(accessToken);

            const {password, ...data} = await this.userService.findOne({id});

            return data
        } catch (e) {
            throw new UnauthorizedException();
        }
    }

    @Post('refresh')
    async refresh(
        @Req() request: Request,
        @Res({passthrough: true}) response: Response
    ) {
        const refreshToken = request.cookies['refresh_token'];
        if (!refreshToken) throw new BadRequestException('refresh token not correct')

        const {id} = await this.jwtService.verifyAsync(refreshToken);

        const tokenEntity = await this.tokenService.findOne({
            user_id: id,
            expired_at: MoreThanOrEqual(new Date())
        });
        if (!tokenEntity) throw new UnauthorizedException();

        const accessToken = await this.jwtService.signAsync({id}, {expiresIn: '3000s'});

        response.status(200);
        return {
            token: accessToken
        }
    }

    @Post('logout')
    async logout(
        @Res({passthrough: true}) response: Response
    ) {
        await this.tokenService.delete({token: request.cookies['refresh_token']})

        response.clearCookie('refresh_token');

        return {
            message: 'success'
        }
    }
}
