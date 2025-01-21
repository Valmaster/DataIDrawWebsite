import {
    IsEmail,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from '@nestjs/class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message:
            'le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial.',
    })
    password: string;
}
