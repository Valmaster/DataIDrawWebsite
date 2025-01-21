import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import RequestWithUser from "../../user/requestWithUser.interface";

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ) {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    if (!request.user?.email_confirmed_at) {
      throw new UnauthorizedException('Confirm your email first');
    }

    return true;
  }
}
