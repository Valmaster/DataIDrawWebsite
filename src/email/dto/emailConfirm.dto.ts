import { IsString, IsNotEmpty } from 'class-validator';

export class EmailConfirmDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export default EmailConfirmDto;
