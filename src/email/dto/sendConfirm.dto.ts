import { IsString, IsNotEmpty } from 'class-validator';

export class SendConfirmDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}

export default SendConfirmDto;
